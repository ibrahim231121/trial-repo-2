import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXAlert } from '@cb/shared';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';
import { FormValues, SaveConfirmFormProps } from '../Model/SaveConfirmFormModel';
import { getAssetSearchInfoAsync } from '../../../../../Redux/AssetSearchReducer';
import { SearchType } from '../../../utils/constants';
import { CategoryRemovalType } from '../Model/FormContainerModel';
import { setLoaderValue } from '../../../../../Redux/loaderSlice';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { GetResponseToUpdateAssetBucketCategory } from '../Utility/UtilityFunctions';
import { updateAssetBucketCategoryField } from '../../../../../Redux/AssetActionReducer';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../../ActionMenu/types';
import { RootState } from '../../../../../Redux/rootReducer';

const SaveConfirmForm: React.FC<SaveConfirmFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
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
    const body: Array<EvdenceCategoryAssignment> = [];
    const message = props.removeMessage;
    const categoryId = props.removedOption.id;
    //NOTE : MultiSelect case.
    if (!props.evidence && props.selectedItems.length > 1) {
      for (const asset of props.selectedItems) {
        const unAssignCategory: Category = {
          id: categoryId,
          formData: [],
          assignedOn: new Date(),
          name: ""
        };
        body.push({
          unAssignCategories: [unAssignCategory],
          assignedCategories: [],
          updateCategories: [],
          categorizedBy: props.categorizedBy,
          evidenceId: asset.evidence.id
        } as EvdenceCategoryAssignment);
      }
      props.setSelectedItems?.([]);
    }
    //NOTE : Normal case.
    if ((props.evidence) && (props.selectedItems.length <= 1)) {
      const evidenceId = props.evidence.id;
      const unAssignCategory: Category = {
        id: categoryId,
        formData: [],
        assignedOn: new Date(),
        name: ""
      };
      body.push({
        unAssignCategories: [unAssignCategory],
        assignedCategories: [],
        updateCategories: [],
        categorizedBy: props.categorizedBy,
        evidenceId: evidenceId
      } as EvdenceCategoryAssignment);
    }
    EvidenceAgentApiCall(body, message);
  }

  const EvidenceAgentApiCall = (body: Array<EvdenceCategoryAssignment>, message: string) => {
    dispatch(setLoaderValue({ isLoading: true }));
    const headers: Array<any> = props.isCategorizedBy ? [{ key: 'isCategorizedBy', value: true }] : [];
     //NOTE : Creating response to update asset bucket.
     const assetCategories = GetResponseToUpdateAssetBucketCategory(body, categoryOptions);
    EvidenceAgent.changeCategories(body, headers, message).then(() => {
      setSuccess(true);
      setTimeout(() => {
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
        closeModal();
      }, 3000);
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


  return (
    <>
      {success && <CRXAlert message={t("You_have_saved_the_asset_categorization")} alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message={t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
          type='error'
          alertType='inline'
          open={true}
        />
      )}
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
export default SaveConfirmForm;
