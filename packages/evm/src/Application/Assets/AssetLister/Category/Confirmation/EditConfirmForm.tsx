import React from 'react';
import { CRXButton } from '@cb/shared';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { CRXAlert } from '@cb/shared';
import { useTranslation } from "react-i18next";
import { EvidenceAgent, SetupConfigurationAgent } from '../../../../../utils/Api/ApiAgent';
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { getAssetSearchInfoAsync } from "../../../../../Redux/AssetSearchReducer";
import { EditConfirmFormProps, FormValues } from '../Model/EditConfirmFormModel';
import { SearchType } from '../../../utils/constants';
import { CategoryRemovalType } from '../Model/FormContainerModel';
import { FormOperationType } from '../Model/CategoryFormModel';
import _ from 'lodash';
import moment from 'moment';
import { RetentionDateTimeFormatter } from '../../../../../GlobalFunctions/AssetRetentionFormat';
import { setLoaderValue } from '../../../../../Redux/loaderSlice';
import { SetupConfigurationsModel } from '../../../../../utils/Api/models/SetupConfigurations';
import { AssetBucket, ObjectToUpdateAssetBucketCategoryField } from '../../ActionMenu/types';
import { updateAssetBucketCategoryField } from '../../../../../Redux/AssetActionReducer';
import { RootState } from '../../../../../Redux/rootReducer';
import { CalculateCategoryRetentionDetail, GetResponseToUpdateAssetBucketCategory } from '../Utility/UtilityFunctions';

