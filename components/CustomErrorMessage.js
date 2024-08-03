import { View, Text } from "react-native";
const CustomErrorMessage = ({ message }) => {
  return (
    <View
      style={{
        width: "100%",
      }}>
      <Text
        style={{
          color: "#F44336",
          fontWeight: 800,
          textAlign: "left",
        }}>
        {message}
      </Text>
    </View>
  );
};

export default CustomErrorMessage;
