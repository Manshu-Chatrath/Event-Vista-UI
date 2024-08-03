import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import {
  initiateSignUpClient,
  defaultInitiateSignupStatus,
  defaultFinalSignupStatus,
  defaultForgotPasswordStatus,
  initiateSignUpOrganizer,
  defaultVerifyPassword,
  forgotPassword,
  verifyPassword,
  finalSignUpOrganizer,
} from "../reducers/authSlice";
import * as Clipboard from "expo-clipboard";
import { PENDING, SUCCESS, FAILED } from "../reducers/constants";
import { Controller } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { finalSignUpClient } from "../reducers/authSlice";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
const Otp = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [time, setTime] = useState({ minutes: 0, seconds: 45 });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "OTP",
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#2F2F2F",
        elevation: 0,
      },
    });
  }, [navigation]);
  useEffect(() => {
    const timer = setTimeout(() => {
      let timer2;
      if (time.minutes <= 0 && time.seconds <= 0) {
        clearTimeout(timer);
      } else {
        setTime((prevTime) => {
          const seconds = prevTime.seconds - 1;
          const minutes = prevTime.minutes;
          if (seconds < 0) {
            timer2 = { seconds: 59, minutes: minutes - 1 };
          } else {
            timer2 = { seconds: seconds, minutes: minutes };
          }
          return timer2;
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  const initiateSignUpStatus = useSelector(
    (state) => state.auth.initiateSignUpStatus
  );
  const forgotPasswordStatus = useSelector(
    (state) => state.auth.forgotPasswordStatus
  );
  const verifyPasswordStatus = useSelector(
    (state) => state.auth.verifyPasswordStatus
  );
  const verifyPasswordError = useSelector(
    (state) => state.auth.verifyPasswordError
  );
  const finalSignUpStatus = useSelector(
    (state) => state.auth.finalSignUpStatus
  );
  const finalSignUpStatusError = useSelector(
    (state) => state.auth.finalSignUpStatusError
  );
  const isForgotPassword = route.params?.isForgotPassword;

  const forgotPasswordError = useSelector(
    (state) => state.auth.forgotPasswordError
  );

  useEffect(() => {
    if (initiateSignUpStatus === SUCCESS) {
      setTime({ minutes: 0, seconds: 45 });
    }

    if (initiateSignUpStatus === SUCCESS || initiateSignUpStatus === FAILED) {
      dispatch(defaultInitiateSignupStatus());
    }
    if (finalSignUpStatus === SUCCESS || finalSignUpStatus === FAILED) {
      dispatch(defaultFinalSignupStatus());
    }
    if (finalSignUpStatus === SUCCESS) {
      setTime({ minutes: 0, seconds: 0 });
      navigation.navigate("Login", {
        type: route.params?.type,
      });
    }
  }, [initiateSignUpStatus, finalSignUpStatus]);

  useEffect(() => {
    if (verifyPasswordStatus === SUCCESS) {
      if (route.params.type === "client") {
        navigation.navigate("ClientDashBoard", {
          type: "client",
        });
      } else {
        navigation.navigate("OrganizerDashBoard", {
          type: "organizer",
        });
      }
    }
    if (forgotPasswordStatus === SUCCESS) {
      setTime({ minutes: 2, seconds: 45 });
    }
  }, [verifyPasswordStatus, forgotPasswordStatus, route]);

  useEffect(() => {
    return () => {
      dispatch(defaultForgotPasswordStatus());
      dispatch(defaultVerifyPassword());
    };
  }, []);

  const form = {
    firstDigit: {
      name: "firstDigit",
      rules: {
        required: "Please all the digits",
      },
    },
    secondDigit: {
      name: "secondDigit",
      rules: {
        required: "Please all the digits",
      },
    },
    thirdDigit: {
      name: "thirdDigit",
      rules: {
        required: "Please all the digits",
      },
    },
    fourthDigit: {
      name: "fourthDigit",
      rules: {
        required: "Please all the digits",
      },
    },
  };
  const onSubmit = (data) => {
    const { firstDigit, secondDigit, thirdDigit, fourthDigit } = data;
    const email = route.params.formState.email;
    const digit =
      firstDigit + "" + secondDigit + "" + thirdDigit + "" + fourthDigit;
    if (isForgotPassword) {
      dispatch(
        verifyPassword({
          email,
          otp: digit,
          type: route.params.type === "client" ? "client" : "organizer",
        })
      );
    } else {
      if (route.params.type === "organizer") {
        dispatch(
          finalSignUpOrganizer({
            otp: digit,
            email,
          })
        );
      } else {
        dispatch(finalSignUpClient({ otp: digit, email }));
      }
    }
  };

  const resendOtp = () => {
    const {
      email,
      password = null,
      username = null,
      contactNumber = null,
    } = route.params?.formState;
    if (isForgotPassword) {
      dispatch(
        forgotPassword({
          email,
          type: route.params.type === "client" ? "client" : "organizer",
        })
      );
    } else {
      if (route.params.type === "organizer") {
        dispatch(
          initiateSignUpOrganizer({
            email,
            password,
            username,
            contactNumber,
          })
        );
      } else {
        dispatch(initiateSignUpClient({ email, password, username }));
      }
    }
  };

  const pasteText = (clipboardContent) => {
    if (clipboardContent.length === 4) {
      setValue("firstDigit", clipboardContent[0]);
      setValue("secondDigit", clipboardContent[1]);
      setValue("thirdDigit", clipboardContent[2]);
      setValue("fourthDigit", clipboardContent[3]);
    }
  };

  const forms = useMemo(() => {
    const arr = [];
    let index = 0;
    for (const formItem in form) {
      index++;
      arr.push(
        <View key={index} style={{ width: "18%" }}>
          <Controller
            control={control}
            defaultValue=""
            name={form[formItem].name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                ref={
                  formItem === "firstDigit"
                    ? inputRefs[0]
                    : formItem === "secondDigit"
                    ? inputRefs[1]
                    : formItem === "thirdDigit"
                    ? inputRefs[2]
                    : inputRefs[3]
                }
                value={value}
                error={errors?.[formItem]}
                keyboardType="numeric"
                onChangeText={async (text) => {
                  console.log(text);
                  const clipboardContent = await Clipboard.getStringAsync();
                  if (
                    /^\d{4}$/.test(clipboardContent) &&
                    text === clipboardContent
                  ) {
                    pasteText(clipboardContent);
                  }
                  if (text.length <= 1) {
                    if (text) {
                      if (formItem === "firstDigit") {
                        inputRefs[1].current.focus();
                      } else if (formItem === "secondDigit") {
                        inputRefs[2].current.focus();
                      } else {
                        inputRefs[3].current.focus();
                      }
                    }

                    onChange(text);
                  }
                }}
                style={{
                  backgroundColor: "white",
                  textAlign: "center",
                }}
              />
            )}
          />
        </View>
      );
    }
    return arr;
  }, [form, control, handleSubmit]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View
        style={{
          paddingTop: 20,
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft: "5%",
          justifyContent: "center",
          marginRight: "5%",
          elevation: 8,
          paddingBottom: 20,
          backgroundColor: "#2F2F2F",
          borderRadius: 20,
        }}>
        {finalSignUpStatusError ? (
          <Text
            style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {finalSignUpStatusError}
          </Text>
        ) : null}

        {verifyPasswordError ? (
          <Text
            style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {verifyPasswordError}
          </Text>
        ) : null}

        {forgotPasswordError ? (
          <Text
            style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {forgotPasswordError}
          </Text>
        ) : null}

        <Text
          style={{
            marginTop: 20,
            marginBottom: 20,
            textAlign: "center",
            color: "white",
          }}>
          Enter the 4-digit OTP sent to your email valid for
          {time.minutes < 10 ? " 0" + time.minutes : time.minutes}:
          {time.seconds < 10 ? " 0" + time.seconds : time.seconds}.
        </Text>

        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}>
          {forms}
        </View>
        <View style={{ justifyContent: "center" }}>
          <View>
            <Button
              style={{
                marginTop: 20,
                backgroundColor: "#F44336",
                width: "94%",
                alignSelf: "center",
                opacity: time.minutes < 0 && time.seconds < 0 ? 0.5 : 1,
              }}
              labelStyle={{ color: "white" }}
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={time.minutes <= 0 && time.seconds <= 0}>
              Submit
            </Button>
          </View>
          <View>
            <Button
              style={{
                marginTop: 5,
                backgroundColor: "#F44336",
                width: "94%",
                alignSelf: "center",
                opacity: time.minutes <= 0 && time.seconds <= 0 ? 1 : 0.5,
              }}
              labelStyle={{ color: "white" }}
              mode="contained"
              disabled={time.minutes > 0 || time.seconds > 0}
              onPress={resendOtp}>
              Resend
            </Button>
          </View>
        </View>
        {finalSignUpStatus === PENDING ||
        initiateSignUpStatus === PENDING ||
        forgotPasswordStatus === PENDING ||
        (verifyPasswordStatus === PENDING &&
          time?.minutes &&
          time?.seconds &&
          time.minutes >= 0 &&
          time.seconds > 0) ? (
          <Loader />
        ) : null}
      </View>
    </View>
  );
};

export default Otp;
