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
import VideoPlayerNote from "./VideoPlayerNote";
import moment, { duration } from 'moment';
import VideoPlayerBookmark from "./VideoPlayerBookmark";
import { CRXToaster } from "@cb/shared";
import VideoPlayerFastFwRw from "./VideoPlayerFastFwRw";
import { FormControlLabel, Switch } from "@mui/material";


var videoElements: any[] = [];

type Timeline = {
  recording_start_point: number;
  recording_Start_point_ratio: number;
  recording_end_point: number;
  recording_end_point_ratio: number;
  recordingratio: number;
  bookmarks: any;
  notes: any
  startdiff: number;
  video_duration_in_second: number;
  src: string;
  id: string
  enableDisplay: boolean,
  indexNumberToDisplay: number,
  camera: string
}

type MaxMinEndpoint = {
  Min_Start_point: string;
  Max_end_point: string;
}


const videoSpeed = [
  {
    "mode": -3,
    "playBackRate": 0.4,
    "speed": 1700,
  },
  {
    "mode": -2,
    "playBackRate": 0.6,
    "speed": 1500,
  },
  {
    "mode": -1,
    "playBackRate": 0.8,
    "speed": 1250,
  },
  {
    "mode": 0,
    "playBackRate": 1,
    "speed": 1000,
  },
  {
    "mode": 1,
    "playBackRate": 2,
    "speed": 500,
  },
  {
    "mode": 2,
    "playBackRate": 3,
    "speed": 333.33,
  },
  {
    "mode": 3,
    "playBackRate": 4,
    "speed": 250,
  }
]

