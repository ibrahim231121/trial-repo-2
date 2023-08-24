import React, { useRef } from "react";
import { Link, useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../utils/urlList';
import Restricted from "../ApplicationPermission/Restricted";

import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import './index.scss'
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { CRXModalDialog } from "@cb/shared";
import UnitDeviceAssignUser from "./UnitDeviceAssignUser";
import { CRXToaster } from "@cb/shared";

type Props = {
    selectedItems?: any;
    row?: any;
    portal?: boolean;
    showToastMsg?: (obj: any) => void;
};

const UnitAndDevicesActionMenu: React.FC<Props> = ({ selectedItems, row}) => {
    const { t } = useTranslation<string>();
    const history = useHistory();
    const [openAssignUser, setOpenAssignUser] = React.useState(false);
const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
const [IsformUpdated, setIsformUpdated] = React.useState(false);
const [isOpen, setIsOpen] = React.useState<boolean>(false);
const [isDuplicate, setIsDuplicate] = React.useState<boolean>(false);
const [filterValue, setFilterValue] = React.useState<any>([]);
const [filterGroupValue, setFilterGroupValue] = React.useState<any>([]);
const toasterRef = useRef<typeof CRXToaster>(null);
React.useEffect(() => {
    var valueArr = selectedItems.map(function(item: any){ return item.deviceType });
    let isDuplicate =  valueArr.every((item: any) => valueArr.indexOf(item) === 0);
    setIsDuplicate(isDuplicate);

  }, [selectedItems]);
    const handleCloseAssignUser= () => {
        if (IsformUpdated){
            setIsModalOpen(true);
            setOpenAssignUser(false);
        } 
        else setOpenAssignUser(false);
    }

    const assignUser = () => {
        setOpenAssignUser(true);
    }
   const editUnitDevice =() =>
   {
      if (row) {
        history.push(urlList.filter((item:any) => item.name === urlNames.unitsAndDevices)[0].url + "/" + row.id  , {
            unitId: row.id,
            stationId: row.stationId,
            template: row.template,
            deviceType: row.deviceType
          });
      }
    }
   
    const showToastMsg = (obj: any) => {
        toasterRef.current.showToaster({
          message: obj.message,
          variant: obj.variant,
          duration: obj.duration,
          clearButtton: true,
        });
      };

    return (
        <>
        <CRXToaster ref={toasterRef} />
        <CRXModalDialog
            maxWidth="lg"
            title={t("Assign_user(s)")}
            className={"CRXModal CRXModalAssignUser"}
            modelOpen={openAssignUser}
            onClose={() => handleCloseAssignUser()}
            defaultButton={false}
            indicatesText={true}
        >
        <UnitDeviceAssignUser
          selectedItems={selectedItems}
          filterValue={filterValue}
          setFilterValue={(v: any) => setFilterValue(v)}
          filterGroupValue={filterGroupValue}
          setFilterGroupValue={(v: any) => setFilterGroupValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenAssignUser(false)}
          showToastMsg={(obj: any) => showToastMsg?.(obj)}
          setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
        />
        </CRXModalDialog>
        <Menu
            align="center"
            viewScroll="close"
            direction="right"
            position="auto"
            className="menuCss unitDeviceMenuCss"
            offsetX={-16}
            portal={true}
            menuButton={<MenuButton><i className="far fa-ellipsis-v"></i></MenuButton>}
        >
               {(selectedItems?.length < 2 || !selectedItems) &&          
                <MenuItem>
                    <Restricted moduleId={14}>
                        <div className="crx-meu-content crx-spac groupingMenu" onClick={editUnitDevice}>
                            <div className="crx-menu-icon">
                                <i className="fas fa-pen"></i>
                            </div>
                            <div className="crx-menu-list">
                                {`${t("Edit_Configuration")}`}
                            </div>
                        </div>
                    </Restricted>
                </MenuItem>}
                
                {( (selectedItems?.length < 2) ||(!selectedItems)||(selectedItems?.length >= 2 && isDuplicate)) &&
              
                <MenuItem>
                    <div className="crx-meu-content" onClick={assignUser} >
                        <div className="crx-menu-icon">
                        </div>
                        <div className="crx-menu-list">
                            {t("Assign_user(s)")}
                        </div>
                    </div>
                </MenuItem>}
                <MenuItem>
                    <div className="crx-meu-content" >
                        <div className="crx-menu-icon">
                        </div>
                        <div className="crx-menu-list">
                            {t("Deactivate")}
                        </div>
                    </div>
                </MenuItem>
                {(selectedItems?.length < 2 || !selectedItems) &&
                    <MenuItem href={`${urlList.filter((item: any) => item.name === urlNames.singleLiveView)[0].url}&stationId=${row?.stationId}&unitSysSerial=${row?.id}&unitId=${row?.unitId != null ? JSON.parse(row?.unitId).unitName : ""}`} target="_blank">
                        <Restricted moduleId={57}>
                            <div className="crx-meu-content">
                                <div className="crx-menu-icon">
                                </div>
                                <div className="crx-menu-list">
                                    {t("View_Live_Video")}
                                </div>
                            </div>
                        </Restricted>
                    </MenuItem>}
            </Menu></>
    );
};
export default UnitAndDevicesActionMenu;
