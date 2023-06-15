import get from "lodash.get";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";
import DatePicker from "react-native-date-picker";
import { Checkbox, Modal, TextInput, useTheme } from "react-native-paper";
import StepIndicator from "react-native-step-indicator";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { ClearSpace } from "../../Components/ClearSpace";
import LoadingAnimation from "../../Components/LoadingAnimation";
import {
  getMasterData,
  MASTER_DATA_CONSTANT
} from "../../Redux/masterDataDispatcher";
import { fetchRegisterFormData } from "../../Redux/RegisterDispatcher";
import { endPoints } from "../../Utilities/API/ApiConstants";
import { CustomButton } from "./../../Components/CustomButton";
import { CustomDropDownFullWidth } from "./../../Components/CustomDropDownFullWidth";
import { CustomInput } from "./../../Components/CustomInput";
import { CustomInputWithCC } from "./../../Components/CustomInputWithCC";
import CustomTitleText from "./../../Components/CustomTitleText";
import { FooterModel } from "./../../Components/FooterModel";
import { strings } from "./../../Utilities/Language/index";
import {
  excludedCountriesList,
  getPhoneNumberLength
} from "./../../Utilities/utils";
import BillDetails from "./BillDetails";
import {
  removeCategoryProducts,
  setCurrentStepInStore,
  setShowAccountCreationModal,
  setSignatureInFormData
} from "./CreateCustomerAction";
import {
  createCustomer, createCustomerService, createOrderForCustomer, fetchServiceProducts, updateAccountData, updateCustomerData, updateCustomerServiceData,
  updateCustomerStatus
} from "./CreateCustomerDispatcher";
import CustomerAgreement from "./CustomerAgreement";
import CustomerType from "./CustomerType";
import { FaceDetection } from "./FaceDetection";
import { Facerecogne } from "./FaceRegconize";
import Product from "./Product";
import SelectedProduct from "./SelectedProduct";
import ServiceCategory from "./ServiceCategory";
import { FACE_RECOG_GET_START, FACE_RECOG_IM_READY, FACE_RECOG_TAKE_SELFI, FACE_RECOG_UPLOAD_DOCUS, FACE_RECOG_UPLOAD_DOCUS_LOADER, FACE_RECOG_UPLOAD_DOCUS_SUCCESS, FACE_RECOG_UPLOAD_SELFI, FACE_RECOG_UPLOAD_SELFI_SUCCESS, STEP_CUSTOMER_FORM } from "./Steps";
import UploadDocument from "./UploadDocument";
import { APICallForMuti } from "./util";
import {
  getCityByDistrict,
  getPostCodeByCity,
  getUniqueDistricts,
  getUniqueState
} from "./utilities";
//enble logs
const logg = true
const CreateCustomer = ({ navigation }) => {
  const { colors } = useTheme();

  const dispatch = useDispatch([
    fetchServiceProducts,
    removeCategoryProducts,
    getMasterData,
    fetchRegisterFormData,
    createCustomer,
    updateCustomerData,
    createCustomerService,
    updateCustomerServiceData,
    setCurrentStepInStore,
    setSignatureInFormData,
    updateCustomerStatus,
    updateAccountData,
    createOrderForCustomer,
  ]);

  const [formData, setFormData] = useState({
    getQuote: false,
    showAccountCreationModal: false,
    customerDetails: {},
    accountDetails: {},
    serviceDetails: { details: [] },
  });
  const initalImgObj = {
    face: {},
    idCard: {}
  }
  const [loaderLbl, setLoaderLbl] = useState("while we are fetching country")
  const [userIDImg, setUserIDImg] = useState(initalImgObj)
  const [loader, setLoader] = useState(false);
  const [activeDropDown, setActiveDropDown] = useState("district");
  const [addressTakenType, setAddressTakenType] = useState("Manual");

  const [stepIndicator, setStepIndicator] = useState(0);
  const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showSameAccountDetailsModal, setShowSameAccountDetailsModal] =
    useState(false);
  const [createAccount, setCreateAccount] = useState(true);
  const [isSameServiceAddressChecked, setIsSameServiceAddressChecked] =
    useState(false);
  const [isSameCustomerDetailsChecked, setIsSameCustomerDetailsChecked] =
    useState(false);
  const [isSameAccountAddressChecked, setIsSameAccountAddressChecked] =
    useState(false);
  const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
  const [numberError, setNumberError] = useState("");
  const [countryCode, setCountryCode] = useState("+673");
  const [numberMaxLength, setNumberMaxLength] = useState(7);
  const [countryPickModel, setCountryPickModel] = useState(false);
  const [openBirthDatePicker, setOpenBirthDatePicker] = useState(false);
  const [openRegDatePicker, setOpenRegDatePicker] = useState(false);

  let createCustomerReducerData = useSelector(
    (state) => state.createCustomerReducerData
  );
  let masterReducer = useSelector((state) => state.masterdata);
  const savedLocation = useSelector((state) => state.savedLocations);

  const customerCategoryCode = formData?.customerDetails?.categoryType?.code;
  const { currentStep } = createCustomerReducerData.formData;
  const [showFaceDection, setShowCam] = useState(false)
  useEffect(() => {
    setFormData(createCustomerReducerData.formData);
  }, [createCustomerReducerData.formData]);
  console.log("formData", JSON.stringify(formData));

  // Used to fetch master data
  useEffect(() => {
    const {
      CUSTOMER_ID_TYPE,
      CUSTOMER_CATEGORY,
      CONTACT_PREFERENCE,
      CONTACT_TYPE,
      GENDER,
      PRIORITY,
      NOTIFICATION_TYPE,
      BILL_LANGUAGE,
      CURRENCY,
      ACCOUNT_CATEGORY,
      ACCOUNT_LEVEL,
      ACCOUNT_TYPE,
      COUNTRY,
      PRODUCT_TYPE,
    } = MASTER_DATA_CONSTANT;
    return null
    dispatch(
      getMasterData(
        `${COUNTRY},${CUSTOMER_ID_TYPE},${CUSTOMER_CATEGORY},${CONTACT_PREFERENCE},${CONTACT_TYPE},${GENDER},,${PRIORITY},${NOTIFICATION_TYPE},${BILL_LANGUAGE},${CURRENCY},${ACCOUNT_CATEGORY},${ACCOUNT_LEVEL},${ACCOUNT_TYPE},${PRODUCT_TYPE}`
      )
    );
  }, []);
  const CUSTOMER_ID_TYPE_LIST = masterReducer?.masterdataData?.CUSTOMER_ID_TYPE;
  const CUSTOMER_CATEGORY_LIST =
    masterReducer?.masterdataData?.CUSTOMER_CATEGORY;
  const GENDER_LIST = masterReducer?.masterdataData?.GENDER;
  const PRIORITY_LIST = masterReducer?.masterdataData?.PRIORITY;
  const CONTACT_TYPE_LIST = masterReducer?.masterdataData?.CONTACT_TYPE;
  const ACCOUNT_CATEGORY_LIST = masterReducer?.masterdataData?.ACCOUNT_CATEGORY;
  const ACCOUNT_TYPE_LIST = masterReducer?.masterdataData?.ACCOUNT_TYPE;
  const ACCOUNT_LEVEL_LIST = masterReducer?.masterdataData?.ACCOUNT_LEVEL;
  const NOTIFICATION_TYPE_LIST =
    masterReducer?.masterdataData?.NOTIFICATION_TYPE;
  const BILL_LANGUAGE_LIST = masterReducer?.masterdataData?.BILL_LANGUAGE;
  const CURRENCY_LIST = masterReducer?.masterdataData?.CURRENCY;
  const PRODUCT_TYPE_LIST = masterReducer?.masterdataData?.PRODUCT_TYPE;

  // Used for step 3 & 4 to display list of available & selected products
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(createCustomerReducerData.products);
  }, [createCustomerReducerData.products]);

  // For handling the header title based on stepIndicator
  useLayoutEffect(() => {
    let title = "";
    switch (stepIndicator) {
      case 0:
        title = "Create Customer";
        break;
      case 1:
        title = "Services";
        break;
      case 2:
        title = "Create Account";
        break;
      case 3:
        title = "Agreement";
        break;
      case 4:
        title = "Preview";
        break;
      default:
        title = "Create Customer";
    }

    navigation.setOptions({
      headerTitle: title,
    });
  }, [stepIndicator]);

  // For handling the step indicator in header based on currentStep
  useEffect(() => {
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
        setStepIndicator(0);
        break;
      case 3:
      case 4:
      case 5:
        setStepIndicator(1);
        break;
      case 6:
      case 7:
      case 8:
        setStepIndicator(2);
        break;
      case 9:
        setStepIndicator(3);
        break;
      case 10:
        setStepIndicator(4);
        break;
      default:
        setStepIndicator(0);
        break;
    }
  }, [currentStep]);

  const enableLoader = (status, lbl = "") => {
    setLoaderLbl(lbl)
    setLoader(status)

  }
  const onPlaceChosen_2 = (params) => {
    // here is your callback function
    console.log("onPlaceChosen_2", JSON.stringify(params));
    // {
    // "address1":"hno1,b1","address2":"Uttara kannada,Karnataka","address3":"India,581351",

    const addressSplit = params.address1.split(",");
    const address2Split = params.address2.split(",");
    if (currentStep === 2) {
      handleCustomerDetails("address1", get(addressSplit, "[0]", ""));
      handleCustomerDetails("address2", get(addressSplit, "[1]", ""));
      handleCustomerDetails("address3", get(address2Split, "[1]", ""));
      handleCustomerDetails("country", params.country);
      handleCustomerDetails("district", params.district);
      handleCustomerDetails("postCode", params.postcode);
      handleCustomerDetails("state", params.state);
      handleCustomerDetails("city", params.city);
    } else if (currentStep === 5) {
      handleServiceDetails("address1", get(addressSplit, "[0]", ""));
      handleServiceDetails("address2", get(addressSplit, "[1]", ""));
      handleServiceDetails("address3", get(address2Split, "[1]", ""));
      handleServiceDetails("country", params.country);
      handleServiceDetails("district", params.district);
      handleServiceDetails("postCode", params.postcode);
      handleServiceDetails("state", params.state);
      handleServiceDetails("city", params.city);
    } else if (currentStep === 8) {
      handleAccountDetails("address1", get(addressSplit, "[0]", ""));
      handleAccountDetails("address2", get(addressSplit, "[1]", ""));
      handleAccountDetails("address3", get(address2Split, "[1]", ""));
      handleAccountDetails("country", params.country);
      handleAccountDetails("district", params.district);
      handleAccountDetails("postCode", params.postcode);
      handleAccountDetails("state", params.state);
      handleAccountDetails("city", params.city);
    }
    setAddressTakenType("AUTO");
  };

  const locationIconClick = () => {
    navigation.navigate("SavedLocation", {
      onPlaceChosen_2,
      fromPage: "CreateCustomer_2",
    });
  };
  const handleTitleFace = () => {
    switch (currentStep) {
      case FACE_RECOG_UPLOAD_DOCUS_SUCCESS:
        return "Verification"

      default:
        return "Face recognization"

    }
  }
  // Step = -1
  console.log("id card object", userIDImg)
  const renderfaceRegconize = () => {
    return (
      <View>
        <CustomTitleText title={handleTitleFace()} />
        <ClearSpace size={1} />
        <Facerecogne step={currentStep} faces={userIDImg} />
      </View>
    );
  };

  // Step = 0
  const renderUploadDocsUI = () => {
    return (
      <View>
        <CustomTitleText title={"Face recognization"} />
        <UploadDocument />
      </View>
    );
  };
  // Step = 1
  const renderCustomerDetailsUI = () => {
    return (
      <View>
        <CustomTitleText title={"Customer Information"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={formData?.customerDetails?.title}
            caption={strings.title}
            placeHolder={strings.title}
            onChangeText={(text) => handleCustomerDetails("title", text)}
          />
          <CustomInput
            value={formData?.customerDetails?.firstName}
            caption={strings.firstname}
            placeHolder={strings.firstname}
            onChangeText={(text) => handleCustomerDetails("firstName", text)}
          />
          <CustomInput
            value={formData?.customerDetails?.lastName}
            caption={strings.lastname}
            placeHolder={strings.lastname}
            onChangeText={(text) => handleCustomerDetails("lastName", text)}
          />
          <DatePicker
            modal
            mode="date"
            validRange={{ endDate: new Date() }}
            open={openBirthDatePicker}
            onCancel={() => setOpenBirthDatePicker(false)}
            date={formData?.customerDetails?.birthDate || new Date()}
            maximumDate={new Date()}
            onConfirm={(params) => {
              console.log("data", params);
              handleCustomerDetails("birthDate", params);
              setOpenBirthDatePicker(false);
            }}
          />
          <CustomInput
            value={moment(formData?.customerDetails?.birthDate).format(
              "YYYY-MM-DD"
            )}
            caption={strings.dob}
            onFocus={() => setOpenBirthDatePicker(true)}
            placeHolder={strings.dob}
            right={
              <TextInput.Icon
                onPress={() => setOpenBirthDatePicker(true)}
                style={{ width: 23, height: 23 }}
                theme={{ colors: { onSurfaceVariant: colors.gray } }}
                icon={"calendar"}
              />
            }
          />

          <CustomDropDownFullWidth
            selectedValue={formData?.customerDetails?.gender?.description}
            data={GENDER_LIST}
            onChangeText={(item) => handleCustomerDetails("gender", item)}
            value={formData?.customerDetails?.gender?.code}
            caption={strings.gender}
            placeHolder={"Select " + strings.gender}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.customerDetails?.idType?.description}
            data={CUSTOMER_ID_TYPE_LIST}
            onChangeText={(item) => handleCustomerDetails("idType", item)}
            value={formData?.customerDetails?.idType?.code}
            caption={strings.id_type}
            placeHolder={"Select " + strings.id_type}
          />
          <CustomInput
            value={formData?.customerDetails?.idValue}
            caption={strings.id_number}
            placeHolder={strings.id_number}
            onChangeText={(text) => handleCustomerDetails("idValue", text)}
          />
          <CustomInput
            value={formData?.customerDetails?.idPlace}
            caption={strings.place_of_issue}
            placeHolder={strings.place_of_issue}
            onChangeText={(text) => handleCustomerDetails("idPlace", text)}
          />
          {(customerCategoryCode === "BUS" ||
            customerCategoryCode === "GOV") && (
              <CustomInput
                value={formData?.customerDetails?.registeredNo}
                caption={strings.registereredNo}
                placeHolder={strings.registereredNo}
                onChangeText={(text) =>
                  handleCustomerDetails("registeredNo", text)
                }
              />
            )}
          <DatePicker
            modal
            mode="date"
            validRange={{ endDate: new Date() }}
            open={openRegDatePicker}
            onCancel={() => setOpenRegDatePicker(false)}
            date={formData?.customerDetails?.registeredDate || new Date()}
            maximumDate={new Date()}
            onConfirm={(params) => {
              console.log("data", params);
              handleCustomerDetails("registeredDate", params);
              setOpenRegDatePicker(false);
            }}
          />
          {(customerCategoryCode === "BUS" ||
            customerCategoryCode === "GOV") && (
              <CustomInput
                value={moment(formData?.customerDetails?.registeredDate).format(
                  "YYYY-MM-DD"
                )}
                caption={strings.registereredDate}
                onFocus={() => setOpenRegDatePicker(true)}
                placeHolder={strings.registereredDate}
                right={
                  <TextInput.Icon
                    onPress={() => setOpenRegDatePicker(true)}
                    style={{ width: 23, height: 23 }}
                    theme={{ colors: { onSurfaceVariant: colors.gray } }}
                    icon={"calendar"}
                  />
                }
              />
            )}
        </View>
      </View>
    );
  };



  // Step = 2
  const renderCustomerAddressUI = () => {
    const getCountryList = () => {
      const countryGetList = get(masterReducer, "masterdataData.COUNTRY", []);
      if (countryGetList.length == 0) return [];
      return countryGetList.map((item) => ({
        code: item?.code,
        description: item.description,
      }));
    };
    const isAutoAddress = addressTakenType == "AUTO";
    return (
      <View>
        <CustomTitleText title={"Customer Details"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={formData?.customerDetails?.emailId}
            caption={strings.email}
            placeHolder={strings.email}
            onChangeText={(text) => handleCustomerDetails("emailId", text)}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.customerDetails?.contactType?.description}
            data={CONTACT_TYPE_LIST}
            onChangeText={(item) => handleCustomerDetails("contactType", item)}
            value={formData?.customerDetails?.contactType?.code}
            caption={strings.contact_type}
            placeHolder={"Select " + strings.contact_type}
          />
          <CountryPicker
            show={countryPickModel}
            excludedCountries={excludedCountriesList()}
            pickerButtonOnPress={(item) => {
              handleCustomerDetails("mobilePrefix", item.dial_code);
              setCountryCode(item.dial_code);
              setCountryPickModel(false);
              setNumberMaxLength(getPhoneNumberLength(item.code));
            }}
            onBackdropPress={() => setCountryPickModel(false)}
            style={{
              modal: {
                height: "65%",
              },
            }}
          />
          <CustomInputWithCC
            onPressOnCountyCode={() => setCountryPickModel(true)}
            countryCode={countryCode}
            caption={strings.mobile_no}
            onChangeText={(text) => {
              handleCustomerDetails("mobileNo", text);
              setNumberError("");
            }}
            value={formData?.customerDetails?.mobileNo}
            placeHolder={strings.mobile_no}
            keyboardType="numeric"
            maxLength={numberMaxLength}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <CustomTitleText title={"Billing address"} />
          <Icon
            onPress={() => locationIconClick()}
            name="map"
            size={25}
            color={"#F5AD47"}
          />
        </View>
        <View style={styles.backgroundView}>
          <CustomDropDownFullWidth
            searchEnable={true}
            setDropDownEnable={() => setActiveDropDown("country")}
            disabled={isAutoAddress}
            selectedValue={get(formData, "customerDetails.country", "")}
            setValue={() => { }}
            data={getCountryList() ?? []}
            onChangeText={(text) => {
              console.log(">>", text);
              // onCountyClick(text)
              handleCustomerDetails("country", text?.code);
              handleCustomerDetails("state", "");
              handleCustomerDetails("district", "");
              handleCustomerDetails("city", "");
              handleCustomerDetails("postCode", "");

              if (addressTakenType != "AUTO") {
                setLoader(true);
                dispatch(
                  fetchRegisterFormData(
                    {
                      type: "COUNTRY",
                      search: text?.code,
                    },
                    () => setLoader(false)
                  )
                );
              }
            }}
            value={get(formData, "customerDetails.country", "")}
            isDisableDropDown={activeDropDown != "country"}
            placeHolder={strings.country + "*"}
            caption={strings.country + "*"}
          />

          <CustomInput
            disabled={isAutoAddress}
            value={get(formData, "customerDetails.address1", "")}
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => {
              handleCustomerDetails("address1", text);
            }}
          />
          <CustomInput
            disabled={isAutoAddress}
            value={get(formData, "customerDetails.address2", "")}
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => handleCustomerDetails("address2", text)}
          />
          <CustomInput
            disabled={isAutoAddress}
            value={get(formData, "customerDetails.address3", "")}
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => handleCustomerDetails("address3", text)}
          />

          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("state")}
            isDisableDropDown={activeDropDown != "state"}
            disabled={isAutoAddress}
            selectedValue={get(formData, "customerDetails.state", "")}
            setValue={() => { }}
            data={getUniqueState(savedLocation.addressLoopupData) ?? []}
            onChangeText={(text) => {
              handleCustomerDetails("state", text?.id);
              handleCustomerDetails("district", "");
              handleCustomerDetails("city", "");
              handleCustomerDetails("postCode", "");
            }}
            value={get(formData, "customerDetails.state", "")}
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("district")}
            isDisableDropDown={activeDropDown != "district"}
            disabled={isAutoAddress}
            selectedValue={get(formData, "customerDetails.district", "")}
            setValue={() => { }}
            data={
              getUniqueDistricts(
                savedLocation.addressLoopupData,
                get(formData, "customerDetails.state", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleCustomerDetails("district", text?.id);
              handleCustomerDetails("city", "");
              handleCustomerDetails("postCode", "");
            }}
            value={get(formData, "customerDetails.district", "")}
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("city")}
            isDisableDropDown={activeDropDown != "city"}
            disabled={isAutoAddress}
            selectedValue={get(formData, "customerDetails.city", "")}
            setValue={() => { }}
            data={
              getCityByDistrict(
                savedLocation.addressLoopupData,
                get(formData, "customerDetails.district", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleCustomerDetails("city", text?.id);
              handleCustomerDetails("postCode", "");
            }}
            value={get(formData, "customerDetails.city", "")}
            caption={"City/Town"}
            placeHolder={"City/Town"}
          />

          <CustomDropDownFullWidth
            disabled={isAutoAddress}
            setDropDownEnable={() => setActiveDropDown("postCode")}
            isDisableDropDown={activeDropDown != "postCode"}
            selectedValue={get(formData, "customerDetails.postCode", "")}
            setValue={() => { }}
            data={
              getPostCodeByCity(
                savedLocation.addressLoopupData,
                get(formData, "customerDetails.city", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleCustomerDetails("postCode", text?.id);
            }}
            value={get(formData, "customerDetails.postCode", "")}
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
        </View>
      </View>
    );
  };

  // Step = 3
  const renderServicesUI = () => {
    return (
      <View>
        <CustomTitleText title={"Select Category"} />
        <FlatList
          style={{ backgroundColor: "#fff", margin: 10, borderRadius: 10 }}
          numColumns={4}
          data={createCustomerReducerData.serviceCategories}
          renderItem={({ item, index }) => (
            <ServiceCategory
              item={item}
              onSelect={() => {
                dispatch(fetchServiceProducts(item.code, navigation));
              }}
              onDeSelect={() => {
                dispatch(removeCategoryProducts(item.code));
              }}
            />
          )}
          keyExtractor={(item, index) => index}
        />
        {/* <CustomTitleText title={"Select Service Type"} />
        <FlatList
          style={{ backgroundColor: "#fff", margin: 10, borderRadius: 10 }}
          numColumns={3}
          data={[{}, {}, {}, {}, {}]}
          renderItem={({ item, index }) => (
            <ServiceType name={`Service Type ${index + 1}`} />
          )}
          keyExtractor={(item, index) => index}
        /> */}
        {products.length > 0 && (
          <View>
            <CustomTitleText title={"Available Products"} />
            <FlatList
              data={products}
              renderItem={({ item, index }) => (
                <Product
                  item={item}
                  products={products}
                  setProducts={setProducts}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
        )}
      </View>
    );
  };

  // Step = 4
  const renderSelectedServicesUI = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <CustomTitleText title={"Need Quote Only"} />
          <Switch
            trackColor={{
              false: "#9A9A9A",
              true: "#F5AD47",
            }}
            thumbColor={"#fff"}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setFormData({ ...formData, getQuote: !formData?.getQuote });
            }}
            value={formData?.getQuote}
          />
        </View>
        <CustomTitleText title={"Selected Product"} />
        <SwipeListView
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
          data={products.filter((product) => product.quantity > 0)}
          renderItem={({ item, index }) => <SelectedProduct item={item} />}
          keyExtractor={(item, index) => index}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          stopRightSwipe={-100}
          onRowDidOpen={onRowDidOpen}
        />
        <CustomTitleText title={"Bill Details"} />
        <BillDetails
          details={{
            gTotal: calculateTotalBillAmount(),
            total: calculateTotalBillAmount(),
            gst: 0.0,
            discount: 0.0,
          }}
        />
      </View>
    );
  };

  // Step = 5
  const renderServiceAddressUI = () => {
    const getCountryList = () => {
      const countryGetList = get(masterReducer, "masterdataData.COUNTRY", []);
      if (countryGetList.length == 0) return [];
      return countryGetList.map((item) => ({
        code: item?.code,
        description: item.description,
      }));
    };
    const isAutoAddress = addressTakenType == "AUTO";
    return (
      <View>
        {/* Service address checkbox */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Checkbox
            status={isSameServiceAddressChecked ? "checked" : "unchecked"}
            onPress={() => {
              if (isSameServiceAddressChecked) {
                handleServiceDetails("address1", "");
                handleServiceDetails("address2", "");
                handleServiceDetails("address3", "");
                handleServiceDetails("country", "");
                handleServiceDetails("district", "");
                handleServiceDetails("postCode", "");
                handleServiceDetails("state", "");
                handleServiceDetails("city", "");
              } else {
                handleServiceDetails(
                  "address1",
                  get(formData, "customerDetails.address1", "")
                );
                handleServiceDetails(
                  "address2",
                  get(formData, "customerDetails.address2", "")
                );
                handleServiceDetails(
                  "address3",
                  get(formData, "customerDetails.address3", "")
                );
                handleServiceDetails(
                  "country",
                  get(formData, "customerDetails.country", "")
                );
                handleServiceDetails(
                  "district",
                  get(formData, "customerDetails.district", "")
                );
                handleServiceDetails(
                  "postCode",
                  get(formData, "customerDetails.postCode", "")
                );
                handleServiceDetails(
                  "state",
                  get(formData, "customerDetails.state", "")
                );
                handleServiceDetails(
                  "city",
                  get(formData, "customerDetails.city", "")
                );
              }
              setIsSameServiceAddressChecked(!isSameServiceAddressChecked);
            }}
          />
          <CustomTitleText
            title={"Service address same as customer address"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <CustomTitleText title={"Service address"} />
          {!isSameServiceAddressChecked && (
            <Icon
              onPress={() => locationIconClick()}
              name="map"
              size={25}
              color={"#F5AD47"}
            />
          )}
        </View>
        <View style={styles.backgroundView}>
          <CustomDropDownFullWidth
            searchEnable={true}
            setDropDownEnable={() => setActiveDropDown("country")}
            disabled={isSameServiceAddressChecked || isAutoAddress}
            selectedValue={get(formData, "serviceDetails.country", "")}
            setValue={() => { }}
            data={getCountryList() ?? []}
            onChangeText={(text) => {
              console.log(">>", text);
              // onCountyClick(text)
              handleServiceDetails("country", text?.code);
              handleServiceDetails("state", "");
              handleServiceDetails("district", "");
              handleServiceDetails("city", "");
              handleServiceDetails("postCode", "");

              if (addressTakenType != "AUTO") {
                setLoader(true);
                dispatch(
                  fetchRegisterFormData(
                    {
                      type: "COUNTRY",
                      search: text?.code,
                    },
                    () => setLoader(false)
                  )
                );
              }
            }}
            value={get(formData, "serviceDetails.country", "")}
            isDisableDropDown={activeDropDown != "country"}
            placeHolder={strings.country + "*"}
            caption={strings.country + "*"}
          />

          <CustomInput
            disabled={isSameServiceAddressChecked || isAutoAddress}
            value={get(formData, "serviceDetails.address1", "")}
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => {
              handleServiceDetails("address1", text);
            }}
          />
          <CustomInput
            disabled={isSameServiceAddressChecked || isAutoAddress}
            value={get(formData, "serviceDetails.address2", "")}
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => handleServiceDetails("address2", text)}
          />
          <CustomInput
            disabled={isSameServiceAddressChecked || isAutoAddress}
            value={get(formData, "serviceDetails.address3", "")}
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => handleServiceDetails("address3", text)}
          />

          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("state")}
            isDisableDropDown={activeDropDown != "state"}
            disabled={isSameServiceAddressChecked || isAutoAddress}
            selectedValue={get(formData, "serviceDetails.state", "")}
            setValue={() => { }}
            data={getUniqueState(savedLocation.addressLoopupData) ?? []}
            onChangeText={(text) => {
              handleServiceDetails("state", text?.id);
              handleServiceDetails("district", "");
              handleServiceDetails("city", "");
              handleServiceDetails("postCode", "");
            }}
            value={get(formData, "serviceDetails.state", "")}
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("district")}
            isDisableDropDown={activeDropDown != "district"}
            disabled={isSameServiceAddressChecked || isAutoAddress}
            selectedValue={get(formData, "serviceDetails.district", "")}
            setValue={() => { }}
            data={
              getUniqueDistricts(
                savedLocation.addressLoopupData,
                get(formData, "serviceDetails.state", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleServiceDetails("district", text?.id);
              handleServiceDetails("city", "");
              handleServiceDetails("postCode", "");
            }}
            value={get(formData, "serviceDetails.district", "")}
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("city")}
            isDisableDropDown={activeDropDown != "city"}
            disabled={isSameServiceAddressChecked || isAutoAddress}
            selectedValue={get(formData, "serviceDetails.city", "")}
            setValue={() => { }}
            data={
              getCityByDistrict(
                savedLocation.addressLoopupData,
                get(formData, "serviceDetails.district", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleServiceDetails("city", text?.id);
              handleServiceDetails("postCode", "");
            }}
            value={get(formData, "serviceDetails.city", "")}
            caption={"City/Town"}
            placeHolder={"City/Town"}
          />

          <CustomDropDownFullWidth
            disabled={isSameServiceAddressChecked || isAutoAddress}
            setDropDownEnable={() => setActiveDropDown("postCode")}
            isDisableDropDown={activeDropDown != "postCode"}
            selectedValue={get(formData, "serviceDetails.postCode", "")}
            setValue={() => { }}
            data={
              getPostCodeByCity(
                savedLocation.addressLoopupData,
                get(formData, "serviceDetails.city", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleServiceDetails("postCode", text?.id);
            }}
            value={get(formData, "serviceDetails.postCode", "")}
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
        </View>
      </View>
    );
  };

  // Step = 6
  const renderCreateAccount_DetailsUI = () => {
    return (
      <View>
        {/* Customer details checkbox */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Checkbox
            status={isSameCustomerDetailsChecked ? "checked" : "unchecked"}
            onPress={() => {
              if (isSameCustomerDetailsChecked) {
                handleAccountDetails("title", "");
                handleAccountDetails("firstName", "");
                handleAccountDetails("lastName", "");
                handleAccountDetails("birthDate", new Date());
                handleAccountDetails("gender", "");
                handleAccountDetails("idType", "");
                handleAccountDetails("idValue", "");
                handleAccountDetails("idPlace", "");
                handleAccountDetails("mobileNo", "");
                handleAccountDetails("mobilePrefix", "");
                handleAccountDetails("emailId", "");
                handleAccountDetails("registeredDate", new Date());
                handleAccountDetails("registeredNo", "");
              } else {
                handleAccountDetails(
                  "title",
                  get(formData, "customerDetails.title", "")
                );
                handleAccountDetails(
                  "firstName",
                  get(formData, "customerDetails.firstName", "")
                );
                handleAccountDetails(
                  "lastName",
                  get(formData, "customerDetails.lastName", "")
                );
                handleAccountDetails(
                  "birthDate",
                  get(formData, "customerDetails.birthDate", "")
                );
                handleAccountDetails(
                  "gender",
                  get(formData, "customerDetails.gender", "")
                );
                handleAccountDetails(
                  "idType",
                  get(formData, "customerDetails.idType", "")
                );
                handleAccountDetails(
                  "idValue",
                  get(formData, "customerDetails.idValue", "")
                );
                handleAccountDetails(
                  "idPlace",
                  get(formData, "customerDetails.idPlace", "")
                );
                handleAccountDetails(
                  "mobileNo",
                  get(formData, "customerDetails.mobileNo", "")
                );
                handleAccountDetails(
                  "mobilePrefix",
                  get(formData, "customerDetails.mobilePrefix", "")
                );
                handleAccountDetails(
                  "emailId",
                  get(formData, "customerDetails.emailId", "")
                );
                handleAccountDetails(
                  "registeredDate",
                  get(formData, "customerDetails.registeredDate", "")
                );
                handleAccountDetails(
                  "registeredNo",
                  get(formData, "customerDetails.registeredNo", "")
                );
              }
              setIsSameCustomerDetailsChecked(!isSameCustomerDetailsChecked);
            }}
          />
          <CustomTitleText
            title={"Use same customer details"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <CustomTitleText title={"Account Creation"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={formData?.accountDetails?.title}
            caption={strings.title}
            placeHolder={strings.title}
            onChangeText={(text) => handleAccountDetails("title", text)}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomInput
            value={formData?.accountDetails?.firstName}
            caption={strings.firstname}
            placeHolder={strings.firstname}
            onChangeText={(text) => handleAccountDetails("firstName", text)}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomInput
            value={formData?.accountDetails?.lastName}
            caption={strings.lastname}
            placeHolder={strings.lastname}
            onChangeText={(text) => handleAccountDetails("lastName", text)}
            disabled={isSameCustomerDetailsChecked}
          />
          <DatePicker
            modal
            mode="date"
            validRange={{ endDate: new Date() }}
            open={openBirthDatePicker}
            onCancel={() => setOpenBirthDatePicker(false)}
            date={formData?.accountDetails?.birthDate || new Date()}
            maximumDate={new Date()}
            onConfirm={(params) => {
              console.log("data", params);
              handleAccountDetails("birthDate", params);
              setOpenBirthDatePicker(false);
            }}
          />
          <CustomInput
            value={moment(formData?.accountDetails?.birthDate).format(
              "YYYY-MM-DD"
            )}
            caption={strings.dob}
            onFocus={() => setOpenBirthDatePicker(true)}
            placeHolder={strings.dob}
            right={
              <TextInput.Icon
                onPress={() =>
                  isSameCustomerDetailsChecked
                    ? {}
                    : setOpenBirthDatePicker(true)
                }
                style={{ width: 23, height: 23 }}
                theme={{ colors: { onSurfaceVariant: colors.gray } }}
                icon={"calendar"}
              />
            }
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.gender?.description}
            data={GENDER_LIST}
            onChangeText={(item) => handleAccountDetails("gender", item)}
            value={formData?.accountDetails?.gender?.code}
            caption={strings.gender}
            placeHolder={"Select " + strings.gender}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.idType?.description}
            data={CUSTOMER_ID_TYPE_LIST}
            onChangeText={(item) => handleAccountDetails("idType", item)}
            value={formData?.accountDetails?.idType?.code}
            caption={strings.id_type}
            placeHolder={"Select " + strings.id_type}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomInput
            value={formData?.accountDetails?.idValue}
            caption={strings.id_number}
            placeHolder={strings.id_number}
            onChangeText={(text) => handleAccountDetails("idValue", text)}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomInput
            value={formData?.accountDetails?.idPlace}
            caption={strings.place_of_issue}
            placeHolder={strings.place_of_issue}
            onChangeText={(text) => handleAccountDetails("idPlace", text)}
            disabled={isSameCustomerDetailsChecked}
          />
          {(customerCategoryCode === "BUS" ||
            customerCategoryCode === "GOV") && (
              <CustomInput
                value={formData?.accountDetails?.registeredNo}
                caption={strings.registereredNo}
                placeHolder={strings.registereredNo}
                onChangeText={(text) =>
                  handleAccountDetails("registeredNo", text)
                }
                disabled={isSameCustomerDetailsChecked}
              />
            )}
          <DatePicker
            modal
            mode="date"
            validRange={{ endDate: new Date() }}
            open={openRegDatePicker}
            onCancel={() => setOpenRegDatePicker(false)}
            date={formData?.accountDetails?.registeredDate || new Date()}
            maximumDate={new Date()}
            onConfirm={(params) => {
              console.log("data", params);
              handleAccountDetails("registeredDate", params);
              setOpenRegDatePicker(false);
            }}
          />
          {(customerCategoryCode === "BUS" ||
            customerCategoryCode === "GOV") && (
              <CustomInput
                value={moment(formData?.accountDetails?.registeredDate).format(
                  "YYYY-MM-DD"
                )}
                caption={strings.dob}
                onFocus={() => setOpenRegDatePicker(true)}
                placeHolder={strings.dob}
                right={
                  <TextInput.Icon
                    onPress={() =>
                      isSameCustomerDetailsChecked
                        ? {}
                        : setOpenRegDatePicker(true)
                    }
                    style={{ width: 23, height: 23 }}
                    theme={{ colors: { onSurfaceVariant: colors.gray } }}
                    icon={"calendar"}
                  />
                }
                disabled={isSameCustomerDetailsChecked}
              />
            )}

          <CountryPicker
            show={countryPickModel}
            excludedCountries={excludedCountriesList()}
            pickerButtonOnPress={(item) => {
              handleAccountDetails("mobilePrefix", item.dial_code);
              setCountryCode(item.dial_code);
              setCountryPickModel(false);
              setNumberMaxLength(getPhoneNumberLength(item.code));
            }}
            onBackdropPress={() => setCountryPickModel(false)}
            style={{
              modal: {
                height: "65%",
              },
            }}
          />
          <CustomInputWithCC
            onPressOnCountyCode={() => setCountryPickModel(true)}
            countryCode={countryCode}
            caption={strings.mobile_no}
            onChangeText={(text) => {
              handleAccountDetails("mobileNo", text);
              setNumberError("");
            }}
            value={formData?.accountDetails?.mobileNo}
            placeHolder={strings.mobile_no}
            keyboardType="numeric"
            maxLength={numberMaxLength}
            disabled={isSameCustomerDetailsChecked}
          />
          <CustomInput
            value={formData?.accountDetails?.emailId}
            caption={strings.email}
            placeHolder={strings.email}
            onChangeText={(text) => handleAccountDetails("emailId", text)}
            disabled={isSameCustomerDetailsChecked}
          />
        </View>
      </View>
    );
  };

  // Step = 7
  const renderCreateAccount_PreferencesUI = () => {
    return (
      <View>
        <CustomTitleText title={"Account Creation"} />
        <View style={styles.backgroundView}>
          <CustomDropDownFullWidth
            selectedValue={
              formData?.accountDetails?.accountCategory?.description
            }
            data={ACCOUNT_CATEGORY_LIST}
            onChangeText={(item) =>
              handleAccountDetails("accountCategory", item)
            }
            value={formData?.accountDetails?.accountCategory?.code}
            caption={strings.account_category}
            placeHolder={"Select " + strings.account_category}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.accountLevel?.description}
            data={ACCOUNT_LEVEL_LIST}
            onChangeText={(item) => handleAccountDetails("accountLevel", item)}
            value={formData?.accountDetails?.accountLevel?.code}
            caption={strings.account_level}
            placeHolder={"Select " + strings.account_level}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.billLang?.description}
            data={BILL_LANGUAGE_LIST}
            onChangeText={(item) => handleAccountDetails("billLang", item)}
            value={formData?.accountDetails?.billLang?.code}
            caption={strings.bill_lang}
            placeHolder={"Select " + strings.bill_lang}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.accountType?.description}
            data={ACCOUNT_TYPE_LIST}
            onChangeText={(item) => handleAccountDetails("accountType", item)}
            value={formData?.accountDetails?.accountType?.code}
            caption={strings.account_type}
            placeHolder={"Select " + strings.account_type}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.notifPref?.description}
            data={NOTIFICATION_TYPE_LIST}
            onChangeText={(item) => handleAccountDetails("notifPref", item)}
            value={formData?.accountDetails?.notifPref?.code}
            caption={strings.notification_pref}
            placeHolder={"Select " + strings.notification_pref}
          />
          <CustomDropDownFullWidth
            selectedValue={formData?.accountDetails?.currency?.description}
            data={CURRENCY_LIST}
            onChangeText={(item) => handleAccountDetails("currency", item)}
            value={formData?.accountDetails?.currency?.code}
            caption={strings.currency}
            placeHolder={"Select " + strings.currency}
          />
        </View>
      </View>
    );
  };

  // Step = 8
  const renderCreateAccount_AddressUI = () => {
    const getCountryList = () => {
      const countryGetList = get(masterReducer, "masterdataData.COUNTRY", []);
      if (countryGetList.length == 0) return [];
      return countryGetList.map((item) => ({
        code: item?.code,
        description: item.description,
      }));
    };
    const isAutoAddress = addressTakenType == "AUTO";
    return (
      <View>
        {/* Account address checkbox */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Checkbox
            status={isSameAccountAddressChecked ? "checked" : "unchecked"}
            onPress={() => {
              if (isSameAccountAddressChecked) {
                handleAccountDetails("address1", "");
                handleAccountDetails("address2", "");
                handleAccountDetails("address3", "");
                handleAccountDetails("country", "");
                handleAccountDetails("district", "");
                handleAccountDetails("postCode", "");
                handleAccountDetails("state", "");
                handleAccountDetails("city", "");
              } else {
                handleAccountDetails(
                  "address1",
                  get(formData, "customerDetails.address1", "")
                );
                handleAccountDetails(
                  "address2",
                  get(formData, "customerDetails.address2", "")
                );
                handleAccountDetails(
                  "address3",
                  get(formData, "customerDetails.address3", "")
                );
                handleAccountDetails(
                  "country",
                  get(formData, "customerDetails.country", "")
                );
                handleAccountDetails(
                  "district",
                  get(formData, "customerDetails.district", "")
                );
                handleAccountDetails(
                  "postCode",
                  get(formData, "customerDetails.postCode", "")
                );
                handleAccountDetails(
                  "state",
                  get(formData, "customerDetails.state", "")
                );
                handleAccountDetails(
                  "city",
                  get(formData, "customerDetails.city", "")
                );
              }
              setIsSameAccountAddressChecked(!isSameAccountAddressChecked);
            }}
          />
          <CustomTitleText
            title={"Account address same as customer address"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <CustomTitleText title={"Account address"} />
          {!isSameAccountAddressChecked && (
            <Icon
              onPress={() => locationIconClick()}
              name="map"
              size={25}
              color={"#F5AD47"}
            />
          )}
        </View>

        <View style={styles.backgroundView}>
          <CustomDropDownFullWidth
            searchEnable={true}
            setDropDownEnable={() => setActiveDropDown("country")}
            disabled={isSameAccountAddressChecked || isAutoAddress}
            selectedValue={get(formData, "accountDetails.country", "")}
            setValue={() => { }}
            data={getCountryList() ?? []}
            onChangeText={(text) => {
              console.log(">>", text);
              // onCountyClick(text)
              handleAccountDetails("country", text?.code);
              handleAccountDetails("state", "");
              handleAccountDetails("district", "");
              handleAccountDetails("city", "");
              handleAccountDetails("postCode", "");

              if (addressTakenType != "AUTO") {
                setLoader(true);
                dispatch(
                  fetchRegisterFormData(
                    {
                      type: "COUNTRY",
                      search: text?.code,
                    },
                    () => setLoader(false)
                  )
                );
              }
            }}
            value={get(formData, "accountDetails.country", "")}
            isDisableDropDown={activeDropDown != "country"}
            placeHolder={strings.country + "*"}
            caption={strings.country + "*"}
          />

          <CustomInput
            disabled={isSameAccountAddressChecked || isAutoAddress}
            value={get(formData, "accountDetails.address1", "")}
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => {
              handleAccountDetails("address1", text);
            }}
          />
          <CustomInput
            disabled={isSameAccountAddressChecked || isAutoAddress}
            value={get(formData, "accountDetails.address2", "")}
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => handleAccountDetails("address2", text)}
          />
          <CustomInput
            disabled={isSameAccountAddressChecked || isAutoAddress}
            value={get(formData, "accountDetails.address3", "")}
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => handleAccountDetails("address3", text)}
          />

          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("state")}
            isDisableDropDown={activeDropDown != "state"}
            disabled={isSameAccountAddressChecked || isAutoAddress}
            selectedValue={get(formData, "accountDetails.state", "")}
            setValue={() => { }}
            data={getUniqueState(savedLocation.addressLoopupData) ?? []}
            onChangeText={(text) => {
              handleAccountDetails("state", text?.id);
              handleAccountDetails("district", "");
              handleAccountDetails("city", "");
              handleAccountDetails("postCode", "");
            }}
            value={get(formData, "accountDetails.state", "")}
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("district")}
            isDisableDropDown={activeDropDown != "district"}
            disabled={isSameAccountAddressChecked || isAutoAddress}
            selectedValue={get(formData, "accountDetails.district", "")}
            setValue={() => { }}
            data={
              getUniqueDistricts(
                savedLocation.addressLoopupData,
                get(formData, "accountDetails.state", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleAccountDetails("district", text?.id);
              handleAccountDetails("city", "");
              handleAccountDetails("postCode", "");
            }}
            value={get(formData, "accountDetails.district", "")}
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            setDropDownEnable={() => setActiveDropDown("city")}
            isDisableDropDown={activeDropDown != "city"}
            disabled={isSameAccountAddressChecked || isAutoAddress}
            selectedValue={get(formData, "accountDetails.city", "")}
            setValue={() => { }}
            data={
              getCityByDistrict(
                savedLocation.addressLoopupData,
                get(formData, "accountDetails.district", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleAccountDetails("city", text?.id);
              handleAccountDetails("postCode", "");
            }}
            value={get(formData, "accountDetails.city", "")}
            caption={"City/Town"}
            placeHolder={"City/Town"}
          />

          <CustomDropDownFullWidth
            disabled={isSameAccountAddressChecked || isAutoAddress}
            setDropDownEnable={() => setActiveDropDown("postCode")}
            isDisableDropDown={activeDropDown != "postCode"}
            selectedValue={get(formData, "accountDetails.postCode", "")}
            setValue={() => { }}
            data={
              getPostCodeByCity(
                savedLocation.addressLoopupData,
                get(formData, "accountDetails.city", "")
              ) ?? []
            }
            onChangeText={(text) => {
              handleAccountDetails("postCode", text?.id);
            }}
            value={get(formData, "accountDetails.postCode", "")}
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
        </View>
      </View>
    );
  };

  // Step = 9
  const renderAgreementUI = () => {
    return (
      <View>
        <CustomTitleText title={"Customer Agreement"} />
        <CustomerAgreement
          signature={formData?.signature || null}
          setSignature={dispatchSetSignatureInFormData}
        />
      </View>
    );
  };

  // Step = 10
  const renderPreviewUI = () => {
    return (
      <View>
        <CustomTitleText title={"Customer Application form"} />
        <CustomTitleText
          title={`${formData?.customerDetails?.categoryType?.description} Customer Details`}
        />
        <View style={styles.backgroundView}>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {/* <PreviewInfoItem
              title={`Title`}
              value={formData?.customerDetails?.title || "NA"}
            /> */}
            <PreviewInfoItem
              title={`First Name`}
              value={formData?.customerDetails?.firstName || "NA"}
            />
            <PreviewInfoItem
              title={`Last Name`}
              value={formData?.customerDetails?.lastName || "NA"}
            />
            <PreviewInfoItem
              title={`Gender`}
              value={formData?.customerDetails?.gender?.description || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`DOB`}
              value={
                moment(formData?.customerDetails?.birthDate).format(
                  "YYYY-MM-DD"
                ) || "NA"
              }
            />
            <PreviewInfoItem
              title={`ID Type`}
              value={formData?.customerDetails?.idType?.description || "NA"}
            />
            <PreviewInfoItem
              title={`ID Number`}
              value={formData?.customerDetails?.idValue || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            {/* <PreviewInfoItem
              title={`ID Place`}
              value={formData?.customerDetails?.idPlace || "NA"}
            /> */}
            <PreviewInfoItem
              title={`Registration Date`}
              value={
                moment(formData?.customerDetails?.registeredDate).format(
                  "YYYY-MM-DD"
                ) || "NA"
              }
            />
            <PreviewInfoItem
              title={`Registration Number`}
              value={formData?.customerDetails?.registeredNo || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Email`}
              value={formData?.customerDetails?.emailId || "NA"}
            />
            <PreviewInfoItem
              title={`Contact`}
              value={
                formData?.customerDetails?.mobilePrefix +
                "-" +
                formData?.customerDetails?.mobileNo || "NA"
              }
            />
          </View>
        </View>
        <CustomTitleText title={"Customer Address"} />
        <View style={styles.backgroundView}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 1`}
              value={formData?.customerDetails?.address1 || "NA"}
            />
            <PreviewInfoItem
              title={`Address Line 2`}
              value={formData?.customerDetails?.address2 || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 3`}
              value={formData?.customerDetails?.address3 || "NA"}
            />
            <PreviewInfoItem
              title={`City`}
              value={formData?.customerDetails?.city || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`District`}
              value={formData?.customerDetails?.district || "NA"}
            />
            <PreviewInfoItem
              title={`State`}
              value={formData?.customerDetails?.state || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Country`}
              value={formData?.customerDetails?.country || "NA"}
            />
            <PreviewInfoItem
              title={`PostCode`}
              value={formData?.customerDetails?.postCode || "NA"}
            />
          </View>
        </View>
        <CustomTitleText title={"Product Details"} />
        {formData?.serviceDetails?.details.map((item, index) => (
          <SelectedProduct key={index} item={item} />
        ))}
        <CustomTitleText title={"Service Address"} />
        <View style={styles.backgroundView}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 1`}
              value={formData?.serviceDetails?.address1 || "NA"}
            />
            <PreviewInfoItem
              title={`Address Line 2`}
              value={formData?.serviceDetails?.address2 || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 3`}
              value={formData?.serviceDetails?.address3 || "NA"}
            />
            <PreviewInfoItem
              title={`City`}
              value={formData?.serviceDetails?.city || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`District`}
              value={formData?.serviceDetails?.district || "NA"}
            />
            <PreviewInfoItem
              title={`State`}
              value={formData?.serviceDetails?.state || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Country`}
              value={formData?.serviceDetails?.country || "NA"}
            />
            <PreviewInfoItem
              title={`PostCode`}
              value={formData?.serviceDetails?.postCode || "NA"}
            />
          </View>
        </View>
        <CustomTitleText title={"Account Details"} />
        <View style={styles.backgroundView}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            {/* <PreviewInfoItem
            title={`Title`}
            value={formData?.accountDetails?.title || "NA"}
          /> */}
            <PreviewInfoItem
              title={`First Name`}
              value={formData?.accountDetails?.firstName || "NA"}
            />
            <PreviewInfoItem
              title={`Last Name`}
              value={formData?.accountDetails?.lastName || "NA"}
            />
            <PreviewInfoItem
              title={`Gender`}
              value={formData?.accountDetails?.gender?.description || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`DOB`}
              value={
                moment(formData?.accountDetails?.birthDate).format(
                  "YYYY-MM-DD"
                ) || "NA"
              }
            />
            <PreviewInfoItem
              title={`ID Type`}
              value={formData?.accountDetails?.idType?.description || "NA"}
            />
            <PreviewInfoItem
              title={`ID Number`}
              value={formData?.accountDetails?.idValue || "NA"}
            />
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Account Category`}
              value={
                formData?.accountDetails?.accountCategory?.description || "NA"
              }
            />
            <PreviewInfoItem
              title={`Account Level`}
              value={
                formData?.accountDetails?.accountLevel?.description || "NA"
              }
            />
            <PreviewInfoItem
              title={`Account Type`}
              value={formData?.accountDetails?.accountType?.description || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Bill Language`}
              value={formData?.accountDetails?.billLang?.decription || "NA"}
            />
            <PreviewInfoItem
              title={`Notification Preference`}
              value={formData?.accountDetails?.notifPref?.description || "NA"}
            />
            <PreviewInfoItem
              title={`Currency`}
              value={formData?.accountDetails?.currency?.description || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            {/* <PreviewInfoItem
            title={`ID Place`}
            value={formData?.accountDetails?.idPlace || "NA"}
          /> */}
            <PreviewInfoItem
              title={`Registration Date`}
              value={
                moment(formData?.accountDetails?.registeredDate).format(
                  "YYYY-MM-DD"
                ) || "NA"
              }
            />
            <PreviewInfoItem
              title={`Registration Number`}
              value={formData?.accountDetails?.registeredNo || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Email`}
              value={formData?.accountDetails?.emailId || "NA"}
            />
            <PreviewInfoItem
              title={`Contact`}
              value={
                formData?.accountDetails?.mobilePrefix +
                "-" +
                formData?.accountDetails?.mobileNo || "NA"
              }
            />
          </View>
        </View>
        <CustomTitleText title={"Account Address"} />
        <View style={styles.backgroundView}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 1`}
              value={formData?.accountDetails?.address1 || "NA"}
            />
            <PreviewInfoItem
              title={`Address Line 2`}
              value={formData?.accountDetails?.address2 || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Address Line 3`}
              value={formData?.accountDetails?.address3 || "NA"}
            />
            <PreviewInfoItem
              title={`City`}
              value={formData?.accountDetails?.city || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`District`}
              value={formData?.accountDetails?.district || "NA"}
            />
            <PreviewInfoItem
              title={`State`}
              value={formData?.accountDetails?.state || "NA"}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <PreviewInfoItem
              title={`Country`}
              value={formData?.accountDetails?.country || "NA"}
            />
            <PreviewInfoItem
              title={`PostCode`}
              value={formData?.accountDetails?.postCode || "NA"}
            />
          </View>
        </View>
        {formData?.signature !== null && formData?.signature !== undefined && (
          <View>
            <CustomTitleText title={"Customer Agreement"} />
            <View style={styles.backgroundView}>
              <Image
                resizeMode={"cover"}
                style={styles.previewImgStyle}
                source={{ uri: formData?.signature }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const calculateTotalBillAmount = () => {
    let gTotal = 0;
    products.forEach((product) => {
      if (product.quantity > 0)
        gTotal = gTotal + product.quantity * product.price;
    });
    return gTotal;
  };

  const handleCustomerDetails = (key, value) => {
    let { customerDetails } = formData;
    customerDetails[key] = value;
    setFormData({ ...formData, customerDetails });
  };

  const handleAccountDetails = (key, value) => {
    let { accountDetails } = formData;
    accountDetails[key] = value;
    setFormData({ ...formData, accountDetails });
  };

  const handleServiceDetails = (key, value) => {
    let { serviceDetails } = formData;
    serviceDetails[key] = value;
    setFormData({ ...formData, serviceDetails });
  };

  const handlePrevious = () => {
    if (currentStep === 10 && formData?.getQuote) {
      dispatch(setCurrentStepInStore(4));
    } else if (currentStep === 9 && !createAccount) {
      dispatch(setCurrentStepInStore(5));
    } else if (currentStep === 7 && useSameCustomerDetails) {
      dispatch(setCurrentStepInStore(5));
    } else dispatch(setCurrentStepInStore(currentStep - 1));
  };

  const handleContinue = () => {
    console.log("current step", currentStep)
    switch (currentStep) {
      case 1: // Customer Details
        dispatch(createCustomer(formData, navigation));
        break;
      case 2: // Customer Address
        dispatch(updateCustomerData(formData, navigation));
        break;
      case 3: // Available Products

        let item = products.find((product) => product.quantity > 0);
        if (logg) console.log("Available Product", item, products)
        if (item === undefined)
          alert("Select atleast one service to continue!!!");
        else {
          const selectedProducts = products.filter(
            (product) => product.quantity > 0
          );

          handleServiceDetails("details", selectedProducts);
          dispatch(setCurrentStepInStore(currentStep + 1));
        }

        break;
      case 4: // Selected Products screen & Need quote only
        dispatch(createCustomerService(formData, navigation));
        break;
      case 5: // Service Address UI Step
        dispatch(updateCustomerServiceData(formData, currentStep, navigation));
        break;
      case 6: // Account Details
        dispatch(updateAccountData(formData, currentStep, navigation));
        break;
      case 7: // Account Preferences
        dispatch(updateAccountData(formData, currentStep, navigation));
        break;
      case FACE_RECOG_TAKE_SELFI:
        setShowCam(true)
        break;
      case FACE_RECOG_UPLOAD_DOCUS:
        setShowCam(true)
        break;

      case 8: // Account Address
        isSameAccountAddressChecked
          ? dispatch(
            updateCustomerServiceData(formData, currentStep, navigation)
          )
          : dispatch(updateAccountData(formData, currentStep, navigation));
        break;
      case 9: // Create Agreement & Signature
        dispatch(setSignatureInFormData(formData?.signature));
        dispatch(setCurrentStepInStore(currentStep + 1));
        break;
      default:
        dispatch(setCurrentStepInStore(currentStep + 1));
        break;
    }
  };

  const handleSubmit = () => {
    if (currentStep === 10 && formData?.getQuote) {
      dispatch(updateCustomerStatus(formData, navigation));
    } else {
      setShowCreateOrderModal(true);
    }
  };

  const handleAccountCreationNo = () => {
    dispatch(setShowAccountCreationModal(false));
    setCreateAccount(false);
    dispatch(setCurrentStepInStore(9));
  };

  const handleAccountCreationYes = () => {
    dispatch(setShowAccountCreationModal(false));
    setCreateAccount(true);
    setTimeout(() => setShowSameAccountDetailsModal(true), 100);
  };

  const handleCreateOrderYes = () => {
    setShowCreateOrderModal(false);
    dispatch(createOrderForCustomer(formData, navigation));
    dispatch(updateCustomerStatus(formData, navigation));
  };

  const handleSameAccountDetailsNo = () => {
    handleAccountDetails("title", "");
    handleAccountDetails("firstName", "");
    handleAccountDetails("lastName", "");
    handleAccountDetails("birthDate", new Date());
    handleAccountDetails("gender", "");
    handleAccountDetails("idType", "");
    handleAccountDetails("idValue", "");
    handleAccountDetails("idPlace", "");
    handleAccountDetails("mobileNo", "");
    handleAccountDetails("mobilePrefix", "");
    handleAccountDetails("emailId", "");
    handleAccountDetails("registeredDate", new Date());
    handleAccountDetails("registeredNo", "");
    setShowSameAccountDetailsModal(false);
    setUseSameCustomerDetails(false);
    dispatch(setCurrentStepInStore(currentStep + 1));
  };

  const handleSameAccountDetailsYes = () => {
    handleAccountDetails("title", get(formData, "customerDetails.title", ""));
    handleAccountDetails(
      "firstName",
      get(formData, "customerDetails.firstName", "")
    );
    handleAccountDetails(
      "lastName",
      get(formData, "customerDetails.lastName", "")
    );
    handleAccountDetails(
      "birthDate",
      get(formData, "customerDetails.birthDate", "")
    );
    handleAccountDetails("gender", get(formData, "customerDetails.gender", ""));
    handleAccountDetails("idType", get(formData, "customerDetails.idType", ""));
    handleAccountDetails(
      "idValue",
      get(formData, "customerDetails.idValue", "")
    );
    handleAccountDetails(
      "idPlace",
      get(formData, "customerDetails.idPlace", "")
    );
    handleAccountDetails(
      "mobileNo",
      get(formData, "customerDetails.mobileNo", "")
    );
    handleAccountDetails(
      "mobilePrefix",
      get(formData, "customerDetails.mobilePrefix", "")
    );
    handleAccountDetails(
      "emailId",
      get(formData, "customerDetails.emailId", "")
    );
    handleAccountDetails(
      "registeredDate",
      get(formData, "customerDetails.registeredDate", "")
    );
    handleAccountDetails(
      "registeredNo",
      get(formData, "customerDetails.registeredNo", "")
    );
    setShowSameAccountDetailsModal(false);
    setUseSameCustomerDetails(true);
    dispatch(setCurrentStepInStore(7));
  };

  const handleAccountTypeSelection = (item) => {
    handleCustomerDetails("categoryType", item);
    setShowCustomerTypeModal(false);
    dispatch(setCurrentStepInStore(currentStep + 1));
  };

  // For selected product swipe
  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  // Delete feature on swiping the selected product
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <Pressable
        style={[styles.backRightBtn]}
        onPress={() => {
          alert("Index: ", data.index);
        }}
      >
        <Icon name="delete" size={19} color={"#D13D3D"} />
        <Text style={{ color: "#D13D3D" }}>Delete</Text>
      </Pressable>
    </View>
  );

  const renderStepsIndicatorView = () => {
    return (
      <View style={styles.stepsView}>
        <StepIndicator
          customStyles={styles.firstIndicatorStyles}
          currentPosition={stepIndicator}
          stepCount={5}
          labels={["Customer", "Services", "Account", "Agreement", "Preview"]}
        />
      </View>
    );
  };
  const faceRecTitle = () => {
    switch (currentStep) {
      case FACE_RECOG_GET_START:
        return "Get started"
        break;
      case FACE_RECOG_IM_READY:
        return "I'm ready"
        break;
      case FACE_RECOG_TAKE_SELFI:
        return "Take selfie"
        break;
      case FACE_RECOG_UPLOAD_DOCUS:
        return "Upload document"
      case FACE_RECOG_UPLOAD_DOCUS_SUCCESS:
        return "Continue"
      default:
        break;
    }
    return ""
  }
  // render the buttons in the bottom based on the currentStep
  const renderBottomButtonsUI = () => {
    //no footer on success screens
    if (currentStep == FACE_RECOG_UPLOAD_SELFI_SUCCESS || currentStep == FACE_RECOG_UPLOAD_DOCUS_LOADER ||
      currentStep == FACE_RECOG_UPLOAD_DOCUS_SUCCESS)
      return null


    //face regnozise
    if (currentStep === FACE_RECOG_GET_START || currentStep === FACE_RECOG_IM_READY || currentStep === FACE_RECOG_TAKE_SELFI || currentStep == FACE_RECOG_UPLOAD_DOCUS || currentStep == FACE_RECOG_UPLOAD_DOCUS_SUCCESS) {
      return (
        <View style={styles.bottomButtonView}>
          <View style={{ flex: 1 }}>
            <CustomButton
              label={faceRecTitle()}
              onPress={() => {

                handleContinue()
                // dispatch(setCurrentStepInStore(currentStep + 1))

              }}
            />
          </View>
        </View>
      );
    }
    if (currentStep === FACE_RECOG_UPLOAD_SELFI) {
      return (
        <View style={styles.bottomButtonView}>
          <View style={{ flex: 1 }}>
            <CustomButton label={"Retake"} onPress={handlePrevious} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton label={"Continue"} onPress={() => {
              dispatch(setCurrentStepInStore(currentStep + 1))
            }} />
          </View>
        </View>
      );
    }

    if (currentStep === 0) {
      return (
        <View style={styles.bottomButtonView}>
          <View style={{ flex: 1 }}>
            <CustomButton

              label={strings.skip_proceed}
              onPress={() => setShowCustomerTypeModal(true)}
            />
          </View>
        </View>
      );
    }
    if (currentStep === 9) {
      return (
        <View style={styles.bottomButtonView}>
          <View style={{ flex: 1 }}>
            <CustomButton label={strings.previous} onPress={handlePrevious} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton
              label={strings.proceed_to_preview}
              onPress={handleContinue}
            />
          </View>
        </View>
      );
    }
    if (currentStep === 10) {
      return (
        <View style={styles.bottomButtonView}>
          <View style={{ flex: 1 }}>
            <CustomButton label={strings.previous} onPress={handlePrevious} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton label={strings.submit} onPress={handleSubmit} />
          </View>
        </View>
      );
    }
    // For all other currentStep
    return (
      <View style={styles.bottomButtonView}>
        <View style={{ flex: 1 }}>
          <CustomButton label={strings.previous} onPress={handlePrevious} />
        </View>
        <View style={{ flex: 1 }}>
          <CustomButton
            label={strings.save_continue}
            onPress={handleContinue}
          />
        </View>
      </View>
    );
  };

  const handleCustomerTypeIcon = (item) => {
    let icon = "";
    if (item.code === "BUS")
      icon = require("../../Assets/icons/ic_business.png");
    else if (item.code === "GOV")
      icon = require("../../Assets/icons/ic_government.png");
    else if (item.code === "REG")
      icon = require("../../Assets/icons/ic_regular.png");
    return icon;
  };

  const dispatchSetShowAccountCreationModal = (data) => {
    dispatch(setShowAccountCreationModal(data));
  };

  const dispatchSetSignatureInFormData = (data) => {
    dispatch(setSignatureInFormData(data));
  };

  const PreviewInfoItem = (props) => {
    const { title, value } = props;
    return (
      <View style={styles.previewInfoItemView}>
        <Text variant="bodySmall" style={styles.previewInfoItemTitleTxt}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.previewInfoItemValueTxt}>
          {value}
        </Text>
      </View>
    );
  };
  //main
  if (logg) console.log("Full State value", formData)

  return (
    <>
      {showFaceDection && <FaceDetection

        seURI={(async (data) => {
          setShowCam(false)
          console.log("hiiting", currentStep)
          if (currentStep == FACE_RECOG_TAKE_SELFI) {
            setUserIDImg({ ...userIDImg, face: data })
            await dispatch(setCurrentStepInStore(FACE_RECOG_UPLOAD_SELFI_SUCCESS));
            setTimeout(() => {
              dispatch(setCurrentStepInStore(FACE_RECOG_UPLOAD_DOCUS_LOADER));

            }, 1000)
          }
          else {
            setUserIDImg({ ...userIDImg, idCard: data })

            const formDataState = new FormData();
            formDataState.append('source', userIDImg.face);
            formDataState.append('target', userIDImg.idCard);

            dispatch(setCurrentStepInStore(FACE_RECOG_UPLOAD_DOCUS_LOADER));
            // console.log("formData", formDataState)
            const resImgCheck = await APICallForMuti(endPoints.FACE_MATCH_API, formDataState, "Face not verifed")
            if (resImgCheck.status) {
              dispatch(setCurrentStepInStore(FACE_RECOG_UPLOAD_DOCUS_SUCCESS));
              //api call if success data parse and give me
              const formDataState = new FormData();
              formDataState.append('file', userIDImg.idCard);
              const docuScanStatus = await APICallForMuti(endPoints.DOCU_SCAN, formDataState)
              //scaned docs
              if (docuScanStatus.status) {
                const docData = docuScanStatus.response
                handleCustomerDetails("firstName", get(docData, 'data.firstName', ''))
                handleCustomerDetails("lastName", get(docData, 'data.lastName', ''))
                handleCustomerDetails("idType", get(docData, 'data.idValue', ''))
                dispatch(setCurrentStepInStore(STEP_CUSTOMER_FORM));
              }
              else {
                dispatch(setCurrentStepInStore(STEP_CUSTOMER_FORM));

              }
            }
            else {
              dispatch(setCurrentStepInStore(FACE_RECOG_TAKE_SELFI));

            }

          }



        })
        }
        isIdcard={currentStep == FACE_RECOG_UPLOAD_DOCUS}
      />}
      <View style={styles.container}>

        {loader && <LoadingAnimation title={loaderLbl} />}
        {/* {renderStepsIndicatorView()} */}
        <ScrollView nestedScrollEnabled={true}>

          {currentStep == FACE_RECOG_GET_START && renderfaceRegconize()}
          {currentStep == FACE_RECOG_IM_READY && renderfaceRegconize()}
          {currentStep == FACE_RECOG_TAKE_SELFI && renderfaceRegconize()}
          {currentStep == FACE_RECOG_UPLOAD_SELFI && renderfaceRegconize()}
          {currentStep == FACE_RECOG_UPLOAD_SELFI_SUCCESS && renderfaceRegconize()}
          {currentStep == FACE_RECOG_UPLOAD_DOCUS && renderfaceRegconize()}
          {currentStep == FACE_RECOG_UPLOAD_DOCUS_LOADER && renderfaceRegconize()}
          {currentStep == FACE_RECOG_UPLOAD_DOCUS_SUCCESS && renderfaceRegconize()}
          {currentStep == 0 && renderUploadDocsUI()}
          {currentStep == STEP_CUSTOMER_FORM && renderCustomerDetailsUI()}
          {currentStep == 2 && renderCustomerAddressUI()}
          {currentStep == 3 && renderServicesUI()}
          {currentStep == 4 && renderSelectedServicesUI()}
          {currentStep == 5 && renderServiceAddressUI()}
          {currentStep == 6 && renderCreateAccount_DetailsUI()}
          {currentStep == 7 && renderCreateAccount_PreferencesUI()}
          {currentStep == 8 && renderCreateAccount_AddressUI()}
          {currentStep == 9 && renderAgreementUI()}
          {currentStep == 10 && renderPreviewUI()}
        </ScrollView>
        {/* Bottom Button View */}
        {renderBottomButtonsUI()}
        {/* Choose customer type modal */}
        <Modal
          visible={showCustomerTypeModal}
          dismissable={false}
          contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
        >
          <FooterModel
            open={showCustomerTypeModal}
            setOpen={setShowCustomerTypeModal}
            title={"Choose purpose of customer creation"}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={CUSTOMER_CATEGORY_LIST}
                numColumns={4}
                renderItem={({ item, index }) => (
                  <CustomerType
                    name={item.description}
                    icon={handleCustomerTypeIcon(item)}
                    onPress={() => handleAccountTypeSelection(item)}
                  />
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
          </FooterModel>
        </Modal>
        {/* Account Creation Modal */}
        <Modal
          visible={formData?.showAccountCreationModal}
          dismissable={false}
          contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
        >
          <FooterModel
            open={formData?.showAccountCreationModal}
            setOpen={dispatchSetShowAccountCreationModal}
            title={"Do you want to create an account?"}
          >
            <View style={styles.modalContainer}>
              <Pressable onPress={handleAccountCreationYes}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "#4C5A81",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable onPress={handleAccountCreationNo}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "red",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </FooterModel>
        </Modal>
        {/* Use customer details same as Account details Modal */}
        <Modal
          visible={showSameAccountDetailsModal}
          dismissable={false}
          contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
        >
          <FooterModel
            open={showSameAccountDetailsModal}
            setOpen={setShowSameAccountDetailsModal}
            title={"Do you want to use account details same as customer details?"}
          >
            <View style={styles.modalContainer}>
              <Pressable onPress={handleSameAccountDetailsYes}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "#4C5A81",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable onPress={handleSameAccountDetailsNo}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "red",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </FooterModel>
        </Modal>
        {/* Create Order Modal */}
        <Modal
          visible={showCreateOrderModal}
          dismissable={false}
          contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
        >
          <FooterModel
            open={showCreateOrderModal}
            setOpen={setShowCreateOrderModal}
            title={"Are you sure, you want to generate the order?"}
          >
            <View style={styles.modalContainer}>
              <Pressable onPress={handleCreateOrderYes}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "#4C5A81",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable onPress={() => setShowCreateOrderModal(false)}>
                <Text
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 20,
                    fontWeight: "600",
                    backgroundColor: "red",
                    borderRadius: 10,
                    color: "white",
                  }}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </FooterModel>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundView: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 10,
  },
  modalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingTop: 50,
  },
  stepsView: {
    backgroundColor: "#4C5A81",
    paddingVertical: 10,
  },
  bottomButtonView: {
    flexDirection: "row",
    bottom: 0,
    backgroundColor: "white",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 100,
    height: 80,
    backgroundColor: "#FEE5E4",
    right: 0,
    margin: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  firstIndicatorStyles: {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: "#4C5A81",
    separatorFinishedColor: "#fff",
    separatorUnFinishedColor: "#8FA1C4",

    stepIndicatorFinishedColor: "#fff",
    stepIndicatorUnFinishedColor: "#8FA1C4",
    stepIndicatorCurrentColor: "#ffffff",

    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 18,

    stepIndicatorLabelCurrentColor: "#000000",
    stepIndicatorLabelFinishedColor: "#4C5A81",
    stepIndicatorLabelUnFinishedColor: "#fff",

    labelColor: "#8FA1C4",
    labelSize: 14,
    currentStepLabelColor: "#fff",
  },
  previewImgStyle: {
    alignSelf: "center",
    width: "80%",
    height: 180,
  },
  previewInfoItemView: {
    flex: 1,
    flexDirection: "column",
  },
  previewInfoItemTitleTxt: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000000",
  },
  previewInfoItemValueTxt: {
    fontWeight: "400",
    fontSize: 12,
    color: "#000000",
    marginTop: 5,
  },
});

export default CreateCustomer;
