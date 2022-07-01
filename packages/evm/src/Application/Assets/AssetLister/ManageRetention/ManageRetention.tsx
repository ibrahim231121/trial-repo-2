import React, {  useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXRadio,CRXButton,CRXAlert } from '@cb/shared';
import { useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { USER_INFO_GET_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { EVIDENCE_SERVICE_URL } from "../../../../utils/Api/url";
import { addNotificationMessages } from '../../../../Redux/notificationPanelMessages';
import { NotificationMessage } from '../../../Header/CRXNotifications/notificationsTypes';
import moment from "moment";
import { log } from 'console';
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import { Evidence, ExtendRetention } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';

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
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  
  
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
  
  const [retentionList, setRetentionList] = React.useState<ExtendRetention[]>([])
  
  const [retentionDays, setRetentionDays] = React.useState<number>(0)
  const [responseError,setResponseError] = React.useState<string>('');
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
    if (retentionList.length >= 0) {
      sendData();
    }
  }, [retentionList]);

  React.useEffect(() => {
    if (props.items.length <= 1)
      getRetentionData();

  }, []);
  React.useEffect(() => {
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

  const getRetentionData = async () => {
    EvidenceAgent.getEvidence(props.rowData.id).then((response: Evidence) => {
      setOriginalRetention(moment(response.retainUntil).format('DD-MM-YYYY HH:MM:ss'));
      if (response.extendedRetainUntil != null) {
        debugger;
        console.log('curr_ret_moment ',moment(response.extendedRetainUntil).format('DD-MM-YYYY'));
        if(moment(response.extendedRetainUntil).format('DD-MM-YYYY') == "31-12-9999")
        {
          setCurrentRetention("Indefinite");
        }
        else
        {
        setCurrentRetention(moment(response.extendedRetainUntil).format('DD-MM-YYYY HH:MM:ss'));
        }
        setRetentionOpt((prev: any) => [...prev, { value: "3", label: `${t("Revert_to_original_retention")}`, Comp: () => { } }])
      }
    });
  }
  const onSubmitForm = async () => {
    console.log('Props_Items', props.items[0]);

    if (props.filterValue?.length !== 0) {
    }
    debugger;
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
  }

  const cancelBtn = () => {
    props.setOnClose();
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
                  <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
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
      </div>
    </>
  );
};

export default ManageRetention;
