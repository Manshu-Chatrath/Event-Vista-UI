import { View, StyleSheet, Image } from "react-native";
import { IDLE, PENDING, SUCCESS, colors } from "../reducers/constants";
import { Button } from "react-native-paper";
const Main = ({
  button1,
  type = null,
  button2,
  handleClickButton1,
  handleClickButton2,
  icon1,
  icon2,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ position: "relative", flex: 1, justifyContent: "center" }}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
        <View
          style={{
            width: "100%",
          }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              style={styles.button}
              icon={icon1}
              labelStyle={{ color: "white" }}
              onPress={handleClickButton1}>
              {button1}
            </Button>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Button
              style={styles.button}
              icon={icon2}
              labelStyle={{ color: "white" }}
              onPress={handleClickButton2}>
              {button2}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Main;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2F2F2F",
    flex: 1,
  },
  image: {
    width: "100%",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#F44336",
  },
});
