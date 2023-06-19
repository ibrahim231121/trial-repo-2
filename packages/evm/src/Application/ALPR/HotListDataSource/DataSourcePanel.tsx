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
import DataSourceMapping from "./DataSourceTabs/DataSourceMapping";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { Link, useHistory } from "react-router-dom";
import "./DataSourcePanel.scss"
import { HotListDataSourceTemplate } from "../../../utils/Api/models/HotListDataSourceModels";
import { HotListDataSourceMappingTemplate } from "../../../utils/Api/models/HotlistDataSourceMapping";
import { RootState } from "../../../Redux/rootReducer";
import { GetAlprDataSourceById } from "../../../Redux/AlprDataSourceReducer";
import { CRXConfirmDialog } from "@cb/shared";
import { ALPRDataSource } from "../../../utils/Api/ApiAgent";

const DataSourceFormsAndFields = () => {
  const { id } = useParams<{ id: string }>();//get data from url 
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);
  const [dataSourcePayload, setDataSourcePayload] = React.useState<HotListDataSourceTemplate>({
    syserial: 0,
    sourceTypeId: 0,
    name: '',
    sourceName: '',
    sourceTypeName: '',
    user: '',
    password: '',
    confirmPassword: '',
    connectionType: '',
    schedulePeriod: '',
    locationPath: '',
    port: '',
    lastRun: '',
    status: '',
    statusDesc: '',
    sourceType:{sysSerial:0,sourceTypeName:''}
  });
  const [dataSourceMappingPayload, setDataSourceMappingPaylod] = React.useState<HotListDataSourceMappingTemplate>({ LicensePlate: '',
  DateOfInterest: '',
  LicenseType: '',
  AgencyId: '',
  State: '',
  FirstName: '',
  LastName: '',
  Alias: '',
  Year: '',
  Make: '',
  Model: '',
  Color: '',
  Style: '',
  Notes: '',
  NCICNumber: '',
  ImportSerial: '',
  ViolationInfo: ''});
  const history = useHistory();
  const [isDisabled, setisDisabled] = React.useState<boolean>(true);
  const [isDisabledMapping, setIsDisabledMapping] = React.useState<boolean>(true);
  const dataSourceDataById: any = useSelector((state: RootState) => state.alprDataSourceReducer.DataSourceDataById);
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch();
  const Datasource = "HotListDataSource";

  useEffect(() => {
    if (id !== ':id') {
      dispatch(GetAlprDataSourceById(id))
    }
  }, [])

  useEffect(() => {
    if (id !== ':id' && Object.keys(dataSourceDataById).length > 0) {
      setDataSourcePayload(dataSourceDataById)
      let dataSouceMappingData: HotListDataSourceMappingTemplate = JSON.parse(dataSourceDataById?.schemaDefinition) as HotListDataSourceMappingTemplate
      if (dataSouceMappingData && dataSouceMappingData.DateOfInterest !== '' && dataSouceMappingData?.LicensePlate !== '') {
        setIsDisabledMapping(false);
      } else {
        setIsDisabledMapping(true);
      }
      setDataSourceMappingPaylod(dataSouceMappingData)
    }else
    {
      let temp={ LicensePlate: '',
      DateOfInterest: '',
      LicenseType: '',
      AgencyId: '',
      State: '',
      FirstName: '',
      LastName: '',
      Alias: '',
      Year: '',
      Make: '',
      Model: '',
      Color: '',
      Style: '',
      Notes: '',
      NCICNumber: '',
      ImportSerial: '',
      ViolationInfo: '',
      sourceType:{syserial:0,sourceTypeName:''}}
      setDataSourceMappingPaylod(temp);
    }
  }, [dataSourceDataById])

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("Data_Source"), index: 0 },
    { label: t("Data_Source_Mappings"), index: 1 }
  ];

  const dataSourceTab = (dataSourceTabValues: HotListDataSourceTemplate) => {
    setDataSourcePayload(dataSourceTabValues);

  }
  const saveButtonDisable = (flag: boolean) => {
    setisDisabled(flag);
  }
  const saveBtnDisblFromMapping = (mappingTabFlag: boolean) => {
    setIsDisabledMapping(mappingTabFlag);

  }
  const dataSourceMappingTab = (dataSourceMappingTabValues: HotListDataSourceMappingTemplate) => {
    setDataSourceMappingPaylod(dataSourceMappingTabValues);

  }
  const onSave = () => {
    if (+id > 0) {
      console.log (dataSourcePayload?.sourceType)
      let requestBody = {
        syserial: +id,
        name: dataSourcePayload?.name,
        sourceName: dataSourcePayload?.sourceName,
        sourceTypeName: dataSourcePayload?.sourceTypeName,
        sourceTypeId: dataSourcePayload?.sourceTypeId,
        userId: dataSourcePayload?.user,
        password: dataSourcePayload?.password,
        confirmPassword: dataSourcePayload?.password,
        connectionType: dataSourcePayload?.connectionType,
        schedulePeriod: dataSourcePayload?.schedulePeriod,
        locationPath: dataSourcePayload?.locationPath,
        port: dataSourcePayload?.port,
        lastRun: dataSourcePayload?.lastRun,
        status: dataSourcePayload?.status,
        statusDesc: dataSourcePayload?.statusDesc,
        schemaDefinition: JSON.stringify(dataSourceMappingPayload),
        sourceType: dataSourcePayload?.sourceType,
      }
      const urlEdit = Datasource + '/' + `${id}`;
      ALPRDataSource.updateDataSource(urlEdit, requestBody).then(() => {

      }).catch((e: any) => {
        //      catchError(e);
      });
    }else
    {
      let requestBody = {
        syserial: 0,
        name: dataSourcePayload?.name,
        sourceName: dataSourcePayload?.sourceName,
        sourceTypeName: dataSourcePayload?.sourceTypeName,
        sourceTypeId: dataSourcePayload?.sourceTypeId,
        userId: dataSourcePayload?.user,
        password: dataSourcePayload?.password,
        confirmPassword: dataSourcePayload?.password,
        connectionType: dataSourcePayload?.connectionType,
        schedulePeriod: dataSourcePayload?.schedulePeriod,
        locationPath: dataSourcePayload?.locationPath,
        port: dataSourcePayload?.port,
        lastRun: dataSourcePayload?.lastRun,
        status: dataSourcePayload?.status,
        statusDesc: dataSourcePayload?.statusDesc,
        schemaDefinition: '',
        sourceType: {
          SysSerial: dataSourcePayload?.sourceTypeId,
          SourceTypeName: dataSourcePayload?.sourceTypeName
        },
      }
      const urlEdit = Datasource;
      ALPRDataSource.addDataSource(urlEdit, requestBody).then(() => {

      }).catch((e: any) => {
        //      catchError(e);
      });
    }
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
          {Object.keys(dataSourcePayload).length > 0 ?
            // {dataSourcePayload ?
            <DataSourceDetail dataSource={dataSourceTab} saveButtonDisable={saveButtonDisable} dataSourceData={dataSourcePayload} /> : <div></div>}
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div >
          {/* calling component here */}
          {dataSourceMappingPayload ?
            <DataSourceMapping dataSourceMappingTab={dataSourceMappingTab} saveBtnDisblFromMapping={saveBtnDisblFromMapping} sourceMappingData={dataSourceMappingPayload} /> : <div></div>}
        </div>
      </CrxTabPanel>
      <div className="tab-bottom-buttons stickyFooter_Tab">
        <div className="save-cancel-button-box">
          <CRXButton
            variant="contained"
            className="dataSourceTabButtons"
            onClick={onSave}
            disabled={isDisabled && isDisabledMapping}
          >
            {t("Save")}
          </CRXButton>
          <CRXButton
            className="dataSourceTabButtons secondary"
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
          className="dataSourceTabButtons-Close secondary"
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
            {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" Form"}
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

export default DataSourceFormsAndFields;
