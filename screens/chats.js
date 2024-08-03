import {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import DefaultHeader from "../components/DefaultHeader";
import { apiSlice } from "../reducers/apiSlice";
import { chatBoxClosed, chatBoxOpened } from "../reducers/eventSlice";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { View, Text, TextInput } from "react-native";
import { getWebSocketService } from "../services/socket";
import { ActivityIndicator } from "react-native-paper";
import { IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
const Chats = ({ route, navigation }) => {
  const eventChatId = route.params.eventChatId;
  const eventId = route.params.eventId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const totalNumberOfMessages = useSelector(
    (state) => state.events?.totalNumberOfMessages
  );
  const [messageList, setMessageList] = useState([]);
  const [enableInfinityScroll, setEnableInfinityScroll] = useState(false);
  const scrollViewRef = useRef();

  const socket = getWebSocketService();
  const title = route.params.eventTitle;
  const [isFocused, setIsFocused] = useState(true);
  const [text, setText] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <DefaultHeader
          title={title ? title : "Event Name"}
          navigation={navigation}
        />
      ),
    });
  }, [navigation, title]);

  useFocusEffect(
    useCallback(() => {
      socket.getTotalNumberOfMessages(eventChatId);
      dispatch(chatBoxOpened());
      return () => {
        setMessageList([]);
        dispatch(chatBoxClosed());
      };
    }, [])
  );
  const messages = useSelector(
    (state) => state.events.eventMessages[eventChatId]
  );

  useEffect(() => {
    socket.removeNotification(null, eventChatId, "eventChat");
    if (messageList.length === 0) {
      const arr = [...messageList, ...messages, { id: -1, isLastItem: true }];
      setMessageList([...arr]);
    } else {
      if (
        messageList[messageList.length - 2].id !==
        messages[messages.length - 1].id
      ) {
        if (!isFocused) {
          setIsFocused(true);
        }
        const filteredArr = messageList.filter((e) => e.id !== -1);
        const arr = [...filteredArr, ...messages, { id: -1, isLastItem: true }];
        setMessageList([...arr]);
        socket.getTotalNumberOfMessages(eventChatId);
      }
    }
  }, [messages]);

  const user = useSelector((state) => state.account.user);

  const MessageBox = ({ id, client, message, formattedDate }) => {
    return (
      <View
        style={{
          minHeight: 60,
          backgroundColor: +id === user.id ? "black" : "#F44336",
          borderRadius: 10,
          maxWidth: "60%",
          padding: 10,
        }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          User: {+id === user.id ? "You" : client.userName}
        </Text>
        <Text style={{ color: "white", marginTop: 4 }}>{message}</Text>

        <Text
          style={{
            textAlign: "right",
            fontSize: 10,
            color: "white",
            fontWeight: 400,
          }}>
          {formattedDate}
        </Text>
      </View>
    );
  };

  const sendMessage = () => {
    if (text) {
      socket.sendText(eventChatId, text, eventId);
      setText("");
    }
  };

  const handleScroll = async () => {
    try {
      if (
        messageList.length - 1 < totalNumberOfMessages &&
        !loading &&
        enableInfinityScroll
      ) {
        setLoading(true);
        if (isFocused) {
          setIsFocused(false);
        }

        const start = messageList.length - 1;
        setTimeout(async () => {
          const response = await apiSlice.get(
            `/fetchMoreMessages?index=${start}&count=20&eventChatId=${eventChatId}`
          );
          const arr = [...response.data.messages, ...messageList];
          setMessageList([...arr]);
          setLoading(false);
        }, 0);
      } else {
        if (loading) {
          setLoading(false);
        }
      }
    } catch (e) {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const ListElement = ({ message, formattedDate }) => (
    <View
      style={{
        alignItems:
          +message?.clientId === user.id || +message?.organizerId === user.id
            ? "flex-end"
            : "flex-start",
        marginBottom: 10,
      }}>
      {!message?.clientId && !message?.organizerId ? (
        <View
          style={{
            width: "100%",
            position: "relative",
            justifyContent: "center",
            zIndex: 10,
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "white",
              position: "relative",
              zIndex: 10,
              fontWeight: "bold",
              backgroundColor: "#2F2F2F",
              paddingLeft: 5,
              paddingRight: 5,
            }}>
            {message.message}
          </Text>
          <View
            style={{
              position: "absolute",
              width: "100%",
              zIndex: -1,
              borderTopColor: "white",
              borderTopWidth: 1,
            }}></View>
        </View>
      ) : (
        <MessageBox
          client={message?.client ? message.client : message.organizer}
          message={message.message}
          formattedDate={formattedDate}
          id={message?.client ? message.clientId : message.organizerId}
        />
      )}
    </View>
  );

  const handleViewItemChange = useCallback((viewableItems) => {
    const items = viewableItems.changed.filter((e) => e.isViewable);
    items.forEach((v) => {
      if (v.item.id === -1) {
        if (!enableInfinityScroll) {
          setEnableInfinityScroll(true);
        }
      }
    });
  }, []);
  const memoizedFlatList = useMemo(
    () => (
      <FlatList
        onViewableItemsChanged={handleViewItemChange}
        initialNumToRender={20}
        removeClippedSubviews={false}
        data={messageList}
        showDefaultLoadingIndicators={false}
        onLayout={() => {
          if (isFocused) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
        onContentSizeChange={() => {
          if (isFocused) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
        ref={scrollViewRef}
        onStartReachedThreshold={0.5}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        onStartReached={handleScroll}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          const message = item.item;
          const date = moment(message.updatedAt);
          const formattedDate = date.calendar(null, {
            sameDay: "[Today at] h:mm A",
            nextDay: "[Tomorrow at] h:mm A",
            nextWeek: "dddd [at] h:mm A",
            lastDay: "[Yesterday at] h:mm A",
            lastWeek: "[Last] dddd [at] h:mm A",
            sameElse: "DD/MM/YYYY [at] h:mm A",
          });

          if (message.isLastItem) return <View style={{ height: 20 }} />;
          return (
            <ListElement formattedDate={formattedDate} message={message} />
          );
        }}
      />
    ),
    [
      messageList,
      isFocused,
      enableInfinityScroll,
      totalNumberOfMessages,
      loading,
    ]
  );

  return (
    <View
      style={{
        backgroundColor: "#2F2F2F",
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
      }}>
      {loading && <ActivityIndicator color="white" />}
      {memoizedFlatList}
      <View
        style={{
          width: "100%",
          paddingLeft: 10,
          paddingRight: 10,
          flexDirection: "row",
          backgroundColor: "#2F2F2F",
          zIndex: 100,
        }}>
        <View style={{ width: "90%" }}>
          <TextInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              paddingLeft: 10,
              paddingTop: 5,
              paddingBottom: 5,
              borderRadius: 40,
            }}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Send message"
          />
        </View>

        <View
          style={{
            width: "10%",
            height: 30,
            marginTop: 5,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <IconButton
            onPress={sendMessage}
            icon="send"
            size={30}
            iconColor="white"
          />
        </View>
      </View>
    </View>
  );
};

export default Chats;
