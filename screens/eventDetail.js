import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";
import Header from "../components/header";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Map from "../components/Map";
import { Title } from "react-native-paper";
import { Modal, Portal } from "react-native-paper";
import {
  defaultParicipationStatus,
  changeParticipationStatus,
} from "../reducers/notificationSlice";
import {
  defaultGetEventStatus,
  getEvent,
  initiateCancelEventStatus,
  defaultCancelEventStatus,
} from "../reducers/eventSlice";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  ImageBackground,
  ScrollView,
} from "react-native";

import { getWebSocketService } from "../services/socket";
import { Button, IconButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { FAILED, PENDING, SUCCESS } from "../reducers/constants";

const EventDetail = ({ navigation }) => {
  const cancelEventStatus = useSelector(
    (state) => state.events.cancelEventStatus
  );
  const navigate = useNavigation();
  const socket = getWebSocketService();
  const id = useSelector((state) => state.events.selectedEventId);
  const user = useSelector((state) => state.auth.user);
  const participationStatus = useSelector(
    (state) => state.notifications.eventParticipationStatus
  );
  const [cancel, setCancelEvent] = useState(false);
  const dispatch = useDispatch();
  const hideModal = () => setCancelEvent(false);
  const showModal = () => setCancelEvent(true);
  const [isParticipant, setIsParticipant] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(getEvent(id));
      }
    }, [id])
  );
  const handleCancelEvent = () => {
    setCancelEvent(false);
    if (user?.type === "organizer") {
      dispatch(initiateCancelEventStatus());
      socket.cancelEvent(event.id);
    } else {
      if (isParticipant) {
        dispatch(changeParticipationStatus());
        socket.cancelComingToEvent(event.id);
      }
    }
  };

  const ModalEvent = () => {
    return (
      <Portal>
        <Modal animationType="slide" visible={cancel} onDismiss={hideModal}>
          <View
            style={{
              alignItems: "center",
            }}>
            <View
              style={{
                paddingTop: 15,
                paddingBottom: 15,
                paddingRight: 20,
                paddingLeft: 20,
                borderRadius: 20,
                width: "86%",
                elevation: 8,
                backgroundColor: "#2F2F2F",
              }}>
              <Title
                style={{
                  fontWeight: "bold",
                  color: "white",
                }}>
                Cancel Event?
              </Title>
              <Text
                style={{ color: "white", fontWeight: "bold", marginTop: 10 }}>
                {!isParticipant
                  ? "Are you sure you want to cancel the event?"
                  : "Are you sure you want to cancel coming to the event?"}
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <View>
                  <Button
                    style={{
                      borderRadius: 12,
                      marginTop: 4,
                    }}
                    onPress={hideModal}
                    labelStyle={{ color: "white" }}>
                    No
                  </Button>
                </View>
                <View>
                  <Button
                    style={{
                      borderRadius: 12,
                      marginTop: 4,
                    }}
                    onPress={handleCancelEvent}
                    labelStyle={{ color: "white" }}>
                    Yes
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    );
  };

  const selectedEventStatus = useSelector(
    (state) => state.events.selectedEventStatus
  );
  const event = useSelector((state) => state.events.selectedEvent);

  useEffect(() => {
    if (event && user) {
      const isParticipantExist = event.clients.find(
        (client) => client.id === user.id
      );
      setIsParticipant(isParticipantExist);
    }
  }, [event, user]);

  const ParticipantImage = ({ src, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ParticipantList")}>
          {src ? (
            <Image
              source={{ uri: src }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 200,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ) : (
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 200,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey",
              }}>
              <IconButton icon="account" style={{ color: "white" }} size={33} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingBottom: 70,
      }}>
      <ScrollView
        style={{ paddingLeft: 10, paddingRight: 10 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Header />
        <ModalEvent />
        {selectedEventStatus === PENDING ? (
          <Loader />
        ) : cancelEventStatus === PENDING ? (
          <Loader />
        ) : cancelEventStatus === FAILED ? (
          <Loader
            status={cancelEventStatus}
            defaultFunction={() => dispatch(defaultCancelEventStatus())}
          />
        ) : cancelEventStatus === SUCCESS ? (
          <Loader
            status={cancelEventStatus}
            defaultFunction={() => dispatch(defaultCancelEventStatus())}
            handleClick={() => {
              dispatch(defaultCancelEventStatus());
              navigation.navigate("OrganizerScreen");
            }}
          />
        ) : selectedEventStatus === FAILED ? (
          <Loader
            status={selectedEventStatus}
            defaultFunction={() => dispatch(defaultGetEventStatus)}
          />
        ) : null}
        {participationStatus === PENDING || participationStatus === SUCCESS ? (
          <Loader
            handleClick={() => {
              dispatch(defaultParicipationStatus());
              navigate.navigate("ClientDashBoard");
            }}
            status={participationStatus}
          />
        ) : null}
        <TouchableOpacity
          style={{
            height: 200,
            width: "100%",
            backgroundColor: "black",
            borderRadius: 18,
            overflow: "hidden",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
          }}>
          <ImageBackground
            source={{ uri: event?.src }}
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={{ justifyContent: "flex-start" }}>
          <Text
            style={{
              color: "white",
              marginTop: 10,
              fontSize: 16,
              fontWeight: 600,
            }}>
            {event?.title}
          </Text>
        </View>
        <View style={{ alignItems: "flex-start" }}>
          <Button
            style={{
              backgroundColor: "#F44336",
              borderRadius: 12,
              marginTop: 4,
            }}
            labelStyle={{ color: "white" }}>
            {moment(event?.eventDate).format("DD MMM YYYY")},{" "}
            {moment(event?.startTime).format("hh:mm A")}
            {" - "} {moment(event?.endTime).format("hh:mm A")}
          </Button>
        </View>
        {user?.type === "organizer" ? (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: 800, color: "white", fontSize: 16 }}>
              Participant Limit: {event?.participantLimit}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate("ParticipantList")}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            height: 50,
            marginTop: 12,
          }}>
          {user?.type === "organizer" ? null : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 50,
                position: "relative",
              }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                }}>
                Host
              </Text>

              <View style={{ marginTop: 0, position: "absolute", bottom: -18 }}>
                <View style={{ flexDirection: "row" }}>
                  <ParticipantImage src={event?.organizer?.src} />
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 50,
              position: "relative",
            }}>
            <View>
              <Text style={{ color: "white", fontSize: 16, fontWeight: 600 }}>
                Attendees
              </Text>
            </View>
            <View style={{ marginTop: 0, position: "absolute", bottom: -18 }}>
              <View style={{ flexDirection: "row" }}>
                {event?.clients?.map((client, index) => (
                  <React.Fragment key={index}>
                    {index < 3 ? (
                      <ParticipantImage src={client.src} index={index} />
                    ) : index === 3 ? (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 200,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "grey",
                        }}>
                        <Text style={{ textAlign: "center", color: "white" }}>
                          +{event.clients.length - 3}
                        </Text>
                      </View>
                    ) : null}
                  </React.Fragment>
                ))}
              </View>
            </View>
            <View>
              <IconButton icon="chevron-right" size={24} iconColor="white" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ marginTop: 30 }}>
          <Text style={{ fontWeight: 800, color: "white", fontSize: 16 }}>
            About
          </Text>
          <Text style={{ color: "white", fontSize: 16 }}>{event?.about}</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: 800, color: "white", fontSize: 16 }}>
            Location
          </Text>
          {event && (
            <Map
              region={{
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                longitude: event.longitude,
                latitude: event.latitude,
              }}
            />
          )}

          <Text style={{ color: "white", fontSize: 11, fontWeight: 600 }}>
            {event?.location}
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#2F2F2F",
          zIndex: 100,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <View
          style={{
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            width: event?.cancel ? "100%" : "default",
            backgroundColor: "#2F2F2F",
          }}>
          {event?.cancel ? (
            <Text
              style={{
                fontWeight: 800,
                fontSize: 20,
                textAlign: "center",
                width: "100%",
                color: "#F44336",
              }}>
              This event has been cancelled!
            </Text>
          ) : (
            <Button
              style={{
                backgroundColor: "#F44336",
                borderRadius: 12,
                height: 40,
                marginRight: 10,
              }}
              onPress={
                user?.type === "organizer"
                  ? showModal
                  : isParticipant
                  ? showModal
                  : () => {
                      dispatch(changeParticipationStatus());
                      socket.joinEvent(event.id);
                    }
              }
              labelStyle={{ color: "white", fontSize: 16 }}>
              {user?.type === "organizer"
                ? "Cancel Event"
                : user?.type === "client"
                ? isParticipant
                  ? "Not Coming"
                  : "Join Event"
                : null}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventDetail;
