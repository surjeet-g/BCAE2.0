import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { HomeScreen } from "../Screens/TabScreens/HomeScreen";
import { UserHomeScreen } from "../Screens/TabScreens/UserHomeScreen";
import { navBar } from "../Utilities/Style/navBar";
// import Chat from "../Screens/TabScreens/Chat";
// import Announcement from "../Screens/TabScreens/Announcement";
// import AddTickets from "../Screens/TabScreens/AddTickets";
// import MyTicketsStack from "./MyTicketsStack";
import { DrawerActions } from "@react-navigation/native";

import { Image, Platform, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomBottomBar from "./CustomBottomBar";
// import CreateEnquiry from "../Screens/TabScreens/CreateEnquiry";
// import CreateComplaint from "../Screens/TabScreens/CreateComplaint";
import get from "lodash.get";
import { Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimation from "../Components/LoadingAnimation";
import { fetchMyProfileData } from "../Redux/ProfileDispatcher";
import { DEFAULT_PROFILE_IMAGE, color } from "../Utilities/Constants/Constant";
import { USERTYPE } from "../Utilities/UserManagement/userInfo";
import { Appointment } from "./../Screens/Appointments/Appointment";
import Help from "./../Screens/Help";
import Offers from "./../Screens/Offers";

const BottomTab = createBottomTabNavigator();
const initialRoutByPlat =
  Platform.OS === "android" ? "HomeScreen" : "HomeScreen";

const Drawer = createDrawerNavigator();

const BottomBarNavigation = () => {
  // const [profile, setProfile] = useState(null);
  const dispatch2 = useDispatch([fetchMyProfileData]);
  const [loader, setLoader] = useState(true);
  const profileRed = useSelector((state) => state.profile);

  useEffect(() => {
    async function fetchMyAPI() {
      await dispatch2(fetchMyProfileData());
      setLoader(false);
      // if (res.status) {
      //   console.log('data', res)
      //   setProfile(res.data.profilePicture);
      // }

      // console.warn("useeffect", profile?.savedProfileData);
    }

    fetchMyAPI();
  }, []);

  const userType = get(profileRed, "savedProfileData.typeOfUser", "");
  const isConsumer = userType == USERTYPE.CUSTOMER;
  const profilePath = isConsumer
    ? "savedProfileData.customerPhoto"
    : "savedProfileData.profilePicture";
  const profile = get(profileRed, profilePath, null);
  console.log("customer pic", profile, profileRed)
  const { colors, fonts } = useTheme();
  const options = (navigation) => ({
    activeTintColor: "#e91e63",
    headerShown: true,
    headerStyle: {
      ...fonts.titleLarge,
      backgroundColor: "#4C5A81",
    },
    headerTitleStyle: {
      ...fonts.titleMedium,
      ...{ color: "white", fontWeight: "700" },
    },

    headerRight: () => {
      return (
        <View style={navBar.navRightCon}>
          <Pressable
            onPress={() => navigation.navigate("Notification")}
            style={navBar.roundIcon}
          >
            <Image
              source={require("../Assets/icons/home_bell.png")}
              style={{ width: 35, height: 35 }}
            />
          </Pressable>
          <View style={navBar.divider} />
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri: profile || DEFAULT_PROFILE_IMAGE
              }}
              // imageStyle={{ borderRadius: 80 }}
              style={navBar.roundIcon}
            />
          </Pressable>
        </View>
      );
    },

    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        style={{ marginLeft: 5 }}
      >
        <Icon name="menu" size={25} color={color.WHITE} />
      </Pressable>
    ),
  });

  return (
    <>
      {loader && <LoadingAnimation title="Fetch data...Please wait" />}
      <BottomTab.Navigator
        tabBar={(props) => <CustomBottomBar {...props} />}
        initialRouteName="HomeScreen"
        backBehavior="history"
      >
        <BottomTab.Screen
          // options={{ headerShown: false }}
          options={({ navigation }) => ({
            ...options(navigation),
          })}
          name="Home"
          component={isConsumer ? HomeScreen : UserHomeScreen}
        />

        <BottomTab.Screen
          // options={{ headerShown: false }}
          name="Search"
          component={Appointment}
          options={({ navigation }) => ({
            ...options,
            headerRight: () => {
              return (
                <View style={navBar.navRightCon}>
                  <Pressable
                    onPress={() => {
                      // alert("ToDo - Navigate to Notifications Screen")
                    }}
                    style={navBar.roundIcon}
                  >
                    <Image
                      source={require("../Assets/icons/home_bell.png")}
                      style={{ width: 35, height: 35 }}
                    />
                  </Pressable>
                  <View style={navBar.divider} />
                  <Pressable onPress={() => navigation.navigate("Profile")}>
                    <Image
                      source={{
                        uri:
                          profile || DEFAULT_PROFILE_IMAGE,
                      }}
                      // imageStyle={{ borderRadius: 80 }}
                      style={navBar.roundIcon}
                    />
                  </Pressable>
                </View>
              );
            },
          })}
        />
        <BottomTab.Screen
          // options={{ headerShown: false }}
          name="Offers"
          component={Offers}
          options={({ navigation }) => ({
            ...options,
            headerRight: () => {
              return (
                <View style={navBar.navRightCon}>
                  <Pressable
                    onPress={() => {

                      // alert("ToDo - Navigate to Notifications Screen")
                    }
                    }
                    style={navBar.roundIcon}
                  >
                    <Image
                      source={require("../Assets/icons/home_bell.png")}
                      style={{ width: 35, height: 35 }}
                    />
                  </Pressable>
                  <View style={navBar.divider} />
                  <Pressable onPress={() => navigation.navigate("Profile")}>
                    <Image
                      source={{
                        uri: profile || DEFAULT_PROFILE_IMAGE,
                      }}
                      // imageStyle={{ borderRadius: 80 }}
                      style={navBar.roundIcon}
                    />
                  </Pressable>
                </View>
              );
            },
          })}
        />

        <BottomTab.Screen
          // options={{ headerShown: false }}
          name="Help"
          component={Help}
          options={({ navigation }) => ({
            ...options,
            headerRight: () => {
              return (
                <View style={navBar.navRightCon}>
                  <Pressable
                    onPress={() => {
                      // alert("ToDo - Navigate to Notifications Screen")
                    }
                    }
                    style={navBar.roundIcon}
                  >
                    <Image
                      source={require("../Assets/icons/home_bell.png")}
                      style={{ width: 35, height: 35 }}
                    />
                  </Pressable>
                  <View style={navBar.divider} />
                  <Pressable onPress={() => navigation.navigate("Profile")}>
                    <Image
                      source={{
                        uri: profile || DEFAULT_PROFILE_IMAGE,
                      }}
                      // imageStyle={{ borderRadius: 80 }}
                      style={navBar.roundIcon}
                    />
                  </Pressable>
                </View>
              );
            },
          })}
        />
      </BottomTab.Navigator>
    </>
  );
};

const Root = () => {
  return (
    <Drawer.Navigator initialRouteName="BottomApp">
      <Drawer.Screen
        name="BottomApp"
        component={BottomBarNavigation}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};
export default Root;
