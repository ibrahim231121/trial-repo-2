import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { CRXRadio, CRXButton, CRXAlert, CRXConfirmDialog, TextField } from '@cb/shared';
import { useDispatch } from 'react-redux';
import { addNotificationMessages } from '../../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../../Header/CRXNotifications/notificationsTypes';
import moment from "moment";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { Evidence } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory, useParams } from "react-router";
import "./ManageRetention.scss";
import { ManageRetentionProps, RetentionFormType, RetentionStatusEnum } from './ManageRetentionTypes';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { getAssetSearchInfoAsync } from '../../../../Redux/AssetSearchReducer';
import { SearchType } from '../../utils/constants';  

const ManageRetention: React.FC<ManageRetentionProps> = (props) => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const [prevRecord, setPrevRecord] = React.useState<Evidence>();

  const [alert, setAlert] = React.useState<boolean>(false);
  const alertRef = React.useRef(null);
  const retentionRadioDefaultOptions = [
    {
      value: "1", label: `${t("Extend_retention_by_days")}`, Comp: () => { }
    },
    {
      value: "2", label: `${t("Extend_retention_Indefinitely")}`, Comp: () => { }
    }
  ];

  const initialValues: RetentionFormType = {
    RetentionStatus: RetentionStatusEnum.CustomExtention,
    CurrentRetention: '',
    OriginalRetention: '',
    RetentionList: [],
    RetentionDays: 7,
    RetentionOptions: retentionRadioDefaultOptions,
    SaveButtonIsDisable: true
  };

  const [formPayload, setFormPayload] = React.useState<RetentionFormType>(initialValues);

  React.useEffect(() => {
    if (props.items.length <= 1)
      getRetentionData();
  }, []);

  React.useEffect(() => {
    if (responseError !== undefined && responseError !== '') {
      let notificationMessage: NotificationMessage = {
        title: `${t("User")}`,
        message: responseError,
        type: 'error',
        date: moment(moment().toDate()).local().format('YYYY / MM / DD HH:mm:ss')
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [responseError]);

  React.useEffect(() => {
    const alertClx: any = document.getElementsByClassName("crxAlertUserEditForm");
    const optionalSticky: any = document.getElementsByClassName("optionalSticky");
    const altRef = alertRef.current;
    if (alert === false && altRef === null) {
      alertClx[0].style.display = "none";
    }
    else {
      alertClx[0].setAttribute("style", "display:flex;margin-top:42px;margin-bottom:42px");
      if (optionalSticky.length > 0) {
        optionalSticky[0].style.height = "119px"
      }
    }
  }, [alert]);


  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.assets)[0]
        .url
    );
  };

  const getRetentionData = () => {
    props.setIsformUpdated(false);
    EvidenceAgent.getEvidence(props.rowData.id).then((response: Evidence) => {
      if (response.expireOn != null) {
        formPayload.OriginalRetention = `Original Retentions: ${moment(response.expireOn).format('DD-MM-YYYY HH:MM:ss')}`;
        if(response.holdUntil !=null)
        {
          if (moment(response.holdUntil).format('DD-MM-YYYY') == "31-12-9999") {
            formPayload.RetentionOptions = [...formPayload.RetentionOptions, { value: '3', label: `${t('Revert_to_original_retention')}`, Comp: () => { } }];
            formPayload.CurrentRetention = 'Current Retention: Indefinite';
          }
          else {
            formPayload.RetentionOptions = [...formPayload.RetentionOptions, { value: '3', label: `${t('Revert_to_original_retention')}`, Comp: () => { } }];
            formPayload.CurrentRetention = `Current Retention: ${moment(response.holdUntil).format('DD-MM-YYYY HH:MM:ss')}`;
          }
        }
        const newObj: RetentionFormType = {
          ...formPayload,
          RetentionOptions: formPayload.RetentionOptions
        };
        setFormPayload(newObj);
      }
    });
  }

  const cancelBtn = () => props.setOnClose();

  const RadioButtonOnChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {

    const status = e.target.value;
    setFieldValue('RetentionStatus', status, false);
    if (status === RetentionStatusEnum.IndefiniteExtention) {
      setFieldValue('SaveButtonIsDisable', false, false);
      setFieldValue('RetentionList',  GetRetentionList(null, 0), false);
      props.setIsformUpdated(true);
      
    }
    else if(status === RetentionStatusEnum.RevertToOriginal)
    {
      setFieldValue('RetentionList', GetRetentionList(null, null), false);
    }
    setFieldValue('SaveButtonIsDisable', false, false);
  }

  function GetRetentionList(retentionDays: any, holdUntil: any) {
    let retentionList: { id: any; extendedDays: number; holdUntil: number }[] = [];
    if (props?.items?.length > 1) {
      props.items.forEach((el) => {
        retentionList.push({
          id: el.id,
          extendedDays: parseInt(retentionDays),
          holdUntil: holdUntil
        });
      });
    }
    else {
      retentionList.push({
        id: props?.rowData?.id,
        extendedDays: parseInt(retentionDays),
        holdUntil: holdUntil
      });
    }

    return retentionList;
  }


  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    e.preventDefault();
    const retentionDays = e.target.value;
    setFieldValue('RetentionDays', retentionDays, false);
    setFieldValue('RetentionList', GetRetentionList(parseInt(retentionDays), null), false);
    setFieldValue('SaveButtonIsDisable', false, false);
    props.setIsformUpdated(true);
  }

  const onSubmitForm = (values: RetentionFormType, actions: FormikHelpers<RetentionFormType>) => {
    const url = '/Evidences/Retention';
    EvidenceAgent.updateRetentionPolicy(url, values.RetentionList).then(() => {
      props.setOnClose();
      setTimeout(() => {
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      }, 2000);
      props.showToastMsg({
        message: (values.RetentionStatus == RetentionStatusEnum.CustomExtention || values.RetentionStatus == RetentionStatusEnum.IndefiniteExtention) ? t("Retention_Extended") : t("Retention_Reverted"),
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
    })
      .catch((error) => {
        setAlert(true);
        setResponseError(
          t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
        );
        return error;
      });
    actions.setSubmitting(false);
  }

  return (
    <>
      <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType='inline'
        type='error'
        open={alert}
        setShowSucess={() => null}
      />
      <div className='retention-modal'>
        <Formik initialValues={formPayload} onSubmit={onSubmitForm} enableReinitialize={true}>
          {({ setFieldValue, values }) => (
            
            <Form>
              <div className='_rententionModalCotent'>
                <div className='_rentention_fields'>
                  <div className='retention-modal-sub'>
                    {t("Extend")} {props.items.length > 1 ? props.items.length : 1} {t("Asset(s)")}
                  
                  </div>
                  
                  {/* <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="RetentionStatus"
                    value={values.RetentionStatus}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      RadioButtonOnChange(e, setFieldValue)}
                  >
                    {values.RetentionOptions.map((x) => (
                      <>
                      <div className='user-radio-group'>
                        <FormControlLabel
                          className='crxEditRadioBtn'
                          key={x.value}
                          value={x.value}
                          control={<Radio />}
                          label={x.label}
                          
                        />
                        </div>
                      </>
                      
                    ))}
                  </RadioGroup> */}
                   <CRXRadio
                    value={values.RetentionStatus}
                    content={values.RetentionOptions}
                    onChange={(e: any) => RadioButtonOnChange(e, setFieldValue)}
                    />   
                  <TextField
                    parentId="_rentention_field_parent"
                    className=""
                    type="number"
                    disabled={values.RetentionStatus == RetentionStatusEnum.CustomExtention ? false : true}
                    value={values.RetentionDays}
                    name="RetentionDays"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeEvent(e, setFieldValue)}
                  />
                  <div className="retention-label-days"><span>
                    days
                  </span></div>
                </div>
              </div>
              <div className='orginal_current_text'>
                <div>{values.OriginalRetention}</div>
                
                <div>{values.CurrentRetention}</div>
                
              </div>
              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className='primeryBtn' disabled={values.SaveButtonIsDisable}>
                    {t("Save")}
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                    {t("Cancel")}
                  </CRXButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <CRXConfirmDialog
          setIsOpen={() => setIsOpen(false)}
          onConfirm={closeDialog}
          isOpen={isOpen}
          className="userGroupNameConfirm"
          primary={t("Yes_close")}
          secondary={t("No,_do_not_close")}
          text="user group form"
        >
          <div className="confirmMessage">
            {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
            <strong>{t("'user form'")}</strong>. {t("If_you_close_the_form")},
            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
            <div className="confirmMessageBottom p-bottom">
              {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
            </div>
          </div>
        </CRXConfirmDialog>
      </div>
    </>
  );
};

export default ManageRetention;
