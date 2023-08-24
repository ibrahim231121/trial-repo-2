import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { CasesAgent } from '../utils/Api/ApiAgent';

export const getCaseClosedReason: any =  createAsyncThunk(
    'getCaseClosedReason',
    async () => {
        const url = '/CaseClosedReason'
        return await CasesAgent.getCaseClosedReason(url)
        .then((response: any) => {
            return response;
        })
        .catch((error: any) => {
            console.error(error.response.data)
        });
    }
)

export const caseClosedReasonSlice = createSlice({
    name: 'caseClosedReason',
    initialState: {caseClosedReasonSlice: []},
    reducers: {},
    extraReducers: {
        [getCaseClosedReason.fulfilled]: (state, {payload}) => {
            state.caseClosedReasonSlice = payload;
        }
    }
});

export default caseClosedReasonSlice;