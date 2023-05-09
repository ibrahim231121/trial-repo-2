import React from "react";
import { Link, useHistory } from 'react-router-dom';

import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu,
    MenuDivider,
} from "@szhsin/react-menu";
import { useTranslation } from "react-i18next";

type Props = {
};

const UpdateVersionActionMenu: React.FC<Props> = () => {
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
        </Menu>
    );
};
export default UpdateVersionActionMenu;
