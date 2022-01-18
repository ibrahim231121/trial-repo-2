export const LoadBingMapApi = (key: string) => {
    const callbackName = "bingAPIReady";
    const mapsUrl = `https://www.bing.com/api/maps/mapcontrol?callback=${callbackName}&Key=${key}`;

    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf(mapsUrl) === 0) {
            return scripts[i];
        }
    }
    const bingMapScript = document.createElement('script');
    bingMapScript.src = mapsUrl;
    bingMapScript.async = true;
    bingMapScript.defer = true;
    window.document.body.appendChild(bingMapScript);
    return bingMapScript;
};


