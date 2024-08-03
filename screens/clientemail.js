import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useForm } from "react-hook-form";
import SimpleHeader from "../components/simpleHeader";
import Form from "../components/form";
import Loader from "../components/Loader";
import { defaultInitiateSignupStatus } from "../reducers/authSlice";
import { initiateSignUpClient } from "../reducers/authSlice";
import { FAILED, PENDING, SUCCESS } from "../reducers/constants";
const ClientEmail = ({ navigation, route }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const type = route.params?.type;
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});
  const initiateSignUpStatus = useSelector(
    (state) => state.auth.initiateSignUpStatus
  );
  const initiateSignUpStatusError = useSelector(
    (state) => state.auth.initiateSignUpStatusError
  );
  const otpPage = () =>
    navigation.navigate("Otp", {
      type: type,
      formState: formState,
    });

  useEffect(() => {
    if (initiateSignUpStatus === SUCCESS) {
      otpPage();
    }
    return () => {
      if (initiateSignUpStatus === SUCCESS || initiateSignUpStatus === FAILED) {
        return dispatch(defaultInitiateSignupStatus());
      }
    };
  }, [initiateSignUpStatus]);

  const form = {
    username: {
      label: "Username",
      name: "username",
      type: "default",
      rules: {
        required: "Please enter your username!",
        minLength: {
          value: 5,
          message: "Username must be of 5 characters!",
        },
      },
    },
    email: {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      type: "email-address",
      rules: {
        required: "Please enter your email!",
      },
    },
    password: {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      type: "default",
      rules: {
        required: "Password is required!",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters!",
        },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          message:
            "Password must have at least one uppercase letter, one number, and one special character!",
        },
      },
    },
    confirmPassword: {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "default",
      placeholder: "Confirm password",
      rules: {
        required: "Please confirm your password!",
        validate: (value) => {
          return value === watch("password") || "The password does not match";
        },
      },
    },
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#2F2F2F",
        elevation: 0,
      },
    });
  }, [navigation]);

  const onSubmit = (data) => {
    const { email, password, username } = data;
    dispatch(initiateSignUpClient({ email, password, username, type }));
    setFormState({ email, password, username });
  };

  const handleClick = () =>
    navigation.navigate("Login", {
      type: type,
    });
  return (
    <>
      <SimpleHeader title={"Register"} handleClick={handleClick} />
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
          backgroundColor: "#2F2F2F",
        }}>
        <View
          style={{
            paddingTop: 43,
            paddingBottom: 43,
            paddingLeft: 26,
            paddingRight: 26,
            borderRadius: 20,
            width: "86%",
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.23,
            shadowRadius: 12.81,
            elevation: 16,
            backgroundColor: "#2F2F2F",
            alignItems: "center",
          }}>
          {initiateSignUpStatusError ? (
            <Text style={{ textAlign: "center", color: "red" }}>
              {initiateSignUpStatusError}
            </Text>
          ) : null}

          <Form formItems={form} errors={errors} control={control} />
          <Button
            style={{
              backgroundColor: "#F44336",
              width: "90%",
              marginTop: 8,
              borderRadius: 12,
            }}
            labelStyle={{ color: "white" }}
            onPress={handleSubmit(onSubmit)}>
            Submit
          </Button>

          {initiateSignUpStatus === PENDING ? <Loader /> : null}
        </View>
      </View>
    </>
  );
};
export default ClientEmail;
