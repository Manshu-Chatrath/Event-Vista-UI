import React, { useState } from "react";
import { TextInput, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker from Expo
import { Controller } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";
import CustomErrorMessage from "./CustomErrorMessage";
import moment from "moment";

const Form = ({
  formItems,
  timeErrorMessage,
  control,
  errors,
  isSubmit = false,
  startTime = null,
  setStartTime = () => null,
  timezone,
  endTime = null,
  setEndTime = () => null,
  showTimeZone = () => null,
  eventDate = null,
  setEventDate = () => null,
  isEvent = false,
}) => {
  const [changeStartTime, setChangeStartTime] = useState(false);
  const [changeEndTime, setChangeEndTime] = useState(false);
  const [isDateVisible, setIsDateVisible] = useState(false);

  const handleChange = (e) => {
    if (changeStartTime) {
      setChangeStartTime(false);
      setStartTime(e.nativeEvent.timestamp);
    } else if (changeEndTime) {
      setChangeEndTime(false);
      setEndTime(e.nativeEvent.timestamp);
    } else if (isDateVisible) {
      setIsDateVisible(false);
      setEventDate(e.nativeEvent.timestamp);
    }
  };
  const handleStartTimeChange = () => setChangeStartTime(true);
  const handleEndTimeChange = () => setChangeEndTime(true);

  const inputs = () => {
    const arr = [];
    let i = 0;
    for (let key in formItems) {
      i++;

      if (key === "isTime") {
        arr.push(
          <React.Fragment key={i}>
            <TouchableOpacity
              onPress={showTimeZone}
              activeOpacity={1}
              style={{
                flexDirection: "row",
                marginTop: 8,
                justifyContent: "space-between",
                width: "100%",
              }}>
              <TextInput
                placeholder="Timezone"
                outlineColor="transparent" // Add this line
                underlineColor="transparent"
                value={timezone}
                editable={false}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  fontWeight: "800",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginTop: 8,
                justifyContent: "space-between",
                width: "100%",
              }}
              activeOpacity={1}>
              <TouchableOpacity
                onPress={handleStartTimeChange}
                style={{ width: "45%" }}
                activeOpacity={1}>
                <TextInput
                  placeholder="Start Time"
                  keyboardType="numeric"
                  textColor={
                    !startTime && !endTime && isSubmit ? "#F44336" : "black"
                  }
                  placeholderTextColor={
                    !startTime && !endTime && isSubmit ? "#F44336" : "black"
                  }
                  outlineColor="transparent" // Add this line
                  underlineColor="transparent"
                  editable={false}
                  value={
                    startTime ? moment(startTime).format("hh:mm A") : "00:00 AM"
                  }
                  style={{
                    backgroundColor: "white",

                    borderBottomWidth:
                      !startTime && !endTime && isSubmit ? 2 : 0,
                    borderBottomColor:
                      !startTime && !endTime && isSubmit ? "#F44336" : null,
                  }}
                  right={
                    <TextInput.Icon
                      color={
                        !startTime && !endTime && isSubmit ? "#F44336" : "black"
                      }
                      icon="clock-outline"
                    />
                  }
                />
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                  To
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleEndTimeChange}
                style={{ width: "45%" }}>
                <TextInput
                  keyboardType="numeric"
                  textColor={
                    !startTime && !endTime && isSubmit ? "#F44336" : "black"
                  }
                  placeholder="End Time"
                  placeholderTextColor={
                    !startTime && !endTime && isSubmit ? "#F44336" : "black"
                  }
                  value={
                    endTime ? moment(endTime).format("hh:mm A") : "00:00 AM"
                  }
                  editable={false}
                  right={
                    <TextInput.Icon
                      color={
                        !startTime && !endTime && isSubmit ? "#F44336" : "black"
                      }
                      icon="clock-outline"
                    />
                  }
                  style={{
                    backgroundColor: "white",
                    borderBottomWidth:
                      !startTime && !endTime && isSubmit ? 2 : 0,
                    borderBottomColor:
                      !startTime && !endTime && isSubmit ? "#F44336" : null,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {timeErrorMessage && (
              <CustomErrorMessage message={timeErrorMessage} />
            )}
          </React.Fragment>
        );
      } else if (key === "isDate") {
        arr.push(
          <React.Fragment key={i}>
            <TouchableOpacity
              onPress={() => setIsDateVisible(true)}
              style={{
                flexDirection: "row",
                marginTop: 8,
                justifyContent: "space-between",
                width: "100%",
              }}
              activeOpacity={1}>
              <TextInput
                placeholder="MM-DD-YYYY"
                outlineColor="transparent" // Add this line
                underlineColor="transparent"
                placeholderTextColor={
                  !eventDate && isSubmit ? "#F44336" : "black"
                }
                value={eventDate ? moment(eventDate).format("MM-DD-YYYY") : ""}
                editable={false}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  borderBottomWidth: !eventDate && isSubmit ? 2 : 0,
                  borderBottomColor: !eventDate && isSubmit ? "#F44336" : null,
                }}
                right={
                  <TextInput.Icon
                    color={!eventDate && isSubmit ? "#F44336" : "black"}
                    icon="calendar-month"
                  />
                }
              />
            </TouchableOpacity>

            {!eventDate && isSubmit && (
              <CustomErrorMessage message="Date is required!" />
            )}
          </React.Fragment>
        );
      } else {
        arr.push(
          <React.Fragment key={i}>
            <Controller
              control={control}
              name={formItems[key].name}
              rules={{ ...formItems[key].rules }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  key={i}
                  mode="flat"
                  onBlur={onBlur}
                  editable={!formItems[key]?.disabled}
                  maxLength={formItems[key].name === "about" ? 1000 : 100}
                  outlineColor="transparent"
                  underlineColor="transparent"
                  label={formItems[key].label}
                  onChangeText={onChange}
                  style={{
                    width: isEvent ? "100%" : "90%",
                    marginTop: 8,
                    backgroundColor: formItems[key]?.disabled
                      ? "lightgray"
                      : "white",
                    borderColor: "transparent",
                  }}
                  multiline={formItems[key].name === "about" ? true : false}
                  numberOfLines={formItems[key].name === "about" ? 5 : 1}
                  placeholder={formItems[key].placeholder}
                  value={formItems[key]?.value ? formItems[key].value : value}
                  secureTextEntry={
                    formItems[key].name === "password" ||
                    formItems[key].name === "confirmPassword"
                  }
                  theme={{
                    colors: {
                      primary: formItems[key]?.disabled ? "gray" : "black",
                      error: "#F44336",
                    },
                  }}
                  error={errors?.[key]}
                  right={
                    formItems[key].name === "eventName" ? (
                      <TextInput.Icon
                        color={errors?.[key] ? "#F44336" : "black"}
                        icon="shield-star-outline"
                      />
                    ) : formItems[key].name === "participantsLimit" ? (
                      <TextInput.Icon
                        color={errors?.[key] ? "#F44336" : "black"}
                        icon="account-supervisor-outline"
                      />
                    ) : null
                  }
                  keyboardType={
                    formItems[key]?.type ? formItems[key].type : "default"
                  }
                />
              )}
            />
            {errors[key] && (
              <CustomErrorMessage message={errors[key].message} />
            )}
          </React.Fragment>
        );
      }
    }
    return arr;
  };

  return (
    <>
      {inputs()}
      {changeStartTime || changeEndTime || isDateVisible ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <DateTimePicker
            mode={
              changeStartTime || changeEndTime
                ? "time"
                : isDateVisible
                ? "date"
                : null
            }
            value={new Date()}
            minimumDate={new Date().setDate(new Date().getDate() + 1)}
            display="default"
            onChange={handleChange}
          />
        </View>
      ) : null}
    </>
  );
};

export default Form;
