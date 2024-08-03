import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getWebSocketService } from "../services/socket";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import Header from "../components/header";
import { useState } from "react";
const ParticpantList = () => {
  const user = useSelector((state) => state.auth.user);
  const event = useSelector((state) => state.events.selectedEvent);
  const socket = getWebSocketService();
  const [clients, setClients] = event?.clients
    ? useState(event.clients)
    : useState([]);
  const handleRemove = (memberId) => {
    const arr = [...clients];
    const filteredClients = arr.filter((client) => client.id !== memberId);
    socket.removeMember(memberId, event.id); //update the list on local level
    setClients(filteredClients);
  };
  const ParticipantList = ({
    src,
    userName,
    memberId,
    index,
    isOrganizer = false,
  }) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginTop: 10,
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.75)",
          width: "100%",
          flexDirection: "row",
        }}>
        <View
          style={{
            marginTop: 10,
            width: 40,
            height: 40,
            borderRadius: 100,
            overflow: "hidden",
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <ImageBackground
            source={{ uri: src }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            justifyContent: "space-between",
            flex: 1,
            marginLeft: 10,
            alignContent: "center",
            alignItems: "center",
          }}>
          <View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
              }}>
              {userName}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "white",
              }}>
              {isOrganizer ? "Host" : "Participant"}
            </Text>
          </View>
          {user.type === "organizer" &&
            (!isOrganizer ? (
              <TouchableOpacity onPress={() => handleRemove(memberId)}>
                <Button
                  onPress={() => handleRemove(memberId)}
                  style={{
                    backgroundColor: "#F44336",
                    borderRadius: 12,
                    marginTop: 5,
                  }}
                  labelStyle={{
                    color: "white",
                    fontSize: 16,
                    backgroundColor: "#F44336",
                  }}>
                  Remove
                </Button>
              </TouchableOpacity>
            ) : null)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2F2F2F",
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <Header />
        <Text
          style={{
            textAlign: "left",
            color: "white",
            fontWeight: 900,
            fontSize: 16,
          }}>
          Participant List({event?.clients?.length + 1})
        </Text>
        <ParticipantList
          src={event.organizer.src}
          userName={event.organizer.userName}
          isOrganizer={true}
        />
        {clients?.map((participant, index) => (
          <ParticipantList
            key={index}
            src={participant.src}
            userName={participant.userName}
            memberId={participant.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ParticpantList;
