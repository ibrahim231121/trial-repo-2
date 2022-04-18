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
  bookmark: any
  setbookmark: any
  setbookmarkAssetId: any
  setControlBar: any
  setTimer: any
  handleControlBarChange: any
  secondsToHms: any
  visibleThumbnail: any
  setVisibleThumbnail: any
  singleTimeline: any
}


const Timelines = ({ timelinedetail, duration, seteditBookmarkForm, bookmark, setbookmark, setbookmarkAssetId, setControlBar, setTimer, handleControlBarChange, secondsToHms, visibleThumbnail, setVisibleThumbnail, singleTimeline }: Timelineprops,) => {
  const targetRef = useRef<any>();
  const [openThumbnail, setopenThumbnail] = useState<boolean>(false);
  const [bookmarklocation, setbookmarklocation] = useState<number>();

  const mouseOut = () => {
    setopenThumbnail(false);
  }

  const mouseOver = (y: any, x: any) => {
    setbookmark(y);
    setbookmarklocation(getbookmarklocation(y.position, x.startdiff));
    setopenThumbnail(true);
  }


  const displayThumbail = (event: any, index: number) => {
    setVisibleThumbnail([...visibleThumbnail, index]);
    var x = timelinedetail[index]
    var timeLineHover: any = document.querySelector("#timeLine-hover" + index);
    var timelineWidth = timeLineHover?.scrollWidth;
    var offset = timeLineHover.getBoundingClientRect().left;
    var pos = (event.pageX - offset) / timelineWidth;
    var ttt = Math.round(pos * x.video_duration_in_second);
    var Thumbnail: any = document.querySelector("#Thumbnail" + index);
    var ThumbnailTime: any = document.querySelector("#Thumbnail-Time" + index);
    if (Thumbnail) {
      Thumbnail.currentTime = ttt;
      Thumbnail.style.left = (event.pageX - offset) + "px";
      ThumbnailTime.innerHTML = secondsToHms(ttt)
      ThumbnailTime.style.left = (event.pageX - offset) + "px";
    }
  }
  const removeThumbnail = (index: number) => {
    var visibleThumbnailAfterRemove = visibleThumbnail.filter((x: any) => x !== index);
    setVisibleThumbnail(visibleThumbnailAfterRemove);
  }

  const setController = (event: any, index: number) => {
    var x = timelinedetail[index]
    var timeLineHover: any = document.querySelector("#timeLine-hover" + index);
    var timeLineHoverBefore: any = document.querySelector("#timeLine-hover-before" + index)?.scrollWidth;
    var timelineWidth = timeLineHover?.scrollWidth;
    var offset = timeLineHover.getBoundingClientRect().left;
    var pos = (event.pageX - offset + timeLineHoverBefore) / timelineWidth;
    var ttt = Math.round(pos * x.video_duration_in_second);
    setControlBar(ttt);
    setTimer(ttt);
    handleControlBarChange(null, ttt);
  }


  const onClickBookmark = (y: any) => {
    setopenThumbnail(false);
    seteditBookmarkForm(true);
    setbookmarkAssetId(y.assetId);
  }

  const getbookmarklocation = (position: any, startdiff: any) => {
    let timelineposition = position + startdiff;
    let timelinepositionpercentage = Math.round((Math.round(timelineposition / 1000) / duration) * 100)
    return timelinepositionpercentage;
  }

  const renderDescription = () => {
    return (
      <div>
        {bookmark.description}
      </div>
    )
  }

  return (
    <div>
      {timelinedetail.map((x: any, index: any) =>
        <div style={{ marginTop: 10 }}>
          <div className="beforeline">
            <div className="line" style={{ position: "relative" }}>
              {<video width="300" height="150" id={"Thumbnail" + index} style={{ visibility: visibleThumbnail.includes(index) ? "visible" : "hidden", position: "absolute" }}>
                <source src={x.src} type="video/mp4" />

              </video>}
              <p id={"Thumbnail-Time" + index} style={{ visibility: visibleThumbnail.includes(index) ? "visible" : "hidden", position: "absolute", width: 50, color: "white", background: "black" }}></p>
              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.bookmarks && x.bookmarks.map((y: any, index: any) =>
                  <div>

                    <i className="fa fa-bookmark" aria-hidden="true"
                      style={{ position: "absolute", left: getbookmarklocation(y.position, x.startdiff) + '%', height: "15px", width: "0px" }}
                      onMouseOut={() => mouseOut()} onMouseOver={() => mouseOver(y, x)} onClick={() => onClickBookmark(y)}>

                    </i>
                  </div>
                )}
              </div>

              {singleTimeline == false && <div className="beforerecording" style={{ width: x.recording_Start_point_ratio + '%' }} id={"timeLine-hover-before" + index}></div>}
              {singleTimeline == false && <div className="canvas-width" draggable="true"
                style={{ backgroundColor: 'green', width: x.recordingratio + '%', height: '12px', display: 'flex' }}
                id={"timeLine-hover" + index}
                onClick={(e: any) => setController(e, index)}
                onDrag={(e: any) => setController(e, index)}
                onDragEnd={(e: any) => setController(e, index)}
                onMouseOver={(e: any) => displayThumbail(e, index)}
                onMouseMove={(e: any) => displayThumbail(e, index)}
                onMouseOut={() => removeThumbnail(index)}>
                {<Buffering width={x.video_duration_in_second} id={x.id} />}
              </div>
              }
              {singleTimeline == false &&
                <div className="afterrecording" style={{ width: x.recording_end_point_ratio + '%' }} id={"timeLine-hover-after" + index}></div>
              }
            </div>
          </div>
        </div>
      )}
      {openThumbnail &&
        <div id="Thumbnail" style={{ backgroundColor: "white", left: bookmarklocation + '%', top: "45%", position: "absolute", boxShadow: "0 0 9px 5px white" }}>
          <DynamicThumbnail />
          {renderDescription()}
        </div>
      }
    </div>
  )

};

export default Timelines