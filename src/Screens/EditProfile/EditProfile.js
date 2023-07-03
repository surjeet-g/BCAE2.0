import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { getDataFromDB } from "../../Storage/token";
import {
  color,
  DEFAULT_PROFILE_IMAGE,
  fontSizes,
  spacing,
  storageKeys
} from "../../Utilities/Constants/Constant";

import get from "lodash.get";
import { Text, TextInput, useTheme } from "react-native-paper";
import Camara from "../../Assets/svg/camera_icon.svg";
import { CheckGroupbox } from "../../Components/CheckGroupbox";
import { ClearSpace } from "../../Components/ClearSpace";
import { CustomButton } from "../../Components/CustomButton";
import { CustomDropDown } from "../../Components/CustomDropDown";
import { CustomInput } from "../../Components/CustomInput";
import { FullPageLoder } from "../../Components/FullPageLoder";
import LoadingAnimation from "../../Components/LoadingAnimation";
import { StickyFooter } from "../../Components/StickyFooter";
import {
  getMasterData,
  MASTER_DATA_CONSTANT
} from "../../Redux/masterDataDispatcher";
import {
  setProfileFormField,
  setProfileReset
} from "../../Redux/ProfileAction";
import {
  fetchMyProfileData,
  updateProfileData
} from "../../Redux/ProfileDispatcher";
import { fetchRegisterFormData } from "../../Redux/RegisterDispatcher";
import { fetchSavedLocations } from "../../Redux/SavedLocationDispatcher";
import { TDLog } from "../../Utilities/Constants/Constant";
import { strings } from "../../Utilities/Language/index";
import theme from "../../Utilities/themeConfig";
import {
  getUserTypeForProfile,
  USERTYPE
} from "../../Utilities/UserManagement/userInfo";
import { handleMultipleContact, handleUserStatus } from "../../Utilities/utils";
const EditProfile = ({ navigation, props }) => {
  const { colors, fonts } = useTheme();
  let savedLocation = useSelector((state) => state.savedLocations);

  const dispatchSaveLocation = useDispatch([fetchSavedLocations]);
  const fetchSavedLocationData = () =>
    dispatchSaveLocation(fetchSavedLocations());

  const [locationdelete, setLocation] = useState("");
  const [userTyp, setUserType] = useState("");
  const [isSaveButtonDisable, setSaveButtomEnableDisable] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loginId, setLoginId] = useState("");
  const [countryError, setCountryError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [counter, setCounter] = useState(1);
  let registerForm = useSelector((state) => state.registerForm);
  const dispatch1 = useDispatch([
    fetchRegisterFormData,
    setProfileReset,
    setProfileFormField,
  ]);
  let profile = useSelector((state) => state.profile);

  const {
    firstName,
    firstNameError,
    lastName,
    lastNameError,
    gender,
    genderError,
    idValue,
    nationality,
    location,
  } = profile.formData;

  const [street, setStreet] = useState("");
  const [state, setStateProfile] = useState("");
  const [district, setDistrict] = useState("");
  const [coupedintry, setCountry] = useState("");
  const [postCode, setPostcode] = useState("");
  const [contactValues, setContactValues] = useState([]);
  const [notificationValues, setNotificationValues] = useState([]);
  useEffect(() => {
    // dispatch1(setProfileReset());
    getDataFromDB(storageKeys.LOGIN_ID).then((result) => {
      if (result) {
        setLoginId(result.loginId);
      }
    });
    // dispatch1(fetchRegisterFormData());
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return null;
      },
    });
  }, [navigation]);

  const dispatch2 = useDispatch([fetchMyProfileData, updateProfileData]);
  const masterDispatch = useDispatch([getMasterData]);
  useEffect(() => {
    async function fetchMyAPI() {
      await dispatch2(fetchMyProfileData(navigation));
      const userType = await getUserTypeForProfile();
      const { CONTACT_PREFERENCE, GENDER, NOTIFICATION_TYPE } = MASTER_DATA_CONSTANT;

      masterDispatch(getMasterData(`${CONTACT_PREFERENCE},${GENDER},${NOTIFICATION_TYPE}`));

      setUserType(userType);
    }
    fetchMyAPI();
  }, []);

  const getAddressString = (data) => {
    let addressString = "";
    // if (data?.addressNo) {
    //   addressString += data.addressNo + ",";
    // }
    // if (data?.address1) {
    //   addressString += data.address1 + ",";
    // }
    // if (data?.address2) {
    //   addressString += data.address2 + ",";
    // }
    // if (data?.address3) {
    //   addressString += data.address3 + ",";
    // }

    if (data?.city) {
      addressString += data.city + ",";
    }
    if (data?.district) {
      addressString += data.district + ",";
    }
    if (data?.state) {
      addressString += data.state + ",";
    }
    if (data?.country) {
      addressString += data.country + ",";
      setCountry(data?.country);
    } else {
      addressString += "Brunei Darussalam";
      setCountry("Brunei Darussalam");
    }

    if (data?.postcode) {
      addressString += "" + data.postcode;
    }
    return addressString;
  };

  const onPlaceChosen = (params) => {
    // here is your callback function
    TDLog("onPlaceChosen Edit profile", JSON.stringify(params));

    setLatitude(params.currentLatitude);
    setLongitude(params.currentLongitude);
    setStreet(params.street);
    setStateProfile(params.state);
    setDistrict(params.district);
    setCountry(params.country);
    setPostcode(params.postCode);
  };

  const locationIconClick = () => {
    navigation.navigate("SavedLocation", {
      onPlaceChosen,
      fromPage: "EditProfile",
    });
  };

  const changeProfileImage = () => {
    let options = {
      title: "Select Image",
      customButtons: [
        { name: "customOptionKey", title: "Choose Photo from Custom Option" },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    return null

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        console.log("Response = ", response);

        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          const source = { uri: response.uri };

          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          //alert(JSON.stringify(response?.assets[0]))
          setProfileImageData(response?.assets[0]?.base64);
        }
      }
    );
  };

  const buttonEnableDisable = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      gender === "" ||
      location === ""
    ) {
      setSaveButtomEnableDisable(true);
    } else {
      setSaveButtomEnableDisable(false);
    }
  };

  const onLocationChanged = (textStr) => {
    setLocation(textStr);
    setLocationError("");
  };
  const onFirstNameChange = (textStr) => {
    dispatch1(
      setProfileFormField({
        field: "firstName",
        value: textStr,
        clearError: true,
      })
    );
    buttonEnableDisable();
  };
  const clearFirstName = () => {
    dispatch1(
      setProfileFormField({ field: "firstName", value: "", clearError: true })
    );
  };

  const onLastNameChange = (textStr) => {
    dispatch1(
      setProfileFormField({
        field: "lastName",
        value: textStr,
        clearError: true,
      })
    );

    buttonEnableDisable();
  };
  const clearLastName = () => {
    dispatch1(
      setProfileFormField({ field: "lastName", value: "", clearError: true })
    );
  };

  const onGenderClick = (textStr) => {
    dispatch1(
      setProfileFormField({
        field: "gender",
        value: textStr,
        clearError: false,
      })
    );

    buttonEnableDisable();
  };
  const onCountryClick = (textStr) => {
    setCountry(textStr?.description);
    // setCountryCode(textStr?.mapping?.countryCode ?? "");
    buttonEnableDisable();
  };
  const onLocationClick = (textStr) => {
    setLocation(textStr.onChangeText);
    buttonEnableDisable();
  };

  const isbuttonEnable = () => {
    const isConsumer =
      USERTYPE.CUSTOMER == get(profile, "savedProfileData.typeOfUser");
    if (isConsumer) {
      if (get(contactValues, "length", 0) === 0) return false;
      if (
        get(
          contactValues.filter((itm) => itm.active == true),
          "length",
          0
        ) == 0
      )
        return null;
    } else {
      if (get(notificationValues, "length", 0) === 0) return false;
      if (
        get(
          notificationValues.filter((itm) => itm.active == true),
          "length",
          0
        ) == 0
      )
        return null;
    }
    if (firstName == "" || lastName == "") return false;
    return true;
  };
  const submit = async () => {
    Keyboard.dismiss();
    if (firstName == "" || lastName == "") {
      Alert.alert(strings.attention, strings.field_empty_alert, [
        { text: strings.ok, onPress: () => { } },
      ]);
    } else {
      // const myArray = location.split(",").reverse();

      // else if (country === "") {
      //   setCountryError(strings.countryError);
      // }
      //else if (location === "") { setLocationError(strings.locationError) }
      const isCustomer =
        USERTYPE.CUSTOMER == get(profile, "savedProfileData.typeOfUser");
      let registerObject, userObject;

      if (isCustomer) {
        registerObject = {
          details: {
            firstName: firstName,
            lastName: lastName,
            gender: gender?.code,
            idValue: idValue,
            contactPreferences: contactValues
              .filter((it) => it.active)
              .map((ite) => ite.code),
            // nationality : country
            // profilePicture: profileImageData,
            // address: {
            //   address: location,
            //   hno: "",
            //   buildingName: "",
            //   street: street,
            //   road: "",
            //   city: "",
            //   state: state,
            //   district: district,
            //   country: country,
            //   latitude: latitude,
            //   longitude: longitude,
            //   postCode: postCode,
            // },
          },
        };
      } else {
        userObject = {
          firstName: firstName,
          loginid: get(profile, "savedProfileData.loginid", ''),
          lastName: lastName,
          gender: gender?.code,
          userId: get(profile, "savedProfileData.userId", ''),
          contactNo: get(profile, "savedProfileData.contactNo", ''),
          email: get(profile, "savedProfileData.email", ''),
          userType: get(profile, "savedProfileData.userType", ''),

          dob: get(profile, "savedProfileData.dob", ''),
          status: get(profile, "savedProfileData.status", ''),
          country: get(profile, "savedProfileData.country", ''),
          extn: get(profile, "savedProfileData.extn", ""),
          mappingPayload: get(profile, "savedProfileData.mappingPayload", ''),
          notificationType: notificationValues
            .filter((it) => it.active)
            .map((ite) => ite.code),
          // "userId": 0,
          // "contactNo": 0,
          // "email": "string",
          // "userType": "string",
          // "title": "string",
          // "firstName": "string",
          // "lastName": "string",
          // "gender": "string",
          // "dob": "2023-04-10",
          // "officeNo": 0,
          // "extn": 0,
          // "notificationType": "string",
          // "biAccess": true,
          // "waAccess": true,
          // "status": "string",
          // "location": "string",
          // "country": "string",
          // "profilePicture": "string",
          // "activationDate": "2023-04-10",
          // "expiryDate": "2023-04-10",
          // "mappingPayload": {}
        };
      }

      console.log('update profile 11', userObject)
      const status = await dispatch2(
        updateProfileData(isCustomer ? registerObject : userObject, navigation, isCustomer)
      );
      if (status) {
        await dispatch2(fetchMyProfileData(navigation));
      }

      //dispatch2(updateProfileData(registerObject,profile.savedProfileData.userId));
    }
  };

  const showErrorMessage = (errMessage) => {
    return (
      <View
        style={{
          marginTop: spacing.HEIGHT_6,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.errorLogo}
          source={require("../../Assets/icons/ci_error_warning.png")}
        />
        <Text style={styles.errorText}> {errMessage}</Text>
      </View>
    );
  };
  const masterReducer = useSelector((state) => state.masterdata);
  const customerPic =
    get(profile, "savedProfileData.customerPhoto", null) ??
    DEFAULT_PROFILE_IMAGE;

  const addresss = get(profile, "savedProfileData.customerAddress", []);
  const contactPerference = get(
    masterReducer,
    "masterdataData.CONTACT_PREFERENCE",
    []
  );
  const notificationTypesList = get(
    masterReducer,
    "masterdataData.NOTIFICATION_TYPE",
    []
  );
  console.log(">>contactPerference", notificationTypesList);

  const currentnotificationType = get(
    profile,
    "savedProfileData.notificationType",
    []
  );


  const profileCurrentPer = get(
    profile,
    "savedProfileData.contactPreferences",
    ""
  );
  console.log(">>profileCurrentPer", profile);



  // const profileCurrentPer = ["CNT_PREF_EMAIL", "CNT_PREF_MOBILE"]
  let contactPerf = [];
  if (
    get(contactPerference, "length", 0) != 0 &&
    get(profileCurrentPer, "length", 0) != 0
  ) {
    contactPerf = contactPerference.map((it) => {
      return {
        code: it.code,
        description: it.description,
        active: profileCurrentPer.includes(it.code),
      };
    });
  }


  const isConsumer =
    USERTYPE.CUSTOMER == get(profile, "savedProfileData.typeOfUser");
  let notifTypesFiltered = [];
  if (
    !isConsumer &&
    get(notificationTypesList, "length", 0) != 0
  ) {
    notifTypesFiltered = notificationTypesList.map((it) => {

      return {
        code: it.code,
        description: it.description,
        active: get(currentnotificationType, 'length', 0) == 0 ? false : currentnotificationType.includes(it.code),
      };
    });
  }
  console.log('current notifcation type', notifTypesFiltered)


  console.log("is consumer", isConsumer);
  const emailPath = isConsumer
    ? "savedProfileData.customerContact[0].emailId"
    : "savedProfileData.email";
  const custoPath = isConsumer
    ? "savedProfileData.customerNo"
    : "savedProfileData.userId";
  const countyPath = isConsumer
    ? "savedProfileData.customerAddress[0].country"
    : "savedProfileData.country";
  const mobilePath = isConsumer
    ? "savedProfileData.customerContact[0].mobileNo"
    : "savedProfileData.contactNo";
  console.log("profile reducers", addresss);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {profile.initProfile && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 200,
          }}
        >
          <LoadingAnimation></LoadingAnimation>
          <Text style={styles.emptyList}>{strings.please_wait}</Text>
        </View>
      )}
      {!profile.initProfile && (
        <View style={styles.container}>
          <View
            style={{
              // height: 150,
              backgroundColor: colors.secondary,
              paddingTop: 20,
            }}
          >
            <View style={[{ alignItems: "center" }]}>
              <ImageBackground
                source={{
                  uri: customerPic,
                }}
                imageStyle={{ borderRadius: 80 }}
                style={{ height: 110, width: 110 }}
              >
                <Pressable
                  onPress={changeProfileImage}
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Camara width="20" height="20" />
                </Pressable>
              </ImageBackground>
              <ClearSpace size={2} />
              <Text variant="bodyLarge" style={styles.caption}>
                {strings.customer_ID + " : " + get(profile, custoPath, "")}
              </Text>
              <ClearSpace size={2} />
              <Text variant="bodyLarge" style={styles.caption}>
                {"Email Id :"}{" "}
                <Text variant="bodySmall" style={styles.caption_small}>
                  {get(profile, emailPath, "")}
                </Text>
              </Text>
              <ClearSpace size={2} />
              <Text variant="bodyLarge" style={styles.caption}>
                {"Status: "}{" "}
                <Text variant="bodySmall" style={styles.caption_small}>
                  {handleUserStatus(
                    get(profile, "savedProfileData.status", "")
                  )}
                </Text>
              </Text>
              <ClearSpace />

              <ClearSpace />
            </View>
          </View>

          {registerForm.initRegisterForm ? (
            <FullPageLoder
              bgColor={color.DISABLED_GREY}
              loderColor={color.BCAE_PRIMARY}
            />
          ) : (
            <ScrollView
              style={{
                flexGrow: 1,
                paddingHorizontal: spacing.WIDTH_30,
                backgroundColor: "white",
                margin: 12,
                borderRadius: 8,
              }}
              nestedScrollEnabled={true}
            >
              {/* First Name */}
              <View style={{ marginTop: spacing.HEIGHT_30 }}>
                <CustomInput
                  // editable={false}
                  caption={strings.first_name}
                  placeholder={strings.first_name}
                  onChangeText={(text) => onFirstNameChange(text)}
                  value={firstName}
                  right={
                    <TextInput.Icon
                      onPress={clearFirstName}
                      style={{ width: 23, height: 23 }}
                      icon={require("../../Assets/icons/ic_close.png")}
                    />
                  }
                />
                {/* {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.showErrorMessage(registerForm?.loggedProfile?.message)} */}
                {firstNameError && showErrorMessage(firstNameError)}
              </View>

              {/* Last Name */}
              <View style={{ marginTop: spacing.HEIGHT_5 }}>
                <CustomInput
                  // editable={false}
                  caption={strings.last_name}
                  placeholder={strings.last_name}
                  onChangeText={(text) => onLastNameChange(text)}
                  value={lastName}
                  right={
                    <TextInput.Icon
                      onPress={clearLastName}
                      style={{ width: 23, height: 23 }}
                      icon={require("../../Assets/icons/ic_close.png")}
                    />
                  }
                />
                {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.showErrorMessage(registerForm?.loggedProfile?.message)}
                {lastNameError && showErrorMessage(lastNameError)}
              </View>

              <View style={{ marginTop: spacing.HEIGHT_5 }}>
                <CustomInput
                  disabled={true}
                  editable={false}
                  caption={strings.country}
                  placeholder={strings.country}
                  onChangeText={(text) => { }}
                  value={get(profile, countyPath, "")}
                />
              </View>
              {contactPerf.length != 0 && (
                <View style={{ marginTop: spacing.HEIGHT_5 }}>
                  <CheckGroupbox
                    data={contactPerf}
                    values={contactValues}
                    setValues={(data) => {
                      setContactValues(data);
                      setCounter(counter + 1);
                    }}
                    label="Contact Preference"
                  />
                </View>
              )}
              {!isConsumer && notifTypesFiltered.length != 0 && (
                <View style={{ marginTop: spacing.HEIGHT_5 }}>
                  <CheckGroupbox
                    data={notifTypesFiltered}
                    values={notificationValues}
                    setValues={(data) => {
                      setNotificationValues(data);
                      setCounter(counter + 1);
                    }}
                    label="Notification Type"
                  />
                </View>
              )}
              {/* Gender */}
              <View style={{}}>
                <CustomDropDown
                  selectedValue={get(gender, "description", "")}
                  setValue={(text) => onGenderClick(text)}
                  data={get(masterReducer, "masterdataData.GENDER", [])}
                  onChangeText={(text) => onGenderClick(text)}
                  value={get(gender, "description", "")}
                  placeHolder={strings.gender}
                />
                {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.showErrorMessage(registerForm?.loggedProfile?.message)}
                {genderError && showErrorMessage(genderError)}
              </View>

              {/* Address */}
              {addresss.length > 0 && (
                <View style={{ marginTop: spacing.HEIGHT_40 }}>
                  <CustomInput
                    multiline={true}
                    numberOfLines={2}
                    style={{
                      backgroundColor: "transparent",
                    }}
                    value={handleMultipleContact(addresss)}
                    caption={strings.location}
                    placeHolder={strings.location}
                    right={
                      <TextInput.Icon
                        onPress={() => locationIconClick()}
                        theme={{ colors: { onSurfaceVariant: colors.primary } }}
                        icon="map"
                      />
                    }
                  />

                  {!registerForm.initRegisterForm &&
                    registerForm?.loggedProfile?.errorCode == "404" &&
                    this.showErrorMessage(registerForm?.loggedProfile?.message)}
                  {locationError !== "" && showErrorMessage(locationError)}
                </View>
              )}

              {/* Location */}
              {/* <View style={{ marginTop: spacing.HEIGHT_20 }}>
                            <CustomDropDown
                                data={registerForm?.registerFormData?.LOCATION ?? []}
                                onChangeText={(text) => onLocationClick(text)}
                                value={location}
                                placeHolder={strings.location}
                            />
                            {!registerForm.initRegisterForm && registerForm?.loggedProfile?.errorCode == '404' &&
                                this.showErrorMessage(registerForm?.loggedProfile?.message)
                            }

                            {locationError !== "" &&
                                showErrorMessage(locationError)
                            }
                        </View> */}

              {/* Country */}
              {/* <View style={{ marginTop: spacing.HEIGHT_10 }}>
                <CustomDropDown
                
                  selectedValue={nationality}
                  // setValue={setValueCountry}
                   setValue={setValueCountry}
                  data={registerForm?.registerFormData?.COUNTRY ?? []}
                  onChangeText={(text) => {
                    onCountryClick(text);
                  }}
                  value={country}
                  placeHolder={strings.country}
                />
                {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.showErrorMessage(registerForm?.loggedProfile?.message)}
                {countryError !== "" && showErrorMessage(countryError)}
              </View> */}
              <View style={{ marginTop: 10 }}>
                <CustomInput
                  value={userTyp}
                  placeHolder={"User Type"}
                  caption={"User Type"}
                  disabled={true}
                />
              </View>


              <View style={{ marginTop: spacing.HEIGHT_30 }}>
                <CustomInput
                  disabled={true}
                  // editable={false}
                  placeHolder={strings.mobile_number}
                  caption={strings.mobile_number}

                  value={get(profile, mobilePath, "")}

                />
                {/* {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.showErrorMessage(registerForm?.loggedProfile?.message)} */}
                {firstNameError && showErrorMessage(firstNameError)}
              </View>

              {/* Email */}
              {/* <View style={{ marginTop: spacing.HEIGHT_20 }}>
                <CustomInput
                  value={email}
                  placeHolder={strings.email}
                  caption={strings.email}
                  right={
                    <TextInput.Icon
                      onPress={clearFirstName}
                      style={{ width: 23, height: 23 }}
                      icon={require("../../Assets/icons/ic_close.png")}
                    />
                  }
                  disabled={false}
                />
                {!registerForm.initRegisterForm &&
                  registerForm?.loggedProfile?.errorCode == "404" &&
                  this.
                  (registerForm?.loggedProfile?.message)}
                {emailError !== "" && 
                (emailError)}
              </View> */}

              <View style={{ paddingBottom: spacing.HEIGHT_50 }} />
            </ScrollView>
          )}
          <StickyFooter>
            <CustomButton
              loading={false}
              label={"Update"}
              isDisabled={!isbuttonEnable()}
              onPress={async () => {
                await submit();
              }}
            />
          </StickyFooter>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.BCAE_OFF_WHITE,
  },
  caption: {
    color: theme.colors.inverseSecondary,
    fontWeight: "700",
  },
  caption_small: {
    color: theme.colors.inverseSecondary,
  },

  logo: {
    height: spacing.WIDTH_40,
    width: spacing.WIDTH_50 * 2,
  },
  orText: {
    color: color.BCAE_LIGHT_BLUE,
    fontSize: fontSizes.FONT_10,
    fontWeight: "500",
    lineHeight: spacing.WIDTH_16,
    paddingHorizontal: spacing.WIDTH_7,
  },
  alreadyAccount: {
    marginTop: spacing.HEIGHT_30,
    fontWeight: "400",
    color: color.PLACEHOLDER,
    fontSize: fontSizes.FONT_12,
    lineHeight: spacing.WIDTH_14,
    textAlign: "center",
  },
  loginText: {
    marginTop: spacing.HEIGHT_6,
    fontWeight: "500",
    color: color.BCAE_LIGHT_BLUE,
    fontSize: fontSizes.FONT_14,
    lineHeight: spacing.WIDTH_17,
    textAlign: "center",
  },
  checkBox: {
    height: spacing.WIDTH_20,
    width: spacing.WIDTH_20,
  },
  emptyList: {
    fontSize: 20,
    color: color.BCAE_PRIMARY,
  },
  errorText: {
    color: color.ERROR_TEXT_RED,
    fontSize: fontSizes.FONT_14,
    fontWeight: "500",
    lineHeight: spacing.WIDTH_14,
  },
  textLocation: {
    marginTop: spacing.HEIGHT_10,
    borderBottomWidth: 1,
    borderBottomColor: color.INPUT_TEXT_BORDER,
    flexDirection: "row",
  },
  placeHolderText: {
    color: color.PLACEHOLDER,
    fontSize: fontSizes.FONT_12,
    fontWeight: "500",
  },
});

export default EditProfile;
