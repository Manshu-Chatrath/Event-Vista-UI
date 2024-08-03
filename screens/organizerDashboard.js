import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, FlatList } from "react-native";
import { getWebSocketService } from "../services/socket";
import Loader from "../components/Loader";
import {
  getOrganizerEvents,
  defaultGetEventsStatus,
} from "../reducers/eventSlice";
import { ActivityIndicator } from "react-native-paper";
import Searchbar from "../components/searchbar";
import Filter from "../components/filter";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "../components/eventCard";

import { IDLE, PENDING, SUCCESS } from "../reducers/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrganizerDashBoard = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("upcoming");
  const events = useSelector((state) => state.events.events);
  const getEventsStatus = useSelector((state) => state.events.getEventsStatus);

  const [touched, setTouched] = useState(false);
  const totalLength = useSelector((state) => state.events.totalLength);
  const [index, setIndex] = useState(1);
  const count = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const webSocketService = getWebSocketService();
  const [eventList, setEventList] = useState([]);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const isReady = webSocketService?.socket?.readyState === WebSocket.OPEN;
  const notificationsStatus = useSelector(
    (state) => state.notifications.getAllNotificationsStatus
  );
  const notifications = useSelector(
    (state) => state.notifications.getAllNotifications
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getOrganizerEvents({
          index: 0,
          count,
          search: searchTerm,
          filter,
        })
      );
      return () => {
        setIndex(1);
        setTouched(false);
        setSearchTerm("");
        dispatch(defaultGetEventsStatus());
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
    if (socketConnectionStatus) {
      if (notificationsStatus === IDLE && notifications.length === 0) {
        webSocketService.getAllNotifications();
      }
    }
  }, [socketConnectionStatus, notificationsStatus, notifications]);

  useEffect(() => {
    if (eventList.length < totalLength) {
      const arr = [...eventList, ...events];
      setEventList([...arr]);
    }
  }, [events, totalLength]);

  const loadMoreItems = () => {
    if (eventList.length < totalLength) {
      const start = index * count;
      dispatch(
        getOrganizerEvents({ index: start, count, search: searchTerm, filter })
      );
      setIndex((i) => i + 1);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <React.Fragment>
        <EventCard event={item} ongoing={filter === "ongoing" ? true : false} />
      </React.Fragment>
    );
  };

  const handleSearch = () => {
    dispatch(
      getOrganizerEvents({
        index: 0,
        count: 10,
        search: searchTerm,
        filter,
      })
    );
  };

  return (
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
            color: "#F44336",
            fontSize: 16,
            fontWeight: 800,
            marginTop: 20,
            textAlign: "center",

            alignSelf: "center",
          }}>
          All past events will be deleted after 2 days of their end date!
        </Text>
      ) : null}
      {
        <>
          {(eventList.length === 0 && getEventsStatus === IDLE) ||
            (getEventsStatus === PENDING &&
              !touched &&
              eventList.length === 0 && <Loader />)}
          {eventList.length > 0 && (
            <View
              style={{
                marginTop: 15,
                width: "100%",
                flex: 1,
              }}>
              <FlatList
                data={eventList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onEndReached={loadMoreItems}
              />
            </View>
          )}
          {getEventsStatus === PENDING &&
          eventList.length !== 0 &&
          eventList?.length < totalLength ? (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              animating={true}
              color={"white"}
              size="small"
            />
          ) : null}
        </>
      }
      {eventList.length === 0 &&
        totalLength === 0 &&
        getEventsStatus === SUCCESS && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "white",
                marginTop: 20,
                alignSelf: "center",
                textAlign: "center",
              }}>
              No events exist
              {filter === "upcoming"
                ? ", Please press " + " button to create events!"
                : null}
            </Text>
          </>
        )}
    </View>
  );
};

export default OrganizerDashBoard;
