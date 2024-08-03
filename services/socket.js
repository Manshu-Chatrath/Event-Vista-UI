import { store } from "../reducers/index";
import {
  getEventGroupChatList,
  getEventGroupChatListError,
  finishedCancelEventStatus,
  totalNumberOfMessages,
  recentEventMessage,
  saveEventMessages,
  moreMessagingLoading,
} from "../reducers/eventSlice";

import {
  saveRecentEventNotification,
  participationStatusSuccess,
  groupChatNotifications,
  recentGroupChatNotification,
  storeEventNotifications,
  getAllNotifications,
  getAllNotificationsLoading,
} from "../reducers/notificationSlice";
import { convertImage } from "../reducers/accountSlice";
class Socket {
  constructor(url, userId, type) {
    this.url = url;
    this.socket = new WebSocket(url);
    this.userId = userId;
    this.type = type;
    this.socket.onmessage = async (event) => {
      const obj = JSON.parse(event.data);
      const { type, requestType } = obj;
      if (requestType === "getAllNotifications") {
        let obj2 = {};
        const eventGroupChatNotifications = obj.notifications.filter(
          (notification) => notification.notificationType === "eventChat"
        );

        const eventNotifications = obj.notifications.filter(
          (notification) => notification.notificationType === "event"
        );

        let notificationEventObject = {};
        if (eventNotifications.length > 0) {
          await Promise.all(
            obj.events?.map(async (event) => {
              const src = await convertImage(event.src);
              notificationEventObject[event.id] = {
                src: src,
                eventId: event.id,
                title: event.title,
              };
            })
          );
        }
        if (eventGroupChatNotifications.length > 0) {
          eventGroupChatNotifications.forEach((notification) => {
            if (obj2?.[notification.notificationTypeId]) {
              obj2[notification.notificationTypeId] = {
                length: obj2[notification.notificationTypeId].length + 1,
                message: notification.message,
                id: notification.notificationTypeId,
              };
            } else {
              obj2[notification.notificationTypeId] = {
                length: 1,
                id: notification.notificationTypeId,
                message: notification.message,
                id: notification.notificationTypeId,
              };
            }
          });
        }

        store.dispatch(
          groupChatNotifications({
            groupChatNotifications: { ...obj2 },
          })
        );

        store.dispatch(
          storeEventNotifications({
            eventNotifications,
            notificationEventObject,
          })
        );

        store.dispatch(getAllNotifications());
      }
      if (requestType === "cancelComingToEvent") {
        store.dispatch(participationStatusSuccess());
      }

      if (requestType === "recentMessage") {
        const src = await convertImage(obj.eventGroupChat.src);
        const eventGroupChat = {
          eventId: obj.eventGroupChat.id,
          src: src,
          title: obj.eventGroupChat.title,
          id: obj.eventGroupChat.eventChat.id,
        };

        store.dispatch(
          recentEventMessage({
            message: obj.message,
            eventChatId: obj.eventChatId,
            eventGroupChat: eventGroupChat,
            messages: obj.eventChatMessages,
          })
        );
      }
      if (requestType === "totalNumberOfMessages") {
        store.dispatch(totalNumberOfMessages(obj.totalLength));
      }
      if (requestType === "recentNotification") {
        if (obj.notification.notificationType === "eventChat") {
          store.dispatch(
            recentGroupChatNotification({ notification: obj.notification })
          );
        }

        if (obj.requestMessage === "joinedEvent") {
          store.dispatch(participationStatusSuccess());
        }
        if (obj.requestMessage === "cancelEvent") {
          store.dispatch(finishedCancelEventStatus());
        }
        if (obj.notification.notificationType === "event") {
          let event = { ...obj.event };
          let src = await convertImage(event.src);
          store.dispatch(
            saveRecentEventNotification({
              eventNotification: [obj.notification],
              event: { ...event, src },
            })
          );
        }
      }

      if (requestType === "fetchEventGroupChatList") {
        if (type === "success") {
          try {
            let messageObject = {};
            let eventGroupChatList = {};
            if (obj.eventGroupChats.length > 0) {
              eventGroupChatList = await Promise.all(
                obj.eventGroupChats.map(async (event) => {
                  const src = await convertImage(event.src);
                  return {
                    src: src,
                    eventId: event.id,
                    title: event.title,
                    id: event.eventChat?.id,
                  };
                })
              );
            }
            if (obj.eventChatMessages.length > 0) {
              obj.eventChatMessages.forEach((message) => {
                if (messageObject?.[message.eventChatId]) {
                  messageObject[message.eventChatId].push(message);
                } else {
                  messageObject[message.eventChatId] = [message];
                }
              });
            }

            store.dispatch(saveEventMessages(messageObject));
            store.dispatch(
              getEventGroupChatList({
                eventGroupChatList: eventGroupChatList,
                totalLength: obj.totalLength,
              })
            );
          } catch (e) {
            console.log("Error", e);
          }
        } else {
          store.dispatch(getEventGroupChatListError());
        }
      }
    };

    this.socket.onerror = (error) => {
      console.log("So error is ", error);
      setTimeout(() => {
        createWebSocketService(this.url, this.userId, this.type);
      }, 5000);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.socket.onopen = () => {
      console.log("WebSocket connection opened");
    };
  }
  validObject(obj) {
    return JSON.stringify(obj);
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  joinEvent(eventId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "joinEvent",
      eventId,
    });
    this.sendMessage(obj);
  }

