import React, { useState, useEffect } from "react";
import VideoScreen from "./VideoScreen";
import "./VideoPlayer.scss";
import {CRXButton} from "@cb/shared";
import Slider from "@material-ui/core/Slider";
import { useInterval } from 'usehooks-ts'
import VolumeControl from "./VolumeControl";
import { on } from "events";
import {  Menu, MenuButton , MenuItem } from "@szhsin/react-menu";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';


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

    const [ViewScreen,setViewScreen] = useState(true);

    const [progress, setProgress] = useState(0);

    const [progresstwo, setProgresstwo] = useState(0);

    const [progressthree, setProgressthree] = useState(0);
    
    const [progressfour, setProgressfour] = useState(0);

    const [controllerBar,setControllerBar] = useState(true);

    const [styleScreen, setStyleScreen] = useState(false);

    const [secondUp, setSecondUp] = useState(false);

    const [thirdUp , setThirdUp] = useState(false);

    const [disabledUp,setDisabledUp] = useState(false);
    
    const [secondDown, setSecondDown] = useState(false);

    const [thirdDown , setThirdDown] = useState(false);

    const [disabledDown,setDisabledDown] = useState(false);

    const [resumeBar,setResumeBar] = useState(false);
    
    const [speedFinderUp, setSpeedFinderUp] = useState("");

    const [speedFinderDown, setSpeedFinderDown] = useState("");






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
            setDisabledUp(true);
            setDisabledDown(true);
            setThirdDown(false);
            setSecondDown(false);
            setThirdUp(false);
            setSecondUp(false);
        }
        else
          videoHandle.pause();
          videoHandle.playbackRate = 1;
          setSpeed(1000);
          setDisabledUp(false);
          setDisabledDown(false);
          setSpeedFinderUp("");
          setSpeedFinderDown("");
          setResumeBar(false);
     };
  const handleReverse = () => {
    setPlaying(false);
    videoHandle.pause();
    videoHandle.currentTime = Math.round(videoHandle.currentTime - 1)
    handleControlBarChange(null, videoHandle.currentTime)
  };
  const handleforward = () => {
    setPlaying(false);
    videoHandle.pause();
    videoHandle.currentTime = Math.round(videoHandle.currentTime + 1)
    handleControlBarChange(null, videoHandle.currentTime)
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

      const handleScreenView = useFullScreenHandle();


      const viewScreenEnter = () => {
        handleScreenView.enter();
        setViewScreen(false);
      }

      const viewScreenExit = () => {
        handleScreenView.exit();
        setViewScreen(true);
      }

    const handleScreenShow = () => {
        var timer:any;
        const handleTimer = () => {
            const mouseStopped = () => {                                
                setControllerBar(false);
            }
            setControllerBar(true);
            clearTimeout(timer);
            timer=setTimeout(mouseStopped,3000);
        }
            document.addEventListener("mousemove",handleTimer);  
    }

    const screenViewChange = (e: any, h : any) => {
       if( h.active == true) {
            handleScreenShow();
            setStyleScreen(true);
        } else {
            setViewScreen(true);
            setStyleScreen(false);
        } 
    }
  

      useEffect(() => {
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              return 100;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
          });
        }, 1000);

        const timertwo = setInterval(() => {
            setProgresstwo((oldProgress) => {
              if (oldProgress === 100) {
                return 100;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 2000);

          const timerthree = setInterval(() => {
            setProgressthree((oldProgress) => {
              if (oldProgress === 100) {
                return 100;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 500);

          const timerfour = setInterval(() => {
            setProgressfour((oldProgress) => {
              if (oldProgress === 100) {
                return 100;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 1500);
      }, []);

      let disabled = isPlaying === false ? true : false; 
      let fullDown = disabledDown === true ? true : false;
      let fullUp = disabledUp === true ? true : false;
      let resumeChecker =  resumeBar === true ? false : true;
     
      const speedUp = () => {
        videoHandle.playbackRate = 2;
        setSpeed(500);
        setSecondUp(true);
        setThirdDown(false);
        setSecondDown(false);
        setSpeedFinderUp("x1");
        setSpeedFinderDown("");
        fullDown = false;
          if(secondUp === true) {
            videoHandle.playbackRate = 3;
            setSpeed(333.33);
            setThirdUp(true);
            setThirdDown(false);
            setSecondDown(false);
            setSpeedFinderUp("x2");
            setSpeedFinderDown("");
          } 
          if(thirdUp === true) {
            videoHandle.playbackRate = 4;
            setSpeed(250);
            setDisabledUp(true);
            setThirdDown(false);
            setSecondDown(false);
            setSpeedFinderUp("x3");
            setSpeedFinderDown("");
          }
            setResumeBar(true);
          if(disabledDown === true) {
            setDisabledDown(false);
            setThirdDown(false);
            setSecondDown(false);
        
          }
      }

      const speedDown = () => {
        videoHandle.playbackRate = 0.8;
        setSpeed(1250);
        setSecondDown(true);
        setThirdUp(false);
        setSecondUp(false);
        setSpeedFinderUp("");
        setSpeedFinderDown("x1");
          if(secondDown === true) {
            videoHandle.playbackRate = 0.6;
            setSpeed(1500);
            setThirdDown(true);
            setThirdUp(false);
            setSecondUp(false);
            setSpeedFinderUp("");
            setSpeedFinderDown("x2");
          } 
          if(thirdDown === true) {
            videoHandle.playbackRate = 0.4;
            setSpeed(1700);
            setDisabledDown(true);
            setThirdUp(false);
            setSecondUp(false);
            setSpeedFinderUp("");
            setSpeedFinderDown("x3");
          }
            setResumeBar(true);
          if(disabledUp === true) {
            setDisabledUp(false);
            setThirdUp(false);
            setSecondUp(false);
          }
      }

      const resumeButton = () => {
        videoHandle.playbackRate = 1;
        setSpeed(1000);
        setSecondDown(false);
        setThirdDown(false);
        setDisabledDown(false);
        setSecondUp(false);
        setThirdUp(false);
        setDisabledUp(false);
        setResumeBar(false);
        setSpeedFinderUp("");
        setSpeedFinderDown("");
      }
    
    return (
        <div id="video-player" >
            <FullScreen  onChange={screenViewChange } handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''  }  >
                <div id="screens">
                    <VideoScreen videoData={VideoData} viewNumber={viewNumber} />
                </div>
                <div id="timelines" style={{display: styleScreen == false ? 'block' : ''  }}    className={ controllerBar === true ? 'showControllerBar': 'hideControllerBar' }>
                    {/* TIME LINES BAR HERE */}
                    <Box className="timeLineBar" >
                    <LinearProgress variant="determinate" value={progress} />
                    <LinearProgress variant="determinate" value={progresstwo} color="secondary" />
                    <LinearProgress variant="determinate" value={progressthree} className="linearbarThird" />
                    <LinearProgress variant="determinate" value={progressfour} className="linearbarfourth" />
                    </Box>
                </div>
                <div id="controls" style={{display: styleScreen == false ? 'block' : ''  }} className={  controllerBar === true ? 'showControllerBar': 'hideControllerBar' }>
                    <div className="playerViewFlex">
                        <div className="playerViewLeft">
                            <div className="PlayPause-container">
                <CRXButton color="primary" onClick={handleReverse} variant="contained" className="videoPlayerBtn" >
                  <i className="fas fa-backward"></i>
                </CRXButton>
                                    <CRXButton color="primary" onClick={handlePlayPause} variant="contained" className="videoPlayerBtn" >
                                        {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                                    </CRXButton>
                <CRXButton color="primary" onClick={handleforward} variant="contained" className="videoPlayerBtn" >
                  <i className="fas fa-forward"></i>
                </CRXButton>
                                
                            </div>
                        </div> 
                        <div className="playerViewRight">
                          <div className="playBackMode"> 
                          <button  onClick={speedDown} disabled={disabled || fullDown } ><i className="fas fa-undo-alt"><span>{speedFinderDown}</span></i></button>
                          <button onClick={resumeButton} disabled={true && resumeChecker    }><i className="fas fa-minus"></i></button>
                          <button onClick={speedUp} disabled={disabled || fullUp  } ><i className="fas fa-redo-alt"><span>{speedFinderUp}</span></i></button>
                          </div>
                            <div className="MenuListGrid">
                                <Menu
                                        align="start"
                                        viewScroll="initial"
                                        direction="top"
                                        
                                        className="ViewScreenMenu"
                                        menuButton={
                                        <MenuButton>
                                        Select Screen View
                                        </MenuButton>
                                        }
                                    >
                                        <MenuItem onClick={screenClick.bind(this, screenViews.Single)}  >
                                            Single View
                                        </MenuItem>
                                        <MenuItem onClick={screenClick.bind(this, screenViews.SideBySide)}>
                                            Side by Side
                                        </MenuItem>
                                        <MenuItem onClick={screenClick.bind(this, screenViews.PicturesOnSide)}  >
                                        Pictures On Side View
                                        </MenuItem>
                                        <MenuItem onClick={screenClick.bind(this, screenViews.Grid)}>
                                        Grid
                                        </MenuItem>
                                </Menu >
                            </div>  
                            <div className="playerView">
                                {ViewScreen ? <div onClick={viewScreenEnter} ><i className="fas fa-expand"></i></div> : <div onClick={viewScreenExit}><i className="fas fa-compress-wide"></i></div> }
                            </div>
                            <div>
                                    <VolumeControl setVolumeHandle={setVolumeHandle} setMuteHandle={setMuteHandle}/>
                            </div>
                        </div>
                    </div>
                 
                    <div>
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
                        <div>
                          <p id="counter">{formatDuration(controlBar)}</p>
                        </div>
                    </div>
                   
                </div>
            </FullScreen>    
        </div>
    );
}

export default VideoPlayerBase