import React, { useRef, useState, useEffect } from "react";

interface IMap {
    mapType: google.maps.MapTypeId,
    mapTypeControl?: boolean;
    zoomLevel?: number;
    initialMarker?: any
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

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, zoomLevel = 5, initialMarker, getMarkerLatLong }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<GoogleMap>();
    const [marker, setMarker] = useState<IMarker>();
    const [lastMarker, setLastMarker] = useState<google.maps.Marker>();
    const [mapCenter, setMapCenter] = useState<GoogleLatLng>();

    const startMap = (): void => {
        if (!map) {
            if (initialMarker != undefined) {
                coordinateToAddress(new google.maps.LatLng(initialMarker.lat, initialMarker.long));
                setMapCenter(new google.maps.LatLng(initialMarker.lat, initialMarker.long));
            }
            else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition, posError); // Passing in a success callback and an error callback fn
                } else {
                    alert("Sorry, Geolocation is not supported by this browser."); // Alert is browser does not support geolocation
                }
            }
        }
    };

    useEffect(() => {
        initMap();
    }, [mapCenter])

    const posError = () => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(res => {
                if (res.state === 'denied') {
                    alert('Enable location permissions for this website in your browser settings.')
                }
            })
        } else {
            alert('Unable to access your location. You can continue by submitting location manually.') // Obtaining Lat/long from address necessary
        }
    }
    const showPosition = (position: any) => {
        setMapCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }

    useEffect(startMap, [map]);

    const initEventListner = (): void => {
        if (map) {
            google.maps.event.addListener(map, 'click', function (e) {
                getMarkerLatLong([e.latLng.lat(), e.latLng.lng()]);
                coordinateToAddress(e.latLng);
            })
        }
    }
    useEffect(initEventListner, [map]);

    const coordinateToAddress = async (coordinate: GoogleLatLng) => {

        //alert("Lat:->" + coordinate.lat() + ", Long:->" + coordinate.lng());

        const geocoder = new google.maps.Geocoder();

        await geocoder.geocode({ location: coordinate }, function (results, status) {
            if (status === 'OK') {

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
