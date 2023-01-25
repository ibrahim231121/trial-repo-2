import { MaxRetentionPolicyDetail } from './../../Application/Assets/AssetLister/Category/Model/MaxRetentionPolicyDetail';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { StringIfPlural } from 'react-i18next';
import { Category, CategoryModel } from './models/CategoryModels';
import { Policy } from './models/PolicyModels';
import { Cases } from './models/CasesModels';
import { CRXLoader } from "@cb/shared"
import jwt_decode from 'jwt-decode';

import {
    AddOwner,
    Asset,
    AssetSharingModel,
    AssetViewReason,
    Bookmark,
    Evidence,
    ExtendRetention,
    File,
    Note,
    TimelinesSync,
    EvdenceCategoryAssignment,
    SubmitAnalysisModel,
    MetadataFileType
} from './models/EvidenceModels';
import { File as FileF } from './models/FileModels';
import {
    JOBCOORDINATOR_SERVICE_URL,
    EVIDENCE_SERVICE_URL,
    BASE_URL_USER_SERVICE,
    SETUP_CONFIGURATION_SERVICE_URL,
    USER_INFO_GET_URL,
    GROUP_USER_LIST,
    USER, GROUP_GET_URL,
    GROUP_GET_BY_ID_URL,
    GROUP_USER_COUNT_GET_URL,
    SAVE_USER_GROUP_URL,
    BASE_URL_UNIT_SERVICES,
    FILE_SERVICE_URL,
    AUDITLOG_SERVICE_URL,
    CountryStateApiUrl,
    EVIDENCE_GET_URL,
    BASE_URL_AUTHENTICATION_SERVICE,
    EVIDENCE_GET_BY_ID_URL,
    BASE_URL_CASES_SERVICE,
    BASE_URL_Configuration_SERVICE,
    BASE_URL_DeviceHeartBeat_SERVICE,
    BASE_URL_COMMAND_SERVICE
} from './url';
import { getVerificationURL } from "../../utils/settings";
import { Token } from './models/AuthenticationModels';
import Cookies from 'universal-cookie';
import { UsersInfo, UserGroups, GroupUserCount, UserList, User, Module, GroupList, UserStatus } from './models/UsersAndIdentitiesModel'
import {
    ConfigurationTemplate,
    ConfigurationTemplateLogs,
    DefaultUnitTemplate,
    Device,
    DeviceConfigurationTemplate,
    DeviceType,
    GetPrimaryDeviceInfo,
    QueuedAssets,
    Unit,
    UnitInfo,
    UnitTemp,
    UnitTemplateConfigurationInfo
} from './models/UnitModels';
import { CaptureDevice, Station } from './models/StationModels';
import { AuditLog } from './models/AuditLogModels';
import { Paginated, Headers } from './models/CommonModels';
import { useState, useEffect } from 'react';
import { setLoaderValue, getLoaderValue } from './../../Redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SetupConfigurationsModel } from './models/SetupConfigurations';
import { SensorsAndTriggers, DeleteAllSensorsAndTriggers } from './models/SensorsAndTriggers';
import { RetentionPolicies, DeleteAllRetentionPolicies } from './models/RetentionPolicies';
import { UploadPolicies, DeleteAllUploadPolicies } from './models/UploadPolicies';
import { logOutUser } from '../../Logout/API/auth';
import { url } from 'inspector';
import { Case } from '../../Application/Cases/CaseTypes';



const cookies = new Cookies();
let config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get("access_token"),
        'UserId': getUserId(),
        'TenantId': getTenantId()
    }
}

export const setAPIAgentConfig = () => {
    config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get("access_token"),
            'UserId': getUserId(),
            'TenantId': getTenantId()
        }
    }
}

