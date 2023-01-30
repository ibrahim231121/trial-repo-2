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
import Restricted from "../../../ApplicationPermission/Restricted";
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
    selectedItems?: any;
    row?: any;
};

const UserGroupActionMenu: React.FC<Props> = ({ selectedItems, row }) => {
    const history = useHistory()
    const { t } = useTranslation<string>();
    const openCreateUserGroupForm = () => {
        const path = `${urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url}`;
        history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id);
        
      };

    return (
        <div className="toolBar"> 
        <Menu
            align="start"
            viewScroll="close"
            direction="right"
            position="auto"
            className="menuCss"
            portal={true}
            offsetX={-19}
            offsetY={-5}
            arrow={false}
            menuButton={
                <MenuButton className="userGroup_lister_editIcon">
                    <i className="far fa-ellipsis-v"></i>
                </MenuButton>
            }
        >
                <MenuItem onClick={openCreateUserGroupForm}>
                    <Restricted moduleId={7}>
                        <div className="crx-meu-content ">
                            <div className="crx-menu-icon">
                                <i className="fas fa-pen"></i>
                            </div>
                            <div className="crx-menu-list">{t("Edit_user_group")}</div>
                        </div>
                    </Restricted>
                </MenuItem>
        </Menu>
        </div>
    );
};
export default UserGroupActionMenu;
