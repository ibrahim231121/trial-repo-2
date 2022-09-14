import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { EvidenceAgent } from '../utils/Api/ApiAgent';
import { Evidence } from '../utils/Api/models/EvidenceModels';
import { EVIDENCE_ASSET_DATA_URL  } from '../utils/Api/url'
import { setLoaderValue } from './loaderSlice';





export const getEvidenceinfosync: any = createAsyncThunk(
    'GetAllEvidence',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        return await EvidenceAgent.getEvidences().then((response:Evidence[]) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
            return response
        }).catch(() => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
        })
    }
);


export const templateSlice1 = createSlice({
    name: 'template',
    initialState: { templateInfo: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getEvidenceinfosync.fulfilled, (state: any, { payload }) => {
            state.templateInfo = payload;
        })
    }
});

export default templateSlice1;