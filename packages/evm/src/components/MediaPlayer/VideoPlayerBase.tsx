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
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import VideoPlayerSnapshot from "./VideoPlayerSnapshot";
import moment, { duration } from 'moment';
import VideoPlayerBookmark from "./VideoPlayerBookmark";
import { CRXToaster } from "@cb/shared";


var videoElements: any[] = [];

type Timeline = {
  recording_start_point:number;
  recording_Start_point_ratio: number;
  recording_end_point:number;
  recording_end_point_ratio: number;
  recordingratio: number;
  bookmarks: any;
  startdiff: number;
  video_duration_in_second: number;
  src: string;
  id: string
}

type MaxMinEndpoint = {
  Min_Start_point: string;
  Max_end_point: string;
}


const videoSpeed = [
  {
    "mode": -3,
    "playBackRate":0.4,
    "speed": 1700,
  },
  {
    "mode": -2,
    "playBackRate":0.6,
    "speed": 1500,
  },
  {
    "mode": -1,
    "playBackRate":0.8,
    "speed": 1250,
  },
  {
    "mode": 0,
    "playBackRate": 1,
    "speed": 1000,
  },
  {
    "mode": 1,
    "playBackRate":2,
    "speed": 500,
  },
  {
    "mode": 2,
    "playBackRate":3,
    "speed": 333.33,
  },
  {
    "mode": 3,
    "playBackRate":4,
    "speed": 250,
  }
]

