import React, { useRef, useState, useEffect } from "react";

interface IMap {
    mapType: google.maps.MapTypeId,
    mapTypeControl?: boolean;
    zoomLevel?: number;
    mapCenter?: google.maps.LatLng,
    getMarkerLatLong: (location: number[]) => void
}

interface IMarker {
    address: string,
    latitude: number,
    longitude: number
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

const Map: React.FC<IMap> = ({ mapType, mapCenter, mapTypeControl = false, zoomLevel = 5, getMarkerLatLong }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<GoogleMap>();
    const [marker, setMarker] = useState<IMarker>();
    const [lastMarker, setLastMarker] = useState<google.maps.Marker>();

    const startMap = (): void => {
        if (!map) {
            initMap();
        }
    };

    useEffect(startMap, [map]);

    const initEventListner = (): void => {
        if (map) {
            google.maps.event.addListener(map, 'click', function (e) {
                coordinateToAddress(e.latLng);
            })
        }
    }
    useEffect(initEventListner, [map]);

    const coordinateToAddress = async (coordinate: GoogleLatLng) => {

        //alert("Lat:->" + coordinate.lat() + ", Long:->" + coordinate.lng());
        getMarkerLatLong([coordinate.lat(), coordinate.lng()]);
        const geocoder = new google.maps.Geocoder();
        await geocoder.geocode({ location: coordinate }, function (results, status) {
            if (status === 'OK') {
                console.log(results[0].formatted_address);
                setMarker({
                    address: results[0].formatted_address,
                    latitude: coordinate.lat(),
                    longitude: coordinate.lng()
                })
            }
        })
    };

    const addMarker = (): void => {
        if (marker) {

            lastMarker?.setMap(null);
            const m: GoogleMarker = new google.maps.Marker({
                position: new google.maps.LatLng(marker.latitude, marker.longitude),
                map: map,
                icon: {
                    url: window.location.origin + '/assets/images/mymarker.png',

                }
            })
            setLastMarker(m);
        }
    }

    useEffect(addMarker, [marker])

    const initMap = (): void => {
        if (ref.current) {
            setMap(
                new google.maps.Map(ref.current, {
                    zoom: zoomLevel,
                    minZoom: 2,
                    center: mapCenter,
                    mapTypeControl: mapTypeControl,
                    streetViewControl: false,
                    rotateControl: false,
                    scaleControl: true,
                    fullscreenControl: false,
                    panControl: false,
                    zoomControl: true,
                    gestureHandling: 'cooperative',
                    mapTypeId: mapType,
                    draggableCursor: 'pointer',
                })
            );

        }
    };

    return (
        <div className="map-container">
            <div ref={ref} className="map-container__map"></div>
        </div>
    )
}

export default Map
