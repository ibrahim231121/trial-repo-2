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
}


const Timelines = ({ timelinedetail, duration, seteditBookmarkForm, bookmark, setbookmark, setbookmarkAssetId }: Timelineprops,) => {
  const targetRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setTimeout(() => {
      console.log(timelinedetail)
    }, 600);


  }, timelinedetail);
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

              <div style={{ position: "absolute", top: "-5px", left: "0px", width: "100%" }}>
                {x.bookmarks && x.bookmarks.map((y: any, index: any) =>
                  <i className="fa fa-bookmark" aria-hidden="true"
                    style={{ position: "relative", left: getbookmarklocation(y.position, x.startdiff) + '%', height: "15px", width: "0px" }}
                    onMouseOut={() => mouseOut()} onMouseOver={() => mouseOver(y, x)} onClick={() => onClickBookmark(y)}>

                  </i>
                )}
              </div>

              <div className="beforerecording" style={{ width: x.recording_Start_point_ratio + '%' }}></div>
              {/* <div style={{ backgroundColor: 'green', width: x.recordingratio + '%', height: '100%', display: 'table-cell' }}></div> */}
              <div className="canvas-width" style={{ backgroundColor: 'green', width: x.recordingratio + '%', height: '12px', display: 'flex' }} ref={targetRef}>
              {<Buffering width={x.video_duration_in_second} id={x.id} />}
              </div>
              <div className="afterrecording" style={{ width: x.recording_end_point_ratio + '%' }}></div>
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