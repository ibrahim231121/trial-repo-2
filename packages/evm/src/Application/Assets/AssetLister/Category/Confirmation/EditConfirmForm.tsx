import React from 'react';
import { CRXButton } from '@cb/shared';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { CRXAlert } from '@cb/shared';
import { EVIDENCE_SERVICE_URL, SETUP_CONFIGURATION_SERVICE_URL } from '../../../../../utils/Api/url';

type EditConfirmFormProps = {
  rowData?: any;
  filterValue: any[];
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
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const CategoryFormFields = useSelector((state: any) => state.CategoryFormFields);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const selectedRow = props.rowData;
  const evidenceId = selectedRow.assetId;
  const initialValues: FormValues = {
    reason: ''
  };
  const [Message, setMessage] = React.useState('');

  React.useEffect(() => {
    props.setModalTitle('Editing the category form requires a reason');
  }, []);

  React.useEffect(() => {
    if (Message.length === 0) props.setIsformUpdated(false);
    else props.setIsformUpdated(true);
  }, [Message]);

  const awaitJson = (response: any) => {
    if (response.ok) {
      return response.json() as Object;
    }
    throw new Error(response.statusText);
  };

  const submitForm = (message: string) => {
    const url = `${EVIDENCE_SERVICE_URL}/Evidences/${evidenceId}/Categories?editReason=${message}`;
    let assignedCategories = CategoryFormFields.filter((e: any) => e.type === 'add');
    let updateCategories = CategoryFormFields.filter((e: any) => e.type === 'update');

    //Remove type key from body.
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
    // Find highest retention, in categories.
    let retentionPrmomise = findRetention();
    Promise.resolve(retentionPrmomise).then((retentionId: number) => {
      const body = {
        unAssignCategories: [],
        assignedCategories: assignedCategories,
        updateCategories: updateCategories,
        retentionId: [retentionId]
      };
      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          TenantId: '1'
        },
        body: JSON.stringify(body)
      };
      fetch(url, requestOptions)
        .then((response: any) => {
          if (response.ok) {
            setSuccess(true);
            setTimeout(() => closeModal(), 3000);
          } else {
            throw new Error(response.statusText);
          }
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
        });
    });
  };

  const findRetention = async () => {
    const retentionDetails: any = [];
    let retentionList = '';
    let count = 0;
    const categoriesWithRetention = categoryOptions.filter((o: any) => {
      return props.filterValue.some((e: any) => e.id === o.id);
    });
    for (const i of categoriesWithRetention) {
      const retentionId = i.policies.retentionPolicyId;
      retentionList +=
        props.filterValue.length !== count + 1 ? `PolicyIDList=${retentionId}&` : `PolicyIDList=${retentionId}`;
      count++;
    }
    const url = `${SETUP_CONFIGURATION_SERVICE_URL}/Policies/DataRetention?${retentionList}`;
    let call = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', TenantId: '1' }
    })
      .then(awaitJson)
      .then((response: any) => {
        for (let i = 0; i <= response.length - 1; i++) {
          retentionDetails.push({
            categoryName: props.filterValue[i].label,
            hours: response[i].detail.limit.hours + response[i].detail.limit.gracePeriodInHours
          });
        }
        const sortedArray = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
        const retentionId = categoryOptions.find((o: any) => o.name === sortedArray[0].categoryName).policies
          .retentionPolicyId;
        return retentionId;
      })
      .catch((err: any) => {
        setError(true);
        console.error(err.message);
      });
    return call;
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
          message='Success: You have saved the asset categorization'
          alertType='toast'
          open={true}
        />
      )}
      {error && (
        <CRXAlert
          className='cateoryAlert-Error errorMessageCategory'
          message=" Error: We're sorry. The form was unable to be saved. Please retry or contact your Systems Administrator"
          type='error'
          alertType='inline'
          open={true}
        />
      )}
      <div className='indicatestext indicateLessPadding'>
        <b>*</b> Indicates required field
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
            <div className='categoryDescription'>Please enter the reason for editing the form.</div>
            <div className='CRXCategory categoryTitle'>
              Category form edit reason <b className='formStaric'>*</b>
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
                  Save
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} color='secondary' variant='contained' className='cancelButton secondary'>
                  Cancel
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
