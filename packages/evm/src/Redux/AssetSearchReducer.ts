import React  from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { EVIDENCE_GET_URL } from '../utils/Api/url'
import usePostFetch from '../utils/Api/usePostFetch';
import { getToken } from "../Login/API/auth";

const cookies = new Cookies();

export const getAssetSearchInfoAsync: any = createAsyncThunk(
    'getAssetSearchInfo',
    async (QUERRY: any) => {
        // let local_assetSearchQuerry = localStorage.getItem("assetSearchQuerry");
        if (QUERRY === "") {
            let assetSearchQueeryGet = localStorage.getItem("assetSearchQuerry");
            if (assetSearchQueeryGet !== null) {
                QUERRY = JSON.parse(assetSearchQueeryGet);
            }
            console.log("Asset Search Start get", QUERRY)
        }
        else {
            localStorage.setItem("assetSearchQuerry", JSON.stringify(QUERRY));
            console.log("Asset Search Start set", QUERRY)
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
            console.log("Asset Search ", response)
            return response;
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