import { urlList, urlNames } from "../../utils/urlList"
import { Link } from "react-router-dom";

const textUnitDisplay = (text: string) => {
  let urlProps = JSON.parse(text);
  return <><Link className={"linkColor"} children = {urlProps.unitName} key={urlProps.unitId}  to={{pathname:urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url + "/" + urlProps.unitId, state:{unitId: urlProps.unitId, stationId: urlProps.stationId,template:urlProps.template}}}/>
 <div className="touch-baseLink">
        <Link
          to={{pathname:urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url + "/" + urlProps.unitId, state:{unitId: urlProps.unitId, stationId: urlProps.stationId,template:urlProps.template}}}
        ></Link>
      </div>
 
  </>
};

export default textUnitDisplay;
