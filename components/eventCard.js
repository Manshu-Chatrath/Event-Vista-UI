import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { setSelectedEvent } from "../reducers/eventSlice";
import { useNavigation } from "@react-navigation/native";
import * as timeZone from "moment-timezone";
import { useDispatch } from "react-redux";
import moment from "moment";
const EventCard = ({ event, isParticipating = false, ongoing = false }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handlePress = () => {
    dispatch(setSelectedEvent(event.id));
    navigation.navigate("EventDetail", { isParticipating });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "space-between",
        width: "100%",
        flexDirection: "row",
        height: 100,
      }}>
      <View style={{ marginLeft: 10, width: "70%" }}>
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 11,
              fontWeight: 800,
              marginTop: 5,
            }}>
            {moment.tz(event.eventDate, event.timeZone).format("ddd")},{" "}
            {moment.tz(event.eventDate, event.timeZone).format("DD MMM")} @
            {moment.tz(event.startTime, event.timeZone).format("hh:mm A")}{" "}
            {moment.tz(event.timeZone).format("z")}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: 16,
            }}>
            {event.title}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: "white",
              marginTop: 20,
              fontSize: 10,
              fontWeight: 600,
            }}>
            {event.location}
          </Text>
        </View>
      </View>
      <View style={{ width: "25%" }}>
        <View
          style={{
            width: "100%",
            marginTop: 10,
            borderRadius: 5,
            overflow: "hidden",
            height: 50,
          }}>
          <ImageBackground
            source={{ uri: event.src }}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}>
          <View
            style={{
              width: 24,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 4,
            }}>
            <IconButton size={24} icon="monitor-share" iconColor="white" />
          </View>
          <View
            style={{
              width: 24,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <IconButton size={24} icon="bookmark-outline" iconColor="white" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
