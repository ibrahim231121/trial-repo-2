import React, {useState , useRef} from "react";
import Slider from "@material-ui/core/Slider";
import "./VolumeControl.scss";

interface VolumecontrolProp { 
  setVolumeHandle: (values: number) => void;
  setMuteHandle: (values: boolean) => void;
}

const VolumeControl = (props:VolumecontrolProp) => {

  const [volume, setVolume] = useState(100);

  const [isMute, setIsMute]= useState(false);

  const [volumeBar, setvolumeBar ] = useState("hideVolumeBar");
  const handleVolumeChange = (event:any, value:any) =>{

    setVolume(value);
    props.setVolumeHandle(value);

    if(volume == 0)
    {
      setIsMute(true);
      props.setMuteHandle(true);
    }
    else
    {
      setIsMute(false);
      props.setMuteHandle(false);
    }
  };
 
  const inputEl = useRef(null);

  const VolumeBarHover = () =>{
      setvolumeBar("showVolumeBar");
  }

  const VolumeBarLeave = () => {
    setvolumeBar("hideVolumeBar");
  }

  const handleVoumeClick = () =>
  {
    setIsMute(!isMute);
    props.setMuteHandle(!isMute);
    if(volume == 0 && isMute)
    {
      setVolume(50);
      props.setVolumeHandle(50);
    }

  }
 
  const getVolumeIconClass = ()=>{
   
    if(isMute || volume == 0)
    {
      return "icon-volume-mute1";
    }
    else
    {
      if(volume >= 1 && volume <= 33){
        return "icon-volume-low";
      }
      else if(volume >= 34 && volume <= 66){
        return "icon-volume-medium";
      }
      else{
        return "icon-volume-high";
      }
    }

  };

 
 




  return (
    <div id="volume-controls" onMouseLeave={VolumeBarLeave}>
      <div  ref={inputEl} className={`volume-slider ${volumeBar}`}>
        <Slider 
            value={isMute ? 0 :volume}
            onChange={handleVolumeChange}
            aria-labelledby="input-slider"
            step={1}
            min={0}
            max={100}
            orientation="vertical"
        />
      </div>
      <div className="volume-icon">
        <span onMouseOver={VolumeBarHover}   className={getVolumeIconClass()} onClick={handleVoumeClick}></span>
      </div>
    </div>
  );
};

export default VolumeControl;