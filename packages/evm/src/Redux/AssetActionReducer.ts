import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const assetBucketSlice = createSlice({
  name: "assetBucket",
  initialState: [],
  reducers: {
    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      if (!Array.isArray(payload)) {
        const find = state.findIndex((val: any) => val.id === payload.id)
        if (find === -1) {
          state.push(payload)
        }
      } else {
        const find = payload.filter((p: any) => !state.find((s: any) => p.id === s.id))
        state.push(...find)
      }
    },
    remove: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      if (!Array.isArray(payload)) {
        const find = state.findIndex((val: any) => val.id === payload.id)
        if (find != -1) {
          state.splice(find, 1);
        }
      } else {
        const ids = payload.map(p => { return p.id });
        const newState = state.filter((s: any) => !ids.includes(s.id));
        state.splice(0, state.length)
        state.push(...newState);
      }
    },
  },
});

export default assetBucketSlice;
export const { add: addAssetToBucketActionCreator, remove: removeAssetFromBucketActionCreator } = assetBucketSlice.actions;