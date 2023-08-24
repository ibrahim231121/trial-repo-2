import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AssetDetailPrimaryBreadcrumb {
  isPrimaryAsset: boolean
}

const initialState: AssetDetailPrimaryBreadcrumb = {
  isPrimaryAsset: false
}

const AssetDetailPrimaryBreadcrumbSlice = createSlice({
  name: "AssetDetailPrimaryBreadcrumbSlice",
  initialState,
  reducers: {
    setIsPrimaryAsset: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      state.isPrimaryAsset = payload.isPrimaryAsset;
    }
  }
});

export default AssetDetailPrimaryBreadcrumbSlice;
export const { setIsPrimaryAsset: setIsPrimaryAsset } = AssetDetailPrimaryBreadcrumbSlice.actions;