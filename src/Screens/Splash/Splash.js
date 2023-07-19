import React, { useEffect, useState } from "react";
import { Dimensions, Image, ImageBackground, StyleSheet, View } from "react-native";

import { Text, useTheme } from "react-native-paper";

import { CustomButton } from "../../Components/CustomButton";
import { StickyFooter } from "../../Components/StickyFooter";
import { getToken } from "../../Storage/token";
import { color, fontSizes, spacing } from "../../Utilities/Constants/Constant";
import { strings } from "../../Utilities/Language";
import { getLanguage } from "../../Utilities/Language/language";
import { changeLanguage } from "../../Utilities/Language/MulitLanguageSupport";
import { commonStyle } from '../../Utilities/Style/commonStyle';
var { height, width } = Dimensions.get("screen");

const Splash = ({ route, navigation }) => {
  const [counter, setCounter] = useState(1)
  const { colors } = useTheme();
  // const dispatchVersionCheck = useDispatch([getVersionCheckData]);
  // const versioncheck = useSelector((state) => state.versioncheck);

  useEffect(() => {
    const willFocusSubscription = navigation.addListener("focus", () => {
      checkLanguage();
      setTimeout(() => {
        checkLogin()
      }, 1000)

    });
    return willFocusSubscription;
  }, []);



  // const fetchVersionData = async () => {
  //   await dispatchVersionCheck(getVersionCheckData(navigation));
  // };

  // useEffect(() => {
  //   const willFocusSubscription = navigation.addListener("focus", () => {
  //     fetchVersionData();
  //   });
  //   return willFocusSubscription;
  // }, []);

  const checkLanguage = async () => {
    let language = await getLanguage();
    if (language != null && language != undefined) {
      changeLanguage(language);
    } else {
      changeLanguage({ name: "English", langCode: "en" });
    }
    setCounter(counter + 1)
  };

  const checkLogin = () => {
    getToken()
      .then(function (token) {
        return token;
      })
      .then(function (token) {
        if (
          token.accessToken == null &&
          typeof token.accessToken == "undefined"
        ) {
          navigation.navigate("Login");
        } else {
          navigation.navigate("BottomBar");
        }
      });
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ImageBackground
        source={require("../../Assets/icons/bg.png")}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >
        <View style={commonStyle.center}>
          <Image
            source={require("../../Assets/icons/logo_new.png")}
            // resizeMode="cover"
            style={{
              marginTop: 32,
              // flex: 1,
              width: 300,
              height: 100
            }}
          />
        </View>
      </ImageBackground>
      <StickyFooter isSplash={true}>
        <View>
          <View style={{ alignItems: "flex-start", marginLeft: "10%" }}>
            <Text variant="headlineLarge" style={styles.highlightText}>
              Digital{"\n"}Transformation{"\n"}works
            </Text>
            <Text
              style={{
                backgroundColor: color.VERSION_BACKGROUND,
              }}
            >
              {strings.version}
            </Text>
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >

            <CustomButton
              loading={false}
              label={strings.get_started}
              isDisabled={false}
              onPress={checkLogin}
            />
          </View>
          <Text
            variant="labelSmall"
            style={{ textAlign: "center", marginBottom: 30 }}
          >
            © {new Date().getFullYear()} Dtworks. All rights reserved.
          </Text>
        </View>
      </StickyFooter>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: "100%",
  },
  container: {
    flex: 1,
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "white",
    borderRightColor: color.BCAE_PRIMARY,
    borderRightWidth: 400,
    borderTopWidth: 200,
    borderTopColor: "white",
  },
  highlightText: {
    color: "#202223",
    textAlign: "left",
    fontSize: fontSizes.FONT_19 * 2,
    fontWeight: "600",
    lineHeight: spacing.HEIGHT_27 * 2,
  },
});
export default Splash;
