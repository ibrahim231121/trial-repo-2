import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface assetBucketBasket {
    isOpen: boolean
}

const initialState: assetBucketBasket = {
  isOpen: false
}

const assetBucketBasketSlice = createSlice({
  name: "assetBucketBasketSlice",
  initialState,
  reducers: {
    setAssetBucketBasket: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      state.isOpen = payload.isOpen;
    }
  }
});

export default assetBucketBasketSlice;
export const { setAssetBucketBasket: setAssetBucketBasket} = assetBucketBasketSlice.actions;

