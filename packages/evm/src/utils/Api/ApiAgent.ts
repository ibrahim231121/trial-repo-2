import { MaxRetentionPolicyDetail } from './../../Application/Assets/AssetLister/Category/Model/MaxRetentionPolicyDetail';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { StringIfPlural } from 'react-i18next';
import { Category, Forms } from './models/CategoryModels';
import { Policy } from './models/PolicyModels';
import { CRXLoader } from "@cb/shared"

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
    SubmitAnalysisModel
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
    BASE_URL_AUTHENTICATION_SERVICE
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
import { GlobalAssetViewReason } from './models/SetupConfigurations';
import { SensorsAndTriggers, DeleteAllSensorsAndTriggers } from './models/SensorsAndTriggers';
import { RetentionPolicies, DeleteAllRetentionPolicies } from './models/RetentionPolicies';

const cookies = new Cookies();
let config = {
    headers: {
        'Content-Type': 'application/json',
        'TenantId': '1',
        'Authorization': 'Bearer ' + cookies.get("access_token"),
        'UserId': localStorage.getItem('User Id') == null ? "0" : localStorage.getItem('User Id')
    }
}

export const setAPIAgentConfig = () => {
    config = {
        headers: {
            'Content-Type': 'application/json',
            'TenantId': '1',
            'Authorization': 'Bearer ' + cookies.get("access_token"),
            'UserId': localStorage.getItem('User Id') == null ? "0" : localStorage.getItem('User Id')
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
    console.log(error.request.responseURL + ", error code: " + error.response?.status);
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
            config["headers"] = obj;
        }
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
    getCategories: (url: string) => requests.get<Category[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    getPoliciesAccordingToType: (url: string) => requests.get<Policy[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    getGetMaxRetentionDetail: (url: string, body: number[]) => requests.post<MaxRetentionPolicyDetail>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getGlobalAssetViewReason: (url: string) => requests.get<GlobalAssetViewReason[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    putSensorsAndTriggersTemplate: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    getSensorsAndTriggersEvents: (url: string) => requests.get<SensorsAndTriggers[]>(SETUP_CONFIGURATION_SERVICE_URL, "/SensorEvents/GetEvent/" + url, config),
    deleteAllSensorsAndTriggersTemplate: (body: number[]) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, "/SensorEvents/DeleteAllEvents/", body, config),
    getAllFiltersSensorsAndTriggersEvents: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/SensorEvents/GetAllEvents${url}`, config);
    },
    getAllSensorsAndTriggersEvents: (url: any) => requests.get<SensorsAndTriggers[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),

    deleteAllRetentionPoliciesTemplate: (body: number[]) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataRetention/", body, config),    
    getRetentionPolicies: (id: number) => requests.get<RetentionPolicies[]>(SETUP_CONFIGURATION_SERVICE_URL, "/Policies/DataRetention/" + id, config),
    getAllFiltersRetentionPolicies: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<any>>(SETUP_CONFIGURATION_SERVICE_URL, `/Policies/PolicyType/DataRetention/${url}`, config);
    },
    getAllRetentionPolicies: (url: any) => requests.get<RetentionPolicies[]>(SETUP_CONFIGURATION_SERVICE_URL, url, config),
    putRetentionPoliciesTemplate: (url: string, body: any) => requests.put<number>(SETUP_CONFIGURATION_SERVICE_URL, url, body, config),
    postRetentionPoliciesTemplate: (url: string, body: any) => requests.post<number>(SETUP_CONFIGURATION_SERVICE_URL,url, body, config),

}
export const EvidenceAgent = {
    getEvidences: () => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, '/Evidences', config),
    getAssetTrail: (url: string) => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, url, config),
    getEvidence: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId, config),
    getAsset: (url: string) => requests.get<Asset>(EVIDENCE_SERVICE_URL, url, config),
    getAssetFile: (url: string) => requests.get<File[]>(EVIDENCE_SERVICE_URL, url, config),
    getQueuedAssets: (unitId: number) => requests.get<QueuedAssets[]>(EVIDENCE_SERVICE_URL, '/Evidences/QueuedAssets/' + unitId, config),
    isStationExistsinEvidence: (url: string) => requests.get<number>(EVIDENCE_SERVICE_URL, url, config),
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
    submitAnalysis: (url: string, body?: SubmitAnalysisModel) => requests.post<void>(JOBCOORDINATOR_SERVICE_URL, url, body ?? {}),
    LockOrUnLockAsset: (body: any) => requests.patch<void>(EVIDENCE_SERVICE_URL, '/Evidences/LockUnlock', body, config),
}

export const AuthenticationAgent = {
    getAccessToken: (url: string) => requests.get<Token>(getVerificationURL(url), '', config),
    getAccessAndRefreshToken: (url: string) => requests.get<any>(BASE_URL_AUTHENTICATION_SERVICE, url, config)
}

export const AuditLogAgent = {
    getUnitAuditLogs: (url: string) => requests.get<AuditLog[]>(AUDITLOG_SERVICE_URL, url),
}

export const FileAgent = {
    getDownloadFileUrl: (fileId: number) => requests.get<string>(FILE_SERVICE_URL, '/Files/download/' + fileId, config),
    getDownloadUrl: (url: string) => requests.get<string>(FILE_SERVICE_URL + "/Files", url, config),
    getFile: (id: number) => requests.get<FileF>(FILE_SERVICE_URL, "/Files/" + id, config),
    getHealthCheck: () => requests.get<string>(FILE_SERVICE_URL, '/Files/HealthCheck', config),
}

export const UsersAndIdentitiesServiceAgent = {
    getAllUsers: (url: string) => requests.get<UserList[]>(USER_INFO_GET_URL, url, config),
    
    //getUsersInfo: (url: string, body: any) => requests.postPaginated<Paginated<UsersInfo[]>>(USER_INFO_GET_URL, url, body, config),
    getUsersInfo: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<any>>(USER_INFO_GET_URL, url, config);
    },
    
    getUsersGroups: () => requests.get<UserGroups[]>(GROUP_GET_URL, '', config),
    getGroups: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<any>>(GROUP_GET_BY_ID_URL, url, config);
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
    editUserGroup: (url: string, body: UserGroups) => requests.put<void>(GROUP_GET_BY_ID_URL, url, body, config)
}
export const UnitsAndDevicesAgent = {
    getAllUnits: (url: string, extraHeader?: Headers[]) => {
        addHeaders(extraHeader);
        return requests.get<Unit[]>(BASE_URL_UNIT_SERVICES, url, config)
    },
    getUnit: (url: string) => requests.get<Unit>(BASE_URL_UNIT_SERVICES, url, config),
    getConfigurationTemplateList: (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
    getPrimaryDeviceInfo: (url: string) => requests.get<GetPrimaryDeviceInfo>(BASE_URL_UNIT_SERVICES, url, config),
    changeUnitInfo: (url: string, body: UnitTemp) => requests.put<void>(BASE_URL_UNIT_SERVICES, url, body, config),
    deleteUnit: (url: string) => requests.delete<void>(BASE_URL_UNIT_SERVICES, url, config),
    getUnitInfo: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<UnitInfo[]>>(BASE_URL_UNIT_SERVICES, url, config)
    },
    getAllStations: (url: string, extraHeader?: Headers[]) => {
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<Station[]>>(BASE_URL_UNIT_SERVICES, `/Stations${url}`, config);
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
        (extraHeader && extraHeader.length > 0) && addHeaders(extraHeader);
        return requests.getAll<Paginated<DeviceConfigurationTemplate[]>>(BASE_URL_UNIT_SERVICES, url, config)
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
    getAllUnitAssignmentKeyValues : (url: string) => requests.get<UnitTemplateConfigurationInfo[]>(BASE_URL_UNIT_SERVICES, url, config),
}
export const CommonAgent = {
    getCoutriesAlongWithStates: () => requests.get<any>(CountryStateApiUrl, '', config),
}
export const SearchAgent = {
    getAssetBySearch: (body: any, extraHeader?: Headers[]) => {
        addHeaders(extraHeader);
        return requests.post<any>(EVIDENCE_GET_URL, '', body, config)
    },
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
