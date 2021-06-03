import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const pathNameSlice = createSlice({
  name: "pathName",
  initialState: "",
  reducers: {
    enterPathName: (state, action: PayloadAction<{ val: any }>) =>
   // console.log(action)
       state=action.payload.val
  },
});

export default pathNameSlice;
export const { enterPathName: enterPathActionCreator } = pathNameSlice.actions;



