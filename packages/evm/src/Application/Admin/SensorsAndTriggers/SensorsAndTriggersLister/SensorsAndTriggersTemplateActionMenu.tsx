import React, { useState,useEffect,useCallback} from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Dialogbox from '../../UnitConfiguration/ConfigurationTemplates/Dialogbox';
import { useHistory } from "react-router";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from '../../../../utils/urlList';
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import { getAllSensorsEvents } from "../../../../Redux/SensorEvents";
import { useDispatch } from "react-redux";

type Props = {
  selectedItems?: any;
  row?: any;
  getRowData: () => void;
  getSelectedData : () => void;
  onMessageShow: (isSuccess:boolean,message: string) => void;
};

const SensorsAndTriggersTemplateActionMenu: React.FC<Props> = ({selectedItems, row, getRowData,getSelectedData,onMessageShow}) => {
const { t } = useTranslation<string>();
const history = useHistory();
const dispatch = useDispatch();

const [nondefault, setnondefault] = useState(false);

const deleteSensorAndTrigger = () => {

  if(row && !selectedItems.includes(row)) {
    SetupConfigurationAgent.deleteSensorsAndTriggersTemplate(row.id)
    .then(() => {
      getRowData();
      getSelectedData();
      onMessageShow(true,t("SensorsAndTriggers_Deleted_Sucessfully"));
    })
    .catch(function(error) {     
        onMessageShow(false,error?.response?.data?.toString());
        return error;
    });
  }
  else if(Array.isArray(selectedItems) && selectedItems.length > 0) {
    const eventIds: number[] = selectedItems.map((data: any) => {
      return data.id;
    });
    SetupConfigurationAgent.deleteAllSensorsAndTriggersTemplate(eventIds)
    .then(() => {
      getRowData();
      getSelectedData();
      onMessageShow(true,t("SensorsAndTriggers_Deleted_Sucessfully"));
    })
    .catch(function(error) {      
        onMessageShow(false,error?.response?.data?.toString());
        return error;
    });
  }
}

const deleteConfirm = () => { 
      setnondefault(true);  
}

const openCreateSensorsAndTriggersForm = () => {
    let urlPathName =urlList.filter((item: any) => item.name === urlNames.sensorsAndTriggersEdit)[0].url;
    history.push(
      urlPathName.substring(0, urlPathName.lastIndexOf("/")) + "/" + row?.id
    );
  };


 async function Onconfirm(){
  deleteSensorAndTrigger();
  setnondefault(false);
  }

  return (
    <div className="table_Inner_Action">
    <Menu
      key="right"
      align="center"
      viewScroll="close"
      direction="right"
      position="auto"
      offsetX={-20}
      offsetY={12}
      portal={true}
      className="menuCss"
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    
    >
      {(row && !selectedItems.includes(row)) || (selectedItems.length <= 1)  ? (
      <MenuItem onClick={openCreateSensorsAndTriggersForm}>
      <Restricted moduleId={51}>
          <div className="crx-meu-content groupingMenu crx-spac"  >
            <div className="crx-menu-icon">
            <i className="far fa-pencil"></i>
            </div>
            <div className="crx-menu-list ">
              {t("Edit_sensor_and_trigger")}
            </div>
          </div>
          </Restricted>
        </MenuItem>
     ) : (
      <div></div>
      )}  
      
      <MenuItem >
      <Restricted moduleId={50}>
        <div className="crx-meu-content  crx-spac" onClick={deleteConfirm} >
          <div className="crx-menu-icon">
            <i className="far fa-trash-alt"></i>
          </div>
          <div className="crx-menu-list">
          {t("Delete_sensor_and_trigger")}
          </div>
        </div>
        </Restricted>
      </MenuItem>
    </Menu>
      <Dialogbox
        className="crx-unblock-modal crxConfigModal"
        title={""}
        setIsOpen={setnondefault}
        onConfirm={Onconfirm}
        isOpen={nondefault}
        myVar={true}
        secondary={t("Yes_delete")}
        primary={t("No_do_not_delete")}
      >
        {
          <div className="crxUplockContent configuserParaMain">
            <p className="configuserPara1">
            {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}</span> {t("this")} <span className="boldPara">{selectedItems && selectedItems.description}</span> {t("Sensors_And_Triggers")}. 
            {t("You_will_not_be_able_to_undo_this_action.")}
            </p>
            <p className="configuserPara2">{t("Are_you_sure_you_would_like_to_delete_sensors_and_triggers?")}</p>
          </div>
        }
      </Dialogbox> 
    </div>
  );
};
export default SensorsAndTriggersTemplateActionMenu;
