import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';

export const getAllFormFieldsFilter: any = createAsyncThunk(
    'getAllFormFieldsFilter',
    async (pageiFilter?: any) => {
        let headers = [{ key: 'GridFilter', value: JSON.stringify(pageiFilter.gridFilter) }]
        return await SetupConfigurationAgent.getAllFormFields(`?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`, headers)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error("Response Error: ",error.response.data);
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

export const getAllTypes: any = createAsyncThunk(
    'getAllTypes',
    async () => {
        return SetupConfigurationAgent.getAllTypes()
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
); 

export const fromFieldsSlice = createSlice({
    name: 'FormFields',
    initialState: { filterFormFields: [] , getAllFormFields : [], getAllTypes : []},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllFormFieldsFilter.fulfilled, (state: any, { payload }) => {
                state.filterFormFields = payload;
            }).addCase(getAllFormFields.fulfilled, (state: any, { payload }) => {
                state.getAllFormFields = payload;
            }).addCase(getAllTypes.fulfilled, (state: any, { payload }) => {
                state.getAllTypes = payload;
            })
    }
});

export default fromFieldsSlice;