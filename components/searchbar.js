import React, { useEffect } from "react";

import { View, TextInput, Image } from "react-native";
const SearchBar = ({
  searchTerm,
  touched,
  setTouched,
  handleSearch,
  setSearchTerm,
  setIndex = () => null,
  setEventList = () => null,
}) => {
  useEffect(() => {
    if (touched) {
      const timerId = setTimeout(() => {
        setEventList([]);
        handleSearch();
      }, 200);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [searchTerm]);

  return (
    <View
      style={{
        justifyContent: "center",
        width: "100%",
      }}>
      <View style={{ width: "100%", position: "relative" }}>
        <View
          style={{
            position: "absolute",
            left: 0,
            width: 18,
            height: 30,
            backgroundColor: "white",
            zIndex: 100,
            top: 10,
            borderTopLeftRadius: 32,
            borderBottomLeftRadius: 32,
          }}></View>
        <Image
          source={require("../assets/search24.png")}
          style={{
            height: 24,
            width: 24,
            position: "absolute",
            backgroundColor: "white",
            left: 15,
            zIndex: 100,
            top: 14,
          }}
        />
        <TextInput
          style={{
            marginTop: 10,
            borderWidth: 0,
            backgroundColor: "white",
            borderRadius: 32,
            position: "relative",
            textAlign: "center",
            height: 30,
          }}
          onChangeText={(newText) => {
            setIndex(1);
            setSearchTerm(newText);
            if (!touched) {
              setTouched(true);
            }
          }}
          placeholder="Search"
          value={searchTerm}
        />
      </View>
    </View>
  );
};

export default SearchBar;
