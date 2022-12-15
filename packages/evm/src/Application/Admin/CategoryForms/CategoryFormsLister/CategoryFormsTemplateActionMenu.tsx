import React from "react";
import {
  Menu,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
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
      </Menu>
    </div>
  );
};
export default CategoryFormsTemplateActionMenu;
