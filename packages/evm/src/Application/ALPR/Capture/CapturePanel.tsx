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
  const [dataSourcePayload, setDataSourcePaylod] = React.useState<HotListDataSourceTemplate>();
  const [dataSourceMappingPayload, setDataSourceMappingPaylod] = React.useState<HotListDataSourceMappingTemplate>();
  const history = useHistory();
  const [isDisabled, setisDisabled] = React.useState<boolean>(true);
  const alprDataSource: any = useSelector((state: RootState) => state.alprDataSourceReducer.DataSource);
  const sourceMappingData: any = useSelector((state: RootState) => state.alprDataSourceReducer.SourceMapping);
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(SourceMapping())
    dispatch(GetAlprDataSourceList())
  }, [])


  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("Capture"), index: 0 },
    { label: t("Live"), index: 1 }
  ];

  const dataSourceTab = (dataSourceTabValues: HotListDataSourceTemplate) => {
    setDataSourcePaylod(dataSourceTabValues);

  }
  const saveButtonDisable = (flag: boolean) => {
    setisDisabled(flag);
  }
  const dataSourceMappingTab = (dataSourceMappingTabValues: HotListDataSourceMappingTemplate) => {
    setDataSourceMappingPaylod(dataSourceMappingTabValues);

  }
  const onSave = () => {

    history.push(
      urlList.filter((item: any) => item.name === urlNames.DataSource)[0].url
    );
  }
  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.DataSource)[0].url
    );
    setIsOpen(false)
  };
  const closeDialog = () => {
    setIsOpen(true);
  };
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
      <div className="tab-bottom-buttons stickyFooter_Tab">
        <div className="save-cancel-button-box">
          <CRXButton
            variant="contained"
            className="captureTabButtons"
            onClick={onSave}
            disabled={isDisabled}
          >
            {t("Save")}
          </CRXButton>
          <CRXButton
            className="captureTabButtons secondary"
            color="secondary"
            variant="outlined"
            onClick={() =>
              history.push(
                urlList.filter(
                  (item: any) => item.name === urlNames.DataSource
                )[0].url
              )
            }
          >
            {t("Cancel")}
          </CRXButton>
        </div>
        <CRXButton
          onClick={() => closeDialog()}
          className="captureTabButtons-Close secondary"
          color="secondary"
          variant="outlined"
        >
          {t("Close")}
        </CRXButton>
        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={handleClose}
          isOpen={isOpen}
          className="Categories_Confirm"
          primary={t("Yes_close")}
          secondary={t("No,_do_not_close")}
          text="retention policy form"
        >
          <div className="confirmMessage">
            {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
            <strong>{ }</strong>. {t("If_you_close_the_form")},
            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom">
              {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
            </div>
          </div>
        </CRXConfirmDialog>
      </div>

    </div>
  );
};

export default CaptureFormPanel;
