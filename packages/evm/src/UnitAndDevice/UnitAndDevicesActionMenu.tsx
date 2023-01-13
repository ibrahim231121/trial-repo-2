import React from "react";
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

type Props = {
    selectedItems?: any;
    row?: any;
    portal?: boolean;
};

const UnitAndDevicesActionMenu: React.FC<Props> = ({ selectedItems, row}) => {
    const { t } = useTranslation<string>();
    const history = useHistory();


    return (
        <Menu
            align="start"
            viewScroll="close"
            direction="right"
            position="auto"
            className="menuCss unitDeviceMenuCss"
            offsetX={-16}
            portal={true}
            menuButton={ <MenuButton><i className="far fa-ellipsis-v"></i></MenuButton> }
        >
        <MenuItem>
            <div className="crx-meu-content crx-spac groupingMenu">
                <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
                </div>
                <div className="crx-menu-list">
                    {`${t("Edit_Configuration")}`}
                </div>
            </div>
        </MenuItem>
        <MenuItem>
            <div className="crx-meu-content crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">
                {t("Assign_user(s)")}
                </div>
            </div>
        </MenuItem>
        <MenuItem>
            <div className="crx-meu-content crx-spac">
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
            <div className="crx-meu-content crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">
                {t("View_Live_Video")}
                </div>
            </div>
            </Restricted>
            </MenuItem>
            }
        </Menu>
    );
};
export default UnitAndDevicesActionMenu;
