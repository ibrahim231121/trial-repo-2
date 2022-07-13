import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { Alert } from '@material-ui/lab';
import { CRXAlert } from '@cb/shared';
import moment from 'moment';
import http from '../../../../../http-common';
import { useTranslation } from "react-i18next";
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';

type DialogueFormProps = {
  setremoveClassName: any;
  formCollection: any;
  evidenceResponse : any;
  initialValues: any;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setModalTitle: (param: string) => void;
  setIndicateTxt: (param: boolean) => void;
};

const DialogueForm: React.FC<DialogueFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const rowLen: number = props.formCollection?.length;
  const alertIcon = <i className='fas fa-info-circle attentionIcon'></i>;

  React.useEffect(() => {
    props.setIndicateTxt(false);
    props.setremoveClassName('CRXDialogForm');
  }, []);

  const backBtn = () => {
    props.setActiveForm((prev: number) => prev - 1);
  };

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  const submitForm = (values: any[]) => {
    const evidenceId = props.evidenceResponse?.id;
    const Assign_Category_Arr: Category[] = [];
    const Assign_Category_URL = `/Evidences/${evidenceId}/Categories`;
    for (const v of values) {
      const _body : Category = {
        id: v.id,
        formData: [],
        assignedOn: new Date(),
        name: ""
      };
      Assign_Category_Arr.push(_body);
    }

    const body: EvdenceCategoryAssignment = {
      unAssignCategories: [],
      assignedCategories: Assign_Category_Arr,
      updateCategories: []
    };

    EvidenceAgent.changeCategories(Assign_Category_URL, body).then(() => {
      props.setFilterValue((val: []) => []);
      setSuccess(true);
      setTimeout(() => closeModal(), 3000);
    })
    .catch((ex: any) => {
      setError(true);
    })
  };

  return (
    <div className='categoryModal'>
      {success && <CRXAlert message={t("Success_You_have_saved_the_asset_categorization")} alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message={t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
          type='error'
          alertType='inline'
          open={true}
        />
      )}
      <Formik
        initialValues={props.initialValues}
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
              <CRXButton type='submit' className='nextButton' color='primary' variant='contained'>
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
