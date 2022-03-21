import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { EVIDENCE_ASSET_DATA_URL  } from '../utils/Api/url'


export const getEvidenceinfosync: any = createAsyncThunk(
    'GetAllEvidence',
    async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const resp = await fetch(EVIDENCE_ASSET_DATA_URL, requestOptions);
        
        if (resp.ok) {
            const response = await resp.json();
            return response;
        }
    }
);


export const templateSlice1 = createSlice({
    name: 'template',
    initialState: { templateInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getEvidenceinfosync .fulfilled, (state: any, { payload }) => {
            state.templateInfo = payload;
        })
    }
});

export default templateSlice1;