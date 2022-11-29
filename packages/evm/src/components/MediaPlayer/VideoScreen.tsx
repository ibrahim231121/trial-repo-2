import React, {useState, useLayoutEffect } from "react";
import VideoPlayerFastFwRw from "./VideoPlayerFastFwRw";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import VideosSelection from "./VideosSelection";
import AssetDetailsPanel from "../../Application/Assets/Detail/AssetDetailsPanel";
import { useDispatch } from "react-redux";
import "../../Assets/css/animate.min.css";
import { addTimelineDetailActionCreator } from "../../Redux/VideoPlayerTimelineDetailReducer";
import VideoColumn from "./VideoColumn";
import { CRXTooltip, CBXSwitcher } from "@cb/shared";

interface VideoScreenProp {
  viewNumber?: number;
  timelinedetail: any[];
  mapEnabled: boolean;
  videoHandlers: any;
  setVideoHandlersFwRw: any;
  setvideoTimerFwRw: any;
  onClickVideoFwRw: any;
  isOpenWindowFwRw: boolean;
  data: any;
  evidenceId: any;
  setData: any;
  isPlaying: boolean;
  setupdateVideoSelection: any;
  onClickBookmarkNote: any;
  isMultiTimelineEnabled: boolean;
  updateSeekMarker: any;
  gMapApiKey: any;
  gpsJson: any;
  openMap: boolean;
  setOnMarkerClickTimeData: any;
  toasterMsgRef: any;
  isAudioGraph: any;
  ffScreenIcon ? : any
}

