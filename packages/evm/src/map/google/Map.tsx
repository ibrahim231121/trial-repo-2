import React, { useRef, useState, useEffect } from "react";

interface IMap {
    mapType: google.maps.MapTypeId,
    mapTypeControl?: boolean,
    zoomLevel?: number,
    gpsData: any,
    callBackOnMarkerClick: any,
    updateSeekMarker?: any
}

interface IMarker {
    position: google.maps.LatLng,
    icon: string,
    draggable: boolean,
    zIndex: number,
    data: any
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, zoomLevel = 5, gpsData, callBackOnMarkerClick, updateSeekMarker }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setGMap] = useState<GoogleMap>();
    const [marker, setMarker] = useState<any>();

    const startMap = (): void => {
        if (map) {
            if (gpsData && gpsData.length > 0) {
                let gpsInfos = JSON.parse(JSON.stringify(gpsData));
                render(gpsInfos,"Add")
            }
            else {
                errorhandle()
            }
            
        }
    };

    const renderMarkerOnSeek = (): void => {
        if (map) {
            if (updateSeekMarker && updateSeekMarker.length>0) {
                let gpsInfos = JSON.parse(JSON.stringify(updateSeekMarker));
                render(gpsInfos,"Update")
            }
            else {
                errorhandle()
            }
            
        }
    };

    const render = (gpsInfos:any,Case:any) => {
        for (let index = 0; index < gpsInfos.length; index++) {
            let gpsInfo = gpsInfos[index];
            let pnt = getLatLon(gpsInfo);
            if(index == 0){
                let position = new google.maps.LatLng(pnt.latitude, pnt.longitude);
                map?.panTo(position);
            }
            coordinateToAddress(new google.maps.LatLng(pnt.latitude, pnt.longitude), gpsInfo, Case);
        }
    };
    const errorhandle = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, posError); // Passing in a success callback and an error callback fn
        } else {
            alert("Sorry, Geolocation is not supported by this browser."); // Alert is browser does not support geolocation
        }
    };

    const getLatLon = (gpsInfo: any) => {
        return {
            latitude: gpsInfo.lat ? gpsInfo.lat : gpsInfo.LAT ? gpsInfo.LAT : null,
            longitude: gpsInfo.lon ? gpsInfo.lon : gpsInfo.LON ? gpsInfo.LON : null
        }
    }

    useEffect(() => {
        let mapCenter;
        if(gpsData.length > 0)
        {
            let pnt = getLatLon(gpsData[0]);
            mapCenter = new google.maps.LatLng(pnt.latitude, pnt.longitude)
        }
        initMap(mapCenter);
    }, [])

    useEffect(() => {
        if(updateSeekMarker){
            renderMarkerOnSeek()
        }
    }, [updateSeekMarker])

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
    const showPosition = (pnt: any) => {
        let position = new google.maps.LatLng(pnt.latitude, pnt.longitude);
        map?.panTo(position);
    }

    useEffect(startMap, [map]);

    const coordinateToAddress = async (coordinate: GoogleLatLng, gpsInfoData: any, Case: string) => {
        let objmarker : any = {
            position: coordinate,
            draggable: false,
            zIndex: 999,
            data: gpsInfoData
        }
        if(Case == "Add")
        {
            objmarker.icon = window.location.origin + '/assets/images/mymarker1.png';
            addMarker(objmarker)
        }
        else if(Case == "Update")
        {
            objmarker.icon = window.location.origin + '/assets/images/mymarker2.png';
            addMarkerOnSeek(objmarker);
        }
    };

    const addMarker = (objmarker: any): void => {
        if (objmarker) {
            let m: any = new google.maps.Marker({
                position: new google.maps.LatLng(objmarker.position.lat(), objmarker.position.lng()),
                map: map,
                icon: objmarker.icon,
                zIndex: objmarker.zIndex
            })
            m.data = objmarker.data
            EventListner(m)
        }
    }

    const addMarkerOnSeek = (objmarker: any): void => {
            if(marker){
                marker.setPosition(objmarker.position);
                marker.setIcon(objmarker.icon);
            }
            else{
                let m: any = new google.maps.Marker({
                    position: new google.maps.LatLng(objmarker.position.lat(), objmarker.position.lng()),
                    map: map,
                    icon: objmarker.icon,
                    zIndex: objmarker.zIndex
                })
                setMarker(m);
            }
    }

    const EventListner = (markers:any): void => {
        if (map) {
            google.maps.event.addListener(markers, 'click', function (e) {
                onMarkerClick(markers.data);
            })
        }
    }

    const onMarkerClick = (data:any): void => {
        let logtime=data.logTime ? data.logTime : data.LOGTIME ? data.LOGTIME : null;
        callBackOnMarkerClick(logtime);
    }

    const initMap = (mapCenter:any): void => {
        if (mapContainer.current) {
            setGMap(
                new google.maps.Map(mapContainer.current, {
                    zoom: zoomLevel,minZoom: 2,center: mapCenter,mapTypeControl: mapTypeControl,streetViewControl: false,
                    rotateControl: false,scaleControl: true,fullscreenControl: false,panControl: false,zoomControl: true,
                    gestureHandling: 'cooperative',mapTypeId: mapType,draggableCursor: 'pointer',
                })
            );

        }
    };

    return (
        <div>
            <div ref={mapContainer} className="map-container__map"></div>
        </div>
    )
}

export default Map
