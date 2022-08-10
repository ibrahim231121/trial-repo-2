import getacVideoSolution from '../../Assets/Images/getacVideoSolution.png';


const VideoPlayerOverlayMenu = (props:any)  => {

  const {overlayEnabled, overlayCheckedItems} = props;
  
  
  return (
    <>
    {overlayEnabled && <div className="overlayVideo"  style={{height:50, background: "#7a7a7a"}}>
      <ul>
        <li><img src={getacVideoSolution} style={{height:30}}></img></li>
        {overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors") && <li>Sensors</li>}
        {overlayCheckedItems.some((x: any) => x == "All" || x == "GPS") && <li>GPS</li>}
        {overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp") && <li>Timestamp</li>}
        {overlayCheckedItems.some((x: any) => x == "All" || x == "Speed") && <li>Speed</li>}
      </ul>
    </div>}
    </>
  )
}

export default VideoPlayerOverlayMenu