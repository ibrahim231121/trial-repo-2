import React, { useEffect, useState } from "react";
//import ColorSlider from 'multicolorslider'
import "./Timeline.scss"
import "./VideoPlayer.scss"
import {CRXTooltip} from "@cb/shared";
import { ContactSupportOutlined } from "@material-ui/icons";
import { render } from "@testing-library/react";
import Buffering from "./Buffering";
import DynamicThumbnail from "./DynamicThumbnail";
import moment from "moment";
import { setMultiTimelineHover } from "../../Redux/assetBucketBasketSlice";
import { useDispatch } from "react-redux";
import { Timeline } from "./VideoPlayerBase";

interface Timelineprops {
  timelinedetail: Timeline[]
  visibleThumbnail: any
  setVisibleThumbnail: any
  isMultiViewEnable: boolean
  displayThumbnail: any
  onClickBookmarkNote: any
  openThumbnail: boolean
  mouseovertype: any
  timelinedetail1: any
  mouseOverBookmark: any
  mouseOverNote: any
  mouseOut: any
  Event: any
  getbookmarklocation: any
  AdjustTimeline: any
  startTimelineSync: any
  multiTimelineEnabled: boolean
  notesEnabled: boolean
  syncButton: boolean
  thumbnailAddPip: boolean;
  viewNumber: number;
  mouseOverRecordingStart: any;
  mouseOverRecordingEnd: any;
}


const Timelines = ({ timelinedetail, visibleThumbnail, setVisibleThumbnail, isMultiViewEnable, displayThumbnail, onClickBookmarkNote, openThumbnail, mouseovertype, timelinedetail1, mouseOverBookmark, mouseOverNote, mouseOut, Event, getbookmarklocation, AdjustTimeline, startTimelineSync, multiTimelineEnabled, notesEnabled,syncButton, thumbnailAddPip, viewNumber, mouseOverRecordingStart, mouseOverRecordingEnd }: Timelineprops,) => {


  const [showSeekBar,setShowSeekBar] = useState(false);
  const refStyle = React.useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (openThumbnail && Event && timelinedetail1) {
      if (mouseovertype == "bookmark") {
        displayThumbail(Event, timelinedetail1.id, "Bookmark");
      }
      else if (mouseovertype == "note") {
        displayThumbail(Event, timelinedetail1.id, "Note");
      }
      else if (mouseovertype == "recordingstart") {
        displayThumbail(Event, timelinedetail1.id, "Recording Started");
      }
      else if (mouseovertype == "recordingend") {
        displayThumbail(Event, timelinedetail1.id, "Recording Ended");
      }
    }
    else {
       removeThumbnail();
    }

  }, [openThumbnail]);


  const displayThumbail = (event: any, id: any, withdescription?: string) => {
    var x = timelinedetail.find((x: any) => x.id == id)
    var index = x?.indexNumberToDisplay ?? 0;
    setVisibleThumbnail([...visibleThumbnail, index]);
    if (withdescription) {
      displayThumbnail(event, x, false, withdescription, event.target.classList.contains("mainTimelinePipIcons"))
    }
    else {
      displayThumbnail(event, x, false, undefined, event.target.classList.contains("mainTimelinePipIcons"))
    }


  }
  const removeThumbnail = () => {
     setVisibleThumbnail([]);
  }

  // React.useLayoutEffect(() => {
  //   let ThumbnailDesc = document.getElementById("Thumbnail-Desc");
     
  //   if (ThumbnailDesc) {
  //     document.getElementById("thumbnailHeaderBar")?.classList.add("showHeaderBar")
  //     document.getElementById("thumbnailHeaderBar")?.classList.remove("hideHeaderBar")

  //   } else {
  //     document.getElementById("thumbnailHeaderBar")?.classList.add("hideHeaderBar")
  //     document.getElementById("thumbnailHeaderBar")?.classList.remove("showHeaderBar")
  //   }
  // }, [visibleThumbnail])


  const setShowSeekBarMove = (e: any) => {
    setShowSeekBar(true);
    let _beforeline_Main: any = document.querySelector("._beforeline_Main");
    let _beforeline_MainOffset = _beforeline_Main?.getBoundingClientRect().left;
    let multiMouseMove = e.pageX - _beforeline_MainOffset;
    multiMouseMove < 0 ? setShowSeekBar(false) :setShowSeekBar(true);

    if(refStyle.current){
      refStyle.current.style.left = (multiMouseMove > 0 ? multiMouseMove : 0) + "px";
    }

  }

  const setShowSeekBarLeave = () => {
    setShowSeekBar(false)
  document?.querySelector(".crx_video_player")?.classList.remove("multiTimeLineHover");
  dispatch(setMultiTimelineHover({ isMulti: false }));


  }
