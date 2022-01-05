import React, { useState, useEffect } from "react";
import VideoScreen from "./VideoScreen";
import "./VideoPlayer.scss";
import {CRXButton} from "@cb/shared";
import Slider from "@material-ui/core/Slider";
import { useInterval } from 'usehooks-ts'
import VolumeControl from "./VolumeControl";



const VideoPlayerBase = ( ) => {

    const screenViews ={
        "Single": 0,
        "SideBySide":1,
        "PicturesOnSide":2,
        "Grid":3,
        "PitureInPicture": 4
    };

    const [viewNumber,setViewNumber] = useState(0);

    const [controlBar, setControlBar] = useState(0);

    const [timer, setTimer] = useState<number>(0);

    const [speed, setSpeed] = useState<number>(1000);

    const [isPlaying, setPlaying] = useState<boolean>(false)

    const [videoHandle, setVideoHandle] = useState<any>(null); 

    const VideoData = [
        { id:"Video-1", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 596 },
        // { id:"3", src: "https://www.w3schools.com/tags/movie.mp4" },
        // { id:"2", src: "http://media.w3.org/2010/05/bunny/movie.mp4" },
        // { id:"4", src: "https://www.w3schools.com/tags/movie.mp4"} ,
        // { id:"5", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        // { id:"6", src: "http://media.w3.org/2010/05/bunny/movie.mp4" }
    ];



    const handleControlBarChange = (event:any, newValue:any) => {
        setTimer(newValue);
        setControlBar(newValue);
        videoHandle.currentTime = newValue
      };

    const screenClick = (view:number, event:any) => {
        return setViewNumber(view);
    }

    const formatDuration = (value:number) => {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
    };

    const handlePlayPause = ()=>{
        setPlaying(!isPlaying);
        if(!isPlaying){
            videoHandle.currentTime = timer;
            videoHandle.play();
        }
        else
            videoHandle.pause();
     };

    useEffect(() => {      
        let videoElement = document.querySelector("#Video-1");

        videoElement?.addEventListener("canplay", function () {
            console.log("API Canplay");
        }, true);

        videoElement?.addEventListener("waiting", function () {
            console.log("API Waiting");
        }, true);

        setVideoHandle(videoElement);
     });

    useInterval(
        () => {
          // Your custom logic here
          console.log(timer)
          if(timer < 596){
            var timerValue = timer+1;
            setTimer(timerValue);
            setControlBar(timerValue);
          }
          else{
            reset();
          }
        },
        // Speed in milliseconds or null to stop it
        isPlaying ? speed : null,
      );

      const setVolumeHandle=( volume:number )=>{
        videoHandle.volume = (volume/100);
      }

      const setMuteHandle=( isMuted:boolean )=>{
        videoHandle.muted = isMuted;
      }
      const reset = () =>{
        setPlaying(false);
        setTimer(0);
        setControlBar(0);
        videoHandle.currentTime = 0;
      }

    return (
        <div id="video-player">
            <div id="screens">
                <VideoScreen videoData={VideoData} viewNumber={viewNumber} />
            </div>
            <div id="timelines">
                 {/* TIME LINES BAR HERE */}
            </div>
            <div id="controls">
                <CRXButton id="abcasd" color="primary" onClick={screenClick.bind(this, screenViews.Single)} variant="contained" className="videoPlayerBtn" value="asdasd" >
                    Single View
                </CRXButton>
                <CRXButton color="primary" onClick={screenClick.bind(this, screenViews.SideBySide)} variant="contained" className="videoPlayerBtn">
                    Side by Side
                </CRXButton>
                <CRXButton color="primary" onClick={screenClick.bind(this, screenViews.PicturesOnSide)} variant="contained" className="videoPlayerBtn" >
                    Pictures on Side View
                </CRXButton>
                <CRXButton color="primary" onClick={screenClick.bind(this, screenViews.Grid)} variant="contained" className="videoPlayerBtn" >
                    Grid 
                </CRXButton>

                <div className="PlayPause-container">
                    <CRXButton color="primary" onClick={handlePlayPause} variant="contained" className="videoPlayerBtn" >
                        {isPlaying ? 'pause' : 'play'}
                    </CRXButton>
                     <p id="counter">{formatDuration(controlBar)}</p>
                </div>
                <div className="main-control-bar">
                    <Slider
                        value={typeof controlBar === 'number' ? controlBar : 0}
                        onChange={handleControlBarChange}
                        aria-labelledby="input-slider"
                        step={1}
                        min={0}
                        max={596}
                    />
                </div>
                <VolumeControl setVolumeHandle={setVolumeHandle} setMuteHandle={setMuteHandle}/>
            </div>
        </div>
    );
}

export default VideoPlayerBase