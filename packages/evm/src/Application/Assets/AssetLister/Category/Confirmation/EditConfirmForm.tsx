import React from 'react';
import { CRXButton } from '@cb/shared';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { CRXAlert } from '@cb/shared';
import { findRetentionAndHoldUntill } from '../Utility/UtilityFunctions';
import http from '../../../../../http-common';
import { useTranslation } from "react-i18next";
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';
import { EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { getAssetSearchInfoAsync } from "../../../../../Redux/AssetSearchReducer";


type EditConfirmFormProps = {
  evidenceResponse: any;
  filterValue: any[];
  setremoveClassName: any;
  setOpenForm: () => void;
  closeModal: (param: boolean) => void;
  setIsformUpdated: (param: boolean) => void;
  setModalTitle: (param: string) => void;
  setActiveForm: (param: number) => void;
};

interface FormValues {
  reason: string;
}

const EditConfirmForm: React.FC<EditConfirmFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const CategoryFormFields = useSelector((state: any) => state.CategoryFormFields);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const evidenceId = props.evidenceResponse?.id;
  const initialValues: FormValues = {
    reason: ''
  };
  const [Message, setMessage] = React.useState('');

  React.useEffect(() => {
    props.setModalTitle(t("Editing_the_category_form_requires_a_reason"));
    props.setremoveClassName('crx-remove-category-form');
  }, []);

  React.useEffect(() => {
    if (Message.length === 0) props.setIsformUpdated(false);
    else props.setIsformUpdated(true);
  }, [Message]);


  const submitForm = (message: string) => {
    const url = `/Evidences/${evidenceId}/Categories?editReason=${message}`;
    let assignedCategories = CategoryFormFields.filter((e: any) => e.type === 'add');
    let updateCategories = CategoryFormFields.filter((e: any) => e.type === 'update');

    // Remove type key from body.
    assignedCategories = assignedCategories.map((v: any) => {
      return {
        assignedOn: v.assignedOn,
        formData: v.formData,
        id: v.id
      };
    });

    updateCategories = updateCategories.map((v: any) => {
      return {
        assignedOn: v.assignedOn,
        formData: v.formData,
        id: v.id
      };
    });

    /** 
     * * Find HighestRetentionId & HoldUntill, from newly added categories. 
     * */
    const retentionPromise = findRetentionAndHoldUntill(assignedCategories, categoryOptions, props.filterValue, props.evidenceResponse);
    Promise.resolve(retentionPromise).then((retention: any) => {
      
      const body : EvdenceCategoryAssignment = {
        unAssignCategories: [],
        assignedCategories: assignedCategories,
        updateCategories: updateCategories,
        retentionId: retention !== undefined ? [retention.retentionId] : null,
        holdUntill: retention !== undefined ? retention.expiryDate : null
      };

      EvidenceAgent.changeCategories(url, body).then((response: any) => {
        setSuccess(true);
        setTimeout(() => {
          closeModal();
          dispatch(getAssetSearchInfoAsync(""));
        }, 3000);
      })
      .catch((ex: any) => {
        setError(true);
      })
    })
  };

  const cancelBtn = () => {
    props.setActiveForm(1);
  };

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  return (
    <>
      {success && (
        <CRXAlert
          className='cateoryAlert-Success'
          message={t("Success:_You_have_saved_the_asset_categorization")}
          alertType='toast'
          open={true}
        />
      )}
      {error && (
        <CRXAlert
          className='cateoryAlert-Error errorMessageCategory'
          message={t("Error_We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
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
