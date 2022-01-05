import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';

type CancelConfirmFormProps = {
  isCategoryEmpty: boolean;
  removedOption: any;
  previousActive: number;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setRemovedOption: (param: any) => void;
  setIsformUpdated: (param: boolean) => void;
  setIndicateTxt: (param: boolean) => void;
  setModalTitle: (param: string) => void;
};

interface FormValues {}

const CancelConfirmForm: React.FC<CancelConfirmFormProps> = (props) => {
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const initialValues: FormValues = {};

  React.useEffect(() => {
    props.setModalTitle('Please confirm');
    props.setIndicateTxt(false);
  });

  const cancelBtn = () => {
    const previouslyRemovedCategories = findPreviouslyRemovedCategories();
    if (previouslyRemovedCategories) {
      props.setFilterValue((prevState: any) => [...prevState, previouslyRemovedCategories]);
      /**
       * * Set removed option in to State again.
       */
      props.setRemovedOption({});
    }
    /**
     * * Redirect to Previous Form
     */
    props.setActiveForm(props.previousActive);
  };

  const findPreviouslyRemovedCategories = () => {
    const previouslyRemovedCategories = categoryOptions
      .filter((o: any) => {
        return o.id === props.removedOption.id;
      })
      .map((i: any) => {
        return {
          id: i.id,
          label: i.name
        };
      })[0];
    return previouslyRemovedCategories;
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          const previouslyRemovedCategories = findPreviouslyRemovedCategories();
          if (previouslyRemovedCategories) {
            props.setFilterValue((prevState: any) => [...prevState, previouslyRemovedCategories]);
            /**
             * * Set removed option in to State again.
             */
            props.setRemovedOption({});
          }
          props.setOpenForm();
          props.setFilterValue((val: []) => []);
          /**
           * * set Is form updated state back to false.
           */
          props.setIsformUpdated(false);
          props.closeModal(false);
        }}>
        <Form>
          <div className='modalContentText'>
            <div className='cancelConfrimText'>
              You are attempting to <strong>close</strong> the modal dialog. If you close the modal dialog, any changes
              you've made will not be saved. You will not be able to undo this action.{' '}
            </div>
          </div>
          <div className='modalBottomText'>
            Are you sure you would like to <strong>close</strong> the modal dialog?
          </div>
          <div className='cancelForm'>
            <div className='buttonContainer'>
              <CRXButton type='submit' className='primeryBtn'>
                Yes, close
              </CRXButton>
            </div>
            <div className='buttonContainer'>
              <CRXButton
                onClick={cancelBtn}
                color='secondary'
                variant='contained'
                className='cancelButtonCate secondary'>
                No, do not close
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default CancelConfirmForm;
