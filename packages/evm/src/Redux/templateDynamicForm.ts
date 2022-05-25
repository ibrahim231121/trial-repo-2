import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CATEGORIES_GET_ALL, DATA_RETENTION_POLICIES_GET_ALL, STATIONS_GET_ALL, STATIONINFO_GET_URL } from '../utils/Api/url'



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
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
       
        const resp = await fetch(STATIONINFO_GET_URL, requestOptions);
        if (resp.ok) {
           
            const response = await resp.json();
            return response;
        }
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