import React from 'react';
import { Formik, Form } from 'formik';
import { CRXButton } from '@cb/shared';
import { useSelector } from 'react-redux';
import { CRXAlert } from '@cb/shared';
import moment from 'moment';
import http from '../../../../../http-common';
import { useTranslation } from "react-i18next";
import { Category, EvdenceCategoryAssignment } from '../../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../../utils/Api/ApiAgent';

type SaveConfirmFormProps = {
  removedOption: any;
  setremoveClassName: any;
  // rowData: any;
  evidenceResponse : any;
  differenceOfDays: number;
  removalType: number;
  removeMessage: string;
  retentionId: number;
  holdUntill: string;
  setActiveForm: (param: any) => void;
  setOpenForm: () => void;
  setFilterValue: (param: any) => void;
  closeModal: (param: boolean) => void;
  setRemovedOption: (param: any) => void;
  setModalTitle: (param: string) => void;
  setIndicateTxt: (param: boolean) => void;
};

interface FormValues { }

const SaveConfirmForm: React.FC<SaveConfirmFormProps> = (props) => {

  const { t } = useTranslation<string>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [WarningMessage, setWarningMessage] = React.useState<string>('');
  const initialValues: FormValues = {};
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);

  React.useEffect(() => {
    props.setModalTitle(t("Please_confirm"));
    props.setIndicateTxt(false);
    props.setremoveClassName('crx-remove-category-form crxPleaseConfirmForm');
  }, []);

  React.useEffect(() => {
    if (props.removalType === 1) {
      setWarningMessage(`${t("Please_be_aware_that_by_removing_this_category,_you_are_reducing_the_assets_lifetime_and_the_asset_will_expire")}${props.differenceOfDays > 0 ? ` ${t("in")}
      ${props.differenceOfDays} ${t("Hours.")}` : '.'} `);


    } else if (props.removalType === 2) {
      setWarningMessage(`${t("Please_be_aware_that_by_removing_this_category,_you_are_reducing_the_assets_lifetime_and_the_asset_will_expire_in")}
        ${props.differenceOfDays} ${t("Hours.")} ${t("Unclassified_retention_policy_of_station_will_be_applied_on_this_evidence_group.")}`);
    }
  }, [props.removalType]);

  const cancelBtn = () => {
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
      /** Set removed option in to State again. */
      props.setFilterValue((prevState: any) => [...prevState, newValue]);  
      props.setRemovedOption({});
    }
    props.setActiveForm(0);
  };

  const closeModal = () => {
    props.setOpenForm();
    props.closeModal(false);
  };

  const deleteRequest = () => {
    const message = props.removeMessage;
    // const evidenceId = props.rowData.id;
    const evidenceId = props.evidenceResponse?.id;
    const categoryId = props.removedOption.id;
    const retentionId = props.retentionId !== 0 ? [props.retentionId] : null;
    const holdUntill = props.holdUntill;
    const unAssignCategory : Category = {
      id: categoryId,
      formData: [],
      assignedOn: new Date(),
      name: ""
    };

    const body : EvdenceCategoryAssignment = {
      unAssignCategories: [unAssignCategory],
      assignedCategories: [],
      updateCategories: [],
      retentionId: retentionId,
      holdUntill: holdUntill
    };
    const url = `/Evidences/${evidenceId}/Categories?editReason=${message}`;
    EvidenceAgent.changeCategories(url, body).then((response: any) => {
      setSuccess(true);
      setTimeout(() => closeModal(), 3000);
    })
    .catch((ex: any) => {
      setError(true);
    })
  };

  return (
    <>
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
        initialValues={initialValues}
        onSubmit={() => {
          deleteRequest();
        }}>
        <Form className='crx-category-remove-form'>
          {props.removalType !== 0 && (
            <CRXAlert message={WarningMessage} className='crx-warning' type='warning' alertType='inline' open={true} />
          )}
          <div className='CRXCategory crx-category-attempting'>
          {t("You_are_attempting_to_remove")} '<b>{props.removedOption.label}</b>' {t("category")}.
          </div>
          <div className='CRXCategory crx-continue-category'>{t("Do_you_want_you_continue_with_removing_the_category?")}</div>
          <div className='modalFooter CRXFooter removeFooter removeCategoryFooter'>
            <div className='nextBtn'>
              <CRXButton className='primeryBtn' type='submit'>
                {t("Yes,_remove-category")}
              </CRXButton>
            </div>
            <div className='cancelBtn'>
              <CRXButton color='secondary' variant='contained' className='cancelButton secondary' onClick={cancelBtn}>
                {t("No,_do_not_remove_category")}
              </CRXButton>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};
export default SaveConfirmForm;
