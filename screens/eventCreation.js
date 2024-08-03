import { View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useRef, useCallback } from "react";
import EventForm from "../components/eventForm";
const EventCreation = ({ navigation }) => {
  const scrollViewRef = useRef();
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [])
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      ref={scrollViewRef}
      overScrollMode="never">
      <View
        style={{
          backgroundColor: "#2F2F2F",
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <EventForm navigation={navigation} />
      </View>
    </ScrollView>
  );
};
export default EventCreation;
