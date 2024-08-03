import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IconButton, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Form from "./form";
import * as FileSystem from "expo-file-system";
import { FAILED, SUCCESS } from "../reducers/constants";
import { editUser } from "../reducers/accountSlice";
import { useSelector, useDispatch } from "react-redux";
import { imageUpload } from "../reducers/accountSlice";
import { getAuthenticatedUser } from "../reducers/accountSlice";
import {
  defaultImageUploadStatus,
  defaultEditUserStatus,
  defaultAuthenticatedUser,
} from "../reducers/accountSlice";
import { useForm } from "react-hook-form";
import { ImageBackground } from "react-native";
import Loader from "./Loader";
const EditProfile = () => {
  const user = useSelector((state) => state.account?.user);
  const dispatch = useDispatch();

  const [permissionStatus, setPermissionStatus] = useState(null);
  const imageUploadStatus = useSelector(
    (state) => state.account.imageUploadStatus
  );
  const getAuthenticatedUserStatus = useSelector(
    (state) => state.account.getAuthenticatedUserStatus
  );
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const editUserStatus = useSelector((state) => state.account.editUserStatus);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);
  const onSubmit = (data) => {
    setLoading(true);
    dispatch(editUser({ password: data.password }));
  };

  useEffect(() => {
    if (
      getAuthenticatedUserStatus === SUCCESS ||
      getAuthenticatedUserStatus === FAILED
    ) {
      setLoading(false);
      dispatch(defaultAuthenticatedUser());
    }
  }, [getAuthenticatedUserStatus]);

  useEffect(() => {
    if (
      imageUploadStatus === SUCCESS ||
      (imageUploadStatus === FAILED && user)
    ) {
      dispatch(getAuthenticatedUser());
      dispatch(defaultImageUploadStatus());
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (editUserStatus === SUCCESS || editUserStatus === FAILED) {
      dispatch(defaultEditUserStatus());
      dispatch(getAuthenticatedUser());
    }
  }, [editUserStatus]);

  const form = {
    eventName: {
      label: "Username",
      name: "username",
      placeholder: "Username",
      value: user.username,
      disabled: true,
      icon: true,
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
          const response = await fetch(result.assets[0].uri);

          const blob = await response.blob();

          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          setLoading(true);

          dispatch(
            imageUpload({
              image: base64,
              type: user.type,
              id: user.id,
              imageType: blob.type,
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Permission to access media library needed.");
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        width: "96%",
        alignItems: "center",
      }}>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          marginTop: 10,
          width: 180,
          height: 180,
          borderRadius: 180,
          overflow: "hidden",
        }}>
        <ImageBackground
          source={user?.src ? { uri: user.src } : null}
          resizeMode="cover"
          style={{
            width: 180,
            height: 180,
            borderRadius: 100,
            opacity: 0.75,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                opacity: 1,
                fontWeight: "bold",
              }}>
              Change Photo
            </Text>
          </View>
          <View
            style={{
              width: 28,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <IconButton icon="camera-outline" size={24} iconColor="white" />
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <View style={{ marginTop: 20, width: "100%" }}>
        <Form
          isEvent={true}
          errors={errors}
          control={control}
          formItems={form}
        />
      </View>

      <View style={{ width: "100%" }}>
        <Button
          style={{
            backgroundColor: "#F44336",
            width: "100%",
            marginTop: 8,
            borderRadius: 12,
          }}
          onPress={handleSubmit(onSubmit)}
          labelStyle={{
            color: "white",
            backgroundColor: "#F44336",
          }}>
          Submit
        </Button>
      </View>
      {loading ? <Loader /> : null}
    </View>
  );
};

export default EditProfile;
