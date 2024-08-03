import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "./explore";
import ChatList from "./chatList";
import ClientDashBoard from "./clientDashboard";
import Notifications from "./notifications";
const ClientScreen = () => {
  const Tab = createBottomTabNavigator();
  const groupChatNotifications = useSelector(
    (state) => state.notifications.groupChatNotifications
  );

  const eventNotifications = useSelector(
    (state) => state.notifications.eventsNotifications
  );

  const [chatNotificationsCount, setChatNotificationCount] = useState(0);
  useEffect(() => {
    let n = 0;
    for (let key in groupChatNotifications) {
      if (groupChatNotifications[key].length > 0) {
        n += groupChatNotifications[key].length;
      }
    }
    setChatNotificationCount(n);
  }, [groupChatNotifications]);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Explore"
        screenOptions={{
          tabBarActiveTintColor: "#F44336",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "#3C3C3C",
            paddingTop: 5,
            paddingBottom: 8,
            borderTopWidth: 0,
            height: 60,
          },
          labelStyle: {
            fontSize: 16,
          },
        }}>
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name={"home-outline"} color={color} size={24} />
            ),
            title: "My Events",
          }}
          name="ClientDashBoard"
          component={ClientDashBoard}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name={"search-outline"} color={color} size={24} />
            ),
            title: "Explore",
          }}
          name="Explore"
          component={Explore}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ position: "relative" }}>
                <Ionicons
                  name={"notifications-outline"}
                  color={color}
                  size={24}
                />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "#F44336",
                    width: 15,
                    borderRadius: 15,
                    height: 15,
                    paddingBottom: 2,
                    top: -2,
                    right: -2,
                    color: "white",
                    justifyContent: "center",
                    zIndex: 100,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textAlign: "center",
                        color: "white",
                      }}>
                      {eventNotifications?.length
                        ? eventNotifications.length
                        : 0}
                    </Text>
                  </View>
                </View>
              </View>
            ),
          }}
          name="Notifications"
          component={Notifications}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ position: "relative" }}>
                <Ionicons name={"chatbox-outline"} color={color} size={24} />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "#F44336",
                    width: 15,
                    borderRadius: 15,
                    height: 15,
                    paddingBottom: 2,
                    top: -2,
                    right: -2,
                    color: "white",
                    justifyContent: "center",
                    zIndex: 100,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textAlign: "center",
                        color: "white",
                      }}>
                      {chatNotificationsCount}
                    </Text>
                  </View>
                </View>
              </View>
            ),
            title: "Messages",
          }}
          name="ChatList"
          component={ChatList}
        />
      </Tab.Navigator>
    </>
  );
};

export default ClientScreen;
