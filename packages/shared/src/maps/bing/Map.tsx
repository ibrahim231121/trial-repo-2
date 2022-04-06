import React, { useState, useEffect } from "react";
import { Microsoft } from './BingMap';

interface IMapProps {
    mapOptions?: any;
    getMarkerLatLong: (location: number[]) => void
}

const Map: React.FC<IMapProps> = ({ mapOptions, getMarkerLatLong }) => {
    const [map, setMap] = useState<any>();
    const mapRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        initMap();
    }, [])

    const initMap = () => {
        const map = new Microsoft.Maps.Map(mapRef.current, mapOptions);
        setMap(map);

        //click event add to map
        Microsoft.Maps.Events.addHandler(map, 'click', (e: any) => getLatlng(e, map));
        return map;
    }

    const getLatlng = (e: any, map: any) => {

        if (e.targetType == "map") {
            var point = new Microsoft.Maps.Point(e.getX(), e.getY());
            var locTemp = e.target.tryPixelToLocation(point);
            var location = new Microsoft.Maps.Location(locTemp.latitude, locTemp.longitude);
            //alert("Lat:->" + locTemp.latitude + ", Long:->" + locTemp.longitude);

            getMarkerLatLong([locTemp.latitude, locTemp.longitude])

            var pin = new Microsoft.Maps.Pushpin(location, { 'draggable': false });

            //remove prevois marker
            for (var i = map?.entities.getLength() - 1; i >= 0; i--) {
                var pushpin = map?.entities.get(i);
                if (pushpin instanceof Microsoft.Maps.Pushpin) {
                    map?.entities.removeAt(i);
                }
            }
            map?.entities.push(pin);
        }
    }

    return (
        <div className="mapContainer">
            <div ref={mapRef} className="map123" />
            <div className="customNavBar">
            </div>
        </div>
    )
}

export default Map
