import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useTranslation } from 'react-i18next';
import Restricted from "../../../../ApplicationPermission/Restricted";
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory } from "react-router-dom";

type Props = {
  selectedItems?: any;
  row?: any;
  getRowData: () => void;
  getSelectedData: () => void;
  getSuccess: () => void;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  onMessageShow: (isSuccess: boolean, message: string) => void;
};

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, getRowData, getSelectedData, getSuccess, onClickOpenModel, onMessageShow }) => {
  const history = useHistory();
  const { t } = useTranslation<string>();

  const editFormFields = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id);
  };

  return (
    <div className="table_Inner_Action">

      <Menu
        key="right"
        align="center"
        viewScroll="auto"
        direction="right"
        position="auto"
        offsetX={25}
        offsetY={12}
        className="menuCss"
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >

        {selectedItems.length <= 1 ? (
          <MenuItem onClick={editFormFields}>
            <Restricted moduleId={0}>
              <div className="crx-meu-content   crx-spac"  >
                <div className="crx-menu-icon">
                  <i className="far fa-pencil"></i>
                </div>
                <div className="crx-menu-list">
                  {t("Edit_Category_Forms")}
                </div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )}
      </Menu>
    </div>
  );
};
export default CategoryFormsTemplateActionMenu;
