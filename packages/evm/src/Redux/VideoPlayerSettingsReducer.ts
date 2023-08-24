import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface primaryVideoSoftReload {
  assetId: string,
  assetName: string,
  needReload: boolean
}

interface VideoPlayerSettings {
  assetDetailBottomTabs: boolean,
  primaryVideoSoftReload: primaryVideoSoftReload
}

const initialState: VideoPlayerSettings = {
  assetDetailBottomTabs: false,
  primaryVideoSoftReload: {
    assetId: "0",
    assetName: "",
    needReload: false
  }
}

const VideoPlayerSettingsSlice = createSlice({
  name: "VideoPlayerSettingsSlice",
  initialState,
  reducers: {
    setAssetDetailBottomTabs: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      state.assetDetailBottomTabs = payload.assetDetailBottomTabs;
    },
    changePrimaryVideoSoftReload: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      state.primaryVideoSoftReload = payload.primaryVideoSoftReload;
    }
  }
});

export default VideoPlayerSettingsSlice;
export const { setAssetDetailBottomTabs: setAssetDetailBottomTabs, changePrimaryVideoSoftReload: changePrimaryVideoSoftReload } = VideoPlayerSettingsSlice.actions;