import { urlList, urlNames } from "../../../utils/urlList";
const StationNameDisplay = (text: string, classes: string | undefined) => {

    let id = text.lastIndexOf("_");
    let stationId: any = text.substring(id + 1, text.length);
    let stationText = text.substring(0,id);
    let url = urlList.filter((item:any) => item.name === urlNames.adminStation)[0].url + "/" + stationId;
    return <a href={url} className={classes}>{stationText}</a>
  };

  export default StationNameDisplay;