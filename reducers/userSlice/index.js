import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

import { SUCCESS, FAILED, PENDING, IDLE } from "../constants";

export const initiateSignUpClient = createAsyncThunk(
  "signUp/client",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/initiateSignup/client", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  uploadImageStatus: IDLE,
  uploadImageStatusError: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    defaultInitiateSignupStatus: (state) => {
      state.initiateSignUpStatus = IDLE;
      state.initiateSignUpStatusError = "";
    },
    defaultFinalSignupStatus: (state) => {
      state.finalSignUpStatus = IDLE;
      state.finalSignUpStatusError = "";
    },
    defaultLoginStatus: (state) => {
      state.loginStatus = IDLE;
      state.loginStatusError = "";
    },
    defaultForgotPasswordStatus: (state) => {
      state.forgotPasswordStatus = IDLE;
      state.forgotPasswordError = "";
    },
    defaultVerifyPassword: (state) => {
      state.verifyPasswordStatus = IDLE;
      state.verifyPasswordError = "";
    },

    defaultGetUser: (state) => {
      state.getUserStatus = IDLE;
      state.getUserStatusError = "";
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
  },
});
export const {
  setAuth,
  defaultInitiateSignupStatus,
  defaultFinalSignupStatus,
  defaultForgotPasswordStatus,
  defaultVerifyPassword,
  defaultLoginStatus,
} = authSlice.actions;
export default authSlice.reducer;
