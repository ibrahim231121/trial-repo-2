import { env } from "../../env";

const BASE_URL_SEARCH_SERVICE = env.REACT_APP_SEARCH_SERVICE_URL;
const BASE_URL_AUTHENTICATION_SERVICE = env.REACT_APP_AUTHENTICATION_SERVICE_URL;
const BASE_URL_USER_SERVICE = env.REACT_APP_USER_SERVICE_URL;
export const BASE_URL_UNIT_SERVICE = env.REACT_APP_UNIT_SERVICE_URL
const BASE_URL_SETUP_SERVICE = env.REACT_APP_SETUP_SERVICE_URL
const REACT_APP_EVIDENCE_SERVICE_URL = env.REACT_APP_EVIDENCE_SERVICE_URL
const REACT_APP_FILE_SERVICE_URL = env.REACT_APP_FILE_SERVICE_URL

export const EVIDENCE_PREDITIVE_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/predictive`

export const EVIDENCE_GET_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence?Size=1000&Page=1`

export const EVIDENCE_SEARCH_VERSION_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/Version`

export const UNIT_INFO_GET_URL = `${BASE_URL_UNIT_SERVICE}/Stations/0/Units/getunitInfo?Page=1&Size=100`
export const AUTHENTICATION_NewAccessToken_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/GetAccessToken`

export const AUTHENTICATION_LOGIN_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/Login/`

export const AUTHENTICATION_CODEVERIFIER_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/CodeVerifier`

export const AUTHENTICATION_EMAIL_SERVICE = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/ActivateUser`

export const GROUP_GET_URL = `${BASE_URL_USER_SERVICE}/groups?Page=1&Size=500`

export const GROUP_GET_BY_ID_URL = `${BASE_URL_USER_SERVICE}/groups`

// export const GROUP_USER_COUNT_GET_URL = `${BASE_URL_USER_SERVICE}/groups/0/users/count?Page=1&Size=500`
export const GROUP_USER_COUNT_GET_URL = `${BASE_URL_USER_SERVICE}/groups/userscount?Page=1&Size=500`
export const Unit_GET_BY_ID_URL = `${BASE_URL_UNIT_SERVICE}`

export const EVIDENCE_SERVICE_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}`;
export const EVIDENCE_GET_CATEGORIES_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences`;

export const SETUP_CONFIGURATION_SERVICE_URL = `${BASE_URL_SETUP_SERVICE}`;

export const USER_INFO_GET_URL = `${BASE_URL_USER_SERVICE}/Users/GetAllUsersInfo?Page=1&Size=500`

export const TEMPLATE_CONFIGURATION_GET_URL = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates/GetAllConfiguration?Page=1&Size=100`;

export const TEMPLATE_CONFIGURATION_DETAIL_GET_URL = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates?Size=100&Page=1`;

export const TEMPLATE_CONFIGURATION_LOG_GET_URL = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates/GetTemplateConfigurationLogs/`

export const GROUP_USER_LIST = `${BASE_URL_USER_SERVICE}/Groups`
export const USER = `${BASE_URL_USER_SERVICE}/Users`
export const APPLICATION_PERMISSION_URL = `${BASE_URL_USER_SERVICE}/Modules?Page=1&Size=100`


export const USER_INFO_UPDATE_URL = `${BASE_URL_USER_SERVICE}/Users`

export const STATION_INFO_GET_URL = `${BASE_URL_UNIT_SERVICE}/Stations?Size=100&Page=1`

export const STATION_INFO_DATA_PERMISSION_GET_URL = `${BASE_URL_UNIT_SERVICE}/Stations/GetAllStationsInfo`

export const CATEGORY_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/Categories?Size=10&Page=1`

export const CONTAINERMAPPING_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/GetAllByGroup`

export const SAVE_USER_GROUP_URL = `${BASE_URL_USER_SERVICE}/Groups`

export const EDIT_UNIT_URL = `${BASE_URL_UNIT_SERVICE}`

export const SAVE_CONTAINER_MAPPINGS_URL = `${BASE_URL_SETUP_SERVICE}/Categories`

export const UPSERT_CONTAINER_MAPPING_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/UpsertBulk`

export const MODULES = `${BASE_URL_USER_SERVICE}/Modules`;
export const TEMPLATE_CONFIGURATION_DELETE_URL = `${BASE_URL_UNIT_SERVICE}/ConfigurationTemplates/`
export const DEVICETYPE_GET_URL = `${BASE_URL_UNIT_SERVICE}/DeviceTypes?Page=1&Size=100`
export const STATIONINFO_GET_URL = `${BASE_URL_UNIT_SERVICE}/Stations/GetAllStationInfo?Page=1&Size=100`
export const DATA_RETENTION_POLICIES_GET_ALL = `${BASE_URL_SETUP_SERVICE}/Policies/DataRetention`
export const DATA_UPLOAD_POLICIES_GET_ALL = `${BASE_URL_SETUP_SERVICE}/Policies/DataUpload`
export const CATEGORIES_GET_ALL = `${BASE_URL_SETUP_SERVICE}/Categories`
export const STATIONS_GET_ALL = `${BASE_URL_UNIT_SERVICE}/Stations`
export const EVIDENCE_ASSET_DATA_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences`
export const FILE_SERVICE_URL = `${REACT_APP_FILE_SERVICE_URL}/Files`

export const CountryStateApiUrl = `https://countriesnow.space/api/v0.1/countries/states`;
export const STATION = `${BASE_URL_UNIT_SERVICE}/Stations`;
export const DEFAULT_UNIT_TEMPLATE_END_POINT = `${BASE_URL_UNIT_SERVICE}/Stations/DefaultUnitTemplate`;
export const EVIDENCE_PATCH_LOCK_UNLOCK_URL = `${REACT_APP_EVIDENCE_SERVICE_URL}/Evidences/LockUnlock`;

export const REACT_APP_CLIENT_ID = env.REACT_APP_CLIENT_ID