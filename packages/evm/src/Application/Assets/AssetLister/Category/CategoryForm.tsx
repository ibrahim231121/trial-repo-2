import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CRXButton } from '@cb/shared';
import { AddToEditFormStateCreator } from '../../../../Redux/CategoryFormSlice';
import DialogueForm from './SubComponents/DialogueForm';
import DisplayCategoryForm from './SubComponents/DisplayCategoryForm';
import { useTranslation } from "react-i18next";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { Category, EvidenceCategory } from '../../../../utils/Api/models/EvidenceModels';
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { CategoryFormProps, FormInitialValues, FormOperationType, SubmitType } from './Model/CategoryFormModel';
import { SearchType } from '../../utils/constants';
import { FieldTypes } from './Model/FieldTypes';
import { applyValidation, CategoryLog, CategoryScenarioCallingFrom, CreateCategoryFormObjectCollection, GetResponseToUpdateAssetBucketCategory, MapSetupCategoryFormToEvidenceCategoryForm, RemapFormFieldKeyName, RevertKeyName } from './Utility/UtilityFunctions';
import { CategoryRemovalType } from './Model/CategoryFormContainerModel';
import { setLoaderValue } from '../../../../Redux/loaderSlice';
import { RootState } from '../../../../Redux/rootReducer';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../ActionMenu/types';
import { updateAssetBucketCategoryField } from '../../../../Redux/AssetActionReducer';
import { FieldsFunctionType } from './Model/DisplayCategoryForm';
import { addMetaDataInfoAsync } from '../../../../Redux/MetaDataInfoDetailReducer';
import { getAllCategoriesFilter } from '../../../../Redux/Categories';
import { PageiGrid } from '../../../../GlobalFunctions/globalDataTableFunctions';

