export const LoadGoogleMapApi = (key: string) => {
    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&language=en&quarterly`;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf(mapsUrl) === 0) {
            return scripts[i];
        }
    }
    const googleMapScript = document.createElement('script');
    googleMapScript.src = mapsUrl;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);
    return googleMapScript;
};