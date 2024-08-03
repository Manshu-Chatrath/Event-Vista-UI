import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const ClientsTab = ({ navigationParam }) => {
  const navigate = useNavigation();
  const notifications = useSelector(
    (state) => state.notifications.groupChatNotifications
  );
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    let n = 0;
    for (let key in notifications) {
      if (notifications[key].length > 0) {
        n += notifications[key].length;
      }
    }
    setNotificationCount(n);
  }, [notifications]);
  const buttonsArr = [
    {
      name: "home-outline",
      text: "My Events",
      screen: "MyEvents",
      id: "dashboard",
      handlePress: () => navigate.navigate("ClientDashBoard"),
    },
    {
      name: "search-outline",
      text: "Explore",
      screen: "Explore",
      id: "explore",
      handlePress: () => navigate.navigate("Explore"),
    },
    {
      name: "notifications-outline",
      text: "Notifications",
      screen: "Notifications",
      id: "notifications",
      handlePress: () => navigate.navigate("Notifications"),
    },
    {
      name: "chatbox-outline",
      text: "Messages",
      screen: "Messages",
      id: "chats",
      handlePress: () => navigate.navigate("Messages", { type: "clients" }),
    },
  ];

  const Buttons = () => {
    return buttonsArr.map((button, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={button.handlePress}
          style={{
            width: "25%",
            height: 80,
            alignItems: "center",
            position: "relative",
            justifyContent: "center",
          }}>
          <View>
            <Ionicons
              name={button.name}
              size={30}
              color={navigationParam === button.id ? "#F44336" : "white"}
            />
          </View>
          <View>
            <Text
              style={{
                color: navigationParam === button.id ? "#F44336" : "white",
                fontWeight: "bold",
              }}>
              {button.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View
      style={{
        width: "100%",
        height: 80,
        position: "absolute",
        alignItems: "center",
        flexDirection: "row",
        bottom: 0,
        backgroundColor: "#3C3C3C",
        justifyContent: "space-between",
      }}>
      <Buttons />
    </View>
  );
};

export default ClientsTab;
