import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { SearchAgent } from '../utils/Api/ApiAgent';
import { SearchModel } from '../utils/Api/models/SearchModel';

interface assetSearchType{
    QUERRY:any,
    searchType:string
}
export const getAssetSearchInfoAsync: any = createAsyncThunk(
    'getAssetSearchInfo',
    async ({QUERRY, searchType}:assetSearchType) => {
    if (QUERRY === '') {
        let assetSearchQueeryGet = localStorage.getItem('assetSearchQuerry');
        if (assetSearchQueeryGet !== null) {
            QUERRY = JSON.parse(assetSearchQueeryGet);
        }
    } else {
        localStorage.setItem('assetSearchQuerry', JSON.stringify(QUERRY));
    }
    return SearchAgent.getAssetBySearch(JSON.stringify(QUERRY), [{key: "SearchType", value:searchType}]).then((response: SearchModel.Evidence[]) => response);
});

export const assetSearchSlice = createSlice({
    name: 'assetSearch',
    initialState: { assetSearchInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAssetSearchInfoAsync.fulfilled, (state: any, { payload }) => {
            state.assetSearchInfo = payload;
        });
    }
});

export default assetSearchSlice;