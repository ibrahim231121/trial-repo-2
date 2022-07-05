import Slider from "@material-ui/core/Slider";
import CRXVideoPlayerStyle from './CRXVideoPlayerStyle';

const VideoPlayerSeekbar = (props:any)  => {
  const classes = CRXVideoPlayerStyle()
  const {controlBar, handleControlBarChange, timelineduration, viewReasonControlsDisabled, timelinedetail, displayThumbnail, setVisibleThumbnail} = props;
  
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
                    value={typeof controlBar === 'number' ? controlBar : 0}
                    onChange={handleControlBarChange}
                    onMouseOver={(e: any) => displaySeekBarThumbail(e)}
                    onMouseMove={(e: any) => displaySeekBarThumbail(e)}
                    onMouseOut={() => removeSeekBarThumbail()}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    max={timelineduration}
                    disabled={viewReasonControlsDisabled}
                    classes={{
                      ...classes
                    }}
                  />
                   <div className="_hover_timeLine_pipeGray" id="_hover_timeLine_pipeGray"></div>
                  </>
  )
}

export default VideoPlayerSeekbar