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
      <div className="overlayMenuMainList">
        <div className="OMML_left">
            <div className="OverlayLogoImage"><img src={process.env.PUBLIC_URL + "./assets/images/Getac_logo_overlays_white.png"} /></div>
            { SensorList && <div className="SensorList">SENSORS: L, B</div>}
        </div>
        <div className="OMML_right">
            {  LocationList &&
              <div className="LocationList">
                  <span className="LAT">LAT: 44.8478</span>
                  <span className="LON">LON: -95.3885</span>
                  <span className="ALT">ALT: 259.7</span>
              </div>}
            { SpeedList && <div className="SpeedList">80 MPH</div>}
            { TimestampList &&
            <div className="TimestampList">
              <span className="date">02-28-2022</span>
              <span className="time">01:27:01 PM</span>
            </div>}
        </div>
      </div>
    </div>}
    </>
  )
}

export default VideoPlayerOverlayMenu