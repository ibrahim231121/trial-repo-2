import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface assetBucketBasket {
    isOpen: boolean,
    isMulti: boolean,
    sharePopup: boolean
}

const initialState: assetBucketBasket = {
  isOpen: false,
  isMulti: false,
  sharePopup: false
}

const assetBucketBasketSlice = createSlice({
  name: "assetBucketBasketSlice",
  initialState,
  reducers: {
    setAssetBucketBasket: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      state.isOpen = payload.isOpen;
    },
    setMultiTimelineHover: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      state.isMulti = payload.isMulti;
    },
    setSharePopupStatus: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      state.sharePopup = payload.sharePopup;
    }
  }
});

export default assetBucketBasketSlice;
export const { setAssetBucketBasket: setAssetBucketBasket ,setMultiTimelineHover : setMultiTimelineHover, setSharePopupStatus: setSharePopupStatus} = assetBucketBasketSlice.actions;

