import React from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Header from "../components/header";
import { getWebSocketService } from "../services/socket";
import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedEvent } from "../reducers/eventSlice";
const NotificationList = () => {
  const eventNotifications = useSelector(
    (state) => state.notifications.eventsNotifications
  );
  const user = useSelector((state) => state.auth.user);
  const webSocketService = getWebSocketService();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const notificationEventObject = useSelector(
    (state) => state.notifications.notificationEventObject
  );

  const NotificationListItem = ({ notification, index }) => {
    const handlePress = () => {
      dispatch(setSelectedEvent(notification.notificationTypeId));
      webSocketService.removeNotification(notification.id);
      navigation.navigate("EventDetail");
    };

    const date = moment(notification.updatedAt);
    const formattedDate = date.calendar(null, {
      sameDay: "[Today at] h:mm A",
      nextDay: "[Tomorrow at] h:mm A",
      nextWeek: "dddd [at] h:mm A",
      lastDay: "[Yesterday at] h:mm A",
      lastWeek: "[Last] dddd [at] h:mm A",
      sameElse: "DD/MM/YYYY [at] h:mm A",
    });

    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={handlePress}
          style={{
            flexDirection: "row",
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: "rgba(255, 255, 255, 0.75)",
          }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              marginTop: 10,
              overflow: "hidden",
            }}>
            <ImageBackground
              source={{
                uri: notificationEventObject[notification.notificationTypeId]
                  ?.src,
              }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10, marginTop: 10 }}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                fontSize: 14,
                color: "white",
                fontWeight: 800,
              }}>
              {notification.message}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text
              style={{
                textAlign: "right",
                fontSize: 10,
                color: "white",
                fontWeight: 400,
              }}>
              {formattedDate}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2F2F2F",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      {user?.type === "organizer" && <Header />}
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <Text
          style={{
            fontWeight: 800,
            color: "white",
            fontSize: 18,
            textAlign: "left",
          }}>
          Notifications
        </Text>
        {eventNotifications.length === 0 && (
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 800,
              textAlign: "center",
              marginTop: 20,
            }}>
            You have no notifications right now!
          </Text>
        )}
        {eventNotifications.map((notification, index) => {
          return (
            <React.Fragment key={index}>
              <NotificationListItem index={index} notification={notification} />
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NotificationList;
