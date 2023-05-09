import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface VideoPlayerSettings {
  assetDetailBottomTabs: boolean
}

const initialState: VideoPlayerSettings = {
  assetDetailBottomTabs: false
}

const VideoPlayerSettingsSlice = createSlice({
  name: "VideoPlayerSettingsSlice",
  initialState,
  reducers: {
    setAssetDetailBottomTabs: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      state.assetDetailBottomTabs = payload.assetDetailBottomTabs;
    }
  }
});

export default VideoPlayerSettingsSlice;
export const { setAssetDetailBottomTabs: setAssetDetailBottomTabs } = VideoPlayerSettingsSlice.actions;