const EditConfirmForm: React.FC<EditConfirmFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const CategoryFormFields = useSelector((state: any) => state.CategoryFormFields);
  const evidenceId = props.evidence?.id;
  const initialValues: FormValues = {
    reason: ''
  };
  const [Message, setMessage] = React.useState('');
  const [WarningMessage, setWarningMessage] = React.useState<string>('');
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const setupCategories = useSelector((state: any) => state.assetCategory.category) as Array<SetupConfigurationsModel.Category>;
  const assetBucketData: AssetBucket[] = useSelector((state: RootState) => state.assetBucket.assetBucketData);
  React.useEffect(() => {
    props.setModalTitle(t("Editing_the_category_form_requires_a_reason"));
    props.setremoveClassName('crx-remove-category-form');
  }, []);

  React.useEffect(() => {
    if (Message.length === 0) props.setIsformUpdated(false);
    else props.setIsformUpdated(true);
  }, [Message]);


  React.useEffect(() => {
    if (props.removalType === CategoryRemovalType.DecreaseAssetRetentionByApplyingCategory)
      GetRetentionPoliciesObject();
  }, [props.removalType]);

  const submitForm = (message: string) => {
    const body: Array<EvdenceCategoryAssignment> = [];
    // NOTE: Handling Multi select submit case.
    let multiSelectCategories = CategoryFormFields.filter((e: any) => e.type.includes(FormOperationType.MultiSelect));
    if (multiSelectCategories && multiSelectCategories.length > 0) {
      //NOTE: Remove key from Category response.
      multiSelectCategories = multiSelectCategories.map((v: any) => {
        return {
          assignedOn: v.assignedOn,
          formData: v.formData,
          id: v.id
        };
      });
      if (props.removalType === CategoryRemovalType.DecreaseAssetRetentionByApplyingCategory) {
        // Create Assign and Unassigned request.
        for (const selectedItem of props.selectedItems) {
          const unAssignedCategories: Array<Category> = [];
          const categories = selectedItem.evidence.categories;
          const _evidenceId = selectedItem.evidence.id;
          for (const category of categories) {
            let categoryId = categoryOptions.find((o: any) => o.name === category).id;
            unAssignedCategories.push({
              id: categoryId,
              formData: [],
              assignedOn: new Date(),
              name: ""
            } as Category);
          }
          body.push({
            unAssignCategories: unAssignedCategories,
            assignedCategories: multiSelectCategories,
            updateCategories: [],
            categorizedBy: props.categorizedBy,
            evidenceId: _evidenceId!
          } as EvdenceCategoryAssignment);
        }
      }
      else {
        for (const selectedItem of props.selectedItems) {
          const _evidenceId = selectedItem.evidence.id;
          const multiSelectCategoriesAdd = CategoryFormFields.filter((e: any) => e.type === FormOperationType.MultiSelectAdd).map((v: any) => {
            return {
              assignedOn: v.assignedOn,
              formData: v.formData,
              id: v.id
            };
          });
          const multiSelectCategoriesUpdate = CategoryFormFields.filter((e: any) => e.type === FormOperationType.MultiSelectUpdate).map((v: any) => {
            return {
              assignedOn: v.assignedOn,
              formData: v.formData,
              id: v.id
            };
          });
          body.push({
            unAssignCategories: [],
            assignedCategories: multiSelectCategoriesAdd,
            updateCategories: multiSelectCategoriesUpdate,
            categorizedBy: props.categorizedBy,
            evidenceId: _evidenceId!
          } as EvdenceCategoryAssignment);
        }
      }
      props.setSelectedItems?.([]); 
    } else {
      // Remove type key from body.
      const assignedCategories = CategoryFormFields.filter((e: any) => e.type === FormOperationType.Add).map((v: any) => {
        return {
          assignedOn: v.assignedOn,
          formData: v.formData,
          id: v.id
        };
      });
      const updateCategories = CategoryFormFields.filter((e: any) => e.type === FormOperationType.Update).map((v: any) => {
        return {
          assignedOn: v.assignedOn,
          formData: v.formData,
          id: v.id
        };
      });
      body.push({
        unAssignCategories: [],
        assignedCategories: assignedCategories,
        updateCategories: updateCategories,
        categorizedBy: props.categorizedBy,
        evidenceId: evidenceId!
      } as EvdenceCategoryAssignment);
    }
    EvidenceAgentApiCall(body, message);
  }

  const EvidenceAgentApiCall = (body: Array<EvdenceCategoryAssignment>, message: string) => {
    const headers: Array<any> = props.isCategorizedBy ? [{ key: 'isCategorizedBy', value: true }] : [];
    //NOTE : Creating response to update asset bucket.
    const assetCategories = GetResponseToUpdateAssetBucketCategory(body, setupCategories);
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.changeCategories(body, headers, message).then(() => {
      setSuccess(true);
      setTimeout(() => {
        closeModal();
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      }, 3000);
      //NOTE : To update asset bucket data.
      dispatch(updateAssetBucketCategoryField({
        requestBody: assetCategories,
        assetBucketData: assetBucketData
      } as ObjectToUpdateAssetBucketCategoryField));
      dispatch(setLoaderValue({ isLoading: false }));
    })
      .catch((ex: any) => {
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        setError(true);
      });
  }

  const cancelBtn = () => props.setActiveForm(1);

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  }

  const GetRetentionPoliciesObject = () => {
    const selectedCategoriesObject = categoryOptions.filter((o: any) => props.selectedCategoryValues.some((i) => i.label === o.name));
    const categoryRetentionDetail = CalculateCategoryRetentionDetail(selectedCategoriesObject);
    let retentionDetails = categoryRetentionDetail.retentionDetails;
    const retentionList = categoryRetentionDetail.retentionList
    dispatch(setLoaderValue({ isLoading: true }));
    SetupConfigurationAgent.getRetentionPolicyObjectFromRetentionIds(retentionList)
      .then((dataRetentionPromisesResponse) => {
        const EffectedAssets = [];
        const messageArr = [];
        for (const retention of retentionDetails) {
          const dataRetentionObject = dataRetentionPromisesResponse.find(x => x.id == retention.retentionId);
          const totalHours = dataRetentionObject.detail.limit.hours + dataRetentionObject.detail.limit.gracePeriodInHours;
          retention.hours = totalHours;
        }
        retentionDetails = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
        for (const selectedAsset of props.selectedItems) {
          const expiryDate = moment(selectedAsset.evidence.holdUntil ?? selectedAsset.evidence.expireOn);
          const newExpiryDate = moment().add('hours', retentionDetails[0].hours);
          if (!newExpiryDate.isAfter(expiryDate)) {
            //Show messaage, cause Retention will get effected,
            const assetName = selectedAsset.evidence.asset.find((x: any) => x.assetId == selectedAsset.assetId).assetName;
            EffectedAssets.push({
              assetName: assetName,
              difference: RetentionDateTimeFormatter(moment(), newExpiryDate)
            });
          }
        }
        if (EffectedAssets.length > 0) {
          for (const eff of EffectedAssets) {
            const message = `${eff.assetName} will Expire in ${eff.difference}`
            messageArr.push(message + '\n');
          }
          setWarningMessage(`${t("Please_be_aware_that_by_modifying_the_categories_you_are_reducing_the_assets_lifetime")} ${'\n'} ${messageArr.join()}`)
        }
        dispatch(setLoaderValue({ isLoading: false }));
      })
      .catch(() => {
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        setError(true);
      });
  }
  return (
    <>
      {success && (
        <CRXAlert
          className='cateoryAlert-Success'
          message={t("You_have_saved_the_asset_categorization")}
          alertType='toast'
          open={true}
        />
      )}
      {error && (
        <CRXAlert
          className='cateoryAlert-Error errorMessageCategory'
          message={t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
          type='error'
          alertType='inline'
          open={true}
        />
      )}
      <div className='indicatestext indicateLessPadding'>
        <b>*</b> {t("Indicates_required_field")}
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={({ reason }: any, actions) => {
          submitForm(reason);
          actions.setSubmitting(false);
        }}
        validationSchema={Yup.object({
          reason: Yup.string().required('Required')
        })}>
        {({ handleChange, isValid, dirty }) => (
          <Form>
            {(props.removalType === CategoryRemovalType.DecreaseAssetRetentionByApplyingCategory) && (WarningMessage.length > 0) && (
              <CRXAlert message={WarningMessage} className='crx-warning' type='warning' alertType='inline' open={true} />
            )}
            <div className='categoryDescription'>{t("Please_enter_the_reason_for_editing_the_form.")}</div>
            <div className='CRXCategory categoryTitle'>
              {t("Category_form_edit_reason")} <b className='formStaric'>*</b>
            </div>
            <Field
              id='reaon'
              name='reason'
              as='textarea'
              onChange={(event: any) => {
                handleChange(event);
                setMessage(event.target.value);
              }}
            />
            <ErrorMessage name='reason' render={(msg) => <div className='errorStyle'>{msg}</div>} />
            <div className='modalFooter CRXFooter'>
              <div className='nextBtn'>
                <CRXButton
                  type='submit'
                  disabled={!(isValid && dirty)}
                  className={!(isValid && dirty) ? 'primeryBtnDisable' : 'primeryBtn boxshNone'}
                  color='primary'
                  variant='contained'>
                  {t("Save")}
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} color='secondary' variant='contained' className='cancelButton secondary'>
                  {t("Cancel")}
                </CRXButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default EditConfirmForm;
