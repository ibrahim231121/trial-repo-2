import React, { useEffect, useState, useLayoutEffect } from "react";
import Grid from "@material-ui/core/Grid";
import VideoPlayerFastFwRw from "./VideoPlayerFastFwRw";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import VideosSelection from "./VideosSelection";
import { GridList, Switch } from "@material-ui/core";
import AssetDetailsPanel from "../../Application/Assets/Detail/AssetDetailsPanel";
import { useDispatch } from "react-redux";
import { addTimelineDetailActionCreator } from "../../Redux/VideoPlayerTimelineDetailReducer";
import VideoColumn from "./VideoColumn"

interface VideoScreenProp {
  viewNumber?: number,
  timelinedetail: any[],
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
  toasterMsgRef: any,
  isAudioGraph : any
}

const VideoScreen = ({onClickBookmarkNote,isPlaying, viewNumber, timelinedetail, mapEnabled, videoHandlers, setVideoHandlersFwRw, setvideoTimerFwRw, onClickVideoFwRw, isOpenWindowFwRw,data, evidenceId,setData,setupdateVideoSelection,updateSeekMarker,gMapApiKey,gpsJson,openMap,setOnMarkerClickTimeData,isMultiTimelineEnabled,toasterMsgRef, isAudioGraph  }: VideoScreenProp) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [indexNumber, setIndexNumber] = React.useState<number>(0);
  const [adjustSoundEnabled, setAdjustSoundEnabled] = React.useState<boolean>(true);
  const [layoutBaseClass, setLayoutBaseClass] = useState<string>("");
  const [videoLayoutResetHeight, setVideoLayoutResetHeight] = useState<string>("")
  const dispatch = useDispatch();
  
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
      return <div className="_empty_video">  </div>;
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
    var tempArray = JSON.parse(JSON.stringify(timelinedetail));
    var tempItemToRemove = tempArray.find(
      (x: any) => x.indexNumberToDisplay == indexNumber
    );
    if (tempItemToRemove !== undefined) {
      tempItemToRemove.enableDisplay = false;
      tempItemToRemove.indexNumberToDisplay = 0;
      setupdateVideoSelection(true);
    }
    dispatch(addTimelineDetailActionCreator(tempArray));
    setIndexNumber(0);
  };

  useLayoutEffect(() => {
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
            arrow = {false}
            menuButton={
              <MenuButton className="_select_video_button">
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
  
  
  const CrateLayoutbaseClass = () => {
    
      if(viewNumber == 3) {
        setLayoutBaseClass(" _container_column_dir")
        setVideoLayoutResetHeight("")
      }else if(viewNumber == 4) {
        setLayoutBaseClass("_container_column_video_4")
        setVideoLayoutResetHeight("")
      }else if (viewNumber == 6) {
        setLayoutBaseClass("_container_column_video_6")
        setVideoLayoutResetHeight("_reset_player_height")
      }else {
        setLayoutBaseClass("")
        setVideoLayoutResetHeight("")
      }
  }
  useLayoutEffect(() => {
    CrateLayoutbaseClass()
  },[viewNumber])


  return (
    <div id="video-player-screens" className={`${videoLayoutResetHeight} ${!isAudioGraph ? "_videPlayer_height_AU" : "" } ${mapEnabled ? " _contaoner_flex" : ""}`}>
     
     <div className={ `_video_player_grid _videoPlayer_grid_customize ${mapEnabled ? " _contaoner_75 " : ""} ${layoutBaseClass}`}>
        <VideoColumn 
        className=""
        sx={
          viewNumber == 1
          ? 12 : viewNumber == 2 ? 6: viewNumber == 3 ? 8: viewNumber == 4 ? 6: viewNumber == 6 ? 4: 1
        }
        >
          {getVideoTag(1)}
        </VideoColumn>
        
        
        <VideoColumn className=""
        sx={
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
        </VideoColumn>
        
        <VideoColumn className="" 
          sx={ viewNumber == 3 ? 4: viewNumber == 4 ? 6: viewNumber == 6 ? 4: 1}>
          {getVideoTag(3)}
        </VideoColumn>
        
        
        <VideoColumn className="" sx={viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}>
          {getVideoTag(4)}
        </VideoColumn>
        
        <VideoColumn className="" sx={viewNumber == 6 ? 4 : 1}>
          {getVideoTag(5)}
        </VideoColumn>
        
        <VideoColumn className="" sx={viewNumber == 6 ? 4 : 1}>
          {getVideoTag(6)}
        </VideoColumn>
        </div>
        {isOpenWindowFwRw && <VideoPlayerFastFwRw videoData={timelinedetail} setVideoHandlersFwRw={setVideoHandlersFwRw} setvideoTimerFwRw={setvideoTimerFwRw} onClickVideoFwRw={onClickVideoFwRw}/>}
        {mapEnabled && <div className="_video_Player_Right_Panel">
          <AssetDetailsPanel data={data} evidenceId={evidenceId} setData={setData}  onClickBookmarkNote={onClickBookmarkNote} updateSeekMarker={updateSeekMarker} gMapApiKey={gMapApiKey} gpsJson={gpsJson} openMap={openMap} setOnMarkerClickTimeData={setOnMarkerClickTimeData} toasterMsgRef={toasterMsgRef}/>
        </div>}

      
      <VideosSelection
        timelinedetail={timelinedetail}
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
