import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import "../VideoPlayer.scss";
import { useInterval } from 'usehooks-ts'
import AudioVolumeControl from "./AudioVolumeControl";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { setTimeout } from "timers";
import { AssetLog, AssetLogType } from "../../../utils/Api/models/EvidenceModels";
import { CRXButton, CRXTooltip, CRXToaster } from "@cb/shared";
import { useDispatch } from "react-redux";
import "../VideoPlayerResponsive.scss";
import Cookies from "universal-cookie";
import "../overRide_video_player_style.scss"
import { urlList, urlNames } from "../../../utils/urlList";
import { addAssetLog } from "../../../Redux/AssetLogReducer";
import { setAssetDetailBottomTabs } from "../../../Redux/VideoPlayerSettingsReducer";
import AudioScreen from "./AudioScreen";
import AudioPlayerSeekbar from "./AudioPlayerSeekbar";
import "./audioPlayerStyle.scss";
import AudioUpload from "./AudioUpload";

type Timeline = {
  assetName: string;
  recording_started: any;
  recording_start_point: number;
  recording_Start_point_ratio: number;
  recording_end_point: number;
  recording_end_point_ratio: number;
  recordingratio: number;
  bookmarks: any;
  notes: any;
  startdiff: number;
  video_duration_in_second: number;
  src: string;
  id: string;
  dataId: string;
  unitId: string;
  enableDisplay: boolean,
  indexNumberToDisplay: number,
  camera: string,
  timeOffset: number,
  assetbuffering: any
}

type TimelineSyncHistory = {
  assetId: string,
  timeOffset: number,
  recording_start_point: number,
  recording_end_point: number,
}
type TimelineSyncHistoryMain = {
  maxTimelineDuration: number,
  timelinesHistory: TimelineSyncHistory[]
}

type MaxMinEndpoint = {
  Min_Start_point: number;
  Max_end_point: number;
}
type DurationFinderModel = {
  Data: any
  setfinalduration: any
  settimelineduration: any
  setmaxminendpoint: any
  updateVideoSelection: boolean
  timelinedetail: Timeline[]
  timelineSyncHistory: TimelineSyncHistoryMain[]
  setTimelineSyncHistory: any
  timelineSyncHistoryCounter: number
  setTimelineSyncHistoryCounter: any
  setBufferingArray: any
  setupdateVideoSelection: any
  isDetailPageAccess: boolean
  setTimelinedetail: any
  screenChangeVideoId: any
  setscreenChangeVideoId: any
}
type TimelineGeneratorModel = {
  data: any
  minstartpoint: number
  duration: number
  updateVideoSelection: boolean
  timelinedetail: Timeline[]
  timelineSyncHistory: TimelineSyncHistoryMain[]
  setTimelineSyncHistory: any
  timelineSyncHistoryCounter: number
  setTimelineSyncHistoryCounter: any
  setBufferingArray: any
  setupdateVideoSelection: any
  isDetailPageAccess: boolean
  setTimelinedetail: any
  screenChangeVideoId : any
  setscreenChangeVideoId : any
}
type ViewReasonTimerObject = {
  evidenceId: number;
  userId: number;
  time: number;
}


const videoSpeed = [
  {
    "mode": -6,
    "playBackRate": 0.4,
    "speed": 1700,
  },
  {
    "mode": -4,
    "playBackRate": 0.6,
    "speed": 1500,
  },
  {
    "mode": -2,
    "playBackRate": 0.8,
    "speed": 1250,
  },
  {
    "mode": 0,
    "playBackRate": 1,
    "speed": 1000,
  },
  {
    "mode": 2,
    "playBackRate": 2,
    "speed": 500,
  },
  {
    "mode": 4,
    "playBackRate": 3,
    "speed": 333.33,
  },
  {
    "mode": 6,
    "playBackRate": 4,
    "speed": 250,
  }
]

