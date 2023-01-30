import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllUploadPoliciesInfoAsync: any = createAsyncThunk(
    'getAllFilterUploadPolicies',
    async (pageiFilter: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        console.log("PageiGrid : ", pageiFilter)
        const url = `?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`
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
            .getAllFiltersUploadPolicies(url, headers)
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
        builder.addCase(getAllUploadPoliciesInfoAsync.fulfilled, (state: any, { payload }) => {
            state.filterUploadPolicies = payload;
        }).addCase(getAllData.fulfilled, (state: any, { payload }) => {
            state.getAll = payload;
        })
    }
});

export default uploadPoliciesSlice;