import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory } from "react-router-dom";

type Props = {
  selectedItems?: any;
  row?: any;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
};

const CategoriesTemplateActionMenu: React.FC<Props> = ({ selectedItems, row }) => {

  const { t } = useTranslation<string>();
  const history = useHistory();

  const editCategolries = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id, t("Edit_Category"));
  };
  
  return (
    <div className="table_Inner_Action">

      <Menu
        key="right"
        align="center"
        viewScroll="close"
        direction="right"
        position="auto"
        offsetX={-15}
        offsetY={0}
        portal={true}
        className="menuCss "
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >
        {selectedItems.length <= 1 ? (
          <MenuItem onClick={editCategolries}>
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