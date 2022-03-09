import React, {useState,useRef} from "react";
//import ColorSlider from 'multicolorslider'
import "./Timeline.scss"
import "./VideoPlayer.scss"
import { ContactSupportOutlined } from "@material-ui/icons";
import { render } from "@testing-library/react";
import Buffering from "./Buffering";
interface Timelineprops { 
  timelinedetail: any[]
  duration:any
}


const Timelines = ({ timelinedetail,duration}: Timelineprops,) => {
  const targetRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setTimeout(() => {
      console.log(timelinedetail)
    }, 600);
    

  },timelinedetail);
  

if(timelinedetail.length==1)

  
    return (
      <div style={{marginTop:10}}>
        <div className="beforeline">
        <div className="line">
          <div className="beforerecording" style={{width:timelinedetail[0].recording_Start_point_ratio+'%'}}></div>
            <span className="hovertext" data-hover="Recording Started"></span>
          <div className="canvas-width" style={{ width:timelinedetail[0].recordingratio+'%',height:'100%',display:'table-cell'}} ref={targetRef}>
          <Buffering width={targetRef.current?.clientWidth}/>    
          </div>
            <span className="hovertext" data-hover="Recording Ended"></span>
          <div className="afterrecording" style={{width:timelinedetail[0].recording_end_point_ratio+'%'}}></div>
        </div>
        </div>
      </div>
      )
  
else if(timelinedetail.length==2)
    return (
<div style={{marginTop:10}}>
<div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[0].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
   <div style={{backgroundColor:'green', width:timelinedetail[0].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
   <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[0].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[1].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div  style={{backgroundColor:'orange', width:timelinedetail[1].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[1].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  </div>
       )
else if(timelinedetail.length==3)
return (
  <div style={{marginTop:10}}>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[0].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
   <div style={{backgroundColor:'green', width:timelinedetail[0].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
   <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[0].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[1].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div  style={{backgroundColor:'orange', width:timelinedetail[1].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[1].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[2].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div style={{backgroundColor:'blue', width:timelinedetail[2].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[2].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  </div>
 
)
else if(timelinedetail.length==4)
return (
  <div style={{marginTop:10}}>
   <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[0].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
   <div style={{backgroundColor:'green', width:timelinedetail[0].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
   <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[0].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[1].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div  style={{backgroundColor:'orange', width:timelinedetail[1].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[1].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[2].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div style={{backgroundColor:'blue', width:timelinedetail[2].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[2].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  <div className="beforeline">
  <div className="line">
    <div className="beforerecording" style={{width:timelinedetail[3].recording_Start_point_ratio+'%'}}></div>
    <span className="hovertext" data-hover="Recording Started"></span>
    <div style={{backgroundColor:'brown', width:timelinedetail[3].recordingratio+'%',height:'100%',display:'table-cell'}}></div>
    <span className="hovertext" data-hover="Recording Ended"></span>
    <div className="afterrecording" style={{width:timelinedetail[3].recording_end_point_ratio+'%'}}></div>
  </div>
  </div>
  </div>
 
)
else 
return (
  <div id="video-player-screens">
  </div>
)
    };
    



export default Timelines