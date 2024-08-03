import React from "react";
import { Provider } from "react-native-paper";
import OrganizerScreen from "./screens/organizerScreen";
import { Image, StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { Provider as Wrapper } from "react-redux";
import { store } from "./reducers/index";
import { isExpired } from "react-jwt";
import { FAILED, IDLE, PENDING, SUCCESS } from "./reducers/constants";
import { createWebSocketService } from "./services/socket";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Auth from "./screens/auth";
import Header from "./components/header";
import Login from "./screens/login";
import { getAuthenticatedUser } from "./reducers/accountSlice";
import SignUp from "./screens/signup";
import ClientEmail from "./screens/clientemail";
import Chats from "./screens/chats";
import Otp from "./screens/otp";
import ChatList from "./screens/chatList";
import ForgotPassword from "./screens/forgotPassword";
import ClientScreen from "./screens/clientScreen";

import EventDetail from "./screens/eventDetail";
import { retrieveUser, storeUser, refreshToken } from "./reducers/authSlice";
import Account from "./screens/account";
import ParticpantList from "./screens/participantList";
import Notifications from "./screens/notifications";

export default function App() {
  const Stack = createNativeStackNavigator();

  const Routes = () => {
    const [refreshTokenInProcess, setRefreshTokenInProcess] = useState(true);
    const dispatch = useDispatch();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const user = useSelector((state) => state.auth?.user);

    useEffect(() => {
      if (user) {
        try {
          if (!isSocketConnected) {
            createWebSocketService(
              `ws://10.0.0.128:3000?userId=${user.id}&type=${user.type}&token=${user.token.accessToken}`,
              user.id,
              user.type
            );
            setIsSocketConnected(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, [user]);

    const storedUser = useSelector((state) => state.auth?.storedUser);
    const storedUserStatus = useSelector(
      (state) => state.auth?.storedUserStatus
    );
    const getUserStatus = useSelector((state) => state.auth?.getUserStatus);
    const tokenStatus = useSelector((state) => state.auth?.tokenStatus);
    useEffect(() => {
      dispatch(retrieveUser());
    }, []);

    useEffect(() => {
      if (
        (!storedUser && storedUserStatus === SUCCESS) ||
        storedUserStatus === FAILED
      ) {
        setRefreshTokenInProcess(false);
      }
    }, [storedUser, storedUserStatus]);

    useEffect(() => {
      if (tokenStatus === SUCCESS || tokenStatus === FAILED) {
        setRefreshTokenInProcess(false);
      }
    }, [tokenStatus]);

    useEffect(() => {
      if (user && !storedUser) {
        dispatch(
          storeUser({ token: user?.token, id: user?.id, type: user?.type })
        );
      }
      if (user) {
        dispatch(getAuthenticatedUser());
      }
      if (!user && storedUser) {
        dispatch(
          refreshToken({
            id: storedUser.id,
            refreshToken: storedUser.token.refreshToken,
            type: storedUser.type,
          })
        );
      }
    }, [user, storedUser]);

    const navigationThemes = {
      dark: {
        dark: true,
        colors: {
          background: "#2F2F2F",
        },
      },
    };

    // check refresh token status
    return refreshTokenInProcess ||
      storedUserStatus === PENDING ||
      storedUserStatus === IDLE ||
      getUserStatus === PENDING ? (
      <View style={{ flex: 1, backgroundColor: "#2F2F2F" }}>
        <Image
          source={require("./assets/splash.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: "#2F2F2F",
        }}>
        <NavigationContainer theme={navigationThemes.dark}>
          {
            <Stack.Navigator
              initialRouteName={
                !user
                  ? "Auth"
                  : user?.type === "client"
                  ? "ClientScreen"
                  : user?.type === "organizer"
                  ? "OrganizerScreen"
                  : null
              }>
              {user && !isExpired(user?.token?.accessToken) ? (
                storedUser?.type === "client" || user?.type === "client" ? (
                  <>
                    <Stack.Screen
                      name="ClientScreen"
                      component={ClientScreen}
                      options={{
                        headerLeft: () => null,
                        header: () => <Header />,
                      }}
                      initialParams={{ type: "client" }}
                    />
                    <Stack.Screen
                      name="Account"
                      component={Account}
                      options={{ headerShadowVisible: false }}
                      initialParams={{ type: "client" }}
                    />

                    <Stack.Screen
                      name="EventDetail"
                      component={EventDetail}
                      options={{ headerShown: false }}
                      initialParams={{ type: "client" }}
                    />
                    <Stack.Screen
                      name="Chats"
                      component={Chats}
                      options={{ headerShadowVisible: false }}
                    />
                    <Stack.Screen
                      name="ParticipantList"
                      component={ParticpantList}
                      options={{ headerShown: false }}
                    />
                  </>
                ) : storedUser?.type === "organizer" ||
                  user?.type === "organizer" ? (
                  <>
                    <Stack.Screen
                      screenOptions={{
                        cardStyle: { backgroundColor: "#2F2F2F" },
                      }}
                      name="OrganizerScreen"
                      component={OrganizerScreen}
                      options={{
                        headerShown: false,
                        cardStyle: { backgroundColor: "#2F2F2F" },
                      }}
                    />
                    <Stack.Screen
                      screenOptions={{
                        cardStyle: { backgroundColor: "#2F2F2F" },
                      }}
                      name="Notifications"
                      component={Notifications}
                      options={{
                        headerShown: false,
                        cardStyle: { backgroundColor: "#2F2F2F" },
                      }}
                    />
                    <Stack.Screen
                      name="ParticipantList"
                      component={ParticpantList}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="EventDetail"
                      component={EventDetail}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Account"
                      component={Account}
                      options={{ headerShadowVisible: false }}
                    />
                    <Stack.Screen
                      name="Message"
                      component={ChatList}
                      options={{ headerShadowVisible: false }}
                    />
                    <Stack.Screen
                      name="Chats"
                      component={Chats}
                      options={{ headerShadowVisible: false }}
                    />
                  </>
                ) : null
              ) : (
                <>
                  <Stack.Screen
                    name="ClientEmail"
                    options={{ headerShown: false }}
                    component={ClientEmail}
                  />

                  <Stack.Screen
                    name="ForgotPassword"
                    options={{
                      headerShadowVisible: false,
                      headerBackVisible: false,
                    }}
                    component={ForgotPassword}
                  />

                  <Stack.Screen
                    name="Signup"
                    options={{ headerShown: false }}
                    component={SignUp}
                  />
                  <Stack.Screen
                    name="Login"
                    options={{ headerShown: false }}
                    component={Login}
                  />
                  <Stack.Screen
                    options={{ headerShown: false, headerLeft: () => null }}
                    name="Auth"
                    component={Auth}
                  />
                  <Stack.Screen
                    name="Otp"
                    options={{
                      headerShadowVisible: false,
                      headerBackVisible: false,
                    }}
                    component={Otp}
                  />
                </>
              )}
            </Stack.Navigator>
          }
        </NavigationContainer>
      </View>
    );
  };
  return (
    <Provider>
      <Wrapper store={store}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1 }}
            edges={["right", "bottom", "left", "top"]}>
            <Routes />
          </SafeAreaView>
        </SafeAreaProvider>
      </Wrapper>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Change to your desired background color
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
