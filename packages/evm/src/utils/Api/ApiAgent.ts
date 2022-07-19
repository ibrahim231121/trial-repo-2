import axios, { AxiosResponse } from 'axios';
import { StringIfPlural } from 'react-i18next';
import { Category, Forms } from './models/CategoryModels';
import { Policy } from './models/PolicyModels';
import { AddOwner, Asset, AssetSharingModel, AssetViewReason, Bookmark, EvdenceCategoryAssignment, Evidence, ExtendRetention, Note, TimelinesSync } from './models/EvidenceModels';
import { BASE_URL_UNIT_SERVICES, EVIDENCE_SERVICE_URL, SETUP_CONFIGURATION_SERVICE_URL } from './url';
import { getVerificationURL } from "../../utils/settings";
import {Token} from './models/AuthenticationModels';
import Cookies from 'universal-cookie';
import { ConfigurationTemplate, ConfigurationTemplateLogs, DefaultConfigurationTemplate, DefaultUnitTemplate, DeviceConfigurationTemplate, DeviceType, GetPrimaryDeviceInfo, Unit, UnitInfo, UnitTemp, UnitTemplateConfigurationInfo } from './models/UnitModels';
import { Station } from './models/StationModels';
const cookies = new Cookies();

let config = {
    
    headers: {
        'Content-Type': 'application/json',
        'TenantId': '1',
        'Authorization': 'Bearer ' + cookies.get("access_token")
    }
}


axios.interceptors.response.use(async response => {
    try {
        return response;
    } catch (ex) {
        return await Promise.reject(ex);
    }
}, async error => {
    return Promise.reject(error);
})
const responseBody = <T>(response: AxiosResponse<T>) => response.data;
const setBaseUrl = (baseUrl: string) => axios.defaults.baseURL = baseUrl;

const requests = {
    get: <T>(baseUrl: string, url: string) => {setBaseUrl(baseUrl); return axios.get<T>(url,config).then(responseBody)},
    post: <T>(baseUrl: string, url: string, body: {}) => {debugger; setBaseUrl(baseUrl); return axios.post<T>(url, body, config).then(responseBody)},
    put: <T>(baseUrl: string, url: string, body: {}) => {setBaseUrl(baseUrl); return axios.put<T>(url, body, config).then(responseBody)},
    patch: <T>(baseUrl: string, url: string, body: {}) => {setBaseUrl(baseUrl); return axios.patch<T>(url, body, config).then(responseBody)},
    delete: <T>(baseUrl: string, url: string) => {setBaseUrl(baseUrl); return axios.delete<T>(url, config).then(responseBody)},
}
export const SetupConfigurationAgent = {
    getCategories: (url: string) => requests.get<Category[]>(SETUP_CONFIGURATION_SERVICE_URL, url),
    getPoliciesAccordingToType: (url: string) => requests.get<Policy[]>(SETUP_CONFIGURATION_SERVICE_URL, url),
}
export const EvidenceAgent = {
    getEvidences: () => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, '/Evidences'),
    getEvidence: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId),
    getAsset: (url: string) => requests.get<Asset>(EVIDENCE_SERVICE_URL, url),
    isStationExistsinEvidence: (url: string) => requests.get<number>(EVIDENCE_SERVICE_URL, url),
    addAsset: (url: string, body: Asset) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    getEvidenceCategories: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId),
    addBookmark: (url: string, body: Bookmark) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    updateBookmark: (url: string, body: Bookmark) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    deleteBookmark: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
    addNote: (url: string, body: Note) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    updateNote: (url: string, body: Note) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    deleteNote: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
    timelineSync: (url: string, body: TimelinesSync[]) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    addAssetViewReason: (url: string, body: AssetViewReason) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body),
    addUsersToMultipleAsset: (url: string, body: AddOwner[]) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body),
    addUsersToAsset: (url: string, body: number[]) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body),
    setPrimaryAsset: (url: string) => requests.get<void>(EVIDENCE_SERVICE_URL, url),
    updateRetentionPolicy: (url: string, body: ExtendRetention[]) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    changeCategories: (url: string, body: EvdenceCategoryAssignment) => requests.patch<void>(EVIDENCE_SERVICE_URL, url, body),
    shareAsset: (url: string, body?: AssetSharingModel) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body ?? {}),
}

export const AuthenticationAgent = {
    getAccessToken: (url:string) => requests.get<Token>(getVerificationURL(url),'')
}

export const UnitsAndDevicesAgent = {
    getAllUnits: (url: string) => requests.get<Unit[]>(BASE_URL_UNIT_SERVICES, url),
    getUnit: (url: string) => requests.get<Unit>(BASE_URL_UNIT_SERVICES, url),
    getConfigurationTemplateList: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url),
    getPrimaryDeviceInfo: (url: string) => requests.get<GetPrimaryDeviceInfo>(BASE_URL_UNIT_SERVICES, url),
    changeUnitInfo: (url: string, body: UnitTemp) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body),
    deleteUnit: (url: string) => requests.delete<void>(BASE_URL_UNIT_SERVICES, url),
    getUnitInfo: () => requests.get<UnitInfo[]>(BASE_URL_UNIT_SERVICES, "/Stations/0/Units/getunitInfo?Page=1&Size=100"),
    getAllStations: (url: string) => requests.get<Station[]>(BASE_URL_UNIT_SERVICES, "/Stations"+url),
    getStation: (url: string) => requests.get<Station>(BASE_URL_UNIT_SERVICES, url),
    getAllStationInfo: (url: string) => requests.get<Station[]>(BASE_URL_UNIT_SERVICES, "/Stations/GetAllStationInfo"+url),
    addStation: (body: Station) => requests.post<number>(BASE_URL_UNIT_SERVICES, "/Stations", body),
    updateStation: (url: string, body: Station) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body),
    getTemplateConfiguration: (url: string) => requests.get<DefaultConfigurationTemplate>(BASE_URL_UNIT_SERVICES, url),
    getAllTemplate: () => requests.get<ConfigurationTemplate[]>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates?Size=100&Page=1"),
    addTemplateConfiguration: (body: ConfigurationTemplate) => requests.post<number>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates", body),
    changeKeyValues: (url: string, body: ConfigurationTemplate) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body),
    getAllDeviceConfigurationTemplate: () => requests.get<DeviceConfigurationTemplate[]>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates/GetAllConfiguration?Page=1&Size=100"),
    getTemplateConfigurationLogs: (url: string) => requests.get<ConfigurationTemplateLogs[]>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates/GetTemplateConfigurationLogs/"+url),
    deleteConfigurationTemplate: (url: string) => requests.delete<void>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates/"+url),
    getAllDeviceTypes: () => requests.get<DeviceType[]>(BASE_URL_UNIT_SERVICES, "/DeviceTypes?Page=1&Size=100"),
    postUpdateDefaultUnitTemplate: (body: DefaultUnitTemplate[]) => requests.post<void>(BASE_URL_UNIT_SERVICES, "/Stations/DefaultUnitTemplate", body),
}
