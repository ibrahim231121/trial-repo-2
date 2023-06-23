import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoaderValue } from "./loaderSlice";
import { ALPR_PLATE_HISTORY } from "../utils/Api/url";
import { AlprPlateHistoryAgent } from "../utils/Api/ApiAgent";
import { PageiGrid } from "../GlobalFunctions/globalDataTableFunctions";
import { GetAlprPlateHistoryPayload } from "../Application/ALPR/ALPRTypes";

export const getAllPlateHistoryInfos = createAsyncThunk("getAlprPlateHistory", async (payload: GetAlprPlateHistoryPayload, thunkAPI)=>{
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))

    const url = ALPR_PLATE_HISTORY.replace("{numberPlateId}", payload.numberPlateId.toString()) + `?Page=${payload.pageiGrid.page+1}&Size=${payload.pageiGrid.size}`
        let headers = [
            {   
                key : 'GridFilter', 
                value : JSON.stringify(payload.pageiGrid.gridFilter)
            },
            {
                key: 'GridSort', 
                value : JSON.stringify(payload.pageiGrid.gridSort)
            }]
             return await AlprPlateHistoryAgent
             .getAlprPlateHistoryInfosAsync(url, headers)
             .then((response) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
                return response
            }).catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
                console.error(error.response.data);
                return error.response.status
              });
});

export const alprPlateHistorySlice = createSlice({
    name: 'alprplatehistory',
    initialState: { platHistoryInfos: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllPlateHistoryInfos.fulfilled, (state: any, { payload }) => {
            state.platHistoryInfos = payload;
        })
    }
});

export default alprPlateHistorySlice;