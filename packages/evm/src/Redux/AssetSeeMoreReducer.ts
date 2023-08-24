import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface assetSeeMore {
    status: boolean
}

const initialState: assetSeeMore = {
  status: true
}

const assetSeeMoreSlice = createSlice({
  name: "assetSeeMoreSlice",
  initialState,
  reducers: {
    setAssetSeeMore: (state: any, action: PayloadAction<any>) => {
      const {payload} = action;
      state.status = payload.status;
    }
  }
});

export default assetSeeMoreSlice;
export const { setAssetSeeMore: setAssetSeeMore} = assetSeeMoreSlice.actions;

