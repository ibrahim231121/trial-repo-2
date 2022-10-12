import React, { useRef } from "react";
import "./VideoPlayerOverlayMenu.scss";
const VideoPlayerOverlayMenu = (props:any)  => {

  const {overlayEnabled, overlayCheckedItems, updatedGpsDataOverlay, updatedSensorsDataOverlay} = props;
  const LAT = useRef("");
  const LON = useRef("");
  const ALT = useRef("");
  const speed = useRef("");
  const date = useRef("");
  const sensorValue = useRef("");
  
  let SensorList = overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors");
  let LocationList = overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)");
  let SpeedList = overlayCheckedItems.some((x: any) => x == "All" || x == "Speed");
  let TimestampList = overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp");

  React.useEffect(() => {
    if (updatedGpsDataOverlay) {
      LAT.current = updatedGpsDataOverlay.lat;
      LON.current = updatedGpsDataOverlay.lon;
      ALT.current = updatedGpsDataOverlay.alt;
      speed.current = updatedGpsDataOverlay.speed;
      let dateTime = new Date(updatedGpsDataOverlay.logTime);
      date.current = dateTime.toLocaleString();
    }
    if (updatedSensorsDataOverlay) {
      sensorValue.current = updatedSensorsDataOverlay.value;
    }
  }, [updatedGpsDataOverlay, updatedSensorsDataOverlay]);

  return (
    <>
    {overlayEnabled && <div className="overlayMenu">
      <div className="overlayMenuMainList">
        <div className="OMML_left">
            <div className="OverlayLogoImage"><img src={process.env.PUBLIC_URL + "./assets/images/Getac_logo_overlays_white.png"} /></div>
            { SensorList && <div className="SensorList">SENSORS: {sensorValue.current}</div>}
        </div>
        <div className="OMML_right">
            {  LocationList &&
              <div className="LocationList">
                  <span className="LAT">LAT: {LAT.current}</span>
                  <span className="LON">LON: {LON.current}</span>
                  <span className="ALT">ALT: {ALT.current}</span>
              </div>}
            { SpeedList && <div className="SpeedList">{speed.current} MPH</div>}
            { TimestampList &&
            <div className="TimestampList">
              <span className="date">{date.current}</span>
            </div>}
        </div>
      </div>
    </div>}
    </>
  )
}

export default VideoPlayerOverlayMenu