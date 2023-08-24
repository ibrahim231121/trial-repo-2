import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit'



interface Timeline {
    assetName: string;
    recording_started: any;
    recording_start_point: number;
    recording_Start_point_ratio: number;
    recording_end_point: number;
    recording_end_point_ratio: number;
    recordingratio: number;
    bookmarks: any;
    notes: any;
    startdiff: number;
    video_duration_in_second: number;
    src: string;
    id: string;
    dataId: string;
    unitId: string;
    enableDisplay: boolean,
    indexNumberToDisplay: number,
    camera: string,
    timeOffset: number,
    assetbuffering: any,
    previousSegmentsDurationInMilliSeconds: number
}

const initialState = {
  data: [] as Timeline[]
}

const timelineDetailSlice = createSlice({
  name: "timelineDetailSlice",
  initialState,
  reducers: {
    add: (state: any , action: PayloadAction<Timeline[]>) => {
        if(action.payload.length>0){
          let temp : Timeline[] = action.payload;
          
          // if(state.data.length>0){ //Update Case
          //   let tempstate = JSON.stringify(state.data)
          //   let temppayload = JSON.stringify(temp)
          //   if(tempstate != temppayload){
          //   state.data = [...temp]
          //   }
          // }
          // else{ // Add Case
            state.data = [...temp]
          // }
        }
    }
  },
});


export default timelineDetailSlice;
export const { add: addTimelineDetailActionCreator} = timelineDetailSlice.actions;