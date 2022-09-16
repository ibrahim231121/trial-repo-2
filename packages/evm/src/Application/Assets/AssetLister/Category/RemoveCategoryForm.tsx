import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { FormValues, RemoveCategoryFormProps } from './Model/RemoveCategoryFormModel';

const RemoveCategoryForm: React.FC<RemoveCategoryFormProps> = (props) => {
  const { t } = useTranslation<string>();
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const initialValues: FormValues = {
    reason: ''
  };

  React.useEffect(() => {
    props.setModalTitle(t('Removing_the_category_requires_a_reason'));
    props.setremoveClassName('crx-remove-category-form');
    props.setIndicateTxt(false);
  }, []);

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
          reason: Yup.string().required(t("Required"))
        })}>
        {({ handleChange, isValid, dirty }) => (
          <Form>
            <div className="indicatestext indicateLessPadding"><b>*</b> {t('Indicates_required_field')}</div>
            <CRXHeading className='categoryDescription removeCategoryDescription' variant='h6'>
              {t('Please_enter_the_reason_for_removing_the_category.')}
            </CRXHeading>
            <div className='CRXCategory'>
              {t('Category_removal_reason')} <b className='formStaric'>*</b>
            </div>
            <Field
              id='reaon'
              className='crx-category-scroll'
              name='reason'
              as='textarea'
              onChange={(event: any) => {
                handleChange(event);
                // setMessageLenght(event.target.value);
                props.setIsformUpdated(true)
              }}
            />
            <ErrorMessage name='reason' render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} />
            <div className='modalFooter CRXFooter removeFooter'>
              <div className='nextBtn'>
                <CRXButton className='primeryBtn' type='submit' disabled={!(isValid && dirty)}>
                {t("Save")}
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} className='cancelButton'>
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

export default RemoveCategoryForm;