function secondsToHms(d: number) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);

  let hDisplay = h > 0 ? h + " : " : "00:";
  let mDisplay = m >= 0 ? ('00' + m).slice(-2) + ":" : "";
  let sDisplay = s >= 0 ? ('00' + s).slice(-2) : "";
  return hDisplay + mDisplay + sDisplay;
}
function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
const milliSecondsToTimeFormat = (date: Date) => {
  return padTo2Digits(date.getUTCHours()) + ":" + padTo2Digits(date.getUTCMinutes()) + ":" + padTo2Digits(date.getUTCSeconds());
}
async function TimelineData_generator(TimelineGeneratorModel: TimelineGeneratorModel) {
  const { data, minstartpoint, duration, updateVideoSelection, timelinedetail, timelineSyncHistory, setTimelineSyncHistory, timelineSyncHistoryCounter, setTimelineSyncHistoryCounter, setBufferingArray, setupdateVideoSelection, isDetailPageAccess, setTimelinedetail, screenChangeVideoId, setscreenChangeVideoId } = TimelineGeneratorModel
  let rowdetail: Timeline[] = [];
  let bufferingArr: any[] = [];
  for (let x = 0; x < data.length; x++) {
    let timeOffset = data[x].recording.timeOffset ?? 0;
    let assetbuffering = data[x].assetbuffering;
    let recording_start_time = new Date(data[x].recording.started).getTime() + timeOffset;
    let recording_start_point = (recording_start_time - minstartpoint) / 1000;
    let recording_Start_point_ratio = ((recording_start_point / duration) * 100)
    let recording_end_time = new Date(data[x].recording.ended).getTime() + timeOffset;
    let video_duration_in_second = (recording_end_time - recording_start_time) / 1000;
    let recording_end_point = (recording_end_time - minstartpoint) / 1000;
    let recording_end_point_ratio = 100 - ((recording_end_point / duration) * 100)
    let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio
    let startdiff = recording_start_point * 1000;

    if (updateVideoSelection) {
      let temptimelinedetail = timelinedetail.find((y: any) => y.dataId == data[x].id)
      if (temptimelinedetail) {
        let myData: Timeline =
        {
          assetName: data[x].name,
          recording_started: new Date(data[x].recording.started).getTime() + data[x].recording.timeOffset ?? 0,
          recording_start_point: recording_start_point,
          recording_Start_point_ratio: recording_Start_point_ratio,
          recording_end_point: recording_end_point,
          recording_end_point_ratio: recording_end_point_ratio,
          recordingratio: recordingratio,
          bookmarks: temptimelinedetail.bookmarks,
          notes: temptimelinedetail.notes,
          startdiff: startdiff,
          video_duration_in_second: video_duration_in_second,
          src: temptimelinedetail.src,
          id: temptimelinedetail.id,
          dataId: temptimelinedetail.dataId,
          unitId: temptimelinedetail.unitId,
          enableDisplay: temptimelinedetail.enableDisplay,
          indexNumberToDisplay: temptimelinedetail.indexNumberToDisplay,
          camera: temptimelinedetail.camera,
          timeOffset: temptimelinedetail.timeOffset,
          assetbuffering: temptimelinedetail.assetbuffering
        }
        rowdetail.push(myData);
      }
    }
    else {
      let protocol = 'http://';
      let myData: Timeline =
      {
        assetName: data[x].name,
        recording_started: new Date(data[x].recording.started).getTime() + data[x].recording.timeOffset ?? 0,
        recording_start_point: recording_start_point,
        recording_Start_point_ratio: recording_Start_point_ratio,
        recording_end_point: recording_end_point,
        recording_end_point_ratio: recording_end_point_ratio,
        recordingratio: recordingratio,
        bookmarks: data[x].bookmarks,
        notes: data[x].notes,
        startdiff: startdiff,
        video_duration_in_second: video_duration_in_second,
        src: isDetailPageAccess ? data[x]?.files[0]?.downloadUri : `${protocol}commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        id: data[x].name + "-" + x,
        dataId: data[x].id,
        unitId: data[x].unitId,
        enableDisplay: x == 0 ? true : false,
        indexNumberToDisplay: x == 0 ? 1 : 0,
        camera: data[x].camera,
        timeOffset: timeOffset,
        assetbuffering: assetbuffering
      }
      bufferingArr.push({ id: myData.id, buffering: false })
      rowdetail.push(myData);
    }
  }


  let timelineSyncHistoryTemp = [...timelineSyncHistory];
  timelineSyncHistoryTemp = timelineSyncHistoryTemp.slice(0, timelineSyncHistoryCounter + 1);
  let timelineHistoryArray: TimelineSyncHistory[] = [];
  rowdetail.forEach((x: any) => {
    timelineHistoryArray.push({
      assetId: x.dataId,
      timeOffset: x.timeOffset,
      recording_start_point: x.recording_start_point,
      recording_end_point: x.recording_end_point,
    })
  })
  timelineSyncHistoryTemp = [{
    maxTimelineDuration: duration,
    timelinesHistory: timelineHistoryArray
  }]
  setTimelineSyncHistory(timelineSyncHistoryTemp);
  setTimelineSyncHistoryCounter(0);
  if (!updateVideoSelection) {
    await setBufferingArray(bufferingArr)
  }
  setTimelinedetail(rowdetail);
  // await dispatch(addTimelineDetailActionCreator(rowdetail));
  if (screenChangeVideoId) {
    rowdetail.filter((y: any) => y.enableDisplay && y.id == screenChangeVideoId).forEach((x: any) => {
      let videoElement : any = document.querySelector("#" + x.id);
      videoElement?.load();
    })
    setscreenChangeVideoId(null);
  }
  setupdateVideoSelection(false);
}
async function Durationfinder(DurationFinderModel: DurationFinderModel) {
  const { Data, setfinalduration, settimelineduration, setmaxminendpoint, updateVideoSelection, timelinedetail, timelineSyncHistory, setTimelineSyncHistory, timelineSyncHistoryCounter, setTimelineSyncHistoryCounter, setBufferingArray, setupdateVideoSelection, isDetailPageAccess, setTimelinedetail, screenChangeVideoId, setscreenChangeVideoId } = DurationFinderModel

  let data = JSON.parse(JSON.stringify(Data));
  let timeOffset = data[0].recording.timeOffset ?? 0;
  let maximum_endpoint = new Date(data[0].recording.ended).getTime() + timeOffset;
  let minimum_startpont = new Date(data[0].recording.started).getTime() + timeOffset;
  for (let x = 1; x < data.length; x++) {
    if (data[x].multivideotimeline) {
      let T_timeOffset = data[x].recording.timeOffset ?? 0;
      let T_max_endpoint = new Date(data[x].recording.ended).getTime() + T_timeOffset;
      let T_min_startpont = new Date(data[x].recording.started).getTime() + T_timeOffset;
      maximum_endpoint = maximum_endpoint > T_max_endpoint ? maximum_endpoint : T_max_endpoint;
      minimum_startpont = minimum_startpont > T_min_startpont ? T_min_startpont : minimum_startpont;
    }
  }
  let duration = maximum_endpoint - minimum_startpont;
  let durationround = (Math.ceil(duration/1000))*1000;
  let durationInDateFormat = new Date(durationround);
  let durationinformat = milliSecondsToTimeFormat(durationInDateFormat);
  await setfinalduration(durationinformat)

  let finalduration = durationInDateFormat.getTime() / 1000;
  await settimelineduration(finalduration)
  //first entity is max second is min
  let maxminarray: MaxMinEndpoint = { Min_Start_point: minimum_startpont, Max_end_point: maximum_endpoint }
  setmaxminendpoint(maxminarray);
  await TimelineData_generator({
    data,
    minstartpoint: minimum_startpont,
    duration: finalduration,
    updateVideoSelection,
    timelinedetail,
    timelineSyncHistory,
    setTimelineSyncHistory,
    timelineSyncHistoryCounter,
    setTimelineSyncHistoryCounter,
    setBufferingArray,
    setupdateVideoSelection,
    isDetailPageAccess : isDetailPageAccess,
    setTimelinedetail,
    screenChangeVideoId,
    setscreenChangeVideoId
  });
}

const MaxTimelineCalculation = (tempTimelines: Timeline[], newTimelineDuration?: number, removeIndex?: boolean) => {
  let recording_end_points = [...tempTimelines.map((x: any) => {
    let recording_end_point = x.recording_end_point;
    if (removeIndex) {
      recording_end_point -= x.timeOffset / 1000;
    }
    return recording_end_point;
  })];

  let recording_start_points = [...tempTimelines.map((x: any) => {
    let recording_start_point = x.recording_start_point;
    if (removeIndex) {
      recording_start_point -= x.timeOffset / 1000;
    }
    return recording_start_point;
  })];

  let maxTimelinesDuration: number = Math.max(...recording_end_points);
  let minTimelinesDuration: number = Math.min(...recording_start_points);
  if (newTimelineDuration !== undefined) {
    maxTimelinesDuration = newTimelineDuration > maxTimelinesDuration ? newTimelineDuration : maxTimelinesDuration;
    minTimelinesDuration = newTimelineDuration < minTimelinesDuration ? newTimelineDuration : minTimelinesDuration;
  }

  let maxTimelineDuration = Math.abs(minTimelinesDuration - maxTimelinesDuration) < maxTimelinesDuration ? maxTimelinesDuration : Math.abs(minTimelinesDuration - maxTimelinesDuration);
  let negativeHandler = Math.abs(minTimelinesDuration < 0 ? minTimelinesDuration : 0);
  return {
    maxTimelineDuration: maxTimelineDuration,
    negativeHandler: negativeHandler
  };
}

const AudioPlayerBase = (props: any) => {

  const screenViews = {
    "Single": 1,
    "SideBySide": 2,
    "VideosOnSide": 3,
    "Grid": 4,
    "Grid6": 6
  };
  const buttonArray = [
    {
      label: 'Save',
      shortKey: 'Ctrl + S',
      disabled: false,
    },
    // {
    //   label: 'Save as',
    //   disabled: true,
    // },
    {
      label: 'Undo',
      shortKey: 'Ctrl + Z',
      disabled: false,
    },
    {
      label: 'Redo',
      shortKey: 'Ctrl + Shift + Z',
      disabled: false,
    },
    {
      label: 'Revert to last save',
      disabled: false,
    },
    {
      label: 'Revert to original',
      disabled: false,
    },
  ];

  const assetLog : AssetLog = { action : "Update", notes : ""};
  const assetLogType : AssetLogType = { evidenceId : props.evidenceId, assetId : props.data[0].id, assetLog : assetLog};
  const dispatch = useDispatch();
  const [bufferingArray, setBufferingArray] = React.useState<any[]>([]);

  const [maxminendpoint, setmaxminendpoint] = useState<MaxMinEndpoint>();
  const [finalduration, setfinalduration] = useState<string>();
  const [timelineduration, settimelineduration] = useState(0);
  const [modePrev, setModePrev] = useState(true)


  const [viewNumber, setViewNumber] = useState(1);

  const [controlBar, setControlBar] = useState(0);

  const [timer, setTimer] = useState<number>(0);
  const [mode, setMode] = useState<number>(0);

  const [isPlaying, setPlaying] = useState<boolean>(false)

  const [videoHandlers, setVideoHandlers] = useState<any[]>([]);

  const [ViewScreen, setViewScreen] = useState(true);
  const [data, setdata] = React.useState<any>([]);
  const toasterMsgRef = React.useRef<typeof CRXToaster>(null);



  const [styleScreen, setStyleScreen] = useState(false);
  const [speed, setSpeed] = useState<number>(1000); 
  const [updateVideoSelection, setupdateVideoSelection] = useState<boolean>(false);
  const [timelineSyncHistory, setTimelineSyncHistory] = useState<TimelineSyncHistoryMain[]>([]);
  const [timelineSyncHistoryCounter, setTimelineSyncHistoryCounter] = useState<number>(0);
  const [showFRicon, setShowFRicon] = useState({
    showFRCon: false,
    caseNum: 0
  });
  const [volumPercent, setVolumPercent] = useState<number>();
  const [mutePercentVol, setMutePercentVol] = useState<number>();
  const [volume, setVolume] = useState<number>(100);
  const volumeIcon = useRef<any>(null);
  const [detailContent, setDetailContent] = useState<boolean>(false);
  const [showControlConatiner , setShowControlConatiner] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [screenChangeVideoId, setscreenChangeVideoId] = useState<any>();
  const assetViewed = useRef(false);
  const layoutRef = useRef(null);
  const settingRef = useRef(null);
  let htmlElement: any = document.querySelector("html");
  const keydownListener = (event: any) => {
    const { code, shiftKey, altKey } = event;
      if (code == "Space" && shiftKey) {event.preventDefault(); handlePlayPause()} //shift + Space bar
      if (!disabledModeRight && shiftKey && code == "Period") {
        event.preventDefault(); 
        modeSet(mode < 0 ? 2 : (mode + 2))
      } //Shift + .>
      if (!disabledModeLeft && shiftKey && code == "Comma") {event.preventDefault(); modeSet(mode > 0 ? -2 : (mode - 2))} //Shift + ,
      if (!disabledModeMinus && shiftKey && code == "Slash") {event.preventDefault(); modeSet(0)} // shift + /
      if (code == "ArrowDown") {
        event.preventDefault(); 
        if(volume > 0)
        {
          setVolume(volume - 10);
          setVolumeHandle(volume - 10);
        }
        else{
          setVolumeHandle(volume);
        }
      } //down arrows
      if (code == "ArrowUp") {
        event.preventDefault(); 
        if(volume < 100)
        {
          setVolume(volume + 10);
          setVolumeHandle(volume + 10);
        }
        else{
          setVolumeHandle(volume);
        }
      } //up arrows
      if (code == "KeyF" && shiftKey && altKey) {event.preventDefault(); viewScreenEnter()} // F
      if (code == "KeyM" && shiftKey && altKey) {event.preventDefault(); handleVoumeClick();} // M
  };

  React.useEffect(() => {
     htmlElement.style.overflow = "hidden";
  },[])

  if (window.performance) {
    if (performance.getEntriesByType("navigation")) {
        htmlElement.style.overflow = "hidden";
    }
  }

  React.useEffect(() => {
    let propdata;
    if (props.history !== undefined) {
      propdata = props.history.location.state?.data;
    }
    else {
      propdata = props.data;
    }
    if (propdata) {
      propdata.forEach((x: any, index: number) => {
        if (index == 0) {
          x.multivideotimeline = true;
        }
        else {
          x.multivideotimeline = false;
        }
      });
      setdata(propdata);
    }

  }, []);

  useEffect(() => {
    let path = window.location.pathname;
    let pathBody = document.querySelector("body");
    if (path == urlList.filter((item: any) => item.name === urlNames.testVideoPlayer)[0].url) {
      pathBody?.classList.add("pathVideoPlayer");
    } else if (path == urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
      pathBody?.classList.add("pathAssetDetail");
    } else {
      pathBody?.classList.remove("pathVideoPlayer");
      pathBody?.classList.remove("pathAssetDetail");

    }

  })

  const EvidenceId = props.history !== undefined ? props.history.location.state?.EvidenceId : props.evidenceId;
  ///Data Array contain all detaill about File Url id we can use it as VideoData.
  //Delay need to created upto Start point of recording point of each video given in timelinedetail
  //video size max upto net duration
  
  React.useEffect(() => {
    if (data.length > 0) {
      Durationfinder({
        Data: data,
        setfinalduration,
        settimelineduration,
        setmaxminendpoint,
        updateVideoSelection,
        timelinedetail,
        timelineSyncHistory,
        setTimelineSyncHistory,
        timelineSyncHistoryCounter,
        setTimelineSyncHistoryCounter,
        setBufferingArray,
        setupdateVideoSelection,
        isDetailPageAccess: props.history !== undefined ? false : true,
        setTimelinedetail: setTimelinedetail,
        screenChangeVideoId,
        setscreenChangeVideoId
      });
    }
  }, [data]);

  const [timelinedetail, setTimelinedetail] = useState<Timeline[]>([]);
  // const timelinedetail: Timeline[] = useSelector(
  //   (state: RootState) => state.timelineDetailReducer.data
  // );

  React.useEffect(() => {
    if (updateVideoSelection) {
      var tempdata = JSON.parse(JSON.stringify(data));
      timelinedetail.forEach((x: any) => {
        var tempdataobj = tempdata.find((y: any) => x.dataId == y.id)
        if (tempdataobj && x.enableDisplay) {
          tempdataobj.multivideotimeline = true;
        }
        if (tempdataobj && !x.enableDisplay) {
          tempdataobj.multivideotimeline = false;
        }
      })
      setdata(tempdata);
    }
  }, [updateVideoSelection]);

  React.useEffect(() => {
    if (timelinedetail && timelinedetail.length>0) {
      // work for multiview timeline
      let count =0;
      timelinedetail.forEach((x: any) => {
        if(x.enableDisplay){
          count++;
        }
      })

    }
  }, [timelinedetail]);

  const handleVoumeClick = () => {
    setIsMute(!isMute);
    setMuteHandle(!isMute);
    if (volume == 0 && isMute) {
      setVolume(50);
      setVolumeHandle(50);
    }

    if(isMute)
    {
      assetLogType.assetId = props.data[0].id;
      assetLogType.assetLog.notes = "Volume UnMuted";
      dispatch(addAssetLog(assetLogType));
    }
    else{
      assetLogType.assetId = props.data[0].id;
      assetLogType.assetLog.notes = "Volume Muted";
      dispatch(addAssetLog(assetLogType));
    }
  }
  const handleControlBarChange = (event: any, newValue: any) => {

    setTimer(newValue);
    setControlBar(newValue);
    videoHandlers.forEach((videoHandle: any) => {
      hanldeVideoStartStop(newValue, videoHandle, false);
    })
  };

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
    setShowFRicon({ showFRCon: false, caseNum: 0 })
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
      setMode(0);
    }
  };

  useEffect(() => {
    let videoElements: any[] = [];
    timelinedetail.filter((y: any) => y.enableDisplay).forEach((x: any) => {
      if (x.id !== '-0') {
      let videoElement = document.querySelector("#" + x.id);
      videoElements.push(videoElement);
      videoElement?.addEventListener("canplay", function () {
        let bufferingArrayObj = bufferingArray.find((y: any) => y.id == x.id);
        if(bufferingArrayObj){
          bufferingArrayObj.buffering = true;
          setBufferingArray(bufferingArray);
        }
      }, true);

      videoElement?.addEventListener("waiting", function () {
        let bufferingArrayObj = bufferingArray.find((y: any) => y.id == x.id);
        if(bufferingArrayObj){
          bufferingArrayObj.buffering = false;
          setBufferingArray(bufferingArray);
        }
      }, true);
  }})
    if(videoElements.length>0)
    {
      setVideoHandlers(videoElements);
    }
  }, [timelinedetail]);

  const hanldeVideoStartStop = (timer: number, videoHandle: any, applyAction: boolean) => {
    var video: any = timelinedetail.find((x: any) => x.id == videoHandle.id);
    var difference = timer - (video.recording_start_point);
    var endPointDifference = (video.recording_end_point) - timer;
    let currenttime = difference > 0 && endPointDifference > 0 ? difference : 0;
    let currenttimediff = Math.abs(videoHandle.currentTime - currenttime);

    if(currenttimediff >= 0.5){
      videoHandle.currentTime = currenttime;
    }
    if (applyAction) {
      if (videoHandle.currentTime > 0 && bufferingArray.filter((y: any) => timelinedetail.find((z: any) => z.id == y.id && z.enableDisplay) !== undefined).every((y: any) => y.buffering == true)) {
        videoHandle.play();
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
            videoHandlers.forEach((videoHandle: any) => {
              videoHandle.pause();
              videoHandle.playbackRate = 1;
            });
            setTimer(0);
            setControlBar(0);
            modeSet(0);
            setPlaying(false);
          }
        }
      }
      else {
        videoHandlers.forEach((videoHandle: any) => {
          videoHandle.pause();
        });
      }
    },
    // Speed in milliseconds or null to stop it
    isPlaying ? speed : null,
  );

  const setVolumeHandle = (volume: number) => {
    setVolumPercent(volume);
    setMutePercentVol(volume);
    volumeAnimation();

    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.volume = (volume / 100);
    });
  }

  const setMuteHandle = (isMuted: boolean) => {
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.muted = isMuted;
      let volumeMute = videoHandle.muted ? 0 : mutePercentVol == undefined ? volume : mutePercentVol;
      setVolumPercent(volumeMute);
      volumeAnimation()

    });
  }

  const volumeAnimation = () => {
    volumeIcon.current.style.zIndex = 1;
    volumeIcon.current.style.opacity = 1
    volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.remove("zoomOut"))
    volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.add("zoomIn"));
    volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.add("fontSizeIn"));

    setTimeout(() => {
      
      volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.remove("zoomIn"))
      volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.add("zoomOut"));
      volumeIcon.current && (volumeIcon.current?.childNodes[0].classList.remove("fontSizeIn"));
      volumeIcon.current.style.opacity = 0;
      volumeIcon.current.style.zIndex = 0
    }, 1200)
  }
  useEffect(() => {
    volumeIcon.current.style.opacity = 0
  }, [])

  const handleScreenView = useFullScreenHandle();


  const viewScreenEnter = () => {
    handleScreenView.enter();
    setViewScreen(false);
    assetLogType.assetId = props.data[0].id;
    assetLogType.assetLog.notes = "Enter Full Screen Mode";
    dispatch(addAssetLog(assetLogType));
  }

  const viewScreenExit = () => {
    handleScreenView.exit();
    setViewScreen(true);
    assetLogType.assetId = props.data[0].id;
    assetLogType.assetLog.notes = "Exit Full Screen Mode";
    dispatch(addAssetLog(assetLogType));
  }

  const screenViewChange = (e: any, h: any) => {
    if (h.active == true) {
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

  //Video Player  Logics
  const modeMinus = mode == -2 ? "2" : mode == -4 ? "4" : "6";
  const modeColorMinus = mode == -6 ? "#979797" : "white";
  const modeColorPlus = mode == 6 ? "#979797" : "white";
  const disabledModeLeft = (isPlaying ? false : true) || (mode == -6 ? true : false);
  const disabledModeRight = (isPlaying ? false : true) || (mode == 6 ? true : false);
  const disabledModeMinus = mode !== 0 && isPlaying ? false : true;

  let volumePer = volumPercent !== undefined ? volumPercent == 0 ? "icon-volume-mute1" : volumPercent >= 1 && volumPercent <= 33 ? "icon-volume-low1" : volumPercent >= 34 && volumPercent <= 66 ? "icon-volume-medium1" : "icon-volume-high1" : "";

  const showTrackHoverBar = (e: any) => {
    //Function for Grabbing icon show and hide.
    e._reactName === "onMouseDown" ?
      e.currentTarget.childNodes[3].style.visibility = "visible"
      :
      e.currentTarget.childNodes[3].style.visibility = "hidden";



  }

  useEffect(() => {
    let sliderTest = document.getElementById("AudioSliderControlBar");
    sliderTest?.addEventListener("mousemove", () => {
      document?.querySelector<HTMLElement>("#AudioSliderControlBar .MuiSlider-thumb")?.classList.add("cursorAdded");
    });
  },[])

  const fullViewScreenOn = () => {
    setShowControlConatiner(true);
  }

  setTimeout(()=>{
    setShowControlConatiner(false);
    
  },3000)
 


  const viewControlEnabler = showControlConatiner && !ViewScreen ? "showControlConatiner" : "removeControlContainer";

  useLayoutEffect(() => {
    const playBtn = document.getElementById("_audio_play");
    const pauseBtn = document.getElementById("_audio_pause");
    const videoFrontLayer = document.getElementById("videoFrontLayer")
    if (isPlaying === true) {
      assetLogType.assetId = props.data[0].id;
      assetLogType.assetLog.notes = "Audio Played";
      dispatch(addAssetLog(assetLogType));
      playBtn?.classList.remove("zoomOut");
      playBtn?.classList.add("zoomIn");
      videoFrontLayer && (videoFrontLayer.style.zIndex = "1");
      setTimeout(() => {
        playBtn?.classList.remove("zoomIn");
        playBtn?.classList.add("zoomOut");
        videoFrontLayer && (videoFrontLayer.style.zIndex = "0");
      }, 1200);
    } else {
      if(assetViewed.current){
        assetLogType.assetId = props.data[0].id;
        assetLogType.assetLog.notes = "Audio Paused";
        dispatch(addAssetLog(assetLogType));
      }else{
        assetViewed.current = true
        assetLogType.assetId = props.data[0].id;
        assetLogType.assetLog.notes = "Audio Viewed";
        dispatch(addAssetLog(assetLogType));
      }
      pauseBtn?.classList.remove("zoomOut");
      pauseBtn?.classList.add("zoomIn");
      videoFrontLayer && (videoFrontLayer.style.zIndex = "1");
      setTimeout(() => {
        pauseBtn?.classList.remove("zoomIn");
        pauseBtn?.classList.add("zoomOut");
        videoFrontLayer && (videoFrontLayer.style.zIndex = "0");
      }, 1200);
    }
  }, [isPlaying]);

  return (
    
      <div className="_video_player_layout_main" onKeyDown={keydownListener} tabIndex={-1}>
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''} >

      
        <div className="_video_player_container" id="_asset_detail_view_idx" ref={layoutRef}>
        <div id="crx_video_player"  ref={settingRef} className="CRX_Audio_Player_Screen">
      
        <div className={`_video_player_container _thumbnailPosition_audiofalse_multifalse_view1`}>
        <div id="crx_video_player" className={( false  && `video_with_multiple_timeline _Multiview_Grid_Spacer_1`) || "_Multiview_Grid"}>
         
          <CRXToaster ref={toasterMsgRef} />
          
            <div id="screens">
                  <div id="videoFrontLayer" className={"videoFrontLayer fullWidthOverLay"}>
                  {isPlaying ? (
                    <div
                      id="_audio_play"
                      className={`video_play_onScreen _video_button_size animated`}
                    >
                      <PlayButton />
                    </div>
                  ) : (
                    <div
                      id="_audio_pause"
                      className={`video_pause_onScreen _video_button_size animated`}
                    >
                      <PauseButton />
                    </div>
                  )}
                </div>
              <AudioScreen
                setData={setdata}
                evidenceId={EvidenceId}
                data={data}
                isPlaying={isPlaying}
                timelinedetail={timelinedetail}
                viewNumber={viewNumber}
                videoHandlers={videoHandlers}
                setupdateVideoSelection={setupdateVideoSelection}
                setscreenChangeVideoId={setscreenChangeVideoId}
              />

                <div className={`modeButton ${viewControlEnabler}`} >

                {modePrev && mode == 2 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == 4 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == 6 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == -2 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
                {modePrev && mode == -4 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
                {modePrev && mode == -6 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
                </div>
              <div id="volumePercentage" ref={volumeIcon}>
                <div className="volume_video_icon animated">
                  <i className={volumePer}></i>
                  <div className={`volume_percent_text ${volumPercent == 100 ? "volPercentSpace" : ""} `}>{isMute ? 0 : volume}%</div>
                </div>
              </div>
            </div>
            
            <div>
            </div>
         
            <div id="CRX_Audio_Player_Controls"     onMouseMove={fullViewScreenOn}    >
             <div className={`view_Main_Controller_Bar ${viewControlEnabler}`}>
             <div className={`player_controls_inner `}>
                <div className="main-control-bar">
                  <AudioPlayerSeekbar
                    controlBar={controlBar}
                    handleControlBarChange={handleControlBarChange}
                    timelineduration={timelineduration} />
                </div>
                <div className="videoPlayer_Timeline_Time">
                  <div className="playerViewFlexTimer">
                    <div id="counter">{milliSecondsToTimeFormat(new Date(controlBar * 1000))}</div>
                  </div>
                  <div className="V_timeline_end_time">
                    <div id="counter">{finalduration}</div>
                  </div>
                  
                </div>
              </div>
              
              {/* <div className="crx_video_graph"></div> */}
              <div className={`playerViewFlex enablebViewFlex`}>
                <div className="playerViewLeft">
                
                    <CRXButton color="primary" onClick={handlePlayPause} variant="contained" className={`videoPlayerBtn ${isPlaying ? "pauseBtn" : "playBtn"}`} >
                      <CRXTooltip
                        iconName={isPlaying ? "icon icon-pause2 iconPause2" : "icon icon-play4 iconPlay4"}
                        placement="top"
                        title={<>{isPlaying ? "Pause" : "Play"} <span className="playPause">Shift + Space</span></>}
                        arrow={false}
                        disablePortal={!ViewScreen ? true : false}
                      />
                    </CRXButton>
                    <AudioVolumeControl  volume={volume} setVolume={setVolume} setVolumeHandle={setVolumeHandle} setMuteHandle={setMuteHandle} isMute={isMute} setIsMute={setIsMute} handleVoumeClick={handleVoumeClick} viewScreen={ViewScreen}/>
                </div>
                <div className="playerViewMiddle">
                  <div className="playBackMode">
                    <button className="UndoIconHover UndoIconPosition" disabled={disabledModeLeft} onClick={() => modeSet(mode > 0 ? -2 : (mode - 2))} >
                      {mode < 0 ? <span className="modeIconUndoLinker" style={{ background: modeColorMinus }}><span>{modeMinus}</span>{"x"}</span> : ""}
                      <CRXTooltip
                        iconName={"fas fa-undo-alt undoAltIcon"}
                        placement="top"
                        title={<>Playback slow down <span className="playBackTooltip">Shift + ,</span></>}
                        arrow={false}
                        disablePortal={!ViewScreen ? true : false}
                      />
                    </button>
                    <button className="MinusIconPosition" disabled={disabledModeMinus} onClick={() => modeSet(0)}>
                      <CRXTooltip
                        iconName={"icon icon-minus iconMinusUndo"}
                        placement="top"
                        title={<>Normal speed <span className="normalSped">Shift + /</span></>}
                        arrow={false}
                        disablePortal={!ViewScreen ? true : false}
                      />
                    </button>
                    <button className="UndoIconHover RedoIconPosition" disabled={disabledModeRight} onClick={() => modeSet(mode < 0 ? 2 : (mode + 2))} >
                      {mode > 0 ? <span className="modeIconRedoLinker" style={{ background: modeColorPlus }}><span>{mode}</span>{"x"}</span> : ""}
                      <CRXTooltip
                        iconName={"fas fa-redo-alt undoRedoIcon"}
                        placement="top"
                        title={<>Playback speed up <span className="playBackTooltipUp">Shift + .</span></>}
                        arrow={false}
                        disablePortal={!ViewScreen ? true : false}
                      />
                    </button>
                  </div>
                </div>
                <div className={` playerViewRight`}>
                <div>
                  { props.viewAudioUpload ?
                  <AudioUpload
                    audioData={props.data}
                    setData={setdata}
                    uploadedFileData={props.uploadedFileData}
                  />
                  :<div/>}
                </div>
                  <div className="playerView"> 
                  
                    {ViewScreen ?
                      <div onClick={viewScreenEnter} >
                        <CRXTooltip
                          iconName={"fas fa-expand-wide"}
                          placement="top"
                          title={<>Full screen <span className="FullScreenTooltip">Shift + ALT + F</span></>}
                          arrow={false}
                         disablePortal={!ViewScreen ? true : false}
                        />
                      </div> :
                      <div onClick={viewScreenExit}>
                        <CRXTooltip
                          iconName={"fas fa-compress-wide"}
                          placement="top"
                          title={<>Minimize screen <span className="FullScreenTooltip">ESC</span></>}
                          arrow={false}
                          disablePortal={!ViewScreen ? true : false}
                        />
                      </div>}
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
         
        </div>{/** Video player container close div */}
      
      
      </div>
      </div>
      
      </FullScreen>
      </div>
    );
}

const PlayButton = () => {
  return (
    <div className="video_playButton">
      <i className="icon icon-play4"></i>
    </div>
  );
};

const PauseButton = () => {
  return (
    <div className="video_PauseButton">
      <i className="icon icon-pause2"></i>
    </div>
  );
};
export default AudioPlayerBase
