import React, { useEffect, useState, useRef } from "react";
import {
  CRXTabs,
  CrxTabPanel,
  CRXAlert,
  CRXToaster,
} from "@cb/shared";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DataSourceDetail from "../HotListDataSource/DataSourceTabs/DataSourceDetail"
// import DataSourceMapping from "./DataSourceTabs/DataSourceMapping";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { Link, useHistory } from "react-router-dom";
import "./CapturePanel.scss"
import { HotListDataSourceTemplate } from "../../../utils/Api/models/HotListDataSourceModels";
import { HotListDataSourceMappingTemplate } from "../../../utils/Api/models/HotlistDataSourceMapping";
import { RootState } from "../../../Redux/rootReducer";
import { GetAlprDataSourceList, SourceMapping } from "../../../Redux/AlprDataSourceReducer";
import { CRXConfirmDialog } from "@cb/shared";
import AlprCapture from "./CaptureTabs/AlprCapture";
import AlprLive from "./CaptureTabs/AlprLive";

const CaptureFormPanel = () => {
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("Capture"), index: 0 },
    { label: t("Live"), index: 1 }
  ];
  return (
    <div className="switchLeftComponents">

      {/* <CRXToaster ref={groupMsgRef} /> */}

      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} stickyTab={130} />
      <CrxTabPanel value={value} index={0}>
        <div>
          <AlprCapture />
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div >
          {/* calling component here */}
          <AlprLive />
        </div>
      </CrxTabPanel>
      

    </div>
  );
};

export default CaptureFormPanel;
