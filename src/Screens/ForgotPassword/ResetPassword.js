import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import {
  spacing,
  fontSizes,
  color,
  buttonSize,
  buttonType,
  validatePassword,
  DEBUG_BUILD,
  STAGE_FAQ,
  PROD_FAQ,
} from "../../Utilities/Constants/Constant";
import { useDispatch, useSelector } from "react-redux";
import { strings } from "../../Utilities/Language";
import { Toast } from "../../Components/Toast";
import { CustomInput } from "../../Components/CustomInput";
import { Button, TextInput, useTheme, Text, Divider } from "react-native-paper";

import { changePassword } from "../../Screens/ForgotPassword/ForgotPasswordDispatcher";
import { CustomActivityIndicator } from "../../Components/CustomActivityIndicator";
import { ClearSpace } from "../../Components/ClearSpace";
import { CustomButton } from "../../Components/CustomButton";

const ResetPassword = ({ route, navigation }) => {
  const { colors } = useTheme();
  let login = useSelector((state) => state.login);
  let forgot = useSelector((state) => state.forgot);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const [secureTextEntryOld, setsecureTextEntryOld] = useState(true);
  const [secureTextEntryConfim, setsecureTextEntryConfim] = useState(true);
  // const { email, inviteToken, isChangePassword } = route.params;
  const { email, inviteToken, isChangePassword } = {
    email: "dash.surjeet@gmail.com",
    inviteToken:
      "bf772324d84e182d911b90386fcca07c058fa05e5ac98e48ff501a985734a0dc",
    isChangePassword: true,
  };
  const hideShowClickOld = () => {
    setsecureTextEntryOld(!secureTextEntryOld);
  };
  const hideShowClick = () => {
    setsecureTextEntry(!secureTextEntry);
  };
  const hideShowClickConfirm = () => {
    setsecureTextEntryConfim(!secureTextEntryConfim);
  };

  const onOldPasswordChange = (textStr) => {
    setOldPassword(textStr);
  };

  const onPasswordChange = (textStr) => {
    setPassword(textStr);
  };

  const onConfirmPasswordChange = (textStr) => {
    setConfirmPassword(textStr);
  };

  const onSubmitPasswordChanged = () => {
    if (password == confirmPassword) {
      requestChangePassword();
    } else {
      Alert.alert(strings.attention, strings.password_not_match, [
        { text: strings.ok, onPress: () => {} },
      ]);
    }
  };

  const dispatch = useDispatch([changePassword]);
  const requestChangePassword = () => {
    if (validatePassword(password)) {
      dispatch(
        changePassword(
          email,
          oldPassword,
          password,
          confirmPassword,
          navigation
        )
      );
    } else {
      Alert.alert(strings.attention, strings.passwordValidError, [
        {
          text: strings.ok,
          onPress: () => {},
        },
      ]);
    }
  };
  const showSuccessMessage = (message) => {
    Alert.alert(strings.attention, message, [
      {
        text: strings.ok,
        onPress: () => {
          navigation.navigate("Splash", {});
        },
      },
    ]);
  };
  const showErrorMessage = (message) => {
    return (
      <View style={{ marginTop: spacing.HEIGHT_6, flexDirection: "row" }}>
        <Text style={styles.errorText}>{message}</Text>
      </View>
    );
  };
  orSection = () => {
    if (isChangePassword) return null;
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
    <View
      style={{
        ...styles.container,
        ...{ marginTop: isChangePassword ? 15 : 45 },
      }}
    >
      {/* Header */}
      <ScrollView
        style={{
          flexGrow: 1,
          paddingHorizontal: spacing.WIDTH_30,
          paddingTop: isChangePassword ? 0 : spacing.HEIGHT_40 * 2,
        }}
        nestedScrollEnabled={true}
      >
        <View style={{ marginBottom: 30 }}>
          <Text variant="bodyMedium">Email Address : {email}</Text>
        </View>

        <View style={{ marginBottom: spacing.HEIGHT_20 }}>
          <CustomInput
            onChangeText={(text) => onOldPasswordChange(text)}
            value={oldPassword}
            caption={
              isChangePassword
                ? strings.old_password
                : strings.temporary_password
            }
            placeHolder={strings.temporary_password}
            secureTextEntry={secureTextEntryOld}
            right={
              <TextInput.Icon
                onPress={hideShowClickOld}
                theme={{ colors: { onSurfaceVariant: colors.gray } }}
                style={{ width: 23, height: 23 }}
                icon={
                  secureTextEntryOld
                    ? require("../../Assets/icons/ic_password_show.png")
                    : require("../../Assets/icons/ic_password_hide.png")
                }
              />
            }
          />
        </View>
        <View style={{ marginBottom: spacing.HEIGHT_20 }}>
          <CustomInput
            onChangeText={(text) => onPasswordChange(text)}
            value={password}
            caption={strings.new_password}
            placeHolder={strings.new_password}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                onPress={hideShowClick}
                theme={{ colors: { onSurfaceVariant: colors.gray } }}
                style={{ width: 23, height: 23 }}
                icon={
                  secureTextEntry
                    ? require("../../Assets/icons/ic_password_show.png")
                    : require("../../Assets/icons/ic_password_hide.png")
                }
              />
            }
          />
        </View>

        <View style={{ marginBottom: spacing.HEIGHT_20 }}>
          <CustomInput
            onChangeText={(text) => onConfirmPasswordChange(text)}
            value={confirmPassword}
            caption={strings.confirmPassword}
            placeHolder={strings.confirmPassword}
            secureTextEntry={secureTextEntryConfim}
            right={
              <TextInput.Icon
                onPress={hideShowClickConfirm}
                theme={{ colors: { onSurfaceVariant: colors.gray } }}
                style={{ width: 23, height: 23 }}
                icon={
                  secureTextEntryConfim
                    ? require("../../Assets/icons/ic_password_show.png")
                    : require("../../Assets/icons/ic_password_hide.png")
                }
              />
            }
          />
        </View>
        <View>
          <CustomButton
            loading={forgot?.initForgotPassword}
            label={
              isChangePassword
                ? strings.change_password
                : strings.reset_password
            }
            isDisabled={
              oldPassword == "" || password == "" || confirmPassword == ""
            }
            onPress={onSubmitPasswordChanged}
          />

          {!forgot.initForgotPassword &&
            forgot?.loggedProfile.status == "200" &&
            showSuccessMessage(forgot?.loggedProfile?.message)}
          {!forgot.initForgotPassword &&
            forgot?.loggedProfile.status != "200" &&
            showErrorMessage(forgot?.loggedProfile?.message)}
        </View>

        {orSection()}
        {!isChangePassword && (
          <View>
            <Text style={styles.noAccText}>{strings.dont_account}</Text>
            <Pressable
              onPress={() => navigation.navigate("Register with us", {})}
            >
              <Text style={styles.rgisterText}>
                {strings.register_with_us.toUpperCase()}
              </Text>
            </Pressable>
          </View>
        )}

        {/* {
          orSection()
        }

        <View style={{ marginTop: spacing.HEIGHT_32 }}>
          <Button
            size={buttonSize.LARGE}
            img={require('../../Assets/icons/ic_goole_logo.png')}
            imgPro={{ marginRight: spacing.HEIGHT_5, height: spacing.WIDTH_16, width: spacing.WIDTH_16, }}
            label={strings.sign_up_with_google}
            bgColor={color.BCAE_LIGHT_BLUE_3}
            textPro={{ color: color.WHITE, fontSize: fontSizes.FONT_16, fontWeight: '500', lineHeight: spacing.HEIGHT_19 }}
          />
        </View>

        <View style={{ marginTop: spacing.HEIGHT_10 }}>
          <Button
            size={buttonSize.LARGE}
            img={require('../../Assets/icons/ic_apple_logo.png')}
            imgPro={{ marginRight: spacing.HEIGHT_5, height: spacing.WIDTH_16, width: spacing.WIDTH_16, }}
            label={strings.sign_up_with_apple}
            bgColor={color.BLACK}
            textPro={{ color: color.WHITE, fontSize: fontSizes.FONT_16, fontWeight: '500', lineHeight: spacing.HEIGHT_19 }}
          />
        </View> */}

        <View style={{ paddingBottom: spacing.HEIGHT_40 * 3 }} />
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9C8FC4",
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
  noAccText: {
    marginTop: spacing.HEIGHT_32,
    color: color.PLACEHOLDER,
    fontSize: fontSizes.FONT_12,
    lineHeight: spacing.WIDTH_14,
    textAlign: "center",
  },
  rgisterText: {
    marginTop: spacing.HEIGHT_6,
    fontWeight: "500",
    color: color.BCAE_PRIMARY,
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

export default ResetPassword;
