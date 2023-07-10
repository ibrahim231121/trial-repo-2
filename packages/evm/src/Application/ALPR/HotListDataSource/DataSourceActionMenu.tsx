import React, { useRef } from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import { AlprDataSource } from "../../../utils/Api/ApiAgent";
import { alprToasterMessages } from "../AlprGlobalConfiguration";
import { CRXToaster } from "@cb/shared";

type Props = {
  selectedItems?: any;
  row?: any;
  gridData: any;
};

const HotListActionMenu: React.FC<Props> = ({ selectedItems, row, gridData }) => {

  const { t } = useTranslation<string>();
  const history = useHistory();

  const dataSourceMsgFormRef = useRef<typeof CRXToaster>(null);

  const editDataSource = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.editDataSourceTab)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.recId, t("Edit_Data_Source"));
  };
  
  const datasourceServiceUrl='DataSourceMapping/ExecuteMapping';
  const toasterErrorMsg=t('Something_went_wrong.Please_again_later');
  const toasterSuccessMsg=t('Process_Initiated_Successfully.');
  const toasterDuration=7000;
  
  const runDataSource=()=>
  {
    const runServiceUrl = datasourceServiceUrl + `/${row?.recId}`;
    AlprDataSource.runDataSource(runServiceUrl).then(() => {
        alprToasterMessages({
          message: toasterSuccessMsg,
          variant: 'success',
          duration: toasterDuration
        },dataSourceMsgFormRef);
      })    
      .catch((e: any) => {
        alprToasterMessages({
          message: toasterErrorMsg,
          variant: 'error',
          duration: toasterDuration
        },dataSourceMsgFormRef);
      });
  }
  return (
    <React.Fragment>
      <CRXToaster ref={dataSourceMsgFormRef} />
      <div className="Alpr_DataSource_TableInnerAction">

        <Menu
          key="right"
          align="center"
          viewScroll="close"
          direction="right"
          position="auto"
          offsetX={-15}
          offsetY={0}
          portal={true}
          menuButton={
            <MenuButton>
              <i className="far fa-ellipsis-v"></i>
            </MenuButton>
          }
        >
          {selectedItems.length <= 1 ? (
            <MenuItem onClick={editDataSource}>
              <Restricted moduleId={54}>
                <div className="crx-meu-content crx-spac"  >
                  <div className="crx-menu-icon">
                    <i className="far fa-pencil"></i>
                  </div>
                  <div className="crx-menu-list">
                    {t("Edit_Data_Source")}
                  </div>
                </div>
              </Restricted>
            </MenuItem>
          ) : (
            <div></div>
          )}
          <MenuItem onClick={runDataSource}>
            <Restricted moduleId={11}>
              <div className="crx-meu-content" >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Run_Data_Source")}</div>
              </div>
            </Restricted>
          </MenuItem> 
        </Menu>
      </div>
    </React.Fragment>
  );
};
export default HotListActionMenu;