import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { deleteAllUpdateVersion } from "../../../Redux/UpdateVersionSlices";
import Dialogbox from "../UnitConfiguration/ConfigurationTemplates/Dialogbox";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";

type Props = {
  selectedItems?: any;
  row?: any;
  getRowData: () => void;
  getSelectedData: () => void;
  getSuccess: () => void;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  onMessageShow: (isSuccess: boolean, message: string) => void;
  ActionMenuReload: any;
};

const UpdateVersionsActionMenu: React.FC<Props> = ({ selectedItems, row, getRowData, getSelectedData, getSuccess, onClickOpenModel, onMessageShow, ActionMenuReload }) => {
  const { t } = useTranslation<string>();
  const [nondefault, setnondefault] = useState(false);
  const [rowData, setRowData] = useState<any>();
  const dispatch = useDispatch();
  const history = useHistory();

  const editJob = () => {
    if (row) {
      const path = `${urlList.filter((item: any) => item.name === urlNames.filterUpdateVersionEdit)[0].url}`;
      history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row.id);
    }
  }

  const deleteConfirm = () => {
    if (row) {
      let tempRow = [];
      tempRow.push(row)
      setRowData(tempRow);
      setnondefault(true);
    }
    else if (selectedItems && selectedItems.length > 0) {
      setRowData(selectedItems);
      setnondefault(true);
    }
    else {
      onMessageShow(false, "No Row Selected")
      setRowData(null);
    }
  }
  const retry = () => {
    let Ids: any[] = [];
    if (row) {
      Ids = [row?.id];
    }
    else if (selectedItems && selectedItems.length > 0) {
      Ids = Array.from(selectedItems.map((x: any) => x.id));  
    }
    if(Ids.length > 0){
      UnitsAndDevicesAgent.retryAllUpdateVersions(JSON.stringify(Ids)).then((response: any) => {
        ActionMenuReload();
        setnondefault(false);
      })
      .catch((ex) => {
        onMessageShow(false, "Error occured while scheduling retry.")
        setnondefault(false);
      })
    }
  }
  const OndeleteConfirm = () => {
    if (rowData && rowData.length > 0) {
      let Ids = rowData.map((x: any) => x.id).join(",");

      let headers = [{ key: "SpecificIds", value: Ids }];
      UnitsAndDevicesAgent.deleteAllUpdateVersions(headers).then((response: any) => {
        dispatch(deleteAllUpdateVersion(rowData.map((x: any) => x.id)));
        onMessageShow(true, "Successfully Deleted")
        setnondefault(false);
      })
        .catch((ex) => {
          onMessageShow(false, "Error Occur While Deleting")
          setnondefault(false);
        })
    }
  }

  return (
    <div className="table_Inner_Action">

      <Menu
        key="right"
        align="center"
        viewScroll="close"
        direction="right"
        position="auto"
        portal={true}
        offsetX={-30}
        offsetY={0}
        className="menuCss"
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }>
        <MenuItem >
          <div className="crx-meu-content  crx-spac" onClick={editJob} >
            <div className="crx-menu-icon">
            <i className="fas fa-pencil"></i>
            </div>
            <div className="crx-menu-list">
              {t("Edit_Job")}
            </div>
          </div>
        </MenuItem>
        <MenuItem >
          <div className="crx-meu-content  crx-spac" onClick={deleteConfirm} >
            <div className="crx-menu-icon">
              <i className="far fa-trash-alt"></i>
            </div>
            <div className="crx-menu-list">
              {t("Cancel_Update_Job")}
            </div>
          </div>
        </MenuItem>
        <MenuItem disabled={row?.totalFail > 0 ? false : true} >
          <div className="crx-meu-content  crx-spac" onClick={retry} >
            <div className="crx-menu-icon">
              <i className="far fa-repeat"></i>
            </div>
            <div className="crx-menu-list">
              {t("Retry_all_failed_devices")}
            </div>
          </div>
        </MenuItem>
      </Menu>
      <Dialogbox
        className="crx-unblock-modal crxConfigModal"
        title={""}
        setIsOpen={setnondefault}
        onConfirm={() => { OndeleteConfirm() }}
        isOpen={nondefault}
        myVar={true}
        secondary={t("Yes_delete")}
        primary={t("No_do_not_delete")}
      >
        {
          <div className="crxUplockContent configuserParaMain">
            <p className="configuserPara1">
              {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}</span> {t("this")} <span className="boldPara">{selectedItems && selectedItems.description}</span> {t("Version")}.
              {t("You_will_not_be_able_to_undo_this_action.")}
            </p>
            <p className="configuserPara2">{t("Are_you_sure_you_would_like_to_delete_version?")}</p>
          </div>
        }
      </Dialogbox>
    </div>
  );
};
export default UpdateVersionsActionMenu;
