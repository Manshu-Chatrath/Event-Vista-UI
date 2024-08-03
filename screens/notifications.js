import React, { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { getWebSocketService } from "../services/socket";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedEvent } from "../reducers/eventSlice";
import { ActivityIndicator } from "react-native-paper";

const Notifications = () => {
  const eventNotifications = useSelector(
    (state) => state.notifications.eventsNotifications
  );
  const [notificationList, setNotificationList] = useState([]);
  const webSocketService = getWebSocketService();
  const [index, setIndex] = useState(1);
  const count = 20;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const notificationEventObject = useSelector(
    (state) => state.notifications.notificationEventObject
  );

  useFocusEffect(
    useCallback(() => {
      if (
        notificationList.length < count &&
        notificationList.length < eventNotifications.length
      ) {
        const arr = eventNotifications.slice(0, count);
        setNotificationList([...arr]);
      } else if (
        notificationList.length < eventNotifications.length &&
        notificationList.length > count
      ) {
        const arr = eventNotifications.slice(0, 1);
        const array = [...notificationList];
        setNotificationList([...arr, ...array]);
      }
      return () => setNotificationList([]);
    }, [eventNotifications])
  );

  const NotificationListItem = ({ notification }) => {
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
  useEffect(() => {
    if (notificationList.length < eventNotifications.length) {
      const start = (index - 1) * count;
      const end = start + count;
      const array = [...notificationList];
      const arr = eventNotifications.slice(start, end);
      setNotificationList([...array, ...arr]);
    }
  }, [index]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2F2F2F",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <Text
        style={{
          fontWeight: 800,
          color: "white",
          fontSize: 18,
          textAlign: "left",
        }}>
        Notifications
      </Text>

      <FlatList
        data={notificationList}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() =>
          notificationList.length < eventNotifications.length ? (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              animating={true}
              color={"white"}
              size="small"
            />
          ) : null
        }
        onEndReached={() => {
          if (notificationList.length < eventNotifications.length) {
            setIndex(index + 1);
          }
        }}
        renderItem={({ item }) => <NotificationListItem notification={item} />}
        ListEmptyComponent={
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
        }
      />
    </View>
  );
};

export default Notifications;