  removeMember(memberId, eventId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "removeMember",
      memberId,
      eventId,
    });
    this.sendMessage(obj);
  }

  cancelEvent(eventId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "cancelEvent",
      eventId,
    });
    this.sendMessage(obj);
  }

  getTotalNumberOfMessages(eventChatId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "totalNumberOfMessages",
      eventGroupChatId: eventChatId,
    });
    this.sendMessage(obj);
  }

  cancelComingToEvent(eventId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "cancelComingToEvent",
      eventId,
    });
    this.sendMessage(obj);
  }

  createEventGroupChat(eventId, title = "") {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      eventTitle: title,
      messageType: "createEventGroupChat",
      eventId,
    });
    this.sendMessage(obj);
  }

  sendEventChat(eventId, message) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "groupChat",
      eventId,
      message: message,
    });
    this.sendMessage(obj);
  }

  fetchEventGroupChatList(index = 0, count = 10, searchTerm = "") {
    const obj = this.validObject({
      type: this.type,
      index,
      count,
      search: searchTerm,
      userId: this.userId,
      messageType: "fetchEventGroupChatList",
    });
    this.sendMessage(obj);
  }

  getAllNotifications() {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      messageType: "getAllNotifications",
    });
    this.sendMessage(obj);
    store.dispatch(getAllNotificationsLoading());
  }

  sendText(id, message, eventId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      eventId: eventId,
      messageType: "message",
      eventGroupChatId: id,
      message: message,
    });
    this.sendMessage(obj);
  }

  fetchMoreMessages(index, eventChatId) {
    const obj = this.validObject({
      type: this.type,
      userId: this.userId,
      index,
      eventGroupChatId: eventChatId,
      messageType: "fetchMoreMessages",
    });
    this.sendMessage(obj);
    store.dispatch(moreMessagingLoading());
  }

  removeNotification(
    notificationId = null,
    notificationTypeId = null,
    notificationType = null
  ) {
    const obj = this.validObject({
      notificationId,
      notificationTypeId,
      type: this.type,
      userId: this.userId,
      messageType: "removeNotification",
      notificationType: notificationType,
    });
    this.sendMessage(obj);
  }
}

let webSocketService = null;

export function createWebSocketService(url, userId, type) {
  webSocketService = new Socket(url, userId, type);

  return webSocketService;
}

export function getWebSocketService() {
  return webSocketService;
}
