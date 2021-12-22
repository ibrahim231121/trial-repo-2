import { urlList } from "../../../utils/urlList";

const StationNameDisplay = (text: string, classes: string | undefined) => {

    let id = text.lastIndexOf("_");
    let stationId: any = text.substring(id + 1, text.length);
    let stationText = text.substring(0,id)

    console.log("stationId",Object.entries(urlList)[10][0].toString())
  
    return <a href={Object.entries(urlList)[10][0].toString() + "/" + stationId} className={classes}>{stationText}</a>
  };

  export default StationNameDisplay;