import React, { useState, useEffect, useRef,useLayoutEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import './caseDetail.scss';
import moment from "moment";
import { AutoCompleteOptionType, TCaseFormType, Case, TCaseEditUserDetail, TCaseDetail, CASE_VIEW_TYPE, CASE_STATE, CASE_ACTION_MENU_PARENT_COMPONENT } from "../CaseTypes";
import { NotificationMessage } from  '../../Header/CRXNotifications/notificationsTypes';
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { CasesAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
import {
  CRXTabs,
  CrxTabPanel,
  CRXButton,
  CRXToaster
} from "@cb/shared";
import CreateCase from "../CreateCase/CreateCase";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import CasesActionMenu from "../CasesLister/CasesActionMenu";
import { setLoaderValue } from "../../../Redux/loaderSlice";

import CaseTimeLine from "./CaseTimeline";
import CaseAuditTrail from './CaseAuditTrail';
import { getTenantSettingsKeyValuesAsync } from "../../../Redux/TenantSettingsReducer";

const caseInitialState: TCaseFormType = {
  RecId:0,
  // Title: "",
  CaseId: "",
  CMT_CAD_RecId: 0,
  CADCsv: [],
  RMSId: "",
  State: {
    id: 0,
    label: ""
  },
  Status:  {
    id: 0,
    label: ""
  },
  CaseLead: { id: 0, label: ""},
  CreationType: {
    id: 0,
    label: ""
  },
  DescriptionPlainText: "",
  DescriptionJson: "",
  ClosedType: {
    id: 0,
    label: ""
  },
};

const userPagerData = {
  gridFilter: {
    logic: "and",
    filters: []
  },
  page: 0,
  size: 10000,
  gridSort: {
    field: "LoginId",
    dir: "asc"
  }
}

const CasesDetail: React.FC = () => {
  const intervalRef = useRef<any>();
  const [casePayload, setCasePayload] =  useState<TCaseFormType>(caseInitialState);
  const [caseLeadAutoCompleteOptions, setCaseLeadAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
  const [statusAutoCompleteOptions, setStatusAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
  const [isFormButtonDisabled, setIsFormButtonDisabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);

  const formValuesRef = useRef<TCaseFormType | undefined>(undefined);
  const createCaseComponentRef = useRef<any>(null);
  const caseTimelineComponentRef = useRef<any>(null);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const isFirstRenderRef = useRef<boolean>(true);
  const caseEditUserDetailRef = useRef<TCaseEditUserDetail | undefined>(undefined);
  const caseLeadAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
  const statusAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
  const caseDetailOriginalRef = useRef<TCaseDetail| null>(null);
  const caseActionMenuDataRef = useRef<any | null>(null);
  const caseClosedIdRef = useRef<any>(null);

  const { id }  = useParams<{ id: string }>();
  const caseId = parseInt(id);

  const { sharingId }  = useParams<{ sharingId: string }>();
  const caseSharingId = isNaN(parseInt(sharingId)) ? 0 : parseInt(sharingId) ;


  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const userList: any = useSelector((state: RootState) => state.userReducer.usersInfo);
  const [modelOpen, setModelOpen] = React.useState<boolean>(false);
  const [caseCloseModelOpen, setCaseCloseModelOpen] = React.useState<boolean>(false);

  const [error, setError] =  useState<boolean>(false);
  const [errorResponseMessage, setErrorResponseMessage] =  useState<string>(
    t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
  );
  const tabItemList = [
    { label: t("CASE_TIMELINE"), index: 0 },
    { label: t("Audit_Trail"), index: 1 },
  ]
  const selectedCaseSharingRef = useRef<any>(null);
  const checkCaseExpired =  (caseId:number)=> {
    CasesAgent.getCase(`/Case/CheckCaseExpired/${caseId}`)
    .then((isExpired: any) => {
      if(isExpired)
      {
        history.push({
          pathname: `/caseExpired`,
        });
      }
    })
    .catch((ex: any) => {           
      history.push('/notfound')
    });
  }

  useEffect(() => {
    if(!isFirstRenderRef.current && userList && Array.isArray(userList.data) ) {
      const formatedUserList = userList.data.map((item: any) => ({
          id: parseInt(item.recId),
          label: item.fName + ' ' + item.lName
      }));
      setCaseLeadAutoCompleteOptions(Array.isArray(formatedUserList) ? formatedUserList : []);
    }
  }, [userList])

  useLayoutEffect(() => {
    const ValidateCase = async () => {
        dispatch(setLoaderValue({isLoading: true}));
        await CasesAgent.getCase(`/Case/CaseAccessValidation/${caseId}`)
        .then((isValid: any) => {
          dispatch(setLoaderValue({isLoading: false}));
          if(isValid) {
            history.push({
              pathname: `/accessDenied`,
             });
          } 
        })
        .catch((err: any) => {     
          dispatch(setLoaderValue({isLoading: false}));      
          showToastMsg({ message: t(`Something_went_wrong`), variant: 'error', duration: 7000 });
          console.error(err)
        });
      }
      ValidateCase();
  },[])

  useEffect(() => {
    if(caseId > 0) {
      getTheCaseForUpdate();
    }
  },[id]);

  useEffect (() => {
    statusAutoCompleteOptionsRef.current = statusAutoCompleteOptions;
    caseLeadAutoCompleteOptionsRef.current = caseLeadAutoCompleteOptions;
    if(!isFirstRenderRef.current) {
      fillCaseAutoCompletes(casePayload);
    }
  },[statusAutoCompleteOptions, caseLeadAutoCompleteOptions]);

  useEffect(() => {
    isFirstRenderRef.current = false;
    dispatch(getUsersInfoAsync(userPagerData));
    dispatch(getTenantSettingsKeyValuesAsync());
    async function fetchAllDropDownsData() {
      await CasesAgent.getAllDropDownValues('/Case/GetAllDropDownValues')
      .then((response: any) => {
        if(response != null && Array.isArray(response.caseStatus))
       {
          const itemToRemoveIndex = response.caseStatus.findIndex(function(item:any) {
            return item.label === "Closed";
          });
          
          if(itemToRemoveIndex > -1){
            response.caseStatus.splice(itemToRemoveIndex, 1);
          }
          setStatusAutoCompleteOptions(response.caseStatus);
        }
      })
      .catch(() => {});
    }
    fetchAllDropDownsData();

    intervalRef.current = setInterval(() => {
      checkCaseExpired(caseId);
    }, 30000);

    return () => {
        clearInterval(intervalRef.current);
         };
  }, []);

  const getCaseSharingResponse = (res:any) => {
      const caseInternalSharingPermission  = {
        id: res.id,
        userId: res.userId,
        caseTitle: res.title
      }
      selectedCaseSharingRef.current = caseInternalSharingPermission;
  }

  const GetCaseClosedResponse = (res:any) => {
    if (res && res.caseClosed && res.caseClosed.length > 0) {
      let caseCloseId = res.caseClosed.map((x:any) => x.id).toString();
      caseClosedIdRef.current = Number(caseCloseId);
    } else {
      caseClosedIdRef.current = 0
    }
  }

  const getTheCaseForUpdate = ()=> {
    dispatch(setLoaderValue({isLoading: true}));    
    CasesAgent.getCase(`/Case/${caseId}/${caseSharingId}`)
    .then((Case: any) => {
      dispatch(setLoaderValue({isLoading: false}));
      const casePayloadCopy = {...casePayload};
      casePayloadCopy.CaseId = Case.title;
      casePayloadCopy.RecId= Case.id;
      casePayloadCopy.CMT_CAD_RecId = Case.CMT_CAD_RecId;
      casePayloadCopy.CADCsv = []//Case.cadCsv;
      casePayloadCopy.RMSId = Case.rmsId;
      casePayloadCopy.State = { ...casePayloadCopy.State, id : Case.state };
      casePayloadCopy.Status = { ...casePayloadCopy.Status, id: Case.statusId };
      casePayloadCopy.CaseLead = { ...casePayloadCopy.CaseLead, id: Case.userId };
      casePayloadCopy.DescriptionPlainText = Case.description.plainText;
      casePayloadCopy.DescriptionJson = Case.description.formatted;
      caseEditUserDetailRef.current = {
        createdOn: Case.history?.createdOn ?? "",
        updatedOn: Case.history?.modifiedOn ?? "",
        createdById: Case.createdBy ?? 0,
        createdByName: Case.createdByName ?? "",
        closedByName: Case.closedByName ?? ""
      }
      
      caseDetailOriginalRef.current = Case;
      const caseTemplateData = {
        id: Case.id,
        caseId: Case.title + "_" + Case.id,
        caseSummary: Case.description != null ? Case.description.plainText : '',          
        caseLead: Case.userName,                  
        state: Case.state,
        status: Case.statusId,
        userId: Case.userId,
        caseViewType: Case.caseViewType === CASE_VIEW_TYPE.ViewOnly ? CASE_VIEW_TYPE.ViewOnly : CASE_VIEW_TYPE.Contribute,
        stateId: Case.state,
        caseClosed: Case.caseClosed,
        caseTitle : Case.title,
        userName  : Case.userName,
        cadId : Case.cadId,
        statusName : Case.statusName,
        createdOn: Case.history?.createdOn ?? "",
        updatedOn: Case.history?.modifiedOn ?? "",
        caseClosedReasonName : Case.caseClosedReasonName,
        closedByName : Case.closedByName
      }
      caseActionMenuDataRef.current = caseTemplateData;
      getCaseSharingResponse(Case);
      GetCaseClosedResponse(Case);
      setIsViewOnly(Case.caseViewType === CASE_VIEW_TYPE.ViewOnly);
      fillCaseAutoCompletes(casePayloadCopy);
    })
    .catch((ex: any) => {
      dispatch(setLoaderValue({isLoading: false}));
      if(ex.response != null && ex.response.data.includes('expired'))
          history.push({
            pathname: `/caseExpired`,
          });
    });
  }

  const fillCaseAutoCompletes = (casePayloadValues: TCaseFormType) => {
    const casePayloadCopy = {...casePayloadValues};
    if (Array.isArray(statusAutoCompleteOptionsRef.current) && statusAutoCompleteOptionsRef.current.length > 0 && casePayloadCopy.Status != null) {
      let statusFound = statusAutoCompleteOptionsRef.current.find((x: any) => x.id == casePayloadCopy.Status.id);
      if(statusFound != null)
        casePayloadCopy.Status = statusFound;

      if(casePayloadCopy.Status.id == 7 ){
        casePayloadCopy.Status = {
          id:7,
          label: "Closed" 
        }
      }
    }

    if (Array.isArray(caseLeadAutoCompleteOptionsRef.current) && caseLeadAutoCompleteOptionsRef.current.length > 0 && casePayloadCopy.CaseLead != null) {
      for(var user of caseLeadAutoCompleteOptionsRef.current) {
        if(user.id === casePayloadCopy.CaseLead.id) {
          casePayloadCopy.CaseLead = user;
        }
      }
    }
    setCasePayload(casePayloadCopy);
  }

  const updateCase=(caseBody:any,setSubmitting: (isSubmitting: boolean) => void)=>{
    dispatch(setLoaderValue({isLoading: true}));    
    CasesAgent.editCase(`/Case/${caseId}`,caseBody).then((response: number) => {
      showToastMsg({ message: t("You_have_updated_the_Case_successfully"), variant: "success" });
      dispatch(setLoaderValue({isLoading: false}));
      setSubmitting(false);
      getTheCaseForUpdate();
    })
      .catch((e: any) => {
        setSubmitting(false);
        dispatch(setLoaderValue({isLoading: false}));      
        showToastMsg({ message: e.response.data.toString(), variant: "error" });        
        if(e?.response?.data.includes('has been closed'))
        {                   
            setTimeout(()=> { getTheCaseForUpdate()  },1000);            
        }
        console.error(e);
      });
  }
  
  const onSubmit= (values: TCaseFormType, setSubmitting: (isSubmitting: boolean) => void) => {
    let caseBody: Case = {
      RecId: caseId,
      Title: values.CaseId,
      CMT_CAD_RecId:0,
      CADCsv: "",
      RMSId:"",
      State: values.State.id,
      StatusId: values.Status.id,
      CreationType: caseDetailOriginalRef.current?.creationType ?? 0,
      ClosedType: caseDetailOriginalRef.current?.closedType ?? 0,
      Description:{
        Formatted:  values.DescriptionJson, //ask kareem bhai
        PlainText: values.DescriptionPlainText
      },
      CreatedBy: caseEditUserDetailRef.current?.createdById ?? 0,
      UpdatedBy: parseInt(localStorage.getItem('User Id') ?? "0"),
      UserId: values.CaseLead.id,
    }
    if(caseId > 0 && isViewOnly == false){
     updateCase(caseBody,setSubmitting);
    }
  }
  const showToastMsg = (obj: any) => {
    toasterRef.current.showToaster({
      message: (obj.message),
      variant: obj.variant,
      duration: 2000,
      clearButtton: true,
    });

    let notificationMessage: NotificationMessage = {
      title: t("Case_Detail"),
      message: t(obj.message),
      type: "success",
      date: moment(moment().toDate())
        .local()
        .format("YYYY / MM / DD HH:mm:ss"),
    };
    dispatch(addNotificationMessages(notificationMessage));
  };

  const updateFormValues = (values: any) => {
    if(values != null)
      formValuesRef.current = values;
  }

  const isFormValid = (isInvalid: boolean) => {
    setIsFormButtonDisabled(isInvalid);
  }

  const navigateToCaseLister = () => {
    history.push(urlList.filter((item: any) => item.name === urlNames.cases)[0].url);
  }

  const onTabChange = (event: any, value: number) => {
    if(typeof value === "number")
      setActiveTab(value);
  }

  const onSaveButtonClick = () => {
    if(createCaseComponentRef.current != null && createCaseComponentRef.current.formikElementRef != null) {
      createCaseComponentRef.current.formikElementRef.submitForm();
    }
  }

  const onCancelButtonClick = () => {
    navigateToCaseLister();
  }

  const onCloseButtonClick = () => {
    navigateToCaseLister();
  }

  const updateCaseTimelineData = (timeline: any) => {
    if(timeline != null && caseDetailOriginalRef.current != null)
      caseDetailOriginalRef.current.caseTimeline = timeline;
  }

  const highlightAssetByReference = (value: string) => {
    if(typeof caseTimelineComponentRef.current.highlightAssetByReference === "function")
      caseTimelineComponentRef.current.highlightAssetByReference(value);
  }

   return (
    <div>
      <div className="caseDetailHeaderButtonContainer">       
          <CasesActionMenu
            row={caseActionMenuDataRef.current}
            menuItems={[]}
            offsetX={5}
            offsetY={-5}
            className=''
            hasEditMenu={true}
            showToastMsg={(obj: any) => showToastMsg(obj)}
            callBack={getTheCaseForUpdate}
            parentComponent={CASE_ACTION_MENU_PARENT_COMPONENT.CaseDetail}
          />          
      </div>
      <div className="caseDetail">
       <CRXToaster ref={toasterRef} className="assetsBucketToster" />
       <div className= {casePayload.State.id != CASE_STATE.Closed ? "caseDetailCenterPanel" : "caseDetailCenterPanel AuditTabDisabled"}>
        <CreateCase ref={createCaseComponentRef} isEdit={true} formValues={formValuesRef.current} formInitialState={casePayload}
          caseLeadAutoCompleteOptions={caseLeadAutoCompleteOptions} statusAutoCompleteOptions={statusAutoCompleteOptions}
          cadCsvAutoCompleteOptions = {[]} editDetails={caseEditUserDetailRef.current} isViewOnly={isViewOnly}
          updateFormValues={updateFormValues} onSubmit={onSubmit} validationCallback={isFormValid} selectedAssets={caseDetailOriginalRef.current?.caseAssets ?? []}
          highlightAssetByReference={(value: string) => highlightAssetByReference(value)}/>

        <CRXTabs value={activeTab} onChange={(e: any, value: any) => onTabChange(e, value)} tabitems={casePayload.State.id != CASE_STATE.Closed ? tabItemList : tabItemList.filter(x=> x.index != 0)} stickyTab={130}/>
        {casePayload.State.id != CASE_STATE.Closed ? 
          <CrxTabPanel value={activeTab} index={0}>
            <CaseTimeLine ref={caseTimelineComponentRef} caseId={caseId} showToastMsg={(obj: any) => showToastMsg(obj)} isViewOnly={isViewOnly}
              timeline={Array.isArray(caseDetailOriginalRef.current?.caseTimeline) ? caseDetailOriginalRef.current?.caseTimeline ?? [] : []}
              updateCaseTimelineData={updateCaseTimelineData} />
          </CrxTabPanel>
        : null}
        
        <CrxTabPanel value={activeTab} index={casePayload.State.id != CASE_STATE.Closed ? 1 : 0}>
          <CaseAuditTrail caseId={caseId} showToastMsg={(obj: any) => showToastMsg(obj)} caseDetailOriginalRef = {caseDetailOriginalRef.current} 
        />
        </CrxTabPanel>

        <div className="caseDetailFooterButtonContainer">
          <div className="caseDetailFooterButtonSubContainer">
            <CRXButton
              disabled={isFormButtonDisabled || isViewOnly === true}
              className="caseDetailButton secondary"
              color="secondary"
              variant="outlined"
              onClick={onSaveButtonClick}
            >
              {t("Save")}
            </CRXButton>
          </div>

          <CRXButton
            className="caseDetailButton secondary"
            color="secondary"
            variant="outlined"
            onClick={onCloseButtonClick}
          >
            {t("Close")}
          </CRXButton>
        </div>
       </div>
      </div>
    </div>
  );
}
export default CasesDetail;


