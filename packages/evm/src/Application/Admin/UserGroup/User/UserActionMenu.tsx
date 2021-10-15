import React from "react";
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

type Props = {
    selectedItems?: any;
    row?: any;
};

const UserActionMenu: React.FC<Props> = ({ selectedItems, row }) => {

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
                    <i className="far fa-ellipsis-v"></i>
                </MenuButton>
            }
        >
        </Menu>
    );
};
export default UserActionMenu;
