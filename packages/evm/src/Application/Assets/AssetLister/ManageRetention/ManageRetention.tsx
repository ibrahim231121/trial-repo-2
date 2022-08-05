import React, {  useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { CRXRadio,CRXButton,CRXAlert,CRXConfirmDialog } from '@cb/shared';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { addNotificationMessages } from '../../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../../Header/CRXNotifications/notificationsTypes';
import moment from "moment";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { Evidence, ExtendRetention } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../../utils/urlList";
import { useHistory, useParams } from "react-router";


type ManageRetentionProps = {
  items: any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg:(obj: any) => any;
};

const cookies = new Cookies();

const ManageRetention: React.FC<ManageRetentionProps> = (props) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState(true);
  
  
  
  type Retentionmodel = {
    value: string;
    label: string;
    Comp: any;
  };
  type assetModel = {
    master: any,
    children: any
  }
  type stationModel = {
    CMTFieldValue: number
  }
  type RetentionPolicyModel = {
    CMTFieldValue: number
  }

  
  const [retention, setRetention] = React.useState<string>("")
  const [currentRetention, setCurrentRetention] = React.useState<string>("-")
  const [originalRetention, setOriginalRetention] = React.useState<string>("-")
  const [isOpen,setIsOpen] = React.useState<boolean>(false);
  
  const [retentionList, setRetentionList] = React.useState<ExtendRetention[]>([])
  
  const [retentionDays, setRetentionDays] = React.useState<number>(0)
  const [responseError,setResponseError] = React.useState<string>('');
  const [response,setResponse] = React.useState<Evidence>();
  const [alert,setAlert] = React.useState<boolean>(false);
  const alertRef = useRef(null);
  let retentionRadio = [
    {
      value: "1", label: `${t("Extend_retention_by_days")}`, Comp: () => { }
    },
    {
      value: "2", label: `${t("Extend_retention_Indefinitely")}`, Comp: () => { }
    }
  ]

  const [retentionOpt, setRetentionOpt] = React.useState<Retentionmodel[]>(retentionRadio)

  React.useEffect(() => {
    
    if (retentionList.length > 0) {
      sendData();
    }
  }, [retentionList]);

  React.useEffect(() => {
    
    if (props.items.length <= 1)
      getRetentionData();

  }, []);
  React.useEffect(() => {
    if (retention != "") {
      setButtonState(false);
    }
    if (retention != "1") {
      
      setRetentionDays(0);
    }

  }, [retention]);

  useEffect(() => {
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
  useEffect(() => {
    const alertClx: any = document.getElementsByClassName("crxAlertUserEditForm");
    const optionalSticky: any = document.getElementsByClassName("optionalSticky");
    const altRef = alertRef.current;

    if (alert === false && altRef === null) {

      alertClx[0].style.display = "none";
    } else {
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
  const getRetentionData = async () => {
    EvidenceAgent.getEvidence(props.rowData.id).then((response: Evidence) => {
      setResponse(response);
      setOriginalRetention("Original Retention: " + moment(response.retainUntil).format('DD-MM-YYYY HH:MM:ss'));
      if (response.extendedRetainUntil != null) {
        console.log('curr_ret_moment ',moment(response.extendedRetainUntil).format('DD-MM-YYYY'));
        if(moment(response.extendedRetainUntil).format('DD-MM-YYYY') == "31-12-9999")
        {
          setCurrentRetention("Current Retention: Indefinite");
        }
        else
        {
        setCurrentRetention("Current Retention: " + moment(response.extendedRetainUntil).format('DD-MM-YYYY HH:MM:ss'));
        }
        setRetentionOpt((prev: any) => [...prev, { value: "3", label: `${t("Revert_to_original_retention")}`, Comp: () => { } }])
      }
    });
  }
  const history  = useHistory();
  const onSubmitForm = async () => {
    console.log('Props_Items', props.items[0]);

    if (props.filterValue?.length !== 0) {
    }
    var sdaasd = [...retentionList];
    if (props.items.length > 1) {
      props.items.forEach((el) => {
        var evidenceData: ExtendRetention = {
          id: el.evidence.id,
          extendedDays: retentionDays
        }
        sdaasd.push(evidenceData)
      })
    }
    else
    {
      var evidenceData: ExtendRetention = {
        id: props.rowData.id,
        extendedDays: retentionDays
      }
      sdaasd.push(evidenceData)
    }
    setRetentionList(sdaasd)


  };
  const sendData = async () => {
    const url = '/Evidences/Retention/' + `${retention}`
    EvidenceAgent.updateRetentionPolicy(url, retentionList).then(() => {
      props.setOnClose();
      props.showToastMsg({
        message: (retention == "1" || retention == "2") ? "Retention Extended":"Retention Reverted",
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
    })
    .catch(function (error) {
      setAlert(true);
      setResponseError(
        "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
      );
      return error;
    })
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` },
      body: JSON.stringify(retentionList)
    })
      .then(function (res) {
        
        if (res.ok) {
          props.setOnClose();
          props.showToastMsg({
            message: (retention == "1" || retention == "2") ? t("Retention_Extended"): t("Retention_Reverted"),
            variant: "success",
            duration: 7000,
            clearButtton: true,
          });
          
        } else if (res.status == 500) {
          setAlert(true);
          setResponseError(
            t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
          );
        }
      })
      .catch(function (error) {
        return error;
      })
  }

  const cancelBtn = () => {
    if(retention != "" || retentionDays > 0){
      setIsOpen(true);
    }
    else
    {
      props.setOnClose();
    }
  };

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
      <div style={{ height: "270px" }}>
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div >
                <div>{t("Extend")} {props.items.length > 1 ? props.items.length : 1} {t("Assets")}</div>
                <CRXRadio
                  className='crxEditRadioBtn'
                  disableRipple={true}
                  content={retentionOpt}
                  value={retention}
                  setValue={setRetention}
                />

                <input type="number" disabled={retention == "1" ? false : true} value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))} />
              </div>
              <div>
                <h4>{t("Original_Retention:")} {originalRetention}</h4>
                <h4>{t("Current_Retention:")} {currentRetention}</h4>
                <br></br>
                <br></br>

              </div>

              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className='primeryBtn' disabled={buttonState}>
                  {t("Save")}
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                    {t("Cancel")}
                  </CRXButton>
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
          <div className="confirmMessageBottom">
          {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
          </div>
        </div>
      </CRXConfirmDialog>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ManageRetention;
