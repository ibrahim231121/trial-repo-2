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
import DeletePrompt from "../CategoryFormsAndFields/DeletePrompt";

type Props = {
  selectedItems?: any;
  row?: any;
  onClickOpenModel: (modelOpen: boolean, id: number, title: string) => void;
  updateSelectedItems: () => void;
  toasterRef: any;
};

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, onClickOpenModel, updateSelectedItems, toasterRef }) => {
  const { t } = useTranslation<string>();
  const [formFieldIds, setFormFieldIds] = React.useState<string>('');
  const [formFieldNames, setFormFieldNames] = React.useState<string>('');
  const [openFormFieldDeleteModal, setOpenFormFieldDeleteModal] = React.useState(false);
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
    let formFieldsIds: string = "";
    if(row && !selectedItems.includes(row)) {
      formFieldsIds = row.id
    }
    else if(Array.isArray(selectedItems) && selectedItems.length > 0) {
      formFieldsIds = selectedItems?.map((item:any) => item.id).join(', ');
      let formFields = selectedItems?.map((item:any) => item.name).join(', ');
      setFormFieldNames(formFields);
    }
    setFormFieldIds(formFieldsIds);
    setOpenFormFieldDeleteModal(true);
  }

  React.useEffect(() => {
    setFormFieldNames('');
      setFormFieldIds('');
      setOpenFormFieldDeleteModal(false);
  }, []);

  const DeleteFormFields = () => {
    let headers = [{key : 'fieldIds', value : formFieldIds}]
    SetupConfigurationAgent.deleteFormFields(headers).then(() => {
      updateSelectedItems();
      onMessageShow(true, t("Form_Field_Deleted_Successfully"));
      setFormFieldNames('');
      setFormFieldIds('');
      setOpenFormFieldDeleteModal(false);
    })
      .catch((e: any) => {
        onMessageShow(false, e?.response?.data);
        return e;
    })
  }

  return (
    <>
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
          {(row && !selectedItems.includes(row)) || (selectedItems.length <= 1) ? (
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
      <DeletePrompt
        names={formFieldIds.split(',').length > 1 ? formFieldNames : ''}
        formName={formFieldIds.split(',').length > 1 ? t('Form_Fields') : t('Form_Field')}
        openOrCloseModal={openFormFieldDeleteModal}
        setOpenOrCloseModal={(e) => {
          setOpenFormFieldDeleteModal(e)
        }
        }
        onConfirmBtnHandler={() => {
          setOpenFormFieldDeleteModal(false)
          DeleteFormFields();
        }
        }
        isError={false}
        errorMessage={""}
        confirmationMessage={t("Are_you_sure_you_would_like_to_delete_form_fields")}
      />
    </>
  );
};
export default CategoryFormsTemplateActionMenu;
