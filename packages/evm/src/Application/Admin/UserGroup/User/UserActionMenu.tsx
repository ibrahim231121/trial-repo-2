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
            <MenuItem >
                <div className="crx-meu-content groupingMenu crx-spac">
                    <div className="crx-menu-icon">
                        <i className="fas fa-pen"></i>
                    </div>
                    <div className="crx-menu-list">
                        Edit user
                    </div>
                </div>
            </MenuItem>
            {
                row?.status.toLocaleLowerCase() == 'accountlocked' ?
                    <MenuItem>
                        <div className="crx-meu-content">
                            <div className="crx-menu-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="crx-menu-list">
                                Unlock account
                            </div>
                        </div>
                    </MenuItem>
                    : <div></div>
            }
            {
                row?.status.toLocaleLowerCase() != 'deactivated' ?
                    <MenuItem>
                        <div className="crx-meu-content">
                            <div className="crx-menu-icon">

                            </div>
                            <div className="crx-menu-list">
                                Deactivate account
                            </div>
                        </div>
                    </MenuItem>
                    : <div></div>
            }
        </Menu>
    );
};
export default UserActionMenu;
