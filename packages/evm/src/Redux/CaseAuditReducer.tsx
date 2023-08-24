import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { CasesAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';

export const getAllFilteredCaseAudit: any = createAsyncThunk(
    'getAllFilteredCaseAudit',
    async (pageiFilter:any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        const url = `/Case/${pageiFilter.caseId}/CaseAudit/?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
        const headers = [
            {
                key : 'GridFilter',
                value : JSON.stringify(pageiFilter.gridFilter)
            },
            {
                key : 'GridSort',
                value : JSON.stringify(pageiFilter.gridSort)
            }
        ]
        return await CasesAgent.getAllCaseAudit(url, headers)
        .then ((response : any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message : '' }))
            return response;
        }).catch((error : any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message:"", error: true}))
            console.error(error.response.data);
        })
    }
);

export const caseAuditSlice = createSlice({
    name: "caseAudit",
    initialState: {getAllFilteredCaseAudit: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFilteredCaseAudit.fulfilled, (state: any, {payload}) => {
            state.getAllFilteredCaseAudit = payload;
        })
    }
});

export default caseAuditSlice;