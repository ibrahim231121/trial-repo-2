import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoaderValue } from "./loaderSlice";
import { ALPR_CAPTURE_PLATE } from "../utils/Api/url";
import { AlprCapturePlatesAgent } from "../utils/Api/ApiAgent";
import { GetAlprCapturePayload } from "../Application/ALPR/ALPRTypes";

export const getAllAlprCapturePlatesInfo = createAsyncThunk("getAlprCapturePlates", async (payload: GetAlprCapturePayload, thunkAPI)=>{
    thunkAPI.dispatch(setLoaderValue({isLoading: true}))

    const url = ALPR_CAPTURE_PLATE + `?userId=${payload.userId}&hotListId=${payload.hotListId}&Page=${payload.pageiGrid.page+1}&Size=${payload.pageiGrid.size}&startDate=${payload.startDate}&endDate=${payload.endDate}`
        let headers = [
            {   
                key : 'GridFilter', 
                value : JSON.stringify(payload.pageiGrid.gridFilter)
            },
            {
                key: 'GridSort', 
                value : JSON.stringify(payload.pageiGrid.gridSort)
            }]
             return await AlprCapturePlatesAgent
             .getAlprCapturePlatesInfoAsync(url, headers)
             .then((response) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
                return response
            }).catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
                console.error(error.response.data);
                return error.response.status
              });
});

export const alprCapturePlateSlice = createSlice({
    name: 'alprcaptureplate',
    initialState: { capturePlateInfos: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllAlprCapturePlatesInfo.fulfilled, (state: any, { payload }) => {
            state.capturePlateInfos = payload;
        })
    }
});

export default alprCapturePlateSlice;