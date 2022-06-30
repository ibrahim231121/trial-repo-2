import React  from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { EVIDENCE_GET_URL, EVIDENCE_GET_CATEGORIES_URL } from '../utils/Api/url'
import usePostFetch from '../utils/Api/usePostFetch';
import { getToken } from "../Login/API/auth";
import { GridFilter } from '../GlobalFunctions/globalDataTableFunctions';

const cookies = new Cookies();

export const getAssetSearchInfoAsync: any = createAsyncThunk(
    'getAssetSearchInfo',
    async (QUERRY: any) => {
        if(QUERRY !== undefined && QUERRY.filters == undefined) {
            // let local_assetSearchQuerry = localStorage.getItem("assetSearchQuerry");
            if (QUERRY === "") {
                let assetSearchQueeryGet = localStorage.getItem("assetSearchQuerry");
                if (assetSearchQueeryGet !== null) {
                    QUERRY = JSON.parse(assetSearchQueeryGet);
                }
            }
            else {
                localStorage.setItem("assetSearchQuerry", JSON.stringify(QUERRY));
            }
            // const [postDataForSearch, responseForSearch] = usePostFetch<any>(EVIDENCE_GET_URL);
            // postDataForSearch(QUERRY, {
            //     'Authorization': `Bearer ${getToken()}`,
            //     'Content-Type': 'application/json',
            // });
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${getToken()}` },
                body: JSON.stringify(QUERRY),
            };
            const resp = await fetch(EVIDENCE_GET_URL, requestOptions);
            if (resp.ok) {
                const response = await resp.json();
                console.log("Response Evidence", response);
                return response;
            }
        }
        else {
            console.log("Evidence Asset")
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'TenantId': '1','Authorization': `Bearer ${getToken()}`},
                body: JSON.stringify(QUERRY),
            };
            const resp = await fetch( EVIDENCE_GET_CATEGORIES_URL + "/filter?Size=100&Page=1",requestOptions);
            if (resp.ok) {
                const response = await resp.json();
                console.log("Response Filter", response);
                return response;
            }
        }
    }
);

export const assetSearchSlice = createSlice({
    name: 'assetSearch',
    initialState: { assetSearchInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAssetSearchInfoAsync.fulfilled, (state: any, { payload }) => {
            state.assetSearchInfo = payload;
        })
    }
});

export default assetSearchSlice;