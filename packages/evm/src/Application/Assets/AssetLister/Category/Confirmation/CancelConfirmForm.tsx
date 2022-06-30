import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

type CancelConfirmFormProps = {
  isCategoryEmpty: boolean;
  setremoveClassName: any;
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
  const { t } = useTranslation<string>();
  React.useEffect(() => {
    props.setModalTitle('Please confirm');
    props.setIndicateTxt(false);
    props.setremoveClassName('crxCancelConfirmForm');
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
              {t("You_are_attempting_to")} <strong>{t("close")}</strong> {t("the_modal_dialog")} {t("If_you_close_the_modal_dialog,")}  
              {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}{' '}
            </div>
          </div>
          <div className='modalBottomText modalBottomTextClose'>
            {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_modal_dialog")}?
          </div>
          <div className='cancelForm'>
            <div className='buttonContainer'>
              <CRXButton type='submit' className='primeryBtn'>
              {t("Yes")}, {t("close")}
              </CRXButton>
            </div>
            <div className='buttonContainer'>
              <CRXButton
                onClick={cancelBtn}
                color='secondary'
                variant='contained'
                className='cancelButtonCate secondary'>
                  {t("No,_do_not_close")}
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default CancelConfirmForm;
