import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import {
  spacing,
  fontSizes,
  color,
  buttonSize,
  DEBUG_BUILD,
  STAGE_FAQ,
  PROD_FAQ,
  WEBCLIENT_ID,
} from "../../Utilities/Constants/Constant";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "react-native-google-signin";
import { capitalizeFirstLetter } from "../../Utilities/utils";
import { strings } from "../../Utilities/Language";

import CustomerEmailLogin from "./component/CustomerEmailLogin";
import MobileLoging from "./component/MobileLoging";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../Components/Toast";
import { KeyboardAwareView } from "react-native-keyboard-aware-view";
import { resetLogin, verifyLoginData } from "./LoginDispatcher";
import {
  requestUserPermission,
  notificationListener,
} from "../../Utilities/FCM/NotificationService";
import { ToggleButton } from "../../Components/ToggleButton";
import { Button, RadioButton } from "react-native-paper";
import { SvgBG } from "../../Components/SvgBG";

const BUSINESS = "business";
const CONSUMER = "consumer";
const EMAIL = "Email Address";
const MOBILE = "Mobile Number";

export const Login = ({ navigation }) => {
  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      requestUserPermission();
      notificationListener(navigation);
    });
    return willFocusSubscription;
  }, []);

  const [userType, setUserType] = useState(BUSINESS);
  const [loginMode, setLoginMode] = useState(EMAIL);
  const [isFirstSelected, setFirstSelected] = useState(true);

  let login = useSelector((state) => state.login);
  const dispatch = useDispatch([resetLogin, verifyLoginData]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["email"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: WEBCLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { accessToken, idToken } = await GoogleSignin.signIn();
      console.log(accessToken, idToken);
      // dispatch(verifyLoginData(props.navigation, "", ""));

      setloggedIn(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert("Cancel");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert("Signin in progress");
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("PLAY_SERVICES_NOT_AVAILABLE");
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onSelectBusinessUserType = () => {
    setFirstSelected(true);
    setUserType(BUSINESS);
  };

  const onSelectConsumerUserType = () => {
    setFirstSelected(false);
    setUserType(CONSUMER);
  };

  const orSection = () => {
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: spacing.HEIGHT_32,
        }}
      >
        <View
          style={{
            width: "43%",
            height: 1,
            backgroundColor: color.DISABLED_GREY,
          }}
        ></View>
        <Text style={styles.orText}>{strings.or}</Text>
        <View
          style={{
            width: "43%",
            height: 1,
            backgroundColor: color.DISABLED_GREY,
            alignContent: "flex-end",
          }}
        ></View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SvgBG />
      <KeyboardAwareView animated={false}>
        <View
          style={{
            paddingHorizontal: spacing.WIDTH_30,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <ScrollView nestedScrollEnabled={true}>
            <View style={{ marginTop: 80, flex: 1 }}>
              <View
                style={{
                  marginBottom: spacing.HEIGHT_20,
                }}
              >
                <ToggleButton
                  isFirstSelected={isFirstSelected}
                  label={{
                    first: capitalizeFirstLetter(BUSINESS),
                    second: capitalizeFirstLetter(CONSUMER),
                  }}
                  bgColor={{
                    selected: color.BCAE_PRIMARY,
                    unselected: color.BCAE_LIGHT_BLUE_2,
                  }}
                  textColor={{
                    selected: color.WHITE,
                    unselected: color.BCAE_PRIMARY,
                  }}
                  textPro={{
                    fontSize: fontSizes.FONT_13,
                    fontWeight: "600",
                    lineHeight: spacing.HEIGHT_16,
                  }}
                  onPressFirst={onSelectBusinessUserType}
                  onPressSecond={onSelectConsumerUserType}
                ></ToggleButton>
              </View>

              {/* Radio Button View */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: spacing.HEIGHT_10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value={EMAIL}
                    status={loginMode === EMAIL ? "checked" : "unchecked"}
                    onPress={() => setLoginMode(EMAIL)}
                  />
                  <Text style={{ color: "#3D3D3D", fontWeight: 600 }}>
                    {capitalizeFirstLetter(EMAIL)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    value={MOBILE}
                    status={loginMode === MOBILE ? "checked" : "unchecked"}
                    onPress={() => setLoginMode(MOBILE)}
                  />
                  <Text style={{ color: "#3D3D3D", fontWeight: 600 }}>
                    {capitalizeFirstLetter(MOBILE)}
                  </Text>
                </View>
              </View>

              {loginMode === EMAIL ? (
                <CustomerEmailLogin
                  navigation={navigation}
                  userType={
                    userType === BUSINESS
                      ? "BusinessCustomer"
                      : "PersonalCustomer"
                  }
                />
              ) : (
                <MobileLoging
                  navigation={navigation}
                  userType={
                    userType === BUSINESS
                      ? "BusinessCustomer"
                      : "PersonalCustomer"
                  }
                />
              )}
            </View>

            {/* <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={googleSignIn}
          /> */}

            <View
              style={{
                marginVertical: spacing.HEIGHT_30,
              }}
            >
              {/* Forgot Password View */}
              <View
                style={{
                  alignSelf: "center",
                  marginVertical: spacing.HEIGHT_20,
                }}
              >
                <Pressable
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotText}>
                    {strings.forgot_password}
                  </Text>
                </Pressable>
              </View>

              {/* Register View */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                <Text style={styles.noAccText}>{strings.dont_account}</Text>
                <Pressable
                  onPress={() => navigation.navigate("Register with us", {})}
                >
                  <Text style={styles.rgisterText}>{strings.register}</Text>
                </Pressable>
              </View>
            </View>
            {/* </ScrollView> */}
            {!login.initLogin &&
              (login?.loggedProfile?.errorCode == "10000" ||
                login?.loggedProfile?.errorCode == "10001") && (
                <View style={styles.toast}>
                  <Toast
                    bgColor={color.TOAST_RED}
                    customStyle={{ paddingHorizontal: spacing.WIDTH_30 }}
                    textPro={{
                      color: color.WHITE,
                      fontSize: fontSizes.FONT_14,
                      fontWeight: "700",
                    }}
                    img={
                      login?.loggedProfile?.errorCode == "10001"
                        ? require("../../Assets/icons/ic_no_Internet.png")
                        : require("../../Assets/icons/ci_error-warning-fill.png")
                    }
                    message={
                      login?.loggedProfile?.errorCode == "10001"
                        ? strings.no_network
                        : strings.something_went_wrong
                    }
                  />
                </View>
              )}
          </ScrollView>
        </View>
      </KeyboardAwareView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.BCAE_OFF_WHITE,
  },
  logo: {
    height: 128,
    width: 128,
  },
  toast: {
    position: "absolute",
    bottom: spacing.HEIGHT_31 * 2,
  },
  orText: {
    color: color.BCAE_LIGHT_BLUE,
    fontSize: fontSizes.FONT_10,
    fontWeight: "500",
    lineHeight: spacing.WIDTH_16,
    paddingHorizontal: spacing.WIDTH_7,
  },
  forgotText: {
    color: "#E22D2D",
    fontSize: fontSizes.FONT_14,
    fontWeight: "500",
  },
  noAccText: {
    color: "#202223",
    fontSize: fontSizes.FONT_12,
    lineHeight: spacing.WIDTH_14,
    textAlign: "center",
    fontWeight: 400,
  },
  rgisterText: {
    fontWeight: "600",
    color: "#202223",
    fontSize: fontSizes.FONT_14,
    lineHeight: spacing.WIDTH_17,
    textAlign: "center",
  },
  upperText: {
    color: color.PLACEHOLDER,
    fontSize: fontSizes.FONT_12,
    fontWeight: "500",
    marginTop: 5,
    lineHeight: spacing.WIDTH_14,
  },
  upperLogo: {
    width: spacing.WIDTH_16,
    height: spacing.WIDTH_16,
  },
});
