import React, { useState, useRef } from "react";
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
  singleTimeline: any
  displayThumbnail: any
  bookmarkMsgRef: any
  onClickBookmarkNote: any
  openThumbnail: boolean
  mouseovertype: any
  timelinedetail1: any
  mouseOverBookmark: any
  mouseOverNote: any
  mouseOut: any
  Event: any
  getbookmarklocation: any
  adjustTimeline: any
}


const Timelines = ({ timelinedetail, duration, seteditBookmarkForm, bookmark, setbookmarkAssetId, visibleThumbnail, setVisibleThumbnail, singleTimeline, displayThumbnail, seteditNoteForm, setnoteAssetId, note, bookmarkMsgRef, onClickBookmarkNote, openThumbnail, mouseovertype, timelinedetail1, mouseOverBookmark, mouseOverNote, mouseOut, Event, getbookmarklocation, adjustTimeline }: Timelineprops,) => {
  const targetRef = useRef<any>();
  
  
  const [bookmarklocation, setbookmarklocation] = useState<number>();

  React.useEffect(() => {
    if (openThumbnail&&Event&&timelinedetail1) {
      if(mouseovertype == "bookmark"){
        displayThumbail(Event,timelinedetail1.id,bookmark.description);
      }
      else if(mouseovertype == "note"){
        displayThumbail(Event,timelinedetail1.id,note.description);
      }
    }
    else{
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
    var x = timelinedetail.find((x:any) => x.id == id)
    var index = x?.indexNumberToDisplay ?? 0;
    setVisibleThumbnail([...visibleThumbnail, index]);
    if(withdescription){
      displayThumbnail(event, x, false, withdescription)
    }
    else{
      displayThumbnail(event, x, false)
    }
    
  }
  const removeThumbnail = () => {
    setVisibleThumbnail([]);
  }


  // const onClickBookmark = (y: any) => {
    // if(y.madeBy == "System"){
    //   bookmarkMsgRef.current.showToaster({message: "Cannot Edit System Generated Bookmark", variant: "error", duration: 5000, clearButtton: true});
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

  return (
    <div className="beforelineMain">
      {timelinedetail.filter((x:any) => x.enableDisplay).sort((a, b) => a.indexNumberToDisplay - b.indexNumberToDisplay).map((x: any) =>
        <div style={{marginTop:10}}>
          <div className="beforeline">
          <p>{x.camera}</p>
            <div className="line" style={{ position: "relative" }}>
              <video width="300" height="150" id={"Thumbnail" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute" }}>
                <source src={x.src} type="video/mp4" />
              </video>
              <p id={"Thumbnail-Time" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>
              <p id={"Thumbnail-CameraDesc" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>
              {openThumbnail && <p id={"Thumbnail-Desc"} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>}
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.bookmarks && singleTimeline == false && x.bookmarks.map((y: any, index: any) =>
                  <div>

                    <i className="fa fa-bookmark" aria-hidden="true"
                      style={{zIndex:2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverBookmark(e, y, x)} onClick={() => onClickBookmarkNote(y,1)}>

                    </i>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.notes && singleTimeline == false && x.notes.map((y: any, index: any) =>
                  <div>
                    <i className="fas fa-sticky-note"
                      style={{zIndex:2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point), height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverNote(e, y, x)} onClick={() => onClickBookmarkNote(y,2)}>
                    </i>
                  </div>
                )}
              </div>

              {singleTimeline == false && <div className="beforerecording" style={{ width: x.recording_Start_point_ratio + '%' }} id={"timeLine-hover-before" + x.indexNumberToDisplay}
              onClick={(e: any) => adjustTimeline(e, x, 0)}
              ></div>}
              {singleTimeline == false && <><div className="canvas-width" 
                style={{ backgroundColor: 'green', width: x.recordingratio + '%', height: '12px', display: 'flex' }}
                id={"timeLine-hover" + x.indexNumberToDisplay}
                onClick={(e: any) => adjustTimeline(e, x, 0)}
                // draggable="true"
                // onClick={(e: any) => setController(e, index)}
                // onDrag={(e: any) => setController(e, index)}
                // onDragEnd={(e: any) => setController(e, index)}
                onMouseOver={(e: any) => displayThumbail(e, x.id)}
                onMouseMove={(e: any) => displayThumbail(e, x.id)}
                onMouseOut={() => removeThumbnail()}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
              </div>
                <input type="button" style={{left:x.recording_Start_point_ratio + 2 + '%', position:"absolute", zIndex:2 }} onClick={(e:any) => adjustTimeline(e,x,-1000)} value="<"></input>
                <input type="button" style={{left:x.recording_Start_point_ratio + 5 + '%', position:"absolute", zIndex:2 }} onClick={(e:any) => adjustTimeline(e,x,-100)} value="<<"></input>
                <input type="button" style={{left:x.recording_Start_point_ratio + 8 + '%', position:"absolute", zIndex:2 }} onClick={(e:any) => adjustTimeline(e,x,100)} value=">>"></input>
                <input type="button" style={{left:x.recording_Start_point_ratio + 11 + '%', position:"absolute", zIndex:2 }} onClick={(e:any) => adjustTimeline(e,x,1000)} value=">"></input>
              </>
              }
              {singleTimeline == false &&
                <div className="afterrecording" style={{ width: x.recording_end_point_ratio + '%' }} id={"timeLine-hover-after" + x.indexNumberToDisplay}
                onClick={(e: any) => adjustTimeline(e, x, 0)}
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