import React from 'react';
import { Formik, Form, FormikHelpers, Field } from 'formik';
import { CRXRadio, CRXButton, CRXAlert, CRXConfirmDialog } from '@cb/shared';
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationMessages } from '../../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../../Header/CRXNotifications/notificationsTypes';
import moment from "moment";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { AssetLog, AssetLogType, AuditTableNames, Evidence, ExtendRetention } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory } from "react-router";
import "./ManageRetention.scss";
import { ManageRetentionProps, RetentionFormType, RetentionStatusEnum } from './ManageRetentionTypes';
import { getAssetSearchInfoAsync } from '../../../../Redux/AssetSearchReducer';
import { SearchType } from '../../utils/constants';  
import { addAssetLog } from '../../../../Redux/AssetLogReducer';
import { RootState } from '../../../../Redux/rootReducer';
import { addMetaDataInfoAsync } from '../../../../Redux/MetaDataInfoDetailReducer';
import { number } from 'yup';
import { setLoaderValue } from '../../../../Redux/loaderSlice';

const ManageRetention: React.FC<ManageRetentionProps> = (props) => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const [isIndefinite, setIsIndefinite] = React.useState<boolean>(false);
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
    setIsIndefinite(false);
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
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.getEvidence(props.rowData.id ?? props.rowData.evidence.id ).then((response: Evidence) => {
      if (response.expireOn != null) {
        formPayload.OriginalRetention = `Original Retentions: ${moment(response.expireOn).format('DD-MM-YYYY HH:MM:ss')}`;
        if (response.holdUntil != null) {
          if (moment(response.holdUntil).format('DD-MM-YYYY') == "31-12-9999") {
            if (!formPayload.RetentionOptions.find((x: any) => x?.value == '3')) {
              formPayload.RetentionOptions = [...formPayload.RetentionOptions, { value: '3', label: `${t('Revert_to_original_retention')}`, Comp: () => { } }];
            }
            formPayload.CurrentRetention = 'Current Retention: Indefinite';
            formPayload.RetentionOptions = formPayload.RetentionOptions.map((options: any) => options.value == '2' || options.value == '1' ? { ...options, isDisabled: true, isChecked: false } : options)
            formPayload.RetentionOptions = formPayload.RetentionOptions.map((options: any) => options.value == '3' ? { ...options, isChecked: true } : options)
            setIsIndefinite(true);
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
      dispatch(setLoaderValue({ isLoading: false }));
    }).catch(() => {
      dispatch(setLoaderValue({ isLoading: false, error: true }));
    });;
  }

  const cancelBtn = () => props.setOnClose();

  const RadioButtonOnChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any, retentionDays : number) => {
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
    else if(status === RetentionStatusEnum.CustomExtention)
    {
      SetRetentionList(retentionDays, setFieldValue);
    }
    setFieldValue('SaveButtonIsDisable', false, false);
  }

  const GetRetentionList = (retentionDays: any, holdUntil: any) => {
    let retentionList: { evidenceId: any; extendedDays: number; holdUntil: number }[] = [];
    if (props?.items?.length > 1) {
      props.items.forEach((el) => {
        retentionList.push({
          evidenceId: el?.id == undefined ? el?.evidence?.id : el?.id,
          extendedDays: parseInt(retentionDays),
          holdUntil: holdUntil
        });
      });
    }
    else {
      retentionList.push({
        evidenceId: props?.rowData?.id == undefined ? props?.rowData?.evidence?.id : props?.rowData?.id,
        extendedDays: parseInt(retentionDays),
        holdUntil: holdUntil
      });
    }

    return retentionList;
  }

  const onChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    e.preventDefault();
    SetRetentionList(parseInt(e.target.value), setFieldValue);
  }

  const SetRetentionList = (retentionDays: number, setFieldValue: any) => {
    retentionDays = retentionDays >= 1 ? retentionDays : 1;
    setFieldValue('RetentionDays', retentionDays, false);
    setFieldValue('RetentionList', GetRetentionList(retentionDays, null), false);
    setFieldValue('SaveButtonIsDisable', false, false);
    props.setIsformUpdated(true);
  }

  const retentionLog = (values: RetentionFormType, body: ExtendRetention[] | { evidenceId: any; extendedDays: number; holdUntil: number }[]) => {
    body.forEach((x:any) =>
    { let note = ""
      if(values.RetentionStatus == "1"){
        note = "Retention Extended: "+x.extendedDays+" days"
      }
      else if(values.RetentionStatus == "2"){
        note = "Retention Extended: Indefinitely"
      }
      else if(values.RetentionStatus == "3"){
        note = "Retention Reverted to Original"
      }
      let assetLog : AssetLog = { action : "Update", notes : note, auditTableNamesEnum :  AuditTableNames.EvidenceAsset};
      let assetLogType : AssetLogType = { evidenceId : x?.evidenceId, assetId : 0, assetLog : assetLog};
      dispatch(addAssetLog(assetLogType));
    })
  }

  const isAssetDetailPage: boolean = useSelector((state: RootState) => state.metadatainfoDetailReducer.isAssetDetailPage);

  const onSubmitForm = (values: RetentionFormType, actions: FormikHelpers<RetentionFormType>) => {
    const url = '/Evidences/Retention';
    let body: ExtendRetention[] = [];
    if (values?.RetentionList?.length == 0 && isIndefinite)
      body = GetRetentionList(null, null);
    else
      body = values.RetentionList;
      
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.updateRetentionPolicy(url, body).then(() => {
      props.setOnClose();
      retentionLog(values, body)
      setTimeout(() => {
        dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
      }, 2000);
      if(isAssetDetailPage){
        dispatch(addMetaDataInfoAsync(body[0]?.evidenceId));
      }
      props.showToastMsg({
        message: ((values.RetentionStatus == RetentionStatusEnum.CustomExtention && !isIndefinite) || values.RetentionStatus == RetentionStatusEnum.IndefiniteExtention) ? t("Retention_Extended") : t("Retention_Reverted"),
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
      setIsIndefinite(false);
      dispatch(setLoaderValue({ isLoading: false }));
    })
      .catch((error) => {
        setAlert(true);
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        setResponseError(
          t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
        );
        return error;
      });
    actions.setSubmitting(false);
  }

  const calculateSelectedAssetsLenght = (): number => {
    if ((props.rowData) && (props.items.length > 1)) {
      if(props.items.includes(props.rowData)){
        const distinctiveAssetsByMasterId = props.items.reduce((array, element) => {
          array[element.evidence.masterAssetId] = ++array[element.evidence.masterAssetId] || 0;
          return array;
        }, {});
        const lenghtOfAssets = Object.values(distinctiveAssetsByMasterId).length;
        return lenghtOfAssets;
      }
      return 1;
    }
    else if (!(props.rowData) && (props.items.length > 1)) {
      const distinctiveAssetsByMasterId = props.items.reduce((array, element) => {
        array[element.evidence.masterAssetId] = ++array[element.evidence.masterAssetId] || 0;
        return array;
      }, {});
      const lenghtOfAssets = Object.values(distinctiveAssetsByMasterId).length;
      return lenghtOfAssets;
    }
    else
      return 1;
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
                    {t("Extend")} {calculateSelectedAssetsLenght()} {t("Asset_Groups")}
                  </div>
                   <CRXRadio
                    value={values.RetentionStatus}
                    content={values.RetentionOptions}
                    onChange={(e: any) => RadioButtonOnChange(e, setFieldValue, values.RetentionDays)}
                    />   
                  <Field 
                  parentId="_rentention_field_parent" 
                  id="RetentionDays" 
                  type="number" 
                  value={values.RetentionDays}
                  name="RetentionDays"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeEvent(e, setFieldValue)}
                  disabled={(values.RetentionStatus == RetentionStatusEnum.CustomExtention ? false : true) || isIndefinite}
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
                  <CRXButton type='submit' className='primeryBtn' disabled={isIndefinite ? false : values.SaveButtonIsDisable}>
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
