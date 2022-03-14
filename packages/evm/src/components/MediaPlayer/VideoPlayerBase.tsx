import React, { useState, useEffect } from "react";
import VideoScreen from "./VideoScreen";
import Timelines from "./Timeline";
import "./VideoPlayer.scss";
import { CRXButton } from "@cb/shared";
import Slider from "@material-ui/core/Slider";
import { useInterval } from 'usehooks-ts'
import VolumeControl from "./VolumeControl";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import moment from 'moment';


var videoElement :any

type Timeline = {
  recording_Start_point_ratio: number;
  recording_end_point_ratio: number;
  recordingratio:number;
  
}

type videoPlayer = {
  speedFinderDown?:string
  speedFinderUp?:string,
  secondUp?:boolean,
  thirdUp?:boolean,
  secondDown?:boolean,
  thirdDown?:boolean,
  disabledDown?:boolean,
  disabledUp?:boolean,
  speed?:any,
  resumeBar?:boolean,

}

const VideoPlayerBase = (props: any) => {

  const screenViews = {
    "Single": 0,
    "SideBySide": 1,
    "PicturesOnSide": 2,
    "Grid": 3,
    "PitureInPicture": 4
  };
  
  const [buffering,setBuffering] = useState<boolean>(false)

  const [maxminendpoint, setmaxminendpoint] = useState<string[]>([]);
  const [finalduration, setfinalduration] = useState<string>();
  const [timelineduration, settimelineduration] = useState(0);
  const [timelinedetail, settimelinedetail] = React.useState<Timeline[]>([]);


  const [viewNumber,setViewNumber] = useState(0);

  const [controlBar, setControlBar] = useState(0);

  const [timer, setTimer] = useState<number>(0);


  const [isPlaying, setPlaying] = useState<boolean>(false)

  const [videoHandle, setVideoHandle] = useState<any>(null); 

  const [ViewScreen,setViewScreen] = useState(true);

  const [controllerBar,setControllerBar] = useState(true);

  const [styleScreen, setStyleScreen] = useState(false);

  
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState<videoPlayer>({
    speedFinderDown:"",
    speedFinderUp:"",
    secondUp:false,
    thirdUp:false,
    secondDown:false,
    thirdDown:false,
    disabledDown:false,
    disabledUp:false,
    speed:1000,
    resumeBar:false,
   
   
  });

  const data = props.history.location.state?.data
  ///Data Array contain all detaill about File Url id we can use it as VideoData.
  //Delay need to created upto Start point of recording point of each video given in timelinedetail
  //video size max upto net duration
  React.useEffect(() => {
      Durationfinder(data);
      setLoading(true)

      },data);

    
     
  const VideoData = [
    { id: "Video-1", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", duration: 596 },
    { id:"3", src: "https://www.w3schools.com/tags/movie.mp4"},
    { id:"2", src: "http://media.w3.org/2010/05/bunny/movie.mp4" },
    { id:"4", src: "https://www.w3schools.com/tags/movie.mp4"} ,
     { id:"5", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
     { id:"6", src: "http://media.w3.org/2010/05/bunny/movie.mp4" }
  ];
  async function Durationfinder(data:any) {
    let maxminarray: string[] = [];
    var maximum_endpoint=timeextractor(data[0].recording.ended)
    var minimum_startpont=timeextractor(data[0].recording.started)
    for(let x=1;x<data.length;x++)
    {
        var T_max_endpoint=timeextractor(data[x].recording.ended)
        var T_min_startpont=timeextractor(data[x].recording.started)
        maximum_endpoint=timeoperation(maximum_endpoint,T_max_endpoint,"getmax")
        minimum_startpont=timeoperation(T_min_startpont,minimum_startpont,"getmin")
    }
    var duration=moment.utc(moment(maximum_endpoint,"HH:mm:ss").diff(moment(minimum_startpont,"HH:mm:ss"))).format("HH:mm:ss" );
    var durationinformat=moment(duration,"HH:mm:ss").format("mm:ss")
   await setfinalduration(durationinformat.toString())
    var finalduration=convert_to_Second(duration)
    await settimelineduration(finalduration)
    //first entity is max second is min
    maxminarray.push(maximum_endpoint);
    maxminarray.push(minimum_startpont);
    setmaxminendpoint(maxminarray);
    await TimelineData_generator(data,minimum_startpont,finalduration);
  
  }
  const convert_to_Second =(time:any)=>{
    
    const answer_array = time.split(':')
    var second=parseInt(answer_array[0])*60*60+parseInt(answer_array[1])*60+parseInt(answer_array[2]);
    return second
  
  }
  const timeoperation =(time:any,time2:any,operation:string)=>{
    if(operation=="getmax")
    {
      var value=moment(time, "HH:mm:ss").isAfter(moment(time2, "HH:mm:ss"))
      if(value)
      {
        return time
      }
      else if(moment(time, "HH:mm:ss").isSame(moment(time2, "HH:mm:ss")))
      {
        return time
      }
      else{
        return time2
      }
    }
    if(operation=="getmin")
    {
      var value=moment(time, "HH:mm:ss").isBefore(moment(time2, "HH:mm:ss"))
      if(value)
      {
        return time
      }
      else if(moment(time, "HH:mm:ss").isSame(moment(time2, "HH:mm:ss")))
      {
        return time
      }
      else{
        return time2
      }
  
    }
  }
  const timeextractor = (data:any)=>{
    const answer_array = data.split('T');
    const answer_array2= answer_array[1].split('.')
    return answer_array2[0];
  }
  
  
  
  async function TimelineData_generator(data:any,minstartpoint:string,duration:number){
  let rowdetail: Timeline[] = [];
  for(let x=0;x<data.length;x++)
  {
  let recording_start_time=moment(timeextractor(data[x].recording.started),"HH:mm:ss").format('HH:mm:ss');
  let recording_start_point=convert_to_Second(moment.utc(moment(recording_start_time,"HH:mm:ss").diff(moment(minstartpoint,"HH:mm:ss"))).format("HH:mm:ss" ));
  let recording_Start_point_ratio=Math.ceil((recording_start_point/duration)*100)
  let recording_end_time=moment(timeextractor(data[x].recording.ended),"HH:mm:ss").format('HH:mm:ss');
  let recording_end_point=convert_to_Second(moment.utc(moment(recording_end_time,"HH:mm:ss").diff(moment(minstartpoint,"HH:mm:ss"))).format("HH:mm:ss" ));
  let recording_end_point_ratio=100-Math.ceil((recording_end_point/duration)*100)
  let recordingratio=96-recording_end_point_ratio-recording_Start_point_ratio
  let myData: Timeline={recording_Start_point_ratio:recording_Start_point_ratio,recording_end_point_ratio:recording_end_point_ratio,recordingratio:recordingratio}
  
  console.log("Mydata")
  console.log(myData)

  rowdetail.push(myData);
  }
  
  await settimelinedetail(rowdetail)
  }
  


  const handleControlBarChange = (event: any, newValue: any) => {
    setTimer(newValue);
    setControlBar(newValue);
    videoHandle.currentTime = newValue
  };

  const screenClick = (view: number, event: any) => {
    return setViewNumber(view);
  }

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  };

  const handlePlayPause = ()=>{
    setPlaying(!isPlaying);
    if(!isPlaying){
        videoHandle.currentTime = timer;
        videoHandle.play(); 
        setState({
          thirdUp:false,
          secondUp:false,
          secondDown:false,
          thirdDown:false,
          disabledDown:true,
          disabledUp:true
        })
    }
    else
      videoHandle.pause();
      videoHandle.playbackRate = 1;
      setState({
        speedFinderUp:"",
        speedFinderDown:"",
        disabledDown:false,
        disabledUp:false,
        speed:1000,
        resumeBar:false
        
      })
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
    videoElement = document.querySelector("#Video-1");

    videoElement?.addEventListener("canplay", function () {
      setBuffering(true)
    }, true);

    videoElement?.addEventListener("waiting", function () {
     setBuffering(false)
    }, true);
    setVideoHandle(videoElement);
  });


  useInterval(
    () => {
      // Your custom logic here
    if (buffering === true){

      if (isPlaying === true){
  
        if (timer < videoElement.duration) {
          var timerValue = timer + 1;
          setTimer(timerValue);
          setControlBar(timerValue);
        }
      }
    }

    else if (buffering === false){
      videoHandle.stop()
    }
      else {
        reset();
      }
    },
    // Speed in milliseconds or null to stop it
    isPlaying ? state.speed : null,
  );

  const setVolumeHandle = (volume: number) => {
    videoHandle.volume = (volume / 100);
  }

  const setMuteHandle = (isMuted: boolean) => {
    videoHandle.muted = isMuted;
  }
  const reset = () => {
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
    var timer: any;
    const handleTimer = () => {
      const mouseStopped = () => {
        setControllerBar(false);
      }
      setControllerBar(true);
      clearTimeout(timer);
      timer = setTimeout(mouseStopped, 3000);
    }
    document.addEventListener("mousemove", handleTimer);
  }

  const screenViewChange = (e: any, h: any) => {
    if (h.active == true) {
      handleScreenShow();
      setStyleScreen(true);
    } else {
      setViewScreen(true);
      setStyleScreen(false);
    }
  }


  let disabled = isPlaying === false ? true : false; 
  let fullDown = state.disabledDown === true ? true : false;
  let fullUp = state.disabledUp === true ? true : false;
  let resumeChecker =  state.resumeBar === true ? false : true;
 
  const speedUp = () => {
    videoHandle.playbackRate = 2;
    setState({
      speedFinderDown:(""),
      speedFinderUp:("x1"),
      secondUp:true,
      thirdDown:false,
      secondDown:false,
      speed:500
    })
    fullDown = false;
      if(secondUp === true) {
        videoHandle.playbackRate = 3;
        setState({
          speedFinderDown:(""),
          speedFinderUp:("x2"),
          thirdUp:true,
          thirdDown:false,
          secondDown:false,
          speed:333.33
        })
      } 
      if(thirdUp === true) {
        videoHandle.playbackRate = 4;
        setState({
          speedFinderDown:(""),
          speedFinderUp:("x3"),
          thirdDown:false,
          secondDown:false,
          disabledUp:true,
          speed:250,
          resumeBar:true
        })
      }
       
      if(disabledDown === true) {
        setState({
          thirdDown:false,
          secondDown:false,
          disabledDown:false
        })
    
      }
  }

  const speedDown = () => {
    videoHandle.playbackRate = 0.8;
    setState({
      speedFinderDown:("x1"),
      speedFinderUp:(""),
      thirdUp:false,
      secondUp:false,
      secondDown:true,
      speed:1250
    })
      if(secondDown === true) {
        videoHandle.playbackRate = 0.6;
        setState({
          speedFinderDown:("x2"),
          speedFinderUp:(""),
          thirdUp:false,
          secondUp:false,
          thirdDown:true,
          speed:1500
        })
      } 
      if(thirdDown === true) {
        videoHandle.playbackRate = 0.4;
        setState({
          speedFinderDown:("x3"),
          speedFinderUp:(""),
          thirdUp:false,
          secondUp:false,
          disabledDown:true,
          speed:1700,
          resumeBar:true
        })
      }
      if(state.disabledUp === true) {
        setState({
          thirdUp:false,
          secondUp:false,
          disabledUp:false
        })
      }
  }

  const resumeButton = () => {
    videoHandle.playbackRate = 1;
    setState({
      speedFinderDown:(""),
      speedFinderUp:(""),
      secondUp:false,
      thirdUp:false,
      secondDown:false,
      thirdDown:false,
      disabledDown:false,
      disabledUp:false,
      speed:1000,
      resumeBar:false
    })
  }

  const {  speedFinderDown,speedFinderUp,secondUp,thirdUp ,secondDown,thirdDown , disabledDown} = state
  return (
    <div id="video-player" >
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''}  >
        <div id="screens">
          <VideoScreen videoData={VideoData} viewNumber={viewNumber} />
        </div>
        <div id="timelines" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
          {/* TIME LINES BAR HERE */}
          {loading?(
        <Timelines timelinedetail={timelinedetail} duration={timelineduration} />
           ):(<div></div>) }
          
        </div>
        <div id="controls" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
        <div>
            <div className="main-control-bar">
              <Slider
                value={typeof controlBar === 'number' ? controlBar : 0}
                onChange={handleControlBarChange}
                aria-labelledby="input-slider"
                step={1}
                min={0}
                max={timelineduration}
              />
            </div>
            <div className="TTview">
              <div>
              <p id="counter">{formatDuration(controlBar)}</p>
            </div>
            <div>
              <p id="counter">{finalduration}</p>
            </div>
            </div>
          </div>
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
                {ViewScreen ? <div onClick={viewScreenEnter} ><i className="fas fa-expand"></i></div> : <div onClick={viewScreenExit}><i className="fas fa-compress-wide"></i></div>}
              </div>
              <div>
                <VolumeControl setVolumeHandle={setVolumeHandle} setMuteHandle={setMuteHandle} />
              </div>
            </div>
          </div>

      

        </div>
      </FullScreen>
    </div>
  );
}

export default VideoPlayerBase