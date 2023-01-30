import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const assetBucketSlice = createSlice({
  name: "assetBucket",
  initialState: { assetBucketData: [], isDuplicateFound: false },
  reducers: {

    loadFromLocalStorage: (state: any) => {
      let local_assetBucket = localStorage.getItem("assetBucket");
      if (local_assetBucket !== null) {
        state.assetBucketData = JSON.parse(local_assetBucket);
      }
    },
    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      // if(payload.isMetaData && payload.isMetaData==true){
      //   const find = state.assetBucketData.findIndex((val: any) => val.assetId === payload.assetId)
      //   if (find === -1) {
      //     state.assetBucketData.push(payload)
      //   }
      // }
      // else {
        if (!Array.isArray(payload)) {
          const find = state.assetBucketData.findIndex((val: any) => val.assetId === payload.assetId)
          if (find === -1) {
            state.assetBucketData.push(payload)
          }
        } else {
          const find = payload.filter((p: any) => !state.assetBucketData.find((s: any) => p.assetId === s.assetId))
          if (payload.length > find.length) {
            state.isDuplicateFound = true;
          }
          state.assetBucketData.push(...find)
        }
      //}
      //work for local storage.
      localStorage.setItem("isBucket", "True");
      localStorage.setItem("assetBucket", JSON.stringify(state.assetBucketData));
    },
    remove: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      if (!Array.isArray(payload)) {
        const find = state.assetBucketData.findIndex((val: any) => val.id === payload.id)
        if (find != -1) {
          state.assetBucketData.splice(find, 1);
        }
      } else {
        const ids = payload.map(p => { return p.id });
        const newState = state.assetBucketData.filter((s: any) => !ids.includes(s.id));
        state.assetBucketData.splice(0, state.assetBucketData.length)
        state.assetBucketData.push(...newState);
      }
      //work for local storage.
      localStorage.setItem("assetBucket", JSON.stringify(state.assetBucketData));
    },
    updateDuplicateFound: (state: any) => {
      state.isDuplicateFound = false;
    }
  },
});

export default assetBucketSlice;
export const { add: addAssetToBucketActionCreator, remove: removeAssetFromBucketActionCreator, updateDuplicateFound: updateDuplicateFound, loadFromLocalStorage: loadFromLocalStorage } = assetBucketSlice.actions;