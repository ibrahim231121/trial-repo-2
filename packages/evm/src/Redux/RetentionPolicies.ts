import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';

export const getAllRetentionPoliciesFilter: any = createAsyncThunk(
    'getAllFilterRetentionPolicies',
    async (pageiFilter?: any) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await SetupConfigurationAgent.getAllFiltersRetentionPolicies(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
        .then((response:any) => response)
        .catch((error: any) => {
            console.error(error.response.data);
        });
    }
);

export const getAllRetentionPolicies: any = createAsyncThunk(
    'getAllRetentionPolicies',
    async () => {
        return SetupConfigurationAgent.getAllPoliciesByType('DataRetention')
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
);

export const getAllUploadPolicies: any = createAsyncThunk(
    'getAllUploadPolicies',
    async () => {
        return SetupConfigurationAgent.getAllPoliciesByType('DataUpload')
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
);

export const retentionPoliciesSlice = createSlice({ 
    name: 'retentionPoliciesForm',
    initialState: { retentioPolicies: [], filterRetentionPolicies: [], getAllRetentionPolicies : [], getAllUploadPolicies : [] },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllRetentionPoliciesFilter.fulfilled, (state: any, {payload}) => {
            state.filterRetentionPolicies = payload;
        }).addCase(getAllRetentionPolicies.fulfilled, (state: any, {payload}) => {
            state.getAllRetentionPolicies = payload;
        }).addCase(getAllUploadPolicies.fulfilled, (state: any, {payload}) => {
            state.getAllUploadPolicies = payload;
        })
    }
});
export default retentionPoliciesSlice;