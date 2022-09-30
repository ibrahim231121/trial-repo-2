import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import VideoScreen from "./VideoScreen";
import Timelines from "./Timeline";
import "./VideoPlayer.scss";
import { useInterval } from 'usehooks-ts'
import VolumeControl from "./VolumeControl";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import VideoPlayerNote from "./VideoPlayerNote";
import VideoPlayerBookmark from "./VideoPlayerBookmark";
import { FormControlLabel, Switch } from "@material-ui/core";
import VideoPlayerViewReason from "./VideoPlayerViewReason";
import VideoPlayerViewRequirement from "./VideoPlayerViewRequirement";
import { setTimeout } from "timers";
import TimelineSyncInstructionsModal from "./TimelineSyncInstructionsModal";
import CRXSplitButton from "./CRXSplitButton";
import TimelineSyncConfirmationModal from "./TimelineSyncConfirmationModal";
import { TimelinesSync } from "../../utils/Api/models/EvidenceModels";
import { EvidenceAgent } from "../../utils/Api/ApiAgent";
import VideoPlayerSeekbar from "./VideoPlayerSeekbar";
import VideoPlayerOverlayMenu from "./VideoPlayerOverlayMenu";
import VideoPlayerSettingMenu from "./VideoPlayerSettingMenu";
import { CRXButton, CRXTooltip, SVGImage, CRXToaster , CBXSwitcher} from "@cb/shared";
import BookmarkNotePopup from "./BookmarkNotePopup";
import MaterialMenu from "@material-ui/core/Menu";
import MaterialMenuItem from "@material-ui/core/MenuItem";
import AduioImage from "../../Assets/Images/dummy_audio_img2.jpg";
import AduioImageZoomInZoomOut  from "../../Assets/Images/dummy-audio-zoom.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import { addTimelineDetailActionCreator } from "../../Redux/VideoPlayerTimelineDetailReducer";
import "./VideoPlayerResponsive.scss";


