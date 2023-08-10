import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AlprAdvanceSearchAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

interface alprSearchType{
    QUERRY:any,
    searchType:any
}
export const getAlprSearchInfoAsync: any = createAsyncThunk(
    'getAlprSearchInfo',
    async ({QUERRY, searchType}:alprSearchType, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    if (QUERRY === '') {
        let alprSearchQueryGet = localStorage.getItem('alprSearchQuery');
        let alprSearchType: any = localStorage.getItem('alprSearchType');
        searchType = JSON.parse(alprSearchType).searchValue;
        
        
        if (alprSearchQueryGet !== null) {
            QUERRY = JSON.parse(alprSearchQueryGet);
        }
    } else {
        localStorage.setItem('alprSearchQuery', JSON.stringify(QUERRY));
    }
    var searchQuery = JSON.stringify(QUERRY.query_string.query)
    return AlprAdvanceSearchAgent.getNumberPlateBySearch("/Alpr/Search",searchQuery, [{key: "SearchType", value:searchType}])
    .then((response: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }));
        return response;
    }).catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        return error.response.status;
      });
});

export const getNumberPlateSearchNameAsync: any = createAsyncThunk(
    'getNumberPlateSearchName',
    async ({QUERRY, dateTime, searchType}: any) => {
    if (QUERRY === '') {
        let alprSearchQueryGet = localStorage.getItem('alprSearchQuery');
        let alprSearchDateGet: any = localStorage.getItem('alprSearchDate');
        let alprSearchType: any = localStorage.getItem('alprSearchType')
        let querry_string: any
        if (alprSearchQueryGet !== null) {
            QUERRY = JSON.parse(alprSearchQueryGet);
            dateTime = JSON.parse(alprSearchQueryGet);
            if(QUERRY.bool.must[0].query_string){

                 querry_string =  QUERRY.bool.must[0].query_string.query
            }
            else{
                querry_string = JSON.parse(alprSearchType).searchValueType
            }   
                return [dateTime,querry_string]
        }
    } else {
        localStorage.setItem('alprSearchDate', JSON.stringify(dateTime));
        localStorage.setItem('alprSearchType', JSON.stringify(searchType));
        return ""
    }
});

export const AlprAdvanceSearchSlice = createSlice({
    name: 'AlprSearch',
    initialState: { alprSearchInfo: [], alprSearchName: []  },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAlprSearchInfoAsync.fulfilled, (state: any, { payload }) => {
            state.alprSearchInfo = payload;
        }).addCase(getNumberPlateSearchNameAsync.fulfilled, (state: any, { payload }) => {
            state.alprSearchName = payload;
        })
    }
});

export default AlprAdvanceSearchSlice;