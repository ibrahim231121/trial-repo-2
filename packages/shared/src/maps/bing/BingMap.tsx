import React, { useEffect, useState } from 'react'
import { LoadBingMapApi } from './utils/BingMapsUtils'
import Map from './Map'

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

export interface MapWindow extends Window {
    Microsoft: any;
    bingAPIReady: () => void;
}

declare let window: MapWindow;
export let Microsoft: any;

const BingMap: React.FC<IMapConfig> = ({ apiKey, zoomLevel, mapCenter, mapTypeControl, getMarkerLatLong }) => {

    const [bingScriptLoaded, setBingScriptLoaded] = useState(false);
    window.bingAPIReady = () => {
        Microsoft = window.Microsoft;
        setBingScriptLoaded(true);
    };

    useEffect(() => {
        LoadBingMapApi(apiKey);
    }, [])

    return (
        <>{

            bingScriptLoaded && <Map
                mapOptions={{
                    showDashboard: mapTypeControl,
                    center: new Microsoft.Maps.Location(mapCenter.lat, mapCenter.long),
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                    zoom: zoomLevel
                }}
                getMarkerLatLong={getMarkerLatLong}
            />
        }
        </>
    )
}

export default BingMap
