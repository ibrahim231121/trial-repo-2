
import React, { useEffect } from 'react'
import GoogleMap from '../../../../map/google/GoogleMap';
import { AlprPlateHistoryInfo } from '../../../../utils/Api/models/AlprPlateHistoryInfo';
import VideoPlayerSeekbar from '../../../../components/MediaPlayer/VideoPlayerSeekbar';
import "./LicensePlateHistoryMap.scss"
import { CRXMultiSelectBoxLight } from '@cb/shared';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLoaderValue } from '../../../../Redux/loaderSlice';
import { dateDisplayFormat } from '../../../../GlobalFunctions/DateFormat';
import defaultStreetImage from "../../../../Assets/Images/AlprDefaultImages/AlprStreetImage.png";
import defaultCarImage from "../../../../Assets/Images/AlprDefaultImages/AlprCarImage.png";
import defaultNumberPlateImage from "../../../../Assets/Images/AlprDefaultImages/numberPlate.jpg";

type LicensePlateHistoryMapProp = {
  historyData: AlprPlateHistoryInfo[]
}

const LicensePlateHistoryMap = ({historyData}:LicensePlateHistoryMapProp) => {
  const [updateSeekMarker, setUpdateSeekMarker] = React.useState<any[]>([]);
  const [controlBar, setControlBar] = React.useState<any>(0);
  const [timelineduration, settimelineduration] = React.useState(12);
  const [viewReasonControlsDisabled, setViewReasonControlsDisabled] = React.useState<boolean>(false);
  const [visibleThumbnail, setVisibleThumbnail] = React.useState<number[]>([]);
  const [markerFwRw, setMarkerFwRw] = React.useState<boolean>(false);
  const [playing, setPlaying] = React.useState(false);
  const [stopped, setStopped] = React.useState(true);
  const [gpsData, setGpsData] = React.useState<any[]>([]);
  const [playingSpeed, setPlayingSpeed] = React.useState<any>({id:0, label:"1x"});
  const [mapCenter, setMapCenter] = React.useState<any>({
    "LAT": 0,
    "LON": 0
  });
  const [marks, setMarks] = React.useState<any[]>([{
    value: 0, 
    label: ""
  }]);
  const [directions, setDirections] = React.useState<any>();

  const {t} = useTranslation<string>();
  const dispatch = useDispatch();

  const PLAYING_BASE_SPEED = 2000;
  const SPEED_1X = "1x";
  const SPEED_2X = "2x";
  const SPEED_4X = "4x";

  const playingIntervalRef = React.useRef(0);
  const currentItemPlayingRef = React.useRef(0);
  const lastDateRef = React.useRef<any>();
  const playingIntervalSpeedRef = React.useRef(PLAYING_BASE_SPEED);

  const timelinedetail: any[] = []

  useEffect(()=>{    
    if(playing){
      setStopped(false)

      startPlaying();
      
    }else{
      window.clearInterval(playingIntervalRef.current);
    }
  },[playing])

  useEffect(() =>{
    switch(playingSpeed.label){
      case SPEED_1X: 
        playingIntervalSpeedRef.current = PLAYING_BASE_SPEED
        break;
      case SPEED_2X: 
        playingIntervalSpeedRef.current = PLAYING_BASE_SPEED / 2
        break;
      case SPEED_4X: 
        playingIntervalSpeedRef.current = PLAYING_BASE_SPEED / 4
        break;
      default:
        playingIntervalSpeedRef.current = PLAYING_BASE_SPEED
        break;        
    }

    if(playing){
      window.clearInterval(playingIntervalRef.current);
      startPlaying();
    }
  }, [playingSpeed])

  useEffect(()=>{
    if(stopped){
      setPlaying(false);
      setMapCenter(gpsData[0])
      currentItemPlayingRef.current = 0
      setInitialMarksInSeekbar();
      setControlBar(0);
    }
  },[stopped])

  useEffect(()=>{
    if(historyData){
      let gpsDataTemp = historyData.map((histItem) => {
        return {
          "LAT": histItem.latitude,
          "LON": histItem.longitude,
          "LOGTIME": histItem.capturedAtStr
        }
      })
      setInitialMarksInSeekbar()
      
      setGpsData(gpsDataTemp)
      
      dispatch(setLoaderValue({isLoading: true}))
    }

  },[])

  const onMapLoadingSuccess = ()=>{
    dispatch(setLoaderValue({isLoading: false}))
  }

  const setInitialMarksInSeekbar = ()=>{
    let minCapturedDate = historyData.reduce((item1:AlprPlateHistoryInfo, item2:AlprPlateHistoryInfo) => {
      return (Date.parse(item1.capturedAt)) < (Date.parse(item2.capturedAt)) ? item1 : item2;
    }).capturedAt;

    let mindate = new Date(minCapturedDate);

    let initialMonth = mindate.toLocaleString('default', { month: 'long' });
    let initialDate = mindate.getDate();

    mindate.setHours(mindate.getHours() + 24);
    lastDateRef.current = mindate

    let lastMonth = mindate.toLocaleString('default', { month: 'long' });
    let lastDate = mindate.getDate();  

    let marksList =[{
      value: 0, 
      label: initialDate + " " + initialMonth
    }];

    for(let i=1; i<12; i++){
      marksList.push({
        value: i,
        label: (i * 2).toString() + ":" + "00"
      })
    }

    marksList.push({
      value: 12 , 
      label: lastDate + " " + lastMonth
    })

    setMarks(marksList);
  }

  const setMarksAndControlBarForDestination = (dest:any) => {
    const destDateStr = dateDisplayFormat(dest.LOGTIME)

          let destDate = new Date(destDateStr);

          let hours = destDate.getHours();
          let date = destDate.getDate();
          let month = destDate.getMonth();

          let lastMonth = lastDateRef.current.getMonth();
          let lastDate = lastDateRef.current.getDate(); 

          let controlbarValue = [];

          if(lastMonth == month && lastDate > date){
            
          }else{
            let marksList:any[] =[];

            if(lastDate == date){
              
              marksList.splice(0, 0, {
                value: 12, 
                label: hours % 2 == 0 ? hours.toString() + ":" + "00" : (hours + 1).toString() + ":" + "00"
              });

              let hoursTemp = hours;

              for(let i = 11 ; i > 0 ; i--){
                hoursTemp = hoursTemp - 2;

                if(hoursTemp <= 0){
                  marksList.splice(0, 0, {
                    value: i, 
                    label: date + " " + destDate.toLocaleString('default', { month: 'long' })
                  });

                  hoursTemp = 24;
                }else{
                  marksList.splice(0, 0, {
                    value: i, 
                    label: hoursTemp % 2 == 0 ? hoursTemp.toString() + ":" + "00" : (hoursTemp + 1).toString() + ":" + "00"
                  });
                }
              }
              controlbarValue.push(12)
              controlbarValue.push(11)
            }else{
              marksList.push({
                value: 0, 
                label: date + " " + month
              });
        
              for(let i=1; i<12; i++){
                marksList.push({
                  value: i,
                  label: (i * 2).toString() + ":" + "00"
                })
              }

              lastDateRef.current.setHours(lastDateRef.current.getHours() + 24);

              let lastMonth = lastDateRef.current.toLocaleString('default', { month: 'long' });
              lastDate = lastDateRef.current.getDate();
              
              
              marksList.push({
                value: 12, 
                label: lastDate + " " + lastMonth
              })
            }

            setMarks(marksList);
          }

          if(controlbarValue.length == 2){

          }else{
            if(hours == 0){
              controlbarValue.push((hours));
              controlbarValue.push((hours + 1));
            }else if(hours % 2 == 0){
              controlbarValue.push((((hours/2) - 1)));
              controlbarValue.push(((hours/2)));
            }else{
              controlbarValue.push((((hours + 1)/2)));
              controlbarValue.push((((hours + 1)/2) - 1));
            }
          }

          setControlBar(controlbarValue)
  }

  const showDirections = (origin: any, dest: any) => {
    let direction ={
      origin: origin,
      destination: dest
    } 
    
    setDirections(direction);
  }

  const startPlaying = ()=>{
    playingIntervalRef.current = window.setInterval(() => {
      
      if(currentItemPlayingRef.current < historyData.length){
        let visibleData = gpsData.slice(0, currentItemPlayingRef.current + 1)            
        

        if(visibleData.length > 0){
          const dest = visibleData[visibleData.length - 1]
          setUpdateSeekMarker(visibleData)
          setMapCenter(dest)

          setMarksAndControlBarForDestination(dest);

          if(visibleData.length > 1)
          {
            showDirections(visibleData[0], dest);
          }
          
        }
        currentItemPlayingRef.current += 1
      }else{
        setStopped(true)
        window.clearInterval(playingIntervalRef.current);        
      }

    }, playingIntervalSpeedRef.current);
  }

  const getInfoWindowContentOnMarkerClick = (logTime:any):string =>{
    let historyItem = historyData.find(history=>history.capturedAtStr == logTime);
    let content:string = "";

    if(historyItem){
      content = `<b>${t('Number_Plate')}:</b> ` + historyItem.numberPlate +
                `<br/><b>${t('Captured_At')}:</b> ` + dateDisplayFormat(historyItem.capturedAt) +
                `<br/><b>${t('State')}:</b> ` + historyItem.state +                         
                `<br/><b>${t('Latitude')}:</b> ` + historyItem.latitude +
                `<br/><b>${t('Longitude')}:</b> ` + historyItem.longitude +
                `<br/><b>${t('Confidence')}:</b> ` + historyItem.confidence +
                `<br/><b>${t('Ticket_Number')}:</b> ` + historyItem.ticketNumber +
                `<br/><b>${t('Unit')}:</b> ` + historyItem.unit +
                `<br/><b>${t('Notes')}:</b> ` + historyItem.notes;
    }

    return content;
  }

  const handleControlBarChange = (event: any, newValue: any) => {
    /* setControlBar(newValue);

    if(newValue <= gpsData.length){
      let visibleData = gpsData.slice(0, newValue)      
  
      if(visibleData.length > 0){
        setUpdateSeekMarker(visibleData)
        setMapCenter(visibleData[visibleData.length - 1])
      }
    } */
  };

  const displayThumbnail = (event: any, x: any, displayAll: boolean, withdescription?: string) => {  }

  return (
    <div style={{display:"flex"}}>
      <div className='alpr_Image_container'>
        <img id="streetImage" src={defaultStreetImage} alt="not found" className='alpr_StreetImage_container'/>
        <div style={{display:"flex"}}>
          <img id="numberPlateImage" src={defaultNumberPlateImage} alt="not found" style={{"width":"100%"}}/>
          <img id="carImage" src={defaultCarImage} alt="not found" style={{"width":"100%"}}/>
        </div>
      </div>
    <div className='alpr_Map_Width'>
  
      <div style={{"border":"1px solid #878787"}}>
        <GoogleMap 
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}
          zoomLevel={15}
          mapTypeControl={false} 
          gpsData={gpsData}
          callBackOnMarkerClick={(e:any) =>{  }}
          updateSeekMarker={updateSeekMarker}
          mapCenter={mapCenter}
          directions={directions}
          getInfoWindowContentOnMarkerClick={getInfoWindowContentOnMarkerClick}
          onMapLoadingSuccess = {onMapLoadingSuccess}
        />
      </div>
      
      <div className='alpr_historyMap_seekbar_container' >
        <div style={{"flexGrow":"0.5", "flexShrink":"0.5"}}>
          <div style={{"paddingLeft":"10px"}}>
            {
              playing ? 
                <PauseButton onClick={(e:any)=>{
                  setPlaying(false);
                }}/> : 
                <PlayButton onClick={(e:any)=>{              
                  setPlaying(true);
                }}/>
            }
            <StopButton onClick={(e:any)=>{
              setStopped(true)
              
                }}/>
              {/* <div className='alpr_historyMap_speed_dropdown'>
                <CRXMultiSelectBoxLight
                  className=""
                  label={""}
                  multiple={false}
                  CheckBox={false}
                  options={[{id:0, label: SPEED_1X}, {id:1, label:SPEED_2X}, {id:2, label:SPEED_4X}]}
                  required={false}
                  isSearchable={false}
                  value={playingSpeed}

                  onChange={(
                    e: React.SyntheticEvent,
                    value: any
                  ) => {
                    if(value){
                      setPlayingSpeed(value);
                    }else{
                      setPlayingSpeed({id:0, label: SPEED_1X});
                    }
                    
                  }
                  }
                  onOpen={(e: any) => {

                  }}
                />
              </div>           */}
          </div>
        </div>
        <div style={{"flexGrow":"20", "flexShrink":"20","paddingTop": "12px", "paddingRight": "12px"}}>
          <VideoPlayerSeekbar
              controlBar={controlBar}
              handleControlBarChange={handleControlBarChange}
              timelineduration={timelineduration}
              viewReasonControlsDisabled={viewReasonControlsDisabled}
              timelinedetail={timelinedetail}
              displayThumbnail={displayThumbnail}
              setVisibleThumbnail={setVisibleThumbnail}
              markerFwRw={markerFwRw} 
              marks={marks}
            />
        </div>
        
      </div>

      
      
    </div>
      
  </div>
  )
}

const PlayButton = ({onClick}:any) => {
  return (
    <div className="video_playButton alpr_historyMap_slidder_buttons" onClick={onClick}>
      <i className="icon icon-play4"></i>
    </div>
  );
};

const PauseButton = ({onClick}:any) => {
  return (
    <div className="video_PauseButton alpr_historyMap_slidder_buttons" onClick={onClick}>
      <i className="icon icon-pause2"></i>
    </div>
  );
};

const StopButton = ({onClick}:any) => {
  return (
    <div className="video_StopButton alpr_historyMap_slidder_buttons" onClick={onClick}>
      <i className="icon icon-stop2"></i>
    </div>
  );
};

export default LicensePlateHistoryMap