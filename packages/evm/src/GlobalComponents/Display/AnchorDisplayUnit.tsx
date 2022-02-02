import { urlList, urlNames } from "../../utils/urlList"
import { Link } from "react-router-dom";

const textUnitDisplay = (text: string, classes: any) => {
  let unitName = text.split('_')[0];
  let unitId = text.split('_')[1];
  let stationId = text.split('_')[2];

  return <Link className={classes} children = {unitName} key={unitId}  to={{pathname:urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url + "/" + unitId, state:{unitId: unitId, stationId: stationId}}}/>
};

export default textUnitDisplay;
