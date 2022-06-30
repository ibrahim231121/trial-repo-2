import axios, { AxiosResponse } from 'axios';
import { StringIfPlural } from 'react-i18next';
import { Categories, Forms } from './models/Categories';
import { Bookmark, Evidence, Note } from './models/EvidenceModels';
import { EVIDENCE_SERVICE_URL, SETUP_CONFIGURATION_SERVICE_URL } from './url';

var config = {
    headers: {
        'Content-Type': 'application/json',
        'TenantId': '1',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
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
    post: <T>(baseUrl: string, url: string, body: {}, config?: {}) => {setBaseUrl(baseUrl); return axios.post<T>(url, body, config).then(responseBody)},
    put: <T>(baseUrl: string, url: string, body: {}) => {setBaseUrl(baseUrl); return axios.put<T>(url, body, config).then(responseBody)},
    delete: <T>(baseUrl: string, url: string) => {setBaseUrl(baseUrl); return axios.delete<T>(url, config).then(responseBody)},
}
export const SetupConfigurationAgent = {
    getCategories: () => requests.get<Categories[]>(SETUP_CONFIGURATION_SERVICE_URL, '/Blog'),
    getForms: () => requests.get<Forms[]>(SETUP_CONFIGURATION_SERVICE_URL, '/Forms'),
    getCategory: (id: string) => requests.get<Categories>(SETUP_CONFIGURATION_SERVICE_URL, `/Categories/${id}`),
    create: (category: Categories) => requests.post<void>(SETUP_CONFIGURATION_SERVICE_URL, '/CarPlates', category, config),
}
export const EvidenceAgent = {
    getEvidences: () => requests.get<Evidence[]>(EVIDENCE_SERVICE_URL, '/Evidences'),
    updateNote: (url: string, body: Note) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    updateBookmark: (url: string, body: Bookmark) => requests.put<void>(EVIDENCE_SERVICE_URL, url, body),
    deleteNote: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
    deleteBookmark: (url: string) => requests.delete<void>(EVIDENCE_SERVICE_URL, url),
}
