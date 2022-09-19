import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { Alert } from '@material-ui/lab';
import { CRXAlert } from '@cb/shared';
import { useTranslation } from "react-i18next";
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';
import './DialogueForm.css';
import { useSelector } from 'react-redux';
import { findRetentionAndHoldUntill } from '../Utility/UtilityFunctions';
import { DialogueFormProps } from '../Model/DialogueFormModel';

const DialogueForm: React.FC<DialogueFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [saveBtn, setSaveBtn] = React.useState(true);
  const rowLen: number = props.formCollection?.length;
  const alertIcon = <i className='fas fa-info-circle attentionIcon'></i>;
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);

  React.useEffect(() => {
    props.setIndicateTxt(false);
    props.setremoveClassName('CRXDialogForm');
  }, []);

  React.useEffect(() => {
    if (props.evidenceResponse) {
      const newlyAddedCategories = getChangedCategories(props.initialValues, props.evidenceResponse);
      newlyAddedCategories.length > 0 ? setSaveBtn(false) : setSaveBtn(true);
    }
  }, [props.initialValues, props.evidenceResponse]);

  const backBtn = () => {
    props.setActiveForm((prev: number) => prev - 1);
  };

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  const getChangedCategories = (initialValue: any, evidenceResponse: any) => {
    if (evidenceResponse && initialValue.length > 0) {
      const newlyAddedCategories = props.initialValues.filter((o: any) => {
        return !props.evidenceResponse?.categories.some((i: any) => i.name === o.label);
      });
      return newlyAddedCategories;
    }
    return [];
  }

  const submitForm = (values: any[]) => {
    const evidenceId = props.evidenceResponse?.id;
    const Assign_Category_Arr: Category[] = [];
    const Assign_Category_URL = `/Evidences/${evidenceId}/Categories`;
    for (const v of values) {
      const _body: Category = {
        id: v.id,
        formData: [],
        assignedOn: new Date(),
        name: ""
      };
      Assign_Category_Arr.push(_body);
    }

    const retentionPromise = findRetentionAndHoldUntill(Assign_Category_Arr);
    Promise.resolve(retentionPromise).then((retention) => {
      const body: EvdenceCategoryAssignment = {
        unAssignCategories: [],
        assignedCategories: Assign_Category_Arr,
        updateCategories: [],
        retentionId: retention.maxRetentionId ?? null,
      };

      EvidenceAgent.changeCategories(Assign_Category_URL, body).then(() => {
        props.setFilterValue((val: []) => []);
        setSuccess(true);
        setTimeout(() => closeModal(), 3000);
      })
        .catch(() => {
          setError(true);
        });
    });
  }

  return (
    <div className='categoryModal'>
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
        initialValues={getChangedCategories(props.initialValues, props.evidenceResponse)}
        onSubmit={(values, actions) => {
          submitForm(values);
          actions.setSubmitting(false);
        }}>
        <Form>
          <CRXHeading variant='h6' className='categoryNextTitle dailogFormHeading'>
            {t("Category_Title_Placeholder_Here")}
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