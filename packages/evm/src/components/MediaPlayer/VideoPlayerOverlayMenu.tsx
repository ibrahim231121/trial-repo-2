import React, { useRef } from "react";
import "./VideoPlayerOverlayMenu.scss";
import "./VideoPlayerOverlayMenuResponsive.scss";
import overlayLogo from "../../Assets/Images/Getac_logo_overlays_white.png";
import AppLogo from '../../../src/Assets/Images/AppLogo.png';

const VideoPlayerOverlayMenu = (props:any)  => {

  const {overlayCheckedItems, overlayDuration, overlayDataJson, assetId, isMultiViewEnable} = props;
  const LAT = useRef("");
  const LON = useRef("");
  const ALT = useRef("");
  const speed = useRef("");
  const date = useRef("");
  const sensorValue = useRef("");
  
  let SensorList = overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors");
  let LocationList = isMultiViewEnable ?  false : overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)");
  let SpeedList = isMultiViewEnable ?  false : overlayCheckedItems.some((x: any) => x == "All" || x == "Speed");
  let TimestampList = overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp");

  React.useEffect(() => {
    if (overlayDuration) {
      let tempOverlayDataJson = JSON.parse(JSON.stringify(overlayDataJson));
      tempOverlayDataJson = tempOverlayDataJson.filter((x:any) => x.assetId == assetId);
      let Gps = tempOverlayDataJson[0]?.gps.filter((x:any)=> x.logTime == overlayDuration)[0];
      let Sensors = tempOverlayDataJson[0]?.sensors.filter((x:any)=> x.logTime == overlayDuration)[0];
      if(Gps){
        LAT.current = Gps.lat;
        LON.current = Gps.lon;
        ALT.current = Gps.alt;
        speed.current = Gps.speed;
      }
      if(Sensors){
        sensorValue.current = Sensors.value;
      }
      let dateTime = new Date(overlayDuration);
      date.current = dateTime.toLocaleString();
    }
  }, [overlayDuration]);

  let overlayMenuClass = `overlayMenu_SensorList_${SensorList}_LocationList_${LocationList}_SpeedList_${SpeedList}_TimestampList_${TimestampList}`

  return (
    <>
    <div className={`overlayMenu ${overlayMenuClass} ` }>
      <div className="overlayMenuMainList">
        <div className="OMML_left">
            <div className="OverlayLogoImage"><img src={overlayLogo} /></div>
            { SensorList && <div className="SensorList"><span className="sensors_label">SENSORS:</span> <span className="text_content">{sensorValue.current ? sensorValue.current : ""}</span> </div>}
        </div>
        <div className="OMML_right">
            {  LocationList &&
              <div className="LocationList">
                  <span className="LAT">LAT: <span className="text_content_lat">{LAT.current ? LAT.current : "" }</span></span>
                  <span className="LON">LON: <span className="text_content_lon">{LON.current ? LON.current : "" }</span></span>
                  <span className="ALT">ALT: <span className="text_content_alt">{ALT.current ? ALT.current : ""}</span></span>
              </div>}
            { SpeedList && <div className="SpeedList"><span className="text_content">{speed.current ? speed.current : ""}</span> MPH</div>}
            { TimestampList &&
            <div className="TimestampList">
              {date.current ? <span>{date.current}</span> : ""}
            </div>}
        </div>
      </div>
    </div>
    </>
  )
}

export default VideoPlayerOverlayMenu