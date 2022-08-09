import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';
import './categoryForm.scss';
import ApplicationPermissionContext from '../../../../ApplicationPermission/ApplicationPermissionContext';
import { Visibility } from '@material-ui/icons';
import { filterCategory } from './Utility/UtilityFunctions';
import { useTranslation } from "react-i18next";

type DropdownFormProps = {
  filterValue: any[];
  setremoveClassName: any;
  activeForm: number;
  evidenceResponse: any;
  isCategoryEmpty: boolean;
  setFilterValue: (param: any) => void;
  setOpenForm: () => void;
  closeModal: (param: boolean) => void;
  setActiveForm: (param: any) => void;
  setRemovedOption: (param: any) => void;
  setModalTitle: (param: string) => void;
  setIsformUpdated: (param: boolean) => void;
  setIndicateTxt: (param: boolean) => void;
};

const DropdownForm: React.FC<DropdownFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const {
    getModuleIds
  } = useContext(ApplicationPermissionContext);

  const isCancelable = getModuleIds().includes(4) ? true : false
  React.useEffect(() => {
    const modalTitleProps = props.isCategoryEmpty ? t("Choose_Category") : t("Edit_Category");
    props.setModalTitle(modalTitleProps);
    props.setremoveClassName('crxEditCategoryDropdown');
  });

  React.useEffect(() => {
    props.setFilterValue(() => props.filterValue);
    props.filterValue?.length > 0 ? setButtonState(false) : setButtonState(true);
    // Dropdown is updated, so x button will redirect to cancel confirmation.
    // Check either new value added.
    const changeInValues = props.filterValue.filter((o: any) => {
      return !props.evidenceResponse?.categories.some((i: string) => i === o.value);
    });

    if (changeInValues.length > 0) {
      props.setIsformUpdated(true);
    }
    props.setIndicateTxt(true);
  }, [props.filterValue]);

  const handleChange = (e: any, colIdx: number, v: any, reason: any, detail: any) => {
    props.setFilterValue(() => [...v]);
    if (reason === 'remove-option') {
      // Show "Remove Category Reason" Modal Here.
      // Set value of removed option in to parent state.
      if (isNewlyAddedCategory(detail.option.label)) {
        props.setRemovedOption(detail.option);
        props.setActiveForm((prev: any) => prev + 3);
      } else {
        props.setIsformUpdated(false);
      }
    }
  };

  const isNewlyAddedCategory = (label: string): boolean => {
    let removedValueWasSaved = props.evidenceResponse?.categories.some((x: any) => x.name === label);
    if (removedValueWasSaved) {
      return true;
    }
    return false;
  };

  const onSubmitForm = () => {
    if (props.filterValue?.length !== 0) {
      props.setActiveForm((prev: any) => prev + 1);
    }
  };

  const cancelBtn = () => {
    if (props.filterValue?.length !== 0) {
      props.setActiveForm((prev: any) => prev + 2);
    } else {
      props.setOpenForm();
      props.closeModal(false);
    }
  };

  return (
    <>
    <div className="indicatestext indicateLessPadding"><b>*</b> {t('Indicates_required_field')}</div>
      <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
        {() => (
          <Form>
            <div className='categoryDescription'>{t('From_the_field_below,_select_one_or_more_relevant_category.')}</div>
            <div className='categoryTitle'>
            {t('Category')} <b>*</b>
            </div>
            <div className='crxDrpDownCatergory'>
              <MultiSelectBoxCategory
                className='categortAutocomplete'
                multiple={true}
                CheckBox={true}
                visibility = {isCancelable}
                options={filterCategory(categoryOptions)}
                value={props.filterValue}
                autoComplete={false}
                isSearchable={true}
                onChange={(event: any, newValue: any, reason: any, detail: any) => {
                  return handleChange(event, 1, newValue, reason, detail);
                }}
              />
            </div>
            <div className='modalFooter CRXFooter'>
              <div className='nextBtn'>
                <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
                {t('Next')}
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                {t('Cancel')}
                </CRXButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default DropdownForm;
