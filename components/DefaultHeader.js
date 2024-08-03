import React from "react";
import { useDispatch } from "react-redux";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { IconButton, Button } from "react-native-paper";
import { logout } from "../reducers/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../reducers/apiSlice";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const DefaultHeader = ({ title, navigation, settings = false }) => {
  const user = useSelector((state) => state.account?.user);
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const handlePress = () => {
    navigate.navigate("Account");
  };

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("region");
    apiSlice.defaults.headers.common["Authorization"] = null;
    dispatch(logout());
    navigate.navigate("Auth");
  };

  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#2F2F2F",
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "space-between",
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
        <View>
          <Text style={{ color: "white", fontSize: 18 }}>{title}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handlePress}>
        {settings ? (
          <Button
            style={{
              backgroundColor: "#F44336",
              borderRadius: 12,
              marginTop: 4,
            }}
            onPress={handleLogOut}
            labelStyle={{ color: "white" }}>
            Logout
          </Button>
        ) : user?.src ? (
          <Image
            source={{ uri: user.src }}
            style={{
              height: 33,
              width: 33,
              borderRadius: 200,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ) : (
          <View>
            <IconButton icon="account" style={{ color: "white" }} size={33} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DefaultHeader;
