import React from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';
import './categoryForm.scss';
import { filterCategory } from './Utility/UtilityFunctions';
import { useTranslation } from "react-i18next";
import { CategoryDropdownFormProps } from './Model/CategoryDropdownFormModel';
import { CRXHeading } from '@cb/shared';

const CategoryDropdownForm: React.FC<CategoryDropdownFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);

  React.useEffect(() => {
    const modalTitleProps = props.isCategoryEmpty ? t("Choose_Category") : t("Edit_category");
    props.setIsformUpdated(false);
    props.setModalTitle(modalTitleProps);
    props.setremoveClassName('crxEditCategoryDropdown');
  }, []);

  React.useEffect(() => {
    props.setSelectedCategoryValues(() => props.selectedCategoryValues);
    props.selectedCategoryValues.length > 0 ? setButtonState(false) : setButtonState(true);
    // Dropdown is updated, so 'x' button will redirect to cancel confirmation.
    // Check either new value added, but that is dependant on 'evidenceResponse'.
    if (props.evidence) {
      const changeInValues = props.selectedCategoryValues.filter((o) => {
        return !props.evidence?.categories.some((i) => i.name === o.label);
      });
      (changeInValues.length > 0) && props.setIsformUpdated(true);
    }
    //NOTE: If MultiSelect case occurs.
    if (!props.evidence && props.selectedItems.length > 1) {
      if (props.isMultiSelectAssetHaveSameCategory) {
        if (IsChangingDropdownCausesUpdate()) {
          props.setIsformUpdated(true);
        }
      }
    }
    props.setIndicateTxt(true);
  }, [props.selectedCategoryValues, props.evidence]);

  const handleChange = (e: any, newValue: any, reason: any, detail: any) => {
    props.setSelectedCategoryValues([
      ...props.fixedOptions,
      ...newValue.filter((option: any) => props.fixedOptions.indexOf(option) === -1)
    ]);
    if (reason === 'remove-option') {
      // Show "Remove Category Reason" Modal Here.
      // Set value of removed option in to parent state.
      if (isNewlyAddedCategory(detail.option.label)) {
        props.setRemovedOption(detail.option);
        props.setActiveForm((prev) => prev + 3);
      } else {
        props.setIsformUpdated(false);
      }
    }
  }

  const isNewlyAddedCategory = (label: string): boolean => {
    if (!props.evidence && props.selectedItems.length > 1) {
      if (props.isMultiSelectAssetHaveSameCategory) {
        if (IsChangingDropdownCausesUpdate(label))
          return true;
      }
    }
    if (props.evidence) {
      let removedValueWasSaved = props.evidence.categories.some((x) => x.name === label);
      if (removedValueWasSaved)
        return true;
    }
    return false;
  }

  const IsChangingDropdownCausesUpdate = (label?: string): Boolean => {
    const isAssetCategoryUpdated: Array<boolean> = [];
    for (const asset of props.selectedItems) {
      if (label) {
        const isValue = asset.evidence.categories.some((i: any) => i === label);
        isAssetCategoryUpdated.push(isValue);
      } else {
        const categoryObject = props.selectedCategoryValues.filter((o) => {
          return asset.evidence.categories.some((i: any) => i.name === o.label);
        });
        isAssetCategoryUpdated.push(categoryObject.length > 0 ? true : false);
      }
    }
    if (isAssetCategoryUpdated.includes(true))
      return true;
    return false;
  }

  const onSubmitForm = () => {
    if (props.selectedCategoryValues.length !== 0) {
      props.setActiveForm((prev) => prev + 1);
    }
  }

  const cancelBtn = () => {
    /**
    * ! Below code is commented behalf of GEP-3886, it might be reverted back.
    */
    // if (props.selectedCategoryValues.length !== 0) {
    //   props.setActiveForm((prev) => prev + 2);
    // } else {
    //   props.setOpenForm();
    //   props.closeModal(false);
    // }
    props.setOpenForm();
    props.closeModal(false);
  }

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
                options={filterCategory(categoryOptions)}
                fixedOptions={props.fixedOptions}
                value={props.selectedCategoryValues}
                autoComplete={false}
                onChange={(event: any, newValue: any, reason: any, detail: any) => handleChange(event, newValue, reason, detail)}
              />
              {(!props.isMultiSelectAssetHaveSameCategory) && (props.selectedItems.length > 1) &&
                <CRXHeading variant="p">
                  {`(${t('Selected_categories_will_replace_all_current_assigned_categories')})`}
                </CRXHeading>}
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

export default CategoryDropdownForm;
