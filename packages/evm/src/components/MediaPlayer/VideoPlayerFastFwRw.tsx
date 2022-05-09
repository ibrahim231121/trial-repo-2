import React, { useState, useRef } from "react";
import "./Timeline.scss"
import "./VideoPlayer.scss"
interface VideoPlayerFastFwRwProp { 
    videoData: any[],
    setVideoHandlersFwRw: any,
    setvideoTimerFwRw: any,
    onClickVideoFwRw: any
}


const VideoPlayerFastFwRw = ({ videoData, setVideoHandlersFwRw, setvideoTimerFwRw, onClickVideoFwRw }: VideoPlayerFastFwRwProp) => {


  
  var videoElements: any[] = [];
  var videoTimerElements: any[] = [];
  
  React.useEffect(() => {
    for (var i = 0; i < 5; i++) {
      var temp: any= document.getElementById("vid-"+i);
      var temp1: any= document.getElementById("Time-"+i);
      if(temp){
        videoElements.push(temp);
      }
      if(temp1){
      videoTimerElements.push(temp1);
      }
    }
    if(videoElements.length == 5){
      setVideoHandlersFwRw(videoElements);
    }
    if(videoTimerElements.length == 5){
      setvideoTimerFwRw(videoTimerElements);
    }
  }, []);
  
const x = ()=>{
  return (
    <>
      <div>
        <video id="vid-0" width="130px" height="130px"  preload="auto" crossOrigin="anonymous" onClick={(e: any) => onClickVideoFwRw(e)}>
            <source src={videoData[0]?.src} type="video/mp4" />
        </video>
        <p id={"Time-0"} style={{ position: "absolute", width: 50, color: "white", background: "black" }}></p>
      </div>
      <div>
        <video id="vid-1" width="130px" height="130px"  preload="auto" crossOrigin="anonymous" onClick={(e: any) => onClickVideoFwRw(e)}>
            <source src={videoData[0]?.src} type="video/mp4" />
        </video>
        <p id={"Time-1"} style={{ position: "absolute", width: 50, color: "white", background: "black" }}></p>
      </div>
      <div>
        <video id="vid-2" width="130px" height="130px"  preload="auto" crossOrigin="anonymous" onClick={(e: any) => onClickVideoFwRw(e)}>
            <source src={videoData[0]?.src} type="video/mp4" />
        </video>
        <p id={"Time-2"} style={{ position: "absolute", width: 50, color: "white", background: "black" }}></p>
      </div>
      <div>
        <video id="vid-3" width="130px" height="130px"  preload="auto" crossOrigin="anonymous" onClick={(e: any) => onClickVideoFwRw(e)}>
            <source src={videoData[0]?.src} type="video/mp4" />
        </video>
        <p id={"Time-3"} style={{ position: "absolute", width: 50, color: "white", background: "black" }}></p>
      </div>
      <div>
        <video id="vid-4" width="130px" height="130px"  preload="auto" crossOrigin="anonymous" onClick={(e: any) => onClickVideoFwRw(e)}>
            <source src={videoData[0]?.src} type="video/mp4" />
        </video>
        <p id={"Time-4"} style={{ position: "absolute", width: 50, color: "white", background: "black" }}></p>
      </div>
    </>
  )
}  
  
  return (
    <div className="videoFastRw">
      {x()}
    </div>
  )

};

export default VideoPlayerFastFwRw