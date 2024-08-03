import React from "react";
import { useSelector } from "react-redux";
import { IconButton } from "react-native-paper";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const Header = () => {
  const navigate = useNavigation();
  const user = useSelector((state) => state.account.user);

  const handlePress = () => {
    navigate.navigate("Account");
  };
  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        paddingTop: 15,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,

        height: 50,
      }}>
      <View style={{ marginLeft: 2 }}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            height: 40,
            aspectRatio: 1,
          }}
        />
      </View>
      <TouchableOpacity onPress={handlePress}>
        {user?.src ? (
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

export default Header;
