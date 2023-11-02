import { env } from "../../env";
import { MAX_REQUEST_SIZE_FOR } from '../constant'

export const BASE_URL_ALPR_Service = env.REACT_APP_ALPR_SERVICE_URL;


const hostUrl:any = window.location.protocol + "//" + window.location.hostname;
const baseApi:any = window.location.protocol + "//" + window.location.hostname  + "/api/v1";
const isDevelopment : any = env.REACT_APP_ENV
export const BASE_URL_SOCKET_SERVICE = isDevelopment == "development" ? env.REACT_APP_SOCKET_SERVICE_URL : window.location.protocol + "//" + window.location.hostname + "/crossbone";
export const BASE_URL_COMMAND_FRONTEND = isDevelopment == "development" ? env.REACT_APP_COMMAND_SERVICE_URL : hostUrl + "/cmd";
export const BASE_URL_COMMAND_SERVICE = isDevelopment == "development" ? env.REACT_APP_COMMAND_SERVICE_URL : baseApi;
const BASE_URL_SEARCH_SERVICE = isDevelopment == "development" ? env.REACT_APP_SEARCH_SERVICE_URL : baseApi;
export const BASE_URL_AUTHENTICATION_SERVICE = isDevelopment == "development" ? env.REACT_APP_AUTHENTICATION_SERVICE_URL : hostUrl;
export const BASE_URL_USER_SERVICE = isDevelopment == "development" ? env.REACT_APP_USER_SERVICE_URL : baseApi;
export const BASE_URL_CASES_SERVICE = isDevelopment == "development" ? env.REACT_APP_CASES_SERVICE_URL : baseApi;
export const BASE_URL_Configuration_SERVICE = isDevelopment == "development" ? env.REACT_APP_Configuration_SERVICE_URL : baseApi;
export const BASE_URL_DeviceHeartBeat_SERVICE = isDevelopment == "development" ? env.REACT_APP_DeviceHeartBeat_SERVICE_URL : baseApi  + "/auth";
const BASE_URL_UNIT_SERVICE = isDevelopment == "development" ? env.REACT_APP_UNIT_SERVICE_URL : baseApi
const BASE_URL_SETUP_SERVICE = isDevelopment == "development" ? env.REACT_APP_SETUP_SERVICE_URL : baseApi
const REACT_APP_EVIDENCE_SERVICE_URL = isDevelopment == "development" ? env.REACT_APP_EVIDENCE_SERVICE_URL : baseApi
const REACT_APP_FILE_SERVICE_URL = isDevelopment == "development" ? env.REACT_APP_FILE_SERVICE_URL : baseApi
export const AUDITLOG_SERVICE_URL= isDevelopment == "development" ? env.REACT_APP_AUDITLOG_SERVICE_URL : baseApi
const REACT_APP_AICOORDINATOR_SERVICE_URL = isDevelopment == "development" ? env.REACT_APP_AICOORDINATOR_SERVICE_URL : baseApi
export const REDIRECT_URL_AICOORDINATOR = isDevelopment == "development" ? env.REACT_APP_AICOORDINATOR_SERVICE_Redirect_URL : baseApi
export const BASE_URL_CAD_FRONTEND = isDevelopment == "development" ? env.REACT_APP_CAD_SERVICE_URL : hostUrl + "/cad";
export const BASE_URL_CAD_SERVICE = isDevelopment == "development" ? env.REACT_APP_CAD_SERVICE_URL : baseApi;
// export const BASE_URL_SOCKET_SERVICE = env.REACT_APP_SOCKET_SERVICE_URL;
// export const BASE_URL_COMMAND_SERVICE = env.REACT_APP_COMMAND_SERVICE_URL;
// const BASE_URL_SEARCH_SERVICE = env.REACT_APP_SEARCH_SERVICE_URL;
// export const BASE_URL_AUTHENTICATION_SERVICE = env.REACT_APP_AUTHENTICATION_SERVICE_URL;
// export const BASE_URL_USER_SERVICE = env.REACT_APP_USER_SERVICE_URL;
// export const BASE_URL_CASES_SERVICE = env.REACT_APP_CASES_SERVICE_URL;
// export const BASE_URL_Configuration_SERVICE = env.REACT_APP_Configuration_SERVICE_URL;
// export const BASE_URL_DeviceHeartBeat_SERVICE = env.REACT_APP_DeviceHeartBeat_SERVICE_URL;
// const BASE_URL_UNIT_SERVICE = env.REACT_APP_UNIT_SERVICE_URL
// const BASE_URL_SETUP_SERVICE = env.REACT_APP_SETUP_SERVICE_URL
// const REACT_APP_EVIDENCE_SERVICE_URL = env.REACT_APP_EVIDENCE_SERVICE_URL
// const REACT_APP_FILE_SERVICE_URL = env.REACT_APP_FILE_SERVICE_URL
// export const AUDITLOG_SERVICE_URL= env.REACT_APP_AUDITLOG_SERVICE_URL
// const REACT_APP_AICOORDINATOR_SERVICE_URL = env.REACT_APP_AICOORDINATOR_SERVICE_URL
// export const REDIRECT_URL_AICOORDINATOR = env.REACT_APP_AICOORDINATOR_SERVICE_Redirect_URL

