import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllRetentionPoliciesInfoAsync: any = createAsyncThunk(
    'getAllFilterRetentionPolicies',
    async (pageiFilter: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        const url = `?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
        let headers = [
            {   
                key : 'GridFilter', 
                value : JSON.stringify(pageiFilter.gridFilter)
            },
            {
                key: 'GridSort', 
                value : JSON.stringify(pageiFilter.gridSort)
            }]
        return await SetupConfigurationAgent
        .getAllFiltersRetentionPolicies(url, headers)
        .then((response) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
            return response
        })
        .catch((error: any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
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
        .addCase(getAllRetentionPoliciesInfoAsync.fulfilled, (state: any, {payload}) => {
            state.filterRetentionPolicies = payload;
        }).addCase(getAllRetentionPolicies.fulfilled, (state: any, {payload}) => {
            state.getAllRetentionPolicies = payload;
        }).addCase(getAllUploadPolicies.fulfilled, (state: any, {payload}) => {
            state.getAllUploadPolicies = payload;
        })
    }
});
export default retentionPoliciesSlice;