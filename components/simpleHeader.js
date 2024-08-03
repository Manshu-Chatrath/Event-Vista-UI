import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
const SimpleHeader = ({ title, handleClick, isButton = true }) => {
  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#2F2F2F",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 20,
        alignContent: "center",
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "space-between",
      }}>
      <View>
        <View>
          <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
        </View>
      </View>
      {isButton && (
        <View>
          <Button onPress={handleClick} labelStyle={{ color: "white" }}>
            Already have an account?
          </Button>
        </View>
      )}
    </View>
  );
};

export default SimpleHeader;
// onPress={handleLogin}
