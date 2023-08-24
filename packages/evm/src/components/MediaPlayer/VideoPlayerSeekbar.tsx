import Slider from "@material-ui/core/Slider";
import React from "react";
import { useState } from "react";
import { CRXVideoPlayerStyle } from '@cb/shared';


const VideoPlayerSeekbar = (props:any)  => {
  const videoPlayerJssStyle = CRXVideoPlayerStyle()
  const {controlBar, handleControlBarChange, timelineduration, viewReasonControlsDisabled, timelinedetail, displayThumbnail, setVisibleThumbnail, markerFwRw, marks} = props;
  
  const displaySeekBarThumbail = (event: any) => {
    let Indexes: number[] = [];
    timelinedetail.filter((x: any) => x.enableDisplay).forEach((x: any) => {
      Indexes.push(x.indexNumberToDisplay)
      displayThumbnail(event, x, true)
    });
    setVisibleThumbnail(Indexes);
  }
  const removeSeekBarThumbail = () => {
     setVisibleThumbnail([]);
  }
  return (
    <>
    <Slider
                    id="SliderControlBar"
                    value={typeof controlBar === 'number' ? controlBar : (typeof controlBar === 'object' && controlBar.length > 0 ? controlBar : 0)}
                    onChange={handleControlBarChange}
                    onMouseOver={(e: any) => displaySeekBarThumbail(e)}
                    onMouseMove={(e: any) => displaySeekBarThumbail(e)}
                    onMouseOut={() => removeSeekBarThumbail()}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    marks={marks}
                    max={timelineduration}
                    disabled={viewReasonControlsDisabled}
                    classes={{
                      ...videoPlayerJssStyle
                    }}
                  />
                  {typeof controlBar === 'number' && <div className="_play_timeLine_pipeRed" id="_hover_timeLine_pipeRed" style={{left : ((controlBar/timelineduration)*100)+"%"}}></div>}
                   <div className="_hover_timeLine_pipeGray" id="_hover_timeLine_pipeGray"></div>
                   {markerFwRw && <div className={`_fwrw_timeLine_pipeRed`} id="_fwrw_timeLine_pipeRed" style={{left: ((controlBar/timelineduration)*100)+"%" }}></div>}
                  </>
  )
}

export default VideoPlayerSeekbar