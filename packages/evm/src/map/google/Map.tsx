import React, { useRef, useState, useEffect } from "react";

interface IMap {
    mapType: google.maps.MapTypeId,
    mapTypeControl?: boolean,
    zoomLevel?: number,
    gpsData: any,
    callBackOnMarkerClick: any,
    updateSeekMarker?: any,
    mapCenter?:any,
    directions?:any,
    getInfoWindowContentOnMarkerClick?:(data:any) => string,
    onMapLoadingSuccess?:()=>void
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

const Map: React.FC<IMap> = ({ mapType, mapTypeControl = false, zoomLevel = 5, gpsData, callBackOnMarkerClick, updateSeekMarker, mapCenter, directions, getInfoWindowContentOnMarkerClick, onMapLoadingSuccess}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setGMap] = useState<GoogleMap>();
    const [marker, setMarker] = useState<any>();

    const isInitialSetupRef = useRef<boolean>(true);
    const infoWindowref = useRef<google.maps.InfoWindow>(new google.maps.InfoWindow())

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

    useEffect(()=>{
        if(directions && map){
            let originPnt = getLatLon(directions.origin);
            let originGPnt =mapCenter = new google.maps.LatLng(originPnt.latitude, originPnt.longitude)
            let destinationPnt = getLatLon(directions.destination);
            let destinationGPnt =mapCenter = new google.maps.LatLng(destinationPnt.latitude, destinationPnt.longitude)

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers:true});
            directionsRenderer.setMap(map);
            
            directionsService.route({
                origin: originGPnt,
                destination: destinationGPnt,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (response:google.maps.DirectionsResult, status:google.maps.DirectionsStatus)=>{
                directionsRenderer.setDirections(response);
            });
    }
    },[directions]);

    useEffect(() => {
        let mapCenter;
        if(gpsData && gpsData.length > 0)
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

    useEffect(() => {
        if(isInitialSetupRef.current){
            //do not center on initial setup as it is set on map initialize.
        }else{
            if(mapCenter){
                let pnt = getLatLon(mapCenter);
                let mapCenterLatLng = new google.maps.LatLng(pnt.latitude, pnt.longitude)
                map?.setCenter(mapCenterLatLng);
            }            
        }
    }, [mapCenter]);

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
        setMarker((prevMarker:any) => {
            if(prevMarker){
                prevMarker.setPosition(objmarker.position);
                prevMarker.setIcon(objmarker.icon);
                return prevMarker;
            }
            else{
                let m: any = new google.maps.Marker({
                    position: new google.maps.LatLng(objmarker.position.lat(), objmarker.position.lng()),
                    map: map,
                    icon: objmarker.icon,
                    zIndex: objmarker.zIndex
                })
                return m;
            }
        });            
    }

    const EventListner = (markers:any): void => {
        if (map) {
            google.maps.event.addListener(markers, 'click', function (e) {
                onMarkerClick(markers);
            });

            google.maps.event.addListenerOnce(map, "tilesloaded", function(e){
                if(onMapLoadingSuccess){
                    onMapLoadingSuccess()
                }                
            });
        }
    }

    const onMarkerClick = (marker:any): void => {
        const data = marker.data;
        let logtime=data.logTime ? data.logTime : data.LOGTIME ? data.LOGTIME : null;
        callBackOnMarkerClick(logtime);

        if(getInfoWindowContentOnMarkerClick){
            let content = getInfoWindowContentOnMarkerClick(logtime);
            
            if(content){
                infoWindowref.current.setContent(content);  
                infoWindowref.current.open(map, marker); 
            }
            
        }
        
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
            isInitialSetupRef.current = false;

        }
    };

    return (
        <div>
            <div ref={mapContainer} className="map-container__map"></div>
        </div>
    )
}

export default Map
