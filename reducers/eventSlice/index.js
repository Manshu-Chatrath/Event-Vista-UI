import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constants";
import { convertImage } from "../accountSlice";
export const createEvent = createAsyncThunk(
  "createEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/createEvent", data);
      return response.data.eventId;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getPersonalisedEvents = createAsyncThunk(
  "event/getPersonalisedEvents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/client/personalizedEvents/?count=${data.count}&index=${data.index}&search=${data.search}&filter=${data.filter}`
      );

      const events = await Promise.all(
        response.data.events.map(async (event) => {
          event.src = await convertImage(event.src);
          return event;
        })
      );

      return { events, totalLength: response.data.totalLength };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOrganizerEvents = createAsyncThunk(
  "event/getOrganizersEvents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/getOrganizersEvents/?count=${data.count}&index=${data.index}&filter=${data.filter}&search=${data.search}`
      );

      const events = await Promise.all(
        response.data.events.map(async (event) => {
          event.src = await convertImage(event.src);
          return event;
        })
      );

      return { events, totalLength: response.data.totalLength };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllEvents = createAsyncThunk(
  "event/getEvents",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/client/allEvents/?count=${data.count}&index=${data.index}&search=${data.search}&latitude=${data.location.latitude}&longitude=${data.location.longitude}`
      );
      const events = await Promise.all(
        response.data.events.map(async (event) => {
          event.src = await convertImage(event.src);
          return event;
        })
      );
      return { events, totalLength: response.data.totalLength };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMoreMessages = createAsyncThunk(
  "fetchMoreMessages",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/fetchMoreMessages?index=${data.index}&count=${data.count}&eventChatId=${data.eventChatId}`
      );
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getEvent = createAsyncThunk(
  "event/getEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(`/getEvent/${data}`);
      const event = { ...response.data.event };
      event.src = await convertImage(event.src);
      event.organizer.src = await convertImage(event.organizer.src);
      await Promise.all(
        event.clients.map(async (e) => {
          e.src = await convertImage(e.src);
          return e;
        })
      );
      return { selectedEvent: event };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const imageExtractText = createAsyncThunk(
  "extractText",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/extractText/image", data);
      return response.data.imageTextObj;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  createEventStatus: IDLE,
  getEventsStatus: IDLE,
  totalPersonalisedEvents: 0,
  cancelEventStatus: IDLE,
  eventGroupChatList: [],
  selectedEvent: null,
  selectedEventStatus: IDLE,
  getEventsError: null,
  events: [],
  personalisedEvents: [],
  personalisedEventsStatus: IDLE,
  createEventStatusError: null,
  recentGroupChat: null,
  totalEventGroupChatLength: 0,
  getEventGroupChatListStatus: IDLE,
  createdEventId: null,
  imageExtractTextStatus: IDLE,
  selectedEventId: null,
  imageExtractTextError: null,
  eventMessages: {},
  chatBoxOpened: false,
  totalEvents: 0,
  imageTextObj: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    chatBoxOpened: (state) => {
      state.chatBoxOpened = true;
    },
    chatBoxClosed: (state) => {
      state.chatBoxOpened = false;
    },
    defaultImageExtractStatus: (state) => {
      state.imageExtractTextStatus = IDLE;
      state.imageExtractTextError = null;
    },
    defaultCreateEventStatus: (state) => {
      state.createEventStatus = IDLE;
      state.createEventStatusError = null;
    },
    defaultGetEventsStatus: (state) => {
      state.getEventsStatus = IDLE;
      state.getEventsError = null;
      state.events = [];
    },
    defaultRecentGroupChat: (state) => {
      state.recentGroupChat = null;
    },
    defaultGetEventStatus: (state) => {
      state.selectedEventStatus = IDLE;
      state.selectedEvent = null;
    },
    defaultGetPersonaliasedEventsStatus: (state) => {
      state.personalisedEventsStatus = IDLE;
      state.personalisedEvents = [];
      state.totalPersonalisedEvents = 0;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEventId = action.payload;
    },
    defaultCancelEventStatus: (state) => {
      state.cancelEventStatus = IDLE;
    },
    defaultMessages: (state) => {
      state.messages = [];
    },
    setNotifications: (state, action) => {
      state.notifications = { ...action.payload };
    },
    recentNotification: (state, action) => {
      if (Object.keys(state.notifications).length !== 0) {
        if (state.notifications?.[action.payload.sentBy]) {
          state.notifications[action.payload.sentBy].notifications++;
        }
      } else {
        state.notifications[action.payload.sentBy] = { ...action.payload };
      }
    },

    getEventGroupChatList: (state, action) => {
      state.getEventGroupChatListStatus = SUCCESS;
      const { eventGroupChatList = [], totalLength } = action.payload;
      state.eventGroupChatList =
        Array.isArray(eventGroupChatList) === false
          ? []
          : [...eventGroupChatList];
      state.totalEventGroupChatLength = totalLength;
    },
    getEventGroupChatListLoading: (state) => {
      state.getEventGroupChatListStatus = PENDING;
    },
    getEventGroupChatListError: (state) => {
      state.getEventGroupChatListStatus = FAILED;
    },
    saveEventMessages: (state, action) => {
      state.eventMessages = { ...state.eventMessages, ...action.payload };
    },
    emptySaveEventMessages: (state) => {
      state.eventMessages = {};
    },
    recentEventMessage: (state, action) => {
      if (state.eventMessages?.[action.payload.eventChatId]) {
        if (state.chatBoxOpened) {
          state.eventMessages[action.payload.eventChatId] = [
            { ...action.payload.message },
          ];
        } else {
          state.eventMessages[action.payload.eventChatId] =
            action.payload.messages;
        }
      } else {
        state.eventMessages[action.payload.eventChatId] =
          action.payload.messages;
      }
      state.recentGroupChat = action.payload.eventGroupChat;
    },

    totalNumberOfMessages: (state, action) => {
      state.totalNumberOfMessages = action.payload;
    },
    defaultGetEventGroupChatList: (state) => {
      state.eventGroupChatList = [];
      state.getEventGroupChatListStatus = IDLE;
      state.totalEventGroupChatLength = 0;
    },
    moreMessagingLoadingComplete: (state) => {
      state.moreMessagesLoadingStatus = SUCCESS;
    },
    moreMessagingLoading: (state) => {
      state.moreMessagesLoadingStatus = PENDING;
    },
    initiateCancelEventStatus: (state) => {
      state.cancelEventStatus = PENDING;
    },
    finishedCancelEventStatus: (state) => {
      state.cancelEventStatus = SUCCESS;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.createEventStatus = SUCCESS;
      state.createdEventId = action.payload;
    });
    builder.addCase(createEvent.pending, (state) => {
      state.createEventStatus = PENDING;
    });
    builder.addCase(createEvent.rejected, (state, action) => {
      const { payload } = action;
      state.createEventStatus = FAILED;
      state.createEventStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });

    builder.addCase(getEvent.fulfilled, (state, action) => {
      state.selectedEventStatus = SUCCESS;
      state.selectedEvent = action.payload.selectedEvent;
    });
    builder.addCase(getOrganizerEvents.pending, (state) => {
      state.getEventsStatus = PENDING;
    });
    builder.addCase(getOrganizerEvents.rejected, (state) => {
      state.getEventsStatus = FAILED;
    });
    builder.addCase(fetchMoreMessages.fulfilled, (state, action) => {
      if (state.eventMessages?.[action.payload.eventChatId]) {
        state.eventMessages[action.payload.eventChatId] = [
          ...action.payload.message,
        ];
      }
    });
    builder.addCase(fetchMoreMessages.pending, (state) => {
      state.getEventsStatus = PENDING;
    });
    builder.addCase(fetchMoreMessages.rejected, (state) => {
      state.getEventsStatus = FAILED;
    });
    builder.addCase(getOrganizerEvents.fulfilled, (state, action) => {
      state.getEventsStatus = SUCCESS;
      state.events = [...action.payload.events];
      state.totalLength = action.payload.totalLength;
    });
    builder.addCase(getAllEvents.pending, (state) => {
      state.getEventsStatus = PENDING;
    });
    builder.addCase(getAllEvents.rejected, (state) => {
      state.getEventsStatus = FAILED;
    });
    builder.addCase(getAllEvents.fulfilled, (state, action) => {
      state.getEventsStatus = SUCCESS;
      state.events = [...action.payload.events];
      state.totalEvents = action.payload.totalLength;
    });
    builder.addCase(getPersonalisedEvents.pending, (state) => {
      state.personalisedEventsStatus = PENDING;
    });
    builder.addCase(getPersonalisedEvents.rejected, (state) => {
      state.personalisedEventsStatus = FAILED;
    });
    builder.addCase(getPersonalisedEvents.fulfilled, (state, action) => {
      state.personalisedEventsStatus = SUCCESS;
      state.personalisedEvents = [...action.payload.events];
      state.totalPersonalisedEvents = action.payload.totalLength;
    });
    builder.addCase(getEvent.pending, (state) => {
      state.selectedEventStatus = PENDING;
    });
    builder.addCase(getEvent.rejected, (state) => {
      state.selectedEventStatus = FAILED;
    });
    builder.addCase(imageExtractText.fulfilled, (state, action) => {
      state.imageExtractTextStatus = SUCCESS;
      state.imageTextObj = action.payload;
    });
    builder.addCase(imageExtractText.pending, (state) => {
      state.imageExtractTextStatus = PENDING;
    });
    builder.addCase(imageExtractText.rejected, (state, action) => {
      const { payload } = action;
      state.imageExtractTextStatus = FAILED;
      state.imageExtractTextError = payload?.error
        ? payload.error
        : payload?.message;
    });
  },
});
export const {
  defaultCreateEventStatus,
  setSelectedEvent,
  moreMessagingLoadingComplete,
  moreMessagingLoading,
  emptySaveEventMessages,
  totalNumberOfMessages,
  defaultImageExtractStatus,
  getEventGroupChatList,
  getEventGroupChatListLoading,
  defaultGetEventGroupChatList,
  initiateCancelEventStatus,
  finishedCancelEventStatus,
  defaultRecentGroupChat,
  getEventGroupChatListError,
  defaultGetEventStatus,
  chatBoxOpened,
  chatBoxClosed,
  saveEventMessages,
  getEvents,
  getEventsError,
  recentEventMessage,
  getEventsLoading,
  defaultGetEventsStatus,
  defaultGetPersonaliasedEventsStatus,
  defaultCancelEventStatus,
} = eventSlice.actions;
export default eventSlice.reducer;
