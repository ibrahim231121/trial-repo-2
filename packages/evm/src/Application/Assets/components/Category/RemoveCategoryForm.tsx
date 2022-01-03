import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CRXButton } from '@cb/shared';
import { CRXHeading } from '@cb/shared';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CRXAlert } from '@cb/shared';
import { SETUP_CONFIGURATION_SERVICE_URL } from '../../../../utils/Api/url';

type RemoveCategoryFormProps = {
  filterValue: [];
  setremoveClassName: any;
  removedOption: any;
  rowData: any;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setDifferenceOfDays: (param: any) => void;
  setRemovedOption: (param: any) => void;
  setIsformUpdated: (param: boolean) => void;
  setModalTitle: (param: string) => void;
  setRemovalType: (param: number) => void;
  setRemoveMessage: (param: string) => void;
  setRetentionId: (param: number) => void;
};

interface FormValues {}

const RemoveCategoryForm: React.FC<RemoveCategoryFormProps> = (props) => {
  const [error, setError] = React.useState<boolean>(false);
  const [Message, setMessageLenght] = React.useState('');
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const filtered = categoryOptions.filter((o: any) => {
    return props.rowData?.categories.some((e: any) => e === o.name);
  });
  const initialValues: FormValues = {
    reason: ''
  };

  React.useEffect(() => {
    props.setModalTitle('Removing the category requires a reason');
    props.setremoveClassName('crx-remove-category-form');
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

  const cancelBtn = () => {
    let newValue = categoryOptions
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

  const getPolicyAsync = (message: string) => {
    const rowData = props.rowData;
    const removedCategory = props.removedOption;
    const retentionDetails: any = [];
    let retentionList = '';
    let count = 0;
    for (const i of filtered) {
      const retentionId = i.policies.retentionPolicyId;
      retentionList += filtered.length !== count + 1 ? `PolicyIDList=${retentionId}&` : `PolicyIDList=${retentionId}`;
      count++;
    }
    const url = `${SETUP_CONFIGURATION_SERVICE_URL}/Policies/DataRetention?${retentionList}`;
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', TenantId: '1' }
    })
      .then(awaitJson)
      .then((dataRetentionPromisesResponse: any) => {
        props.setRemoveMessage(message);
        if (dataRetentionPromisesResponse.length > 0) {
          for (let i = 0; i <= dataRetentionPromisesResponse.length - 1; i++) {
            retentionDetails.push({
              categoryName: filtered[i].name,
              hours:
                dataRetentionPromisesResponse[i].detail.limit.hours +
                dataRetentionPromisesResponse[i].detail.limit.gracePeriodInHours
            });
          }
          // Sorted Array in Descending order by Hours.
          const sortedArray = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
          if (sortedArray[0].categoryName === removedCategory.label) {
            // Selected Category have Highest Hours
            const recordingStarted = rowData.recordingStarted;
            const expiryDate = moment(recordingStarted)
              .add(sortedArray[0].hours, 'hours')
              .format('YYYY-MM-DD hh:mm:ss');

            const newExpiryDate = moment().add(sortedArray[1].hours, 'hours');
            const duration = Math.floor(moment.duration(newExpiryDate.diff(expiryDate)).asHours());

            if (duration > 24) {
              const asDays = Math.floor(duration / 24);
              props.setDifferenceOfDays(asDays + ' Days');
            } else {
              props.setDifferenceOfDays(duration + ' Hours');
            }
            // Incase Retention is effected.
            props.setRemovalType(1);
            props.setActiveForm(4);
          } else if (props.filterValue?.length === 0) {
            // This is the last category
            props.setRemovalType(2);
            props.setActiveForm(4);
          } else {
            // Normal Removal
            props.setRemovalType(0);
            props.setActiveForm(4);
          }
        }
      })
      .catch((err: any) => {
        setError(true);
        console.error(err.message);
      });
  };

  return (
    <>
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
        onSubmit={({ reason }: any, actions) => {
          // If assest is going to uncategorized.
          const categoriesLenght: number = props.filterValue?.length;
          if (categoriesLenght == 0) {
            props.setActiveForm(4);
          }
          getPolicyAsync(reason);
          actions.setSubmitting(false);
        }}
        validationSchema={Yup.object({
          reason: Yup.string().required('Required')
        })}>
        {({ handleChange, isValid, dirty }) => (
          <Form>
            <CRXHeading className='categoryDescription removeCategoryDescription' variant='h6'>
              Please enter the reason for removing the category.
            </CRXHeading>
            <div className='CRXCategory'>
              Category removal reason <b className='formStaric'>*</b>
            </div>
            <Field
              id='reaon'
              className='crx-category-scroll'
              name='reason'
              as='textarea'
              onChange={(event: any) => {
                handleChange(event);
                setMessageLenght(event.target.value);
              }}
            />
            <ErrorMessage name='reason' render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} />
            <div className='modalFooter CRXFooter removeFooter'>
              <div className='nextBtn'>
                <CRXButton className='primeryBtn' type='submit' disabled={!(isValid && dirty)}>
                  Save
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} className='cancelButton'>
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

export default RemoveCategoryForm;
