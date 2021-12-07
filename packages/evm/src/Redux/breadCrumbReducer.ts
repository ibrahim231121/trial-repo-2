import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const breadCrumbSlice = createSlice({
  name: "pathName",
  initialState: "",
  reducers: {
    enterPathName: (state, action: PayloadAction<{ val: any }>) =>
      action.payload.val,
  },
});

export default breadCrumbSlice;
export const { enterPathName: enterPathActionCreator } = breadCrumbSlice.actions;



