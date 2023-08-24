import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { Alert } from '@material-ui/lab';
import { CRXAlert } from '@cb/shared';
import { useTranslation } from "react-i18next";
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';
import './DialogueForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryRequest, DialogueFormProps } from '../Model/DialogueFormModel';
import { getAssetSearchInfoAsync } from '../../../../../Redux/AssetSearchReducer';
import { SearchType } from '../../../utils/constants';
import { RootState } from '../../../../../Redux/rootReducer';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../../ActionMenu/types';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { setLoaderValue } from '../../../../../Redux/loaderSlice';
import { updateAssetBucketCategoryField } from '../../../../../Redux/AssetActionReducer';
import { SelectedCategoryModel } from '../Model/CategoryFormContainerModel';
import { CategoryLog, GetResponseToUpdateAssetBucketCategory } from '../Utility/UtilityFunctions';
import { addMetaDataInfoAsync } from '../../../../../Redux/MetaDataInfoDetailReducer';

const DialogueForm: React.FC<DialogueFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [saveBtn, setSaveBtn] = React.useState(true);
  const [selectedCategoryRequest, setSelectedCategoryRequest] = React.useState<Array<CategoryRequest>>([]);
  const setupCategories = useSelector((state: any) => state.assetCategory.category) as Array<SetupConfigurationsModel.Category>;
  const assetBucketData: AssetBucket[] = useSelector((state: RootState) => state.assetBucket.assetBucketData);
  const rowLen: number = props.formCollection?.length;
  const alertIcon = <i className='fas fa-info-circle attentionIcon'></i>;

  React.useEffect(() => {
    props.setIndicateTxt(false);
    props.setremoveClassName('CRXDialogForm');
  }, []);

  React.useEffect(() => {
    setSelectedCategoryRequest(getSelectedCategory());
  }, [props.evidence, props.selectedItems, props.selectedCategoryValues]);

  React.useEffect(() => {
    (selectedCategoryRequest.length > 0) ? setSaveBtn(false) : setSaveBtn(true);
  }, [selectedCategoryRequest]);

  const backBtn = () => props.setActiveForm((prev: number) => prev - 1);

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  }

  const getSelectedCategory = (): Array<CategoryRequest> => {
    const selectedCategory: Array<CategoryRequest> = [];
    if ((props.evidence) && (props.selectedItems.length === 0))
      selectedCategory.push(...getNewlyAddedCategoriesForEvidence(props.selectedCategoryValues, props.evidence));
    else
      selectedCategory.push(...getNewlyAddedCategoriesForMultipleSelectedItems(props.selectedCategoryValues, props.selectedItems));
    return selectedCategory;
  }

  const getNewlyAddedCategoriesForEvidence = (selectedCategories: any[], evidenceResponse: any): Array<CategoryRequest> => {
    if ((evidenceResponse) && (selectedCategories.length > 0)) {
      const assignedCategories = props.selectedCategoryValues.filter((o: any) => {
        return !props.evidence?.categories.some((i: any) => i.name === o.label);
      });
      const previousCategory = setupCategories.filter(s => props.evidence?.categories.some((i: any) => i.name === s.name))
        .map(o => {
          return {
            id: o.id.toString(),
            label: o.name
          } as SelectedCategoryModel;
        });
      return [{
        assignedCategory: assignedCategories,
        updatedCategory : previousCategory,
        evidenceId: props.evidence?.id!
      } as CategoryRequest];
    }
    return [];
  }

  const getNewlyAddedCategoriesForMultipleSelectedItems = (selectedCategories: any[], selectedItems: any[]): Array<CategoryRequest> => {
    if ((selectedItems.length > 0) && (selectedCategories.length > 0)) {
      const assignedCategories: Array<CategoryRequest> = [];
      for (const selectedItem of props.selectedItems) {
        const _evidence = selectedItem.evidence;
        if (!assignedCategories.some(x => x.evidenceId === _evidence.id)) {
          const _assignedCategories = props.selectedCategoryValues.filter((o: any) => {
            return !_evidence.categories.some((i: any) => i === o.label);
          });
          const previousCategory = setupCategories.filter(s => _evidence.categories.some((i: any) => i === s.name))
          .map(o => {
            return {
              id: o.id.toString(),
              label: o.name
            } as SelectedCategoryModel;
          });
          assignedCategories.push({
            assignedCategory: _assignedCategories,
            updatedCategory : previousCategory,
            evidenceId: _evidence.id
          } as CategoryRequest);
        }
      }
      return assignedCategories;
    }
    return [];
  }

  const isAssetDetailPage: boolean = useSelector((state: RootState) => state.metadatainfoDetailReducer.isAssetDetailPage);

  const EvidenceCategorizationApiCall = (body: Array<EvdenceCategoryAssignment>) => {
    const headers: Array<any> = props.isCategorizedBy ? [{ key: 'isCategorizedBy', value: true }] : [];
    //NOTE : Creating response to update asset bucket.
    const assetCategories = GetResponseToUpdateAssetBucketCategory(body, setupCategories);
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.changeCategories(body, headers).then(() => {
      closeModal();
      props.setSelectedCategoryValues([]);
      CategoryLog(dispatch, body, "", "");
      dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      //NOTE : To update asset bucket data.
      if(isAssetDetailPage)
         dispatch(addMetaDataInfoAsync(body[0]?.evidenceId));
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
        props.toasterMessages({
          message: t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"),
          variant: 'error'
        });
      });
  }

  const submitForm = () => {
    const body: Array<EvdenceCategoryAssignment> = [];
    for (const obj of selectedCategoryRequest) {
      const assignedCategory = obj.assignedCategory.map((assigned) => {
        return {
          id : Number(assigned.id),
          formData : [],
          assignedOn: new Date(),
          name: ""
        } as Category
      });
      const updatedCategory = obj.updatedCategory.map((updated) => {
        return {
          id : Number(updated.id),
          formData : [],
          assignedOn: new Date(),
          name: ""
        } as Category
      });
      body.push({
        unAssignCategories: [],
        assignedCategories: assignedCategory,
        updateCategories: updatedCategory,
        categorizedBy: props.categorizedBy,
        evidenceId: obj.evidenceId
      } as EvdenceCategoryAssignment);
    }
    EvidenceCategorizationApiCall(body);
  }

  return (
    <div className='categoryModal'>
      <Formik
        initialValues={selectedCategoryRequest}
        enableReinitialize={false}
        onSubmit={() => { submitForm() }}>
        <Form>
          <CRXHeading variant='h6' className='categoryNextTitle dailogFormHeading'>
            {props.formCollection.map((field: any, _key: number) => (
              <span key={_key}>
                <b> {field.name}</b>
                {rowLen !== _key + 1 && <span>,</span>}
              </span>
            ))}
          </CRXHeading>
          <Alert className='attentionAlert' severity='info' icon={alertIcon}>
            <b>{t("Attention")}:</b> {t("There_is_no_form_response_for_the_category_named,")}{' '}
            {props.formCollection.map((field: any, _key: any) => (
              <span key={_key}>
                <span className='cateName' key={_key}>
                  '{field.name}'
                </span>
                {rowLen !== _key + 1 && <span>,</span>}
              </span>
            ))}
            . {t("Please_sav_to_continue.")}{' '}
          </Alert>
          <div className='modalFooter nextForm'>
            <div className='nextBtn'>
              <CRXButton type='submit' disabled={saveBtn} className='nextButton' color='primary' variant='contained'>
                {t("Save")}
              </CRXButton>
            </div>
            <div className='cancelBtn'>
              <CRXButton onClick={backBtn} color='secondary' variant='contained' className='cancelButton secondary'>
                {t("Back")}
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default DialogueForm;