export const GETAPPOINMENTS_DATA = 'GETAPPOINMENTS_DATA';
export const GETAPPOINMENTS_ERROR = 'GETAPPOINMENTS_ERROR';
export const GETAPPOINMENTS_LOADER = 'GETAPPOINMENTS_LOADER';
export const INTERACTION_INIT = "INTERACTION_INIT";
export const INTERACTION_DATA = "INTERACTION_DATA";
export const INTERACTION_ERROR = "INTERACTION_ERROR";
export const INTERACTION_RESET = "INTERACTION_RESET";
export const INTERACTION_SET_FORM = "INTERACTION_SET_FORM";
export const INTERACTION_ADD_LOADER_ENABLE = "INTERACTION_ADD_LOADER_ENABLE";
export const INTERACTION_EDIT_LOADER_ENABLE = "INTERACTION_EDIT_LOADER_ENABLE";
export const INTERACTION_FORM_ERROR = "INTERACTION_FORM_ERROR";
export const INTERACTION_KNEWLEGE_HISTORY_REMOVE_USER_INPUTS = "INTERACTION_KNEWLEGE_HISTORY_REMOVE_USER_INPUTS";


export const INTERACTION_KNEWLEGE_HISTORY_RESET = "INTERACTION_KNEWLEGE_HISTORY_RESET";

export const INTERACTION_GET_WORKFLOW_SUCCESS =
  "INTERACTION_GET_WORKFLOW_SUCCESS";
export const INTERACTION_GET_WORKFLOW_FAILURE =
  "INTERACTION_GET_WORKFLOW_FAILURE";

export const INTERACTION_GET_FOLLOWUP_SUCCESS =
  "INTERACTION_GET_FOLLOWUP_SUCCESS";
export const INTERACTION_GET_FOLLOWUP_FAILURE =
  "INTERACTION_GET_FOLLOWUP_FAILURE";

export const INTERACTION_GET_DETAILS_SUCCESS =
  "INTERACTION_GET_DETAILS_SUCCESS";
export const INTERACTION_GET_DETAILS_FAILURE =
  "INTERACTION_GET_DETAILS_FAILURE";

export const INTERACTION_SEARCH_DETAILS_SUCCESS =
  "INTERACTION_SEARCH_DETAILS_SUCCESS";
export const INTERACTION_SEARCH_DETAILS_FAILURE =
  "INTERACTION_SEARCH_DETAILS_FAILURE";


export const CREATE_FOLLOWUP = "CREATE_FOLLOWUP";
export const CREATE_FOLLOWUP_FAILURE = "CREATE_FOLLOWUP_FAILURE";
export const INTERACTION_ASSIGN_SELF = "INTERACTION_ASSIGN_SELF";
export const INTERACTION_USERS_BY_ROLE = "INTERACTION_USERS_BY_ROLE";
export const INTERACTION_USERS_BY_ROLE_FAILURE = "INTERACTION_USERS_BY_ROLE_FAILURE";
export const INTERACTION_ASSIGN_SELF_FAILURE =
  "INTERACTION_ASSIGN_SELF_FAILURE";
export const INTERACTION_KNEWLEGE_HISTORY =
  "INTERACTION_KNEWLEGE_HISTORY";

export const STATUS_DATA = "STATUS_DATA";
export const STATUS_DATA_FAILURE = "STATUS_DATA_FAILURE";


export const INTXN_ATTACHMENT_DATA = "INTXN_ATTACHMENT_DATA";
export const INTXN_ATTACHMENT_ERROR_DATA = "INTXN_ATTACHMENT_ERROR_DATA";


export const INTXN_DOWNLOAD_ATTACHMENT_DATA = "INTXN_DOWNLOAD_ATTACHMENT_DATA";
export const INTXN_DOWNLOAD_ATTACHMENT_ERROR_DATA = "INTXN_DOWNLOAD_ATTACHMENT_ERROR_DATA";


export const MEETING_HALLS_DATA = "MEETING_HALLS_DATA";
export const MEETING_HALLS_ERROR_DATA = "MEETING_HALLS_ERROR_DATA";


export const MEETING_HALL_EVENTS_DATA = "MEETING_HALL_EVENTS_DATA";
export const MEETING_HALL_EVENTS_ERROR_DATA = "MEETING_HALL_EVENTS_ERROR_DATA";


export const CANCEL_REASONS_DATA = "CANCEL_REASONS_DATA";
export const CANCEL_REASONS_DATA_FAILURE = "CANCEL_REASONS_DATA_FAILURE";



export function initInteraction() {
  return { type: INTERACTION_INIT };
}

export function setInteractionData(data, isEdit) {
  return { type: INTERACTION_DATA, data, isEdit };
}

export function setInteractionError(data) {
  return { type: INTERACTION_ERROR, data };
}
//form handle
export function setInteractionFormField(data) {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_SET_FORM, data });
  };
}
export function setInteractionFormFieldError(data) {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_FORM_ERROR, data });
  };
}

