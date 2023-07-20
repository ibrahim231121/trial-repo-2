
import React, { useEffect } from 'react'
import GoogleMap from '../../../../map/google/GoogleMap';
import { AlprPlateHistoryInfo } from '../../../../utils/Api/models/AlprPlateHistoryInfo';
import VideoPlayerSeekbar from '../../../../components/MediaPlayer/VideoPlayerSeekbar';
import "./LicensePlateHistoryMap.scss"
import { CRXMultiSelectBoxLight } from '@cb/shared';
import { useTranslation } from 'react-i18next';
import dateDisplayFormat from '../../../../GlobalFunctions/DateFormat';


type LicensePlateHistoryMapProp = {
  historyData: AlprPlateHistoryInfo[]
}

const LicensePlateHistoryMap = ({historyData}:LicensePlateHistoryMapProp) => {
  const [updateSeekMarker, setUpdateSeekMarker] = React.useState<any[]>([]);
  const [controlBar, setControlBar] = React.useState(2);
  const [timelineduration, settimelineduration] = React.useState(7);
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
  const {t} = useTranslation<string>();

  const PLAYING_BASE_SPEED = 2000;
  const SPEED_1X = "1x";
  const SPEED_2X = "2x";
  const SPEED_4X = "4x";

  const playingIntervalRef = React.useRef(0);
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
      setControlBar(0);
    }
  },[stopped])

  useEffect(()=>{
    if(historyData){
      let gpsDataTemp = historyData.map((histItem) => {
        return {
          "LAT": histItem.latitude,
          "LON": histItem.longitude,
          "LOGTIME": histItem.capturedAt
        }
      })
  
      setGpsData(gpsDataTemp)
    }

  },[])
  
  const startPlaying = ()=>{
    playingIntervalRef.current = window.setInterval(() => {
      setControlBar((prevControlBar)=> {
        if(prevControlBar < historyData.length){
          let visibleData = gpsData.slice(0, prevControlBar + 1)            
          

          if(visibleData.length > 0){
            setUpdateSeekMarker(visibleData)
            setMapCenter(visibleData[visibleData.length - 1])
          }
          
          return prevControlBar + 1;
        }else{
          setStopped(true)
          window.clearInterval(playingIntervalRef.current);
          return prevControlBar
        }          
      })
    }, playingIntervalSpeedRef.current);
  }

  const getInfoWindowContentOnMarkerClick = (logTime:any):string =>{
    let historyItem = historyData.find(history=>history.capturedAt == logTime);
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
    setControlBar(newValue);

    if(newValue <= gpsData.length){
      let visibleData = gpsData.slice(0, newValue)      
  
      if(visibleData.length > 0){
        setUpdateSeekMarker(visibleData)
        setMapCenter(visibleData[visibleData.length - 1])
      }
    }
  };

  const displayThumbnail = (event: any, x: any, displayAll: boolean, withdescription?: string) => {  }

  return (
    <>
      <div style={{"border":"1px solid #878787"}}>
        <GoogleMap 
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}
          zoomLevel={15}
          mapTypeControl={false} 
          gpsData={gpsData}
          callBackOnMarkerClick={(e:any) =>{  }}
          updateSeekMarker={updateSeekMarker}
          mapCenter={mapCenter}
          getInfoWindowContentOnMarkerClick={getInfoWindowContentOnMarkerClick}
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
              <div className='alpr_historyMap_speed_dropdown'>
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
              </div>          
          </div>
        </div>
        <div style={{"flexGrow":"20", "flexShrink":"20"}}>
          <VideoPlayerSeekbar
              controlBar={controlBar}
              handleControlBarChange={handleControlBarChange}
              timelineduration={timelineduration}
              viewReasonControlsDisabled={viewReasonControlsDisabled}
              timelinedetail={timelinedetail}
              displayThumbnail={displayThumbnail}
              setVisibleThumbnail={setVisibleThumbnail}
              markerFwRw={markerFwRw} 
            />
        </div>
        
      </div>

      
      
    </>
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