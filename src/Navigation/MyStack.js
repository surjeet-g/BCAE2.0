import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useRef, useCallback, useMemo } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AnnouIcon from "../Assets/svg/anno.svg";
import TermIcon from "../Assets/svg/terms.svg";
import ForgotPassword from "../Screens/ForgotPassword/ForgotPassword";
import SavedLocation from "../Screens/Location/SavedLocation";
import { Login } from "../Screens/Login/Login";
import Register from "../Screens/Register/Register";
import Splash from "../Screens/Splash/Splash";
import BottomBarNavigation from "./BottomBarNavigation";

// import Location from "../Screens/Location/Location";
import AddLocation from "../Screens/Location/AddLocation";

//import ShowWebPage from "../Screens/TabScreens/ShowWebPage";

// import Anouncement from "../Screens/TabScreens/Announcement";
import ConfirmForgotPassword from "../Screens/ForgotPassword/ConfirmForgotPassword";
// import Notification from "../Screens/TabScreens/Notification";
import AnnouncementList from "../Screens/Announcement/AnnouncementList";
import ResetPassword from "../Screens/ForgotPassword/ResetPassword";
import ForgotUserinfo from "../Screens/ForgotUserInfo/ForgotUserinfo";
import VerifyForgotUserInfo from "../Screens/ForgotUserInfo/VerifyForgotUserInfo";
import { Playground } from "../Screens/Playground";
// import About from "../Screens/TabScreens/About";
// import InquiryNotification from "../Screens/TabScreens/InquiryNotification";
import { useTheme } from "react-native-paper";
import { HeaderTitle } from "../Components/headerTitle";
import EditProfile from "../Screens/EditProfile/EditProfile";
import { ViewProfile } from "../Screens/EditProfile/ViewProfile";
import RegisterSuccess from "../Screens/Register/RegisterSuccess";
import { ICON_STYLE, navBar } from "../Utilities/Style/navBar";
import VerifyLoginOTP from "./../Screens/Login/component/VerifyLoginOTP";
import AnnouncementItem from "./../Screens/Announcement/component/AnnouncementItem";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { mockAnnouncementList } from "../Utilities/Constants/Constant";

const STACK_EDIT_PROFILE = "EditProfile";
const STACK_REGISTER = "Register with us";
const STACK_SAVED_LOC = "SavedLocation";
const STACK_LOGIN = "Login";
const STACK_SPLASH = "Splash";