const VideoScreen = ({
  onClickBookmarkNote,
  isPlaying,
  viewNumber,
  timelinedetail,
  mapEnabled,
  videoHandlers,
  setVideoHandlersFwRw,
  setvideoTimerFwRw,
  onClickVideoFwRw,
  isOpenWindowFwRw,
  data,
  evidenceId,
  setData,
  setupdateVideoSelection,
  updateSeekMarker,
  gMapApiKey,
  gpsJson,
  openMap,
  setOnMarkerClickTimeData,
  isMultiTimelineEnabled,
  toasterMsgRef,
  isAudioGraph,
  ffScreenIcon,
}: VideoScreenProp) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [indexAnchorE1, setIndexAnchorE1] = React.useState<number>(0);
  const [indexNumber, setIndexNumber] = React.useState<number>(0);
  const [adjustSoundEnabled, setAdjustSoundEnabled] =
    React.useState<boolean>(true);
  const [layoutBaseClass, setLayoutBaseClass] = useState<string>("");
  const [videoLayoutResetHeight, setVideoLayoutResetHeight] =
    useState<string>("");
  const dispatch = useDispatch();
  const anchorRef = React.useRef<any>(null);
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

          {/* { isMultiTimelineEnabled && <div style={{backgroundColor:"black", color:"white", paddingLeft:"45%"}}>{camIndexVideoData.camera}</div> } */}
        </>
      );
    } else {
      
      return <div className="_empty_video"> </div>
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

  const getVideoTag = (CameraCount: number) => {
    //console.log(viewNumber)
    //poster="https://i.ibb.co/C0PqYN4/Media-Not-Available.png"

    let camIndex = CameraCount;
    var camIndexVideoData = timelinedetail.find(
      (x: any) => x.indexNumberToDisplay == camIndex && x.enableDisplay
    );
    
    const openSelectVideoPanel = (e : any) => {
      setAnchorEl(anchorEl ? null : anchorRef.current);
    }
    return (
      <div className="videoContainer">
       
        {getVideo(camIndexVideoData)}
        <div
          className={`videoMenuCss CRXVideoMultiView ${
            indexAnchorE1 == CameraCount ? "CRXCheckPopper" : ""
          }`}
          style={{ display: camIndex == 1 ? "none" : "block" }}
        >
          <Menu
            align="center"
            viewScroll="initial"
            direction="left"
            position="auto"
            arrow={false}
            menuButton={
              <MenuButton className="_select_video_button">
                <CRXTooltip
                  className="CRXTooltipMultiView"
                  placement="bottom"
                  iconName="far fa-ellipsis-v"
                  title="actions"
                  arrow={false}
                />
              </MenuButton>
            }
          >
            <MenuItem
              style={{ visibility: indexNumber > 0 ? "hidden" : "visible" }}
            >
              <div
                className="crx-meu-content groupingMenu crx-spac"
                ref={anchorRef}
                aria-haspopup="false"
                onClick={(event: any) => {
                  openSelectVideoPanel(event)
                  setIndexAnchorE1(CameraCount);
                  setIndexNumber(camIndex);
                }}
              >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <div>Select video to view</div>{" "}
                  <div className="CRXVideoViewArrow">
                    <i className="fas fa-chevron-right" />
                  </div>
                </div>
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
                  <div>Audio</div>
                  <div>
                    <CBXSwitcher
                      checked={adjustSoundEnabled}
                      size="small"
                      theme="dark"
                      onChange={(event: any) =>
                        adjustSound(event.target.checked, camIndexVideoData?.id)
                      }
                    />
                  </div>
                </div>
              </div>
            </MenuItem>
          </Menu>
          <VideosSelection
          timelinedetail={timelinedetail}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setIndexAnchorE1={setIndexAnchorE1}
          indexNumber={indexNumber}
          setupdateVideoSelection={setupdateVideoSelection}
          anchorRef={anchorRef}
        />
        </div>
        
      </div>
    );
  };

  const CrateLayoutbaseClass = () => {
    if (viewNumber == 3) {
      setLayoutBaseClass(" _container_column_dir");
      setVideoLayoutResetHeight("");
    } else if (viewNumber == 4) {
      setLayoutBaseClass("_container_column_video_4");
      setVideoLayoutResetHeight("");
    } else if (viewNumber == 6) {
      setLayoutBaseClass("_container_column_video_6");
      setVideoLayoutResetHeight("_reset_player_height");
    } else if(viewNumber == 2) {
      setLayoutBaseClass("_container_column_video_2");
    }else {
      setLayoutBaseClass("");
      setVideoLayoutResetHeight("");
    }
  };
  useLayoutEffect(() => {
    CrateLayoutbaseClass();
  }, [viewNumber]);

  
  return (
    <div
      id="video-player-screens"
      className={`${videoLayoutResetHeight} ${
        !isAudioGraph ? "_videPlayer_height_AU" : ""
      } ${mapEnabled ? " _contaoner_flex" : ""}`}
    >
      <div
        className={`_video_player_grid _videoPlayer_grid_customize ${
          mapEnabled ? " _contaoner_75 " : "_video_all_player_center  _setVideoOnScreenRes"
        } ${layoutBaseClass}`}
      >
        <VideoColumn
          className=""
          sx={
            viewNumber == 1
              ? 12
              : viewNumber == 2
              ? 6
              : viewNumber == 3
              ? 8
              : viewNumber == 4
              ? 6
              : viewNumber == 6
              ? 4
              : 1
          }
        >
          {getVideoTag(1)}
        </VideoColumn>
      
      {viewNumber && viewNumber == 3 ? <div className="_video_grid_col vid_col_4"> 
        <div className="viewOnSideVideos">
          {getVideoTag(2)}
        </div>

        <div className="viewOnSideVideos">
          {getVideoTag(3)}
        </div>
      </div> :  <VideoColumn
          className=""
          sx={
            viewNumber == 1
              ? 1
              : viewNumber == 2
              ? 6
              : viewNumber == 4
              ? 6
              : viewNumber == 6
              ? 4
              : 1
          }
        >
          {getVideoTag(2)}
        </VideoColumn>}    
        
         {viewNumber && viewNumber == 6 ? <VideoColumn className="" sx={4}>
          {getVideoTag(3)}
        </VideoColumn> : ""}     
        <VideoColumn
          className=""
          sx={viewNumber == 4 ? 6 : viewNumber == 6 ? 4 : 1}
        >
          {getVideoTag(4)}
        </VideoColumn>

        <VideoColumn className="" sx={viewNumber == 6 ? 4 : viewNumber == 4
              ? 6 : 1}>
          {getVideoTag(5)}
        </VideoColumn>

        <VideoColumn className="" sx={viewNumber == 6 ? 4 : 1}>
          {getVideoTag(6)}
        </VideoColumn>

        {isOpenWindowFwRw && (
          <VideoPlayerFastFwRw
            videoData={timelinedetail}
            setVideoHandlersFwRw={setVideoHandlersFwRw}
            setvideoTimerFwRw={setvideoTimerFwRw}
            onClickVideoFwRw={onClickVideoFwRw}
            ffScreenIcon={ffScreenIcon}
          />
        )}
        
      </div>
      
      {mapEnabled && (
        <div className="_video_Player_Right_Panel">
          <div className="_panel_resize_bar"></div>
          <AssetDetailsPanel
            data={data}
            evidenceId={evidenceId}
            setData={setData}
            onClickBookmarkNote={onClickBookmarkNote}
            updateSeekMarker={updateSeekMarker}
            gMapApiKey={gMapApiKey}
            gpsJson={gpsJson}
            openMap={openMap}
            setOnMarkerClickTimeData={setOnMarkerClickTimeData}
            toasterMsgRef={toasterMsgRef}
          />
        </div>
      )}
     
    </div>
  );
};

export default VideoScreen;
