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
import { SetupConfigurationAgent } from "../../../../utils/Api/ApiAgent";
import DeletePrompt from "../CategoryFormsAndFields/DeletePrompt";

type Props = {
  selectedItems?: any;
  row?: any;
  toasterRef : any;
  updateSelectedItems: () => void;
};

const CategoryFormsTemplateActionMenu: React.FC<Props> = ({ selectedItems, row, toasterRef, updateSelectedItems }) => {
  const history = useHistory();
  const { t } = useTranslation<string>();
  const [categoryFormIds, setCategoryFormIds] = React.useState<string>('');
  const [categoryFormNames, setCategoryFormNames] = React.useState<string>('');
  const [openCategoryFormDeleteModal, setOpenCategoryFormDeleteModal] = React.useState(false);
  const editFormFields = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.categoryFormsEdit)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id);
  };

  const deleteCategoryForms = () => {
    let categoryFormsIds: string = "";
    if(row && !selectedItems.includes(row)) {
      categoryFormsIds = row.id
    }
    else if(Array.isArray(selectedItems) && selectedItems.length > 0) {
      categoryFormsIds = selectedItems?.map((item:any) => item.id).join(', ')
      let categoryForms = selectedItems?.map((item:any) => item.name).join(', ')
      setCategoryFormNames(categoryForms);
    }
    setCategoryFormIds(categoryFormsIds);
    setOpenCategoryFormDeleteModal(true);
  }

  React.useEffect(() => {
    setOpenCategoryFormDeleteModal(false);
    setCategoryFormIds('');
    setCategoryFormNames('');
  }, []);

  const DeleteForms = () => {
    let headers = [{ key: 'formsIds', value: categoryFormIds }]
    SetupConfigurationAgent.deleteCategoryForms(headers).then(() => {
      updateSelectedItems();
      onMessageShow(true, t("Category_Form_Deleted_Successfully"));
      setOpenCategoryFormDeleteModal(false);
      setCategoryFormIds('');
      setCategoryFormNames('');
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
    <>
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

        {(row && !selectedItems.includes(row)) || (selectedItems.length <= 1)  ? (
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
    <DeletePrompt
          names={categoryFormIds.split(',').length > 1 ? categoryFormNames : ''}
          formName={categoryFormIds.split(',').length > 1 ? t('Category_forms') :  t('Category_form')}
          openOrCloseModal={openCategoryFormDeleteModal}
          setOpenOrCloseModal={(e) => {
            setOpenCategoryFormDeleteModal(e)
          }
          }
          onConfirmBtnHandler={() => {
            setOpenCategoryFormDeleteModal(false)
            DeleteForms();
          }
          }
          isError={false}
          errorMessage={""}
          confirmationMessage = {t("Are_you_sure_you_would_like_to_delete_category_form")}
        />
    </>
  );
};
export default CategoryFormsTemplateActionMenu;
