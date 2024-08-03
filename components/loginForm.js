import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { PENDING, SUCCESS } from "../reducers/constants";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import {
  loginClient,
  loginOrganizer,
  defaultLoginStatus,
} from "../reducers/authSlice";
import { useForm } from "react-hook-form";
import Form from "./form";
import { useEffect } from "react";
const LoginForm = ({ navigation, type }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const form = {
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
  };
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.loginStatus);
  const loginStatusError = useSelector((state) => state.auth.loginStatusError);

  useEffect(() => {
    if (status === SUCCESS) {
      if (type === "client") {
        navigation.navigate("ClientScreen", {
          type: "client",
        });
      } else {
        navigation.navigate("OrganizerScreen", {
          type: "organizer",
        });
      }
    }
  }, [status]);

  useEffect(() => {
    return () => {
      dispatch(defaultLoginStatus());
    };
  }, []);

  const onSubmit = (data) => {
    if (type === "client") {
      dispatch(loginClient(data));
    } else {
      dispatch(loginOrganizer(data));
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", {
      type: type,
    });
  };

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        backgroundColor: "#2F2F2F",
      }}>
      <View
        style={{
          paddingTop: 25,
          paddingBottom: 25,
          borderRadius: 20,
          width: "86%",
          elevation: 10,
          backgroundColor: "#2F2F2F",
          alignItems: "center",
        }}>
        {loginStatusError ? (
          <Text
            style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {loginStatusError}
          </Text>
        ) : null}
        <Form errors={errors} control={control} formItems={form} />
        <Button
          style={{
            backgroundColor: "#F44336",
            width: "90%",
            marginTop: 8,
            borderRadius: 12,
          }}
          onPress={handleSubmit(onSubmit)}
          labelStyle={{
            color: "white",
            backgroundColor: "#F44336",
          }}>
          Log In
        </Button>
        <Button
          onPress={handleForgotPassword}
          labelStyle={{ color: "white", fontWeight: "bold" }}>
          Forgot Password?
        </Button>
        {status === PENDING ? <Loader /> : null}
      </View>
    </View>
  );
};
export default LoginForm;
