import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import VideosSelection from "./VideosSelection";
import { Switch } from "@mui/material";

interface VideoScreenProp {
  viewNumber?: number,
  timelinedetail: any[],
  settimelinedetail: any,
  mapEnabled: boolean,
  videoHandlers: any
}

const VideoScreen = ({ viewNumber, timelinedetail, settimelinedetail, mapEnabled, videoHandlers }: VideoScreenProp) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [indexNumber, setIndexNumber] = React.useState<number>(0);
  const [adjustSoundEnabled, setAdjustSoundEnabled] = React.useState<boolean>(true);


  const getVideo = (camIndexVideoData: any) => {
    if (camIndexVideoData !== undefined) {
      return (
        <video id={camIndexVideoData.id} width="100%" height="100%" preload="auto" crossOrigin="anonymous">
          <source src={camIndexVideoData.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    } else {
      return <div />;
    }
  }

  const adjustSound = (enableSound: boolean, id?: any) => {
    debugger;
    var videoHandle = videoHandlers.find((x: any) => x.id == id);
    if (videoHandle !== undefined) {
      setAdjustSoundEnabled(enableSound)
      if (enableSound) {
        videoHandle.muted = false;
      }
      else {
        videoHandle.muted = true;
      }
    }
  }

  const removeVideo = (indexNumber: any) => {
    var tempArray = [...timelinedetail];
    var tempItemToRemove = tempArray.find((x: any) => x.indexNumberToDisplay == indexNumber);
    if (tempItemToRemove !== undefined) {
      tempItemToRemove.enableDisplay = false;
      tempItemToRemove.indexNumberToDisplay = 0;
    }
    settimelinedetail(tempArray);
    setIndexNumber(0);
  };

  const getVideoTag = (CameraCount: number) => {
    //console.log(viewNumber)
    //poster="https://i.ibb.co/C0PqYN4/Media-Not-Available.png"

    let camIndex = CameraCount;
    var camIndexVideoData = timelinedetail.find((x: any) => x.indexNumberToDisplay == camIndex && x.enableDisplay);
    return (
      <div className="videoContainer">
        {getVideo(camIndexVideoData)}

        <div className="videoMenuCss" style={{ display: camIndex == 1 ? 'none' : 'block' }}>
          <Menu
            align="start"
            viewScroll="initial"
            direction="right"
            position="auto"
            arrow
            menuButton={
              <MenuButton>
                <i className="far fa-ellipsis-v"></i>
              </MenuButton>
            }
          >

            <MenuItem style={{ visibility: (indexNumber > 0) ? "hidden" : "visible" }}>
              <div className="crx-meu-content groupingMenu crx-spac" onClick={(event: any) => { setAnchorEl(event.currentTarget); setIndexNumber(camIndex) }}>
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  select video to view
                </div>
              </div>
            </MenuItem>
            <MenuItem >
              <div className="crx-meu-content groupingMenu crx-spac" onClick={() => removeVideo(camIndex)}>
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  Hide video from view
                </div>
              </div>
            </MenuItem>
            <MenuItem >
              <div className="crx-meu-content groupingMenu crx-spac" >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <Switch checked={adjustSoundEnabled} onChange={(event) => adjustSound(event.target.checked, camIndexVideoData?.id)} />
                  adjust sound
                </div>
              </div>
            </MenuItem>
          </Menu>


        </div>


      </div>
    );

  };
  return (
    <div id="video-player-screens">

      <Grid container>
        <Grid container xs={mapEnabled ? 9 : 12}>

          <Grid item spacing={3}
            xs={viewNumber == 1 ? 12 : viewNumber == 2 ? 6 : viewNumber == 3 ? 8 : viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}>
            {getVideoTag(1)}
          </Grid>



          <Grid item spacing={3}
            xs={viewNumber == 1 ? 1 : viewNumber == 2 ? 6 : viewNumber == 3 ? 4 : viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}>
            {getVideoTag(2)}
          </Grid>
          <Grid item
            xs={viewNumber == 3 ? 4 : viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}
            className={`${viewNumber == 2 ? "pictureViewGrid" : ""}`}>
            {getVideoTag(3)}
          </Grid>
          <Grid item xs={viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}>
            {getVideoTag(4)}
          </Grid>
          <Grid item xs={viewNumber == 6 ? 4 : 1}>
            {getVideoTag(5)}
          </Grid>
          <Grid item xs={viewNumber == 6 ? 4 : 1}>
            {getVideoTag(6)}
          </Grid>
        </Grid>
        <div className="mapContainerhh" style={{ display: `${mapEnabled ? "block" : "none"}` }}></div>
      </Grid>
      <VideosSelection timelinedetail={timelinedetail} settimelinedetail={settimelinedetail} anchorEl={anchorEl} setAnchorEl={setAnchorEl} indexNumber={indexNumber} />

    </div>
  );
};

export default VideoScreen;