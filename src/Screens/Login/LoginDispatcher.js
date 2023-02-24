import {
  initLoginData,
  failureLogin,
  setLoginData,
  resetLoginData,
  setShowSecondLoginAlert,
  resetShowSecondLoginAlertData,
} from "./LoginAction";
import { serverCall } from "../../Utilities/API";
import { endPoints, requestMethod } from "../../Utilities/API/ApiConstants";
import { saveDataToDB, getDataFromDB } from "../../Storage/token";
import {
  storageKeys,
  DEFAULT_PROFILE_IMAGE,
} from "../../Utilities/Constants/Constant";
import { Platform } from "react-native";
import { encryption } from "../../Utilities/Security/Encryption";

export function verifyLoginData(navigation, params) {
  return async (dispatch) => {
    const { username, password, userType, loginType } = params;
    dispatch(initLoginData());

    getDataFromDB(storageKeys.FCM_DEVICE_ID)
      .then(function (deviceId) {
        return deviceId;
      })
      .then(async (fcmDeviceId) => {
        let params = {
          loginId: username,
          password,
          channel: "MOBILE_APP",
          deviceId: fcmDeviceId,
          userType,
          loginType,
        };

        let result = await serverCall(
          endPoints.USER_LOGIN,
          requestMethod.POST,
          params
        );

        if (result.success) {
          console.log("$$$-data", result.data);
          if (result.data?.data?.anotherSession) {
            dispatch(setShowSecondLoginAlert(result));
            dispatch(failureLogin(result));
            // If Ok - call logout and call login api again
          } else {
            let accessTokenData = {
              accessToken: result.data?.data?.accessToken ?? "",
            };
            await saveDataToDB(storageKeys.ACCESS_TOKEN, accessTokenData);
            dispatch(setLoginData(result.data?.data));
            navigation.replace("BottomBar", {});
          }
        } else {
          dispatch(failureLogin(result));
        }
      });
  };
}

export function resetLogin() {
  return async (dispatch) => {
    dispatch(resetLoginData());
  };
}

export function callLogoutAndLogin(userId) {
  console.log("$$$-inside callLogoutAndLogin");
  return async (dispatch) => {
    let result = await serverCall(
      endPoints.LOGOUT_USER + userId,
      requestMethod.DELETE
    );
    console.log("$$$-logout-result", result);
    if (result?.data?.status === 200) {
    }
  };
}

export function resetShowSecondLoginAlert() {
  console.log("$$$-inside resetShowSecondLoginAlert");
  return async (dispatch) => {
    dispatch(resetShowSecondLoginAlertData());
  };
}
