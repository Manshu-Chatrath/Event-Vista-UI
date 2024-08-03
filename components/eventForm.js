import { useState, useEffect, useCallback } from "react";
import Map from "./Map";
import { useFocusEffect } from "@react-navigation/native";
import CustomErrorMessage from "./CustomErrorMessage";
import { Checkbox } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  imageExtractText,
  defaultImageExtractStatus,
  defaultCreateEventStatus,
} from "../reducers/eventSlice";
import Loader from "./Loader";
import moment from "moment";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import {
  imageUpload,
  defaultImageUploadStatus,
} from "../reducers/accountSlice";
import * as timeZone from "moment-timezone";
import { getWebSocketService } from "../services/socket";
import TagList from "./TagList";
import { SUCCESS, FAILED, IDLE, PENDING } from "../reducers/constants";
import { createEvent } from "../reducers/eventSlice";
import { IconButton, Button } from "react-native-paper";
import TimeZoneList from "./TimeZoneList";
import Form from "./form";
import { useForm } from "react-hook-form";
import Address from "./Address";
const EventForm = ({ navigation }) => {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { eventName: null, participantsLimit: null, about: null },
  });
  const dispatch = useDispatch();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const socket = getWebSocketService();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timezone, setTimezone] = useState(timeZone.tz.guess());
  const showModal = () => setVisible(true);
  const [autoFill, setAutoFill] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [region, setRegion] = useState(null);
  const [timeErrorMessage, setTimeErrorMessage] = useState(null);

  const createEventStatus = useSelector(
    (state) => state.events.createEventStatus
  );
  const imageUploadStatus = useSelector(
    (state) => state.account.imageUploadStatus
  );

  const createdEventId = useSelector((state) => state.events.createdEventId);

  const imageExtractTextStatus = useSelector(
    (state) => state.events.imageExtractTextStatus
  );

  const imageTextObj = useSelector((state) => state.events.imageTextObj);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermissionStatus(status);
      })();
      return () => {
        setValue("eventName", null);
        setValue("participantsLimit", null);
        setValue("about", null);
        setIsSubmit(false);
        setImage(null);
        setSelectedTags([]);
        setStartTime(null);
        setRegion(null);
        setTimeErrorMessage(null);
        setEventDate(null);
        setIsFocused(false);
        setEndTime(null);
        setAutoFill(false);
        setVisible(false);
        setLoading(false);
      };
    }, [])
  );

  const convertBase64 = async (img) => {
    const response = await fetch(img);
    const blob = await response.blob();
    const base64 = await FileSystem.readAsStringAsync(img, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return {
      type: "events",
      image: base64,
      id: createdEventId,
      imageType: blob.type,
    };
  };

  useEffect(() => {
    if (autoFill && image) {
      (async () => {
        const imageObj = await convertBase64(image);
        dispatch(imageExtractText({ base64: imageObj.image }));
      })();
    }
  }, [autoFill]);

  const imageFinalUpload = async (img) => {
    try {
      const imageObj = await convertBase64(img);
      if (autoFill && !isSubmit) {
        dispatch(imageExtractText({ base64: imageObj.image }));
      } else if (isSubmit) {
        dispatch(
          imageUpload({
            image: imageObj.image,
            type: "events",
            id: createdEventId,
            imageType: imageObj.imageType,
          })
        );
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    if (permissionStatus === "granted") {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 5],
          quality: 1,
        });
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          imageFinalUpload(result.assets[0].uri);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Permission to access media library needed.");
    }
  };
  function convertToUTCMilliseconds(dateTime, timezone) {
    const timeObject = new Date(dateTime);
    const dateObject = new Date(eventDate);
    const hours = timeObject.getHours();
    const minutes = timeObject.getMinutes();
    const date = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    let selectedMoment = moment.tz(
      `${year}-${month}-${date} ${hours}:${minutes}`,
      "YYYY-MM-DD HH:mm",
      timezone
    );
    let utcMoment = selectedMoment.clone().utc();
    return utcMoment.valueOf();
  }

  const onSubmit = (data) => {
    if (isNaN(startTime) || isNaN(endTime) || !endTime || !startTime) {
      setTimeErrorMessage("Please put value in both the times!");
      return;
    }

    if (startTime && endTime) {
      const isEndTimeAfterStartTime = moment(endTime).isAfter(
        moment(startTime)
      );
      if (!isEndTimeAfterStartTime) {
        setTimeErrorMessage("End time must be after start time!");
        return;
      }
    }
    if (
      eventDate &&
      region &&
      selectedTags.length > 0 &&
      image &&
      createEventStatus === IDLE
    ) {
      dispatch(
        createEvent({
          title: data.eventName,
          participantLimit: data.participantsLimit,
          startTime: convertToUTCMilliseconds(startTime, timezone),
          endTime: convertToUTCMilliseconds(endTime, timezone),
          location: region.address,
          latitude: region.latitude,
          timezone: timezone,
          longitude: region.longitude,
          price: 0,
          about: data.about,
          eventDate: convertToUTCMilliseconds(eventDate, timezone),
          cancel: false,
          tags: selectedTags,
        })
      );
      setLoading(true);
      setTimeErrorMessage(null);
    }
  };

  const form = {
    eventName: {
      label: "Event Name",
      name: "eventName",
      placeholder: "Event Name",
      rules: {
        required: "Please enter event name!",
      },
      icon: true,
    },
    isTime: true,
    isDate: true,
    participantsLimit: {
      label: "Participants Limit",
      name: "participantsLimit",
      placeholder: "Participants Limit",
      type: "numeric",
      rules: {
        required: "Participants limit is required!",
      },
      icon: true,
    },

    about: {
      label: "About",
      name: "about",
      placeholder: "About",
      rules: {
        required: "About is required!",
      },
    },
  };

  useEffect(() => {
    if (createEventStatus === SUCCESS) {
      imageFinalUpload(image);
    } else if (createEventStatus === FAILED) {
      setLoading(false);
    }
  }, [createEventStatus]);

  useEffect(() => {
    if (imageUploadStatus === SUCCESS || imageUploadStatus === FAILED) {
      setLoading(false);
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (imageExtractTextStatus === SUCCESS) {
      setLoading(false);
      for (let key in imageTextObj) {
        if (form?.[key] && imageTextObj[key]) {
          setValue(key, imageTextObj[key]);
        } else if (key === "startTime") {
          setStartTime(moment(imageTextObj[key], "HH:mm").valueOf());
        } else if (key === "endTime") {
          setEndTime(moment(imageTextObj[key], "HH:mm").valueOf());
        } else if (key === "eventDate") {
          setEventDate(moment(imageTextObj[key], "MM-DD-YYYY").valueOf());
        }
      }
    } else if (imageExtractTextStatus === PENDING) {
      setLoading(true);
    } else if (imageExtractText === FAILED) {
      setLoading(false);
    }
  }, [imageExtractTextStatus]);
  const loader = () => {
    if (loading) {
      return <Loader />;
    } else if (createEventStatus === FAILED) {
      return (
        <Loader
          status={createEventStatus}
          defaultFunction={() => dispatch(defaultCreateEventStatus())}
          handleClick={() => dispatch(defaultCreateEventStatus())}
        />
      );
    } else if (imageUploadStatus === FAILED || imageUploadStatus === SUCCESS) {
      return (
        <Loader
          handleClick={() => {
            dispatch(defaultImageUploadStatus());
            dispatch(defaultCreateEventStatus());
            socket.createEventGroupChat(createdEventId, getValues("eventName"));
            navigation.navigate("OrganizerDashBoard");
          }}
          defaultFunction={() => dispatch(defaultImageUploadStatus())}
          status={imageUploadStatus}
        />
      );
    } else if (
      imageExtractTextStatus === FAILED ||
      imageExtractTextStatus === SUCCESS
    ) {
      return (
        <Loader
          status={imageExtractTextStatus}
          handleClick={() => dispatch(defaultImageExtractStatus())}
          defaultFunction={() => dispatch(defaultImageExtractStatus())}
        />
      );
    }
  };

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        paddingBottom: 20,
      }}>
      <TouchableOpacity
        style={{
          height: 200,
          width: "100%",
          borderRadius: 18,
          backgroundColor: "black",
          overflow: "hidden",
          flexDirection: "row",
          justifyContent: "center",
          borderWidth: isSubmit && !image ? 2 : 0,
          borderColor: isSubmit && !image ? "#F44336" : null,
          alignItems: "center",
        }}
        onPress={pickImage}>
        <ImageBackground
          source={image ? { uri: image } : null}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 200,
            borderRadius: 100,
            opacity: image ? 1 : 0.75,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          {image ? null : (
            <>
              <View>
                <Text
                  style={{
                    color: isSubmit && !image ? "#F44336" : "white",
                    fontSize: 16,
                  }}>
                  Upload
                </Text>
              </View>

              <View
                style={{
                  width: 28,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 4,
                }}>
                <IconButton
                  icon="upload"
                  size={24}
                  iconColor={isSubmit && !image ? "#F44336" : "white"}
                />
              </View>
            </>
          )}
        </ImageBackground>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}>
        <View
          style={{
            backgroundColor: autoFill ? "white" : "transparent",
            height: 22, // Set to the height of the Checkbox
            width: 22, // Set to the width of the Checkbox
            justifyContent: "center",
            alignItems: "center",
            marginRight: 5,
            borderRadius: 3,
          }}>
          <Checkbox
            status={autoFill ? "checked" : "unchecked"}
            onPress={() => {
              setAutoFill(!autoFill);
            }}
            style={{ backgroundColor: "black" }}
            color={autoFill ? "black" : "white"}
            uncheckedColor="white"
          />
        </View>

        <Text style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
          Autofill with image
        </Text>
      </View>

      {loader()}
      {visible ? (
        <TimeZoneList
          visible={visible}
          setVisible={setVisible}
          timezone={timezone}
          setTimezone={setTimezone}
        />
      ) : null}
      {isSubmit && !image && (
        <CustomErrorMessage message="Image is required!" />
      )}
      <View style={{ justifyContent: "flex-start", marginLeft: 3 }}>
        <Text
          style={{
            color: selectedTags.length === 0 && isSubmit ? "#F44336" : "white",
            marginTop: 10,
            fontSize: 16,
            fontWeight: 600,
          }}>
          Add Tags (Max 3)
        </Text>
        <View
          style={{
            alignItems: "flex-start",
            marginTop: 5,
            flexDirection: "row",
            flexWrap: "wrap",
          }}>
          <TagList
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
          />
        </View>
        {isSubmit && selectedTags.length === 0 && (
          <CustomErrorMessage message="Atlease select one tag!" />
        )}
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Form
            errors={errors}
            setTimeErrorMessage={setTimeErrorMessage}
            startTime={startTime}
            endTime={endTime}
            showTimeZone={showModal}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            control={control}
            isSubmit={isSubmit}
            eventDate={eventDate}
            timezone={timezone}
            setEventDate={setEventDate}
            isEvent={true}
            formItems={form}
            timeErrorMessage={timeErrorMessage}
          />
          <Address
            setRegion={setRegion}
            region={region}
            isFocused={isFocused}
            isSubmit={isSubmit}
            setIsFocused={setIsFocused}
          />
          {!region && isSubmit && (
            <CustomErrorMessage message="Address is required!" />
          )}

          {region ? <Map region={region} /> : null}
          <Button
            style={{
              backgroundColor: "#F44336",
              width: "100%",
              marginTop: 8,
              borderRadius: 12,
            }}
            onPress={() => {
              setIsSubmit(true);
              handleSubmit(onSubmit)();
            }}
            labelStyle={{
              color: "white",
              backgroundColor: "#F44336",
            }}>
            Create
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  link: {
    color: "green",
  },
  viewer: {
    borderColor: "green",
    borderWidth: 1,
    padding: 5,
  },
  editor: {
    borderColor: "blue",
    borderWidth: 1,
    padding: 5,
  },
  toolbar: {
    borderColor: "red",
    borderWidth: 1,
  },
});
export default EventForm;