const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [formCollection, setFormCollection] = React.useState<any[]>([]);
  const [error, setError] = React.useState<boolean>(false);
  const [saveBtnDisable, setSaveBtnDisable] = React.useState(true);
  const [initialValuesOfFormForFormik, setInitialValuesOfFormForFormik] = React.useState<any>({});
  const [validationSchema, setValidationSchema] = React.useState<any>();
  const evidence = props.evidence;
  const evidenceId = evidence?.id;
  const saveBtnClass = saveBtnDisable ? 'nextButton-Edit' : 'primeryBtn';
  const isErrorClx = error && 'onErrorcaseClx';
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const categoryFromReducer : any = useSelector((state: any) => state.categoriesSlice.filterCategories);
  const pageiGrid = {
    page: 0,
    size: 1000
  } as PageiGrid;

  const getCategories = React.useCallback(async () => {
    dispatch(getAllCategoriesFilter({
      pageiGrid: pageiGrid,
      search: "deep"
    }));
  }, [dispatch]);

  React.useEffect(() => {
    props.setModalTitle(t('Category_form'));
    props.setIndicateTxt(false);
    props.setshowSSticky(true)
    props.setremoveClassName('crxEditCategoryForm');
    // Untill save button get enabled, form will be in non updated.
    if (saveBtnDisable) props.setIsformUpdated(false);

    const optionalSticky: any = document.getElementsByClassName("optionalSticky")
    if (optionalSticky.length > 0) {
      optionalSticky[0].style.height = "79px"
    } else {
      if (optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px"
      }
    }
  }, []);

  React.useEffect(() => {
    if(categoryFromReducer && Object.keys(categoryFromReducer).length == 0)
       getCategories();
   }, [getCategories]);

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
    if ((newSelectedCategories.length > 0) && (evidence) && (props.selectedItems.length <= 1) && (categoryFromReducer?.data?.length > 0)) {
      props.setIsformUpdated(true);
      const operationTypeAdded = categoryFromReducer.data.filter((o: any) => newSelectedCategories.some((e: any) => e.label === o.name))
        .map((setupCategory: any) => {
          return {
            id: setupCategory.id,
            name: setupCategory.name,
            form: RemapFormFieldKeyName(setupCategory.forms, setupCategory.id),
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
      if (categoryFromReducer?.data?.length > 0) {
        const operationTypeAdded = categoryFromReducer.data.filter((o: any) => newSelectedCategories.some((e: any) => e.label === o.name))
          .map((setupCategory: any) => {
            return {
              id: setupCategory.id,
              name: setupCategory.name,
              form: RemapFormFieldKeyName(setupCategory.forms, setupCategory.id),
              type: FormOperationType.MultiSelectAdd
            };
          });
        categoriesFormCollection.push(...operationTypeAdded);
      }
      if (previousAttachedCategories.length > 0) {
        //NOTE: Update response.
        const categoriesToGetUpdate = selectedCategories.filter((selected) => {
          if (previousAttachedCategories && previousAttachedCategories.length > 0)
            return previousAttachedCategories.some((previous) => previous.name == selected.label);
          return selected;
        });

        if (categoryFromReducer?.data?.length > 0) {
          const operationTypeUpdate = categoryFromReducer.data.filter((o: any) => categoriesToGetUpdate.some((e: any) => e.label === o.name))
            .map((setupCategory: any) => {
              return {
                id: setupCategory.id,
                name: setupCategory.name,
                form: RemapFormFieldKeyName(setupCategory.forms, setupCategory.id),
                type: FormOperationType.MultiSelectUpdate
              };
            });
          categoriesFormCollection.push(...operationTypeUpdate);
        }
      }
    }

    // It means category was attached from the backend
    if ((evidence) && (previousAttachedCategories) && (previousAttachedCategories.length > 0) && (categoryFromReducer?.data?.length > 0)) {
      props.setModalTitle(t('Edit_category'));
      const mappedCategories = MapSetupCategoryFormToEvidenceCategoryForm(categoryFromReducer?.data, evidence.categories);
      let operationTypeAdded = mappedCategories.map((mappedCategory) => {
        return {
          id: mappedCategory.id,
          name: mappedCategory.record?.record.find((x: any) => x.key === 'Name')?.value,
          form: RemapFormFieldKeyName(mappedCategory.formData, mappedCategory.id),
          type: FormOperationType.Update
        };
      });
      categoriesFormCollection.push(...operationTypeAdded);
      setFormCollection(categoriesFormCollection);
    } else {
      setFormCollection(categoriesFormCollection);
    }
  }, [props.selectedCategoryValues, props.isCategoryEmpty, categoryFromReducer?.data]);

  React.useEffect(() => {
    const Initial_Values: Array<FormInitialValues> = [];
    if (formCollection.length > 0) {
      for (const categoryObj of formCollection) {
        if (categoryObj.type !== FormOperationType.MultiSelectDelete) {
          for (const form of categoryObj.form) {
            for (const field of form.fields) {
              Initial_Values.push({
                key: field.key ?? field.name,
                value: field.value ?? '',
                fieldType: field.type as FieldTypes ?? field.dataType as FieldTypes,
                isRequired: field.isRequired
              });
            }
          }
        }
      }     
      const key_value_pair = Initial_Values.reduce((obj: any, item) => ((obj[item.key] = item.value), obj), {});
      setInitialValuesOfFormForFormik(key_value_pair);
      const validation = applyValidation(Initial_Values);
      setValidationSchema(validation);
    }
  }, [formCollection]);

  React.useEffect(() => {
    const isFormExist = formCollection.some((x: any) => x.form.length > 0);
    if ((validationSchema) && (isFormExist)) {
      const isFormValid = validationSchema.isValidSync(initialValuesOfFormForFormik);
      isFormValid ? setSaveBtnDisable(false) : setSaveBtnDisable(true);
    }
  }, [initialValuesOfFormForFormik]);

  React.useEffect(() => {
   
  }, [alert]);

  const UpdateFormFields = React.useCallback(({ name, value }: FieldsFunctionType) => {
    setInitialValuesOfFormForFormik((previous: any) => {
      let args = { ...previous };
      args[name] = value;
      return args;
    });
    (!props.IsformUpdated) && props.setIsformUpdated(true);
  }, []);

  const backBtn = () => props.setActiveForm((prev: number) => prev - 1);

  const closeModalFunc = () => {
    props.setOpenForm();
    props.closeModal(false);
  }

  const submitForm = (submitType: SubmitType) => {
    const categoryFormObjectCollection = CreateCategoryFormObjectCollection(formCollection, (submitType === SubmitType.WithForm), initialValuesOfFormForFormik, CategoryScenarioCallingFrom.AddCategory);
    if (categoryFormObjectCollection.every((e) => e.type === FormOperationType.MultiSelectAdd) && (props.isMultiSelectAssetHaveSameCategory)) {
      categoryFormObjectCollection.forEach((v: any) => delete v.type);
      const body: Array<EvidenceCategory> = [];
      props.setSelectedItems?.([]);
      for (const selectedItem of props.selectedItems) {
        const _evidenceId = selectedItem.evidence.id;
        body.push({
          categories : categoryFormObjectCollection,
          categorizedBy : props.categorizedBy!,
          evidenceId : _evidenceId!
        } as EvidenceCategory);
      }
      EvidenceCategorizationApiCall(body);
    }
    else if ((categoryFormObjectCollection.some((e) => e.type === FormOperationType.Update)) || categoryFormObjectCollection.some((e) => e.type.includes(FormOperationType.MultiSelect))) {
      // NOTE: If FormOperationType is MultiSelect, then find either Asset Retention is decreasing or not, if not then just store values in Redux and redirect form.
      if (!props.isMultiSelectAssetHaveSameCategory)
        props.setRemovalType(CategoryRemovalType.DecreaseAssetRetentionByApplyingCategory);
      // If Asset don't have same categories, then dropdown will be empty, 
      // in that case user has to explicitly apply other category, that could possibly decrease 
      // retention, thats the reason only check either the retention is effected by applying new 
      // category if categories are not same.

      dispatch(AddToEditFormStateCreator(categoryFormObjectCollection));
      props.setActiveForm(5);
    }
    else {
      /**
       * * Remove type key from body.
       * */
      categoryFormObjectCollection.forEach((v: any) => delete v.type);
      const body: Array<EvidenceCategory> = [];
      body.push({
        categories: categoryFormObjectCollection,
        categorizedBy: props.categorizedBy!,
        evidenceId: evidenceId
      } as EvidenceCategory);
      EvidenceCategorizationApiCall(body);
    }
  }

  const isAssetDetailPage: boolean = useSelector((state: RootState) => state.metadatainfoDetailReducer.isAssetDetailPage);

  const EvidenceCategorizationApiCall = (body: Array<EvidenceCategory>) => {
    //NOTE : Creating response to update asset bucket.
    const assetCategories = GetResponseToUpdateAssetBucketCategory(body, categoryFromReducer?.data);
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.assignCategoriesToEvidence(body).then(() => {
      closeModalFunc();
      CategoryLog(dispatch, body, "", "add");
      dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      //NOTE : To update asset bucket data.
      if(isAssetDetailPage){
        dispatch(addMetaDataInfoAsync(body[0]?.evidenceId));
      }
      dispatch(updateAssetBucketCategoryField({
        requestBody: assetCategories,
        assetBucketData: assetBucketData
      } as ObjectToUpdateAssetBucketCategoryField));
      dispatch(setLoaderValue({ isLoading: false }));
      props.toasterMessages({
        message: t("You_have_saved_the_asset_categorization"),
        variant: 'success'
      });
    })
      .catch(() => {
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        setError(true);
        props.toasterMessages({
          message: t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"),
          variant: 'error'
        });
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
      <div className={'indicatestext indicateLessPadding ' + isErrorClx}>
        <b>*</b> {t('Indicates_required_field')}
      </div>
      {(formCollection.length > 0) && (
        formCollection.some((o: any) => o.form.length > 0) ? (
          // If form exist against selected category
          <>
            {((Object.keys(initialValuesOfFormForFormik).length > 0) && validationSchema) &&
              <DisplayCategoryForm
                formCollection={FilterFormCollection(formCollection)}
                initialValueObjects={initialValuesOfFormForFormik}
                validationSchema={validationSchema}
                setFieldsFunction={(e: FieldsFunctionType) => UpdateFormFields(e)}
              />
            }
            <div className='categoryModalFooter CRXFooter'>
              <CRXButton onClick={() => submitForm(SubmitType.WithForm)} disabled={saveBtnDisable} className={saveBtnClass + ' ' + 'editButtonSpace'}>
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
            selectedItems = {props.selectedItems}
            formCollection={formCollection}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: boolean) => props.closeModal(v)}
            setremoveClassName={(v: any) => props.setremoveClassName(v)}
            setModalTitle={(i: string) => props.setModalTitle(i)}
            setSelectedCategoryValues={(v) => props.setSelectedCategoryValues(v)}
            setIndicateTxt={(e: any) => props.setIndicateTxt(e)}
            categorizedBy={props.categorizedBy}
            isCategorizedBy={props.isCategorizedBy}
            toasterMessages={props.toasterMessages}
          />
        )
      )}
    </>
  );
};

export default CategoryForm;