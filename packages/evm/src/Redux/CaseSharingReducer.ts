import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { CasesAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';


export const getAllFilteredCaseSharing: any = createAsyncThunk(
    'getAllFilteredCaseSharing',
    async (pageiFilter:any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({isLoading: true}))
        const url = `?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
        let headers = [
            {
            key : 'GridFilter',
            value : JSON.stringify(pageiFilter.GridFilter)
            },
            {
                key : 'GridSort',
                value : JSON.stringify(pageiFilter.GridSort)
            }
        ]
        return await CasesAgent.getAllCaseSharing(url, headers)
        .then((response) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false, message : ''}))
            return response;
        }).catch((error :any) => {
            thunkAPI.dispatch(setLoaderValue({isLoading: false,message: "", error: true}))
            console.error(error.response.data);
        });
    }
);

export const getAllCaseSharing: any = createAsyncThunk(
    'getAllCaseSharing',
    async (id:any) => {
        const url = `Case/${id}/CaseSharing/GetAll`
        return await CasesAgent.getAllCaseSharing(url)
        .then((response: any) => response)
        .catch((error: any) => {
            console.error("Response Error: ",error.response.data);
        });
    }
);

export const caseSharingSlice = createSlice({
    name: "caseSharing",
    initialState: {getAllCaseSharing: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCaseSharing.fulfilled, (state: any, {payload}) => {
            state.getAllCaseSharing = payload;
        })
    }
});

export default caseSharingSlice; 
