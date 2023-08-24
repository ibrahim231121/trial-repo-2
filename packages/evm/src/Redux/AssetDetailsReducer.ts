import React from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { EvidenceAgent } from '../utils/Api/ApiAgent';

const cookies = new Cookies();

export const getAssetTrailInfoAsync: any = createAsyncThunk(
    'getAssetTrailInfo',
    async (AssetDetails: any) => {
        return await EvidenceAgent.getAssetTrail(`/Evidences/${AssetDetails.evidenceId}/Assets/${AssetDetails.assetId}/AssetTrail`).then((response) => response);
    }
);

export const assetDetailSlice = createSlice({
    name: 'assetDetail',
    initialState: { assetTrailInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAssetTrailInfoAsync.fulfilled, (state: any, { payload }) => {
            payload.filter((x:any) => x.performedBy == 0).map((x:any)=>{
                if(x.performedBy == 0)
                {
                let guestuser = x.notes.split("$$");
                x.userName = (guestuser.length > 1) ? guestuser[1] : "";
                x.notes = (guestuser.length > 0) ? guestuser[0] : "";
                }
              });
              let restrictedLogs = [
                "Bookmark"
              ];
              
            restrictedLogs.forEach((r)=>{
                payload = payload.filter((x:any) => !x.notes.includes(r));

            });
            payload.forEach((x:any,i:number) => {
                x.seqNo = i+1;
            });
            state.assetTrailInfo = payload;
        })
    }
});

export default assetDetailSlice;