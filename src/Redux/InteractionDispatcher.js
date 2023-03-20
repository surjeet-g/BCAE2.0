import {
  enableLoaderAddInteractionAdd,
  enableLoaderEditInteraction,
  initInteraction,
  setInteractionData,
  setInteractionError,
  setInteractionsWorkFlowDataInStore,
  setInteractionsWorkFlowErrorDataInStore,
  setInteractionsDetailsDataInStore,
  setInteractionsDetailsErrorDataInStore,
  setFollowupDataInStore,
  setFollowupErrorDataInStore,
} from "./InteractionAction";

import { serverCall } from "..//Utilities/API";
import { endPoints, requestMethod } from "../Utilities/API/ApiConstants";

import Toast from "react-native-toast-message";
import { typeOfAccrodin } from "../Screens/TabScreens/InteractionsToOrder";
import {
  getCustomerID,
  getCustomerUUID,
} from "../Utilities/UserManagement/userInfo";

export function fetchInteractionAction(type = "", params = {}) {
  return async (dispatch) => {
    dispatch(initInteraction());
    const customerUUID = await getCustomerUUID();
    const customerID = await getCustomerID();
    console.log("hititng", customerID, type);
    let interactionResult;
    if (type == typeOfAccrodin.rencently.value) {
      interactionResult = await serverCall(
        `${endPoints.INTERACTION_FETCH}?page=0&limit=4`,
        requestMethod.POST,
        {
          searchParams: {
            customerId: customerID,
          },
        }
      );
    } else if (type == typeOfAccrodin.frequently.value) {
      interactionResult = await serverCall(
        `${endPoints.FREQUENTLY_ASKED}?limit=4`,
        requestMethod.GET,
        {}
      );
    } else if (type == typeOfAccrodin.category.value) {
      interactionResult = await serverCall(
        `${endPoints.FREQUENTLY_ASKED}?limit=4`,
        requestMethod.GET,
        {}
      );
    } else if (type == typeOfAccrodin.searchbox.value) {
      interactionResult = await serverCall(
        `${endPoints.KNOWLEDGE_SEARCH_STATEMENT}?limit=4`,
        requestMethod.POST,
        {
          requestId: params.requestId,
          customerUuid: customerUUID,
        }
      );
    } else {
      dispatch(setInteractionError([]));
      return false;
    }

    console.log("terdsf", interactionResult.data, type);
    if (interactionResult?.success) {
      let data = [];

      if (type == typeOfAccrodin.rencently.value) {
        data = interactionResult?.data?.data?.rows;
      } else if (type == typeOfAccrodin.frequently.value) {
        data = interactionResult?.data?.data;
      } else if (type == typeOfAccrodin.category.value) {
        data = interactionResult?.data?.data;
      } else if (type == typeOfAccrodin.searchbox.value) {
        data = interactionResult?.data?.data;
      } else {
        data = [];
      }
      console.log("terdsf 1", data);

      dispatch(setInteractionData(data, false));
      return true;
    } else {
      console.log("error response", interactionResult);
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

      return {
        status: true,
        response: {
          intxnNo: result?.data?.data?.intxnNo,
          message: result?.data?.message,
        },
      };
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
  interactionId,
  params = {},
  navigation = null
) {
  console.log("$$$-getWorkFlowForInteractionID");
  return async (dispatch) => {
    let url =
      endPoints.INTERACTION_GET_WORKFLOW + interactionId + "?getFollowUp=true";
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

export function getInteractionDetailsForID(interactionId, navigation = null) {
  console.log("$$$-getInteractionDetailsForID");
  return async (dispatch) => {
    let url = endPoints.INTERACTION_FETCH + "?page=0&limit=1";
    let params = {
      searchParams: {
        interactionId,
      },
    };
    let result = await serverCall(url, requestMethod.POST, params, navigation);
    if (result.success) {
      console.log("$$$-getInteractionDetailsForID-data", result.data.data);
      console.log(
        "$$$-getInteractionDetailsForID-data-stringify",
        JSON.stringify(result.data.data)
      );
      console.log(
        "$$$-getInteractionDetailsForID-data-stringify-row[0]",
        JSON.stringify(result.data.data.rows[0])
      );
      dispatch(setInteractionsDetailsDataInStore(result.data.data));
    } else {
      console.log("$$$-getInteractionDetailsForID-error", result);
      dispatch(setInteractionsDetailsErrorDataInStore(result));
    }
  };
}

export function createFollowupForInteraction(
  interactionId,
  remarks,
  navigation = null
) {
  console.log("$$$-createFollowupForInteraction");
  return async (dispatch) => {
    let url = endPoints.INSERTFOLLOWUP;
    let params = {
      intxnId: interactionId,
      remarks,
    };
    let result = await serverCall(url, requestMethod.POST, params, navigation);
    if (result.success) {
      console.log("$$$-createFollowupForInteraction-data", result.data.data);
      dispatch(setFollowupDataInStore(result.data.data));
    } else {
      console.log("$$$-createFollowupForInteraction-error", result);
      dispatch(setFollowupErrorDataInStore(result));
    }
  };
}
