import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SUCCESS, FAILED, PENDING, IDLE } from "../constants";

export const initiateSignUpClient = createAsyncThunk(
  "signUp/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/initiateSignup/client", data);
      return response?.payload?.data;
    } catch (err) {
      1;
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const finalSignUpClient = createAsyncThunk(
  "finalSignUp/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/finalSignup/client", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const initiateSignUpOrganizer = createAsyncThunk(
  "signUp/organizer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/initiateSignup/organizer", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);
export const finalSignUpOrganizer = createAsyncThunk(
  "finalSignUp/organizer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/finalSignup/organizer", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginClient = createAsyncThunk(
  "login/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/login/client", data);
      apiSlice.defaults.headers.common["Authorization"] =
        response?.data?.token?.accessToken;
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginOrganizer = createAsyncThunk(
  "login/organizer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/login/organizer", data);
      apiSlice.defaults.headers.common["Authorization"] =
        response?.data?.token?.accessToken;
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post(`/forgotPassword`, data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const storeUser = createAsyncThunk(
  "storeUser",
  async (data, { rejectWithValue }) => {
    try {
      if (data.remove) {
        await AsyncStorage.removeItem("token");
        return { remove: true };
      }
      const token = await AsyncStorage.setItem("token", JSON.stringify(data));
      return token;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const retrieveUser = createAsyncThunk(
  "retrieve",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        return JSON.parse(token);
      }
      return null;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "getUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/getUser", data);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyPassword = createAsyncThunk(
  "verifyPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post(`/verifyOtp`, data);
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "refreshToken",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post(`/refreshToken`, data);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          id: response.data.id,
          type: response.data.type,
        })
      );

      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      await AsyncStorage.removeItem("token");
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  initiateSignUpStatus: IDLE,
  initiateSignUpStatusError: "",
  finalSignUpStatus: IDLE,
  finalSignUpStatusError: "",
  loginStatus: IDLE,
  loginStatusError: "",
  user: null,
  forgotPasswordStatus: IDLE,
  forgotPasswordError: "",
  logOutStatus: IDLE,
  verifyPasswordStatus: IDLE,
  verifyPasswordError: "",
  token: null,
  tokenStatus: IDLE,
  getUserStatus: IDLE,
  getUserStatusError: "",
  tokenError: "",
  otp: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    defaultInitiateSignupStatus: (state) => {
      state.initiateSignUpStatus = IDLE;
      state.initiateSignUpStatusError = "";
    },
    defaultLocalStorage: (state) => {
      state.user = null;
      state.token = null;
      state.storedUser = null;
    },
    defaultFinalSignupStatus: (state) => {
      state.finalSignUpStatus = IDLE;
      state.finalSignUpStatusError = "";
    },
    defaultLoginStatus: (state) => {
      state.loginStatus = IDLE;
      state.loginStatusError = "";
    },
    defaultLogOutStatus: (state) => {
      state.logOutStatus = IDLE;
    },
    defaultForgotPasswordStatus: (state) => {
      state.forgotPasswordStatus = IDLE;
      state.forgotPasswordError = "";
    },
    defaultVerifyPassword: (state) => {
      state.verifyPasswordStatus = IDLE;
      state.verifyPasswordError = "";
    },
    defaultToken: (state) => {
      state.storedUser = null;
      state.storedUserError = "";
      state.storedUserStatus = IDLE;
    },
    defaultGetUser: (state) => {
      state.getUserStatus = IDLE;
      state.getUserStatusError = "";
    },
    updateProfilePic: (state, action) => {
      state.user = { ...state.user, src: action.payload.src };
    },
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initiateSignUpClient.pending, (state) => {
      state.initiateSignUpStatus = PENDING;
    });
    builder.addCase(initiateSignUpClient.rejected, (state, action) => {
      const { payload } = action;
      state.initiateSignUpStatus = FAILED;
      state.initiateSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(initiateSignUpClient.fulfilled, (state, action) => {
      state.initiateSignUpStatus = SUCCESS;
    });
    builder.addCase(initiateSignUpOrganizer.fulfilled, (state, action) => {
      state.initiateSignUpStatus = SUCCESS;
    });
    builder.addCase(initiateSignUpOrganizer.pending, (state) => {
      state.initiateSignUpStatus = PENDING;
    });
    builder.addCase(initiateSignUpOrganizer.rejected, (state, action) => {
      const { payload } = action;
      state.initiateSignUpStatus = FAILED;
      state.initiateSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });

    builder.addCase(finalSignUpClient.pending, (state) => {
      state.finalSignUpStatus = PENDING;
    });
    builder.addCase(finalSignUpClient.rejected, (state, action) => {
      const { payload } = action;
      state.finalSignUpStatus = FAILED;
      state.finalSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(finalSignUpClient.fulfilled, (state, action) => {
      state.finalSignUpStatus = SUCCESS;
    });
    builder.addCase(finalSignUpOrganizer.fulfilled, (state, action) => {
      state.finalSignUpStatus = SUCCESS;
    });
    builder.addCase(finalSignUpOrganizer.pending, (state) => {
      state.finalSignUpStatus = PENDING;
    });
    builder.addCase(finalSignUpOrganizer.rejected, (state, action) => {
      const { payload } = action;
      state.finalSignUpStatus = FAILED;
      state.finalSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });

    builder.addCase(loginClient.fulfilled, (state, action) => {
      state.loginStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(loginClient.pending, (state) => {
      state.loginStatus = PENDING;
    });
    builder.addCase(loginClient.rejected, (state, action) => {
      const { payload } = action;
      state.loginStatus = FAILED;
      state.loginStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(loginOrganizer.fulfilled, (state, action) => {
      state.loginStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(loginOrganizer.pending, (state) => {
      state.loginStatus = PENDING;
    });
    builder.addCase(loginOrganizer.rejected, (state, action) => {
      const { payload } = action;
      state.loginStatus = FAILED;
      state.loginStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.forgotPasswordStatus = SUCCESS;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.forgotPasswordStatus = PENDING;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      const { payload } = action;
      state.forgotPasswordStatus = FAILED;
      state.forgotPasswordError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(verifyPassword.fulfilled, (state, action) => {
      state.verifyPasswordStatus = SUCCESS;
      state.user = action.payload;
      apiSlice.defaults.headers.common["Authorization"] =
        action.payload.token.accessToken;
    });
    builder.addCase(verifyPassword.pending, (state) => {
      state.verifyPasswordStatus = PENDING;
    });
    builder.addCase(verifyPassword.rejected, (state, action) => {
      const { payload } = action;
      state.verifyPasswordStatus = FAILED;
      state.verifyPasswordError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(storeUser.fulfilled, (state, action) => {
      state.storedUserStatus = SUCCESS;
      if (action.payload?.remove) {
        state.storedUser = null;
      }
    });
    builder.addCase(storeUser.pending, (state) => {
      state.storedUserStatus = PENDING;
    });
    builder.addCase(storeUser.rejected, (state, action) => {
      state.storedUserStatus = FAILED;
      state.storedUserError = "Some Error Occured!";
    });
    builder.addCase(retrieveUser.fulfilled, (state, action) => {
      state.storedUserStatus = SUCCESS;
      state.storedUser = action.payload;
    });
    builder.addCase(retrieveUser.pending, (state) => {
      state.storedUserStatus = PENDING;
    });
    builder.addCase(retrieveUser.rejected, (state, action) => {
      state.storedUserStatus = FAILED;
      state.storedUserError = "Some Error Occured!";
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.getUserStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(getUser.pending, (state) => {
      state.getUserStatus = PENDING;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.getUserStatus = FAILED;
      state.getUserStatusError = "Some Error Occured!";
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      apiSlice.defaults.headers.common["Authorization"] =
        action.payload.token.accessToken;
      state.tokenStatus = SUCCESS;
      state.user = action.payload;
    });
    builder.addCase(refreshToken.pending, (state) => {
      state.tokenStatus = PENDING;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.tokenStatus = FAILED;
    });
  },
});
export const {
  setAuth,
  defaultInitiateSignupStatus,
  defaultFinalSignupStatus,
  defaultForgotPasswordStatus,
  updateProfilePic,
  defaultVerifyPassword,
  defaultLogOutStatus,
  defaultLoginStatus,
  defaultLocalStorage,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
