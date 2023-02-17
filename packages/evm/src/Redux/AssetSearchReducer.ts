import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { SearchAgent } from '../utils/Api/ApiAgent';
import { SearchModel } from '../utils/Api/models/SearchModel';
import { setLoaderValue } from './loaderSlice';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import { BlockLockedAssets } from '../Application/Assets/utils/constants';

interface assetSearchType{
    QUERRY:any,
    searchType:any
}
export const getAssetSearchInfoAsync: any = createAsyncThunk(
    'getAssetSearchInfo',
    async ({QUERRY, searchType}:assetSearchType, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
    if (QUERRY === '') {
        let assetSearchQueeryGet = localStorage.getItem('assetSearchQuerry');
        let assetEvidenceSearchType: any = localStorage.getItem('evidenceSearchType');
        searchType = JSON.parse(assetEvidenceSearchType).searchValue;
        
        
        if (assetSearchQueeryGet !== null) {
            QUERRY = JSON.parse(assetSearchQueeryGet);
        }
    } else {
        localStorage.setItem('assetSearchQuerry', JSON.stringify(QUERRY));
    }
    /**
     *! Need to revert under written logic, as it needs to be catered from Elastic Query.
     *! It block to render child asset if they are locked.
     */
    const cookies = new Cookies();
    const decoded : any = jwt_decode(cookies.get("access_token"));
    return SearchAgent.getAssetBySearch(JSON.stringify(QUERRY), [{key: "SearchType", value:searchType}]).then((response: SearchModel.Evidence[]) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }));
        /**
         *! Locked child asset only be rendered if user has 'Permission' or asset is owned by user as 'Search Type' is 'ViewOwnAssets'.
         */
        const assets = BlockLockedAssets(decoded, searchType, response, 'getAssetSearchInfoAsync');
        return assets;
    }).catch((error: any) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        return error.response.status;
      });
});

export const getAssetSearchNameAsync: any = createAsyncThunk(
    'getAssetSearchName',
    async ({QUERRY, dateTime, searchType}: any) => {
    if (QUERRY === '') {
        let assetSearchQueeryGet = localStorage.getItem('assetSearchQuerry');
        let assetSearchDateGet: any = localStorage.getItem('assetSearchDate');
        let assetEvidenceSearchType: any = localStorage.getItem('evidenceSearchType')
        let querry_string: any
        if (assetSearchQueeryGet !== null) {
            QUERRY = JSON.parse(assetSearchQueeryGet);
            dateTime = JSON.parse(assetSearchDateGet);
            if(QUERRY.bool.must[0].query_string){

                 querry_string =  QUERRY.bool.must[0].query_string.query
            }
            else{
                querry_string = JSON.parse(assetEvidenceSearchType).searchValueType
            }   
                return [dateTime,querry_string]
        }
    } else {
        localStorage.setItem('assetSearchDate', JSON.stringify(dateTime));
        localStorage.setItem('evidenceSearchType', JSON.stringify(searchType));
        return ""
    }
});

export const assetSearchSlice = createSlice({
    name: 'assetSearch',
    initialState: { assetSearchInfo: [], assetSearchName: []  },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAssetSearchInfoAsync.fulfilled, (state: any, { payload }) => {
            state.assetSearchInfo = payload;
        }).addCase(getAssetSearchNameAsync.fulfilled, (state: any, { payload }) => {
            state.assetSearchName = payload;
        })
    }
});

export default assetSearchSlice;