type Timeline = {
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
  dispatch: any
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
  dispatch: any
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
async function TimelineData_generator(TimelineGeneratorModel: TimelineGeneratorModel,) {
  const { data, minstartpoint, duration, updateVideoSelection, timelinedetail, timelineSyncHistory, setTimelineSyncHistory, timelineSyncHistoryCounter, setTimelineSyncHistoryCounter, setBufferingArray, setupdateVideoSelection, isDetailPageAccess, dispatch } = TimelineGeneratorModel
  let rowdetail: Timeline[] = [];
  let bufferingArr: any[] = [];
  for (let x = 0; x < data.length; x++) {
    let timeOffset = data[x].recording.timeOffset ?? 0;
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
          timeOffset: temptimelinedetail.timeOffset
        }
        rowdetail.push(myData);
      }
    }
    else {
      let protocol = 'http://';
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
        src: isDetailPageAccess ? data[x].files[0].downloadUri : `${protocol}commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        id: "Video-" + x,
        dataId: data[x].id,
        unitId: data[x].unitId,
        enableDisplay: x == 0 ? true : false,
        indexNumberToDisplay: x == 0 ? 1 : 0,
        camera: data[x].camera,
        timeOffset: timeOffset
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
  await dispatch(addTimelineDetailActionCreator(rowdetail));
  setupdateVideoSelection(false);
}
async function Durationfinder(DurationFinderModel: DurationFinderModel) {
  const { Data, setfinalduration, settimelineduration, setmaxminendpoint, updateVideoSelection, timelinedetail, timelineSyncHistory, setTimelineSyncHistory, timelineSyncHistoryCounter, setTimelineSyncHistoryCounter, setBufferingArray, setupdateVideoSelection, isDetailPageAccess, dispatch } = DurationFinderModel

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
  let durationInDateFormat = new Date(duration);
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
    dispatch
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
const updateTimelinesMaxDurations = async (maxTimelineDuration: number, tempTimelines: Timeline[], indexNumberToDisplay: number, setfinalduration: any, settimelineduration: any, dispatch: any) => {
  tempTimelines = JSON.parse(JSON.stringify(tempTimelines));
  let durationinformat = secondsToHms(maxTimelineDuration);
  setfinalduration(durationinformat.toString())
  settimelineduration(maxTimelineDuration);

  tempTimelines.filter((x: any) => x.indexNumberToDisplay !== indexNumberToDisplay).forEach((x: any) => {
    let recording_Start_point_ratio = ((x.recording_start_point / maxTimelineDuration) * 100)
    let recording_end_point_ratio = 100 - ((x.recording_end_point / maxTimelineDuration) * 100)
    let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio

    x.recording_Start_point_ratio = recording_Start_point_ratio;
    x.recording_end_point_ratio = recording_end_point_ratio;
    x.recordingratio = recordingratio;
  })
  await dispatch(addTimelineDetailActionCreator(tempTimelines));
}

const VideoPlayerBase = (props: any) => {

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
      disabled: false,
    },
    {
      label: 'Save as',
      disabled: true,
    },
    {
      label: 'Undo',
      disabled: false,
    },
    {
      label: 'Redo',
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


  const dispatch = useDispatch();
  const [bufferingArray, setBufferingArray] = React.useState<any[]>([]);
  const [bufferingArrayFwRw, setBufferingArrayFwRw] = React.useState<any[]>([]);
  const [visibleThumbnail, setVisibleThumbnail] = useState<number[]>([]);

  const [maxminendpoint, setmaxminendpoint] = useState<MaxMinEndpoint>();
  const [bookmarktime, setbookmarktime] = useState<number>();
  const [finalduration, setfinalduration] = useState<string>();
  const [timelineduration, settimelineduration] = useState(0);


  const [viewNumber, setViewNumber] = useState(1);
  const [mapEnabled, setMapEnabled] = useState<boolean>(false);
  const [multiTimelineEnabled, setMultiTimelineEnabled] = useState<boolean>(false);
  const [singleVideoLoad, setsingleVideoLoad] = useState<boolean>(true);

  const [controlBar, setControlBar] = useState(0);

  const [timer, setTimer] = useState<number>(0);
  const [timerFwRw, setTimerFwRw] = useState<number[]>([]);
  const [mode, setMode] = useState<number>(0);
  const [modeFw, setModeFw] = useState<number>(0);
  const [modeRw, setModeRw] = useState<number>(0);
  const [markerFwRw, setMarkerFwRw] = useState<boolean>(false);
  const [ismodeFwdisable, setismodeFwdisable] = useState<boolean>(false);
  const [ismodeRwdisable, setisModeRwdisable] = useState<boolean>(false);
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
  const toasterMsgRef = React.useRef<typeof CRXToaster>(null);


  const [controllerBar, setControllerBar] = useState(true);

  const [styleScreen, setStyleScreen] = useState(false);


  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState<number>(1000); 
  const [speedFwRw, setSpeedFwRw] = useState<number>(1000);
  const [openThumbnail, setopenThumbnail] = useState<boolean>(false);
  const [mouseovertype, setmouseovertype] = useState("");
  const [timelinedetail1, settimelinedetail1] = useState<any>();
  const [Event, setEvent] = useState();
  const [updateVideoSelection, setupdateVideoSelection] = useState<boolean>(false);
  const [timelineSyncHistory, setTimelineSyncHistory] = useState<TimelineSyncHistoryMain[]>([]);
  const [timelineSyncHistoryCounter, setTimelineSyncHistoryCounter] = useState<number>(0);
  const [showFRicon, setShowFRicon] = useState({
    showFRCon: false,
    caseNum: 0
  });
  const [modePrev, setModePrev] = useState(false)
  const [frameForward, setFrameForward] = useState(false);
  const [frameReverse, setFrameReverse] = useState(false);
  const [iconChanger, setIconChanger] = useState(false);
  const [openTimelineSyncInstructions, setOpenTimelineSyncInstructions] = useState<boolean>(false);
  const [startTimelineSync, setStartTimelineSync] = useState<boolean>(false);
  const [openTimelineSyncConfirmation, setOpenTimelineSyncConfirmation] = useState<boolean>(false);
  const [settingMenuEnabled, setSettingMenuEnabled] = useState<any>(null);
  const [overlayEnabled, setOverlayEnabled] = useState<any>(null);
  const [overlayCheckedItems, setOverlayCheckedItems] = useState<string[]>([]);
  const [viewReasonControlsDisabled, setViewReasonControlsDisabled] = useState<boolean>(false);
  const [gpsJson, setGpsJson] = React.useState<any>();
  const [updateSeekMarker, setUpdateSeekMarker] = React.useState<any>();
  const [onMarkerClickTimeData, setOnMarkerClickTimeData] = React.useState<Date>();
  const [openViewRequirement, setOpenViewRequirement] = React.useState<boolean>(true);
  const [reasonForViewing, setReasonForViewing] = React.useState<boolean>(false);
  const [isMultiViewEnable, setIsMultiViewEnable] = React.useState<boolean>(false);
  const [bookmarksNotesPopup, setBookmarksNotesPopup] = useState<any[]>([]);
  const [isBookmarkNotePopup, setIsBookmarkNotePopup] = useState(false);
  const [bookmarkNotePopupArrObj, setBookmarkNotePopupArrObj] = useState<any>([]);

  const [volumPercent, setVolumPercent] = useState<number>();
  const [mutePercentVol, setMutePercentVol] = useState<number>();
  const [volume, setVolume] = useState<number>(100);
  const [layoutMenuEnabled, setLayoutMenuEnabled] = useState<any>(null);
  const [isAudioGraph, setIsAudioGraph] = useState<boolean>(true);  const volumeIcon = useRef<any>(null);
  const last_media_time = useRef(0);
  const last_frame_num = useRef(0);
  const fps_rounder = useRef<any>([]);
  const frame_not_seeked = useRef<boolean>(true);
  const [fps, setFps] = useState<number>(30); // Default set to 30fps until fps is not set
  const [detailContent, setDetailContent] = useState<boolean>(false);
  const demoRef = useRef(null)

  const keydownListener = (event: any) => {
    const { code, shiftKey } = event;
    if(!(openBookmarkForm || openNoteForm || reasonForViewing))
    {
      if (code == "Space") {event.preventDefault(); handlePlayPause()} //Space bar
      if (shiftKey && code == "BracketRight") {event.preventDefault(); onClickFwRw(modeFw + 2, 1)} //shift + ]
      if (shiftKey && code == "BracketLeft") {event.preventDefault(); onClickFwRw(modeRw + 2, 2)} //shift + [
      if (shiftKey && code == "Period") {
        event.preventDefault(); 
        modeSet(mode < 0 ? 2 : (mode + 2))
      } //Shift + .
      if (shiftKey && code == "Comma") {event.preventDefault(); modeSet(mode > 0 ? -2 : (mode - 2))} //Shift + ,
      if (code == "Slash") {event.preventDefault(); modeSet(0)} // /
      if (code == "ArrowRight") {event.preventDefault(); handleforward()} //Shift + ->
      if (code == "ArrowLeft") {event.preventDefault(); handleReverse()} //Shift + <-
      if (code == "ArrowDown") {
        event.preventDefault(); 
        setVolume(volume - 1);
        setVolumeHandle(volume - 1);
      } //down arrows
      if (code == "ArrowUp") {
        event.preventDefault(); 
        setVolume(volume + 1);
        setVolumeHandle(volume + 1);
      } //up arrows
      if (code == "KeyN") {event.preventDefault(); handleaction("note")} // N
      if (code == "KeyB") {event.preventDefault(); handleaction("bookmark")} // B
      if (code == "KeyF") {event.preventDefault(); viewScreenEnter()} // B
      if (code == "KeyL") {event.preventDefault(); setLayoutMenuEnabled(true);} // B
    }

  };

  React.useEffect(() => {
    if(fps && videoHandlers.length>0){
      // stop Eventlister to get Fps
      let vid = videoHandlers[0];
      vid.removeEventListener("seeked", function () {});
    }
  }, [fps]);

  React.useEffect(() => {
    if(videoHandlers.length>0){
      // Getting Video Fps
      getFps(videoHandlers[0])
    }
  }, [videoHandlers]);

  React.useEffect(() => {
    if (onMarkerClickTimeData) {
      seekSliderOnMarkerClick(onMarkerClickTimeData);
    }
  }, [onMarkerClickTimeData]);

  React.useEffect(() => {
    if (props.gpsJson && props.gpsJson.length > 0) {
      setGpsJson(props.gpsJson);
    }
  }, [props.gpsJson]);


  React.useEffect(() => {
    let propdata;
    if (props.history !== undefined) {
      propdata = props.history.location.state?.data;
    }
    else {
      propdata = props.data;
    }
    if (propdata) {
      propdata = propdata.filter((x: any) => x.typeOfAsset == "Video");
      if (propdata.length > 1) {
        setsingleVideoLoad(false);
      }
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
    if (path == "/videoplayer") {
      pathBody?.classList.add("pathVideoPlayer");
    } else if (path == "/assetdetail") {
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
        dispatch: dispatch
      });
      setLoading(true)
    }
  }, [data]);

  const timelinedetail: Timeline[] = useSelector(
    (state: RootState) => state.timelineDetailReducer.data
  );

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
      setismodeFwdisable(false);
      setisModeRwdisable(false);
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
    setModePrev(true);
  }, [isOpenWindowFwRw, isvideoHandlersFwRw]);

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
      if(count>1){
        setIsMultiViewEnable(true);
      }
      else{
        setIsMultiViewEnable(false);
      }

      // work for BookmarkNotePopup Component
      var tempbookmarksnotesarray: any[] = [];
      timelinedetail.forEach((x:Timeline) => 
        {x.enableDisplay && x.bookmarks.forEach((y:any)=>
          {
            let tempData: any = JSON.parse(JSON.stringify(y));
            tempData.timerValue = x.recording_start_point + (y.position/1000);
            tempData.objtype = "Bookmark";
            tempbookmarksnotesarray.push(tempData);
          }
        )
        x.enableDisplay && x.notes.forEach((y:any)=> 
          {
            let tempData: any = JSON.parse(JSON.stringify(y));
            tempData.timerValue = x.recording_start_point + (y.position/1000);
            tempData.objtype = "Note";
            tempbookmarksnotesarray.push(tempData);
          }
        )}
      )
      setBookmarksNotesPopup(tempbookmarksnotesarray);
    }
  }, [timelinedetail]);

  React.useEffect(() => {
    if (bookmarkNotePopupArrObj.length>0) { // work for BookmarkNotePopup Component
      console.log("Jamil",bookmarkNotePopupArrObj);
      setIsBookmarkNotePopup(true);
    }
    else{
      setIsBookmarkNotePopup(false);
      console.log("Jamil",bookmarkNotePopupArrObj);
    }
  }, [bookmarkNotePopupArrObj]);

  const getFps = (videoHandle: any) => {
    videoHandle.requestVideoFrameCallback(ticker);
    videoHandle.addEventListener("seeked", function () {
      let fps_rounder1 = fps_rounder.current;
      fps_rounder1.pop();
      fps_rounder.current = fps_rounder1;
      frame_not_seeked.current = false;
    });
  };

  const ticker = (useless: any, metadata: any) => { // GetFps Work
    let fps;
    let vid = videoHandlers[0];
    const fps_rounder1 = fps_rounder.current;
    
    const media_time_diff = Math.abs(metadata.mediaTime - last_media_time.current);
    const frame_num_diff = Math.abs(metadata.presentedFrames - last_frame_num.current);
    const diff = media_time_diff / frame_num_diff;
    if (diff && diff < 1 && fps_rounder1.length < 50 && frame_not_seeked.current && vid.playbackRate === 1) {
      fps_rounder1.push(diff);
      fps_rounder.current = fps_rounder1;
      fps = Math.round(1 / get_fps_average());
      console.log("FPS: " + fps + ", certainty: " + fps_rounder1.length * 2 + "%");
      if(fps_rounder1.length * 2 == 100){
        setFps(fps);
      }
    }
    frame_not_seeked.current = true;
    last_media_time.current = metadata.mediaTime;
    last_frame_num.current = metadata.presentedFrames;
    if(fps_rounder1.length * 2 != 100){
      vid.requestVideoFrameCallback(ticker);
    }
  }

  function get_fps_average() { // GetFps Work
    let fps_rounder1 = fps_rounder.current;
    return fps_rounder1.reduce((a: any, b: any) => a + b) / fps_rounder.current.length;
  }


  const handleControlBarChange = (event: any, newValue: any) => {

    setTimer(newValue);
    setMarkerFwRw(false);
    setisPlayingFwRw(false);
    setControlBar(newValue);
    videoHandlers.forEach((videoHandle: any) => {
      hanldeVideoStartStop(newValue, videoHandle, false);
    })
  };

  const screenClick = async (view: number, event: any) => {
    var tempTimelines = JSON.parse(JSON.stringify(timelinedetail));
    var disableTimline = tempTimelines.filter((x: any) => x.indexNumberToDisplay > view);
    disableTimline.forEach((x: any) => {
      x.indexNumberToDisplay = 0;
      x.enableDisplay = false;
    })
    if(disableTimline.length>0){
      await dispatch(addTimelineDetailActionCreator(tempTimelines));
      setupdateVideoSelection(true);
    }
    return setViewNumber(view);
  }

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
    setMarkerFwRw(false);
    setisPlayingFwRw(false);
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
  const handleReverse = () => {
    setPlaying(false);
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
      videoHandle.currentTime = videoHandle.currentTime - (1/fps);
      hanldeVideoStartStop(videoHandle.currentTime, videoHandle, false);
    });
    if(timer > 0){
      handleControlBarChange(null, timer - (1/fps));
    }
    setFrameReverse(true);
    setFrameForward(false);
  };
  const handleforward = () => {
    setPlaying(false);
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
      videoHandle.currentTime = videoHandle.currentTime + (1/fps);
      hanldeVideoStartStop(videoHandle.currentTime, videoHandle, false);
    });
    if(timer < timelineduration){
      handleControlBarChange(null, timer + (1/fps));
    }
    setFrameForward(true);
    setFrameReverse(false);
  };

  const handleaction = (action: any) => {
    videoHandlers.forEach((videoHandle: any) => {
      videoHandle.pause();
    });
    setMarkerFwRw(false);
    setisPlayingFwRw(false);
    const playerCurrentTime = Math.round(timer * 1000);
    let timeOffset = data[0].recording.timeOffset ?? 0;
    let startdiff = new Date(data[0].recording.started).getTime() + timeOffset - (maxminendpoint?.Min_Start_point ?? 0);
    let enddiff = new Date(data[0].recording.ended).getTime() + timeOffset - (maxminendpoint?.Min_Start_point ?? 0);
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
        toasterMsgRef.current.showToaster({
          message: "Please seek to appropriate time of master camera to bookmark", variant: "Error", duration: 5000, clearButtton: true
        });
      }
      else if (action == "note") {
        toasterMsgRef.current.showToaster({
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
          toasterMsgRef.current.showToaster({
            message: "Unable To Add Duplicate Bookmark", variant: "Error", duration: 5000, clearButtton: true
          });
        }
      })
    }
    else if (action == "note") {
      data[0].notes?.forEach((y: any) => {
        if (minBKMTime <= y.position && mixBKMTime >= y.position) {
          error = true;
          toasterMsgRef.current.showToaster({
            message: "Unable To Add Duplicate Note", variant: "Error", duration: 5000, clearButtton: true
          });
        }
      })
    }
    return error;
  }

  useEffect(() => {
    let videoElements: any[] = [];
    timelinedetail.filter((y: any) => y.enableDisplay).forEach((x: any) => {
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
    })
    if(videoElements.length>0)
    {
      setVideoHandlers(videoElements);
    }
  }, [timelinedetail]);

  useEffect(() => {
    if (videoHandlersFwRw.length > 0) {
      videoHandlersFwRw.forEach((videoHandle: any) => {
        videoHandle?.addEventListener("canplay", function () {
          let bufferingArrayObj = bufferingArrayFwRw.find((y: any) => y.id == videoHandle.id);
          if(bufferingArrayObj){
            bufferingArrayObj.buffering = true;
            setBufferingArrayFwRw(bufferingArrayFwRw);
          }
        }, true);

        videoHandle?.addEventListener("waiting", function () {
          let bufferingArrayObj = bufferingArrayFwRw.find((y: any) => y.id == videoHandle.id);
          if(bufferingArrayObj){
            bufferingArrayObj.buffering = false;
            setBufferingArrayFwRw(bufferingArrayFwRw);
          }
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
            renderMarkerOnSeek(timerValue);
            renderBookmarkNotePopupOnSeek(timerValue);
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
            let TimeLinePipe: any = document.querySelector("#_fwrw_timeLine_pipeRed");
            if (modeFw > 0) {
              timerFwRw.forEach((x: any) => {
                timerValue.push(x + 0.25);
              })
              if(!(timerValue[2]>timelinedetail[0].recording_end_point))
              {
                TimeLinePipe.style.left = (timerValue[2]/timelineduration)*100 + "%";
              }
            }
            else if (modeRw > 0) {
              timerFwRw.forEach((x: any) => {
                timerValue.push(x - 0.25);
              })
              if(!(timerValue[2]<timelinedetail[0].recording_start_point))
              {
                TimeLinePipe.style.left = (timerValue[2]/timelineduration)*100 + "%";
              }
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
    }, 1200)
  }
  useEffect(() => {
    volumeIcon.current.style.opacity = 0
  }, [])

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
    var video: any = timelinedetail[0];
    var currVideoStartTime = video.recording_start_point;
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

    setSpeedFwRw(250);
    setisPlayingFwRw(true);
    setMarkerFwRw(true);
    switch (CaseNo) {
      case 1: //Forward
        if (modeRw > 0) {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(videoHandle.currentTime + currVideoStartTime + Currmode * num);
            num++;
          });
        }
        else {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(Currmode > 2 ? videoHandle.currentTime + currVideoStartTime + Currmode * num : controlBar + Currmode * num);
            num++;
          });
        }
        setModeRw(0);
        setModeFw(Currmode);
        break;
      case 2: //Rewind
        if (modeFw > 0) {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(videoHandle.currentTime + currVideoStartTime + Currmode * num);
            num++;
          });
        }
        else {
          videoHandlersFwRw.forEach((videoHandle: any) => {
            videoTimerFwRw.push(Currmode > 2 ? videoHandle.currentTime + currVideoStartTime + Currmode * num : controlBar + Currmode * num);
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
    setMarkerFwRw(false);
    setisPlayingFwRw(false);
    var video: any = timelinedetail[0];
    let currTime = Math.floor(event.target.currentTime);

    var currTimeTotal = currTime + (video.recording_start_point);

    handleControlBarChange(null, currTimeTotal);
    setPlaying(!isPlaying);
    if (!isPlaying) {
      videoHandlers.forEach((videoHandle: any) => {
        hanldeVideoStartStop(currTimeTotal, videoHandle, true);
      });
    }
  }

  const onClickBookmarkNote = (event: any, Case: number) => {
    var videos: any = timelinedetail;
    var video: any;
    switch (Case) {
      case 1: //Bookmark
        videos.forEach((vid: any) => {
          if (vid.bookmarks.some((x: any) => x.assetId == event.assetId && x.id == event.id)) { video = vid }
        }
        )
        break;
      case 2: //Notes
        videos.forEach((vid: any) => {
          if (vid.notes.some((x: any) => x.assetId == event.assetId && x.id == event.id)) { video = vid }
        }
        )
        break;
      default:
        break;
    }
    if (video) {
      var position = event.position / 1000;
      var currTimeTotal = position + (video.recording_start_point);
      handleControlBarChange(null, currTimeTotal);
    }
  }

  const mouseOut = () => {
    setopenThumbnail(false);
  }

  const mouseOverBookmark = (event: any, y: any, x: any) => {
    setmouseovertype("bookmark");
    setbookmark(y);
    //setbookmarklocation(getbookmarklocation(y.position, x.startdiff));
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }

  const mouseOverNote = (event: any, y: any, x: any) => {
    setmouseovertype("note");
    setnote(y);
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }

  const mouseOverRecordingStart = (event: any, y: any, x: any) => {
    setmouseovertype("recordingstart");
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }
  const mouseOverRecordingEnd = (event: any, y: any, x: any) => {
    setmouseovertype("recordingend");
    settimelinedetail1(x);
    setEvent(event);
    setopenThumbnail(true);
  }

  const getbookmarklocation = (position: any, startdiff: any) => {
    var timeLineHover: any = document.querySelector("#SliderControlBar");
    var timelineWidth = timeLineHover?.scrollWidth < 0 ? 0 : timeLineHover?.scrollWidth;
    let timelineposition = position + ((startdiff) * 1000);
    let timelinepositionpercentage = (timelineWidth / timelineduration) * (timelineposition / 1000)  // Math.round((Math.round(timelineposition / 1000) / timelineWidth))
    return timelinepositionpercentage;
  }

  const onClickFwRw = (Currmode: number, CaseNo: number) => {
    setShowFRicon({ showFRCon: true, caseNum: CaseNo });
    if (Currmode >= 6) {
      switch (CaseNo) {
        case 1: //Forward
          setismodeFwdisable(true);
          break;
        case 2: //Rewind
          setisModeRwdisable(true);
          break;
        default:
          break;
      }
    }
    else {
      setismodeFwdisable(false);
      setisModeRwdisable(false);
    }
    if (isOpenWindowFwRw && isvideoHandlersFwRw) {
      modeSetFwRw(Currmode, CaseNo)
    }
    else {
      setcurractionFwRw({ currmode: Currmode, currcase: CaseNo })
      setisOpenWindowFwRw(true);
    }

  }


  const displayThumbnail = (event: any, x: any, displayAll: boolean, withdescription?: string) => {
    var timeLineHover: any = !isMultiViewEnable ? document.querySelector("#SliderControlBar") : document.querySelector("#timeLine-hover" + x.indexNumberToDisplay);
    var timelineWidth = timeLineHover?.scrollWidth < 0 ? 0 : timeLineHover?.scrollWidth;

    var leftPadding = timeLineHover.getBoundingClientRect().left;

    var lenghtDeduct: number = 0;
    var totalLenght = document.querySelector("#SliderControlBar")?.getBoundingClientRect().right ?? 0;
    var totalThumbnailsLenght = timelinedetail.filter((x: any) => x.enableDisplay).length * 128;
    var totalLenghtPlusThumbnails = event.pageX + totalThumbnailsLenght;
    if (totalLenghtPlusThumbnails > totalLenght) {
      lenghtDeduct = totalLenghtPlusThumbnails - totalLenght;
    }


    var pos = (event.pageX - leftPadding) / timelineWidth;
    var ttt = Math.round(pos * x.video_duration_in_second);
    var Thumbnail: any = document.querySelector("#Thumbnail" + x.indexNumberToDisplay);
    var ThumbnailContainer: any = document.querySelector("#video_player_hover_thumb" + x.indexNumberToDisplay);
    var TimeLinePipe: any = document.querySelector("#_hover_timeLine_pipeGray");
    var ThumbnailTime: any = document.querySelector("#Thumbnail-Time" + x.indexNumberToDisplay);
    //var ThumbnailCameraDesc: any = document.querySelector("#Thumbnail-CameraDesc" + x.indexNumberToDisplay);
    var ThumbnailDesc: any = document.querySelector("#Thumbnail-Desc");

    var SliderControlBar: any = document.querySelector("#SliderControlBar");
    var SliderControlBarOffset = SliderControlBar?.getBoundingClientRect().left;


    if (Thumbnail) {
      TimeLinePipe.style.left = (event.pageX - leftPadding) + "px";
      Thumbnail.currentTime = ttt > x.video_duration_in_second ? 0 : ttt;
      ThumbnailContainer.style.left = (event.pageX - SliderControlBarOffset) + (displayAll ? (((x.indexNumberToDisplay - 1) * 128)) : 0) + "px";
      ThumbnailTime.innerHTML = secondsToHms(ttt)
      //ThumbnailCameraDesc.innerHTML = x.camera;
      if (withdescription) {
        var ThumbnailIcon: any = document.querySelector("#Thumbnail-Icon" + x.indexNumberToDisplay);
        if (mouseovertype == "bookmark") {
          ThumbnailIcon.classList = ('fas fa-bookmark');
        }
        else if (mouseovertype == "note") {
          ThumbnailIcon.classList = ('fas fa-comment-alt-plus ');
        }
        ThumbnailDesc.innerHTML = withdescription;

      }
    }
  }




  const AdjustTimeline = async (event: any, timeline: any, mode: number) => {
    mode = mode / 1000;

    let timeLineHover: any = document.querySelector("#SliderControlBar");
    let timelineWidth = timeLineHover?.scrollWidth < 0 ? 0 : timeLineHover?.scrollWidth;
    let leftPadding = timeLineHover.getBoundingClientRect().left;

    let pxPerSecond = timelineWidth / timelineduration;
    let ttt: number = 0;
    if (mode === 0) {
      let positionInSeconds = ((event.pageX - leftPadding) / pxPerSecond)
      ttt = positionInSeconds - timeline.recording_start_point;
    }
    else {
      ttt = mode;
    }
    ttt = (timeline.recording_start_point + ttt) < 0 ? 0 : ttt;

    let newTimelineDuration = timeline.recording_start_point + ttt + timeline.video_duration_in_second;
    let tempTimelines = JSON.parse(JSON.stringify(timelinedetail));
    let tempTimeline: any = tempTimelines.find((x: any) => x.indexNumberToDisplay == timeline.indexNumberToDisplay);




    if (tempTimeline) {
      let recording_start_point = tempTimeline.recording_start_point + ttt;
      let recording_end_point = tempTimeline.recording_end_point + ttt;


      tempTimeline.recording_start_point = recording_start_point;
      tempTimeline.recording_end_point = recording_end_point;

      let maxTimelineDuration = MaxTimelineCalculation(tempTimelines, newTimelineDuration)?.maxTimelineDuration;

      let recording_Start_point_ratio = ((recording_start_point / maxTimelineDuration) * 100)
      let recording_end_point_ratio = 100 - ((recording_end_point / maxTimelineDuration) * 100)
      let startdiff = recording_start_point * 1000;
      let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio

      tempTimeline.recording_Start_point_ratio = recording_Start_point_ratio;

      tempTimeline.recording_end_point_ratio = recording_end_point_ratio;
      tempTimeline.startdiff = startdiff;
      tempTimeline.recordingratio = recordingratio;
      tempTimeline.timeOffset += ttt * 1000;
      await dispatch(addTimelineDetailActionCreator(tempTimelines));

      let timelineSyncHistoryTemp = [...timelineSyncHistory];
      timelineSyncHistoryTemp = timelineSyncHistoryTemp.slice(0, timelineSyncHistoryCounter + 1);
      let timelineHistoryArray: TimelineSyncHistory[] = [];
      tempTimelines.forEach((x: any) => {
        timelineHistoryArray.push({
          assetId: x.dataId,
          timeOffset: x.timeOffset,
          recording_start_point: x.recording_start_point,
          recording_end_point: x.recording_end_point,
        })
      })
      timelineSyncHistoryTemp.push({
        maxTimelineDuration: maxTimelineDuration,
        timelinesHistory: timelineHistoryArray
      })
      setTimelineSyncHistory(timelineSyncHistoryTemp);
      setTimelineSyncHistoryCounter(timelineSyncHistoryTemp.length - 1);

      if (maxTimelineDuration !== timelineduration) {
        await updateTimelinesMaxDurations(maxTimelineDuration, tempTimelines, tempTimeline.indexNumberToDisplay, setfinalduration, settimelineduration, dispatch)
      }
    }
  }

  const RevertToOriginal = async () => {
    let tempTimelines = JSON.parse(JSON.stringify(timelinedetail));
    let maxTimelineCalculationResponse = MaxTimelineCalculation(tempTimelines, undefined, true)
    let maxTimelineDuration = maxTimelineCalculationResponse?.maxTimelineDuration;
    let negativeHandler = maxTimelineCalculationResponse?.negativeHandler;
    let durationinformat = secondsToHms(maxTimelineDuration);
    setfinalduration(durationinformat.toString())
    settimelineduration(maxTimelineDuration);

    tempTimelines.forEach((x: any) => {
      let recording_start_point = x.recording_start_point - (x.timeOffset / 1000) + negativeHandler;
      let recording_Start_point_ratio = ((recording_start_point / maxTimelineDuration) * 100)
      let recording_end_point = x.recording_end_point - (x.timeOffset / 1000) + negativeHandler;
      let recording_end_point_ratio = 100 - ((recording_end_point / maxTimelineDuration) * 100)
      let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio

      x.recording_start_point = recording_start_point;
      x.recording_Start_point_ratio = recording_Start_point_ratio;
      x.recording_end_point = recording_end_point;
      x.recording_end_point_ratio = recording_end_point_ratio;
      x.recordingratio = recordingratio;
      x.timeOffset -= x.timeOffset;
    })
    await dispatch(addTimelineDetailActionCreator(tempTimelines));
    setTimelineSyncHistoryCounter(0);
    toasterMsgRef.current.showToaster({
      message: "Times reverted to original", letiant: "Success", duration: 5000, clearButtton: true
    });
  }
  const UndoRedo = async (indexOperation: number) => {
    let tempTimelines = JSON.parse(JSON.stringify(timelinedetail));
    let undoObj = timelineSyncHistory[indexOperation == 0 ? 0 : timelineSyncHistoryCounter + indexOperation];
    if (undoObj) {
      let maxTimelineDuration = undoObj.maxTimelineDuration;
      let durationinformat = secondsToHms(maxTimelineDuration);
      setfinalduration(durationinformat.toString())
      settimelineduration(maxTimelineDuration);

      tempTimelines.forEach((x: any) => {
        let timelineHistoryObj: any = undoObj.timelinesHistory.find((y: any) => y.assetId == x.dataId);
        let recording_start_point = timelineHistoryObj.recording_start_point;
        let recording_Start_point_ratio = ((recording_start_point / maxTimelineDuration) * 100)
        let recording_end_point = timelineHistoryObj.recording_end_point;
        let recording_end_point_ratio = 100 - ((recording_end_point / maxTimelineDuration) * 100)
        let recordingratio = 100 - recording_end_point_ratio - recording_Start_point_ratio;
        let timeOffset = timelineHistoryObj.timeOffset;

        x.recording_start_point = recording_start_point;
        x.recording_Start_point_ratio = recording_Start_point_ratio;
        x.recording_end_point = recording_end_point;
        x.recording_end_point_ratio = recording_end_point_ratio;
        x.recordingratio = recordingratio;
        x.timeOffset = timeOffset;
      })
      await dispatch(addTimelineDetailActionCreator(tempTimelines));
      let index = timelineSyncHistoryCounter + indexOperation < 0 ? 0 : timelineSyncHistoryCounter + indexOperation
      setTimelineSyncHistoryCounter(indexOperation == 0 ? 0 : index);
    }
    if (indexOperation == 0) {
      toasterMsgRef.current.showToaster({
        message: "Timelines reverted to last save", variant: "Success", duration: 5000, clearButtton: true
      });
    }
  }


  //Video Player  Logics
  const modeMinus = mode == -2 ? "2" : mode == -4 ? "4" : "6";
  const modeColorMinus = mode == -6 ? "#979797" : "white";
  const modeColorPlus = mode == 6 ? "#979797" : "white";
  const disabledModeLeft = (isPlaying ? false : true) || (mode == -6 ? true : false);
  const disabledModeRight = (isPlaying ? false : true) || (mode == 6 ? true : false);
  const disabledModeMinus = mode !== 0 && isPlaying ? false : true;

  const expandButton = () => {
    if (iconChanger) {
      setIconChanger(false);
    } else {
      setIconChanger(true);
    }
  }
  setTimeout(() => {
    if (frameForward == true || frameReverse == true) {
      setFrameForward(false);
      setFrameReverse(false);
    }

  }, 500);

  const saveOffsets = () => {
    var timelineHistoryArray: TimelineSyncHistory[] = [];
    let body: TimelinesSync[] = timelinedetail.map((x: any) => {
      timelineHistoryArray.push({
        assetId: x.dataId,
        timeOffset: x.timeOffset,
        recording_start_point: x.recording_start_point,
        recording_end_point: x.recording_end_point,
      })

      let obj: TimelinesSync = { 
        assetId: x.dataId,
        timeOffset: x.timeOffset
      }
      return obj;
    })
    const url = "/Evidences/" + EvidenceId + "/TimelineSync";
    EvidenceAgent.timelineSync(url, body).then(() => {
      toasterMsgRef.current.showToaster({
        message: "Timeline sync saved", variant: "Success", duration: 5000, clearButtton: true
      });
      var timelineSyncHistoryTemp: TimelineSyncHistoryMain[] = [{
        maxTimelineDuration: timelineduration,
        timelinesHistory: timelineHistoryArray
      }];
      setTimelineSyncHistory(timelineSyncHistoryTemp);
      setTimelineSyncHistoryCounter(0);
    })
      .catch((err: any) => {
        toasterMsgRef.current.showToaster({
          message: "Timelines failed to update", variant: "Error", duration: 5000, clearButtton: true
        });
      })
  }

  const seekSliderOnMarkerClick = (logtime: Date) => {
    let video: any = timelinedetail[0];
    let datavideo: any = data[0];
    if (video && datavideo) {
      let timeOffset = datavideo.recording.timeOffset;
      let video_start = new Date(datavideo.recording.started).getTime() + timeOffset;
      let duration = logtime.getTime() - video_start;
      let durationInDateFormat = (new Date(duration).getTime()) / 1000;
      let recording_start_point = video.recording_start_point + durationInDateFormat;
      setTimer(recording_start_point);
      setControlBar(recording_start_point);
    }
  }

  const renderMarkerOnSeek = (timerValue: number) => {
    if (gpsJson) {
      if (gpsJson.length > 0) {
        renderMarkerOnSeekTimelime(timerValue, data[0])
      }
    }
  }

  const renderMarkerOnSeekTimelime = (timerValue: number, firstdataobj: any) => {
    let timeOffset = firstdataobj.recording.timeOffset;
    let video_time = new Date(firstdataobj.recording.started).getTime() + timeOffset;
    let duration = ((timerValue * 1000) + video_time) / 1000;
    let ObjLatLog: any = []
    gpsJson.forEach((e: any) => {
      if (e.LOGTIME == duration) {
        ObjLatLog.push(e);
      }
    });
    if (ObjLatLog.length > 0) {
      setUpdateSeekMarker(ObjLatLog);
    }
  }

  let volumePer = volumPercent !== undefined ? volumPercent == 0 ? "icon-volume-mute1" : volumPercent >= 1 && volumPercent <= 33 ? "icon-volume-low1" : volumPercent >= 34 && volumPercent <= 66 ? "icon-volume-medium1" : "icon-volume-high1" : "";

  const showTrackHoverBar = (e: any) => {
    //Function for Grabbing icon show and hide.
    e._reactName === "onMouseDown" ?
      e.currentTarget.childNodes[3].style.visibility = "visible"
      :
      e.currentTarget.childNodes[3].style.visibility = "hidden";



  }

  useEffect(() => {
    let sliderTest = document.getElementById("SliderControlBar");
    sliderTest?.addEventListener("mousemove", () => {
      document?.querySelector<HTMLElement>("#SliderControlBar .MuiSlider-thumb")?.classList.add("cursorAdded");
    });
  })

  const renderBookmarkNotePopupOnSeek = (timerValue: number) => {
    let temparray: any[] = [];
    bookmarksNotesPopup.forEach((x:any)=> 
      {
        if(timerValue==x.timerValue)
        {
          let temp : any = JSON.parse(JSON.stringify(x));
          temp.timerValue = secondsToHms(temp.timerValue);
          temparray.push(temp);
        }
      }
    )
    if(temparray.length>0)
    {
      let temparray1 = [...bookmarkNotePopupArrObj, ...temparray];
      setBookmarkNotePopupArrObj(temparray1);
    }
  }
  useInterval(
    () => {
      if (bookmarkNotePopupArrObj.length>0) {
        let temp :any[] = [...bookmarkNotePopupArrObj];
        temp.shift();
        setBookmarkNotePopupArrObj(temp);
      }
    },
    // Speed in milliseconds or null to stop it
    isBookmarkNotePopup ? 5000 : null,
  );
  const [minWidth, setMinWidth] = useState<string | number>("1920");
  const [isShowPanel, setIsShowPanel] = useState<boolean>(false)
  const videoPlayerResponsiveRightButton = () => {
      const winWidth:string | number = window.innerWidth;
      setMinWidth(winWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', videoPlayerResponsiveRightButton)
    window.addEventListener('load', videoPlayerResponsiveRightButton)

    if(minWidth && minWidth <= 1024) {
      setIsShowPanel(true)
    }
  },[minWidth, isShowPanel])

  const openSettingMenu = (e : React.MouseEvent<HTMLElement>) => {
    setSettingMenuEnabled(e.currentTarget)
  }

  const sideDataPanel = (event:any) => {
    if(event.target.checked) {
      setMapEnabled(true)
    } else {
      setMapEnabled(false)

    }
  }

  useEffect(() => {
    let layoutContent = document?.querySelector("._Player_Layout_Menu_");
    let PlayerRight = document?.getElementById("crx_video_player");
    if(layoutContent) {
       PlayerRight?.appendChild(layoutContent)
    }

    document.documentElement.style.overflow = "hidden";
  },[])

 
  const gotoSeeMoreView = (e: any, targetId: any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }
  return (
    <>
      <div onKeyDown={keydownListener}>
      

      <div className="searchComponents">
        <div className="_video_player_container" id="_asset_detail_view_idx">
        <div id="crx_video_player" >
        <VideoPlayerViewRequirement
        
        openViewRequirement={openViewRequirement}
        setOpenViewRequirement={setOpenViewRequirement}
        setReasonForViewing={setReasonForViewing}
      />
      {reasonForViewing && <VideoPlayerViewReason
        setOpenViewReason={setopenNoteForm}
        openViewReason={true}
        EvidenceId={EvidenceId}
        AssetData={data[0]}
        setViewReasonControlsDisabled={setViewReasonControlsDisabled}
        setReasonForViewing={setReasonForViewing}
      />}
          <CRXToaster ref={toasterMsgRef} />
          <FullScreen onChange={screenViewChange} handle={handleScreenView} className={ViewScreen === false ? 'mainFullView' : ''}  >
            <div id="screens">
              <VideoPlayerOverlayMenu
                overlayEnabled={overlayEnabled}
                overlayCheckedItems={overlayCheckedItems}
              />
              <VideoScreen
                setData={setdata}
                evidenceId={EvidenceId}
                data={data}
                isPlaying={isPlaying}
                timelinedetail={timelinedetail}
                viewNumber={viewNumber}
                mapEnabled={mapEnabled}
                videoHandlers={videoHandlers}
                setVideoHandlersFwRw={setVideoHandlersFwRw}
                setvideoTimerFwRw={setvideoTimerFwRw}
                onClickVideoFwRw={onClickVideoFwRw}
                isOpenWindowFwRw={isOpenWindowFwRw}
                onClickBookmarkNote={onClickBookmarkNote}
                setupdateVideoSelection={setupdateVideoSelection}
                isMultiTimelineEnabled={multiTimelineEnabled}
                updateSeekMarker={updateSeekMarker}
                gMapApiKey={props.apiKey}
                gpsJson={gpsJson}
                openMap={props.openMap}
                setOnMarkerClickTimeData={setOnMarkerClickTimeData}
                toasterMsgRef={toasterMsgRef}
                isAudioGraph={isAudioGraph}
              />

              <div className="ClickerIcons">
                <p >{showFRicon.showFRCon && showFRicon.caseNum == 1 ? <span><i className="icon icon-forward3 iconForwardScreen"></i><span className="iconFSSpan">{`x${modeFw}`}</span></span> : ""}  </p>
                <p >{showFRicon.showFRCon && showFRicon.caseNum == 2 ? <span><i className="icon icon-backward2  iconBackward2Screen"></i><span className="iconFSSpan">{`x${modeRw}`}</span></span> : ""}  </p>
              </div>
              <div className="modeButton">

                {modePrev && mode == 2 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == 4 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == 6 ? <span className="modeBtnIconLeft"> <i className="fas fa-redo-alt"><span className="circleRedo" ><span>{mode}</span>X</span></i> </span> : ""}
                {modePrev && mode == -2 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
                {modePrev && mode == -4 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
                {modePrev && mode == -6 ? <span className="modeBtnIconRight"> <i className="fas fa-undo-alt "><span className="circleRedo" ><span>{modeMinus}</span>X</span></i> </span> : ""}
              </div>
              <div className="caretLeftRight">
                {frameForward ? <span className=" triangleRightSetter"><SVGImage width={12} height={23.4} d="M10.92,12.76L0,23.4V0L10.92,10.64l1.08,1.06-1.08,1.06Z" viewBox="0 0 12 23.4" fill="#fff" /></span> : null}
                {frameReverse ? <span className=" triangleRightSetter"><SVGImage width={12} height={23.4} d="M1.08,12.76l10.92,10.64V0L1.08,10.64l-1.08,1.06,1.08,1.06Z" viewBox="0 0 12 23.4" fill="#fff" /></span> : null}
              </div>
              <div id="volumePercentage" ref={volumeIcon}>
                <div className="volume_video_icon animated">
                  <i className={volumePer}></i>
                  <div className={`volume_percent_text ${volumPercent == 100 ? "volPercentSpace" : ""} `}>{volumPercent}%</div>
                </div>
              </div>
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
                  setbookmarkAssetId={setbookmarkAssetId}
                  setnoteAssetId={setnoteAssetId}
                  visibleThumbnail={visibleThumbnail}
                  setVisibleThumbnail={setVisibleThumbnail}
                  isMultiViewEnable={isMultiViewEnable}
                  displayThumbnail={displayThumbnail}
                  toasterMsgRef={toasterMsgRef}
                  onClickBookmarkNote={onClickBookmarkNote}
                  openThumbnail={openThumbnail}
                  mouseovertype={mouseovertype}
                  timelinedetail1={timelinedetail1}
                  mouseOverBookmark={mouseOverBookmark}
                  mouseOverNote={mouseOverNote}
                  mouseOut={mouseOut}
                  Event={Event}
                  getbookmarklocation={getbookmarklocation}
                  AdjustTimeline={AdjustTimeline}
                  startTimelineSync={startTimelineSync}
                  multiTimelineEnabled={multiTimelineEnabled}
                />
              ) : (<></>)}

            </div>
            <div>
            </div>
            <div id="CRX_Video_Player_Controls" style={{ display: styleScreen == false ? 'block' : '' }} className={controllerBar === true ? 'showControllerBar' : 'hideControllerBar'}>
              <div className="player_controls_inner">
                <div className="main-control-bar">
                  <div id="SliderBookmarkNote" style={{ position: "relative" }}>
                    {timelinedetail.length > 0 && timelinedetail.map((x: Timeline) => {
                      return (
                        <>
                          {x.enableDisplay &&
                            <>
                              <div className="_timeLine_bookMark_note_pip" style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(x.recording_start_point * 1000, x.recording_start_point) }}>
                                <span className="pip_icon" aria-hidden="true"
                                  onMouseOut={() =>
                                    mouseOut()} onMouseOver={(e: any) => mouseOverRecordingStart(e, x.recording_start_point, x)} >
                                </span>
                              </div>
                              <div className="_timeLine_bookMark_note_pip" style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(x.recording_end_point * 1000, x.recording_start_point) }}>
                                <span className="pip_icon" aria-hidden="true"
                                  onMouseOut={() =>
                                    mouseOut()} onMouseOver={(e: any) => mouseOverRecordingEnd(e, x.recording_start_point, x)} >
                                </span>
                              </div>
                            </>
                          }
                          {x.enableDisplay && x.bookmarks.map((y: any, index: any) => {
                            if (multiTimelineEnabled ? y.madeBy == "User" : true) {
                              return (
                                <div className="_timeLine_bookMark_note_pip" style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point) }}>
                                  <span className="pip_icon" style={{ backgroundColor: "#D74B00" }} aria-hidden="true"
                                    onMouseOut={() =>
                                      mouseOut()} onMouseOver={(e: any) => mouseOverBookmark(e, y, x)} onClick={() => onClickBookmarkNote(y, 1)}>
                                  </span>
                                </div>
                              )
                            }
                          }
                          )}
                          {x.enableDisplay && x.notes.map((y: any, index: any) =>
                            <div className="_timeLine_bookMark_note_pip" style={{ zIndex: 2, position: "absolute", left: getbookmarklocation(y.position, x.recording_start_point) }}>
                              <span className="pip_icon" style={{ backgroundColor: "#7D03D7" }} aria-hidden="true"
                                onMouseOut={() => mouseOut()} onMouseOver={(e: any) => mouseOverNote(e, y, x)} onClick={() => onClickBookmarkNote(y, 2)}>
                              </span>
                            </div>
                          )}
                        </>
                      )
                    })
                    }
                  </div>
                  <VideoPlayerSeekbar
                    controlBar={controlBar}
                    handleControlBarChange={handleControlBarChange}
                    timelineduration={timelineduration}
                    viewReasonControlsDisabled={viewReasonControlsDisabled}
                    timelinedetail={timelinedetail}
                    displayThumbnail={displayThumbnail}
                    setVisibleThumbnail={setVisibleThumbnail}
                    markerFwRw={markerFwRw} />
                </div>
                <div className="videoPlayer_Timeline_Time">
                  <div className="playerViewFlexTimer">
                    <div id="counter">{milliSecondsToTimeFormat(new Date(controlBar * 1000))}</div>
                  </div>
                  <div className="V_timeline_end_time">
                    <div id="counter">{finalduration}</div>
                  </div>
                  
                </div>
              {isAudioGraph && <div className="dummy_audio_image">
                    <img src={AduioImage} />
                </div>
              } 
              <div className="dummy_audio_zoomIn_zoomOut">
              <img src={AduioImageZoomInZoomOut} />
              </div>
              </div>
              {/* <div className="crx_video_graph"></div> */}
              <div className={`playerViewFlex enablebViewFlex`}>
                <div className="playerViewLeft">
                
                    <CRXButton color="primary" onClick={handleReverse} variant="contained" className="videoPlayerBtn videoControleBFButton handleReverseIcon" disabled={viewReasonControlsDisabled}>
                      <CRXTooltip
                        content={<SVGImage
                          width={12}
                          height={23.4}
                          d="M1.08,12.76l10.92,10.64V0L1.08,10.64l-1.08,1.06,1.08,1.06Z"
                          viewBox="0 0 12 23.4"
                          fill="#fff"
                        />}
                        placement="top"
                        title={<>Back frame by frame <i className="fal fa-long-arrow-left longArrowLeftUi"></i></>}
                        arrow={false}
                      />
                    </CRXButton>

                    <CRXButton color="primary" onClick={() => onClickFwRw(modeRw + 2, 2)} variant="contained" className="videoPlayerBtn backwardBtn" disabled={ismodeRwdisable || viewReasonControlsDisabled}>
                      <CRXTooltip
                        iconName={"icon icon-backward2 backward2Icon"}
                        placement="top"
                        title={<>Rewind  <span className="RewindToolTip">Shift + [</span></>}
                        arrow={false}
                      />
                    </CRXButton>

                    <CRXButton color="primary" onClick={handlePlayPause} variant="contained" className={`videoPlayerBtn ${isPlaying ? "pauseBtn" : "playBtn"}`} disabled={viewReasonControlsDisabled}>
                      <CRXTooltip
                        iconName={isPlaying ? "icon icon-pause2 iconPause2" : "icon icon-play4 iconPlay4"}
                        placement="top"
                        title={<>{isPlaying ? "Pause" : "Play"} <span className="playPause">Space</span></>}
                        arrow={false}
                      />
                    </CRXButton>
                    <CRXButton color="primary" onClick={() => onClickFwRw(modeFw + 2, 1)} variant="contained" className="videoPlayerBtn backwardRightBtn" disabled={ismodeFwdisable || viewReasonControlsDisabled}>
                      <CRXTooltip
                        iconName={"icon icon-forward3 backward3Icon"}
                        placement="top"
                        title={<>Fast forward  <span className="RewindToolTip">Shift + ]</span></>}
                        arrow={false}
                      />
                    </CRXButton>
                    <CRXButton color="primary" onClick={handleforward} variant="contained" className="videoPlayerBtn handleforwardIcon" disabled={viewReasonControlsDisabled}>
                      <CRXTooltip
                        content={<SVGImage
                          width={12}
                          height={23.4}
                          d="M10.92,12.76L0,23.4V0L10.92,10.64l1.08,1.06-1.08,1.06Z"
                          viewBox="0 0 12 23.4"
                          fill="#fff"
                        />
                        }
                        placement="top"
                        title={<>Forward frame by frame <i className="fal fa-long-arrow-right longArrowLeftUi"></i></>}
                        arrow={false}
                      />
                    </CRXButton>
                    <VolumeControl volume={volume} setVolume={setVolume} setVolumeHandle={setVolumeHandle} setMuteHandle={setMuteHandle} />
                </div>
                <div className="playerViewMiddle">
                  <div className="playBackMode">
                    <button className="UndoIconHover UndoIconPosition" disabled={disabledModeLeft || viewReasonControlsDisabled} onClick={() => modeSet(mode > 0 ? -2 : (mode - 2))} >
                      {mode < 0 ? <span className="modeIconUndoLinker" style={{ background: modeColorMinus }}><span>{modeMinus}</span>{"x"}</span> : ""}
                      <CRXTooltip
                        iconName={"fas fa-undo-alt undoAltIcon"}
                        placement="top"
                        title={<>Playback slow down <span className="playBackTooltip">Shift + ,</span></>}
                        arrow={false}
                      />
                    </button>
                    <button className="MinusIconPosition" disabled={disabledModeMinus || viewReasonControlsDisabled} onClick={() => modeSet(0)}>
                      <CRXTooltip
                        iconName={"icon icon-minus iconMinusUndo"}
                        placement="top"
                        title={<>Normal speed <span className="normalSped">/</span></>}
                        arrow={false}
                      />
                    </button>
                    <button className="UndoIconHover RedoIconPosition" disabled={disabledModeRight || viewReasonControlsDisabled} onClick={() => modeSet(mode < 0 ? 2 : (mode + 2))} >
                      {mode > 0 ? <span className="modeIconRedoLinker" style={{ background: modeColorPlus }}><span>{mode}</span>{"x"}</span> : ""}
                      <CRXTooltip
                        iconName={"fas fa-redo-alt undoRedoIcon"}
                        placement="top"
                        title={<>Playback speed up <span className="playBackTooltipUp">Shift + .</span></>}
                        arrow={false}
                      />
                    </button>
                  </div>
                </div>
                {isShowPanel && <div className="player_right_responsive">
                  <CRXButton color="primary" onClick={() => expandButton()} variant="contained" className="videoPlayerBtn">
                    <CRXTooltip
                      iconName={`${iconChanger ? "fas fa-chevron-up" : "fas fa-chevron-down"} CrxchevronDown`}
                      placement="top"
                      title={<>{iconChanger ? "Collapse" : "Expand"} <span className="RewindToolTip">x</span></>}
                      arrow={false}
                    />
                  </CRXButton>
                </div>}
                <div 
                className={` playerViewRight ${isShowPanel ? 'clickViewRightBtn' : ""}`}
                style={isShowPanel == true ? iconChanger ? { display:'flex' } : {display:'none'} : undefined}
                >
                  <div className="SettingGrid">
                    <div onClick={(e: React.MouseEvent<HTMLElement>) => { openSettingMenu(e) }}>
                      <CRXTooltip
                        iconName={`fas fa-cog faCogIcon ${settingMenuEnabled}`}
                        placement="top"
                        title={<>Settings <span className="settingsTooltip">,</span></>}
                        arrow={false}
                      /></div>
                    <VideoPlayerSettingMenu
                      singleVideoLoad={singleVideoLoad}
                      multiTimelineEnabled={multiTimelineEnabled}
                      setMultiTimelineEnabled={setMultiTimelineEnabled}
                      settingMenuEnabled={settingMenuEnabled}
                      setSettingMenuEnabled={setSettingMenuEnabled}
                      overlayEnabled={overlayEnabled}
                      setOverlayEnabled={setOverlayEnabled}
                      overlayCheckedItems={overlayCheckedItems}
                      setOverlayCheckedItems={setOverlayCheckedItems}
                      isMultiViewEnable={isMultiViewEnable}
                      setIsAudioGraph={setIsAudioGraph}
                    />
                  </div>
                  <CRXButton color="primary" onClick={() => handleaction("note")} variant="contained" className="videoPlayerBtn commentAltBtn" disabled={viewReasonControlsDisabled}>
                    <CRXTooltip
                      iconName={"fas fa-comment-alt-plus commentAltpPlus"}
                      placement="top"
                      title={<>Notes <span className="notesTooltip">N</span></>}
                      arrow={false}
                    />
                  </CRXButton>

                  <CRXButton color="primary" onClick={() => handleaction("bookmark")} variant="contained" className="videoPlayerBtn bookmarkBtn" disabled={viewReasonControlsDisabled}>
                    <CRXTooltip
                      iconName={"fas fa-bookmark faBookmarkIcon"}
                      placement="top"
                      title={<>Bookmarks  <span className="BookmarksTooltip">B</span></>}
                      arrow={false}
                    />
                  </CRXButton>
                  <div className="MenuListGrid">
                  <CRXButton onClick={() => {setLayoutMenuEnabled(true)}}>
                    <CRXTooltip
                        iconName={"fas fa-table iconTableClr"}
                        placement="top"
                        title={<>Layouts <span className="LayoutsTooltips">L</span></>}
                        arrow={false}
                      />
                    <MaterialMenu
                     anchorEl={layoutMenuEnabled}
                     className="_Player_Layout_Menu_"
                     keepMounted
                     open={Boolean(layoutMenuEnabled)}
                     onClose={() => { setLayoutMenuEnabled(false) }}
                     onBlur={() => { setLayoutMenuEnabled(false) }}
                    >

                      <MaterialMenuItem className="layoutHeader">
                        <span>Layouts</span> 
                      </MaterialMenuItem>
                      {!singleVideoLoad && <MaterialMenuItem className={viewNumber == 1 ? "activeLayout" : "noActiveLayout"} onClick={screenClick.bind(this, screenViews.Single)} disabled={viewReasonControlsDisabled}>
                        {viewNumber == 1 ? <i className="fas fa-check _layout_check_icon_"></i> : null}
                        <span className="_layout_text_content_">Single</span>
                        <div className="screenViewsSingle  _view_box_">
                          <p></p>
                        </div>
                      </MaterialMenuItem>}
                      {!singleVideoLoad && <MaterialMenuItem className={viewNumber == 2 ? "activeLayout" : "noActiveLayout"} onClick={screenClick.bind(this, screenViews.SideBySide)} disabled={viewReasonControlsDisabled}>
                        {viewNumber == 2 ? <i className="fas fa-check _layout_check_icon_"></i> : null}
                        <span className="_layout_text_content_">Side by Side </span>
                        <div className="screenViewsSideBySide _view_box_">
                          <p></p>
                          <p></p>
                        </div>
                      </MaterialMenuItem>}
                      {!singleVideoLoad && <MaterialMenuItem className={viewNumber == 3 ? "activeLayout" : "noActiveLayout"} onClick={screenClick.bind(this, screenViews.VideosOnSide)} disabled={viewReasonControlsDisabled}>
                        {viewNumber == 3 ? <i className="fas fa-check _layout_check_icon_"></i> : null}
                        <span className="_layout_text_content_"> Videos on Side </span>
                        <div className="screenViewsVideosOnSide _view_box_">
                          <p></p>
                          <div>
                            <span></span>
                            <span></span>
                          </div>
                       
                        </div>
                      </MaterialMenuItem>}
                      {!singleVideoLoad && <MaterialMenuItem className={viewNumber == 4 ? "activeLayout" : "noActiveLayout"} onClick={screenClick.bind(this, screenViews.Grid)} disabled={viewReasonControlsDisabled}>
                        {viewNumber == 4 ? <i className="fas fa-check _layout_check_icon_"></i> : null}
                        <span className="_layout_text_content_">Grid up to 4</span>
                        <div className="screenViewsGrid _view_box_">
                           <div>
                            <span></span>
                            <span></span>
                          </div>
                          <div>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </MaterialMenuItem>}
                      {!singleVideoLoad && <MaterialMenuItem className={viewNumber == 6 ? "activeLayout" : "noActiveLayout"} onClick={screenClick.bind(this, screenViews.Grid6)} disabled={viewReasonControlsDisabled}>
                        {viewNumber == 6 ? <i className="fas fa-check _layout_check_icon_"></i> : null}
                        <span className="_layout_text_content_">Grid up to 6</span>
                        <div className="screenViewsGrid6 _view_box_">
                          <div>
                            <span></span>
                            <span></span>
                          </div>
                          <div>
                            <span></span>
                            <span></span>
                          </div>
                          <div>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </MaterialMenuItem>}
                      <MaterialMenuItem className="_Side_panel_menu_">
                
                        <span className="_layout_text_content_">Side Data Panel</span>
                        <div className="_side_panel_grid_">
                          <div></div>
                          <p></p>
                        </div>
                      <CBXSwitcher  rootClass="_layout_menu_switcher_" toggleLabel={true} theme="dark" checked={mapEnabled} size="small" onChange={(event: any) => sideDataPanel(event)} name="Side Data Panel" />

                      </MaterialMenuItem>

                    </MaterialMenu>
                  </CRXButton>
               
                  </div>
                  <div className="playerView">
                    {ViewScreen ?
                      <div onClick={viewScreenEnter} >
                        <CRXTooltip
                          iconName={"fas fa-expand-wide"}
                          placement="top"
                          title={<>Full screen <span className="FullScreenTooltip">F</span></>}
                          arrow={false}
                        />
                      </div> :
                      <div onClick={viewScreenExit}>
                        <CRXTooltip
                          iconName={"fas fa-compress-wide"}
                          placement="top"
                          title={<>Minimize screen <span className="FullScreenTooltip">M</span></>}
                          arrow={false}
                        />
                      </div>}
                  </div>

                </div>
              </div>
            </div>
            {startTimelineSync && <CRXSplitButton className="SplitButton" buttonArray={buttonArray} RevertToOriginal={RevertToOriginal} UndoRedo={UndoRedo} saveOffsets={saveOffsets} toasterMsgRef={toasterMsgRef} />}
            {startTimelineSync && <CRXButton color="primary" onClick={() => UndoRedo(0)} variant="contained">Cancel</CRXButton>}
            {!startTimelineSync && <CRXButton className="assetTimelineSync" color="primary" onClick={() => { setOpenTimelineSyncInstructions(true); setStartTimelineSync(true) }} variant="contained">Sync timeline start</CRXButton>}
          </FullScreen>
          {openBookmarkForm && <VideoPlayerBookmark
            setopenBookmarkForm={setopenBookmarkForm}
            seteditBookmarkForm={seteditBookmarkForm}
            openBookmarkForm={openBookmarkForm}
            editBookmarkForm={editBookmarkForm}
            videoHandle={videoHandlers[0]}
            AssetData={timelinedetail[0]}
            EvidenceId={EvidenceId}
            BookmarktimePositon={bookmarktime}
            bookmark={bookmark}
            bookmarkAssetId={bookmarkAssetId}
            toasterMsgRef={toasterMsgRef}
            timelinedetail={timelinedetail}
          />}
          {openNoteForm && <VideoPlayerNote
            setopenNoteForm={setopenNoteForm}
            seteditNoteForm={seteditNoteForm}
            openNoteForm={openNoteForm}
            editNoteForm={editNoteForm}
            AssetData={timelinedetail[0]}
            EvidenceId={EvidenceId}
            NotetimePositon={bookmarktime}
            note={note}
            noteAssetId={noteAssetId}
            toasterMsgRef={toasterMsgRef}
            timelinedetail={timelinedetail}
          />}

          <TimelineSyncInstructionsModal
            setOpenTimelineSyncInstructions={setOpenTimelineSyncInstructions}
            openTimelineSyncInstructions={openTimelineSyncInstructions} />

          <TimelineSyncConfirmationModal
            setOpenTimelineSyncConfirmation={setOpenTimelineSyncConfirmation}
            openTimelineSyncConfirmation={openTimelineSyncConfirmation} />

          <div className="BookmarkNotePopupMain __CRX_BookMark_Note__">
            {bookmarkNotePopupArrObj.map((bookmarkNotePopupObj:any) =>
              {return (
                <BookmarkNotePopup
                bookmarkNotePopupObj={bookmarkNotePopupObj}
                bookmarkNotePopupArrObj={bookmarkNotePopupArrObj} 
                setBookmarkNotePopupArrObj={setBookmarkNotePopupArrObj}
                EvidenceId={EvidenceId}
                timelinedetail={timelinedetail}
                toasterMsgRef={toasterMsgRef} />
              )}
            )}
          </div>

        </div>
        <div className="_bottom_arrow_seeMore">
        {detailContent == false ?
              <button id="seeMoreButton" className="_angle_down_up_icon_btn seeMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
                <CRXTooltip iconName="fas fa-angle-down" placement="bottom" arrow={false} title="see more" />
              </button>
              :
              <button id="lessMoreButton" data-target="#root" className="_angle_down_up_icon_btn lessMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "root")}>
                <CRXTooltip iconName="fas fa-angle-up" placement="bottom" arrow={false} title="less more" />
              </button>
            }
        </div>
        <div className="demo-div" ref={demoRef} id="detail_view">Video Detail Tabs and content here</div>
        </div>{/** Video player container close div */}
      </div>
        
      </div>
    </>);
}

export default VideoPlayerBase
