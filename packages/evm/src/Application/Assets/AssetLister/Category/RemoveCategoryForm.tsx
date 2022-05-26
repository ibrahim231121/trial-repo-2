import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CRXButton } from '@cb/shared';
import { CRXHeading } from '@cb/shared';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CRXAlert } from '@cb/shared';

type RemoveCategoryFormProps = {
  filterValue: [];
  setremoveClassName: any;
  removedOption: any;
  evidenceResponse: any;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setDifferenceOfDays: (param: number) => void;
  setRemovedOption: (param: any) => void;
  setIsformUpdated: (param: boolean) => void;
  setModalTitle: (param: string) => void;
  setRemovalType: (param: number) => void;
  setRemoveMessage: (param: string) => void;
  setRetentionId: (param: number) => void;
  setHoldUntill: (param: string) => void;
  setIndicateTxt: (param: boolean) => void;
};

interface FormValues { }

const RemoveCategoryForm: React.FC<RemoveCategoryFormProps> = (props) => {
  const [error, setError] = React.useState<boolean>(false);
  const [Message, setMessageLenght] = React.useState('');
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const filtered = categoryOptions.filter((o: any) => {
    return props.evidenceResponse?.categories.some((e: any) => e === o.name);
  });
  const initialValues: FormValues = {
    reason: ''
  };

  React.useEffect(() => {
    props.setModalTitle('Removing the category requires a reason');
    props.setremoveClassName('crx-remove-category-form');
    props.setIndicateTxt(false);
  }, []);

  React.useEffect(() => {
    if (Message.length === 0) props.setIsformUpdated(false);
    else props.setIsformUpdated(true);
  }, [Message]);

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
    
    const removedCategory = props.removedOption;
    const categoryObject = props.evidenceResponse.categories;
    const retentionDetails: any = [];
    props.setRemoveMessage(message);
    for(const elem of categoryObject) {
      const Hours = elem.dataRetentionPolicy.record.filter((x: any) => x.key === 'Hours')[0].value;
      const GracePeriodHours = elem.dataRetentionPolicy.record.filter((x: any) => x.key === 'GracePeriodHours')[0].value;
      const TotalHours = parseInt(Hours) + parseInt(GracePeriodHours);
      retentionDetails.push({
        categoryName: elem.record.record.filter((x: any) => x.key === 'Name')[0].value,
        retentionId: elem.dataRetentionPolicy.cmtFieldValue,
        hours: TotalHours
      });
    }
    /** 
     * * Sorted Array in Descending order by Hours. 
     * */
    const sortedArray = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
    const highestRetention = sortedArray[0];
    if(sortedArray.length == 1){
      /** 
       * * This was the last category 
       * */
       props.setRemovalType(2);
       props.setActiveForm(4);
       return;
    }
    const SecondHighestRetention = sortedArray[1];
    if (highestRetention.categoryName === removedCategory.label) {
      /** 
       * * Selected Category have Highest Hours 
       * */
      const recordingStarted = props.evidenceResponse?.assets?.master?.recording.started;
      const expiryDate = moment(recordingStarted)
        .add(highestRetention.hours, 'hours').utc();
      const newExpiryDate = moment().add(SecondHighestRetention.hours, 'hours');
      const duration = Math.floor(moment.duration(newExpiryDate.diff(expiryDate)).asHours());
      props.setRetentionId(SecondHighestRetention.retentionId);
      props.setHoldUntill(newExpiryDate.format('YYYY-MM-DDTHH:mm:ss'));
      props.setDifferenceOfDays(duration);
      /** Incase Retention is effected */
      props.setRemovalType(1);
      props.setActiveForm(4);
    } else if (props.filterValue?.length === 0) {
      /** 
       * * This is the last category 
       * */
      props.setRemovalType(2);
      props.setActiveForm(4);
    } else {
      /** 
       * * Normal Removal 
       * */
      props.setRemovalType(0);
      props.setActiveForm(4);
    }
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
            <div className="indicatestext indicateLessPadding"><b>*</b> Indicates required field</div>
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