const VideoPlayerBase = (props: any) => {

  const screenViews = {
    "Single": 0,
    "SideBySide": 1,
    "PicturesOnSide": 2,
    "Grid": 3,
    "PitureInPicture": 4
  };

  const [buffering, setBuffering] = useState<boolean>(false)
  const [totalDuration, setTotalDuration] = useState<number>(1);

  const [maxminendpoint, setmaxminendpoint] = useState<MaxMinEndpoint>();
  const [bookmarktime, setbookmarktime] = useState<number>();
  const [finalduration, setfinalduration] = useState<string>();
  const [timelineduration, settimelineduration] = useState(0);
  const [timelinedetail, settimelinedetail] = React.useState<Timeline[]>([]);


  const [viewNumber, setViewNumber] = useState(0);

  const [controlBar, setControlBar] = useState(0);

  const [timer, setTimer] = useState<number>(0);
  const [mode, setMode] = useState<number>(0);


  const [isPlaying, setPlaying] = useState<boolean>(false)

  const [videoHandlers, setVideoHandlers] = useState<any[]>([]);

  const [ViewScreen, setViewScreen] = useState(true);


  const [openBookmarkForm, setopenBookmarkForm] = React.useState(false);
  const [editBookmarkForm, seteditBookmarkForm] = React.useState(false);
  const [bookmark, setbookmark] = useState<any>({});
  const [data, setdata] = React.useState<any>([]);
  const [bookmarkAssetId, setbookmarkAssetId] = React.useState<number>();
  const bookmarkMsgRef = React.useRef<typeof CRXToaster>(null);


  const [controllerBar, setControllerBar] = useState(true);

  const [styleScreen, setStyleScreen] = useState(false);


  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState<number>(1000);

  React.useEffect(() => {
    setdata(props.history.location.state?.data);
  }, []);

  const EvidenceId = props.history.location.state?.EvidenceId
  ///Data Array contain all detaill about File Url id we can use it as VideoData.
  //Delay need to created upto Start point of recording point of each video given in timelinedetail
  //video size max upto net duration
  React.useEffect(() => {
    if (data.length > 0) {
      Durationfinder(data);
      setLoading(true)
    }
  }, [data]);

  React.useEffect(() => {
    if (editBookmarkForm) {
      setopenBookmarkForm(true);
    }
  }, [editBookmarkForm]);



  async function Durationfinder(data: any) {
    var maximum_endpoint = timeextractor(data[0].recording.ended)
    var minimum_startpont = timeextractor(data[0].recording.started)
    for (let x = 1; x < data.length; x++) {
      var T_max_endpoint = timeextractor(data[x].recording.ended)
      var T_min_startpont = timeextractor(data[x].recording.started)
      maximum_endpoint = timeoperation(maximum_endpoint, T_max_endpoint, "getmax")
      minimum_startpont = timeoperation(T_min_startpont, minimum_startpont, "getmin")
    }
    var duration = moment.utc(moment(maximum_endpoint, "HH:mm:ss").diff(moment(minimum_startpont, "HH:mm:ss"))).format("HH:mm:ss");
    var durationinformat = moment(duration, "HH:mm:ss").format("mm:ss")
    await setfinalduration(durationinformat.toString())
    var finalduration = convert_to_Second(duration)
    await settimelineduration(finalduration)
    //first entity is max second is min
    let maxminarray: MaxMinEndpoint = { Min_Start_point: minimum_startpont, Max_end_point: maximum_endpoint }
    setmaxminendpoint(maxminarray);
    await TimelineData_generator(data, minimum_startpont, finalduration);

  }
  const convert_to_Second = (time: any) => {

    const answer_array = time.split(':')
    var second = parseInt(answer_array[0]) * 60 * 60 + parseInt(answer_array[1]) * 60 + parseInt(answer_array[2]);
    return second

  }
  const convert_Milisecond_to_Second = (milliseconds: any) => {
    var second: number = milliseconds / 1000;
    return second
  }
  const timeoperation = (time: any, time2: any, operation: string) => {
    if (operation == "getmax") {
      var value = moment(time, "HH:mm:ss").isAfter(moment(time2, "HH:mm:ss"))
      if (value) {
        return time
      }
      else if (moment(time, "HH:mm:ss").isSame(moment(time2, "HH:mm:ss"))) {
        return time
      }
      else {
        return time2
      }
    }
    if (operation == "getmin") {
      var value = moment(time, "HH:mm:ss").isBefore(moment(time2, "HH:mm:ss"))
      if (value) {
        return time
      }
      else if (moment(time, "HH:mm:ss").isSame(moment(time2, "HH:mm:ss"))) {
        return time
      }
      else {
        return time2
      }

    }
  }
  const timeextractor = (data: any) => {
    const answer_array = data.split('T');
    const answer_array2 = answer_array[1].split('.')
    return answer_array2[0];
  }



  async function TimelineData_generator(data: any, minstartpoint: string, duration: number) {
    let rowdetail: Timeline[] = [];
    for (let x = 0; x < data.length; x++) {
      let recording_start_time = moment(timeextractor(data[x].recording.started), "HH:mm:ss").format('HH:mm:ss');
      let recording_start_point = convert_to_Second(moment.utc(moment(recording_start_time, "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"))).format("HH:mm:ss"));
      let recording_Start_point_ratio = Math.ceil((recording_start_point / duration) * 100)
      let recording_end_time = moment(timeextractor(data[x].recording.ended), "HH:mm:ss").format('HH:mm:ss');
      let recording_end_point = convert_to_Second(moment.utc(moment(recording_end_time, "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"))).format("HH:mm:ss"));
      let video_duration_in_second = moment(recording_end_time, "HH:mm:ss").diff(moment(recording_start_time, "HH:mm:ss"))/1000;//convert_to_Second(moment(moment(recording_end_time, "HH:mm:ss").diff(moment(recording_start_time, "HH:mm:ss"))).format('HH:mm:ss'));
      let recording_end_point_ratio = 100 - Math.ceil((recording_end_point / duration) * 100)
      let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio
      let startdiff = moment(timeextractor(data[x].recording.started), "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"));

      let myData: Timeline =
      {
        recording_start_point:recording_start_point,
        recording_Start_point_ratio: recording_Start_point_ratio,
        recording_end_point:recording_end_point,
        recording_end_point_ratio: recording_end_point_ratio,
        recordingratio: recordingratio,
        bookmarks: data[x].bookmarks,
        startdiff: startdiff,
        video_duration_in_second:video_duration_in_second,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        id: "Video-" + x,
      }
      rowdetail.push(myData);
    }

    await settimelinedetail(rowdetail)
  }



  const handleControlBarChange = (event: any, newValue: any) => {
    setTimer(newValue);
    setControlBar(newValue);
    videoHandlers.map((videoHandle: any) => {
      hanldeVideoStartStop(newValue, videoHandle, false);
    })
  };

  const screenClick = (view: number, event: any) => {
    return setViewNumber(view);
  }

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  };

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
    if (!isPlaying) {
      videoHandlers.map((videoHandle: any) => {
        hanldeVideoStartStop(timer, videoHandle, true);
      });
    }
    else {
      videoHandlers.map((videoHandle: any) => {
        videoHandle.pause();
        videoHandle.playbackRate = 1;
      });
    }
  };
  const handleReverse = () => {
    setPlaying(false);
    videoHandlers.map((videoHandle: any) => {
      videoHandle.pause();
      hanldeVideoStartStop(Math.round(videoHandle.currentTime - 1), videoHandle, false);
    });
    handleControlBarChange(null, timer - 1)
  };
  const handleforward = () => {
    setPlaying(false);
    videoHandlers.map((videoHandle: any) => {
      videoHandle.pause();
      hanldeVideoStartStop(Math.round(videoHandle.currentTime + 1), videoHandle, false);
    });
    handleControlBarChange(null, timer + 1)
  };
    const handlebookmark = () => {
      videoHandlers.map((videoHandle: any) => {
        videoHandle.pause();
      });
      const playerCurrentTime = Math.round(timer*1000);
      var startdiff = moment(timeextractor(data[0].recording.started), "HH:mm:ss").diff(moment(maxminendpoint?.Min_Start_point, "HH:mm:ss"));
      var enddiff = moment(timeextractor(data[0].recording.ended), "HH:mm:ss").diff(moment(maxminendpoint?.Min_Start_point, "HH:mm:ss"));
      if(playerCurrentTime>=startdiff && playerCurrentTime<=enddiff){
        const BKMTime = playerCurrentTime-startdiff;
        let isOccur = onAddCheckDuplicate(BKMTime); // prevent to add bookmark on same position
        if(!isOccur)
        {
          setbookmarktime(BKMTime);
          setPlaying(false);
          setopenBookmarkForm(true);
        }
      }
      else{
        bookmarkMsgRef.current.showToaster({message: "Please seek to appropriate time of master camera to bookmark", variant: "Error", duration: 5000, clearButtton: true
        });
      }
    };

  const onAddCheckDuplicate = (BKMTime: number) => {
    const minBKMTime = BKMTime -1000;
    const mixBKMTime = BKMTime +1000;
    let error = false;
    data[0].bookmarks?.map((y:any)=>
    {
      if(minBKMTime<=y.position && mixBKMTime>=y.position){
        error = true;
        bookmarkMsgRef.current.showToaster({message: "Unable To Add Duplicate Bookmark", variant: "Error", duration: 5000, clearButtton: true
      });}
    })
    return error;
  }

  useEffect(() => {
    timelinedetail.map((x: any) => {
      var videoElement = document.querySelector("#" + x.id);
      videoElements.push(videoElement);

      videoElement?.addEventListener("canplay", function () {
        setBuffering(true)
      }, true);

      videoElement?.addEventListener("waiting", function () {
        setBuffering(false)
      }, true);
    })
    setVideoHandlers(videoElements);
  }, [timelinedetail]);

  const hanldeVideoStartStop = (timer: number, videoHandle: any, applyAction: boolean) => {
    var video: any = timelinedetail.find((x: any) => x.id == videoHandle.id);
    var difference = timer - (video.recording_start_point);
    var endPointDifference = (video.recording_end_point) - timer;
    videoHandle.currentTime = difference > 0 && endPointDifference > 0 ? difference : 0;
    if (applyAction) {
      if (videoHandle.currentTime > 0) {
        videoHandle.play();
      }
      else {
        videoHandle.pause();
      }
    }
  }

  useInterval(
    () => {
      if (buffering === true) {
        if (isPlaying === true) {
          if (timer < timelineduration) {
            var timerValue = timer + 1;
            setTimer(timerValue);
            setControlBar(timerValue);

            videoHandlers.map((videoHandle: any) => {
              hanldeVideoStartStop(timerValue, videoHandle, true);
            });
          }
          else
          {
            setPlaying(false);
            videoHandlers.map((videoHandle: any) => {
              videoHandle.stop();
            });
          }
        }
      }
      else if (buffering === false) {
        videoHandlers.map((videoHandle: any) => {
          videoHandle.stop()
        });
      }
      else {
        reset();
      }
    },
    // Speed in milliseconds or null to stop it
    isPlaying ? speed : null,
  );

  const setVolumeHandle = (volume: number) => {
    videoHandlers.map((videoHandle: any) => {
      videoHandle.volume = (volume / 100);
    });
  }

  const setMuteHandle = (isMuted: boolean) => {
    videoHandlers.map((videoHandle: any) => {
      videoHandle.muted = isMuted;
    });
  }
  const reset = () => {
    setPlaying(false);
    setTimer(0);
    setControlBar(0);
    videoHandlers.map((videoHandle: any) => {
      hanldeVideoStartStop(0, videoHandle, true);
    });
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

  const modeSet = (Mode:number) => {
    var modeObj = videoSpeed.find((x:any) => x.mode == Mode);
    if(modeObj)
    {
      setMode(Mode);
      videoHandlers.map((videoHandle: any) => {
        videoHandle.playbackRate = modeObj?.playBackRate;
      });
      setSpeed(modeObj.speed);
    }
  }


  return (
    <div id="video-player" >
      <CRXToaster ref={bookmarkMsgRef} />
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''}  >
        <div id="screens">
          <VideoScreen videoData={timelinedetail} viewNumber={viewNumber} />
        </div>
        <div id="timelines" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
          {/* TIME LINES BAR HERE */}
          {loading ? (
            <Timelines
              timelinedetail={timelinedetail}
              duration={timelineduration}
              seteditBookmarkForm={seteditBookmarkForm}
              bookmark={bookmark}
              setbookmark={setbookmark}
              setbookmarkAssetId={setbookmarkAssetId}
            />
          ) : (<></>)}

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
                <CRXButton color="primary" onClick={handlebookmark} variant="contained" className="videoPlayerBtn">
                  <i className="fas fa-bookmark"></i>
                </CRXButton>

              </div>
            </div>
            <div className="playerViewRight">
              <div className="playBackMode">
                <button onClick={() => modeSet(mode - 1)} ><i className="fas fa-undo-alt"><span>{mode < 0 ? mode + "X" : ""}</span></i></button>
                <button onClick={() => modeSet(0)}><i className="fas fa-minus"></i></button>
                <button onClick={() => modeSet(mode + 1)} ><i className="fas fa-redo-alt"><span>{mode > 0 ? mode + "X" : "" }</span></i></button>
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
      {openBookmarkForm && <VideoPlayerBookmark
        setopenBookmarkForm={setopenBookmarkForm}
        seteditBookmarkForm={seteditBookmarkForm}
        openBookmarkForm={openBookmarkForm}
        editBookmarkForm={editBookmarkForm}
        videoHandle={videoHandlers[0]}
        AssetData={data[0]}
        EvidenceId={EvidenceId}
        BookmarktimePositon={bookmarktime}
        bookmark={bookmark}
        Data={data}
        setData={setdata}
        bookmarkAssetId={bookmarkAssetId}
        bookmarkMsgRef={bookmarkMsgRef}
      />}
    </div>
  );
}

export default VideoPlayerBase