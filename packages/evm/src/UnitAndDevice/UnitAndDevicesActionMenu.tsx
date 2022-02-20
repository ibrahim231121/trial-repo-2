import React from "react";
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

type Props = {
    selectedItems?: any;
    row?: any;
};

const UnitAndDevicesActionMenu: React.FC<Props> = ({ selectedItems, row }) => {

    return (
        <Menu
            align="start"
            viewScroll="initial"
            direction="right"
            position="auto"
            className="menuCss unitDeviceMenuCss"
            arrow
            menuButton={ <MenuButton><i className="far fa-ellipsis-v"></i></MenuButton> }
        >
        <MenuItem>
            <div className="crx-meu-content crx-spac groupingMenu">
                <div className="crx-menu-icon">
                <i className="fas fa-pen"></i>
                </div>
                <div className="crx-menu-list">
                    {`Edit <Configuration>`}
                </div>
            </div>
        </MenuItem>
        <MenuItem>
            <div className="crx-meu-content crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">
                    Assign user(s)
                </div>
            </div>
        </MenuItem>
        <MenuItem>
            <div className="crx-meu-content crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">
                    Deactivate
                </div>
            </div>
        </MenuItem>

        </Menu>
    );
};
export default UnitAndDevicesActionMenu;
