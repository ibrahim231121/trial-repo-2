import React from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { EvidenceAgent } from '../utils/Api/ApiAgent';

const cookies = new Cookies();

export const getAssetTrailInfoAsync: any = createAsyncThunk(
    'getAssetTrailInfo',
    async (AssetDetails: any) => {
        return await EvidenceAgent.getAssetTrail(`/Evidences/${AssetDetails.evidenceId}/AssetTrail`).then((response) => response);
    }
);

export const assetDetailSlice = createSlice({
    name: 'assetDetail',
    initialState: { assetTrailInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAssetTrailInfoAsync.fulfilled, (state: any, { payload }) => {
            state.assetTrailInfo = payload;
        })
    }
});

export default assetDetailSlice;