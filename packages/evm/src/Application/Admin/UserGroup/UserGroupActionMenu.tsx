import React from "react";
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
//import './index.scss'
import { useDispatch } from "react-redux";
import { VoidExpression } from "typescript";

type Props = {
    selectedItems?: any;
    row?: any;
};

const UserGroupActionMenu: React.FC<Props> = ({ selectedItems, row }) => {

    return (
        <div className="toolBar">
            
        
        <Menu
            align="start"
            viewScroll="initial"
            direction="right"
            position="auto"
            className="menuCss"
            arrow
            menuButton={
                <MenuButton className="userGroup_lister_editIcon">
                    <i className="fas fa-pen"></i>
                </MenuButton>
            }
        >
        </Menu>
        </div>
    );
};
export default UserGroupActionMenu;
