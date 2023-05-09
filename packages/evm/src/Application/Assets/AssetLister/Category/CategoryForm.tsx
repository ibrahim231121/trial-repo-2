import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CRXButton, CRXAlert } from '@cb/shared';
import { AddToEditFormStateCreator } from '../../../../Redux/CategoryFormSlice';
import DialogueForm from './SubComponents/DialogueForm';
import DisplayCategoryForm from './SubComponents/DisplayCategoryForm';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { Category, EvdenceCategoryAssignment } from '../../../../utils/Api/models/EvidenceModels';
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { CategoryFormProps, FormInitialValues, FormOperationType, SubmitType } from './Model/CategoryFormModel';
import { SearchType } from '../../utils/constants';
import { FieldTypes } from './Model/FieldTypes';
import { SetupConfigurationsModel } from '../../../../utils/Api/models/SetupConfigurations';
import { applyValidation, GetResponseToUpdateAssetBucketCategory, MapSetupCategoryFormToEvidenceCategoryForm, RemapFormFieldKeyName, RevertKeyName } from './Utility/UtilityFunctions';
import { CategoryRemovalType } from './Model/FormContainerModel';
import { setLoaderValue } from '../../../../Redux/loaderSlice';
import { RootState } from '../../../../Redux/rootReducer';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../ActionMenu/types';
import { updateAssetBucketCategoryField } from '../../../../Redux/AssetActionReducer';

