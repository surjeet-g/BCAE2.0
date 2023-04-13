import React, { useEffect, useLayoutEffect, useState, useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Image,
} from "react-native";
import get from "lodash.get";
import { CountryPicker } from "react-native-country-codes-picker";
import { Checkbox, Modal } from "react-native-paper";
import StepIndicator from "react-native-step-indicator";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  getMasterData,
  MASTER_DATA_CONSTANT,
} from "../../Redux/masterDataDispatcher";
import { CustomButton } from "./../../Components/CustomButton";
import { CustomDropDownFullWidth } from "./../../Components/CustomDropDownFullWidth";
import { CustomInput } from "./../../Components/CustomInput";
import { CustomInputWithCC } from "./../../Components/CustomInputWithCC";
import CustomTitleText from "./../../Components/CustomTitleText";
import { FooterModel } from "./../../Components/FooterModel";
import { strings } from "./../../Utilities/Language/index";
import {
  excludedCountriesList,
  getPhoneNumberLength,
} from "./../../Utilities/utils";
import BillDetails from "./BillDetails";
import { removeCategoryProducts } from "./CreateCustomerAction";
import { fetchServiceProducts } from "./CreateCustomerDispatcher";
import CustomerAgreement from "./CustomerAgreement";
import CustomerType from "./CustomerType";
import Product from "./Product";
import SelectedProduct from "./SelectedProduct";
import ServiceCategory from "./ServiceCategory";
import UploadDocument from "./UploadDocument";

