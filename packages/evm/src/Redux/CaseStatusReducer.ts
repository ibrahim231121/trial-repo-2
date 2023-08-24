import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {  CasesAgent } from '../utils/Api/ApiAgent';

export const getCaseStatusInfo: any = createAsyncThunk(
    'getCaseStatusInfo',
    async () => {
        const url = '/CaseStatus'
            return await CasesAgent.getCaseStatus(url)
            .then((response:any) => {         
                console.log(response)  
                return response
            })
            .catch((error: any) => {
                console.error(error.response.data);
            });
});

export const caseStatusSlice = createSlice({
    name: 'caseStatus',
    initialState: { caseStatus: [] },
    reducers: {},
    extraReducers: {
      [getCaseStatusInfo.fulfilled]: (state, { payload }) => {
        state.caseStatus = payload;
      }
    }
  });

export default caseStatusSlice;