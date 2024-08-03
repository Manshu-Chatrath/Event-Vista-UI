import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getWebSocketService } from "../services/socket";
import { defaultGetEventGroupChatList } from "../reducers/eventSlice";
import {
  emptySaveEventMessages,
  defaultRecentGroupChat,
} from "../reducers/eventSlice";
import SearchBar from "../components/searchbar";
import { ActivityIndicator } from "react-native-paper";
import EventChat from "../components/eventChat";
import { useSelector, useDispatch } from "react-redux";
import ClientsTab from "../components/ClientsTab";
import DefaultHeader from "../components/DefaultHeader";
import { PENDING, SUCCESS } from "../reducers/constants";
const ChatList = ({ navigation, route }) => {
  const webSocketService = getWebSocketService();
  const [touched, setTouched] = useState(false);
  const [index, setIndex] = useState(1);
  const [groupChatMessages, setGroupChatMessages] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.auth.user);

  const count = 10;
  const [groupChats, setGroupChats] = useState([]);
  const notifications = useSelector(
    (state) => state?.notifications?.groupChatNotifications
  );

  const messages = useSelector((state) => state.events?.eventMessages);

  useFocusEffect(
    useCallback(() => {
      setGroupChats([]);
      if (webSocketService) {
        webSocketService.fetchEventGroupChatList(0, count, searchTerm);
      }
      return () => {
        setIndex(1);
        setGroupChats([]);
        setTouched(false);
        setSearchTerm("");
        dispatch(defaultGetEventGroupChatList());
        setGroupChatMessages({});
        dispatch(defaultRecentGroupChat());
      };
    }, [webSocketService])
  );

  useEffect(() => {
    let obj = { ...groupChatMessages };
    for (let key in messages) {
      messages[key]?.map((message) => {
        if (obj?.[key]) {
          obj[key] = [...obj[key], message.message];
        } else {
          obj[key] = [message.message];
        }
      });
    }
    setGroupChatMessages(obj);
  }, [messages, totalLength]);
  const dispatch = useDispatch();
  const chatListLoader = useSelector(
    (state) => state.events.getEventGroupChatListStatus
  );

  const totalLength = useSelector(
    (state) => state.events.totalEventGroupChatLength
  );
  const eventList = useSelector((state) => state.events.eventGroupChatList);
  const recentGroupChat = useSelector((state) => state.events.recentGroupChat);

  useEffect(() => {
    if (groupChats.length < totalLength) {
      const arr = [...groupChats, ...eventList];
      setGroupChats([...arr]);
    }
  }, [eventList, totalLength]);

  useEffect(() => {
    if (recentGroupChat) {
      const isEventExist = groupChats.find(
        (chat) => chat.id === recentGroupChat.id
      );

      const chats = groupChats.filter((chat) => chat.id !== recentGroupChat.id);
      let arr = [];
      arr.push(recentGroupChat);
      arr = [...arr, ...chats];
      setGroupChats([...arr]);
      if (!isEventExist) {
        setIndex((i) => i + 1);
      }
    }
  }, [recentGroupChat]);

  const loadMoreItems = () => {
    // if (groupChats.length < totalLength) {
    //   const start = index * count;
    //   webSocketService.fetchEventGroupChatList(start, count, searchTerm);
    //   setIndex((i) => i + 1);
    // }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <DefaultHeader title="Event Chats" navigation={navigation} />
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 20 }}>
        <EventChat
          socket={webSocketService}
          messages={groupChatMessages?.[item?.id]}
          length={notifications?.[item?.id]?.length}
          id={item.id}
          type={user.type}
          setMessages={setGroupChatMessages}
          event={item}
          navigation={navigation}
        />
      </View>
    );
  };

  const handleSearch = () => {
    setGroupChatMessages({});
    dispatch(emptySaveEventMessages());
    webSocketService.fetchEventGroupChatList(0, count, searchTerm);
  };

  return (
    <View
      style={{
        backgroundColor: "#2F2F2F",
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
      }}>
      <SearchBar
        setIndex={setIndex}
        setEventList={setGroupChats}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        touched={touched}
        setTouched={setTouched}
        setSearchTerm={setSearchTerm}
      />
      <Text
        style={{
          color: "#F44336",
          fontSize: 16,
          fontWeight: 800,
          marginTop: 20,
          textAlign: "center",

          alignSelf: "center",
        }}>
        Event chats will be removed once the event is over or cancelled.
      </Text>
      {chatListLoader === PENDING ||
      (groupChats?.length === 0 && chatListLoader !== SUCCESS) ? (
        <ActivityIndicator
          style={{ marginTop: 10 }}
          animating={true}
          color={"white"}
          size="small"
        />
      ) : chatListLoader === SUCCESS && groupChats.length === 0 ? (
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: 800,
            textAlign: "center",
            marginTop: 20,
          }}>
          You have no event chats right now!
        </Text>
      ) : chatListLoader === SUCCESS && groupChats.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={groupChats}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onEndReached={loadMoreItems}
            ListEmptyComponent={
              <TouchableOpacity
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                }}>
                <Text style={{ fontSize: 16, color: "white" }}>
                  No group chats!
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      ) : null}
      {user?.type === "clients" && <ClientsTab navigationParam={"chats"} />}
    </View>
  );
};

export default ChatList;
