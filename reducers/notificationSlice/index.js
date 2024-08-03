import { createSlice } from "@reduxjs/toolkit";

import { SUCCESS, FAILED, PENDING, IDLE } from "../constants";

const initialState = {
  getAllNotifications: [],
  getAllNotificationsStatus: IDLE,
  eventsNotifications: [],
  eventParticipationStatus: IDLE,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    getAllNotifications: (state) => {
      state.getAllNotificationsStatus = SUCCESS;
    },
    getAllNotificationsLoading: (state) => {
      state.getAllNotificationsStatus = PENDING;
    },
    getAllNotificationsError: (state) => {
      state.getAllNotificationsStatus = FAILED;
    },
    defaultGetAllNotifications: (state) => {
      state.getAllNotifications = [];
      state.getAllNotificationsStatus = IDLE;
    },
    groupChatNotifications: (state, action) => {
      state.groupChatNotifications = {
        ...action.payload.groupChatNotifications,
      };
    },
    storeEventNotifications: (state, action) => {
      state.eventsNotifications = [...action.payload.eventNotifications];
      state.notificationEventObject = {
        ...action.payload.notificationEventObject,
      };
    },
    saveRecentEventNotification: (state, action) => {
      const event = action.payload.event;
      state.eventsNotifications = [
        ...action.payload.eventNotification,
        ...state.eventsNotifications,
      ];
      if (!state.notificationEventObject?.[event.id]) {
        state.notificationEventObject[event.id] = event;
      }
    },
    recentGroupChatNotification: (state, action) => {
      if (
        state.groupChatNotifications?.[
          action.payload.notification.notificationTypeId
        ]
      ) {
        state.groupChatNotifications[
          action.payload.notification.notificationTypeId
        ] = {
          message: action.payload.notification.message,
          length:
            state.groupChatNotifications[
              action.payload.notification.notificationTypeId
            ].length + 1,
        };
      } else {
        state.groupChatNotifications[
          action.payload.notification.notificationTypeId
        ] = {
          message: action.payload.notification.message,
          length: 1,
        };
      }
    },
    defaultParicipationStatus: (state) => {
      state.eventParticipationStatus = IDLE;
    },
    participationStatusSuccess: (state) => {
      state.eventParticipationStatus = SUCCESS;
    },
    changeParticipationStatus: (state) => {
      state.eventParticipationStatus = PENDING;
    },
  },
});
export const {
  defaultParicipationStatus,
  getAllNotifications,
  participationStatusSuccess,
  getAllNotificationsLoading,
  getAllNotificationsError,
  changeParticipationStatus,
  saveRecentEventNotification,
  storeEventNotifications,
  defaultGetAllNotifications,
  recentGroupChatNotification,
  groupChatNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
