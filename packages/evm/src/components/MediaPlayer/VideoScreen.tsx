import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import VideoPlayerFastFwRw from "./VideoPlayerFastFwRw";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import VideosSelection from "./VideosSelection";
import { GridList, Switch } from "@material-ui/core";
import "../../Assets/css/animate.min.css"
import AssetDetailsPanel from "../../Application/Assets/Detail/AssetDetailsPanel";


interface VideoScreenProp {
  viewNumber?: number,
  timelinedetail: any[],
  settimelinedetail: any,
  mapEnabled: boolean,
  videoHandlers: any,
  setVideoHandlersFwRw: any,
  setvideoTimerFwRw: any,
  onClickVideoFwRw: any,
  isOpenWindowFwRw: boolean,
  data:any,
  evidenceId:any,
  setData:any,
  isPlaying :boolean
  setupdateVideoSelection: any
  onClickBookmarkNote:any,
  isMultiTimelineEnabled : boolean,
  updateSeekMarker:any
  gMapApiKey: any
  gpsJson: any
  openMap:boolean
  setOnMarkerClickTimeData:any
}

const VideoScreen = ({onClickBookmarkNote,isPlaying, viewNumber, timelinedetail, settimelinedetail, mapEnabled, videoHandlers, setVideoHandlersFwRw, setvideoTimerFwRw, onClickVideoFwRw, isOpenWindowFwRw,data, evidenceId,setData,setupdateVideoSelection,updateSeekMarker,gMapApiKey,gpsJson,openMap,setOnMarkerClickTimeData,isMultiTimelineEnabled  }: VideoScreenProp) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [indexNumber, setIndexNumber] = React.useState<number>(0);
  const [adjustSoundEnabled, setAdjustSoundEnabled] =
    React.useState<boolean>(true);
  
  const getVideo = (camIndexVideoData: any) => {
    if (camIndexVideoData !== undefined) {
      return (
        <>
          <video
            id={camIndexVideoData.id}
            width="100%"
            height="100%"
            preload="auto"
            crossOrigin="anonymous"
          >
            <source src={camIndexVideoData.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

        { isMultiTimelineEnabled && <div style={{backgroundColor:"black", color:"white", paddingLeft:"45%"}}>{camIndexVideoData.camera}</div> }
        </>
      );
    } else {
      return <div />;
    }
  };

  const adjustSound = (enableSound: boolean, id?: any) => {
    var videoHandle = videoHandlers.find((x: any) => x.id == id);
    if (videoHandle !== undefined) {
      setAdjustSoundEnabled(enableSound);
      if (enableSound) {
        videoHandle.muted = false;
      } else {
        videoHandle.muted = true;
      }
    }
  };

  const removeVideo = (indexNumber: any) => {
    var tempArray = [...timelinedetail];
    var tempItemToRemove = tempArray.find(
      (x: any) => x.indexNumberToDisplay == indexNumber
    );
    if (tempItemToRemove !== undefined) {
      tempItemToRemove.enableDisplay = false;
      tempItemToRemove.indexNumberToDisplay = 0;
      setupdateVideoSelection(true);
    }
    settimelinedetail(tempArray);
    setIndexNumber(0);
  };

  useEffect(() => {
    const playBtn = document.getElementById("_video_play");
    const pauseBtn = document.getElementById("_video_pause")

    if(isPlaying === true) {
      
      playBtn?.classList.remove("zoomOut")
      playBtn?.classList.add("zoomIn")
      setTimeout(() => {
        playBtn?.classList.remove("zoomIn")
        playBtn?.classList.add("zoomOut")
      },1200);

    }else {

      pauseBtn?.classList.remove("zoomOut")
      pauseBtn?.classList.add("zoomIn")
      setTimeout(() => {
        pauseBtn?.classList.remove("zoomIn")
        pauseBtn?.classList.add("zoomOut")
      },1200)
    
    }
   },[isPlaying])

  const getVideoTag = (CameraCount: number) => {
    //console.log(viewNumber)
    //poster="https://i.ibb.co/C0PqYN4/Media-Not-Available.png"
    
    let camIndex = CameraCount;
    var camIndexVideoData = timelinedetail.find(
      (x: any) => x.indexNumberToDisplay == camIndex && x.enableDisplay
    );

   

    return (
      <div className="videoContainer">
        <div className="videoFrontLayer">
          
            {isPlaying ? (
             
              <div 
              id="_video_play" 
              className={`video_play_onScreen _video_button_size animated`}>
                <PlayButton />
              </div>
             
            ) : (
             
              <div 
              id="_video_pause" 
              className={`video_pause_onScreen _video_button_size animated`}>
                <PauseButton />
              </div>
             
            )}
          
        </div>
        {getVideo(camIndexVideoData)}

        <div
          className="videoMenuCss"
          style={{ display: camIndex == 1 ? "none" : "block" }}
        >
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
            <MenuItem
              style={{ visibility: indexNumber > 0 ? "hidden" : "visible" }}
            >
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={(event: any) => {
                  setAnchorEl(event.currentTarget);
                  setIndexNumber(camIndex);
                }}
              >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">select video to view</div>
              </div>
            </MenuItem>
            <MenuItem>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={() => removeVideo(camIndex)}
              >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">Hide video from view</div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="crx-meu-content groupingMenu crx-spac">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <Switch
                    checked={adjustSoundEnabled}
                    onChange={(event) =>
                      adjustSound(event.target.checked, camIndexVideoData?.id)
                    }
                  />
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
      <Grid container className="_videoPlayer_grid_customize">
        <Grid  className="_videoPlayer_grid_customize" container xs={mapEnabled ? 9 : 12}>
          <Grid
            item
            spacing={3}
            xs={
              viewNumber == 1
                ? 12 : viewNumber == 2 ? 6: viewNumber == 3 ? 8: viewNumber == 4 ? 6: viewNumber == 6 ? 4: 1} 
            className="_videoPlayer_grid_customize"
          >
            {getVideoTag(1)}
          </Grid>

          <Grid
            item
            spacing={3}
            className="_videoPlayer_grid_customize"
            xs={
              viewNumber == 1
                ? 1
                : viewNumber == 2
                ? 6
                : viewNumber == 3
                ? 4
                : viewNumber == 4
                ? 6
                : viewNumber == 6
                ? 4
                : 1
            }
          >
            {getVideoTag(2)}
          </Grid>
          <Grid
            item
            
            xs={
              viewNumber == 3
                ? 4: viewNumber == 4 ? 6: viewNumber == 6 ? 4: 1
            }
            className={`_videoPlayer_grid_customize ${viewNumber == 2 ? "pictureViewGrid" : ""}`}
          >
            {getVideoTag(3)}
          </Grid>
          <Grid className="_videoPlayer_grid_customize" item xs={viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}>
            {getVideoTag(4)}
          </Grid>
          <Grid  className="_videoPlayer_grid_customize" item xs={viewNumber == 6 ? 4 : 1}>
            {getVideoTag(5)}
          </Grid>
          <Grid className="_videoPlayer_grid_customize" item xs={viewNumber == 6 ? 4 : 1}>
            {getVideoTag(6)}
          </Grid>
        </Grid>
        {isOpenWindowFwRw && <VideoPlayerFastFwRw videoData={timelinedetail} setVideoHandlersFwRw={setVideoHandlersFwRw} setvideoTimerFwRw={setvideoTimerFwRw} onClickVideoFwRw={onClickVideoFwRw}/>}
        {mapEnabled && <div className="_video_Player_Right_Panel">
          <AssetDetailsPanel data={data} evidenceId={evidenceId} setData={setData}  onClickBookmarkNote={onClickBookmarkNote} updateSeekMarker={updateSeekMarker} gMapApiKey={gMapApiKey} gpsJson={gpsJson} openMap={openMap} setOnMarkerClickTimeData={setOnMarkerClickTimeData} />
        </div>}
      </Grid>
      <VideosSelection
        timelinedetail={timelinedetail}
        settimelinedetail={settimelinedetail}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        indexNumber={indexNumber}
        setupdateVideoSelection={setupdateVideoSelection}
      />
    </div>
  );
};


const PlayButton = () => {
  return (
    <div className="video_playButton">
      <i className="icon icon-play4"></i>
    </div>
  )
}


const PauseButton = () => {
  return (
    <div className="video_PauseButton">
      <i className="icon icon-pause2"></i>
    </div>
  )
}

export default VideoScreen;
