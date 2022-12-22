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

interface Timelineprops {
  timelinedetail: any[]
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
}


const Timelines = ({ timelinedetail, visibleThumbnail, setVisibleThumbnail, isMultiViewEnable, displayThumbnail, onClickBookmarkNote, openThumbnail, mouseovertype, timelinedetail1, mouseOverBookmark, mouseOverNote, mouseOut, Event, getbookmarklocation, AdjustTimeline, startTimelineSync, multiTimelineEnabled, notesEnabled,syncButton }: Timelineprops,) => {


  const [showSeekBar,setShowSeekBar] = useState(false);
  const refStyle = React.useRef<HTMLDivElement>(null);


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
      displayThumbnail(event, x, false, withdescription)
    }
    else {
      displayThumbnail(event, x, false)
    }


  }
  const removeThumbnail = () => {
    setVisibleThumbnail([]);
  }

  React.useLayoutEffect(() => {
    let ThumbnailDesc = document.getElementById("Thumbnail-Desc");
     
    if (ThumbnailDesc) {
      document.getElementById("thumbnailHeaderBar")?.classList.add("showHeaderBar")
      document.getElementById("thumbnailHeaderBar")?.classList.remove("hideHeaderBar")

    } else {
      document.getElementById("thumbnailHeaderBar")?.classList.add("hideHeaderBar")
      document.getElementById("thumbnailHeaderBar")?.classList.remove("showHeaderBar")
    }
  }, [visibleThumbnail])

  useEffect(() => {
    document.addEventListener('mousemove',function(e){
      let x = e.pageX ;
      if(refStyle.current  ) {
        const leftSide = refStyle.current.style.left = (x) + "px" ;
        if(leftSide < "-10px") {
          setShowSeekBar(false);
        }
      } 
  
     });

  });

const enabledTimeline_bar =   timelinedetail.filter((x: any) => x.enableDisplay);
const syncButtonClass = syncButton ? "syncButton_Disabled" : "syncButton_Enabled";
  return (
    <div className="_beforeline_Main" onMouseMove={()=> {setShowSeekBar(true)}} onMouseLeave={()=> {setShowSeekBar(false)}} >
      {(multiTimelineEnabled && showSeekBar) && <div ref={refStyle} id="seekBar_multiTimeLine_view" className={`enabledTimeline_bar_${enabledTimeline_bar.length}`}>
      </div> }
      {multiTimelineEnabled && <div className="scroll_to_see_timeline">scroll to see multiple timelines</div>}
      {timelinedetail.filter((x: any) => x.enableDisplay).sort((a, b) => a.indexNumberToDisplay - b.indexNumberToDisplay).map((x: any, i:any) =>
        
        <div className="time_line_container" >
          <div className="_before_line">
            <div className="line"  style={{ position: "relative", display: 'flex' }} >
             {multiTimelineEnabled && <div className="camraName_timeline">{x.camera}</div> }  
             
              <div className="video_player_hover_thumb" id={"video_player_hover_thumb" + x.indexNumberToDisplay}
                style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", transform: "translate(-50px, 0px)" }}>
              <div id="thumbnailHeaderBar">
                  <div className="thumbnailHeaderBar" >
                    {openThumbnail && <div className="_timeline_icon_top_area" id={"Thumbnail-Icon" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}></div>}
                    {openThumbnail && <p id={"Thumbnail-Desc"} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", color: "white", background: "black" }}></p>}
                  </div>
                </div>
                {/* <div className="_timeline_thumb_top_area" id={"Thumbnail-CameraDesc" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}></div> */}
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

                    <i className="fa fa-bookmark" aria-hidden="true"
                      style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverBookmark(e, y, x)} onClick={() => onClickBookmarkNote(y, 1)}>

                    </i>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {notesEnabled && x.notes && multiTimelineEnabled && x.notes.map((y: any) =>
                  <div>
                    <i className="fas fa-sticky-note"
                      style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverNote(e, y, x)} onClick={() => onClickBookmarkNote(y, 2)}>
                    </i>
                  </div>
                )}
              </div>
                   
              {isMultiViewEnable && <div className={`beforerecording ${syncButtonClass}_Before`} style={{ width: x.recording_Start_point_ratio + '%', height: multiTimelineEnabled ? '20px' : "0", display: 'flex' }} id={"timeLine-hover-before" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
              ></div>}
              {isMultiViewEnable && startTimelineSync && <><div className="canvas-width"
                style={{ backgroundColor: '#333', width: x.recordingratio + '%', height: multiTimelineEnabled ? '20px' : "0", display: 'flex'}}
                id={"timeLine-hover" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                onMouseOver={(e: any) => displayThumbail(e, x.id)}
                onMouseMove={(e: any) => displayThumbail(e, x.id)}
                onMouseOut={() => removeThumbnail()}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
                {startTimelineSync && <div className="buffer_btn_container" style ={{width : x.video_duration_in_second, position : "absolute"}}>
                  <div className="buffer_left_btn">
                      <button className="buffer_button" type="button" style={{ left: x.recording_Start_point_ratio + 2 + '%', position: "relative"}} onClick={(e: any) => AdjustTimeline(e, x, -1000)}>

                        <CRXTooltip
                        iconName={"fas fa-chevron-left"}
                        className="tooltip_sync_button"
                        placement="right"
                        title={"move 100 milliseconds back"}
                        arrow={false}
                      />
                        </button>
                      <button className="buffer_button" type="button" style={{ left: x.recording_Start_point_ratio + 5 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, -100)}>
                        <CRXTooltip
                          iconName={"fas fa-chevrons-left"}
                          className="tooltip_sync_button"
                          placement="right"
                          title={"move 1 second back"}
                          arrow={false}
                        />
                        </button>
                  </div>
                  <div className="buffer_left_btn">
                        <button className="buffer_button" type="button" style={{ left: x.recording_Start_point_ratio + 8 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, 100)}>
                        <CRXTooltip
                          iconName={"fas fa-chevrons-right"}
                          className="tooltip_sync_button"
                          placement="right"
                          title={"move 1 second forward"}
                          arrow={false}
                        />
                        </button>
                       <button className="buffer_button" type="button" style={{ left: x.recording_Start_point_ratio + 11 + '%', position: "relative" }} onClick={(e: any) => AdjustTimeline(e, x, 1000)}>
                         <CRXTooltip
                          iconName={"fas fa-chevron-right"}
                          className="tooltip_sync_button"
                          placement="right"
                          title={"move 100 milliseconds forward"}
                          arrow={false}
                        />
                         </button>
                  </div>
                </div>}
              </div>
                
              </>
              }
              {isMultiViewEnable &&
                <div className={`afterrecording ${syncButtonClass}_After `} style={{ width:'100%', height: multiTimelineEnabled ? '20px' : "0", display: 'flex'}} id={"timeLine-hover-after" + x.indexNumberToDisplay}
                  onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                ></div>
              }
            </div>
          </div>
        </div>
      )}
    {/* <div className="video_pointer_line"></div> */}
    </div>
  )

};

export default Timelines
