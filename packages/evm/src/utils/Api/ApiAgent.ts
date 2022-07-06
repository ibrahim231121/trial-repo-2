import axios, { AxiosResponse } from 'axios';
import { StringIfPlural } from 'react-i18next';
import { Category, Forms } from './models/CategoryModels';
import { Policy } from './models/PolicyModels';
import { AddOwner, Asset, AssetSharingModel, AssetViewReason, Bookmark, Evidence, ExtendRetention, Note, TimelinesSync } from './models/EvidenceModels';
import { EVIDENCE_SERVICE_URL, SETUP_CONFIGURATION_SERVICE_URL } from './url';
import { getVerificationURL } from "../../utils/settings";
import {Token} from './models/AuthenticationModels';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

var config = {
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
    if (error.response.status == 400) {
        return Promise.reject(error);
    }
})
const responseBody = <T>(response: AxiosResponse<T>) => response.data;
const setBaseUrl = (baseUrl: string) => axios.defaults.baseURL = baseUrl;

const requests = {
    get: <T>(baseUrl: string, url: string) => {setBaseUrl(baseUrl); return axios.get<T>(url,config).then(responseBody)},
    post: <T>(baseUrl: string, url: string, body: {}) => {setBaseUrl(baseUrl); return axios.post<T>(url, body, config).then(responseBody)},
    put: <T>(baseUrl: string, url: string, body: {}) => {setBaseUrl(baseUrl); return axios.put<T>(url, body, config).then(responseBody)},
    delete: <T>(baseUrl: string, url: string) => {setBaseUrl(baseUrl); return axios.delete<T>(url, config).then(responseBody)},
}
export const SetupConfigurationAgent = {
    getCategories: (url: string) => requests.get<Category[]>(SETUP_CONFIGURATION_SERVICE_URL, url),
    getPoliciesAccordingToType: (url: string) => requests.get<Policy[]>(SETUP_CONFIGURATION_SERVICE_URL, url),
    getForms: () => requests.get<Forms[]>(SETUP_CONFIGURATION_SERVICE_URL, '/Forms'),
    getCategory: (id: string) => requests.get<Category>(SETUP_CONFIGURATION_SERVICE_URL, `/Categories/${id}`),
    create: (category: Category) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, '/CarPlates', category),
}
export const EvidenceAgent = {
    getEvidences: () => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, '/Evidences'),
    getEvidence: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId),
    getAsset: (url: string) => requests.get<Asset>(EVIDENCE_SERVICE_URL, url),
    addAsset: (url: string, body: Asset) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    getEvidenceCategories: (evidenceId: number) => requests.get<Evidence>(EVIDENCE_SERVICE_URL, '/Evidences/' + evidenceId),
    addBookmark: (url: string, body: Bookmark) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    updateBookmark: (url: string, body: Bookmark) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    deleteBookmark: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
    addNote: (url: string, body: Note) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    updateNote: (url: string, body: Note) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    deleteNote: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
    timelineSync: (url: string, body: TimelinesSync[]) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    addAssetViewReason: (url: string, body: AssetViewReason) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    addUsersToMultipleAsset: (url: string, body: AddOwner[]) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    addUsersToAsset: (url: string, body: number[]) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body),
    setPrimaryAsset: (url: string) => requests.get<void>(EVIDENCE_SERVICE_URL, url),
    updateRetentionPolicy: (url: string, body: ExtendRetention[]) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    shareAsset: (url: string, body?: AssetSharingModel) => requests.post<void>(EVIDENCE_SERVICE_URL, url, body ?? {}),
}

export const AuthenticationAgent = {
    getAccessToken: (url:string) => requests.get<Token>(getVerificationURL(url),'')
}
