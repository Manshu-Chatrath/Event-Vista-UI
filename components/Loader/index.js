import React, { useState } from "react";
import { Modal, ActivityIndicator, Portal, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { FAILED, SUCCESS } from "../../reducers/constants";
const Loader = ({
  status,
  handleClick = () => null,
  defaultFunction = () => null,
}) => {
  const [visible, setVisible] = useState(true);
  const handlePress = () => {
    if (status === FAILED) {
      setVisible(false);
      defaultFunction();
      return;
    } else {
      setVisible(false);
      handleClick();
    }
  };
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        <View style={styles.container}>
          <View
            style={{
              width: "80%",
              paddingTop: 20,
              height: 150,
              justifyContent: "center",
              paddingBottom: 20,
              backgroundColor: "#2F2F2F",
              borderRadius: 20,
            }}>
            {status === FAILED || status === SUCCESS ? (
              <>
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: 16,
                      textAlign: "center",
                    }}>
                    {status === FAILED ? "Some error occured!" : "Success!"}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Button
                    style={{
                      width: "80%",
                      marginTop: 10,
                      borderRadius: 12,
                      backgroundColor: "#F44336",
                    }}
                    labelStyle={{ color: "white" }}
                    onPress={handlePress}>
                    Ok
                  </Button>
                </View>
              </>
            ) : (
              <ActivityIndicator
                animating={true}
                color={"white"}
                size="medium"
              />
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    justifyContent: "center",
    height: 200,
    width: 300,
    alignItems: "center",
  },
});

export default Loader;
