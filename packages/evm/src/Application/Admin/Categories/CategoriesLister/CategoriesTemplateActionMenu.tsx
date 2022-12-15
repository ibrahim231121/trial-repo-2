import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';

type Props = {
  selectedItems?: any;
  row?: any;
  getRowData: () => void;
  getSelectedData: () => void;
  getSuccess: () => void;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  onMessageShow: (isSuccess: boolean, message: string) => void;
};

const CategoriesTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, getRowData, getSelectedData, getSuccess, onClickOpenModel, onMessageShow }) => {

  const { t } = useTranslation<string>();
  const openEditCategoryForm = () => {
    onClickOpenModel(true, Number(row?.id), t("Edit_Category"));
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
          <MenuItem onClick={openEditCategoryForm}>
            <Restricted moduleId={54}>
              <div className="crx-meu-content   crx-spac"  >
                <div className="crx-menu-icon">
                  <i className="far fa-pencil"></i>
                </div>
                <div className="crx-menu-list">
                  {t("Edit_Category")}
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
export default CategoriesTemplateActionMenu;
