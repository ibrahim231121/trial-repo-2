import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { EvidenceAgent } from '../utils/Api/ApiAgent';
import { Evidence } from '../utils/Api/models/EvidenceModels';
import { EVIDENCE_ASSET_DATA_URL  } from '../utils/Api/url'


export const getEvidenceinfosync: any = createAsyncThunk(
    'GetAllEvidence',
    async () => {
        return await EvidenceAgent.getEvidences().then((response:Evidence[]) => response)
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