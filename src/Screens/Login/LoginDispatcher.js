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
import Toast from "react-native-toast-message";

export function verifyLoginData(navigation, params) {
  return async (dispatch) => {
    const { loginId, password, userType, loginType, loginMode } = params;
    dispatch(initLoginData());
    console.log("$$$-verifyLoginData-params", params);
    getDataFromDB(storageKeys.FCM_DEVICE_ID)
      .then(function (deviceId) {
        return deviceId;
      })
      .then(async (fcmDeviceId) => {
        let params = {
          loginId,
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
        console.log("$$$-verifyLoginData-result", result);
        if (result.success) {
          if (result.data?.data?.anotherSession) {
            dispatch(setShowSecondLoginAlert(result));
            dispatch(failureLogin(result));
          } else {
            if (result?.data?.data?.status == "TEMP") {
              dispatch(setLoginData(result.data));

              navigation.navigate("ResetPassword", {
                email: result?.data?.data?.email,
                inviteToken: result?.data?.data?.inviteToken,
              });
            } else {
              let accessTokenData = {
                accessToken: result.data?.data?.accessToken ?? "",
              };
              await saveDataToDB(storageKeys.ACCESS_TOKEN, accessTokenData);

              let profileResult = await serverCall(
                endPoints.PROFILE_DETAILS +
                  "/" +
                  result?.data?.data?.user?.customerUuid,
                requestMethod.GET,
                {}
              );

              if (profileResult?.success) {
                let profileData = {
                  userId: result.data?.data?.user?.userId,
                  email: profileResult.data?.data?.customerContact[0].emailId,
                  profilePicture:
                    result.data?.data?.customerPhoto || DEFAULT_PROFILE_IMAGE,
                  customerId: profileResult?.data?.data?.customerId,
                  customerId: profileResult?.data?.data?.customerId,
                  customerUuid: profileResult?.data?.data?.customerUuid,
                  birthDate: profileResult?.data?.data?.birthDate,
                  contactNo:
                    profileResult.data?.data?.customerContact[0]?.mobileNo,
                  status: profileResult?.data?.data?.status,
                  firstName:
                    profileResult?.data?.data?.customerContact[0].firstName,
                  lastName:
                    profileResult?.data?.data?.customerContact[0].lastName,
                  gender: profileResult?.data?.data?.gender,
                  ...profileResult?.data?.data?.customerAddress[0],
                };

                await saveDataToDB(storageKeys.PROFILE_DETAILS, profileData);
                dispatch(setLoginData(result.data));
                navigation.replace("BottomBar", {});
              }
            }
          }
        } else {
          dispatch(failureLogin(result));
          if (result.errorCode === 422) {
            Toast.show({
              type: "bctError",
              text1: result?.message || "",
            });
          }
        }
      });
  };
}

export function resetLogin() {
  return async (dispatch) => {
    dispatch(resetLoginData());
  };
}

export function callLogoutAndLogin(userId, navigation, params) {
  return async (dispatch) => {
    let result = await serverCall(
      endPoints.LOGOUT_USER + userId,
      requestMethod.DELETE
    );
    console.log("$$$-callLogoutAndLogin-logout-result", result);
    if (result?.data?.status === 200) {
      console.log("$$$-callLogoutAndLogin-params", params);
      dispatch(verifyLoginData(navigation, params));
    }
  };
}

export function resetShowSecondLoginAlert() {
  return async (dispatch) => {
    dispatch(resetShowSecondLoginAlertData());
  };
}

export function sendLoginOTPData(navigation, params, toNavigate) {
  console.log("$$$-sendLoginOTPData");
  console.log("$$$-sendLoginOTPData-params", params);
  return async (dispatch) => {
    const { loginId, userType, loginType, loginMode } = params;
    dispatch(initLoginData());
    console.log("$$$-sendLoginOTPData-params-1", params);
    let param = {};
    if (loginMode.includes("Email")) {
      param = {
        reference: loginId,
      };
      url = endPoints.GET_LOGIN_OTP_FOR_EMAIL;
    } else if (loginMode.includes("Mobile")) {
      param = {
        reference: loginId,
        extn: 0,
      };
      url = endPoints.GET_LOGIN_OTP_FOR_MOBILE;
    }

    let result = await serverCall(url, requestMethod.POST, param);
    console.log("$$$-sendLoginOTPData-result", result);

    if (result.success) {
      if (toNavigate) {
        navigation.navigate("VerifyLoginOTP", { ...params });
      } else {
        Toast.show({
          type: "bctSuccess",
          text1: "New OTP has been sent",
        });
      }
    } else {
      dispatch(failureLogin(result));
    }
  };
}
