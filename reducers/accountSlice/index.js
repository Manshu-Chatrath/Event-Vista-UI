import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import axios from "axios";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constants";

export const convertImage = async (src) => {
  try {
    const response = await fetch(src);
    const base64Data = await response.text();
    const contentType = response.headers.map["content-type"];
    return `data:${contentType};base64,${base64Data}`;
  } catch (e) {
    return;
  }
};

export const imageUpload = createAsyncThunk(
  "imageUpload",
  async (data, { rejectWithValue }) => {
    try {
      const uploadConfig = await apiSlice.get(
        `/getImageUrl/upload?type=${data.type}&id=${data.id}`
      );

      await axios.put(uploadConfig.data.url, data.image, {
        headers: {
          "Content-Type": data.imageType,
        },
      });

      const response = await apiSlice.post(`/image/upload`, {
        url: uploadConfig.data.imageKey,
        id: data.id,
        type: data.type,
      });

      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAuthenticatedUser = createAsyncThunk(
  "getAuthenticatedUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get("/account/getUser");
      let src = null;
      if (response?.data?.src) {
        src = await convertImage(response?.data?.src);
      }

      return { ...response.data, src: src };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const editUser = createAsyncThunk(
  "editUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.patch("/editUser", data);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  imageUploadStatus: IDLE,
  imageUploadStatusError: "",
  getAuthenticatedUserStatus: IDLE,
  editUserStatus: IDLE,
  src: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    defaultImageUploadStatus: (state) => {
      state.imageUploadStatus = IDLE;
      state.imageUploadStatusError = "";
      state.src = null;
    },
    defaultInitialState: (state) => {
      state.src = null;
    },
    defaultAuthenticatedUser: (state) => {
      state.getAuthenticatedUserStatus = IDLE;
    },
    defaultEditUserStatus: (state) => {
      editUserStatus = IDLE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(imageUpload.pending, (state) => {
      state.imageAssignedUrlStatus = PENDING;
    });
    builder.addCase(imageUpload.rejected, (state, action) => {
      const { payload } = action;
      state.imageUploadStatus = FAILED;
      state.imageUploadStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(imageUpload.fulfilled, (state, action) => {
      state.imageUploadStatus = SUCCESS;
      state.src = action.payload;
    });
    builder.addCase(getAuthenticatedUser.fulfilled, (state, action) => {
      state.getAuthenticatedUserStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(getAuthenticatedUser.pending, (state) => {
      state.getAuthenticatedUserStatus = PENDING;
    });
    builder.addCase(getAuthenticatedUser.rejected, (state) => {
      state.getAuthenticatedUserStatus = FAILED;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.editUserStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(editUser.pending, (state) => {
      state.editUserStatus = PENDING;
    });
    builder.addCase(editUser.rejected, (state) => {
      state.editUserStatus = FAILED;
    });
  },
});
export const {
  defaultImageUploadStatus,
  defaultEditUserStatus,
  defaultAuthenticatedUser,
} = accountSlice.actions;
export default accountSlice.reducer;
