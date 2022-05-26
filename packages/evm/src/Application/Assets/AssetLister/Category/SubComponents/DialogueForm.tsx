import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { Alert } from '@material-ui/lab';
import { CRXAlert } from '@cb/shared';
import moment from 'moment';
import { EVIDENCE_SERVICE_URL } from '../../../../../utils/Api/url';
import http from '../../../../../http-common';

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
    const Assign_Category_Arr: any[] = [];
    const Assign_Category_URL = `${EVIDENCE_SERVICE_URL}/Evidences/${evidenceId}/Categories`;
    for (const v of values) {
      const _body = {
        id: v.id,
        formData: [],
        assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss')
      };
      Assign_Category_Arr.push(_body);
    }

    const body = {
      unAssignCategories: [],
      assignedCategories: Assign_Category_Arr,
      updateCategories: []
    };

    http.patch(Assign_Category_URL, body)
      .then((response) => {
        if (response.status == 204) {
          props.setFilterValue((val: []) => []);
          setSuccess(true);
          setTimeout(() => closeModal(), 3000);
        } else {
          setError(true);
          throw new Error(response.statusText);
        }
      })
  };

  return (
    <div className='categoryModal'>
      {success && <CRXAlert message='Success: You have saved the asset categorization' alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message="We 're sorry. The form was unable to be saved. Please retry or  contact your Systems Administrator"
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
            Category Title Placeholder Here
            {props.formCollection.map((field: any, _key: number) => (
              <span key={_key}>
                <b> {field.name}</b>
                {rowLen !== _key + 1 && <span>,</span>}
              </span>
            ))}
          </CRXHeading>
          <Alert className='attentionAlert' severity='info' icon={alertIcon}>
            <b>Attention:</b> There is no form response for the category named,{' '}
            {props.formCollection.map((field: any, _key: any) => (
              <span key={_key}>
                <span className='cateName' key={_key}>
                  '{field.name}'
                </span>
                {rowLen !== _key + 1 && <span>,</span>}
              </span>
            ))}
            . Please save to continue.{' '}
          </Alert>
          <div className='modalFooter nextForm'>
            <div className='nextBtn'>
              <CRXButton type='submit' className='nextButton' color='primary' variant='contained'>
                Save
              </CRXButton>
            </div>
            <div className='cancelBtn'>
              <CRXButton onClick={backBtn} color='secondary' variant='contained' className='cancelButton secondary'>
                Back
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default DialogueForm;
