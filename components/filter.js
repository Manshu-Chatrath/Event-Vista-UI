import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
const Filter = ({ filter = "upcoming", setFilter, setIndex, setEventList }) => {
  const changeFilter = (value) => {
    setIndex(1);
    setFilter(value);
    setEventList([]);
  };
  const user = useSelector((state) => state.account.user);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
        }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => changeFilter("upcoming")}
            style={{
              backgroundColor: filter === "upcoming" ? "#F44336" : "black",
              borderWidth: filter === "upcoming" ? 0 : 1,
              borderColor: "white",
              borderRadius: 12,
            }}
            labelStyle={{ color: "white", fontSize: 11 }}>
            Upcoming
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => changeFilter("ongoing")}
            style={{
              backgroundColor: filter === "ongoing" ? "#F44336" : "black",
              borderWidth: filter === "ongoing" ? 0 : 1,
              borderColor: "white",
              marginLeft: 4,
              borderRadius: 12,
            }}
            labelStyle={{ color: "white", fontSize: 11 }}>
            Ongoing
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => changeFilter("past")}
            style={{
              backgroundColor: "black",
              borderRadius: 12,
              borderColor: "white",
              backgroundColor: filter === "past" ? "#F44336" : "black",
              borderWidth: filter === "past" ? 0 : 1,
              marginLeft: 4,
            }}
            labelStyle={{ color: "white", fontSize: 11 }}>
            Past
          </Button>
        </View>

        {user?.type === "organizer" && (
          <View>
            <Button
              onPress={() => changeFilter("cancelled")}
              style={{
                backgroundColor: "black",
                borderColor: "white",
                borderRadius: 12,
                backgroundColor: filter === "cancelled" ? "#F44336" : "black",
                borderWidth: filter === "cancelled" ? 0 : 1,
                border: "1px solid white",
                marginLeft: 4,
              }}
              labelStyle={{ color: "white", fontSize: 11 }}>
              Cancelled
            </Button>
          </View>
        )}
      </View>
    </>
  );
};

export default Filter;
