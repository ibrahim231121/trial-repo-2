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

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, getRowData, getSelectedData, getSuccess, onClickOpenModel, onMessageShow }) => {

  const { t } = useTranslation<string>();
 
  const editFormFields = () => {
    onClickOpenModel(true, Number(row?.id), t("Edit_Form_Fields"));
  };

  return (
    <div className="table_Inner_Action">

      <Menu
        key="right"
        align="center"
        viewScroll="close"
        direction="right"
        position="auto"
        portal={true}
        offsetX={-28}
        offsetY={-5}
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
                  {t("Edit_Form_Fields")}
                </div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <div></div>
        )}

        <MenuItem >
          <Restricted moduleId={0}>
            <div className="crx-meu-content  crx-spac"  >
              <div className="crx-menu-icon">
                <i className="far fa-trash-alt"></i>
              </div>
              <div className="crx-menu-list">
                {t("Delete_Form_Fields")}
              </div>
            </div>
          </Restricted>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default CategoryFormsTemplateActionMenu;
