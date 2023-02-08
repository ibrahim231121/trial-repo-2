import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const assetThumbnailSlice = createSlice({
  name: "assetThumbnail",
  initialState: { assetThumbnailData: [], isDuplicateFound: false },
  reducers: {

    getAssetThumbnail: (state: any) => {
      let local_assetThumbnail = localStorage.getItem("assetThumbnail");
      if (local_assetThumbnail !== null) {
        state.assetThumbnailData = JSON.parse(local_assetThumbnail);
      }
    },
    addAssetThumbnail: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
        if (!Array.isArray(payload)) {
          const find = state.assetThumbnailData.findIndex((val: any) => val.assetName === payload.assetName)
          if (find === -1) {
            state.assetThumbnailData.push(payload)
          }
        } else {
          const find = payload.filter((p: any) => !state.assetThumbnailData.find((s: any) => p.assetName === s.assetName))
          if (payload.length > find.length) {
            state.isDuplicateFound = true;
          }
          state.assetThumbnailData.push(...find)
        }
      localStorage.setItem("assetThumbnail", JSON.stringify(state.assetThumbnailData));
    },
    removeAssetThumbnail: (state: any, action: PayloadAction<any>) => {
      const { payload } = action
      if (!Array.isArray(payload)) {
        const find = state.assetThumbnailData.findIndex((val: any) => val.assetName === payload.assetName)
        if (find != -1) {
          state.assetThumbnailData.splice(find, 1);
        }
      } else {
        const ids = payload.map(p => { return p.assetName });
        const newState = state.assetThumbnailData.filter((s: any) => !ids.includes(s.assetName));
        state.assetThumbnailData.splice(0, state.assetThumbnailData.length)
        state.assetThumbnailData.push(...newState);
      }
      //work for local storage.
      localStorage.setItem("assetThumbnail", JSON.stringify(state.assetThumbnailData));
    },
    updateDuplicateFound: (state: any) => {
      state.isDuplicateFound = false;
    }
  },
});

export default assetThumbnailSlice;
export const { addAssetThumbnail: addAssetThumbnail, removeAssetThumbnail: removeAssetThumbnail, updateDuplicateFound: updateDuplicateFound, getAssetThumbnail: getAssetThumbnail } = assetThumbnailSlice.actions;