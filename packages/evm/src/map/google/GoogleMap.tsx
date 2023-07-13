import React, { useEffect, useState } from 'react'
import  {LoadGoogleMapApi}  from './utils/GoogleMapsUtils'
import Map from './Map'

interface IMapConfig {
    apiKey: string,
    zoomLevel: number,
    mapTypeControl?: boolean,
    gpsData: any,
    callBackOnMarkerClick: any,
    updateSeekMarker?: any
    mapCenter?:any,
    getInfoWindowContentOnMarkerClick?:(data:any) => string
}
interface IlatLong {
    lat: number[],
    long: number[]
}

const GoogleMap: React.FC<IMapConfig> = ({ apiKey, zoomLevel, mapTypeControl, gpsData, callBackOnMarkerClick, updateSeekMarker, mapCenter, getInfoWindowContentOnMarkerClick }) => {

    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    useEffect(() => {
        if (window.google == undefined) {

            const googleMapScript = LoadGoogleMapApi(apiKey);
            googleMapScript.addEventListener('load', function () {
                setGoogleScriptLoaded(true)
            })
        } else {
            setGoogleScriptLoaded(true)
        }
    }, [])

    return (
        <>{
            googleScriptLoaded &&
            <Map
                mapType={google.maps.MapTypeId.ROADMAP}
                mapTypeControl={mapTypeControl}
                zoomLevel={zoomLevel}
                gpsData={gpsData}
                callBackOnMarkerClick={callBackOnMarkerClick}
                updateSeekMarker={updateSeekMarker}
                mapCenter={mapCenter}
                getInfoWindowContentOnMarkerClick={getInfoWindowContentOnMarkerClick}
            />
        }
        </>
    )
}

export default GoogleMap