export const EVIDENCE_PREDITIVE_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/predictive`

export const EVIDENCE_GET_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence?Size=1000&Page=1`

export const EVIDENCE_GET_BY_ID_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence`

export const EVIDENCE_SEARCH_VERSION_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/Version`

export const AUTHENTICATION_NewAccessToken_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Auth/Authentication/GetAccessToken`

export const AUTHENTICATION_LOGIN_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Auth/Authentication/Login`

export const AUTHENTICATION_CODEVERIFIER_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Auth/Authentication/CodeVerifier`

export const AUTHENTICATION_EMAIL_SERVICE = `${BASE_URL_AUTHENTICATION_SERVICE}/Auth/Authentication/ActivateUser`

export const GROUP_GET_URL = `${BASE_URL_USER_SERVICE}/groups?Page=1&Size=500`

export const USERGROUP_GET_URL = `${BASE_URL_USER_SERVICE}/groups/GetAllUserGroup`

export const ADGROUP_GET_URL = `${BASE_URL_USER_SERVICE}/ADGroups/GetAllGroupKeyValues`

export const GROUP_GET_BY_ID_URL = `${BASE_URL_USER_SERVICE}/groups`

// export const GROUP_USER_COUNT_GET_URL = `${BASE_URL_USER_SERVICE}/groups/0/users/count?Page=1&Size=500`
export const GROUP_USER_COUNT_GET_URL = `${BASE_URL_USER_SERVICE}/groups/userscount?Page=1&Size=500`
export const BASE_URL_UNIT_SERVICES = `${BASE_URL_UNIT_SERVICE}`

export const EVIDENCE_SERVICE_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}`;
export const EVIDENCE_GET_CATEGORIES_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences`;

export const SETUP_CONFIGURATION_SERVICE_URL = `${BASE_URL_SETUP_SERVICE}`;

export const USER_INFO_GET_URL = `${BASE_URL_USER_SERVICE}/Users/GetAllUsersInfo?Page=1&Size=200`

//export const TEMPLATE_CONFIGURATION_DETAIL_GET_URL = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates?Size=100&Page=1`;

export const GROUP_USER_LIST = `${BASE_URL_USER_SERVICE}/Groups`
export const USER = `${BASE_URL_USER_SERVICE}/Users`
export const APPLICATION_PERMISSION_URL = `${BASE_URL_USER_SERVICE}/Modules?Page=1&Size=100`


export const USER_INFO_UPDATE_URL = `${BASE_URL_USER_SERVICE}/Users`

export const CATEGORY_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/Categories?Page=1&Size=${MAX_REQUEST_SIZE_FOR.CATEGORY}`

export const CONTAINERMAPPING_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/GetAllByGroup`

export const SAVE_USER_GROUP_URL = `${BASE_URL_USER_SERVICE}/Groups`


export const UPSERT_CONTAINER_MAPPING_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/UpsertBulk`

export const MODULES = `${BASE_URL_USER_SERVICE}/Modules`;

export const CATEGORIES_GET_ALL = `${BASE_URL_SETUP_SERVICE}/Categories`
export const EVIDENCE_ASSET_DATA_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences`
//Please dont append controller with File service url
export const FILE_SERVICE_URL = `${REACT_APP_FILE_SERVICE_URL}`
export const FILE_SERVICE_URL_V2 = FILE_SERVICE_URL.replace("v1","v2"); 

export const AI_COORDINATOR_SERVICE_URL = `${REACT_APP_AICOORDINATOR_SERVICE_URL}/Project`
export const CountryStateApiUrl = `https://countriesnow.space/api/v0.1/countries/states`;
export const EVIDENCE_EXPORT_META_DATA_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences/ExportAsset`;


export const SENSOR_AND_TRIGGERS_GET_ALL_DATA = `${BASE_URL_SETUP_SERVICE}/SensorEvents/GetAll`;
export const SENSOR_AND_TRIGGERS = `${BASE_URL_SETUP_SERVICE}/SensorEvents/UpsertEvent`;
export const SENSOR_AND_TRIGGERS_GET_ALL_EVENTS_DATA = `${SETUP_CONFIGURATION_SERVICE_URL}/SensorEvents/GetAllEvents`;


export const UPLOAD_POLICIES_GET_ALL_DATA = `${BASE_URL_SETUP_SERVICE}/Policies/GetAll`;
export const UPLOAD_POLICIES = `${BASE_URL_SETUP_SERVICE}/Policies/UpsertUploadPolicy`;
export const UPLOAD_POLICIES_GET_ALL_UPLOAD_POLICIES_DATA = `${SETUP_CONFIGURATION_SERVICE_URL}/Policies/GetAllUploadPolicies`;

export const REACT_APP_CLIENT_ID = env.REACT_APP_CLIENT_ID
export const REACT_APP_GOOGLE_MAPS_API_KEY = env.REACT_APP_GOOGLE_MAPS_API_KEY

export const ALPR_HOTLIST = `${BASE_URL_ALPR_Service}/HotList`

export const ALPR_CAPTURE_PLATE = `${BASE_URL_ALPR_Service}/CapturedPlate`
export const ALPR_PLATE_HISTORY = `${BASE_URL_ALPR_Service}/LicensePlate/{numberPlateId}/history`
