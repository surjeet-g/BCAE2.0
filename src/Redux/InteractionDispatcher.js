import {
  enableLoaderAddInteractionAdd,
  enableLoaderEditInteraction,
  initInteraction,
  setInteractionData,
  setInteractionError,
  setInteractionsWorkFlowDataInStore,
  setInteractionsWorkFlowErrorDataInStore
} from "./InteractionAction";

import { serverCall } from "..//Utilities/API";
import { endPoints, requestMethod } from "../Utilities/API/ApiConstants";

import Toast from "react-native-toast-message";
import { typeOfAccrodin } from "../Screens/TabScreens/InteractionsToOrder";

export function fetchInteractionAction(
  type = "",
  page = 0,
  limit = 2,
  body = {
    searchParams: {},
  }
) {
  return async (dispatch) => {
    dispatch(initInteraction());


    let interactionResult
    if (type == typeOfAccrodin.rencently) {
      interactionResult = await serverCall(
        `${endPoints.INTERACTION_FETCH}?page=${page}&limit=${limit}`,
        requestMethod.POST,
        body
      );
    }
    else if (type == typeOfAccrodin.frequently) {
      interactionResult = await serverCall(
        `${endPoints.FREQUENTLY_ASKED}?limit=4`,
        requestMethod.GET,
        {}
      );
    }
    else if (type == typeOfAccrodin.category) {
      interactionResult = await serverCall(
        `${endPoints.FREQUENTLY_ASKED}?limit=4`,
        requestMethod.GET,
        {}
      );
    }
    else {
      return false
    }


    if (interactionResult?.success) {

      let data = []

      if (type == typeOfAccrodin.rencently) {
        data = interactionResult?.data?.data?.rows
      }
      else if (type == typeOfAccrodin.frequently) {
        console.log('1111', interactionResult)
        data = interactionResult?.data?.data

      }
      else if (type == typeOfAccrodin.category) {
        data = interactionResult?.data?.data
      }
      else {
        console.log('11111', data)
        data = []
      }

      dispatch(setInteractionData(data, false));
      return true;
    } else {
      dispatch(setInteractionError([]));
      return false;
    }
  };
}

export function updateInteractionAction(obj) {
  return async (dispatch) => {
    const validation = await validateFormData(obj, dispatch);
    if (!validation) return null;
    dispatch(enableLoaderEditInteraction(false));

    let result = await serverCall(
      endPoints.INTERACTION_UPDATE,
      requestMethod.PUT,
      obj
    );

    if (result.success) {
      dispatch(enableLoaderEditInteractionAdd(false));
      Toast.show({
        type: "bctSuccess",
        text1: result?.data?.message,
      });
      return true;
    } else {
      Toast.show({
        type: "bctError",
        text1: "Something wents wrong",
      });
      dispatch(setInteractionError([]));
      return false;
    }
  };
}

export function addInteractionAction(obj, fileAttachments) {

  return async (dispatch) => {
    // const validation = await validateFormData(obj, dispatch);
    // if (!validation) return null;

    dispatch(enableLoaderAddInteractionAdd(true));
    // if (fileAttachments.length != 0) {
    //   const uploadNW = await serverCall(
    //     endPoints.UPLOAD_ATTACHMENT,
    //     requestMethod.POST,
    //     params
    //   );
    //   let Ids = [];
    //   if (uploadNW?.success && uploadNW?.data) {
    //     const uploadIds = uploadNW?.data?.data;
    //     console.log("point follow", uploadIds);
    //     if (get(uploadIds, "length", false)) {
    //       Ids = uploadIds.map((id) => id.entityId);
    //     }
    //   }
    // }
    //if attachment having data 
    // if (Ids.length != 0) {
    //   obj = { ...obj, ...{ attachment: [Ids] } }
    // }

    let result = await serverCall(
      endPoints.INTERACTION_ADD,
      requestMethod.POST,
      obj
    );

    if (result.success) {
      dispatch(enableLoaderAddInteractionAdd(false));
      Toast.show({
        type: "bctSuccess",
        text1: result?.data?.message,
      });
      return { status: true, response: { id: 1 } };
    } else {
      Toast.show({
        type: "bctError",
        text1: "Something wents wrong",
      });
      dispatch(enableLoaderAddInteractionAdd(false));
      return { status: false, response: { id: 1, message: "dfdf" } };
    }
  };
}

const validateFormData = async (formData, dispatch) => {
  let status = false;
  //df,//df,//df,//df,//df,//df,//df,//df,//df
  return status;
};

export function getWorkFlowForInteractionID(
  interactionID,
  params = {},
  requireFollowUpData = false,
  navigation = null
) {
  return async (dispatch) => {
    let url =
      endPoints.INTERACTION_GET_WORKFLOW +
      interactionID +
      "?getFollwUp=" +
      requireFollowUpData;
    let result = await serverCall(url, requestMethod.GET, params, navigation);
    if (result.success) {
      console.log("$$$-getWorkFlowForInteractionID-data", result.data.data);
      dispatch(setInteractionsWorkFlowDataInStore(result.data.data));
    } else {
      console.log("$$$-getWorkFlowForInteractionID-error", result);
      dispatch(setInteractionsWorkFlowErrorDataInStore(result));
    }
  };
}