const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [formCollection, setFormCollection] = React.useState<any[]>([]);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [alert] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [saveBtn, setSaveBtn] = React.useState(true);
  const [formFields, setFormFields] = React.useState<any[]>([]);
  const [initialValuesObject, setInitialValuesObject] = React.useState<any>({});
  const [validationSchema, setValidationSchema] = React.useState<any>({});
  const evidence = props.evidence;
  const evidenceId = evidence?.id;
  const setupCategories = useSelector((state: any) => state.assetCategory.category) as Array<SetupConfigurationsModel.Category>;
  const saveBtnClass = saveBtn ? 'nextButton-Edit' : 'primeryBtn';
  const isErrorClx = error && 'onErrorcaseClx';
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  React.useEffect(() => {
    props.setModalTitle(t('Category_form'));
    props.setIndicateTxt(false);
    props.setshowSSticky(true)
    props.setremoveClassName('crxEditCategoryForm');
    // Untill save button get enabled, form will be in non updated.
    if (saveBtn) props.setIsformUpdated(false);
  }, []);

  React.useEffect(() => {
    const selectedCategories = props.selectedCategoryValues;
    const categoriesFormCollection: Array<any> = [];
    // Check how many categories are added recently,
    const previousAttachedCategories = FindPreviouslyAttachedCategories();
    const newSelectedCategories = selectedCategories.filter((x) => {
      if (previousAttachedCategories && previousAttachedCategories.length > 0)
        return !previousAttachedCategories.some((o) => o.name == x.label);
      return x;
    });
    // If user selected addtional categories, then cross icon click should be a update case.
    if ((newSelectedCategories.length > 0) && (evidence) && (props.selectedItems.length <= 1)) {
      props.setIsformUpdated(true);
      const operationTypeAdded = setupCategories.filter((o: any) => newSelectedCategories.some((e: any) => e.label === o.name))
        .map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            form: RemapFormFieldKeyName(i.forms),
            type: FormOperationType.Add
          };
        });
      categoriesFormCollection.push(...operationTypeAdded);
    }

    // It's Multi Select case.
    if (!evidence && props.selectedItems.length > 1) {
      const isEdit = props.selectedItems.some(asset => (asset.evidence.categories) && (asset.evidence.categories.length > 0));
      if (isEdit)
        props.setModalTitle(t('Edit_category'));
      props.setIsformUpdated(true);

      //NOTE: Add response.
      const operationTypeAdded = setupCategories.filter((o: any) => newSelectedCategories.some((e: any) => e.label === o.name))
        .map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            form: RemapFormFieldKeyName(i.forms),
            type: FormOperationType.MultiSelectAdd
          };
        });
      categoriesFormCollection.push(...operationTypeAdded);

      if (previousAttachedCategories.length > 0) {
        //NOTE: Update response.
        const categoriesToGetUpdate = selectedCategories.filter((selected) => {
          if (previousAttachedCategories && previousAttachedCategories.length > 0)
            return previousAttachedCategories.some((previous) => previous.name == selected.label);
          return selected;
        });
        const operationTypeUpdate = setupCategories.filter((o: any) => categoriesToGetUpdate.some((e: any) => e.label === o.name))
          .map((i: any) => {
            return {
              id: i.id,
              name: i.name,
              form: RemapFormFieldKeyName(i.forms),
              type: FormOperationType.MultiSelectUpdate
            };
          });
        categoriesFormCollection.push(...operationTypeUpdate);
      }
    }

    // It means category was attached from the backend
    if ((evidence) && (previousAttachedCategories) && (previousAttachedCategories.length > 0)) {
      props.setModalTitle(t('Edit_category'));
      const mappedCategories = MapSetupCategoryFormToEvidenceCategoryForm(setupCategories, evidence.categories);
      let operationTypeAdded = mappedCategories.map((o) => {
        return {
          id: o.id,
          name: o.record?.record.find((x: any) => x.key === 'Name')?.value,
          form: RemapFormFieldKeyName(o.formData),
          type: FormOperationType.Update
        };
      });
      categoriesFormCollection.push(...operationTypeAdded);
      setFormCollection(categoriesFormCollection);
    } else {
      setFormCollection(categoriesFormCollection);
    }
  }, [props.selectedCategoryValues, props.isCategoryEmpty]);

  React.useEffect(() => {
    let Initial_Values: Array<FormInitialValues> = [];
    if (formCollection.length > 0) {
      for (const categoryObj of formCollection) {
        if (categoryObj.type !== FormOperationType.MultiSelectDelete) {
          for (const form of categoryObj.form) {
            for (const field of form.fields) {
              Initial_Values.push({
                key: field.key === undefined ? field.name : field.key,
                value: field.value === undefined ? '' : field.value,
                fieldType: field.type === undefined ? field.dataType as FieldTypes : field.type as FieldTypes
              });
            }
          }
        }
      }
      let key_value_pair = Initial_Values.reduce((obj: any, item) => ((obj[item.key] = item.value), obj), {});
      setInitialValuesObject(key_value_pair);
      const initial_values_of_fields = Object.entries(key_value_pair).map((o: any) => {
        return {
          key: o[0],
          value: o[1]
        };
      });
      setFormFields(initial_values_of_fields);
      const validation = applyValidation(Initial_Values);
      setValidationSchema(validation);
    }
  }, [formCollection]);

  React.useEffect(() => {
    if (formFields.length > 0) {
      // NOTE : Submit Button Disable State, on the basis of Form Input.
      const isFormValidated: boolean = formFields.some((ele: any) => (ele.value.length === 0 || ele.value.length > 1024));
      if (!isFormValidated)
        setSaveBtn(false);
      else
        setSaveBtn(true);
    }
  }, [formFields]);

  React.useEffect(() => {
    const optionalSticky: any = document.getElementsByClassName("optionalSticky")
    if (optionalSticky.length > 0) {
      optionalSticky[0].style.height = "79px"
    } else {
      if (optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px"
      }
    }
  }, [alert]);

  const setFieldsFunction = (e: any) => {
    const { name, value } = e;
    setInitialValuesObject((args: any) => {
      args[name] = value;
      return args;
    });
    let excludedKeyValue = formFields.filter((o: any) => {
      return o.key !== name;
    });
    setFormFields(() => [...excludedKeyValue, { key: name, value: value }]);
    props.setIsformUpdated(true);
  }

  const backBtn = () => props.setActiveForm((prev: number) => prev - 1);

  const closeModalFunc = () => {
    props.setOpenForm();
    props.closeModal(false);
  }

  const submitForm = (submitType: SubmitType) => {
    //create object to pass in patch request.
    const categoryBodyArr: any[] = [];
    for (const obj of formCollection) {
      const categoryId = obj.id;
      const categoryFormDataArr: any[] = [];
      if (submitType === SubmitType.WithForm) {
        for (const form of obj.form) {
          const fieldsArray = [];
          for (const field of form.fields) {
            let value: any;
            if (field.hasOwnProperty('key')) {
              value = formFields.filter((x: any) => x.key == field.key).map((i: any) => i.value)[0];
            } else {
              value = formFields.filter((x: any) => x.key == field.name).map((i: any) => i.value)[0];
            }

            const _field = {
              key: RevertKeyName(field.key === undefined ? field.name : field.key),
              value: value,
              dataType: field.type === undefined ? field.dataType : field.type,
              defaultFieldValue: field.defaultFieldValue
            };
            fieldsArray.push(_field);
          }

          const _categoryFormbody = {
            formId: form.formId !== undefined ? form.formId : form.id,
            fields: fieldsArray
          };
          categoryFormDataArr.push(_categoryFormbody);
        }
      }
      const _categoryBody = {
        id: categoryId,
        formData: categoryFormDataArr,
        assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss'),
        type: obj.type
      };
      categoryBodyArr.push(_categoryBody);
    }

    if(categoryBodyArr.every((e) => e.type === FormOperationType.MultiSelectAdd) && (props.isMultiSelectAssetHaveSameCategory)){
        categoryBodyArr.forEach((v: any) => {
          delete v.type;
        });
        const body: Array<EvdenceCategoryAssignment> = [];
        props.setSelectedItems?.([]);
        for (const selectedItem of props.selectedItems) {
          const _evidenceId = selectedItem.evidence.id;
          body.push({
            unAssignCategories: [],
            assignedCategories: categoryBodyArr,
            updateCategories: [],
            categorizedBy: props.categorizedBy,
            evidenceId: _evidenceId!
          } as EvdenceCategoryAssignment);
        }
        EvidenceCategorizationApiCall(body);
    }
    else if ((categoryBodyArr.some((e) => e.type === FormOperationType.Update)) || categoryBodyArr.some((e) => e.type.includes(FormOperationType.MultiSelect))) {
      // NOTE: If FormOperationType is MultiSelect, then find either Asset Retention is decreasing or not, if not then just store values in Redux and redirect form.
      if (!props.isMultiSelectAssetHaveSameCategory)
        props.setRemovalType(CategoryRemovalType.DecreaseAssetRetentionByApplyingCategory);
      // If Asset don't have same categories, then dropdown will be empty, 
      // in that case user has to explicitly apply other category, that could possibly decrease 
      // retention, thats the reason only check either the retention is effected by applying new 
      // category if categories are not same.

      dispatch(AddToEditFormStateCreator(categoryBodyArr));
      props.setActiveForm(5);
    }
    else {
      /**
       * * Remove type key from body.
       * */
      categoryBodyArr.forEach((v: any) => {
        delete v.type;
      });
      const body: Array<EvdenceCategoryAssignment> = [];
      body.push({
        unAssignCategories: [],
        assignedCategories: categoryBodyArr,
        updateCategories: [],
        categorizedBy: props.categorizedBy,
        evidenceId: evidenceId
      } as EvdenceCategoryAssignment);
      EvidenceCategorizationApiCall(body);
    }
  }

  const EvidenceCategorizationApiCall = (body: Array<EvdenceCategoryAssignment>) => {
    const headers: Array<any> = props.isCategorizedBy ? [{ key: 'isCategorizedBy', value: true }] : [];
    //NOTE : Creating response to update asset bucket.
    const assetCategories = GetResponseToUpdateAssetBucketCategory(body, setupCategories);
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.changeCategories(body, headers).then(() => {
      setSuccess(true);
      setTimeout(() => {
        closeModalFunc();
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      }, 2000);
      //NOTE : To update asset bucket data.
      dispatch(updateAssetBucketCategoryField({
        requestBody: assetCategories,
        assetBucketData: assetBucketData
      } as ObjectToUpdateAssetBucketCategoryField));
      dispatch(setLoaderValue({ isLoading: false }));
    })
      .catch(() => {
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        setError(true);
      });
  }

  const FindPreviouslyAttachedCategories = (): Category[] => {
    //NOTE : Single Selection Case.
    if ((evidence) && (props.selectedItems.length <= 1)) {
      return evidence?.categories;
    }
    //NOTE: Multi Selection Case.
    if ((!evidence) && (props.selectedItems.length > 1)) {
      const evidenceCategories: Category[] = [];
      // Taking 0 index, because, dropdown only be filled if all Selected Items have same Category.
      for (const category of props.selectedItems[0].evidence.categories) {
        evidenceCategories.push({
          id: 0,
          name: category,
          formData: [],
          assignedOn: new Date()
        } as Category);
      }
      return evidenceCategories;
    }
    return [];
  }

  const FilterFormCollection = (formCollection: any[]) => formCollection.filter((form: any) => form.type !== FormOperationType.MultiSelectDelete);
  return (
    <>
      {success && <CRXAlert message={t("You_have_saved_the_asset_categorization")} alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          className='errorMessageCategory'
          message={t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
          type='error'
          alertType='inline'
          open={true}
        />
      )}
      <div className={'indicatestext indicateLessPadding ' + isErrorClx}>
        <b>*</b> {t('Indicates_required_field')}
      </div>
      {formCollection.length > 0 && (
        formCollection.some((o: any) => o.form.length > 0) ? (
          // If form exist against selected category
          <>
            <DisplayCategoryForm
              formCollection={FilterFormCollection(formCollection)}
              initialValueObjects={initialValuesObject}
              validationSchema={validationSchema}
              setFieldsFunction={(e: any) => setFieldsFunction(e)}
            />
            <div className='categoryModalFooter CRXFooter'>
              <CRXButton onClick={() => submitForm(SubmitType.WithForm)} disabled={saveBtn} className={saveBtnClass + ' ' + 'editButtonSpace'}>
                {' '}
                {props.isCategoryEmpty === false ? t("Next") : t("Save")}
              </CRXButton>
              <CRXButton className='cancelButton secondary' color='secondary' variant='contained' onClick={backBtn}>
                {t("Back")}
              </CRXButton>
              <CRXButton className='skipButton secondary' onClick={() => submitForm(SubmitType.WithoutForm)}>
                {t("Skip_category_form_and_save")}
              </CRXButton>
            </div>
          </>
        ) : (
          // Show dialogue Functionality
          <DialogueForm
            key={"dialogue_form"}
            setActiveForm={props.setActiveForm}
            selectedCategoryValues={props.selectedCategoryValues}
            evidence={evidence}
            formCollection={formCollection}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: boolean) => props.closeModal(v)}
            setremoveClassName={(v: any) => props.setremoveClassName(v)}
            setModalTitle={(i: string) => props.setModalTitle(i)}
            setSelectedCategoryValues={(v) => props.setSelectedCategoryValues(v)}
            setIndicateTxt={(e: any) => props.setIndicateTxt(e)}
            categorizedBy={props.categorizedBy}
            isCategorizedBy={props.isCategorizedBy}
          />
        )
      )}
    </>
  );
};

export default CategoryForm;