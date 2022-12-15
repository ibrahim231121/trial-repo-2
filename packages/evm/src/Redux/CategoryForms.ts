import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';

export const getAllCategyFormsFilter: any = createAsyncThunk(
    'getAllCategyFormsFilter',
    async (pageiFilter?: any) => {
        let headers = [{ key: 'GridFilter', value: JSON.stringify(pageiFilter.gridFilter) }]
        return await SetupConfigurationAgent.getAllFiltersCategoryFroms(`?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`, headers)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error("Error hai",error.response.data);
            });
    }
);

export const getAllCategoryForms: any = createAsyncThunk(
    'getAllData',
    async () => {
        return SetupConfigurationAgent.getAllCategoryFroms(`?Page=1&Size=10000`)
            .then((response: any) => response)
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }
);

export const categoryFromsSlice = createSlice({
    name: 'CategoryForms',
    initialState: { filterCategoryForms: [], getAllCategoryForms: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategyFormsFilter.fulfilled, (state: any, { payload }) => {
                state.filterCategoryForms = payload;
            }).addCase(getAllCategoryForms.fulfilled, (state: any, { payload }) => {
                state.getAllCategoryForms = payload;
            })
    }
});
export default categoryFromsSlice;