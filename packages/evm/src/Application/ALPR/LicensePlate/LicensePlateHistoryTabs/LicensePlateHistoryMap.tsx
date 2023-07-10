
import React, { useEffect } from 'react'
import GoogleMap from '../../../../map/google/GoogleMap';
import { AlprPlateHistoryInfo } from '../../../../utils/Api/models/AlprPlateHistoryInfo';

type LicensePlateHistoryMapProp = {
  historyData: AlprPlateHistoryInfo[]
}

const LicensePlateHistoryMap = ({historyData}:LicensePlateHistoryMapProp) => {
  const [updateSeekMarker, setUpdateSeekMarker] = React.useState([]);
  let gpsData:any = [];

  if(historyData){
    gpsData = historyData.map((histItem) => {
      return {
        "LAT": histItem.latitude,
        "LON": histItem.longitude,
        "LOGTIME": histItem.capturedAt
      }
    })
  }

  return (
    <GoogleMap 
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}
      zoomLevel={15}
      mapTypeControl={false} 
      gpsData={gpsData}
      callBackOnMarkerClick={(e:any) =>{
        debugger;
      }}
      updateSeekMarker={updateSeekMarker}
    />
  )
}

export default LicensePlateHistoryMap