const CreateCustomer = ({ navigation }) => {
  const dispatch = useDispatch([
    fetchServiceProducts,
    removeCategoryProducts,
    getMasterData,
  ]);
  const [formData, setFormData] = useState({
    getQuote: false,
    customerDetails: {},
    accountDetails: {},
    serviceDetails: { details: [], address: {} },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [stepIndicator, setStepIndicator] = useState(0);
  const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);
  const [showAccountCreationModal, setShowAccountCreationModal] =
    useState(false);
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
  const [signature, setSignature] = useState(null);

  let createCustomerReducerData = useSelector(
    (state) => state.createCustomerReducerData
  );
  let masterReducer = useSelector((state) => state.masterdata);

  const customerDetails = {};
  const serviceDetails = { details: [], address: {} };
  const accountDetails = {};
  const accountTypeCode = formData?.accountDetails?.accountType?.code;

  console.log("formData", JSON.stringify(formData));

  // Used to fetch master data
  useEffect(() => {
    const {
      CUSTOMER_ID_TYPE,
      CUSTOMER_CATEGORY,
      CONTACT_PREFERENCE,
      GENDER,
      NOTIFICATION_TYPE,
      BILL_LANGUAGE,
      CURRENCY,
      ACCOUNT_CATEGORY,
      ACCOUNT_LEVEL,
      ACCOUNT_TYPE,
      ACCOUNT_CLASS,
    } = MASTER_DATA_CONSTANT;

    dispatch(
      getMasterData(
        `${CUSTOMER_ID_TYPE},${CUSTOMER_CATEGORY},${CONTACT_PREFERENCE},${GENDER},${NOTIFICATION_TYPE},${BILL_LANGUAGE},${CURRENCY},${ACCOUNT_CATEGORY},${ACCOUNT_LEVEL},${ACCOUNT_TYPE},${ACCOUNT_CLASS}`
      )
    );
  }, []);
  const ID_TYPE_LIST = masterReducer.masterdataData.CUSTOMER_ID_TYPE;
  const GENDER_LIST = masterReducer.masterdataData.GENDER;

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

  // Step = 0
  const renderUploadDocsUI = () => {
    return (
      <View>
        <CustomTitleText title={"Upload your documents"} />
        <UploadDocument />
      </View>
    );
  };

  const handleCustomerDetails = (key, value) => {
    let { customerDetails } = formData;
    customerDetails[key] = value;
    setFormData({ ...formData, customerDetails });
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
          <CustomInput
            value={formData?.customerDetails?.birthDate}
            caption={strings.dob}
            placeHolder={strings.dob}
            onChangeText={(text) => handleCustomerDetails("birthDate", text)}
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
            data={ID_TYPE_LIST}
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
          {(accountTypeCode === "BUS" || accountTypeCode === "GOV") && (
            <CustomInput
              value={formData?.customerDetails?.registeredNo}
              caption={strings.registereredNo}
              placeHolder={strings.registereredNo}
              onChangeText={(text) =>
                handleCustomerDetails("registeredNo", text)
              }
            />
          )}
          {(accountTypeCode === "BUS" || accountTypeCode === "GOV") && (
            <CustomInput
              value={formData?.customerDetails?.registeredDate}
              caption={strings.registereredDate}
              placeHolder={strings.registereredDate}
              onChangeText={(text) =>
                handleCustomerDetails("registeredDate", text)
              }
            />
          )}
        </View>
      </View>
    );
  };

  const locationIconClick = () => {
    navigation.navigate("SavedLocation", {
      onPlaceChosen_2,
      fromPage: "CreateCustomer_2",
    });
  };

  const onPlaceChosen_2 = (params) => {
    // here is your callback function
    console.log("onPlaceChosen_2", JSON.stringify(params));
    // {"addressNo":"ADD00001016","addressType":"ADDBUSINESS","isPrimary":false,"address1":"hno1,b1","address2":"Uttara kannada,Karnataka","address3":"India,581351","addrZone":"India","city":"Karwar","district":"Uttara kannada","state":"Karnataka","postcode":"581351","country":"India","latitude":"0","longitude":"0"}
  };

  // Step = 2
  const renderCustomerAddressFormUI = () => {
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
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => handleCustomerDetails("contactType", text)}
            value={formData?.customerDetails?.contactType}
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
          <CustomInput
            value={formData?.customerDetails?.address1}
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => (customerDetails.address1 = text)}
          />
          <CustomInput
            value={formData?.customerDetails?.address2}
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => (customerDetails.address2 = text)}
          />
          <CustomInput
            value={formData?.customerDetails?.address3}
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => (customerDetails.address3 = text)}
          />
          <CustomInput
            value={formData?.customerDetails?.city}
            caption={"City/Town"}
            placeHolder={"City/Town"}
            onChangeText={(text) => (customerDetails.city = text)}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (customerDetails.district = text)}
            value={formData?.customerDetails?.district}
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (customerDetails.state = text)}
            value={formData?.customerDetails?.state}
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (customerDetails.postcode = text)}
            value={formData?.customerDetails?.postcode}
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (customerDetails.country = text)}
            value={formData?.customerDetails?.country}
            caption={strings.country}
            placeHolder={"Select " + strings.country}
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
            onValueChange={() =>
              setFormData({ ...formData, getQuote: !formData?.getQuote })
            }
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
            gTotal: calculateGTotal(),
            total: calculateGTotal() + 50 - 100,
            gst: 50.0,
            discount: 100.0,
          }}
        />
      </View>
    );
  };

  // Step = 5
  const renderServiceAddressUI = () => {
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
            onPress={() =>
              setIsSameServiceAddressChecked(!isSameServiceAddressChecked)
            }
          />
          <CustomTitleText
            title={"Service address same as customer address"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <CustomTitleText title={"Service Address"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.address1
                : formData?.serviceDetails?.address?.address1
            }
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => (serviceDetails.address.address1 = text)}
          />
          <CustomInput
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.address2
                : formData?.serviceDetails?.address?.address2
            }
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => (serviceDetails.address.address2 = text)}
          />
          <CustomInput
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.address3
                : formData?.serviceDetails?.address?.address3
            }
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => (serviceDetails.address.address3 = text)}
          />
          <CustomInput
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.city
                : formData?.serviceDetails?.address?.city
            }
            caption={"City/Town"}
            placeHolder={"City/Town"}
            onChangeText={(text) => (serviceDetails.address.city = text)}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (serviceDetails.address.district = text)}
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.district
                : formData?.serviceDetails?.address?.district
            }
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (serviceDetails.address.state = text)}
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.state
                : formData?.serviceDetails?.address?.state
            }
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (serviceDetails.address.postcode = text)}
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.postcode
                : formData?.serviceDetails?.address?.postcode
            }
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (serviceDetails.address.country = text)}
            value={
              isSameServiceAddressChecked
                ? formData?.customerDetails?.country
                : formData?.serviceDetails?.address?.country
            }
            caption={strings.country}
            placeHolder={"Select " + strings.country}
          />
        </View>
      </View>
    );
  };

  const handleAccountDetails = (key, data) => {
    console.log("$$$-handleAccountDetails-key", key);
    console.log("$$$-handleAccountDetails-data", data);
    let { accountDetails } = formData;
    console.log("$$$-handleAccountDetails-accountDetails", accountDetails);

    let obj = accountDetails[key];
    console.log("$$$-handleAccountDetails-obj", obj);

    obj = { ...obj, ...data };
    console.log("$$$-handleAccountDetails-new-obj", obj);

    accountDetails = { ...accountDetails, ...obj };
    console.log("$$$-handleAccountDetails-accountDetails", accountDetails);

    setFormData({ ...formData, accountDetails });
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
            onPress={() =>
              setIsSameCustomerDetailsChecked(!isSameCustomerDetailsChecked)
            }
          />
          <CustomTitleText
            title={"Use same customer details"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <CustomTitleText title={"Account Creation"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.title
                : formData?.accountDetails?.details?.title
            }
            caption={strings.title}
            placeHolder={strings.title}
            onChangeText={(text) => (accountDetails.details.title = text)}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.firstName
                : formData?.accountDetails?.details?.firstName
            }
            caption={strings.firstname}
            placeHolder={strings.firstname}
            onChangeText={(text) => (accountDetails.details.firstName = text)}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.lastName
                : formData?.accountDetails?.details?.lastName
            }
            caption={strings.lastname}
            placeHolder={strings.lastname}
            onChangeText={(text) => (accountDetails.details.lastName = text)}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.birthDate
                : formData?.accountDetails?.details?.birthDate
            }
            caption={strings.dob}
            placeHolder={strings.dob}
            onChangeText={(text) => (accountDetails.details.birthDate = text)}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.gender
                : formData?.accountDetails?.details?.gender
            }
            caption={strings.gender}
            placeHolder={strings.gender}
            onChangeText={(text) => (accountDetails.details.gender = text)}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (accountDetails.details.idType = text)}
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.idType
                : formData?.accountDetails?.details?.idType
            }
            caption={strings.id_type}
            placeHolder={"Select " + strings.id_type}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.idValue
                : formData?.accountDetails?.details?.idValue
            }
            caption={strings.id_number}
            placeHolder={strings.id_number}
            onChangeText={(text) => (accountDetails.details.idValue = text)}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.idPlace
                : formData?.accountDetails?.details?.idPlace
            }
            caption={strings.place_of_issue}
            placeHolder={strings.place_of_issue}
            onChangeText={(text) => (accountDetails.details.idPlace = text)}
          />
          {(accountTypeCode === "BUS" || accountTypeCode === "GOV") && (
            <CustomInput
              value={
                isSameCustomerDetailsChecked
                  ? formData?.customerDetails?.registeredNo
                  : formData?.accountDetails?.details?.registeredNo
              }
              caption={strings.registereredNo}
              placeHolder={strings.registereredNo}
              onChangeText={(text) =>
                (accountDetails.details.registeredNo = text)
              }
            />
          )}
          {(accountTypeCode === "BUS" || accountTypeCode === "GOV") && (
            <CustomInput
              value={
                isSameCustomerDetailsChecked
                  ? formData?.customerDetails?.registeredDate
                  : formData?.accountDetails?.details?.registeredDate
              }
              caption={strings.registereredDate}
              placeHolder={strings.registereredDate}
              onChangeText={(text) =>
                (accountDetails.details.registeredDate = text)
              }
            />
          )}

          <CountryPicker
            show={countryPickModel}
            excludedCountries={excludedCountriesList()}
            pickerButtonOnPress={(item) => {
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
              accountDetails.address.mobileNo = text;
              setNumberError("");
            }}
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.mobileNo
                : formData?.accountDetails?.address?.mobileNo
            }
            placeHolder={strings.mobile_no}
            keyboardType="numeric"
            maxLength={numberMaxLength}
          />
          <CustomInput
            value={
              isSameCustomerDetailsChecked
                ? formData?.customerDetails?.emailId
                : formData?.accountDetails?.address?.emailId
            }
            caption={strings.email}
            placeHolder={strings.email}
            onChangeText={(text) => (accountDetails.address.emailId = text)}
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
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) =>
              (accountDetails.details.accountCategory = text)
            }
            value={formData?.accountDetails?.details?.accountCategory}
            caption={strings.account_category}
            placeHolder={"Select " + strings.account_category}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) =>
              (accountDetails.details.accountLevel = text)
            }
            value={formData?.accountDetails?.details?.accountLevel}
            caption={strings.account_level}
            placeHolder={"Select " + strings.account_level}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (accountDetails.details.billLang = text)}
            value={formData?.accountDetails?.details?.billLang}
            caption={strings.bill_lang}
            placeHolder={"Select " + strings.bill_lang}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (accountDetails.details.accountType = text)}
            value={formData?.accountDetails?.details?.accountType}
            caption={strings.account_type}
            placeHolder={"Select " + strings.account_type}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (accountDetails.details.notifPref = text)}
            value={formData?.accountDetails?.details?.notifPref}
            caption={strings.notification_pref}
            placeHolder={"Select " + strings.notification_pref}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => (accountDetails.details.currency = text)}
            value={formData?.accountDetails?.details?.currency}
            caption={strings.currency}
            placeHolder={"Select " + strings.currency}
          />
        </View>
      </View>
    );
  };

  // Step = 8
  const renderCreateAccount_AddressUI = () => {
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
            onPress={() =>
              setIsSameAccountAddressChecked(!isSameAccountAddressChecked)
            }
          />
          <CustomTitleText
            title={"Account address same as customer address"}
            textStyle={{ marginTop: 0 }}
          />
        </View>
        <CustomTitleText title={"Account Address"} />
        <View style={styles.backgroundView}>
          <CustomInput
            value={""}
            caption={"Flat/House/Unit No/ Block"}
            placeHolder={"Flat/House/Unit No/ Block"}
            onChangeText={(text) => text}
          />
          <CustomInput
            value={""}
            caption={"Building Name/Others"}
            placeHolder={"Building Name/Others"}
            onChangeText={(text) => text}
          />
          <CustomInput
            value={""}
            caption={"Street/Area"}
            placeHolder={"Street/Area"}
            onChangeText={(text) => text}
          />
          <CustomInput
            value={""}
            caption={"City/Town"}
            placeHolder={"City/Town"}
            onChangeText={(text) => text}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => console.log(text)}
            value={""}
            caption={"District/Province"}
            placeHolder={"Select " + "District/Province"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => console.log(text)}
            value={""}
            caption={"State/Region"}
            placeHolder={"Select " + "State/Region"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => console.log(text)}
            value={""}
            caption={"Post/Zip Code"}
            placeHolder={"Select " + "Post/Zip Code"}
          />
          <CustomDropDownFullWidth
            selectedValue={""}
            setValue={""}
            data={[]}
            onChangeText={(text) => console.log(text)}
            value={""}
            caption={strings.country}
            placeHolder={"Select " + strings.country}
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
        <CustomerAgreement signature={signature} setSignature={setSignature} />
      </View>
    );
  };

  // Step = 10
  const renderPreviewUI = () => {
    return (
      <View>
        <CustomTitleText title={"Show Preview"} />
        {/* Show Preview View */}
        {signature !== null && (
          <Image
            resizeMode={"cover"}
            style={styles.previewImgStyle}
            source={{ uri: signature }}
          />
        )}
      </View>
    );
  };

  const calculateGTotal = () => {
    let gTotal = 0;
    products.forEach((product) => {
      if (product.quantity > 0)
        gTotal = gTotal + product.quantity * product.price;
    });
    return gTotal;
  };

  const handlePrevious = () => {
    if (currentStep === 10 && formData?.getQuote) {
      setCurrentStep(4);
    } else if (currentStep === 9 && !createAccount) {
      setCurrentStep(5);
    } else if (currentStep === 7 && useSameCustomerDetails) {
      setCurrentStep(5);
    } else setCurrentStep(currentStep - 1);
  };

  const handleContinue = () => {
    switch (currentStep) {
      case 1:
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        setCurrentStep(currentStep + 1);
        break;
      case 3:
        {
          let item = products.find((product) => product.quantity > 0);
          if (item === undefined)
            alert("Select atleast one service to continue!!!");
          else {
            const selectedProducts = products.filter(
              (product) => product.quantity > 0
            );
            serviceDetails.details = selectedProducts;
            setFormData({ ...formData, serviceDetails });
            setCurrentStep(currentStep + 1);
          }
        }
        break;
      case 4:
        {
          formData?.getQuote
            ? setCurrentStep(10)
            : setCurrentStep(currentStep + 1);
        }
        break;
      case 5:
        setShowAccountCreationModal(true);
        break;
      case 6:
        handleAccountDetails("details", accountDetails.details);
        setCurrentStep(currentStep + 1);
        break;
      case 7:
        handleAccountDetails("details", accountDetails.details);
        setCurrentStep(currentStep + 1);
        break;
      case 9:
        setFormData({ ...formData, signature });
        setCurrentStep(currentStep + 1);
        break;
      default:
        setCurrentStep(currentStep + 1);
        break;
    }
  };

  const handleSubmit = () => {
    alert("Submit with create customer API");
  };

  const handleAccountCreationNo = () => {
    setShowAccountCreationModal(false);
    setCreateAccount(false);
    setCurrentStep(9);
  };

  const handleAccountCreationYes = () => {
    setShowAccountCreationModal(false);
    setCreateAccount(true);
    setTimeout(() => setShowSameAccountDetailsModal(true), 100);
  };

  const handleSameAccountDetailsNo = () => {
    setShowSameAccountDetailsModal(false);
    setUseSameCustomerDetails(false);
    setCurrentStep(currentStep + 1);
  };

  const handleSameAccountDetailsYes = () => {
    setShowSameAccountDetailsModal(false);
    setUseSameCustomerDetails(true);
    setCurrentStep(7);
  };

  const handleAccountTypeSelection = (item) => {
    let { accountDetails } = formData;
    accountDetails = { ...accountDetails, accountType: item };
    setFormData({
      ...formData,
      accountDetails,
    });
    setShowCustomerTypeModal(false);
    setCurrentStep(currentStep + 1);
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

  // render the buttons in the bottom based on the currentStep
  const renderBottomButtonsUI = () => {
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
    // const Category = masterReducer.masterdataData.CUSTOMER_CATEGORY;
    let icon = "";
    if (item.code === "BUS")
      icon = require("../../Assets/icons/ic_business.png");
    else if (item.code === "GOV")
      icon = require("../../Assets/icons/ic_government.png");
    else if (item.code === "REG")
      icon = require("../../Assets/icons/ic_regular.png");
    return icon;
  };

  return (
    <View style={styles.container}>
      {renderStepsIndicatorView()}
      <ScrollView nestedScrollEnabled={true}>
        {currentStep == 0 && renderUploadDocsUI()}
        {currentStep == 1 && renderCustomerDetailsUI()}
        {currentStep == 2 && renderCustomerAddressFormUI()}
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
              data={masterReducer.masterdataData.CUSTOMER_CATEGORY}
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
        visible={showAccountCreationModal}
        dismissable={false}
        contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
      >
        <FooterModel
          open={showAccountCreationModal}
          setOpen={setShowAccountCreationModal}
          title={"Do you want to create an account?"}
        >
          <View style={styles.modalContainer}>
            <Pressable onPress={handleAccountCreationYes}>
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontSize: 20,
                  fontWeight: 600,
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
                  fontWeight: 600,
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
                  fontWeight: 600,
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
                  fontWeight: 600,
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
    margin: 20,
    backgroundColor: "red",
  },
});

export default CreateCustomer;
