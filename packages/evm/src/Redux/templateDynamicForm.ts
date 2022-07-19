import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UnitsAndDevicesAgent } from '../utils/Api/ApiAgent';
import { Station } from '../utils/Api/models/StationModels';
import { CATEGORIES_GET_ALL, DATA_RETENTION_POLICIES_GET_ALL} from '../utils/Api/url'



export const getRetentionPolicyInfoAsync: any = createAsyncThunk(
    'GetAllRetentionPolicies',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };

        const resp = await fetch(DATA_RETENTION_POLICIES_GET_ALL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);

export const getCategoriesAsync: any = createAsyncThunk(
    'getAllCategories',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };

        const resp = await fetch(CATEGORIES_GET_ALL, requestOptions);
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);


export const getStationsAsync: any = createAsyncThunk(
    'getAllStations',
    async () => {
        return await UnitsAndDevicesAgent.getAllStationInfo(`?Size=100&Page=1`)
        .then((response:Station[]) => response)
        .catch((error: any) => {
            console.error(error.response.data);
        });
    }
);

export const unitTemplateSlice = createSlice({
    name: 'unitTemplateForm',
    initialState: { retentionPolicy: [], categories: [], stations: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRetentionPolicyInfoAsync.fulfilled, (state: any, { payload }) => {
            state.retentionPolicy = payload;
        }).addCase(getCategoriesAsync.fulfilled, (state: any, { payload }) => {
            state.categories = payload;
        }).addCase(getStationsAsync.fulfilled, (state: any, { payload }) => {
            state.stations = payload;
        })
    }
});



export default unitTemplateSlice;