import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import LocationModal from "../components/locationModal";
import { getWebSocketService } from "../services/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAILED, PENDING, SUCCESS } from "../reducers/constants";
import * as Location from "expo-location";
import Searchbar from "../components/searchbar";
import Loader from "../components/Loader";
import Map from "../components/Map";
import EventCard from "../components/eventCard";
import { defaultGetEventsStatus, getAllEvents } from "../reducers/eventSlice";
const Explore = () => {
  const dispatch = useDispatch();
  const webSocketService = getWebSocketService();
  const isReady = webSocketService?.socket?.readyState === WebSocket.OPEN;
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const events = useSelector((state) => state.events.events);
  const [region, setRegion] = useState(null);
  const [eventList, setEventList] = useState([]);
  const getEventsStatus = useSelector((state) => state.events.getEventsStatus);
  const [index, setIndex] = useState(1);
  const [visible, setVisible] = useState(false);
  const count = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const totalLength = useSelector((state) => state.events.totalEvents);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let retrieveRegion = await AsyncStorage.getItem("region");
        if (retrieveRegion) {
          retrieveRegion = JSON.parse(retrieveRegion);
          setRegion(retrieveRegion);
          dispatch(
            getAllEvents({
              index: 0,
              count,
              search: searchTerm,
              location: {
                latitude: retrieveRegion.latitude,
                longitude: retrieveRegion.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                address: retrieveRegion.address,
              },
            })
          );
        } else {
          if (!region) {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              setErrorMsg("Permission to access location was denied");
              return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let address = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              address: `${address[0].city}, ${address[0].region}`,
            });
            dispatch(
              getAllEvents({
                index: 0,
                count,
                search: searchTerm,
                location: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                  address: `${address[0].city}, ${address[0].region}`,
                },
              })
            );
          } else {
            dispatch(
              getAllEvents({
                index: 0,
                count,
                search: searchTerm,
                location: region,
              })
            );
          }
        }
      })();
      return () => {
        setIndex(1);
        setTouched(false);
        setEventList([]);
        setSearchTerm("");
        setLoading(true);
        dispatch(defaultGetEventsStatus());
      };
    }, [])
  );

  const loadMoreItems = () => {
    if (eventList.length < totalLength) {
      const start = index * count;
      dispatch(
        getAllEvents({
          index: start,
          count,
          search: searchTerm,
          location: region,
        })
      );
      setIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    const saveRegion = async () => {
      try {
        if (region) {
          let retrieveRegion = await AsyncStorage.getItem("region");
          retrieveRegion = JSON.parse(retrieveRegion);
          if (
            !retrieveRegion ||
            retrieveRegion?.latitude !== region?.latitude ||
            retrieveRegion?.longitude !== region?.longitude
          ) {
            await AsyncStorage.setItem("region", JSON.stringify(region));
          }
        }
      } catch (error) {
        console.error("Failed to save region:", error);
      }
    };
    saveRegion();
  }, [region]);

  useEffect(() => {
    if (getEventsStatus === SUCCESS || getEventsStatus === FAILED) {
      setLoading(false);
    }
  }, [getEventsStatus]);

  useEffect(() => {
    if (isReady !== socketConnectionStatus) {
      setSocketConnectionStatus(isReady);
    }
  }, [isReady, socketConnectionStatus]);

  useEffect(() => {
    if (eventList.length < totalLength) {
      const arr = [...eventList, ...events];
      setEventList([...arr]);
    }
  }, [events, totalLength]);

  useEffect(() => {
    if (webSocketService && socketConnectionStatus) {
      webSocketService.getAllNotifications();
    }
  }, [webSocketService, socketConnectionStatus]);

  const renderItem = ({ item }) => {
    return (
      <React.Fragment>
        <EventCard event={item} />
      </React.Fragment>
    );
  };
  const handleSearch = () => {
    dispatch(
      getAllEvents({
        index: 0,
        count: 20,
        search: searchTerm,
        region: region,
      })
    );
  };

  return (
    <>
      {visible ? (
        <LocationModal
          region={region}
          setRegion={setRegion}
          setEventList={setEventList}
          searchTerm={searchTerm}
          setIndex={setIndex}
          setVisible={setVisible}
        />
      ) : (
        <View
          style={{
            backgroundColor: "#2F2F2F",
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
          }}>
          {getEventsStatus === PENDING ? <Loader /> : null}
          <Searchbar
            setIndex={setIndex}
            setEventList={setEventList}
            searchTerm={searchTerm}
            touched={touched}
            setTouched={setTouched}
            handleSearch={handleSearch}
            setSearchTerm={setSearchTerm}
          />
          {!loading && (
            <View
              style={{
                flexDirection: "row",
              }}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  alignItems: "center",
                }}>
                <Button
                  icon="pencil"
                  mode="text"
                  contentStyle={{
                    flexDirection: "row-reverse",
                    alignSelf: "flex-start",
                    paddingHorizontal: 0,
                  }}
                  labelStyle={{
                    color: "white",
                    fontSize: 16,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => {
                    if (region) {
                      setRegion(null);
                    }
                    setVisible(true);
                  }}>
                  {loading
                    ? null
                    : region?.address
                    ? region.address
                    : "Location"}
                </Button>
              </TouchableOpacity>
            </View>
          )}

          {region && <Map region={region} />}
          {eventList.length > 0 ? (
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
          ) : events.length === 0 && getEventsStatus === SUCCESS ? (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  marginTop: 20,
                  alignSelf: "center",
                }}>
                No events to join!
              </Text>
            </>
          ) : null}
        </View>
      )}
    </>
  );
};

export default Explore;
