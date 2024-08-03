import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import accountSlice from "./accountSlice";
import userSlice from "./userSlice";
import eventSlice from "./eventSlice";
import notificationSlice from "./notificationSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    account: accountSlice,
    user: userSlice,
    events: eventSlice,
    notifications: notificationSlice,
  },
});