const enabledTimeline_bar =   timelinedetail.filter((x: any) => x.enableDisplay);
const syncButtonClass = syncButton ? "syncButton_Disabled" : "syncButton_Enabled";
const SyncClass = startTimelineSync ? "startTimelineSync" : "stopTimelineSync";

const multiTimelineEnter = () => {
  document?.querySelector(".crx_video_player")?.classList.add("multiTimeLineHover");
  dispatch(setMultiTimelineHover({ isMulti: true }));
}

const callFunction = (event: any, tempTimeLine : Timeline, obj : any, type: string) => {
  if(obj.description == "Recording started"){
    mouseOverRecordingStart(event, tempTimeLine.recording_start_point, tempTimeLine)
  }
  else if(obj.description == "Recording stopped"){
    mouseOverRecordingEnd(event, tempTimeLine.recording_start_point, tempTimeLine)
  }
  else{
    if(type == "bookmark"){
      mouseOverBookmark(event, obj, tempTimeLine)
    }
    else if(type == "note"){
      mouseOverNote(event, obj, tempTimeLine)
    }
  }
}

const thumbnailPipClass = thumbnailAddPip ? "thumbnailPipEnabled" : "thumbnailPipDisabled"; 

  return (
    <div id="multiTimeLine_Id"  >
    <div id={SyncClass} className={multiTimelineEnabled ? "_beforeline_Main" : "" } onMouseEnter={() => multiTimelineEnter()} onMouseMove={(e)=> {setShowSeekBarMove(e)}} onMouseLeave={()=> {setShowSeekBarLeave()}} >
      {(multiTimelineEnabled  && showSeekBar ) && <div ref={refStyle} id="seekBar_multiTimeLine_view" className={`enabledTimeline_bar_${enabledTimeline_bar.length}`}>
      </div> }
      {/* {multiTimelineEnabled && <div className="scroll_to_see_timeline">scroll to see multiple timelines</div>} */}
      {timelinedetail.filter((x: Timeline) => x.enableDisplay).sort((a, b) => a.indexNumberToDisplay - b.indexNumberToDisplay).map((x: Timeline, i:any) =>
  
        <div className={"time_line_container " + "multiTimelineNumber" + x.indexNumberToDisplay}>
          <div className={`_before_line ${thumbnailPipClass}`}>
            <div className="line"  style={{ position: "relative", display: 'flex' }} >
              <div className="video_player_hover_thumb" id={"video_player_hover_thumb" + x.indexNumberToDisplay}
                style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", transform: "translate(-50px, 0px)" }}>
              <div id="thumbnailHeaderBar">
              {openThumbnail && <div className="thumbnailHeaderBar" >
                    {openThumbnail && <div className="_timeline_icon_top_area" id={"Thumbnail-Icon" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}></div>}
                    {openThumbnail && <p id={"Thumbnail-Desc" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", color: "white", background: "black" }}></p>}
                  </div> }
                  {(openThumbnail == false) && (viewNumber > 1) && <div className="_timeline_thumb_top_area" id={"Thumbnail-CameraDesc" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}>{x.camera !== null ? x.camera : "N/A"}</div>}
                </div>
                <video
                  width="128px"
                  height="100%"
                  id={"Thumbnail" + x.indexNumberToDisplay}
                >
                  <source src={x.src} type="video/mp4" />
                </video>
                <div className="video_thumb_line_time" id={"Thumbnail-Time" + x.indexNumberToDisplay}></div>
                
                
              </div>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.bookmarks && multiTimelineEnabled && x.bookmarks.map((y: any, index: any) =>
                  <div className="time_line_bookMarks">

                    <div className="bookmarkLines" aria-hidden="true"
                      style={{left: getbookmarklocation(y.position, x.recording_start_point, x) }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => callFunction(e, x , y, "bookmark")} onClick={() => onClickBookmarkNote(y, 1)}>

                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {notesEnabled && x.notes && multiTimelineEnabled && x.notes.map((y: any) =>
                  <div>
                    <i className="fas fa-sticky-note"
                      style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point, x), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => callFunction(e, x , y, "note")} onClick={() => onClickBookmarkNote(y, 2)}>
                    </i>
                  </div>
                )}
              </div>
              {startTimelineSync && <div className="buffer_btn_container" style ={{position : "absolute", left: x.recording_Start_point_ratio + '%'}} 
              onMouseOver={(e: any) => displayThumbail(e, x.id)}
              onMouseMove={(e: any) => displayThumbail(e, x.id)}
              onMouseOut={() => removeThumbnail()}>
                  <div className="buffer_left_btn">
                      <button className="buffer_button bufferArrowSingle_1" type="button" style={{ left: x.recording_Start_point_ratio + 2 + '%', position: "relative"}} onClick={(e: any) => AdjustTimeline(e, x, -1000)}>
                        <CRXTooltip
                        iconName={"fas fa-chevron-left"}
                        className="tooltip_sync_button "
                        placement="right"
                        title={"move 100 milliseconds back"}
                        arrow={false}
                      />
                        </button>
                      <button className="buffer_button bufferArrowDouble_1" type="button" style={{ left: x.recording_Start_point_ratio + 5 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, -100)}>
                        <CRXTooltip
                          iconName={"fas fa-chevrons-left"}
                          className="tooltip_sync_button "
                          placement="right"
                          title={"move 1 second back"}
                          arrow={false}
                        />
                        </button>
                  </div>
                  <div className="buffer_left_btn">
                        <button className="buffer_button  bufferArrowDouble_2" type="button" style={{ left: x.recording_Start_point_ratio + 8 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, 100)}>
                        <CRXTooltip
                          iconName={"fas fa-chevrons-right"}
                          className="tooltip_sync_button "
                          placement="right"
                          title={"move 1 second forward"}
                          arrow={false}
                        />
                        </button>
                       <button className="buffer_button bufferArrowSingle_2" type="button" style={{ left: x.recording_Start_point_ratio + 11 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, 1000)}>
                         <CRXTooltip
                          iconName={"fas fa-chevron-right"}
                          className="tooltip_sync_button "
                          placement="right"
                          title={"move 100 milliseconds forward"}
                          arrow={false}
                        />
                         </button>
                  </div>
                </div>}
              {isMultiViewEnable && <div className={`beforerecording ${syncButtonClass}_Before`} style={{ width: x.recording_Start_point_ratio + '%', height: multiTimelineEnabled ? '20px' : "0", display: 'flex' }} id={"timeLine-hover-before" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
              ></div>}
              {isMultiViewEnable && <><div className="canvas-width"
                style={{ backgroundColor: '#333', width: x.recordingratio + '%', height: multiTimelineEnabled ? '20px' : "0", display: 'flex'}}
                id={"timeLine-hover" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                onMouseOver={(e: any) => displayThumbail(e, x.id)}
                onMouseMove={(e: any) => displayThumbail(e, x.id)}
                onMouseOut={() => removeThumbnail()}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
               
              </div>
              </>
              }
              {isMultiViewEnable &&
                <div className={`afterrecording ${syncButtonClass}_After `} style={{ width: (x.recording_end_point_ratio) + "%", height: multiTimelineEnabled ? '20px' : "0", display: 'flex'}} id={"timeLine-hover-after" + x.indexNumberToDisplay}
                  onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                ></div>
              }
            </div>
          </div>
        </div>
      )}
    {/* <div className="video_pointer_line"></div> */}
    </div>
    </div>
  )

};

export default Timelines