export function setInteractionReset() {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_RESET });
  };
}

export function initInteractionAdd() {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_RESET });
  };
}

export function enableLoaderAddInteractionAdd(data) {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_ADD_LOADER_ENABLE, data: data });
  };
}

export function enableLoaderEditInteractionAdd(data) {
  return async (dispatch) => {
    dispatch({ type: INTERACTION_EDIT_LOADER_ENABLE, data });
  };
}

export function setInteractionsWorkFlowDataInStore(data) {
  return { type: INTERACTION_GET_WORKFLOW_SUCCESS, data };
}

export function setInteractionsWorkFlowErrorDataInStore(data) {
  return { type: INTERACTION_GET_WORKFLOW_FAILURE, data };
}

export function setInteractionsFollowupDataInStore(data) {
  return { type: INTERACTION_GET_FOLLOWUP_SUCCESS, data };
}

export function setknowledgeHistory(data) {
  return { type: INTERACTION_KNEWLEGE_HISTORY, data };
}
export function setInteractionsFollowupErrorDataInStore(data) {
  return { type: INTERACTION_GET_FOLLOWUP_FAILURE, data };
}

export function setInteractionsDetailsDataInStore(data) {
  return { type: INTERACTION_GET_DETAILS_SUCCESS, data };
}

export function setInteractionsDetailsErrorDataInStore(data) {
  return { type: INTERACTION_GET_DETAILS_FAILURE, data };
}


export function setInteractionsSearchDataInStore(data) {
  return { type: INTERACTION_SEARCH_DETAILS_SUCCESS, data };
}

export function setInteractionsSearchErrorDataInStore(data) {
  return { type: INTERACTION_SEARCH_DETAILS_FAILURE, data };
}



export function setFollowupDataInStore(data) {
  return { type: CREATE_FOLLOWUP, data };
}

export function setFollowupErrorDataInStore(data) {
  return { type: CREATE_FOLLOWUP_FAILURE, data };
}



export function setAssignInteractionToSelfDataInStore(data) {
  return { type: INTERACTION_ASSIGN_SELF, data };
}

export function setAssignInteractionToSelfErrorDataInStore(data) {
  return { type: INTERACTION_ASSIGN_SELF_FAILURE, data };
}



export function setUsersByRoleDataInStore(data) {
  return { type: INTERACTION_USERS_BY_ROLE, data };
}

export function setUsersByRoleErrorDataInStore(data) {
  return { type: INTERACTION_USERS_BY_ROLE_FAILURE, data };
}



export function setCancelReasonsDataInStore(data) {
  return { type: CANCEL_REASONS_DATA, data };
}

export function setCancelReasonsErrorDataInStore(data) {
  return { type: CANCEL_REASONS_DATA_FAILURE, data };
}




export function setStatusDataInStore(data) {
  return { type: STATUS_DATA, data };
}

export function setStatusErrorDataInStore(data) {
  return { type: STATUS_DATA_FAILURE, data };
}



export function setIntxnDetAttachmentDataInStore(data) {
  return { type: INTXN_ATTACHMENT_DATA, data };
}

export function setIntxnDetAttachmentErrorDataInStore(data) {
  return { type: INTXN_ATTACHMENT_ERROR_DATA, data };
}



export function setDowloadAttachmentDataInStore(data) {
  return { type: INTXN_DOWNLOAD_ATTACHMENT_DATA, data };
}

export function setDowloadAttachmentErrorDataInStore(data) {
  return { type: INTXN_DOWNLOAD_ATTACHMENT_ERROR_DATA, data };
}



export function setMeetingHallsDataInStore(data) {
  return { type: MEETING_HALLS_DATA, data };
}

export function setMeetingHallsErrorDataInStore(data) {
  return { type: MEETING_HALLS_ERROR_DATA, data };
}



export function setMeetingHallEventsDataInStore(data) {
  return { type: MEETING_HALL_EVENTS_DATA, data };
}

export function setMeetingHallEventsErrorDataInStore(data) {
  return { type: MEETING_HALL_EVENTS_ERROR_DATA, data };
}



export function intractionKnowlegeHistoryReset() {
  return { type: INTERACTION_KNEWLEGE_HISTORY_RESET };
}

export function intractionKnowlegeHistoryRemoveUserInputTypes() {
  return { type: INTERACTION_KNEWLEGE_HISTORY_REMOVE_USER_INPUTS };
}
export const setgetAppoinmentsData = (data) => {
  return { type: GETAPPOINMENTS_DATA, data }
}
export const setgetAppoinmentsLoader = (data) => {
  return { type: GETAPPOINMENTS_LOADER, data }
}

export const setgetAppoinments_ERROR = (data) => {
  return { type: GETAPPOINMENTS_ERROR, data }
}