axios.interceptors.response.use(async response => {
    try {
        return response;
    } catch (ex) {
        return await Promise.reject(ex);
    }
}, async (error: AxiosError) => {
    // console.log(error.request.responseURL + ", error code: " + error.response?.status);
    // if (error.code === "ERR_NETWORK") { // Handles preflight OPTIONS request rejection by Ocelot
    //     Logout()
    // }
    const status: number | undefined = error.response?.status;
    // if (status === 401) { // Unauthorized request redirection - need to add routine to retreive new token and re-attempt request
    //     Logout()
    // }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => {
    return response.data;
};


const responseBodyPaginated = <T>(response: AxiosResponse<T>) => {
    let totalCount = response.headers["x-total-count"];
    if (totalCount !== undefined) {
        let paginatedResponse = {
            data: response.data,
            totalCount: parseInt(totalCount)
        }
        return paginatedResponse;
    }
};
const Logout = () => {
    cookies.remove('access_token');
    localStorage.removeItem('User Id');
    window.location.href = '/';
}
const setBaseUrl = (baseUrl: string) => axios.defaults.baseURL = baseUrl;
const addHeaders = (headers?: Headers[]) => {

    if (config && headers) {
        let config2: any = config;
        if (config2["headers"]) {
            let ConfigHeader: any[] = Object.entries(config2["headers"]);
            headers.forEach((x: Headers) => {
                let a = [x.key, x.value];
                ConfigHeader.push(a)
            })
            var obj = ConfigHeader.reduce((obj, cur) => ({ ...obj, [cur[0]]: cur[1] }), {})
            return { headers: obj }
        }
        else {
            return config;
        }
    }
    else {
        return config;
    }
};

function getUserId() {
    let accessToken = cookies.get('access_token');
    if (accessToken) {
        let decodedAccessToken: any = jwt_decode(accessToken);
        return decodedAccessToken.UserId;
    }
    else {
        return "0";
    }
};

function getTenantId() {
    let accessToken = cookies.get('access_token');
    if (accessToken) {
        let decodedAccessToken: any = jwt_decode(accessToken);
        return decodedAccessToken.TenantId;
    }
    else {
        return "1";
    }
};

const requests = {
    get: <T>(baseUrl: string, url: string, config?: {}) => { setBaseUrl(baseUrl); return axios.get<T>(url, config).then(responseBody) },
    getAll: <T>(baseUrl: string, url: string, config?: {}) => { setBaseUrl(baseUrl); return axios.get<T>(url, config).then(responseBodyPaginated) },
    post: <T>(baseUrl: string, url: string, body: {}, config?: {}) => { setBaseUrl(baseUrl); return axios.post<T>(url, body, config).then(responseBody) },
    postPaginated: <T>(baseUrl: string, url: string, body: {}, config?: {}) => { setBaseUrl(baseUrl); return axios.post<T>(url, body, config).then(responseBodyPaginated) },
    put: <T>(baseUrl: string, url: string, body: {}, config?: {}) => { setBaseUrl(baseUrl); return axios.put<T>(url, body, config).then(responseBody) },
    patch: <T>(baseUrl: string, url: string, body: {}, config?: {}) => { setBaseUrl(baseUrl); return axios.patch<T>(url, body, config).then(responseBody) },
    delete: <T>(baseUrl: string, url: string, config?: {}) => { setBaseUrl(baseUrl); return axios.delete<T>(url, config).then(responseBody) },
}
export const SetupConfigurationAgent = {
    getAllControlTypes: () => requests.get<UnitTemplateConfigurationInfo []>(SETUP_CONFIGURATION_SERVICE_URL, "/Fields/GetAllControlTypesKeyValues", config),
    getCategories: (url: string) => requests.get<Category[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    postCategories: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    deleteCategoryForms: (extraHeader?: Headers[]) => requests.delete<void>(SETUP_CONFIGURATION_SERVICE_URL, `/Forms`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config),
    postFormFields: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    putCategories: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    putFormField: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    deleteFormFields: (extraHeader?: Headers[]) => requests.delete<void>(SETUP_CONFIGURATION_SERVICE_URL, `/Fields`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config),
    getSingleCategory: (id : number) => requests.get<CategoryModel>(SETUP_CONFIGURATION_SERVICE_URL, `/Categories/${id}`, config),
    getSingleFormField: (id : number) => requests.get<any>(SETUP_CONFIGURATION_SERVICE_URL, `/Fields/${id}`, config),
    getSingleCategoryForm: (id : number) => requests.get<any>(SETUP_CONFIGURATION_SERVICE_URL, `/Forms/${id}`, config),
    postCategoryForms: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    putCategoryForms: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getPoliciesAccordingToType: (url: string) => requests.get<Policy[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    getGetMaxRetentionDetail: (url: string, body: number[]) => requests.post<MaxRetentionPolicyDetail>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getGlobalAssetViewReason: (url: string) => requests.get<SetupConfigurationsModel.GlobalAssetViewReason[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    putSensorsAndTriggersTemplate: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getSensorsAndTriggersEvents: (url: string) => requests.get<SensorsAndTriggers[]>(SETUP_CONFIGURATION_SERVICE_URL, "/SensorEvents/GetEvent/" + url, config),
    deleteAllSensorsAndTriggersTemplate: (body: number[]) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, "/SensorEvents/DeleteAllEvents/", body, config),
    getAllFiltersSensorsAndTriggersEvents: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/SensorEvents/GetAllEvents${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getAllSensorsAndTriggersEvents: (url: any) => requests.get<SensorsAndTriggers[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    getAll: (url: any) => requests.get<any[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    getTenantSetting: (url?: any) => requests.get<any>(SETUP_CONFIGURATION_SERVICE_URL, url ?? "/TenantSettings", config),
    getTenantSettingTimezone: () => requests.get<any>(SETUP_CONFIGURATION_SERVICE_URL, "/TenantSettings/gettimezone", config),
    postTenantSetting: (body: any, url?: any) => requests.post<any>(SETUP_CONFIGURATION_SERVICE_URL, url ?? "/TenantSettings", body, config),
    putTenantSetting: (body: any, url?: any) => requests.put<any>(SETUP_CONFIGURATION_SERVICE_URL, url ?? "/TenantSettings", body, config),
    getMailServerSettings: (url: string) => requests.get<SetupConfigurationsModel.MailServer>(SETUP_CONFIGURATION_SERVICE_URL, url, config),


    deleteAllRetentionPoliciesTemplate: (body: number[]) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataRetention/", body, config),
    getRetentionPolicies: (id: number) => requests.get<RetentionPolicies[]>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataRetention/" + id, config),
    getAllFiltersRetentionPolicies: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Policies/GetPoliciesByType/DataRetention/${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getAllPoliciesByType: (type: string) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Policies/${type}`, config);
    },
    putRetentionPoliciesTemplate: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    postRetentionPoliciesTemplate: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    deleteAllUploadPoliciesTemplate: (body: number[]) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataUpload/", body, config),
    getUploadPolicies: (id: number) => requests.get<UploadPolicies[]>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataUpload/" + id, config),
    GetUploadPolicyValues: () => requests.get<any[]>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/GetUploadPolicyValues", config),
    getAllFiltersUploadPolicies: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Policies/GetPoliciesByType/DataUpload/${url}`, config);
    },
    putUploadPoliciesTemplate: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    postUploadPoliciesTemplate: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getAllFiltersCategories: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Categories${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getAllFiltersCategoryFroms: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Forms${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getAllCategoryFroms: (url: string) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Forms${url}`, config);
    },
    getSetupConfigurationBuildVersion: () => requests.get<any>(SETUP_CONFIGURATION_SERVICE_URL, "/SetupConfigurations/Health/BuildVersion"),
    getAllFormFields: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Fields${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
}
export const EvidenceAgent = {
    getEvidences: () => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, '/Evidences', config),
    getAssetTrail: (url: string) => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, url, config),
    getEvidence: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId, config),
    getAsset: (url: string) => requests.get<Asset>(EVIDENCE_SERVICE_URL, url, config),
    getAssetFile: (url: string) => requests.get<File[]>(EVIDENCE_SERVICE_URL, url, config),
    getQueuedAssets: (unitId: number) => requests.get<QueuedAssets[]>(EVIDENCE_SERVICE_URL, '/Evidences/QueuedAssets/' + unitId, config),
    isStationExistsinEvidence: (url: string) => requests.get<number>(EVIDENCE_SERVICE_URL, url, config),
    addEvidence: (body: any) => requests.post<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences', body, config),
    addAsset: (url: string, body: Asset) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body, config),
    getEvidenceCategories: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId, config),
    addBookmark: (url: string, body: Bookmark) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body, config),
    updateBookmark: (url: string, body: Bookmark) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body, config),
    deleteBookmark: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url, config),
    addNote: (url: string, body: Note) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body, config),
    updateNote: (url: string, body: Note) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body, config),
    deleteNote: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url, config),
    timelineSync: (url: string, body: TimelinesSync[]) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body, config),
    addAssetViewReason: (url: string, body: AssetViewReason) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body, config),
    addUsersToMultipleAsset: (url: string, body: AddOwner[]) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body, config),
    addUsersToAsset: (url: string, body: number[]) => requests.post<number>(EVIDENCE_SERVICE_URL, url, body, config),
    setPrimaryAsset: (url: string) => requests.get<void>(EVIDENCE_SERVICE_URL, url, config),
    updateRetentionPolicy: (url: string, body: ExtendRetention[]) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body, config),
    changeCategories: (url: string, body: EvdenceCategoryAssignment) => requests.patch<void>(EVIDENCE_SERVICE_URL, url, body, config),
    shareAsset: (url: string, body?: AssetSharingModel) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body ?? {}, config),
    //openSharedMedia: (url: string) => requests.get<AssetSharingModel>(EVIDENCE_SERVICE_URL+'/OpenSharedMedia?E='+url),
    
    submitAnalysis: (url: string, body?: SubmitAnalysisModel) => requests.post<void>(JOBCOORDINATOR_SERVICE_URL, url, body ?? {}),
    LockOrUnLockAsset: (body: any) => requests.patch<void>(EVIDENCE_SERVICE_URL, '/Evidences/LockUnlock', body, config),
    ExportEvidence: (evidenceId: number, assetId: number, fileType: MetadataFileType) => {
        return axios.get(`${EVIDENCE_SERVICE_URL}/Evidences/ExportAsset/${evidenceId}/${assetId}/${fileType}`, {
            headers: config.headers,
            responseType: "blob",
        });
    },
    getUploadedEvidence: (evidenceId: string) => requests.get<any>(EVIDENCE_GET_BY_ID_URL, '/' + evidenceId, config),
    getEvidenceBuildVersion: () => requests.get<any>(EVIDENCE_SERVICE_URL, "/Evidence/Health/BuildVersion"),
}

export const AuthenticationAgent = {
    getAccessToken: (url: string) => requests.get<Token>(getVerificationURL(url), '', config),
    getAccessAndRefreshToken: (url: string) => requests.get<any>(BASE_URL_AUTHENTICATION_SERVICE, url, config),
    getAuthenticationBuildVersion: () => requests.get<any>(BASE_URL_AUTHENTICATION_SERVICE, "/Authentication/Health/BuildVersion"),
}

export const AuditLogAgent = {
    getUnitAuditLogs: (url: string) => requests.get<AuditLog[]>(AUDITLOG_SERVICE_URL, url, config),
    getAuditLogBuildVersion: () => requests.get<any>(AUDITLOG_SERVICE_URL, "/AuditLogs/Health/BuildVersion"),
}

export const FileAgent = {
    getDownloadFileUrl: (fileId: number) => requests.get<string>(FILE_SERVICE_URL, '/Files/download/' + fileId, config),
    getDownloadUrl: (url: string) => requests.get<string>(FILE_SERVICE_URL + "/Files", url, config),
    getFile: (id: number) => requests.get<FileF>(FILE_SERVICE_URL, "/Files/" + id, config),
    getHealthCheck: () => requests.get<string>(FILE_SERVICE_URL, '/Files/HealthCheck', config),
    getFileBuildVersion: () => requests.get<any>(FILE_SERVICE_URL, "/Files/Health/BuildVersion"),
}

export const UsersAndIdentitiesServiceAgent = {
    getAllUsers: (url: string) => requests.get<UserList[]>(USER_INFO_GET_URL, url, config),

    //getUsersInfo: (url: string, body: any) => requests.postPaginated<Paginated<UsersInfo[]>>(USER_INFO_GET_URL, url, body, config),
    getUsersInfo: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(USER_INFO_GET_URL, url, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },

    getUsersGroups: () => requests.get<UserGroups[]>(GROUP_GET_URL, '', config),
    getGroups: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<any>>(GROUP_GET_BY_ID_URL, url, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getUserStatusKeyValues: (url: string) => requests.get<UserStatus[]>('', url, config),
    getAllUserGroupKeyValues: (url: string) => requests.get<UserGroups[]>('', url, config),

    getUserGroupCount: () => requests.get<GroupUserCount[]>(GROUP_USER_COUNT_GET_URL, '', config),
    getUser: (userId: string) => requests.get<UserList>(USER, `/${userId}`, config),
    addUser: (url: string, body: User) => requests.post<number>(BASE_URL_USER_SERVICE, url, body, config),
    editUser: (url: string, body: User) => requests.put<number>(BASE_URL_USER_SERVICE, url, body, config),
    getResponseAppPermission: (url: string) => requests.get<Module>(BASE_URL_USER_SERVICE, url, config),
    updateUserInfoURL: (url: string, body: any) => requests.patch<void>(BASE_URL_USER_SERVICE, url, body, config),
    getUserGroupsById: (id: string) => requests.get<UserGroups>(GROUP_GET_BY_ID_URL, `/${id}`, config),
    getSelectedUserGroups: (id: string) => requests.get<UserGroups>(GROUP_GET_BY_ID_URL, `/${id}`, config),
    addUserGroup: (url: string, body: UserGroups) => requests.post<number>(GROUP_GET_BY_ID_URL, url, body, config),
    editUserGroup: (url: string, body: UserGroups) => requests.put<void>(GROUP_GET_BY_ID_URL, url, body, config),
    getUserBuildVersion: () => requests.get<any>(BASE_URL_USER_SERVICE, "/UsersIdentities/Health/BuildVersion"),
}
export const UnitsAndDevicesAgent = {
    getAllUnits: (url: string, extraHeader?: Headers[]) => {
        return requests.get<Unit[]>(BASE_URL_UNIT_SERVICES, url, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config)
    },
    getUnit: (url: string) => requests.get<Unit>(BASE_URL_UNIT_SERVICES, url, config),
    getConfigurationTemplateList: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getPrimaryDeviceInfo: (url: string) => requests.get<GetPrimaryDeviceInfo>(BASE_URL_UNIT_SERVICES, url, config),
    changeUnitInfo: (url: string, body: UnitTemp) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body, config),
    deleteUnit: (url: string) => requests.delete<void>(BASE_URL_UNIT_SERVICES, url, config),
    getUnitInfo: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<UnitInfo[]>>(BASE_URL_UNIT_SERVICES, url, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config)
    },
    getAllStations: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<Station[]>>(BASE_URL_UNIT_SERVICES, `/Stations${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    getStation: (url: string) => requests.get<Station>(BASE_URL_UNIT_SERVICES, url, config),
    getAllStationInfo: (url: string) => requests.get<Station[]>(BASE_URL_UNIT_SERVICES, "/Stations/StationsInfo" + url, config),
    addStation: (body: Station) => requests.post<number>(BASE_URL_UNIT_SERVICES, "/Stations", body, config),
    updateStation: (url: string, body: Station) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body, config),
    getTemplateConfiguration: (url: string) => requests.get<ConfigurationTemplate>(BASE_URL_UNIT_SERVICES, url, config),
    getAllTemplate: () => requests.get<ConfigurationTemplate[]>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates?Size=100&Page=1", config),
    addTemplateConfiguration: (body: ConfigurationTemplate) => requests.post<number>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates", body, config),
    changeKeyValues: (url: string, body: ConfigurationTemplate) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body, config),
    getAllDeviceConfigurationTemplate: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<DeviceConfigurationTemplate[]>>(BASE_URL_UNIT_SERVICES, url, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config)
    },
    getAllConfigurationValues: (url: string) => requests.get<any[]>(BASE_URL_UNIT_SERVICES, url, config),
    getTemplateConfigurationLogs: (url: string) => requests.get<ConfigurationTemplateLogs[]>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates/TemplateConfigurationLogs/" + url, config),
    deleteConfigurationTemplate: (url: string) => requests.delete<void>(BASE_URL_UNIT_SERVICES, "/ConfigurationTemplates/" + url, config),
    getAllDeviceTypes: () => requests.get<DeviceType[]>(BASE_URL_UNIT_SERVICES, "/DeviceTypes?Page=1&Size=100", config),
    getDeviceType: (url: string) => requests.get<DeviceType>(BASE_URL_UNIT_SERVICES, "/DeviceTypes/" + url, config),
    postUpdateDefaultUnitTemplate: (body: DefaultUnitTemplate[]) => requests.post<void>(BASE_URL_UNIT_SERVICES, "/Stations/DefaultUnitTemplate", body, config),
    getAllCaptureDevices: () => requests.get<CaptureDevice[]>(BASE_URL_UNIT_SERVICES, "/CaptureDevices", config),
    getAllUnitStatusKeyValues: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getAllUnitVersionKeyValues: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getAllUnitTemplateKeyValues: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getAllUnitAssignmentKeyValues: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getUnitBuildVersion: () => requests.get<any>(BASE_URL_UNIT_SERVICES, "/UnitsDevices/Health/BuildVersion"),
}

export const CommonAgent = {
    getCoutriesAlongWithStates: () => requests.get<any>(CountryStateApiUrl, '', config),
}

export const SearchAgent = {
    getAssetBySearch: (body: any, extraHeader?: Headers[]) => {
        return requests.post<any>(EVIDENCE_GET_URL, '', body, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config)
    },
    getSearchBuildVersion: () => requests.get<any>(BASE_URL_USER_SERVICE, "/Search/Health/BuildVersion"),
}

export const CasesAgent = {
    getCasesBuildVersion: () => requests.get<any>(BASE_URL_CASES_SERVICE, "/Cases/Health/BuildVersion"),
    getCaseStates: (url: string) => requests.get<any>(BASE_URL_CASES_SERVICE, "/Cases/GetCaseStates"),
    getCaseStatus: (url: string) => requests.get<any>(BASE_URL_CASES_SERVICE, "/Cases/GetCaseStatus"),
    getCaseCreationType: (url: string) => requests.get<any>(BASE_URL_CASES_SERVICE, "/Cases/GetCaseCreationType"),
    getCaseClosedType: (url: string) => requests.get<any>(BASE_URL_CASES_SERVICE, "/Cases/GetCaseClosedType"),
    addCase: (url:string, caseBody: Case) => requests.post<any>(BASE_URL_CASES_SERVICE, "/Cases", caseBody, config),


    getAllCases: (url: string, extraHeader?: Headers[]) => {
        return requests.getAll<Paginated<Cases[]>>(BASE_URL_CASES_SERVICE, `/Case/GetAll${url}`, (extraHeader && extraHeader.length > 0) ? addHeaders(extraHeader) : config);
    },
    // getAllCasesInfo: (url: string) => requests.get<Cases[]>(BASE_URL_CASES_SERVICE, "/Case/GetAllCases" + url, config),
    deleteCase: (url: string) => requests.delete<void>(BASE_URL_CASES_SERVICE, url, config),
}

export const ConfigurationAgent = {
    getConfigurationBuildVersion: () => requests.get<any>(BASE_URL_Configuration_SERVICE, "/Configuration/Health/BuildVersion"),
}

export const DeviceHeartBeatAgent = {
    getDeviceHeartBeatBuildVersion: () => requests.get<any>(BASE_URL_DeviceHeartBeat_SERVICE, "/HeartBeat/Health/BuildVersion"),
}

export const GvsCommandAgent = {
    getDeviceHeartBeatBuildVersion: () => requests.get<any>(BASE_URL_COMMAND_SERVICE, "/GvsCommand/Health/BuildVersion"),
}

export const useApiAgent = <T>(request: Promise<T>): [T | undefined] => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<T | undefined>(undefined);
    const dispatch = useDispatch();

    const fetchApi = () => {
        dispatch(setLoaderValue({ isLoading: true }))
        request.then((response: T) => {
            dispatch(setLoaderValue({ isLoading: false, message: "" }))
            setIsLoading(false);
            setData(response);
        }).catch((ex) => {
            dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
        })
    };
    useEffect(() => {
        fetchApi();
    }, []);
    return [data];
};



