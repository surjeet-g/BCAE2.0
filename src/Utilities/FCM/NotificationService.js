import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { getDataFromDB, saveDataToDB } from "../../Storage/token";
import { storageKeys } from "../../Utilities/Constants/Constant";
import { strings } from "../Language";
/**
* Firebase Notification
* handle premission for firebase notification
* @method
*/
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
    getFcmDeviceId();
  }
}
/**
* Firebase Notification
* Fetch customer device Id and store it 
* @method
*/
const getFcmDeviceId = async () => {
  let fcmDeviceId = await getDataFromDB(storageKeys.FCM_DEVICE_ID);
  console.log("firebase utile function", fcmDeviceId);
  if (!fcmDeviceId) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await saveDataToDB(storageKeys.FCM_DEVICE_ID, fcmToken);
        console.log("success during FCM ID " + fcmToken);
      }
    } catch (error) {
      console.log("error during FCM ID " + error);
    }
  }
};
/**
* Firebase Notification
* Event Listner
* check if new notification is received or not
* @method
*/
export const notificationListener = async (navigation) => {
  try {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification received onNotificationOpenedApp :",
        remoteMessage.notification,
        remoteMessage
      );
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification received getInitialNotification :",
            remoteMessage.notification
          );
        }
      });
    //application in online
    messaging().onMessage(async (remoteMessage) => {
      getDataFromDB(storageKeys.PUSH_NOTIFICATION).then((result) => {
        if (result) {
          if (result.push_notification === true) {
            Alert.alert(
              remoteMessage.notification.title,
              remoteMessage.notification.body,
              [
                {
                  text: strings.cancel,
                  onPress: () => console.log("Cancel Pressed"),
                },
                {
                  text: strings.ok,
                  onPress: () => { },
                },
              ]
            );
          }
        }
      });

      console.log(
        "Notification received onMessage :",
        JSON.stringify(remoteMessage.notification)
      );
    });

    // try {
    //   getDataFromDB(storageKeys.PUSH_NOTIFICATION).then((result) => {
    //     if (result) {
    //       if (result.push_notification === true) {
    //         Alert.alert(
    //           remoteMessage.notification.title,
    //           remoteMessage.notification.body,
    //           [
    //             {
    //               text: strings.cancel,
    //               onPress: () => console.log("Cancel Pressed"),
    //             },
    //             {
    //               text: strings.ok,
    //               onPress: () => {},
    //             },
    //           ]
    //         );
    //       }
    //     }
    //   });
    // } catch (error) {
    //   console.log("error getting push notification");
    // }

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "Notification received setBackgroundMessageHandler :",
        JSON.stringify(remoteMessage.notification)
      );
    });
  } catch (error) {
    console.log(error);
  }
};
