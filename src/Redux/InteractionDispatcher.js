import {
  enableLoaderAddInteractionAdd,
  enableLoaderEditInteraction,
  initInteraction, intractionKnowlegeHistoryRemoveUserInputTypes,
  setAssignInteractionToSelfDataInStore,
  setAssignInteractionToSelfErrorDataInStore,
  setCancelReasonsDataInStore,
  setCancelReasonsErrorDataInStore,
  setFollowupDataInStore,
  setFollowupErrorDataInStore, setgetAppoinmentsData, setInteractionData,
  setInteractionError, setInteractionsDetailsDataInStore,
  setInteractionsDetailsErrorDataInStore, setInteractionsFollowupDataInStore,
  setInteractionsFollowupErrorDataInStore, setInteractionsSearchDataInStore, setInteractionsSearchErrorDataInStore, setInteractionsWorkFlowDataInStore,
  setInteractionsWorkFlowErrorDataInStore,
  setknowledgeHistory,
  setStatusDataInStore,
  setStatusErrorDataInStore,
  setUsersByRoleDataInStore,
  setUsersByRoleErrorDataInStore
} from "./InteractionAction";

import { serverCall } from "..//Utilities/API";
import { endPoints, requestMethod } from "../Utilities/API/ApiConstants";

import get from "lodash.get";
import Toast from "react-native-toast-message";
import { typeOfAccrodin } from "../Screens/TabScreens/InteractionsToOrder";
import {
  getCustomerID
} from "../Utilities/UserManagement/userInfo";

/**
* Reducer Dispatch
* Handle API call for Fetch Interaction details for Top category and Recently Interaction
* @memberOf Interaction
* @param  {string} type type of data eg (frequently,category)
* @returns {Object} Dispatcher to reducer
*/
export function fetchInteractionAction(type = "", params = {},
  isRemovedHistory = false) {
  return async (dispatch) => {
    const debg = true;
    try {
      console.log('a1..............', type)
      console.log('a2..............', typeOfAccrodin.knowlegde.value)
      console.log('a3..............', typeOfAccrodin.workflow.value)


      if (type != typeOfAccrodin.knowlegde.value && type != typeOfAccrodin.workflow.value) {
        dispatch(initInteraction());
      }

      // const customerUUID = await getCustomerUUID();
      const customerID = await getCustomerID();
      let flowId;

      let interactionResult;
      if (type == typeOfAccrodin.rencently.value) {
        console.log('b..............')

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
        console.log('c..............')

        interactionResult = await serverCall(
          `${endPoints.FREQUENTLY_ASKED}?limit=4`,
          requestMethod.GET,
          {}
        );
      }


      else if (type == typeOfAccrodin.category.value) {
        console.log('d..............')

        interactionResult = await serverCall(
          `${endPoints.FREQUENTLY_ASKED}?limit=4`,
          requestMethod.GET,
          {}
        );
      }


      else if (type == typeOfAccrodin.workflow.value) {
        console.log('e..............')

        //remove all userinput knowlege data
        if (isRemovedHistory) {
          dispatch(intractionKnowlegeHistoryRemoveUserInputTypes())
        }
        let converstionHistory = []
        const mockArray = Array.from({ length: 50 }, (_, x) => x + 1)

        for await (const num of mockArray) {
          const workflowResult = await serverCall(
            `${endPoints.INTERACTION_WORKFLOW}`,
            requestMethod.POST,
            params
          );

          if (workflowResult.success) {

            const tempConv = get(workflowResult, 'data.data.conversation', [])

            if (tempConv.length != 0) {
              converstionHistory.push(tempConv)
            }

            const callAgain = get(workflowResult, 'data.data.callAgain', false)
            const actionType = get(workflowResult, 'data.data.actionType', false)

            console.log('callagain', callAgain)
            if (!callAgain || actionType == "COLLECTINPUT" || actionType == "WORKFLOWEND") {
              break;
            }
          }
          else {
            break;
          }
        }
        dispatch(setknowledgeHistory(converstionHistory))
        return null

      }


      else if (type == typeOfAccrodin.knowlegde.value) {
        console.log('param knowledge', params)
        interactionResult = await serverCall(
          `${endPoints.KNOWLEDGE_SEARCH_STATEMENT}`,
          requestMethod.POST,
          params
        );
        console.log('dispatcher result', interactionResult)

      }


      else {
        dispatch(setInteractionError([]));
        return false;
      }


      if (debg) {
        console.log('API Requrest', interactionResult, "API STATUS", interactionResult?.success, "API DATA", interactionResult?.data)
      }
      let noService;
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
        }
        else if (type == typeOfAccrodin.knowlegde.value) {
          //knowledge value
          //array of data for showing history of resol
          console.log('workflow success search result', interactionResult)
          flowId = get(interactionResult, 'data.data.flwId', '')
          console.log('interact->dispater->knwolege:flowId', flowId)
          console.log('interact->dispater->knwolege result', interactionResult)
          //for showing history in pop 
          let converstionHistory = []
          noService = get(interactionResult, 'data.data.resolutionAction.noService', false)
          console.log('flowId got..', flowId)

          if (flowId != "") {
            console.log('flowId not empty..')
            const conversationID = get(interactionResult, 'data.data.conversationUid', '')

            console.log('conversationID got..', conversationID)
            const mockArray = Array.from({ length: 50 }, (_, x) => x + 1)
            console.log('mockArray got..', mockArray)
            // console.log('mockArray', mockArray)
            // (async function () {

            const bodyworkflow = {
              flowId: flowId,
              conversationUid: conversationID,
              data: {
                source: "knowledgeBase"
              },
            }

            for await (const num of mockArray) {
              console.log('hititng inside',)
              const workflowResult = await serverCall(
                `${endPoints.INTERACTION_WORKFLOW}`,
                requestMethod.POST,
                bodyworkflow
              );
              if (debg) {
                console.log('WORFLOW', "Body", bodyworkflow, "API Resp", workflowResult.data, "API ", workflowResult)
              }
              const tempConv = get(workflowResult, 'data.data.conversation', [])
              console.log('conversation', tempConv)
              if (tempConv.length != 0) {
                converstionHistory.push(tempConv)
              }
              const callAgain = get(workflowResult, 'data.data.callAgain', false)
              const actionType = get(workflowResult, 'data.data.actionType', false)
              const description = get(workflowResult, 'data.data.description', false)
              console.log('callagain', callAgain)
              if (!callAgain || actionType == "COLLECTINPUT" || actionType == "WORKFLOWEND" || (actionType == "SENDMESSAGE" && description == "PRODUCT PURCHASE")) {
                break;
              }
            }
            // })();



            console.log('converstionHistory', converstionHistory)

            dispatch(setknowledgeHistory(converstionHistory))
          }

          data = get(interactionResult, 'data.data', []);
        }
        else {
          data = [];
        }
        // if (type == typeOfAccrodin.knowlegde.value) {

        // }

        dispatch(setInteractionData(data, false));

        console.log('data after', data)
        if (type == typeOfAccrodin.knowlegde.value) {
          console.log('flow Id ', flowId)

          const actionTypea = noService ? "noservive" : (flowId != "") ? "auto_resolution" : "choose_item"
          return { response: data, actionType: actionTypea };
        }
        else {
          return { response: data, actionType: "auto_resolution" }
        }

      } else {
        console.log("error response", interactionResult);
        dispatch(setInteractionError([]));
        return false;
      }
      return { response: [], actionType: "auto_resolution" }
    } catch (error) {

      console.log('error', error)
      return null
    }
    return { response: [], actionType: "auto_resolution" }
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
      dispatch(enableLoaderEditInteraction(false));
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

