import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type State ={
  name: string;
  age: number;
}
const assetBucketSlice = createSlice({
  name: "assetBucket",
  initialState: [],
  reducers: {
    add: (state:any, action: PayloadAction<any>) => {
      const {payload} = action
      if (!Array.isArray(payload)) {
        const find= state.findIndex((val:any)=>val.id===payload.id)
        if (find===-1) {
          state.push(payload) 
        }
      }else{
        const find = payload.filter((p:any)=>!state.find((s:any)=>p.id===s.id))
        state.push(...find)  
      }
    },
  },
});

export default assetBucketSlice;
export const { add: addAssetToBucketActionCreator } = assetBucketSlice.actions;