const VideoPlayerBase = (props: any) => {

  const screenViews = {
    "Single": 1,
    "SideBySide": 2,
    "VideosOnSide": 3,
    "Grid": 4,
    "Grid6": 6
  };

  const [bufferingArray, setBufferingArray] = React.useState<any[]>([]);
  const [bufferingArrayFwRw, setBufferingArrayFwRw] = React.useState<any[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(1);
  const [visibleThumbnail, setVisibleThumbnail] = useState<number[]>([]);

  const [maxminendpoint, setmaxminendpoint] = useState<MaxMinEndpoint>();
  const [bookmarktime, setbookmarktime] = useState<number>();
  const [finalduration, setfinalduration] = useState<string>();
  const [timelineduration, settimelineduration] = useState(0);
  const [timelinedetail, settimelinedetail] = React.useState<Timeline[]>([]);


  const [viewNumber, setViewNumber] = useState(1);
  const [mapEnabled, setMapEnabled] = useState<boolean>(false);
  const [multiTimelineEnabled, setMultiTimelineEnabled] = useState<boolean>(true);
  const [singleTimeline, setSingleTimeline] = useState<boolean>(false);

  const [controlBar, setControlBar] = useState(0);

  const [timer, setTimer] = useState<number>(0);
  const [timerFwRw, setTimerFwRw] = useState<number[]>([]);
  const [mode, setMode] = useState<number>(0);
  const [modeFw, setModeFw] = useState<number>(0);
  const [modeRw, setModeRw] = useState<number>(0);
  const [curractionFwRw, setcurractionFwRw] = useState({
    currmode: 0,
    currcase: 0
  });


  const [isPlaying, setPlaying] = useState<boolean>(false)
  const [isPlayingFwRw, setisPlayingFwRw] = useState<boolean>(false)
  const [isOpenWindowFwRw, setisOpenWindowFwRw] = useState<boolean>(false)
  const [isvideoHandlersFwRw, setisvideoHandlersFwRw] = useState<boolean>(false)

  const [videoHandlers, setVideoHandlers] = useState<any[]>([]);
  const [videoHandlersFwRw, setVideoHandlersFwRw] = useState<any[]>([]);
  const [videotimerFwRw, setvideoTimerFwRw] = useState<any[]>([]);

  const [ViewScreen, setViewScreen] = useState(true);


  const [openBookmarkForm, setopenBookmarkForm] = React.useState(false);
  const [openNoteForm, setopenNoteForm] = React.useState(false);
  const [editBookmarkForm, seteditBookmarkForm] = React.useState(false);
  const [editNoteForm, seteditNoteForm] = React.useState(false);
  const [bookmark, setbookmark] = useState<any>({});
  const [note, setnote] = useState<any>({});
  const [data, setdata] = React.useState<any>([]);
  const [bookmarkAssetId, setbookmarkAssetId] = React.useState<number>();
  const [noteAssetId, setnoteAssetId] = React.useState<number>();
  const bookmarkMsgRef = React.useRef<typeof CRXToaster>(null);


  const [controllerBar, setControllerBar] = useState(true);

  const [styleScreen, setStyleScreen] = useState(false);


  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [speedFwRw, setSpeedFwRw] = useState<number>(1000);

  React.useEffect(() => {
    setdata(props.history.location.state?.data);
  }, []);

  const EvidenceId = props.history.location.state?.EvidenceId
  ///Data Array contain all detaill about File Url id we can use it as VideoData.
  //Delay need to created upto Start point of recording point of each video given in timelinedetail
  //video size max upto net duration
  React.useEffect(() => {
    if (data.length > 0) {
      if (data.length == 1) {
        setSingleTimeline(true);
      }
      Durationfinder(data);
      setLoading(true)
    }
  }, [data]);

  React.useEffect(() => {
    if (editBookmarkForm) {
      setopenBookmarkForm(true);
    }
  }, [editBookmarkForm]);
  React.useEffect(() => {
    if (editNoteForm) {
      setopenNoteForm(true);
    }
  }, [editNoteForm]);

  React.useEffect(() => {
    if (!isPlayingFwRw && videoHandlersFwRw.length > 0) {
      setModeFw(0);
      setModeRw(0);
      videoHandlersFwRw.forEach((videoHandle: any) => {
        videoHandle.pause();
        videoHandle.playbackRate = 1;
      });
      setisOpenWindowFwRw(false);
    }
  }, [isPlayingFwRw]);

  React.useEffect(() => {
    if (isOpenWindowFwRw && isvideoHandlersFwRw) {

      let currmode = curractionFwRw.currmode;
      let currcase = curractionFwRw.currcase;

      modeSetFwRw(currmode, currcase)
    }
  }, [isOpenWindowFwRw, isvideoHandlersFwRw]);



  async function Durationfinder(Data: any) {
    var data = JSON.parse(JSON.stringify(Data));
    data = data.filter((x: any) => x.typeOfAsset !== "Image");
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
    let bufferingArr: any[] = [];
    for (let x = 0; x < data.length; x++) {
      let recording_start_time = moment(timeextractor(data[x].recording.started), "HH:mm:ss").format('HH:mm:ss');
      let recording_start_point = convert_to_Second(moment.utc(moment(recording_start_time, "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"))).format("HH:mm:ss"));
      let recording_Start_point_ratio = Math.ceil((recording_start_point / duration) * 100)
      let recording_end_time = moment(timeextractor(data[x].recording.ended), "HH:mm:ss").format('HH:mm:ss');
      let recording_end_point = convert_to_Second(moment.utc(moment(recording_end_time, "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"))).format("HH:mm:ss"));
      let video_duration_in_second = moment(recording_end_time, "HH:mm:ss").diff(moment(recording_start_time, "HH:mm:ss")) / 1000;//convert_to_Second(moment(moment(recording_end_time, "HH:mm:ss").diff(moment(recording_start_time, "HH:mm:ss"))).format('HH:mm:ss'));
      let recording_end_point_ratio = 100 - Math.ceil((recording_end_point / duration) * 100)
      let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio
      let startdiff = moment(timeextractor(data[x].recording.started), "HH:mm:ss").diff(moment(minstartpoint, "HH:mm:ss"));

      let myData: Timeline =
      {
        recording_start_point: recording_start_point,
        recording_Start_point_ratio: recording_Start_point_ratio,
        recording_end_point: recording_end_point,
        recording_end_point_ratio: recording_end_point_ratio,
        recordingratio: recordingratio,
        bookmarks: data[x].bookmarks,
        notes: data[x].notes,
        startdiff: startdiff,
        video_duration_in_second: video_duration_in_second,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        id: "Video-" + x,
        enableDisplay: x == 0 ? true : false,
        indexNumberToDisplay: x == 0 ? 1 : 0,
        camera: data[x].camera,
      }
      bufferingArr.push({ id: myData.id, buffering: false })
      rowdetail.push(myData);
    }
    await setBufferingArray(bufferingArr)
    await settimelinedetail(rowdetail)
  }



  const handleControlBarChange = (event: any, newValue: any) => {
    setTimer(newValue);
    setisPlayingFwRw(false);
    setControlBar(newValue);
    videoHandlers.forEach((videoHandle: any) => {
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
    setisPlayingFwRw(false);
    if (!isPlaying) {
      videoHandlers.forEach((videoHandle: any) => {
        hanldeVideoStartStop(timer, videoHandle, true);
      });
    }
    else {
      videoHandlers.forEach((videoHandle: any) => {
        videoHandle.pause();
        videoHandle.playbackRate = 1;
      });
    }
  };
  const handleReverse = () => {
    setPlaying(false);
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
      hanldeVideoStartStop(Math.round(videoHandle.currentTime - 1), videoHandle, false);
    });
    handleControlBarChange(null, timer - 1)
  };
  const handleforward = () => {
    setPlaying(false);
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
      hanldeVideoStartStop(Math.round(videoHandle.currentTime + 1), videoHandle, false);
    });
    handleControlBarChange(null, timer + 1)
  };

  const handleaction = (action: any) => {
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
    });
    setisPlayingFwRw(false);
    const playerCurrentTime = Math.round(timer * 1000);
    var startdiff = moment(timeextractor(data[0].recording.started), "HH:mm:ss").diff(moment(maxminendpoint?.Min_Start_point, "HH:mm:ss"));
    var enddiff = moment(timeextractor(data[0].recording.ended), "HH:mm:ss").diff(moment(maxminendpoint?.Min_Start_point, "HH:mm:ss"));
    if (playerCurrentTime >= startdiff && playerCurrentTime <= enddiff) {
      const BKMTime = playerCurrentTime - startdiff;
      let isOccur = onAddCheckDuplicate(BKMTime, action); // prevent to add bookmark on same position
      if (!isOccur && action == "bookmark") {
        setbookmarktime(BKMTime);
        setPlaying(false);
        setopenBookmarkForm(true);
      }
      else if (!isOccur && action == "note") {
        setbookmarktime(BKMTime);
        setPlaying(false);
        setopenNoteForm(true);
      }
    }
    else {
      if (action == "bookmark") {
        bookmarkMsgRef.current.showToaster({
          message: "Please seek to appropriate time of master camera to bookmark", variant: "Error", duration: 5000, clearButtton: true
        });
      }
      else if (action == "note") {
        bookmarkMsgRef.current.showToaster({
          message: "Please seek to appropriate time of master camera to bookmark notes", variant: "Error", duration: 5000, clearButtton: true
        });
      }

    }
  };

  const onAddCheckDuplicate = (BKMTime: number, action: any) => {
    const minBKMTime = BKMTime - 1000;
    const mixBKMTime = BKMTime + 1000;
    let error = false;
    if (action == "bookmark") {
      data[0].bookmarks?.forEach((y: any) => {
        if (minBKMTime <= y.position && mixBKMTime >= y.position) {
          error = true;
          bookmarkMsgRef.current.showToaster({
            message: "Unable To Add Duplicate Bookmark", variant: "Error", duration: 5000, clearButtton: true
          });
        }
      })
    }
    else if (action == "note") {
      data[0].notes?.forEach((y: any) => {
        if (minBKMTime <= y.position && mixBKMTime >= y.position) {
          error = true;
          bookmarkMsgRef.current.showToaster({
            message: "Unable To Add Duplicate Note", variant: "Error", duration: 5000, clearButtton: true
          });
        }
      })
    }
    return error;
  }

  useEffect(() => {
    timelinedetail.filter((y: any) => y.enableDisplay).forEach((x: any) => {
      var videoElement = document.querySelector("#" + x.id);
      videoElements.push(videoElement);

      videoElement?.addEventListener("canplay", function () {
        var bufferingArrayObj = bufferingArray.find((y: any) => y.id == x.id);
        bufferingArrayObj.buffering = true;
        setBufferingArray(bufferingArray);
      }, true);

      videoElement?.addEventListener("waiting", function () {
        var bufferingArrayObj = bufferingArray.find((y: any) => y.id == x.id);
        bufferingArrayObj.buffering = false;
        setBufferingArray(bufferingArray);
      }, true);
    })
    setVideoHandlers(videoElements);
  }, [timelinedetail]);

  useEffect(() => {
    if (videoHandlersFwRw.length > 0) {
      videoHandlersFwRw.forEach((videoHandle: any) => {
        videoHandle?.addEventListener("canplay", function () {
          var bufferingArrayObj = bufferingArrayFwRw.find((y: any) => y.id == videoHandle.id);
          bufferingArrayObj.buffering = true;
          setBufferingArrayFwRw(bufferingArrayFwRw);
        }, true);

        videoHandle?.addEventListener("waiting", function () {
          var bufferingArrayObj = bufferingArrayFwRw.find((y: any) => y.id == videoHandle.id);
          bufferingArrayObj.buffering = false;
          setBufferingArrayFwRw(bufferingArrayFwRw);
        }, true);
      });
      setisvideoHandlersFwRw(true);
    }
    else {
      setintialbufferFwRw();
    }
  }, [videoHandlersFwRw]);

  async function setintialbufferFwRw() {
    let bufferingArr: any[] = [];
    for (var i = 0; i < 5; i++) {
      bufferingArr.push({ id: "vid-" + i, buffering: false })
    }
    setBufferingArrayFwRw(bufferingArr)
  }

  const hanldeVideoStartStop = (timer: number, videoHandle: any, applyAction: boolean) => {
    var video: any = timelinedetail.find((x: any) => x.id == videoHandle.id);
    var difference = timer - (video.recording_start_point);
    var endPointDifference = (video.recording_end_point) - timer;
    videoHandle.currentTime = difference > 0 && endPointDifference > 0 ? difference : 0;
    if (applyAction) {
      if (videoHandle.currentTime > 0 && bufferingArray.filter((y: any) => timelinedetail.find((z: any) => z.id == y.id && z.enableDisplay) !== undefined).every((y: any) => y.buffering == true)) {
        videoHandle.play();
      }
      else {
        videoHandle.pause();
      }
    }
  }

  const hanldeVideoStartStopFwRw = (timer: any, videoHandle: any, applyAction: boolean, index: number) => {
    var video: any = timelinedetail[0];

    var difference = timer - (video.recording_start_point);
    var endPointDifference = (video.recording_end_point) - timer;
    videoHandle.currentTime = difference > 0 && endPointDifference > 0 ? difference : 0;
    var TimerFwRw = Math.floor(timerFwRw[index]) >= 1 ? timerFwRw[index] : 0;
    var VideoTimerFwRw = videotimerFwRw[index];
    VideoTimerFwRw.innerHTML = secondsToHms(TimerFwRw);
    if (applyAction) {
      if (videoHandle.currentTime > 0 && bufferingArray.every((y: any) => y.buffering == true)) {
      }
      else {
        videoHandle.pause();
      }
    }
  }

  useInterval(
    () => {
      if (bufferingArray.filter((y: any) => timelinedetail.find((z: any) => z.id == y.id && z.enableDisplay) !== undefined).every((y: any) => y.buffering == true)) {
        if (isPlaying === true) {
          if (timer < timelineduration) {
            var timerValue = timer + 1;
            setTimer(timerValue);
            setControlBar(timerValue);
            videoHandlers.forEach((videoHandle: any) => {
              hanldeVideoStartStop(timerValue, videoHandle, true);
            });
          }
          else {
            setPlaying(false);
            videoHandlers.forEach((videoHandle: any) => {
              videoHandle.stop();
            });
          }
        }
      }
      else {
        videoHandlers.forEach((videoHandle: any) => {
          videoHandle.stop()
        });
      }
    },
    // Speed in milliseconds or null to stop it
    isPlaying ? speed : null,
  );

  useInterval(
    () => {
      if (bufferingArrayFwRw.every((y: any) => y.buffering == true)) {
        if (isPlayingFwRw === true) {
          if (timer < timelineduration) {
            var timerValue: any[] = [];
            if (modeFw > 0) {
              timerFwRw.forEach((x: any) => {
                timerValue.push(x + 0.3);
              })
            }
            else if (modeRw > 0) {
              timerFwRw.forEach((x: any) => {
                timerValue.push(x - 0.3);
              })
            }

            setTimerFwRw(timerValue);
            videoHandlersFwRw.forEach((videoHandle: any, index: number) => {
              hanldeVideoStartStopFwRw(timerValue[index], videoHandle, true, index);
            });
          }
          else {
            //setPlaying(false);
            videoHandlersFwRw.forEach((videoHandle: any) => {
              //videoHandle.stop();
            });
          }
        }
      }
      else {
        videoHandlersFwRw.forEach((videoHandle: any) => {
          //videoHandle.stop()
        });
      }
    },
    // Speed in milliseconds or null to stop it
    isPlayingFwRw ? speedFwRw : null,
  );

  const setVolumeHandle = (volume: number) => {
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.volume = (volume / 100);
    });
  }

  const setMuteHandle = (isMuted: boolean) => {
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.muted = isMuted;
    });
  }
  const reset = () => {
    //(false);
    setTimer(0);
    setControlBar(0);
    videoHandlers.forEach((videoHandle: any) => {
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

  const modeSet = (Mode: number) => {
    var modeObj = videoSpeed.find((x: any) => x.mode == Mode);
    if (modeObj) {
      setMode(Mode);
      videoHandlers.forEach((videoHandle: any) => {
        videoHandle.playbackRate = modeObj?.playBackRate;
      });
      setSpeed(modeObj.speed);
    }
  }

  const modeSetFwRw = (Currmode: number, CaseNo: number) => {
    if (isPlaying) {
      setPlaying(false);
      videoHandlers.forEach((videoHandle: any) => {
        videoHandle.pause();
        videoHandle.playbackRate = 1;
      });
    }
    if (isPlayingFwRw) {
      videoHandlersFwRw.forEach((videoHandle: any) => {
        videoHandle.pause();
        videoHandle.playbackRate = 1;
      });
    }
    var videoTimerFwRw: any[] = [];
    let num = -2;

    setSpeedFwRw(300);
    setisPlayingFwRw(true);
    switch (CaseNo) {
      case 1: //Forward
        if (modeRw > 0) {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(videoHandle.currentTime + Currmode * num);
            num++;
          });
        }
        else {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(Currmode > 2 ? videoHandle.currentTime + Currmode * num : controlBar + Currmode * num);
            num++;
          });
        }
        setModeRw(0);
        setModeFw(Currmode);
        break;
      case 2: //Rewind
        if (modeFw > 0) {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(videoHandle.currentTime + Currmode * num);
            num++;
          });
        }
        else {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(Currmode > 2 ? videoHandle.currentTime + Currmode * num : controlBar + Currmode * num);
            num++;
          });
        }
        setModeFw(0);
        setModeRw(Currmode);
        break;
      default:
        break;
    }
    setTimerFwRw(videoTimerFwRw);
  }

  const onClickVideoFwRw = (event: any) => {
    setisPlayingFwRw(false);
    let currTime = Math.floor(event.target.currentTime);
    handleControlBarChange(null, currTime);
    setPlaying(!isPlaying);
    if (!isPlaying) {
      videoHandlers.forEach((videoHandle: any) => {
        hanldeVideoStartStop(currTime, videoHandle, true);
      });
    }
  }

  const onClickFwRw = (Currmode: number, CaseNo: number) => {
    if (isOpenWindowFwRw && isvideoHandlersFwRw) {
      modeSetFwRw(Currmode, CaseNo)
    }
    else {
      setcurractionFwRw({ currmode: Currmode, currcase: CaseNo })
      setisOpenWindowFwRw(true);
    }
  }


  const displayThumbnail = (event: any, x: any, displayAll: boolean, withdescription?: string) => {
    var timeLineHover: any = singleTimeline ? document.querySelector("#SliderControlBar") : document.querySelector("#timeLine-hover" + x.indexNumberToDisplay);
    var timelineWidth = timeLineHover?.scrollWidth < 0 ? 0 : timeLineHover?.scrollWidth;

    var offset = timeLineHover.getBoundingClientRect().left;

    var lenghtDeduct: number = 0;
    var totalLenght = document.querySelector("#SliderControlBar")?.getBoundingClientRect().right ?? 0;
    var totalThumbnailsLenght = timelinedetail.filter((x: any) => x.enableDisplay).length * 300;
    var totalLenghtPlusThumbnails = event.pageX + totalThumbnailsLenght;
    if (totalLenghtPlusThumbnails > totalLenght) {
      lenghtDeduct = totalLenghtPlusThumbnails - totalLenght;
    }


    var pos = (event.pageX - offset) / timelineWidth;
    var ttt = Math.round(pos * x.video_duration_in_second);
    var Thumbnail: any = document.querySelector("#Thumbnail" + x.indexNumberToDisplay);
    var ThumbnailTime: any = document.querySelector("#Thumbnail-Time" + x.indexNumberToDisplay);
    var ThumbnailDesc: any = document.querySelector("#Thumbnail-Desc");

    var SliderControlBar: any = document.querySelector("#SliderControlBar");
    var SliderControlBarOffset = SliderControlBar?.getBoundingClientRect().left;

    if (Thumbnail) {
      Thumbnail.currentTime = ttt > x.video_duration_in_second ? 0 : ttt;
      Thumbnail.style.left = (event.pageX - SliderControlBarOffset) + (displayAll ? (((x.indexNumberToDisplay - 1) * 300) - lenghtDeduct) : 0) + "px";
      ThumbnailTime.innerHTML = secondsToHms(ttt)
      ThumbnailTime.style.left = (event.pageX - SliderControlBarOffset) + (displayAll ? (((x.indexNumberToDisplay - 1) * 300) - lenghtDeduct) : 0) + 125 + "px";
      ThumbnailTime.style.top = (120) + "px";
      if (withdescription) {
        ThumbnailDesc.innerHTML = withdescription;
        ThumbnailDesc.style.left = (event.pageX - SliderControlBarOffset) + 125 + "px";
        ThumbnailDesc.style.top = (150) + "px";
      }
    }
  }
  const displaySeekBarThumbail = (event: any) => {
    var Indexes: number[] = [];
    timelinedetail.filter((x: any) => x.enableDisplay).forEach((x: any) => {
      Indexes.push(x.indexNumberToDisplay)
      displayThumbnail(event, x, true)
    });
    setVisibleThumbnail(Indexes);
  }
  const removeSeekBarThumbail = () => {
    setVisibleThumbnail([]);
  }
  function secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + " : " : "";
    var mDisplay = m >= 0 ? ('00' + m).slice(-2) + " : " : "";
    var sDisplay = s >= 0 ? ('00' + s).slice(-2) : "";
    return hDisplay + mDisplay + sDisplay;
  }

  const enableMultipleTimeline = (event: any) => {
    setMultiTimelineEnabled(event.target.checked)
    if (event.target.checked == false) {
      var timelinedetailTemp = [...timelinedetail]
      timelinedetailTemp.forEach((x: any) => {
        if (x.indexNumberToDisplay != 1) {
          x.indexNumberToDisplay = 0;
          x.enableDisplay = false;
        }
      })
      settimelinedetail(timelinedetailTemp);
      screenClick(1, event);
    }
  }

  return (
    <div id="video-player" >
      <CRXToaster ref={bookmarkMsgRef} />
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''}  >
        <div id="screens">
          <VideoScreen
            timelinedetail={timelinedetail}
            settimelinedetail={settimelinedetail}
            viewNumber={viewNumber}
            mapEnabled={mapEnabled}
            videoHandlers={videoHandlers}
            setVideoHandlersFwRw={setVideoHandlersFwRw}
            setvideoTimerFwRw={setvideoTimerFwRw}
            onClickVideoFwRw={onClickVideoFwRw}
            isOpenWindowFwRw={isOpenWindowFwRw}
          />
        </div>
        <div id="timelines" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
          {/* TIME LINES BAR HERE */}
          {loading ? (
            <Timelines
              timelinedetail={timelinedetail}
              duration={timelineduration}
              seteditBookmarkForm={seteditBookmarkForm}
              seteditNoteForm={seteditNoteForm}
              bookmark={bookmark}
              note={note}
              setbookmark={setbookmark}
              setnote={setnote}
              setbookmarkAssetId={setbookmarkAssetId}
              setnoteAssetId={setnoteAssetId}
              visibleThumbnail={visibleThumbnail}
              setVisibleThumbnail={setVisibleThumbnail}
              singleTimeline={singleTimeline}
              displayThumbnail={displayThumbnail}
              bookmarkMsgRef={bookmarkMsgRef}
            />
          ) : (<></>)}

        </div>
        <div>
        </div>
        <div id="controls" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
          <div>
            <div className="main-control-bar">
              <Slider
                id="SliderControlBar"
                value={typeof controlBar === 'number' ? controlBar : 0}
                onChange={handleControlBarChange}
                onMouseOver={(e: any) => displaySeekBarThumbail(e)}
                onMouseMove={(e: any) => displaySeekBarThumbail(e)}
                onMouseOut={() => removeSeekBarThumbail()}
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
                <CRXButton color="primary" onClick={() => onClickFwRw(modeRw + 2, 2)} variant="contained" className="videoPlayerBtn">
                  <i className="fa fa-fast-backward"><span>{modeRw > 0 ? modeRw + "X" : ""}</span></i>
                </CRXButton>
                <CRXButton color="primary" onClick={handleReverse} variant="contained" className="videoPlayerBtn" >
                  <i className="fas fa-backward"></i>
                </CRXButton>
                <CRXButton color="primary" onClick={handlePlayPause} variant="contained" className="videoPlayerBtn" >
                  {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                </CRXButton>
                <CRXButton color="primary" onClick={handleforward} variant="contained" className="videoPlayerBtn" >
                  <i className="fas fa-forward"></i>
                </CRXButton>
                <CRXButton color="primary" onClick={() => onClickFwRw(modeFw + 2, 1)} variant="contained" className="videoPlayerBtn">
                  <i className="fas fa-fast-forward"><span>{modeFw > 0 ? modeFw + "X" : ""}</span></i>
                </CRXButton>
                <CRXButton color="primary" onClick={() => handleaction("bookmark")} variant="contained" className="videoPlayerBtn">
                  <i className="fas fa-bookmark"></i>
                </CRXButton>
                <CRXButton color="primary" onClick={() => handleaction("note")} variant="contained" className="videoPlayerBtn">
                  <i className="fas fa-plus"></i>
                </CRXButton>

              </div>
            </div>
            <div className="playerViewRight">
              <div className="playBackMode">
                <button onClick={() => modeSet(mode - 1)} ><i className="fas fa-undo-alt"><span>{mode < 0 ? mode + "X" : ""}</span></i></button>
                <button onClick={() => modeSet(0)}><i className="fas fa-minus"></i></button>
                <button onClick={() => modeSet(mode + 1)} ><i className="fas fa-redo-alt"><span>{mode > 0 ? mode + "X" : ""}</span></i></button>
              </div>
              <div className="SettingGrid">
                <Menu
                  align="start"
                  viewScroll="initial"
                  direction="top"

                  className="ViewScreenMenu"
                  menuButton={
                    <MenuButton className="videoPlayerBtn">
                      <i className="fas fa-cog"></i>
                    </MenuButton>
                  }
                >
                  <MenuItem>
                    <FormControlLabel control={<Switch checked={multiTimelineEnabled} onChange={(event) => enableMultipleTimeline(event)} />} label="Multi Timelines" />
                  </MenuItem>

                </Menu >
              </div>
              {multiTimelineEnabled && <div className="MenuListGrid">
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
                  <MenuItem onClick={screenClick.bind(this, screenViews.VideosOnSide)}  >
                    Videos on Side
                  </MenuItem>
                  <MenuItem onClick={screenClick.bind(this, screenViews.Grid)}>
                    Grid up to 4
                  </MenuItem>
                  <MenuItem onClick={screenClick.bind(this, screenViews.Grid6)}>
                    Grid up to 6
                  </MenuItem>
                  <MenuItem>
                    <FormControlLabel control={<Switch onChange={(event) => setMapEnabled(event.target.checked)} />} label="Side Data Panel" />
                  </MenuItem>

                </Menu >
              </div>}
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
      {openNoteForm && <VideoPlayerNote
        setopenNoteForm={setopenNoteForm}
        seteditNoteForm={seteditNoteForm}
        openNoteForm={openNoteForm}
        editNoteForm={editNoteForm}
        AssetData={data[0]}
        EvidenceId={EvidenceId}
        NotetimePositon={bookmarktime}
        note={note}
        Data={data}
        setData={setdata}
        noteAssetId={noteAssetId}
        noteMsgRef={bookmarkMsgRef}
      />}
    </div>
  );
}

export default VideoPlayerBase