/**
* Reducer Dispatch
* Handle API call for create interaction
* @memberOf Interaction
* @param  {Object} obj payload for create interaction API
* @param  {Object} fileAttachments file attachments payload for create interaction API
* @returns {Object} Dispatcher to reducer
*/
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
    console.log("add interaction payload", obj)
    let result = await serverCall(
      endPoints.INTERACTION_ADD,
      requestMethod.POST,
      obj
    );
    console.log("add interaction payload", result)
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
          intxnId: result?.data?.data?.intxnId,
          message: result?.data?.message,
        },
      };
    } else {
      console.log("resssss", result)
      Toast.show({
        type: "bctError",
        text1: result?.message || "Something wents wrong",
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




/**
* Reducer Dispatch
* Handle API call for getting workflow by inteaction id
* @memberOf Interaction
* @param  {number} interactionId interaction ID
* @param  {Object} navigation handle section timeout
* @returns {Object} Dispatcher to reducer
*/
export function getWorkFlowForInteractionID(interactionId, navigation = null) {
  return async (dispatch) => {
    let url = endPoints.INTERACTION_GET_WORKFLOW + interactionId + "?getFollowUp=false";
    console.log("workflow interaction request..", url);
    let result = await serverCall(url, requestMethod.GET, {}, navigation);
    console.log("workflow interaction response..", result);
    if (result.success) {
      dispatch(setInteractionsWorkFlowDataInStore(result.data.data));
    } else {
      dispatch(setInteractionsWorkFlowErrorDataInStore(result));
    }
  };
}



/**
* Reducer Dispatch
* Handle API call for getting followup by inteaction id
* @memberOf Interaction
* @param  {number} interactionId interaction ID
* @param  {Object} navigation handle section timeout
* @returns {Object} Dispatcher to reducer
*/
export function getFollowupForInteractionID(interactionId, navigation = null) {
  return async (dispatch) => {
    let url =
      endPoints.INTERACTION_GET_WORKFLOW + interactionId + "?getFollowUp=true";
    let result = await serverCall(url, requestMethod.GET, {}, navigation);
    if (result.success) {
      dispatch(setInteractionsFollowupDataInStore(result.data.data));
    } else {
      dispatch(setInteractionsFollowupErrorDataInStore(result));
    }
  };
}

/**
* Reducer Dispatch
* Handle API call for getting interaction details by inteaction id
* @memberOf Interaction
* @param  {number} interactionId interaction ID
* @param  {Object} navigation handle section timeout
* @returns {Object} Dispatcher to reducer
*/
export function getInteractionDetailsForID(interactionId, navigation = null) {
  return async (dispatch) => {
    console.log("interactionL ID", interactionId)
    let url = endPoints.INTERACTION_FETCH + "?page=0&limit=1";
    let params = {
      searchParams: {
        interactionId: Number(interactionId)
      },
    };
    let result = await serverCall(url, requestMethod.POST, params, navigation);
    console.log("interactionL resul", result)
    if (result.success) {
      dispatch(setInteractionsDetailsDataInStore(result.data.data));
    } else {
      dispatch(setInteractionsDetailsErrorDataInStore(result));
    }
  };
}

export function getInteractionDetailsSearch(params, navigation = null) {
  return async (dispatch) => {
    console.log("interaction search begins..", params)
    let url = endPoints.INTERACTION_FETCH + "?page=0&limit=1";
    console.log("interaction search url..", url)
    let result = await serverCall(url, requestMethod.POST, params, navigation);
    console.log("interaction search result..", result)
    if (result.success) {
      console.log("interaction search success..", result.data.data)
      dispatch(setInteractionsSearchDataInStore(result.data.data));
    } else {
      console.log("interaction search failure..")
      dispatch(setInteractionsSearchErrorDataInStore(result));
    }
  };
}

export function createFollowupForInteractionID(
  interactionId,
  param,
  navigation = null
) {
  return async (dispatch) => {
    let url = endPoints.INSERTFOLLOWUP;
    console.log("createFollowupForInteractionID url..", url);
    let params = {
      interactionNumber: "" + interactionId,
      remarks: param.formRemarks,
      priorityCode: param.formPriority.code,
      source: param.formSource.code,
    };
    console.log("createFollowupForInteractionID params..", params);
    let result = await serverCall(url, requestMethod.POST, params, navigation);
    console.log("$$$-createFollowupForInteractionID-result", result);

    if (result.success) {
      Toast.show({
        type: "bctSuccess",
        text1: result?.data?.message,
      });
      dispatch(setFollowupDataInStore(result.data.data));
      return true
    } else {
      Toast.show({
        type: "bctError",
        text1: result.message,
      });
      dispatch(setFollowupErrorDataInStore(result));
      return false
    }
  };
}

export function assignInteractionToSelf(
  interactionId,
  userId,
  type
) {
  return async (dispatch) => {

    let url = endPoints.INTERACTION_ASSIGN_SELF + interactionId;

    if (userId == "") {
      let params = {
        type
      };
      let result = await serverCall(url, requestMethod.PUT, params);
      console.log("self assign result..", result)

      if (result.success) {
        console.log("self assign success..", result)
        Toast.show({
          type: "bctSuccess",
          text1: "" + result.message,
        });
        dispatch(setAssignInteractionToSelfDataInStore(result));
      } else {
        console.log("self assign failure..", result)
        Toast.show({
          type: "bctError",
          text1: "" + result.message,
        });
        dispatch(setAssignInteractionToSelfErrorDataInStore(result));
      }
    }
    else {
      let params = {
        userId,
        type
      };
      let result = await serverCall(url, requestMethod.PUT, params);
      console.log("re assign success..", result)

      if (result.success) {
        Toast.show({
          type: "bctSuccess",
          text1: "" + result.message,
        });
        dispatch(setAssignInteractionToSelfDataInStore(result));
      } else {
        Toast.show({
          type: "bctError",
          text1: "" + result.message,
        });
        dispatch(setAssignInteractionToSelfErrorDataInStore(result));
      }
    }

  };
}




export function cancelInteraction(
  cancelReason,
  interactionId
) {
  return async (dispatch) => {

    let url = endPoints.CANCEL_INTERACTION + interactionId;
    console.log("cancel int url..", url)

    let params = {
      cancelReason
    };
    let result = await serverCall(url, requestMethod.PUT, params);
    console.log("cancel int result..", result)

    if (result.success) {
      console.log("cancel int success..", result)
      Toast.show({
        type: "bctSuccess",
        text1: "" + result.message,
      });
      // dispatch(setAssignInteractionToSelfDataInStore(result));
    } else {
      console.log("cancel int failure..", result)
      Toast.show({
        type: "bctError",
        text1: "" + result.message,
      });
      // dispatch(setAssignInteractionToSelfErrorDataInStore(result));
    }

  };
}


/**
* Reducer Dispatch
* Handle API call for getting appointment details
* @memberOf Interaction
* @param  {Object} payload interaction ID
* @returns {Object} Dispatcher to reducer
*/
export const getAppoinmentsData = (payload, type = "templete") => {
  return async (dispatch) => {
    // const appPayload = {

    // }
    let result;
    if (type == "getAppoinment") {
      result = await serverCall(endPoints.INTERACTION_AVALABLE_APPOINMENT, requestMethod.POST, payload)

    }
    else {
      result = await serverCall(endPoints.INTERACTION_APPOINMENT_TEMP, requestMethod.POST, payload)
    }


    if (result.success) {
      const templeteId = get(result, 'data.mappedTemplate.templateId', '');
      console.log("templete getAppoinmentsData disp templete id", result?.data, templeteId)

      dispatch(setgetAppoinmentsData(result?.data));
      return (templeteId == "") ? false : templeteId
    } else {

      console.log("error getAppoinments", result)
      return false;

    }
  };
}


export function fetchUsersByRole(
  roleId,
  deptId,
  navigation = null
) {
  return async (dispatch) => {

    let usersListResult = await serverCall(
      endPoints.USERS_ROLE + "?roleId=" + roleId + "&deptId=" + deptId + "",
      requestMethod.GET,
      {},
      navigation
    );
    console.log("usersListResult..", usersListResult);
    if (usersListResult.success) {
      dispatch(setUsersByRoleDataInStore(usersListResult.data));
    } else {
      dispatch(setUsersByRoleErrorDataInStore(result));
    }

  };
}


export function fetchCancelReasons(navigation = null) {
  return async (dispatch) => {

    const url = endPoints.CANCEL_REASONS + "?searchParam=" + "code_type" + "&valueParam=" + "INTXN_STATUS_REASON" + "";
    console.log("cancelReasonsList url..", url);


    let cancelReasonsListResult = await serverCall(
      url,
      requestMethod.GET,
      {},
      navigation
    );

    console.log("cancelReasonsListResult..", cancelReasonsListResult.data);
    if (cancelReasonsListResult.success) {
      dispatch(setCancelReasonsDataInStore(cancelReasonsListResult.data));
    } else {
      dispatch(setCancelReasonsErrorDataInStore(cancelReasonsListResult));
    }

  };
}


export function updateInteraction(
  interactionId,
  userId,
  deptId,
  roleId,
  status,
  remarks
) {
  return async (dispatch) => {
    let url = endPoints.INTERACTION_UPDATE + interactionId;

    let params = {
      userId,
      deptId,
      roleId,
      status,
      remarks
    };
    let result = await serverCall(url, requestMethod.PUT, params);
    console.log("updateInteraction result..", result);

    if (result.success) {
      Toast.show({
        type: "bctSuccess",
        text1: "" + result.message,
      });
      // dispatch(setStatusDataInStore(result.data.data));
    } else {
      Toast.show({
        type: "bctError",
        text1: "" + result.message,
      });
      // dispatch(setStatusErrorDataInStore(result));
    }

  };
}


// export function fetchStatus(entityId, entity) {
//   return async (dispatch) => {

//     const url = endPoints.STATUS_LIST_API + "?entityId=" + entityId + "&entity=" + entity + "";
//     console.log("fetchStatus called..", url);
//     let statusListResult = await serverCall(
//       url,
//       requestMethod.GET,
//       {},
//       navigation
//     );
//     console.log("fetchStatus response..", statusListResult);

//     if (statusListResult.success) {
//       dispatch(setStatusDataInStore(statusListResult.data));
//     } else {
//       dispatch(setStatusErrorDataInStore(statusListResult));
//     }

//   };
// }


export function fetchStatus(
  entityId,
  entity,
  navigation = null
) {
  return async (dispatch) => {

    const url = endPoints.STATUS_LIST_API + "?entityId=" + entityId + "&entity=" + entity + "";
    console.log("fetchStatus called..", url);
    let statusListResult = await serverCall(
      url,
      requestMethod.GET,
      {},
      navigation
    );
    console.log("fetchStatus response....", statusListResult.data.data.entities[0].status);

    if (statusListResult.success) {
      // Toast.show({
      //   type: "bctSuccess",
      //   text1: "" + statusListResult.message,
      // });
      dispatch(setStatusDataInStore(statusListResult.data.data));
    } else {
      // Toast.show({
      //   type: "bctError",
      //   text1: "" + statusListResult.message,
      // });
      dispatch(setStatusErrorDataInStore(statusListResult));
    }

  };
}
