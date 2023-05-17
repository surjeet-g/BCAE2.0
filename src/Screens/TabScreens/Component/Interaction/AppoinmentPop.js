import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from "react-native-calendars";
import { Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CustomDropDownFullWidth } from '../../../../Components/CustomDropDownFullWidth';
import { SHADOW_STYLE } from '../../../../Utilities/themeConfig';

var { height, width } = Dimensions.get('screen');
const AppointmentPop = ({ setAppoinmentPopup, appointList = [], locationList = [], appoinmentInfo1 = {} }) => {

    console.log("apointment lsit", appointList, "locationlist", locationList)
    console.log("",)
    const [selectedAppoinment, setSelectedAppointment] = useState({ code: "", description: "" })
    const [selLocation, setSelecetedLoc] = useState({ code: "", description: "" })
    const themConfig = {

        "stylesheet.calendar.header": {
            dayTextAtIndex0: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex6: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex1: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex2: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex3: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex4: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
            dayTextAtIndex5: {
                color: "black",
                backgroundColor: "#F5AD47",
            },
        },
        "stylesheet.calendar.main": {
            dayContainer: {
                borderColor: "#ffffff",
                borderWidth: 2,
                backgroundColor: "#E1E4EB",
                flex: 1,
            },
            emptyDayContainer: {
                borderColor: "#D1D3D4",
                borderWidth: 1,
                flex: 1,
                padding: 5,
            },
            week: {
                marginTop: 0,
                marginBottom: 0,
                flexDirection: "row",
                justifyContent: "space-around",
            },
        },
    }

    const appoinmentInfo = {
        "status": 200,
        "message": "Success",
        "data": {
            "events": [
                {
                    "id": "c38db937-bae9-4480-967c-4d07bdc9db85",
                    "title": "Appointment Available",
                    "start": "2023-05-16 07:00:00",
                    "end": "2023-05-16 08:00:00",
                    "extendedProps": {
                        "availableUsers": 3,
                        "appointDtlId": 4619,
                        "appointDate": "2023-05-16",
                        "appointStartTime": "07:00:00",
                        "appointEndTime": "08:00:00"
                    },
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB"
                },
                {
                    "id": "6adbee89-56e5-4819-9838-2d655889aad8",
                    "title": "Appointment Available",
                    "start": "2023-05-16 08:00:00",
                    "end": "2023-05-16 09:00:00",
                    "extendedProps": {
                        "availableUsers": 3,
                        "appointDtlId": 4620,
                        "appointDate": "2023-05-16",
                        "appointStartTime": "08:00:00",
                        "appointEndTime": "09:00:00"
                    },
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB"
                },
                {
                    "id": "f65fb8fc-3759-433a-b40d-cc6fcf2395e7",
                    "title": "Appointment Available",
                    "start": "2023-05-16 09:00:00",
                    "end": "2023-05-16 10:00:00",
                    "extendedProps": {
                        "availableUsers": 3,
                        "appointDtlId": 4621,
                        "appointDate": "2023-05-16",
                        "appointStartTime": "09:00:00",
                        "appointEndTime": "10:00:00"
                    },
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB"
                },
                {
                    "id": "a482fc0d-606e-4a42-ae87-00591e27b5d3",
                    "title": "Appointment Available",
                    "start": "2023-05-16 10:00:00",
                    "end": "2023-05-16 11:00:00",
                    "extendedProps": {
                        "availableUsers": 3,
                        "appointDtlId": 4622,
                        "appointDate": "2023-05-16",
                        "appointStartTime": "10:00:00",
                        "appointEndTime": "11:00:00"
                    },
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB"
                }
            ],
            "currentAppointments": [
                {
                    "id": "8a1e0f0b-e024-4b0a-abbe-1b933ad1f328",
                    "title": "Appointment Available",
                    "start": "2023-05-16 07:00:00",
                    "end": "2023-05-16 08:00:00",
                    "extendedProps": {},
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB",
                    "appointDtlId": 4619,
                    "slotName": "07:00 AM - 08:00 AM",
                    "appointUserId": 5,
                    "availableUsers": 3,
                    "appointDate": "2023-05-16",
                    "appointStartTime": "07:00:00",
                    "appointEndTime": "08:00:00"
                },
                {
                    "id": "276b2a62-c0bf-4302-8312-fc3122da37d0",
                    "title": "Appointment Available",
                    "start": "2023-05-16 08:00:00",
                    "end": "2023-05-16 09:00:00",
                    "extendedProps": {},
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB",
                    "appointDtlId": 4620,
                    "slotName": "08:00 AM - 09:00 AM",
                    "appointUserId": 5,
                    "availableUsers": 3,
                    "appointDate": "2023-05-16",
                    "appointStartTime": "08:00:00",
                    "appointEndTime": "09:00:00"
                },
                {
                    "id": "8c979398-f884-45a7-b889-748248a1d21b",
                    "title": "Appointment Available",
                    "start": "2023-05-16 09:00:00",
                    "end": "2023-05-16 10:00:00",
                    "extendedProps": {},
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB",
                    "appointDtlId": 4621,
                    "slotName": "09:00 AM - 10:00 AM",
                    "appointUserId": 5,
                    "availableUsers": 3,
                    "appointDate": "2023-05-16",
                    "appointStartTime": "09:00:00",
                    "appointEndTime": "10:00:00"
                },
                {
                    "id": "f9be1f6a-86ef-4af4-9c96-96c257dd35cb",
                    "title": "Appointment Available",
                    "start": "2023-05-16 10:00:00",
                    "end": "2023-05-16 11:00:00",
                    "extendedProps": {},
                    "backgroundColor": "#14A44D",
                    "borderColor": "#14A44D",
                    "textColor": "#FBFBFB",
                    "appointDtlId": 4622,
                    "slotName": "10:00 AM - 11:00 AM",
                    "appointUserId": 5,
                    "availableUsers": 3,
                    "appointDate": "2023-05-16",
                    "appointStartTime": "10:00:00",
                    "appointEndTime": "11:00:00"
                }
            ]
        }
    }

    const currenEvent = appoinmentInfo.data.currentAppointments;

    let marked = []


    currenEvent.length && currenEvent.map(item => {

        marked.push(item);
        return true
    })
    console.log("marked marked", marked)
    const checkIfExistingDateNdAppointDateMatching = (dateString, marked) => {
        if (marked.length == 0) return false;
        const data = marked.filter(it => it.appointDate == dateString)
        console.log("hitin", data)
        return data.length != 0 ? data[0] : false


    }
    return (
        <View
            style={{
                position: "absolute",

                width: width,
                height: height,
                backgroundColor: "transparent",
                zIndex: 999999999
            }}
        >
            <ScrollView
                style={{
                    marginTop: '30%',
                    paddingLeft: '4%',
                    alignSelf: "center",
                    backgroundColor: "white",
                    minHeight: height * 0.2,
                    maxHeight: height * 0.8,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    ...SHADOW_STYLE,
                }}
            >
                <View style={{ paddingHorizontal: 5, paddingRight: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            // position: "relative",
                            marginVertical: 5,
                            // flex: 1,
                            // height: 300,
                            marginHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 600,
                                color: "#202223",
                                fontSize: 16,
                                // flex: 1,
                            }}
                        >
                            Appointment
                        </Text>

                        <Icon
                            onPress={() => {
                                setAppoinmentPopup(false)
                            }}
                            name="close-circle"
                            size={25}
                            color={"#000"}
                        />
                    </View>

                    <CustomDropDownFullWidth
                        selectedValue={selectedAppoinment?.description}
                        data={appointList}
                        onChangeText={(text) => {
                            setSelectedAppointment(text)
                            console.log("hitting", text)

                        }}
                        value={selectedAppoinment?.code}
                        caption={"Appoinment Type"}
                        placeHolder={"Appoinment Type"}
                    />
                    {["BUS_VISIT", "CUST_VISIT"].includes(selectedAppoinment.code) &&
                        <CustomDropDownFullWidth
                            selectedValue={selLocation?.description}
                            data={locationList}
                            onChangeText={(text) => {
                                setSelecetedLoc(text)


                            }}
                            value={selLocation?.code}
                            caption={"Brach"}
                            placeHolder={"Brach"}
                        />
                    }
                </View>
                <Calendar
                    style={{
                        paddingBottom: 12,
                        borderRadius: 10,
                        width: width * 0.9,
                        height: height * 0.7,
                    }}

                    theme={themConfig}
                    current={new Date().toString()}
                    dayComponent={({ date, state, }) => {
                        const dayStatus = checkIfExistingDateNdAppointDateMatching(date?.dateString, marked)
                        return (
                            <View
                                style={{
                                    // flex: 1,
                                    height: height * 0.1,
                                    paddingTop: 5,
                                    backgroundColor: dayStatus == false ? "#ffffff" : dayStatus.backgroundColor,
                                    paddingHorizontal: 2,
                                    borderColor: 'gray',
                                    borderWidth: .5
                                }}
                            >
                                <Text
                                    style={
                                        ([
                                            styles.customDay,
                                            state === "disabled"
                                                ? styles.disabledText
                                                : styles.defaultText,
                                        ],
                                        {
                                            color: state === "disabled" ? "##d3d9de" : dayStatus == false ? "black" : dayStatus.textColor,
                                            textAlign: dayStatus == false ? "right" : "left",
                                            fontSize: dayStatus == false ? 10 : 10,
                                            paddingRight: dayStatus == false ? 0 : 5,
                                        })
                                    }
                                >
                                    {date?.day}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "left",
                                        fontSize: 10,
                                        paddingBottom: 5,
                                        color: dayStatus == false ? "black" : dayStatus.textColor,
                                    }}
                                >
                                    {dayStatus == false ? "" : dayStatus.title}
                                </Text>
                            </View>
                        );
                    }}
                    // markedDates={marked}
                    markingType={"custom"}
                    onDayPress={(day) => {
                        // setSelected(day.dateString);
                        // props.onDaySelect && props.onDaySelect(day);
                    }}
                />

                <View style={{ position: "relative", flexWrap: "wrap", flexDirection: "row", alignSelf: "flex-start", marginLeft: 30, top: -height * .06, zIndex: 999 }}>
                    {marked.length && marked.map(ite => {

                        return (
                            <Chip style={{ backgroundColor: 'green', marginRight: 5, marginBottom: 3 }}
                                textStyle={{ fontSize: 12, color: ite.textColor }}
                                onPress={() => console.log('Pressed')}
                                color="black" >{ite.slotName}</Chip>
                        )
                    })

                    }
                </View>

            </ScrollView>
        </View>
    )
}
export default AppointmentPop
const styles = StyleSheet.create({

    disabledText: {
        color: "grey",
    },
    defaultText: {
        color: "#000000",
    },
    customDay: {
        textAlign: "center",
    },

});