import { useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { PENDING, SUCCESS } from "../reducers/constants";
import DefaultHeader from "../components/DefaultHeader";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import EditProfile from "../components/editProfile";
import { useSelector } from "react-redux";
import {
  defaultLocalStorage,
  defaultLogOutStatus,
} from "../reducers/authSlice";
import { useNavigation } from "@react-navigation/native";
const Account = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const logOutStatus = useSelector((state) => state.auth?.logOutStatus);
  useEffect(() => {
    if (logOutStatus === SUCCESS) {
      dispatch(defaultLocalStorage());
      dispatch(defaultLogOutStatus());
      navigation.navigate("Auth");
    }
  }, [logOutStatus]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <DefaultHeader
          settings={true}
          title="Account Settings"
          navigation={navigation}
        />
      ),
    });
  }, [navigation]);
  return (
    <>
      {logOutStatus === PENDING && <Loader />}
      <View
        style={{
          flex: 1,
          backgroundColor: "#2F2F2F",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <EditProfile />
      </View>
    </>
  );
};
export default Account;
