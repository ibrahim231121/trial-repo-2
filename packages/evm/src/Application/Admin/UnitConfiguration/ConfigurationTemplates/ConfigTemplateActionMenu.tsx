import React from "react";
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useDispatch } from "react-redux";

type Props = {
    selectedItems?: any;
    row?: any;
};

const ConfigTemplateActionMenu: React.FC<Props> = ({ selectedItems, row }) => {

    return (
        <Menu
            align="start"
            viewScroll="initial"
            direction="right"
            position="auto"
            className="menuCss"
            arrow
            menuButton={
                <MenuButton>
                    <i className="fas fa-pen"></i>
                </MenuButton>
            }
        >
        </Menu>
    );
};
export default ConfigTemplateActionMenu;
