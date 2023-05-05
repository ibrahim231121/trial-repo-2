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
import { GetAlprDataSourceList, SourceMapping } from "../../../Redux/AlprDataSourceReducer";

const CategoryFormsAndFields = () => {
  const { t } = useTranslation<string>();
  const [value, setValue] = React.useState(0);
  const [dataSourcePayload,setDataSourcePaylod]=React.useState<HotListDataSourceTemplate>();
  const [dataSourceMappingPayload,setDataSourceMappingPaylod]=React.useState<HotListDataSourceMappingTemplate>();
  const history = useHistory();
  const [isDisabled,setisDisabled]=React.useState<boolean>(true);
  const alprDataSource: any = useSelector((state: RootState) => state.alprDataSourceReducer.DataSource);
  const sourceMappingData: any = useSelector((state: RootState) => state.alprDataSourceReducer.SourceMapping);
  const dispatch=useDispatch();
  useEffect(()=>
  {
      dispatch(SourceMapping())
      dispatch(GetAlprDataSourceList())
  },[])

  
  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("Data_Source"), index: 0 },
    { label: t("Data_Source_Mappings"), index: 1 }
  ];

  const dataSourceTab=(dataSourceTabValues:HotListDataSourceTemplate)=>
  {
    setDataSourcePaylod(dataSourceTabValues);
  
  }
  const saveButtonDisable=(flag:boolean)=>
  {
    setisDisabled(flag);
  }
  const dataSourceMappingTab=(dataSourceMappingTabValues:HotListDataSourceMappingTemplate)=>
  {
    setDataSourceMappingPaylod(dataSourceMappingTabValues);

  }
  const onSave=()=>
  {
    
    history.push(
      urlList.filter((item: any) => item.name === urlNames.DataSource)[0].url
    );
  }
  return (
    <div className="switchLeftComponents" style={{}}>

      {/* <CRXToaster ref={groupMsgRef} /> */}

      <CRXTabs value={value} onChange={handleChange} tabitems={tabs} stickyTab={130} />
      <CrxTabPanel value={value} index={0}>
        <div>
          <DataSourceDetail dataSource={dataSourceTab} saveButtonDisable={saveButtonDisable} DataSourceData={alprDataSource}/>
        </div>
      </CrxTabPanel>

      <CrxTabPanel value={value} index={1}>
        <div >
          {/* calling component here */}
          <DataSourceMapping dataSourceMappingTab={dataSourceMappingTab} sourceMappingData={sourceMappingData}/>
        </div>
      </CrxTabPanel>
      <div className="tab-bottom-buttons stickyFooter_Tab">
          <div className="save-cancel-button-box">
            <CRXButton
              variant="contained"
              className="groupInfoTabButtons"
              onClick={onSave}
              disabled={isDisabled}
            >
              {t("Save")}
            </CRXButton>
            <CRXButton
              className="groupInfoTabButtons secondary"
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
           onClick={() =>
            history.push(
              urlList.filter(
                (item: any) => item.name === urlNames.DataSource
              )[0].url
            )
          }
            className="groupInfoTabButtons-Close secondary"
            color="secondary"
            variant="outlined"
          >
            {t("Close")}
          </CRXButton>
        </div>

    </div>
  );
};

export default CategoryFormsAndFields;
