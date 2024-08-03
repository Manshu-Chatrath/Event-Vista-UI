import { useLayoutEffect, useEffect, useState } from "react";
import { defaultForgotPasswordStatus } from "../reducers/authSlice";
import { Text, View } from "react-native";
import { PENDING, SUCCESS } from "../reducers/constants";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../reducers/authSlice";
import Loader from "../components/Loader";
import { Button } from "react-native-paper";
import { useForm } from "react-hook-form";
import Form from "../components/form";
const ForgotPassword = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});
  const forgotPasswordStatus = useSelector(
    (state) => state.auth.forgotPasswordStatus
  );
  const forgotPasswordError = useSelector(
    (state) => state.auth.forgotPasswordError
  );
  const type = route.params.type;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Forgot Password",
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#2F2F2F",
        elevation: 0,
      },
    });
  }, [navigation]);

  useEffect(() => {
    return () => dispatch(defaultForgotPasswordStatus());
  }, []);

  useEffect(() => {
    if (forgotPasswordStatus === SUCCESS) {
      navigation.navigate("Otp", {
        type: type,
        isForgotPassword: true,
        formState: formState,
      });
    }
  }, [forgotPasswordStatus]);

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
  };
  const onSubmit = (data) => {
    const { email } = data;
    dispatch(forgotPassword({ email, type }));
    setFormState({ email, type });
  };

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        }}>
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 15,
            borderRadius: 20,
            width: "90%",
            elevation: 8,
            paddingLeft: 4,
            paddingRight: 4,
            backgroundColor: "#2F2F2F",
            alignItems: "center",
          }}>
          {forgotPasswordError ? (
            <Text style={{ textAlign: "center", color: "red" }}>
              {forgotPasswordError}
            </Text>
          ) : null}
          <Form formItems={form} errors={errors} control={control} />
          <Button
            style={{
              backgroundColor: "#F44336",
              width: "90%",
              marginTop: 15,
            }}
            labelStyle={{ color: "white" }}
            onPress={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </View>
      </View>
      {forgotPasswordStatus === PENDING ? <Loader /> : null}
    </>
  );
};

export default ForgotPassword;
