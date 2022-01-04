//const BASE_URL_SEARCH_SERVICE = process.env.REACT_APP_SEARCH_SERVICE_URL;
const BASE_URL_SEARCH_SERVICE = 'http://10.227.141.128:8085';

//const BASE_URL_AUTHENTICATION_SERVICE = process.env.REACT_APP_AUTHENTICATION_SERVICE_URL;
const BASE_URL_AUTHENTICATION_SERVICE = 'http://10.227.141.199:8091'

const BASE_URL_UNITDEVICE_SERVICE = 'http://10.227.141.199:8084'

const BASE_URL_USER_SERVICE = 'http://10.227.141.199:8085';//process.env.REACT_APP_USER_SERVICE_URL;
const BASE_URL_UNIT_SERVICE = process.env.REACT_APP_UNIT_SERVICE_URL
const BASE_URL_SETUP_SERVICE = process.env.REACT_APP_SETUP_SERVICE_URL

export const EVIDENCE_PREDITIVE_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/predictive`

export const EVIDENCE_GET_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence?Size=500&Page=1`

export const EVIDENCE_SEARCH_VERSION_URL = `${BASE_URL_SEARCH_SERVICE}/Evidence/Version`

export const UNIT_INFO_GET_URL = `${BASE_URL_UNITDEVICE_SERVICE}/Stations/0/Units/getunitInfo?Page=1&Size=100`
export const AUTHENTICATION_NewAccessToken_URL = `http://10.227.141.199:8091/Authentication/GetAccessToken`

export const AUTHENTICATION_LOGIN_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/Login/`

export const AUTHENTICATION_CODEVERIFIER_URL = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/CodeVerifier`

export const AUTHENTICATION_EMAIL_SERVICE = `${BASE_URL_AUTHENTICATION_SERVICE}/Authentication/ActivateUser`

export const GROUP_GET_URL = `${BASE_URL_USER_SERVICE}/groups?Page=1&Size=100`

export const GROUP_GET_BY_ID_URL = `${BASE_URL_USER_SERVICE}/groups`

export const GROUP_USER_COUNT_GET_URL = `${BASE_URL_USER_SERVICE}/groups/0/users/count?Page=1&Size=100`

export const USER_INFO_GET_URL = `${BASE_URL_USER_SERVICE}/Users/GetAllUsersInfo?Page=1&Size=500`

export const TEMPLATE_CONFIGURATION_GET_URL = `${BASE_URL_UNITDEVICE_SERVICE}/ConfigurationTemplates/GetAllConfiguration?Page=1&Size=100`

export const GROUP_USER_LIST = `${BASE_URL_USER_SERVICE}/Groups`
export const USER = `${BASE_URL_USER_SERVICE}/users`
export const APPLICATION_PERMISSION_URL = `${BASE_URL_USER_SERVICE}/Modules?Page=1&Size=100`


export const USER_INFO_UPDATE_URL = `${BASE_URL_USER_SERVICE}/Users`

export const STATION_INFO_GET_URL = `${BASE_URL_UNIT_SERVICE}/Stations`

export const CATEGORY_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/Categories?Size=100&Page=1`

export const CONTAINERMAPPING_INFO_GET_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/GetAllByGroup`

export const SAVE_USER_GROUP_URL = `${BASE_URL_USER_SERVICE}/Groups`

export const SAVE_CONTAINER_MAPPINGS_URL = `${BASE_URL_SETUP_SERVICE}/Categories`

export const UPSERT_CONTAINER_MAPPING_URL = `${BASE_URL_SETUP_SERVICE}/ContainerMapping/UpsertBulk`