import { urlList, urlNames } from "../../utils/urlList"
const textDisplay = (text: string, classes: string | undefined) => {

  let idIndex = text.indexOf("_");
  let unitId = text.substring(idIndex + 1, text.length);
 
  return <a href={urlList.filter((item:any) => item.name === urlNames.unitsAndDevicesDetail)[0].url + "/" + unitId} className={classes} >{text.substring(0, idIndex)}</a>
};

export default textDisplay;
