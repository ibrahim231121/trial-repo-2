import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SetupConfigurationAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllCategoriesFilter: any = createAsyncThunk(
    'getAllFilterCategories',
    async (arg: any, thunkAPI) => {
        try {
            const { pageiGrid, search } = arg;
            thunkAPI.dispatch(setLoaderValue({ isLoading: true }));
            const url = `?Page=${pageiGrid.page + 1}&Size=${pageiGrid.size}`;
            let headers = [
                {
                    key: 'GridFilter',
                    value: JSON.stringify(pageiGrid.gridFilter)
                },
                {
                    key: 'GridSort',
                    value: JSON.stringify(pageiGrid.gridSort)
                },
                {
                    key: 'InquireDepth',
                    value: search
                }
            ];
            return await SetupConfigurationAgent.getAllFiltersCategories(url, headers)
                .then((response) => {
                    thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: '' }));
                    return response;
                })
                .catch((error: any) => {
                    thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: '', error: true }));
                    console.error(error.response.data);
                });
        } catch (error) {           
            console.error('getAllCategoriesFilter', error);
        }
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