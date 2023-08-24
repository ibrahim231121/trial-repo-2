import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXAlert } from '@cb/shared';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { Category, EvidenceCategory } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';
import { FormValues, RemoveCategoryConfirmFormProps } from '../Model/RemoveCategoryConfirmFormProps';
import { getAssetSearchInfoAsync } from '../../../../../Redux/AssetSearchReducer';
import { SearchType } from '../../../utils/constants';
import { CategoryRemovalType } from '../Model/CategoryFormContainerModel';
import { setLoaderValue } from '../../../../../Redux/loaderSlice';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { GetPreviouslyAttachedCategories, GetResponseToUpdateAssetBucketCategory, CategoryLog } from '../Utility/UtilityFunctions';
import { updateAssetBucketCategoryField } from '../../../../../Redux/AssetActionReducer';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../../ActionMenu/types';
import { RootState } from '../../../../../Redux/rootReducer';
import { addMetaDataInfoAsync } from '../../../../../Redux/MetaDataInfoDetailReducer';


const RemoveCategoryConfirmForm: React.FC<RemoveCategoryConfirmFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [WarningMessage, setWarningMessage] = React.useState<string>('');
  const initialValues: FormValues = {};
  const categoryOptions = useSelector((state: any) => state.assetCategory.category) as Array<SetupConfigurationsModel.Category>;
  const assetBucketData: AssetBucket[] = useSelector((state: RootState) => state.assetBucket.assetBucketData);
  const dispatch = useDispatch();

  React.useEffect(() => {
    props.setModalTitle(t("Please_confirm"));
    props.setIndicateTxt(false);
    props.setremoveClassName('crx-remove-category-form crxPleaseConfirmForm');
  }, []);

  React.useEffect(() => {
    if (props.removalType === CategoryRemovalType.HighestRetentionCategoryRemoval) {
      setWarningMessage(`${t("Please_be_aware_that_by_removing_this_category,_you_are_reducing_the_assets_lifetime_and_the_asset_will_expire_in")} ${props.differenceOfRetentionTime}.`);
    } else if (props.removalType === CategoryRemovalType.LastCategoryRemoval) {
      setWarningMessage(`${t("Please_be_aware_that_by_removing_this_category,_you_are_reducing_the_assets_lifetime_and_the_asset_will_expire_in")}
        ${props.differenceOfRetentionTime}.  ${t("Uncategorized_retention_policy_of_station_will_be_applied_on_this_evidence_group.")}`);
    } else if (props.removalType === CategoryRemovalType.HighestRetentionCategoryRemovalInMultiSelect) {
      setWarningMessage(`${props.differenceOfRetentionTime}.`);
    }
  }, [props.removalType]);

  const cancelBtn = () => {
    const newValue = categoryOptions
      .filter((o: any) => o.id === props.removedOption.id)
      .map((i: any) => {
        return {
          id: i.id,
          label: i.name
        };
      })[0];
    if (newValue) {
      /** Set removed option in to State again. */
      props.setSelectedCategoryValues((prevState) => [...prevState, newValue]);
      props.setRemovedOption({});
    }
    props.setActiveForm(0);
  }

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  }

  const deleteRequest = () => {
    const previouslyAttachedCategories : Array<string> = [];
    const body: Array<EvidenceCategory> = [];
    const message = props.removeMessage;
    const categoryId = props.removedOption.id;
    const unAssignCategory : Category = {
      id: categoryId,
      formData: [],
      assignedOn: new Date(),
      name: ""
    };
    //NOTE : MultiSelect case.
    if (!props.evidence && props.selectedItems.length > 1) {
      let iteration = false;
      for (const asset of props.selectedItems) {
        body.push({
          evidenceId: Number(asset.evidence.id),
          categories : [unAssignCategory]
        } as EvidenceCategory);
        // NOTE: Since In Multiple selection case, the categories will be same of multiple evidences, so we can identify the previosly attached categories.
        // By that understanding we only need to find previously attached categories of first evidence.
        if(!iteration){
          const result = GetPreviouslyAttachedCategories(asset, unAssignCategory, categoryOptions, false);
          previouslyAttachedCategories.push(...result);
          iteration = true;
        }
      }
      props.setSelectedItems?.([]);
    }
    //NOTE : Normal case.
    if ((props.evidence) && (props.selectedItems.length <= 1)) {
      const evidenceId = props.evidence.id;
      body.push({
        evidenceId: Number(evidenceId),
        categories : [unAssignCategory]
      } as EvidenceCategory);
      const result = GetPreviouslyAttachedCategories(props.evidence, unAssignCategory, categoryOptions, true);
      previouslyAttachedCategories.push(...result);
    }
    EvidenceAgentApiCall(body, message, previouslyAttachedCategories);
  }

  const isAssetDetailPage: boolean = useSelector((state: RootState) => state.metadatainfoDetailReducer.isAssetDetailPage);

  const EvidenceAgentApiCall = (body : Array<EvidenceCategory>, message: string, previouslyAttachedCategories: Array<string>) => {
    dispatch(setLoaderValue({ isLoading: true }));
     //NOTE : Creating response to update asset bucket.
    const assetCategories = GetResponseToUpdateAssetBucketCategory(body, categoryOptions, previouslyAttachedCategories);
    EvidenceAgent.unAssignCategoryFromEvidence(body, message).then(() => {
      closeModal();
      dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      CategoryLog(dispatch, body, message,"remove");
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

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          deleteRequest();
        }}>
        <Form className='crx-category-remove-form'>
          {props.removalType !== CategoryRemovalType.NotEffectingRetentionRemoval && (
            <CRXAlert message={WarningMessage} className='crx-warning' type='warning' alertType='inline' open={true} />
          )}
          <div className='CRXCategory crx-category-attempting'>
            {t("You_are_attempting_to_remove")} '<b>{props.removedOption.label}</b>' {t("category")}.
          </div>
          <div className='CRXCategory crx-continue-category'>{t("Do_you_want_you_continue_with_removing_the_category?")}</div>
          <div className='modalFooter CRXFooter removeFooter removeCategoryFooter'>
            <div className='nextBtn'>
              <CRXButton className='primeryBtn' type='submit'>
                {t("Yes,_remove-category")}
              </CRXButton>
            </div>
            <div className='cancelBtn'>
              <CRXButton color='secondary' variant='contained' className='cancelButton secondary' onClick={cancelBtn}>
                {t("No,_do_not_remove_category")}
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};
export default RemoveCategoryConfirmForm;
