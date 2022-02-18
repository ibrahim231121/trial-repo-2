import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';
import { CRXAlert } from '@cb/shared';
import { EVIDENCE_SERVICE_URL } from '../../../../../utils/Api/url';
import moment from 'moment';

type SaveConfirmFormProps = {
  removedOption: any;
   setremoveClassName: any;
  rowData: any;
  differenceOfDays: string;
  removalType: number;
  removeMessage: string;
  retentionId: number;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setRemovedOption: (param: any) => void;
  setModalTitle: (param: string) => void;
  setIndicateTxt: (param: boolean) => void;
};

interface FormValues {}

const SaveConfirmForm: React.FC<SaveConfirmFormProps> = (props) => {
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [WarningMessage, setWarningMessage] = React.useState<string>('');
  const initialValues: FormValues = {};
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);

  React.useEffect(() => {
    props.setModalTitle('Please confirm');
    props.setIndicateTxt(false);
    props.setremoveClassName('crx-remove-category-form crxPleaseConfirmForm');
  }, []);

  React.useEffect(() => {
    if (props.removalType === 1) {
      setWarningMessage(`Please be aware that by removing this category, you
      are reducing the assets lifetime and the asset will expire in
      ${props.differenceOfDays}.`);
    } else if (props.removalType === 2) {
      setWarningMessage(`Please be aware that by removing this category, you
        are reducing the assets lifetime and the asset will expire in
        ${props.differenceOfDays}. Unclassified retention policy of station
        will be applied on this evidence group.`);
    }
  }, [props.removalType]);

  const cancelBtn = () => {
    //debugger;
    const newValue = categoryOptions
      .filter((o: any) => {
        return o.id === props.removedOption.id;
      })
      .map((i: any) => {
        return {
          id: i.id,
          label: i.name
        };
      })[0];
    if (newValue) {
      props.setFilterValue((prevState: any) => [...prevState, newValue]); // Set removed option in to State again.
      props.setRemovedOption({});
    }
    props.setActiveForm(0);
  };

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  const deleteFetchReq = () => {
    const message = props.removeMessage;
    const evidenceId = props.rowData.id;
    const categoryId = props.removedOption.id;
    const retentionId = props.retentionId;

    const unAssignCategory = {
      id: categoryId,
      formData: [],
      assignedOn: moment().format('YYYY-MM-DDTHH:mm:ss')
    };

    const body = {
      unAssignCategories: [unAssignCategory],
      assignedCategories: [],
      updateCategories: [],
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

    const url = `${EVIDENCE_SERVICE_URL}/Evidences/${evidenceId}/Categories?editReason=${message}`;
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
  };

  return (
    <>
      {success && <CRXAlert message='Success: You have saved the asset categorization' alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message="We 're sorry. The form was unable to be saved. Please retry or contact your Systems Administrator"
          type='error'
          alertType='inline'
          open={true}
        />
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          deleteFetchReq();
        }}>
        <Form className='crx-category-remove-form'>
          {props.removalType !== 0 && (
            <CRXAlert message={WarningMessage} className='crx-warning' type='warning' alertType='inline' open={true} />
          )}
          <div className='CRXCategory crx-category-attempting'>
            You are attempting to remove '<b>{props.removedOption.label}</b>' category.
          </div>
          <div className='CRXCategory crx-continue-category'>Do you want yo continue with removing the category?</div>
          <div className='modalFooter CRXFooter removeFooter removeCategoryFooter'>
            <div className='nextBtn'>
              <CRXButton className='primeryBtn' type='submit'>
                Yes, remove category
              </CRXButton>
            </div>
            <div className='cancelBtn'>
              <CRXButton color='secondary' variant='contained' className='cancelButton secondary' onClick={cancelBtn}>
                No, do not remove category
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};
export default SaveConfirmForm;
