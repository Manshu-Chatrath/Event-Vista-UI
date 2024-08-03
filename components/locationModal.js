import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Map from "./Map";
import { Button } from "react-native-paper";
import Address from "./Address";
import { getAllEvents } from "../reducers/eventSlice";
import { useDispatch } from "react-redux";
const LocationModal = ({
  region,
  setRegion,
  setVisible,
  searchTerm,
  setIndex,
  setEventList,
}) => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      overScrollMode="never">
      <View
        style={{
          backgroundColor: "#2F2F2F",
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <Text
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: "white",
            textAlign: "center",
          }}>
          Set your location!
        </Text>
        {region && <Map region={region} />}
        <Address
          setRegion={setRegion}
          region={region}
          isFocused={isFocused}
          isSubmit={isSubmit}
          setIsFocused={setIsFocused}
        />
        <View
          style={{
            width: "100%",
            alignItems: "center",
            height: "100%",
          }}>
          <Button
            style={{
              width: "100%",
              marginTop: 10,
              borderRadius: 12,
              backgroundColor: "#F44336",
            }}
            onPress={() => {
              setIsSubmit(true);
              if (region) {
                setVisible(false);
                setIsSubmit(false);
                setIsFocused(false);
                setEventList([]);
                setIndex(1);
                dispatch(
                  getAllEvents({
                    index: 0,
                    count: 20,
                    search: searchTerm,
                    location: region,
                  })
                );
              }
            }}
            labelStyle={{ color: "white" }}>
            Ok
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default LocationModal;
