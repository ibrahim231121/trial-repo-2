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
import { useDispatch } from "react-redux";
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { getAllCategyFormsFilter } from "../../../../Redux/CategoryForms";

type CategoryFormsTemplate = {
  id: number;
  name: string;
  description: string;
}

type Props = {
  selectedItems?: CategoryFormsTemplate[];
  row?: any;
  pageiGrid: any;
  toasterRef : any;
};



const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, pageiGrid, toasterRef }) => {
  const history = useHistory();
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const editFormFields = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id);
  };

  const deleteCategoryForms = () => {
    let categoryFormIds: string = row?.id;
    if (selectedItems && selectedItems?.length > 0) {
      categoryFormIds = selectedItems?.map(({ id }) => id).join(', ')
    }

    let headers = [{ key: 'formsIds', value: categoryFormIds }]
    SetupConfigurationAgent.deleteCategoryForms(headers).then(() => {
      dispatch(getAllCategyFormsFilter(pageiGrid));
      onMessageShow(true, t("Category_Form_Deleted_Successfully"));
    })
      .catch((e: any) => {
        onMessageShow(false, e?.response?.data);
        return e;
      })
  }

  const CategoryFormFormMessages = (obj: any) => {
    toasterRef?.current?.showToaster({
        message: obj.message,
        variant: obj.variant,
        duration: obj.duration,
        clearButtton: true,
    });
}

const onMessageShow = (isSuccess: boolean, message: string) => {
    CategoryFormFormMessages({
        message: message,
        variant: isSuccess ? 'success' : 'error',
        duration: 7000
    });
}

  return (
    <div className="table_Inner_Action">
      <Menu
        key="right"
        align="center"
        viewScroll="close"
        direction="right"
        portal={true}
        position="auto"
        offsetX={-25}
        offsetY={0}
        className="menuCss categoryListerAction"
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >

        {selectedItems && selectedItems?.length <= 1 ? (
          <MenuItem onClick={editFormFields}>
            <Restricted moduleId={74}>
              <div className="crx-meu-content groupingMenu  crx-spac"  >
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

        <MenuItem >
          <Restricted moduleId={75}>
            <div className="crx-meu-content  crx-spac" onClick={deleteCategoryForms} >
              <div className="crx-menu-icon">
                <i className="far fa-trash-alt"></i>
              </div>
              <div className="crx-menu-list">
                {t("Delete_Category_Forms")}
              </div>
            </div>
          </Restricted>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default CategoryFormsTemplateActionMenu;
