import React, { useEffect, useState } from 'react'
import { LoadGoogleMapApi } from './utils/GoogleMapsUtils'
import Map from './map'
import './Map.scss'

interface IMapConfig {
    apiKey: string,
    zoomLevel: number,
    mapCenter: mapCenter,
    mapTypeControl?: boolean;
    getMarkerLatLong: (location: number[]) => void
}
interface mapCenter {
    lat: number,
    long: number
}

const GoogleMap: React.FC<IMapConfig> = ({ apiKey, zoomLevel, mapCenter, mapTypeControl, getMarkerLatLong }) => {

    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    useEffect(() => {
        const googleMapScript = LoadGoogleMapApi(apiKey);
        googleMapScript.addEventListener('load', function () {
            setGoogleScriptLoaded(true)
        })
    }, [])

    return (
        <>{
            googleScriptLoaded &&
            <Map
                mapType={google.maps.MapTypeId.HYBRID}
                mapTypeControl={mapTypeControl}
                zoomLevel={zoomLevel}
                mapCenter={new google.maps.LatLng(mapCenter.lat, mapCenter.long)}
                getMarkerLatLong={getMarkerLatLong}
            />
        }
        </>
    )
}

export default GoogleMap
