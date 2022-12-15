import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';

export const getAllUploadPoliciesFilter: any = createAsyncThunk(
    'getAllUploadPoliciesFilter',
    async (pageiFilter?: any) => {
        let headers = [{ key: 'GridFilter', value: JSON.stringify(pageiFilter.gridFilter) }]
        return await SetupConfigurationAgent.getAllFiltersUploadPolicies(`?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`, headers)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
);


export const getAllData: any = createAsyncThunk(
    'getAllData',
    async () => {
        return SetupConfigurationAgent.GetUploadPolicyValues()
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
);

export const uploadPoliciesSlice = createSlice({
    name: 'uploadPoliciesForm',
    initialState: { uploadPolicies: [], filterUploadPolicies: [], getAll: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUploadPoliciesFilter.fulfilled, (state: any, { payload }) => {
            state.filterUploadPolicies = payload;
        }).addCase(getAllData.fulfilled, (state: any, { payload }) => {
            state.getAll = payload;
        })
    }
});

export default uploadPoliciesSlice;