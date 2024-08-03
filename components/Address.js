import { useState, useEffect } from "react";
import { Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View } from "react-native";
import dotenv from "dotenv";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const Address = ({ isFocused, setIsFocused, setRegion, region, isSubmit }) => {
  const [animatedIsFocused] = useState(new Animated.Value(0));

  const [text, setText] = useState("");
  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  useFocusEffect(
    useCallback(() => {
      return () => setText("");
    }, [])
  );
  return (
    <View
      style={{
        width: "100%",
        marginTop: 8,
        position: "relative",
        height: "auto",
        backgroundColor: "white",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
      }}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder={isFocused ? "Enter Address" : ""}
        textInputProps={{
          placeholderTextColor: "rgba(0,0,0,0.7)",
          returnKeyType: "search",
          value: text,
          cursorColor: "black",
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          onChange: (e) => setText(e.target.value),
        }}
        styles={{
          textInput: {
            paddingTop: 20,
            borderBottomWidth: isSubmit && !region ? 2 : 0,
            borderBottomColor: isSubmit && !region ? "#F44336" : null,
            paddingBottom: 0,
            height: 60,
            color: "black",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingLeft: 16,
            paddingRight: 15,
            fontSize: 16,
          },
          listView: {
            zIndex: 1,
            backgroundColor: "white",
          },
        }}
        enablePoweredByContainer={false}
        disableScroll={true}
        onPress={(data, details = null) => {
          if (details) {
            const { lat, lng } = details.geometry.location;
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              address: data.description,
            });
            setText(data.description);
          }
        }}
        onFail={(error) => console.log(error)}
        query={{
          key: process.env.GOOGLE_KEY,
          language: "en",
        }}
      />

      <Animated.View
        style={{
          position: "absolute",
          top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: region ? [12, 18] : [20, 12],
          }),
          color: "black",
        }}>
        <Animated.Text
          style={{
            fontSize: region
              ? 11
              : animatedIsFocused.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 11],
                }),

            color:
              isSubmit && !region
                ? "#F44336"
                : isFocused
                ? "black"
                : "rgba(0,0,0,0.7)",
            left: 16,
            paddingBottom: 16,
          }}>
          Enter Address
        </Animated.Text>
      </Animated.View>
    </View>
  );
};
export default Address;
