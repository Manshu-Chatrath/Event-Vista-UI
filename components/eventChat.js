import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

const EventChat = ({ event, length = null, type, messages, socket, id }) => {
  const navigate = useNavigation();

  const handlePress = () => {
    socket.removeNotification(null, id, "eventChat");
    navigate.navigate("Chats", {
      eventChatId: id,
      eventId: event.eventId,
      eventTitle: event.title,
    });
  };
  const latestMessage = messages?.[messages?.length - 1];
  return (
    <TouchableOpacity
      key={event.id}
      onPress={handlePress}
      style={{
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.75)",
        width: "100%",
        flexDirection: "row",
        position: "relative",
      }}>
      <View style={{ marginTop: 10, flexDirection: "row" }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            overflow: "hidden",
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <ImageBackground
            source={{ uri: event.src }}
            style={{
              width: "100%",
              height: "100%",
              height: 50,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            resizeMode="cover"
          />
        </View>
        <View>
          <View>
            <Text
              style={{
                fontSize: 16,
                color: "white",
                marginLeft: 10,
                marginTop: 2,
              }}>
              {event.title}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: !length || length === 0 ? 300 : 800,
                color: "white",
                marginLeft: 10,
                marginTop: 5,
              }}>
              {latestMessage}
            </Text>
          </View>
        </View>
      </View>
      {!length ? null : (
        <View
          style={{
            position: "absolute",
            backgroundColor: "#F44336",
            width: 25,
            borderRadius: 25,
            height: 25,
            bottom: 2,
            right: 2,
            color: "white",
            justifyContent: "center",
          }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 800,
                textAlign: "center",
                color: "white",
              }}>
              {length}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
export default EventChat;
