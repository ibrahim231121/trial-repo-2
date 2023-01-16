import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import { FormFieldsTemplate } from "../TypeConstant/types";
import { useDispatch } from "react-redux";
import { getAllFormFieldsFilter } from "../../../../Redux/FormFields";

type Props = {
  selectedItems?: FormFieldsTemplate[];
  row?: any;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  pageGrid: any;
};

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, onClickOpenModel, pageGrid }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const editFormFields = () => {
    onClickOpenModel(true, Number(row?.id), t("Edit_Form_Fields"));
  };

  const deleteFormFields = () => {
    let formFieldIds: string = row?.id;
    if (selectedItems && selectedItems?.length > 0) {
      formFieldIds = selectedItems?.map(({ id }) => id).join(', ')
    }

    let headers = [{key : 'fieldIds', value : formFieldIds}]
    SetupConfigurationAgent.deleteFormFields(headers).then(() => {
      dispatch(getAllFormFieldsFilter(pageGrid));
    })
      .catch((e: any) => {
        return e;
      })
  }

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
        {selectedItems && selectedItems?.length <= 1 ? (
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
            <div className="crx-meu-content  crx-spac" onClick={deleteFormFields} >
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
