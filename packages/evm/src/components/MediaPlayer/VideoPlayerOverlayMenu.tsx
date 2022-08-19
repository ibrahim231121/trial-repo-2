import "./VideoPlayerOverlayMenu.scss";
const VideoPlayerOverlayMenu = (props:any)  => {

  const {overlayEnabled, overlayCheckedItems} = props;
  
  let SensorList = overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors");
  let LocationList = overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)");
  let SpeedList = overlayCheckedItems.some((x: any) => x == "All" || x == "Speed");
  let TimestampList = overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp");

  return (
    <>
    {overlayEnabled && <div className="overlayMenu">
      <ul>
        <li className="OverlayLogoImage"><img src={process.env.PUBLIC_URL + "./assets/images/Getac_logo_overlays_white.png"} /></li>
        { SensorList && <li className="SensorList">SENSORS: L, B</li>}
        {  LocationList &&
           <li className="LocationList">
              <span className="LAT">LAT: 44.8478</span>
              <span className="LON">LON: -95.3885</span>
              <span className="ALT">ALT: 259.7</span>
          </li>}
        { SpeedList && <li className="SpeedList">80 MPH</li>}
        { TimestampList &&
         <li className="TimestampList">
           <span className="date">02-28-2022</span>
           <span className="time">01:27:01 PM</span>
         </li>}
      </ul>
    </div>}
    </>
  )
}

export default VideoPlayerOverlayMenu