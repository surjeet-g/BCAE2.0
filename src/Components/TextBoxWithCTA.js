import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import {
  buttonSize,
  color,
  fontSizes,
  spacing,
} from "../Utilities/Constants/Constant";

import theme from "../Utilities/themeConfig";
import { CustomActivityIndicator } from "./CustomActivityIndicator";
export const TextBoxWithCTA = (props) => {
  const { roundness, colors } = useTheme();
  const [active, setActive] = useState(false);

  let customStyle = props.customStyle ?? {};
  let btnTextPro = props.btnTextPro ?? {};
  let bgColor = colors.yellow;
  let onClicked = props.onPress ?? null;
  let isDisableButton = props.isDisableButton ?? false;

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.placeHolderText}>{props.placeHolder}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {props?.correctOtp && (
          <View style={{ borderRadius: 10, ...styles.correctStyle }}>
            <Image source={require("../Assets/icons/Verify.png")} />
          </View>
        )}
        {props?.loader ? (
          <View
            style={{
              backgroundColor: color.BLACK,
              borderRadius: 10,
              ...styles.ctaStyle,
            }}
          >
            <CustomActivityIndicator
              size={buttonSize.SMALL}
              bgColor={color.BLACK}
              loderColor={color.WHITE}
            />
          </View>
        ) : props?.label ? (
          <TouchableOpacity
            onPress={onClicked}
            disabled={isDisableButton}
            style={{
              borderRadius: 10,
              backgroundColor: isDisableButton ? color.BLACK : bgColor,
              ...styles.ctaStyle,
            }}
          >
            <Text style={{ ...btnTextPro }}>{props.label}</Text>
          </TouchableOpacity>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            marginVertical: spacing.HEIGHT_3,
            height: 45,
            backgroundColor: colors.background,
            borderRadius: 10,
            borderColor: colors.gray,
            borderWidth: active ? 2 : 1,
            borderStyle: "solid",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          {props?.isResendOTP && props?.countryCode != "" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                position: "absolute",
                zIndex: 1,
                justifyContent: "space-between",
                width: spacing.WIDTH_35 * 2,
                marginTop: 5,
                marginLeft: 10,
              }}
              onPress={() => {
                props?.onPressOnCountyCode && props.onPressOnCountyCode();
              }}
            >
              <Text
                style={{
                  color: color.DARK_GREY,
                  fontSize: fontSizes.FONT_14,
                  fontWeight: "500",
                }}
              >
                {props.countryCode}{" "}
                <Image
                  source={require("../Assets/icons/ci_dropdown.png")}
                  style={{ width: spacing.WIDTH_16, height: spacing.WIDTH_16 }}
                />
              </Text>
            </TouchableOpacity>
          )}
          <TextInput
            onFocus={() => {
              setActive(true);
            }}
            onBlur={() => {
              setActive(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={
              props?.isResendOTP && props?.countryCode == "" ? false : true
            }
            placeholder={
              props?.isResendOTP && props?.countryCode != ""
                ? ""
                : props.placeHolder
            }
            onChangeText={(text) => props.onChangeText(text)}
            style={{
              color: color.secondary,
              ...styles.textInput,
              ...customStyle,
              paddingLeft:
                props?.isResendOTP && props?.countryCode != ""
                  ? spacing.WIDTH_37 * 2
                  : 0,
            }}
            keyboardType={props.keyboardType ? props.keyboardType : "default"}
            value={props.value}
            onSubmitEditing={() =>
              props.onSubmitEditing ? props.onSubmitEditing : null
            }
            maxLength={props.maxLength || 100}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placeHolderText: {
    color: "#000000",
    fontSize: fontSizes.FONT_14,
    fontWeight: "400",
    marginBottom: spacing.WIDTH_5,
    marginLeft: spacing.WIDTH_10,
  },
  textInput: {
    width: "100%",
    height: 40,
    // borderBottomColor: color.INPUT_TEXT_BORDER,
    // borderBottomWidth: 0.8,
    // color: color.BCAE_PRIMARY,
    fontSize: fontSizes.FONT_14,
    fontWeight: "500",
  },
  ctaStyle: {
    position: "absolute",
    marginRight: 12,
    right: 0,
    bottom: 8,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    zIndex: 1,
    padding: spacing.WIDTH_10,
    // borderRadius: spacing.HEIGHT_3,
    justifyContent: "center",
    alignItems: "center",
    height: spacing.HEIGHT_34,
  },

  correctStyle: {
    position: "absolute",
    right: 0,
    bottom: 10,
    marginRight: 120,
    zIndex: 1,

    justifyContent: "center",
    alignItems: "center",
    height: spacing.HEIGHT_38,
  },
});
