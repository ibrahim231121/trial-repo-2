import React, { useEffect, useState } from 'react'
import { LoadGoogleMapApi } from './utils/GoogleMapsUtils'
import Map from './map'
import './Map.scss'

interface IMapConfig {
    apiKey: string,
    zoomLevel: number,
    mapTypeControl?: boolean;
    initialMarker?: IlatLong
    getMarkerLatLong: (location: number[]) => void
}
interface IlatLong {
    lat: number,
    long: number
}

const GoogleMap: React.FC<IMapConfig> = ({ apiKey, zoomLevel, mapTypeControl, initialMarker, getMarkerLatLong }) => {

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
                initialMarker={initialMarker}
                getMarkerLatLong={getMarkerLatLong}
            />
        }
        </>
    )
}

export default GoogleMap