const Stack = createStackNavigator();
function MyStack() {
  const { colors, fonts } = useTheme();
  const options = {
    headerTintColor: colors.inverseSecondary,
    activeTintColor: "#e91e63",
    headerShown: true,
    headerTransparent: false,

    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTitleStyle: {
      ...fonts.titleLarge,
      ...{ color: colors.inverseSecondary, fontWeight: "700" },
    },
  };

  // ref
  const bottomSheetModalRef = useRef(BottomSheetModal);
  // variables
  const snapPoints = useMemo(() => ["60%"], []);
  // callbacks
  const openAnnoncementModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeAnnoncementModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log("$$$-handleSheetChanges", index);
  }, []);

  return (
    <NavigationContainer>
      {/* Register with u */}
      <Stack.Navigator
        initialRouteName={STACK_SPLASH}
        screenOptions={({ navigation }) => ({
          headerTransparent: true,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTitleStyle: {
            ...fonts.titleLarge,
            ...{ color: colors.onSurfaceVariant, fontWeight: "700" },
          },
          headerTitle: "",

          headerRight: () => {
            return (
              <View style={navBar.navRightCon}>
                <Pressable
                  onPress={() =>
                    alert("ToDo - Navigate to Notifications Screen")
                  }
                >
                  <TermIcon {...ICON_STYLE} />
                </Pressable>
                <View style={navBar.divider} />
                <Pressable
                  onPress={
                    // () => navigation.navigate("Announcements")
                    openAnnoncementModal
                  }
                >
                  <AnnouIcon {...ICON_STYLE} />
                </Pressable>
              </View>
            );
          },
        })}
      >
        <Stack.Screen
          options={({ navigation }) => ({
            ...options,
            ...{
              title: "Profile",
              headerRight: () => {
                return (
                  <View style={navBar.navRightCon}>
                    <Pressable
                      onPress={() => navigation.navigate("EditProfile")}
                      style={navBar.roundIcon}
                    >
                      <Icon
                        name="pencil-outline"
                        size={19}
                        color={colors.inverseSecondary}
                      />
                    </Pressable>
                  </View>
                );
              },
            },
          })}
          name="Profile"
          component={ViewProfile}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            ...options,
            ...{
              title: "Edit Profile",
            },
          })}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{
            title: "",
          }}
          name="RegisterSuccess"
          component={RegisterSuccess}
        />

        <Stack.Screen
          name="Changepassword"
          component={ResetPassword}
          options={{
            ...options,
            ...{
              title: "Change password",
              headerRight: () => null,
              headerTitle: () => (
                <HeaderTitle header="Need your help" subHeader="Register" />
              ),
              headerTintColor: colors.inverseSecondary,
            },
          }}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Playground"
          component={Playground}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="BottomBar"
          component={BottomBarNavigation}
        />

        <Stack.Screen
          options={{ headerShown: true }}
          name="ConfirmForgotPassword"
          component={ConfirmForgotPassword}
        />
        <Stack.Screen
          component={ResetPassword}
          options={{
            ...options,
            ...{
              title: "Reset Password",
              headerRight: () => null,
              headerTitle: () => (
                <HeaderTitle header="Need your help" subHeader="Register" />
              ),
              headerTintColor: colors.inverseSecondary,
            },
          }}
          name="ResetPassword"
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ForgotUserInfo"
          component={ForgotUserinfo}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Login",
          }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Login",
          }}
          name="VerifyLoginOTP"
          component={VerifyLoginOTP}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            title: "Forgot Password",
          }}
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Registration" }}
          name="Register with us"
          component={Register}
        />
        <Stack.Screen
          options={{
            headerTintColor: colors.inverseSecondary,

            headerTransparent: false,
            title: "Location on map",
            headerRight: () => {},
            headerStyle: {
              backgroundColor: colors.secondary,
            },
            headerTitleStyle: {
              ...fonts.titleMedium,
              ...{ color: colors.inverseSecondary, fontWeight: "700" },
            },
          }}
          name="AddLocation"
          component={AddLocation}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            ...options,
            ...{
              title: "Saved Locations",
            },
          })}
          name="SavedLocation"
          component={SavedLocation}
        />
        {/* second step for user registration */}

        {/* forgot password verify step */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="VerifyForgotUserInfo"
          component={VerifyForgotUserInfo}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            title: "Announcements",
          }}
          name="Announcements"
          component={AnnouncementList}
        />
        {/* <Stack.Screen
          options={{ headerShown: false }}
          name="ShowWebPage"
          component={ShowWebPage}
        /> */}
        {/* <Stack.Screen
          options={{ headerShown: false }}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SavedLocation"
          component={SavedLocation}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="Location"
          component={Location}
        />

       
        <Stack.Screen
          options={{ headerShown: false }}
          name="ShowWebPage"
          component={ShowWebPage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Anouncement"
          component={Anouncement}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Notification"
          component={Notification}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ConfirmForgotPassword"
          component={ConfirmForgotPassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ResetPassword"
          component={ResetPassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="About"
          component={About}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="InquiryNotification"
          component={InquiryNotification}
        /> */}
      </Stack.Navigator>
      <BottomSheetModalProvider>
        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <View style={styles.contentContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <AnnouIcon fill={"#22374E"} style={{ ...ICON_STYLE }} />
                <Text
                  style={{
                    fontWeight: 600,
                    color: "#22374E",
                    fontSize: 20,
                    flex: 1,
                    marginHorizontal: 15,
                  }}
                >
                  Annoucements
                </Text>
                <TouchableOpacity onPress={closeAnnoncementModal}>
                  <Image
                    style={{ ...ICON_STYLE, color: "#36393D" }}
                    source={require("../Assets/icons/ic_close.png")}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={mockAnnouncementList}
                renderItem={({ item }) => (
                  <AnnouncementItem
                    title={item.title}
                    desc={item.desc}
                    date={item.date}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});

export default MyStack;
