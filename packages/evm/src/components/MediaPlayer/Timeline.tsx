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
  setbookmark: any
  setnote: any
  setbookmarkAssetId: any
  setnoteAssetId: any
  visibleThumbnail: any
  setVisibleThumbnail: any
  singleTimeline: any
  displayThumbnail: any
}


const Timelines = ({ timelinedetail, duration, seteditBookmarkForm, bookmark, setbookmark, setbookmarkAssetId, visibleThumbnail, setVisibleThumbnail, singleTimeline, displayThumbnail, seteditNoteForm, setnoteAssetId, setnote, note }: Timelineprops,) => {
  const targetRef = useRef<any>();
  const [openThumbnail, setopenThumbnail] = useState<boolean>(false);
  const [Event, setEvent] = useState();
  const [timelinedetail1, settimelinedetail1] = useState<any>();
  const [bookmarklocation, setbookmarklocation] = useState<number>();
  const [mouseovertype, setmouseovertype] = useState("");

  React.useEffect(() => {
    if (openThumbnail&&Event&&timelinedetail1) {
      if(mouseovertype == "bookmark"){
        displayThumbail(Event,timelinedetail1.id,bookmark.description);
      }
      else if(mouseovertype == "note"){
        displayThumbail(Event,timelinedetail1.id,note.description);
      }
    }
  }, [openThumbnail]);

  const mouseOut = () => {
    removeThumbnail();
    setopenThumbnail(false);
  }

  const mouseOverBookmark = (event: any, y: any, x: any) => {
    setmouseovertype("bookmark");
    setbookmark(y);
    //setbookmarklocation(getbookmarklocation(y.position, x.startdiff));
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }
  const mouseOverNote = (event: any, y: any, x: any) => {
    setmouseovertype("note");
    setnote(y);
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }

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


  const onClickBookmark = (y: any) => {
    setopenThumbnail(false);
    seteditBookmarkForm(true);
    setbookmarkAssetId(y.assetId);
  }
  const onClickNote = (y: any) => {
    setopenThumbnail(false);
    seteditNoteForm(true);
    setnoteAssetId(y.assetId);
  }

  const getbookmarklocation = (position: any, startdiff: any) => {
    let timelineposition = position + startdiff;
    let timelinepositionpercentage = Math.round((Math.round(timelineposition / 1000) / duration) * 100)
    return timelinepositionpercentage;
  }

  return (
    <div className="beforelineMain">
      {timelinedetail.filter((x:any) => x.enableDisplay).sort((a, b) => a.indexNumberToDisplay - b.indexNumberToDisplay).map((x: any) =>
        <div style={{marginTop:10}}>
          <div className="beforeline">
            <div className="line" style={{ position: "relative" }}>
              <video width="300" height="150" id={"Thumbnail" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute" }}>
                <source src={x.src} type="video/mp4" />
              </video>
              <p id={"Thumbnail-Time" + x.indexNumberToDisplay} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>
              {openThumbnail && <p id={"Thumbnail-Desc"} style={{ visibility: visibleThumbnail.includes(x.indexNumberToDisplay) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>}
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.bookmarks && x.bookmarks.map((y: any, index: any) =>
                  <div>

                    <i className="fa fa-bookmark" aria-hidden="true"
                      style={{ position: "absolute", left: getbookmarklocation(y.position, x.startdiff) + '%', height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverBookmark(e, y, x)} onClick={() => onClickBookmark(y)}>

                    </i>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.notes && x.notes.map((y: any, index: any) =>
                  <div>
                    <i className="fas fa-sticky-note"
                      style={{ position: "absolute", left: getbookmarklocation(y.position, x.startdiff) + '%', height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverNote(e, y, x)} onClick={() => onClickNote(y)}>
                    </i>
                  </div>
                )}
              </div>

              {singleTimeline == false && <div className="beforerecording" style={{ width: x.recording_Start_point_ratio + '%' }} id={"timeLine-hover-before" + x.indexNumberToDisplay}></div>}
              {singleTimeline == false && <div className="canvas-width" 
                style={{ backgroundColor: 'green', width: x.recordingratio + '%', height: '12px', display: 'flex' }}
                id={"timeLine-hover" + x.indexNumberToDisplay}
                // draggable="true"
                // onClick={(e: any) => setController(e, index)}
                // onDrag={(e: any) => setController(e, index)}
                // onDragEnd={(e: any) => setController(e, index)}
                onMouseOver={(e: any) => displayThumbail(e, x.id)}
                onMouseMove={(e: any) => displayThumbail(e, x.id)}
                onMouseOut={() => removeThumbnail()}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
              </div>
              }
              {singleTimeline == false &&
                <div className="afterrecording" style={{ width: x.recording_end_point_ratio + '%' }} id={"timeLine-hover-after" + x.indexNumberToDisplay}></div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )

};

export default Timelines