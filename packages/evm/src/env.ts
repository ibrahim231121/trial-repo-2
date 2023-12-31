declare global {
  interface Window {
    env: any
  }
}
  
// change with your own variables
type EnvType = {

  REACT_APP_BUILD_PATH: string
  REACT_APP_SEARCH_SERVICE_URL: string
  REACT_APP_EVIDENCE_SERVICE_URL: string
  REACT_APP_AUTHENTICATION_SERVICE_URL: string
  REACT_APP_USER_SERVICE_URL: string
  REACT_APP_UNIT_SERVICE_URL: string
  REACT_APP_SETUP_SERVICE_URL: string
  REACT_APP_FILE_SERVICE_URL: string
  REACT_APP_AICOORDINATOR_SERVICE_URL: string
  REACT_APP_CLIENT_ID: string

  REACT_APP_GOOGLE_MAPS_API_KEY: string
  REACT_APP_BING_MAPS_API_KEY: string
  REACT_APP_AUDITLOG_SERVICE_URL: string
  REACT_APP_CASES_SERVICE_URL: string
  REACT_APP_Configuration_SERVICE_URL: string
  REACT_APP_DeviceHeartBeat_SERVICE_URL: string
  REACT_APP_COMMAND_SERVICE_URL: string
  REACT_APP_SOCKET_SERVICE_URL: string
  REACT_APP_AICOORDINATOR_SERVICE_Redirect_URL: string
  REACT_APP_CAD_SERVICE_URL: string
  REACT_APP_ENV: string
  REACT_APP_ALPR_SERVICE_URL: string
}
export const env: EnvType = { ...process.env, ...window.env }