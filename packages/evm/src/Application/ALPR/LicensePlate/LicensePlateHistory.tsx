import { useEffect, useRef} from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import "./LicensePlateHistory.scss"
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { CRXTabs } from "@cb/shared";
import { CrxTabPanel } from "@cb/shared";
import LicensePlateHistoryLister from "./LicensePlateHistoryTabs/LicensePlateHistoryLister";
import LicensePlateHistoryMap from "./LicensePlateHistoryTabs/LicensePlateHistoryMap";
import { AlprPlateHistoryInfo } from "../../../utils/Api/models/AlprPlateHistoryInfo";


const LicensePlateHistory = () => {
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);

  const licensePlateHistoryDataRef = useRef<AlprPlateHistoryInfo[]>([]);

  const dispatch = useDispatch();

  useEffect(()=>{
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  },[])  

  const setLicensePlateHistoryData = (data:AlprPlateHistoryInfo[]) => {
    licensePlateHistoryDataRef.current = data;
  };

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("License_Plate_History"), index: 0 },
    { label: t("License_Plate_History_Map"), index: 1 }
  ];
  return (
    <div >

      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} stickyTab={130} />
      <CrxTabPanel value={value} index={0}>
        <div>
          <LicensePlateHistoryLister setLicensePlateHistoryData={setLicensePlateHistoryData} />
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div >
          {/* calling component here */}
          <LicensePlateHistoryMap historyData={licensePlateHistoryDataRef.current} />
        </div>
      </CrxTabPanel>
      

    </div>
  );
}

export default LicensePlateHistory