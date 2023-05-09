import Slider from "@material-ui/core/Slider";
import { CRXVideoPlayerStyle } from '@cb/shared';

const AudioPlayerSeekbar = (props:any)  => {
  const videoPlayerJssStyle = CRXVideoPlayerStyle()
  const {controlBar, handleControlBarChange, timelineduration} = props;
  
  
  
  return (
    <>
    <Slider
                    id="SliderControlBar"
                    value={typeof controlBar === 'number' ? controlBar : 0}
                    onChange={handleControlBarChange}
                    aria-labelledby="input-slider"
                    step={1}
                    min={0}
                    max={timelineduration}
                    classes={{
                      ...videoPlayerJssStyle
                    }}
                  />
                  <div className="_play_timeLine_pipeRed" id="_hover_timeLine_pipeRed" style={{left : ((controlBar/timelineduration)*100)+"%"}}></div>
                   <div className="_hover_timeLine_pipeGray" id="_hover_timeLine_pipeGray"></div>
                  </>
  )
}

export default AudioPlayerSeekbar