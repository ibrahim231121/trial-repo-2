import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllCategoriesFilter: any = createAsyncThunk(
    'getAllFilterCategories',
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
        return await SetupConfigurationAgent.getAllFiltersCategories(url, headers)
        .then((response) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
            return response
        }).catch((error: any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
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