import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { verifyLoginData, resetLogin } from "../LoginDispatcher";
import { useDispatch, useSelector } from "react-redux";
import {
  spacing,
  fontSizes,
  color,
} from "../../../Utilities/Constants/Constant";
import { strings } from "../../../Utilities/Language";

import { TextInput, useTheme } from "react-native-paper";
import { CustomInput } from "../../../Components/CustomInput";
import { CustomButton } from "../../../Components/CustomButton";
import { CustomErrorText } from "../../../Components/CustomErrorText";

const CustomerEmailLogin = (props) => {
  const { userType, navigation } = props;
  let login = useSelector((state) => state.login);

  // const [username, setUsername] = useState("vipinv0647@gmail.com");
  // const [password, setPassword] = useState("Test@123");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [secureTextEntry, setsecureTextEntry] = useState(true);

  const dispatch = useDispatch([verifyLoginData, resetLogin]);

  const onIDChange = (textStr) => {
    setUsername(textStr);
    if (textStr.length == 0) {
      dispatch(resetLogin());
    }
    setUsernameError("");
  };

  const onPasswordChange = (textStr) => {
    setPassword(textStr);
    if (textStr.length == 0) {
      dispatch(resetLogin());
    }
    setPasswordError("");
  };

  const clearTextClick = () => {
    setUsername("");
    dispatch(resetLogin());
  };

  const hideShowClick = () => {
    setsecureTextEntry(!secureTextEntry);
  };

  const submit = () => {
    if (username.includes("@")) {
      if (username === "") {
        setUsernameError(strings.emailValidError);
      } else if (password === "") {
        setPasswordError(strings.passwordValidErrorLogin);
      } else {
        dispatch(
          verifyLoginData(navigation, {
            username,
            password,
            userType,
            loginType: "PASSWORD",
          })
        );
      }
    } else {
      setUsernameError(strings.emailValidError);
    }
  };

  return (
    <View>
      <View style={{ marginBottom: spacing.HEIGHT_20 }}>
        <CustomInput
          caption="Email Address"
          value={username}
          onChangeText={(text) => onIDChange(text)}
          right={
            <TextInput.Icon
              onPress={clearTextClick}
              style={{ width: 23, height: 23 }}
              icon="close"
            />
          }
        />

        {!login.initLogin && login?.loggedProfile?.errorCode == "404" && (
          <CustomErrorText errMessage={login?.loggedProfile?.message} />
        )}
        {usernameError !== "" && <CustomErrorText errMessage={usernameError} />}
      </View>

      <View style={{ marginBottom: spacing.HEIGHT_20 }}>
        <CustomInput
          value={password}
          caption={strings.password}
          placeHolder={strings.password}
          onChangeText={(text) => onPasswordChange(text)}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              onPress={hideShowClick}
              style={{ width: 23, height: 23 }}
              icon={
                secureTextEntry
                  ? require("../../../Assets/icons/ic_password_show.png")
                  : require("../../../Assets/icons/ic_password_hide.png")
              }
            />
          }
        />

        {passwordError !== "" && <CustomErrorText errMessage={passwordError} />}
      </View>

      <Text
        style={{
          textAlign: "center",
          alignSelf: "center",
          marginVertical: spacing.HEIGHT_15,
          color: "#F5AD47",
          fontWeight: "700",
          fontSize: fontSizes.FONT_16,
        }}
        onPress={() => navigation.navigate("VerifyLoginOTP")}
      >
        {strings.login_with_otp}
      </Text>
      {!login.initLogin &&
        login?.loggedProfile?.errorCode &&
        login.loggedProfile.errorCode != "404" &&
        login?.loggedProfile?.errorCode != "10000" &&
        login?.loggedProfile?.errorCode != "10001" && (
          <CustomErrorText errMessage={login?.loggedProfile?.message} />
        )}
      <View>
        <CustomButton
          loading={login.initLogin}
          label={strings.login}
          isDisabled={username == "" || password == "" ? true : false}
          onPress={submit}
        />
      </View>
    </View>
  );
};

export default CustomerEmailLogin;
