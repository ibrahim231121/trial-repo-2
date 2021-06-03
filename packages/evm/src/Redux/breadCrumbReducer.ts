import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const breadCrumbSlice = createSlice({
  name: "pathName",
  initialState: "",
  reducers: {
    enterPathName: (state, action: PayloadAction<{ val: any }>) =>
   // console.log(action)
       state=action.payload.val
  },
});

export default breadCrumbSlice;
export const { enterPathName: enterPathActionCreator } = breadCrumbSlice.actions;



