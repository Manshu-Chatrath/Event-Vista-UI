import React, { useEffect, useState, useCallback } from "react";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import {
  getPersonalisedEvents,
  defaultGetPersonaliasedEventsStatus,
} from "../reducers/eventSlice";
import Searchbar from "../components/searchbar";
import { View, FlatList, Text } from "react-native";
import Filter from "../components/filter";
import { getWebSocketService } from "../services/socket";
import { useSelector, useDispatch } from "react-redux";
import { FAILED, IDLE, PENDING, SUCCESS } from "../reducers/constants";
import EventCard from "../components/eventCard";
const ClientDashBoard = () => {
  const webSocketService = getWebSocketService();
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const isReady = webSocketService?.socket?.readyState === WebSocket.OPEN;
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("upcoming");
  const [index, setIndex] = useState(1);
  const totalLength = useSelector(
    (state) => state.events.totalPersonalisedEvents
  );
  const [eventList, setEventList] = useState([]);
  const count = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const personalisedEvents = useSelector(
    (state) => state.events.personalisedEvents
  );
  const personalisedEventsStatus = useSelector(
    (state) => state.events.personalisedEventsStatus
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getPersonalisedEvents({ index: 0, count, search: searchTerm, filter })
      );
      return () => {
        setIndex(1);
        setTouched(false);
        setSearchTerm("");
        dispatch(defaultGetPersonaliasedEventsStatus());
        setEventList([]);
      };
    }, [filter])
  );
  useFocusEffect(
    useCallback(() => {
      return () => setFilter("upcoming");
    }, [])
  );

  useEffect(() => {
    if (isReady !== socketConnectionStatus) {
      setSocketConnectionStatus(isReady);
    }
  }, [isReady, socketConnectionStatus]);

  useEffect(() => {
    if (eventList.length < totalLength) {
      const arr = [...eventList, ...personalisedEvents];
      setEventList([...arr]);
    }
  }, [personalisedEvents, totalLength]);

  const notificationsStatus = useSelector(
    (state) => state.notifications.getAllNotificationsStatus
  );
  const notifications = useSelector(
    (state) => state.notifications.getAllNotifications
  );

  const renderItem = ({ item }) => {
    return (
      <React.Fragment>
        <EventCard event={item} ongoing={filter === "ongoing" ? true : false} />
      </React.Fragment>
    );
  };

  const handleSearch = () => {
    dispatch(
      getPersonalisedEvents({
        index: 0,
        count: 20,
        search: searchTerm,
        filter,
      })
    );
  };
  const loadMoreItems = () => {
    if (eventList.length < totalLength) {
      const start = index * count;
      dispatch(
        getOrganizerEvents({ index: start, count, search: searchTerm, filter })
      );
      setIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    if (socketConnectionStatus) {
      if (notificationsStatus === IDLE && notifications.length === 0) {
        webSocketService.getAllNotifications();
      }
    }
  }, [socketConnectionStatus, notificationsStatus, notifications]);
  return (
    <>
      <View
        style={{
          backgroundColor: "#2F2F2F",
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <Searchbar
          setIndex={setIndex}
          setEventList={setEventList}
          searchTerm={searchTerm}
          touched={touched}
          setTouched={setTouched}
          handleSearch={handleSearch}
          filter={filter}
          setSearchTerm={setSearchTerm}
        />

        <Filter
          filter={filter}
          searchTerm={searchTerm}
          setEventList={setEventList}
          setIndex={setIndex}
          setFilter={setFilter}
        />
        {filter === "past" ? (
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 800,
              marginTop: 20,
              alignSelf: "center",
            }}>
            All past events will be deleted after 2 days of there end date!
          </Text>
        ) : null}
        {personalisedEventsStatus === PENDING ? <Loader /> : null}
        {personalisedEventsStatus === SUCCESS ? (
          personalisedEvents.length > 0 ? (
            <>
              <View style={{ marginTop: 15, width: "100%" }}>
                <FlatList
                  data={eventList}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  onEndReached={loadMoreItems}
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  marginTop: 20,
                  alignSelf: "center",
                }}>
                {filter === "ongoing"
                  ? "There are no ongoing events"
                  : filter === "upcoming"
                  ? "There are no upcoming events"
                  : "There are no past events"}
              </Text>
            </>
          )
        ) : personalisedEventsStatus === FAILED ? (
          <Text style={{ color: "white" }}>Failed to fetch events</Text>
        ) : null}
      </View>
    </>
  );
};

export default ClientDashBoard;
