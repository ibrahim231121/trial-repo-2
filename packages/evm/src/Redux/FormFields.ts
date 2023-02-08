import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllFormFieldsFilter: any = createAsyncThunk(
    'getAllFormFieldsFilter',
    async (pageiFilter: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }));
        const url = `?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`;
        let headers = [
            {
                key: 'GridFilter',
                value: JSON.stringify(pageiFilter.gridFilter)
            },
            {
                key: 'GridSort',
                value: JSON.stringify(pageiFilter.gridSort)
            }]
        return await SetupConfigurationAgent.getAllFormFields(url, headers)
            .then((response) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response
            }).catch((error: any) => {
                console.error("Response Error: ", error.response.data);
            });
    }
);

export const getAllFormFields: any = createAsyncThunk(
    'getAllFormFields',
    async (pageiFilter?: any) => {
        return await SetupConfigurationAgent.getAllFormFields(`?Page=1&Size=10000`)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error("Response Error: ",error.response.data);
            });
    }
);

export const fromFieldsSlice = createSlice({
    name: 'FormFields',
    initialState: { filterFormFields: [] , getAllFormFields : [] },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllFormFieldsFilter.fulfilled, (state: any, { payload }) => {
                state.filterFormFields = payload;
            }).addCase(getAllFormFields.fulfilled, (state: any, { payload }) => {
                state.getAllFormFields = payload;
            })
    }
});

export default fromFieldsSlice;