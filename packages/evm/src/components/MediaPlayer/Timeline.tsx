import React, { useEffect, useState } from "react";
//import ColorSlider from 'multicolorslider'
import "./Timeline.scss"
import "./VideoPlayer.scss"
import { ContactSupportOutlined } from "@material-ui/icons";
import { render } from "@testing-library/react";
import Buffering from "./Buffering";
import DynamicThumbnail from "./DynamicThumbnail";
import moment from "moment";

interface Timelineprops {
  timelinedetail: any[]
  duration: any
  seteditBookmarkForm: any
  seteditNoteForm: any
  bookmark: any
  note: any
  setbookmarkAssetId: any
  setnoteAssetId: any
  visibleThumbnail: any
  setVisibleThumbnail: any
  isMultiViewEnable: boolean
  displayThumbnail: any
  toasterMsgRef: any
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
}


const Timelines = ({ timelinedetail, duration, seteditBookmarkForm, bookmark, setbookmarkAssetId, visibleThumbnail, setVisibleThumbnail, isMultiViewEnable, displayThumbnail, seteditNoteForm, setnoteAssetId, note, toasterMsgRef, onClickBookmarkNote, openThumbnail, mouseovertype, timelinedetail1, mouseOverBookmark, mouseOverNote, mouseOut, Event, getbookmarklocation, AdjustTimeline, startTimelineSync, multiTimelineEnabled }: Timelineprops,) => {




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


  // const mouseOut = () => {
  //   setopenThumbnail(false);
  // }

  // const mouseOverBookmark = (event: any, y: any, x: any) => {
  //   setmouseovertype("bookmark");
  //   setbookmark(y);
  //   //setbookmarklocation(getbookmarklocation(y.position, x.startdiff));
  //   settimelinedetail1(x);
  //   setEvent(event);
  //   setopenThumbnail(true);
  // }
  // const mouseOverNote = (event: any, y: any, x: any) => {
  //   setmouseovertype("note");
  //   setnote(y);
  //   settimelinedetail1(x);
  //   setEvent(event);
  //   setopenThumbnail(true);
  // }


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


  // const onClickBookmark = (y: any) => {
    // if(y.madeBy == "System"){
    //   toasterMsgRef.current.showToaster({message: "Cannot Edit System Generated Bookmark", variant: "error", duration: 5000, clearButtton: true});
    // }
    // else{
    //   setopenThumbnail(false);
    //   seteditBookmarkForm(true);
    //   setbookmarkAssetId(y.assetId);
    // }
  // }
  // else{
  //   setopenThumbnail(false);
  //   seteditBookmarkForm(true);
  //   setbookmarkAssetId(y.assetId);
  // }
  // }
  // const onClickNote = (y: any) => {
  // setopenThumbnail(false);
  // seteditNoteForm(true);
  // setnoteAssetId(y.assetId);
  // }

  // const getbookmarklocation = (position: any, startdiff: any) => {
  //   let timelineposition = position + startdiff;
  //   let timelinepositionpercentage = Math.round((Math.round(timelineposition / 1000) / duration) * 100)
  //   return timelinepositionpercentage;
  // }

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

  return (
    <div className="_beforeline_Main"  >
      {timelinedetail.filter((x: any) => x.enableDisplay).sort((a, b) => a.indexNumberToDisplay - b.indexNumberToDisplay).map((x: any) =>
        <div className="time_line_container">
          <div className="_before_line">
            <div className="line" style={{ position: "relative", display: 'flex' }}>
             {multiTimelineEnabled && <p className="camraName_timeline">{x.camera}</p> }  
              <div className="video_player_hover_thumb" id={"video_player_hover_thumb" + x.indexNumberToDisplay}
                style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", transform: "translate(-50px, 0px)" }}>

                {/* <div className="_timeline_thumb_top_area" id={"Thumbnail-CameraDesc" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}></div> */}
                <video
                  width="128px"
                  height="100%"
                  id={"Thumbnail" + x.indexNumberToDisplay}
                >
                  <source src={x.src} type="video/mp4" />
                </video>
                <div className="video_thumb_line_time" id={"Thumbnail-Time" + x.indexNumberToDisplay}></div>
                <div id="thumbnailHeaderBar">
                  <div className="thumbnailHeaderBar" >
                    {openThumbnail && <div className="_timeline_icon_top_area" id={"Thumbnail-Icon" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden" }}></div>}
                    {openThumbnail && <p id={"Thumbnail-Desc"} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", color: "white", background: "black" }}></p>}
                  </div>
                </div>

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
                {x.notes && multiTimelineEnabled && x.notes.map((y: any, index: any) =>
                  <div>
                    <i className="fas fa-sticky-note"
                      style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverNote(e, y, x)} onClick={() => onClickBookmarkNote(y, 2)}>
                    </i>
                  </div>
                )}
              </div>

              {isMultiViewEnable && <div className="beforerecording" style={{ width: x.recording_Start_point_ratio + '%', height: multiTimelineEnabled ? '6px' : "0", display: 'flex' }} id={"timeLine-hover-before" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
              ></div>}
              {isMultiViewEnable && <><div className="canvas-width"
                style={{ backgroundColor: '#D1D2D4', width: x.recordingratio + '%', height: multiTimelineEnabled ? '6px' : "0", display: 'flex'}}
                id={"timeLine-hover" + x.indexNumberToDisplay}
                onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                onMouseOver={(e: any) => displayThumbail(e, x.id)}
                onMouseMove={(e: any) => displayThumbail(e, x.id)}
                onMouseOut={() => removeThumbnail()}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
              </div>
                {startTimelineSync && <>
                  <input type="button" style={{ left: x.recording_Start_point_ratio + 2 + '%', position: "absolute", zIndex: 2 }} onClick={(e: any) => AdjustTimeline(e, x, -1000)} value="<"></input>
                  <input type="button" style={{ left: x.recording_Start_point_ratio + 5 + '%', position: "absolute", zIndex: 2 }} onClick={(e: any) => AdjustTimeline(e, x, -100)} value="<<"></input>
                  <input type="button" style={{ left: x.recording_Start_point_ratio + 8 + '%', position: "absolute", zIndex: 2 }} onClick={(e: any) => AdjustTimeline(e, x, 100)} value=">>"></input>
                  <input type="button" style={{ left: x.recording_Start_point_ratio + 11 + '%', position: "absolute", zIndex: 2 }} onClick={(e: any) => AdjustTimeline(e, x, 1000)} value=">"></input>
                </>}
              </>
              }
              {isMultiViewEnable &&
                <div className="afterrecording" style={{ width: x.recording_end_point_ratio + '%', height: multiTimelineEnabled ? '6px' : "0", display: 'flex'}} id={"timeLine-hover-after" + x.indexNumberToDisplay}
                  onClick={(e: any) => startTimelineSync ? AdjustTimeline(e, x, 0) : () => { }}
                ></div>
              }
            </div>
          </div>
        </div>
      )}

    </div>
  )

};

export default Timelines
