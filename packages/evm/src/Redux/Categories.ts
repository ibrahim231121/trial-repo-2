import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';

export const getAllCategoriesFilter: any = createAsyncThunk(
    'getAllFilterCategories',
    async (pageiFilter?: any) => {
        let headers = [{key : 'GridFilter', value : JSON.stringify(pageiFilter.gridFilter)}]
        return await SetupConfigurationAgent.getAllFiltersCategories(`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`, headers)
        .then((response:any) =>response)
        .catch((error: any) => {
            console.error(error.response.data);
        });
    }
);

export const categoriesSlice = createSlice({ 
    name: 'CategoriesForm',
    initialState: { filterCategories: []},
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllCategoriesFilter.fulfilled, (state: any, {payload}) => {
            state.filterCategories = payload;
        })
    }
});
export default categoriesSlice;