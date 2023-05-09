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
import { useHistory } from "react-router-dom";

type Props = {
  selectedItems?: FormFieldsTemplate[];
  row?: any;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  pageGrid: any;
  toasterRef: any;
};

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, onClickOpenModel, pageGrid, toasterRef }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const history = useHistory();
  const editFormFields = () => {
    onClickOpenModel(true, Number(row?.id), t("Edit_Form_Fields"));
  };

  const FormFieldFormMessages = (obj: any) => {
    toasterRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  };

  const onMessageShow = (isSuccess: boolean, message: string) => {
    FormFieldFormMessages({
      message: message,
      variant: isSuccess ? "success" : "error",
      duration: 7000,
    });
  };

  const deleteFormFields = () => {
    let formFieldIds: string = row?.id;
    if (selectedItems && selectedItems?.length > 0) {
      formFieldIds = selectedItems?.map(({ id }) => id).join(', ')
    }

    let headers = [{key : 'fieldIds', value : formFieldIds}]
    SetupConfigurationAgent.deleteFormFields(headers).then(() => {
      dispatch(getAllFormFieldsFilter(pageGrid));
      onMessageShow(true, t("Form_Field_Deleted_Successfully"));
    })
      .catch((e: any) => {
        onMessageShow(false, e?.response?.data);
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
        className="menuCss formFieldListerAction"
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >
        {selectedItems && selectedItems?.length <= 1 ? (
          <MenuItem onClick={editFormFields}>
            <Restricted moduleId={74}>
              <div className="crx-meu-content groupingMenu crx-spac"  >
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
          <Restricted moduleId={75}>
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
