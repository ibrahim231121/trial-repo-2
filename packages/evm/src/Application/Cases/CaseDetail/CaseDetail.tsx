import React, { FC, useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import './caseDetail.scss';
import moment from "moment";
import { AutoCompleteOptionType, TCaseFormType, Case, TCaseEditUserDetail, CASE_AUDIT_TYPE, TCaseDetail, TCaseTimeline, CASE_ASSET_TYPE, TCaseNote, CASE_VIEW_TYPE } from "../CaseTypes";
import { NotificationMessage } from  '../../Header/CRXNotifications/notificationsTypes';
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { CasesAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
import {
  CRXTabs,
  CrxTabPanel,
  CRXMultiSelectBoxLight,
  CRXButton,
  CRXToaster,
  TextField,
  CRXHeading,
  CRXRadio,
} from "@cb/shared";
import CreateCase from "../CreateCase/CreateCase";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import CasesActionMenu from "../CasesLister/CasesActionMenu";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { getGroupAsync } from '../../../Redux/GroupReducer';
import CaseInternalSharingPermissionForm from '../CaseInternalSharingPermission/CaseInternalSharingPermissionForm';

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
  size: 100,
  gridSort: {
    field: "LoginId",
    dir: "asc"
  }
}

const CasesDetail: React.FC = () => {

  const [casePayload, setCasePayload] =  useState<TCaseFormType>(caseInitialState);
  const [caseLeadAutoCompleteOptions, setCaseLeadAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
  const [statusAutoCompleteOptions, setStatusAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
  const [isFormButtonDisabled, setIsFormButtonDisabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);

  const formValuesRef = useRef<TCaseFormType | undefined>(undefined);
  const createCaseComponentRef = useRef<any>(null);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const isFirstRenderRef = useRef<boolean>(true);
  const caseEditUserDetailRef = useRef<TCaseEditUserDetail | undefined>(undefined);
  const caseLeadAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
  const statusAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
  const caseDetailOriginalRef = useRef<TCaseDetail| null>(null);
  const [createFormInternalSharing,setCreateFormInternalSharing] = useState<boolean>(false)

  const { id }  = useParams<{ id: string }>();
  const caseId = parseInt(id);

  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const userList: any = useSelector((state: RootState) => state.userReducer.usersInfo);

  const [error, setError] =  useState<boolean>(false);
  const [errorResponseMessage, setErrorResponseMessage] =  useState<string>(
    t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
  );
  const tabItemList = [
    { label: t("CASE_TIMELINE"), index: 0 },
    { label: t("Audit_Trail"), index: 1 },
  ]
  const selectedCaseSharingRef = useRef<any>(null);

  useEffect(() => {
    if(!isFirstRenderRef.current && userList && Array.isArray(userList.data) ) {
      const formatedUserList = userList.data.map((item: any) => ({
          id: parseInt(item.recId),
          label: item.fName + ' ' + item.lName
      }));
      setCaseLeadAutoCompleteOptions(Array.isArray(formatedUserList) ? formatedUserList : []);
    }
  }, [userList])

  useEffect(() => {
    if(caseId > 0) {
      getTheCaseForUpdate(caseId);
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
    // fetchAllDropDownsData();
    dispatch(getUsersInfoAsync(userPagerData));
    async function fetchAllDropDownsData() {
      await CasesAgent.getAllDropDownValues('/Case/GetAllDropDownValues')
      .then((response: any) => {
        if(response != null && Array.isArray(response.caseStatus))
          setStatusAutoCompleteOptions(response.caseStatus);
      })
      .catch(() => {});
    }
    fetchAllDropDownsData();
  }, []);

  const getCaseSharingResponse = (res:any) => {
      const caseInternalSharingPermission  = {
        id: res.id,
        userId: res.userId,
      }
      selectedCaseSharingRef.current = caseInternalSharingPermission;
  }

  const getTheCaseForUpdate = (caseId:number)=> {
    dispatch(setLoaderValue({isLoading: true}));
    CasesAgent.getCase(`/Case/${caseId}`)
    .then((Case: any) => {
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
        createdByName: ""
      }
      caseDetailOriginalRef.current = Case;
      dispatch(setLoaderValue({isLoading: false}));
      getCaseSharingResponse(Case);
      // setIsViewOnly(Case.caseViewType === CASE_VIEW_TYPE.ViewOnly);
      fillCaseAutoCompletes(casePayloadCopy);
    })
    .catch((ex: any) => {
      dispatch(setLoaderValue({isLoading: false}));
    });
  }

  const fillCaseAutoCompletes = (casePayloadValues: TCaseFormType) => {
    const casePayloadCopy = {...casePayloadValues};
    if (Array.isArray(statusAutoCompleteOptionsRef.current) && statusAutoCompleteOptionsRef.current.length > 0 && casePayloadCopy.Status != null) {
      let statusFound = statusAutoCompleteOptionsRef.current.find((x: any) => x.id == casePayloadCopy.Status.id);
      if(statusFound != null)
        casePayloadCopy.Status = statusFound;
    }

    if (Array.isArray(caseLeadAutoCompleteOptionsRef.current) && caseLeadAutoCompleteOptionsRef.current.length > 0 && casePayloadCopy.CaseLead != null) {
      for(var user of caseLeadAutoCompleteOptionsRef.current) {
        if(user.id === casePayloadCopy.CaseLead.id) {
          casePayloadCopy.CaseLead = user;
        }
        if(caseEditUserDetailRef.current != null && user.id === caseEditUserDetailRef.current.createdById) {
          caseEditUserDetailRef.current.createdByName = user.label ?? "";
        }
      }
    }

    setCasePayload(casePayloadCopy);
  }

  const updateCase=(caseBody:any)=>{
    CasesAgent.editCase(`/Case/${caseId}`,caseBody).then((response: number) => {
      showToastMsg({ message: t("You_have_updated_the_Case_successfully"), variant: "success" });
      setTimeout(() => navigateToCaseLister(), 2000);
    })
      .catch((e: any) => {
         setError(true);
         setErrorResponseMessage(e.response.data.toString());
         showToastMsg({ message: e.response.data.toString(), variant: "error" });

        console.error(e);
      });
  }
  const onSubmit= (values: TCaseFormType) => {
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
     updateCase(caseBody);
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

  const groupPagerData = {
    gridFilter: {
        logic: "and",
        filters: []
      },
      page: 0,
      size: 100,
      gridSort: {
        field: "Name",
        dir: "asc"
      }
  }

  const updateOpenModel = () => {
    let modelOpen = true;
    setCreateFormInternalSharing(modelOpen);
    dispatch(getUsersInfoAsync(userPagerData));
    dispatch(getGroupAsync(groupPagerData))
  }

  const onCloseButtonClick = () => {
    navigateToCaseLister();
  }

  const actionMenuItems = [
    {
      label: t('Share_internal'),
      icon: null,
      onClickHandler: updateOpenModel,
    },
    {
      label: t('Share_external'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Share_with-DA'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Request_evidence'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Close_case'),
      icon: null,
      onClickHandler: () => {},
    },
  ]

   return (
    <div>
      {
        createFormInternalSharing &&
       (<CaseInternalSharingPermissionForm id={0}  title={t("Share_Case_Internal")} openModel={updateOpenModel} formValues={selectedCaseSharingRef.current}/>)
      }
      <div className="caseDetailHeaderButtonContainer">
        { isViewOnly == false ?
          <CasesActionMenu
            menuItems={actionMenuItems}
            offsetX={5}
            offsetY={-5}
            className=''
            hasEditMenu={false}
            showToastMsg={(obj: any) => showToastMsg(obj)}
          />
          : null
        }
      </div>
      <div className="caseDetail">
       <CRXToaster ref={toasterRef} className="assetsBucketToster" />
       <div className="caseDetailCenterPanel">
        <CreateCase ref={createCaseComponentRef} isEdit={true} formValues={formValuesRef.current} formInitialState={casePayload}
          caseLeadAutoCompleteOptions={caseLeadAutoCompleteOptions} statusAutoCompleteOptions={statusAutoCompleteOptions}
          cadCsvAutoCompleteOptions = {[]} editDetails={caseEditUserDetailRef.current} isViewOnly={isViewOnly}
          updateFormValues={updateFormValues} onSubmit={onSubmit} validationCallback={isFormValid}/>

        <CRXTabs value={activeTab} onChange={(e: any, value: any) => onTabChange(e, value)} tabitems={tabItemList} stickyTab={130}/>
        <CrxTabPanel value={activeTab} index={0}>
          <CaseTimeLine caseId={caseId} showToastMsg={(obj: any) => showToastMsg(obj)} isViewOnly={isViewOnly}
            timeline={Array.isArray(caseDetailOriginalRef.current?.caseTimeline) ? caseDetailOriginalRef.current?.caseTimeline ?? [] : []} />
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
            <CRXButton
              className="caseDetailButton secondary"
              color="secondary"
              variant="outlined"
              onClick={onCancelButtonClick}
            >
              {t("Cancel")}
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

const filterAutocompleteOptions = [
  {id: 0, label: 'All Entries'},
  {id: 1, label: 'Evidence'},
  {id: 4, label: 'Notes'},
  {id: 3, label: 'Sharing'},
  {id: 6, label: 'Status Update'},
]

type CaseTimeLinePropType = {
  caseId: number,
  isViewOnly: boolean,
  timeline: TCaseTimeline[],
  showToastMsg: (obj: any) => void
}

const CaseTimeLine : FC<CaseTimeLinePropType> = (props) => {

  const [timelineData, setTimelineData] = useState<TCaseTimeline[]>([]);
  const [filteredTimelineData, setFilteredTimelineData] = useState<TCaseTimeline[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchBy, setSearchBy] = useState<AutoCompleteOptionType>(filterAutocompleteOptions[0]);
  const [highlightsData, setHighlightsData] = useState<TCaseTimeline[]>([]);
  const [sortBy, setSortBy] = useState<string>("2");

  const { t } = useTranslation<string>();

  const dispatch = useDispatch();

  const isFirstRenderRef = useRef<boolean>(true);
  const timelineDataRef = useRef<TCaseTimeline[]>([]);
  const highlightsDataRef = useRef<TCaseTimeline[]>([]);
  const sortByRadioOptionsRef = useRef([
    {
      value: "1", label: `${t("OLD")}`, Comp: () => { }
    },
    {
      value: "2", label: `${t("NEW")}`, Comp: () => { }
    }
  ])

  useEffect(() => {
    if(Array.isArray(props.timeline)) {
      setTimelineData(props.timeline);
      getHighlightData(props.timeline);
    }
  }, [props.timeline]);

  useEffect(() => {
    timelineDataRef.current = timelineData.map(item => ({...item}));
    filterTimelineData();
  }, [searchText, searchBy, timelineData])

  useEffect(() => {
    if(!isFirstRenderRef.current) {
      sortTimelineData(filteredTimelineData);
    }
  }, [sortBy])

  useEffect(() => {
    highlightsDataRef.current = highlightsData.map(item => ({...item}));
  }, [highlightsData])

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, [])

  const getCaseTimeline = () => {
    CasesAgent.getCaseTimeline(props.caseId)
    .then(res => {
      if(Array.isArray(res)) {
        setTimelineData(res);
        getHighlightData(res);
      }
    })
    .catch(ex => {})
  }

  const saveCaseNote = (caseNoteData: TCaseNote, item: TCaseTimeline, isHighlightedItem?: boolean) => {
    dispatch(setLoaderValue({isLoading: true}));
    CasesAgent.addCaseNote(`Case/${props.caseId}/CaseNote`, caseNoteData)
    .then((res) => {
      dispatch(setLoaderValue({isLoading: false}));
      if(res != null && typeof props.showToastMsg === "function") {
        getCaseTimeline();
        props.showToastMsg({ message: t("You_have_added_the_note_successfully"), variant: "success" })
        onCancelNoteButtonClick(item, Boolean(isHighlightedItem));
      }
    })
    .catch(ex => {
      dispatch(setLoaderValue({isLoading: false}));
      props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
    });
  }

  const updateCaseNote = (caseNoteData: TCaseNote, item: TCaseTimeline, isHighlightedItem?: boolean) => {
    dispatch(setLoaderValue({isLoading: true}));
    CasesAgent.updateCaseNote(`Case/${props.caseId}/CaseNote/${item.recId}`, caseNoteData)
    .then((res) => {
      dispatch(setLoaderValue({isLoading: false}));
      if(res != null && typeof props.showToastMsg === "function") {
        getCaseTimeline();
        props.showToastMsg({ message: t("You_have_update_the_note_successfully"), variant: "success" })
        onCancelNoteButtonClick(item, Boolean(isHighlightedItem));
      }
    })
    .catch(ex => {
      dispatch(setLoaderValue({isLoading: false}));
      props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
    });
  }

  const deleteCaseNote = (caseNoteId: number) => {
    dispatch(setLoaderValue({isLoading: true}));
    CasesAgent.deleteCaseNote(`Case/${props.caseId}/CaseNote/${caseNoteId}`)
    .then(res => {
      dispatch(setLoaderValue({isLoading: false}));
      if(res != null && typeof props.showToastMsg === "function") {
        getCaseTimeline();
        props.showToastMsg({ message: t("You_have_deleted_the_note_successfully"), variant: "success" })
      }
    })
    .catch(ex => {
      dispatch(setLoaderValue({isLoading: false}));
      props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
    })
  }

  const updateCaseHighlights = (url: string) => {
    dispatch(setLoaderValue({isLoading: true}));
    CasesAgent.updateCaseHighlight(url)
    .then(() => {
      props.showToastMsg({ message: t("You_have_added_item_to_highlight_successfully"), variant: "success" })
      dispatch(setLoaderValue({isLoading: false}));
      getCaseTimeline();
    })
    .catch(ex => {
      dispatch(setLoaderValue({isLoading: false}));
      props.showToastMsg({ message: ex.response.data.toString(), variant: "error" });
    });
  }

  const getHighlightData = (data: TCaseTimeline[]) => {
    const timelineDataCopy = data.map(item => ({...item}));
    const highlightedData = timelineDataCopy.filter(item => {
      if(item.isHighlight === true)
        return true;
      return false;
    });
    if(highlightedData != null) {
      setHighlightsData(highlightedData);
    }
  }

  const filterTimelineData = () => {
    const data = timelineData.map(item => ({...item}));
    const filteredRecords = data.filter(item => {
      if(((searchBy.id == 0 ? true : searchBy.id === item.type) && item.text.toLowerCase().includes(searchText.toLowerCase())) || (item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes))
        return item;
      return false;
    });
    sortTimelineData(filteredRecords);
  }

  const sortTimelineData = (records: TCaseTimeline[]) => {
    try {
      const dataToSort = records.map(item => ({...item}));
      dataToSort.sort((item1, item2) => {
        if(sortBy === "1")
          return moment(item1.timeStamp).valueOf() - moment(item2.timeStamp).valueOf()

        return moment(item2.timeStamp).valueOf() - moment(item1.timeStamp).valueOf()
      })
      if(Array.isArray(dataToSort) && records.length === dataToSort.length) {
        setFilteredTimelineData(dataToSort);
      }
      else {
        setFilteredTimelineData(records);
      }
    }
    catch {
      setFilteredTimelineData(records);
    }
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchText(typeof (value) === "string" ? value : "");
  }

  const onSearchByChange = (e: any, value: any) => {
    e.preventDefault();
    if(value != null)
      setSearchBy(value);
    else
      setSearchBy(filterAutocompleteOptions[0]);
  }

  const onAddNoteClick = () => {
    if(timelineData.find(x => x.recId === -1 && x.type === CASE_AUDIT_TYPE.Notes) == null) {
      const timelineRecordsCopy = timelineData.map(item => ({...item}));
      timelineRecordsCopy.unshift({
        recId: -1,
        text: "",
        type: CASE_AUDIT_TYPE.Notes,
        timeStamp: "Now",
        thumbnail: "",
        assetType: 0,
        detailId: 0,
        sequenceNumber: null,
        isEdit: true,
        isHighlight: false
      })
      setTimelineData(timelineRecordsCopy);
    }
  }

  const onSaveNoteButtonClick = (value: string, item: TCaseTimeline, isHighlightedItem?: boolean) => {
    if(value != null && value.trim() != "" && props.isViewOnly == false) {
      const caseNoteData: TCaseNote = {
        id: "0",
        caseId: props.caseId,
        text: value,
        isHighlight: item.isHighlight
      }
      if(item.recId > -1) {
        caseNoteData.id = item.recId.toString();
        updateCaseNote(caseNoteData, item, isHighlightedItem);
      }
      else if(item.recId === -1) {
        saveCaseNote(caseNoteData, item, isHighlightedItem);
      }
    }
  }

  const onCancelNoteButtonClick = (item: TCaseTimeline, isHighlightedItem: boolean) => {
    if(item != null) {
      if(isHighlightedItem === true) {
        let recordIndex = -1;
        const highlightsCopy = highlightsData.map((item, idx: number) => {
          if(item.recId === item.recId && item.type === CASE_AUDIT_TYPE.Notes) {
            recordIndex = idx;
          }
          return {...item}
        });
        if(recordIndex > -1) {
          highlightsCopy[recordIndex].isEdit = false;
          setHighlightsData(highlightsCopy);
        }
      }
      else {
        let recordIndex = timelineData.findIndex(x => x.recId === item.recId && x.type === CASE_AUDIT_TYPE.Notes);
        const timelineRecordsCopy = timelineData.map((item, idx: number) => {
          if(item.recId === item.recId && item.type === CASE_AUDIT_TYPE.Notes) {
            recordIndex = idx;
          }
          return {...item}
        });
        if(recordIndex > -1) {
          if(item.recId === -1) {
            timelineRecordsCopy.splice(recordIndex, 1);
            setTimelineData(timelineRecordsCopy);
          }
          else {
            timelineRecordsCopy[recordIndex].isEdit = false;
            setTimelineData(timelineRecordsCopy);
          }
        }
      }
    }

  }

  const onEditNoteClick = (item: TCaseTimeline, isHighlightedItem: boolean) => {
    if(item && item.recId > 0) {
      if(isHighlightedItem === true) {
        const highlightsCopy = highlightsDataRef.current.map(item => ({...item}));
        const idx = highlightsCopy.findIndex(a => a.recId === item.recId && a.type === CASE_AUDIT_TYPE.Notes);
        if(idx > -1) {
          highlightsCopy[idx].isEdit = true;
          setHighlightsData(highlightsCopy);
        }
      }
      else {
        const timelineCopy = timelineDataRef.current.map(item => ({...item}));
        const idx = timelineCopy.findIndex(a => a.recId === item.recId && a.type === CASE_AUDIT_TYPE.Notes);
        if(idx > -1) {
          timelineCopy[idx].isEdit = true;
          setTimelineData(timelineCopy);
        }
      }
    }
  }

  const onDeleteCaseNoteClick = (item: TCaseTimeline) => {
    if(item && item.recId > 0) {
      const timelineCopy = [...timelineDataRef.current];
      const idx = timelineCopy.findIndex(a => a.recId === item.recId && a.type === CASE_AUDIT_TYPE.Notes);
      if(idx > -1 && props.isViewOnly == false) {
        deleteCaseNote(item.recId);
      }
    }
  }

  const onUpdateHighlightClick = (item: TCaseTimeline, isHighlight: boolean) => {
    if(item && item.recId > 0 ) {
      let url = '';
      switch(item.type) {
        case CASE_AUDIT_TYPE.Asset:
          url = `Case/${props.caseId}/CaseAsset/UpdateCaseAssetOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
          break;
        case CASE_AUDIT_TYPE.Share:
          url = `Case/${props.caseId}/CaseSharing/UpdateCaseSharingOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
          break;
        case CASE_AUDIT_TYPE.Notes:
          url = `Case/${props.caseId}/CaseNote/UpdateCaseNoteOnHighlight/${item.recId}/${Boolean(isHighlight)}`;
          break;
        default:
          break;
      }
      if(url.trim().length != 0 && props.isViewOnly == false) {
        updateCaseHighlights(url);
      }
    }
  }

  const assetTypeActionMenuItems = [
    {
      label: t('View'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Untag'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Download'),
      icon: null,
      onClickHandler: () => {},
    }
  ]

  const sharingTypeActionMenuItems = [
    {
      label: t('Edit'),
      icon: null,
      onClickHandler: () => {},
    },
    {
      label: t('Delete'),
      icon: null,
      onClickHandler: () => {},
    }
  ]

  const getNoteActionMenuItems = (isHighlightedItem: boolean) => {
    if(isHighlightedItem === true) {
      return [
        {
          label: t('Edit'),
          icon: null,
          onClickHandler: (row: TCaseTimeline) => onEditNoteClick(row, true),
        },
        {
          label: t('Delete'),
          icon: null,
          onClickHandler: (row: TCaseTimeline) => onDeleteCaseNoteClick(row),
        }
      ]
    }
    return [
      {
        label: t('Edit'),
        icon: null,
        onClickHandler: (row: TCaseTimeline) => onEditNoteClick(row, false),
      },
      {
        label: t('Delete'),
        icon: null,
        onClickHandler: (row: TCaseTimeline) => onDeleteCaseNoteClick(row),
      }
    ]
  }

  const getActionMenuItem = (type: number, isHighlightedItem?: boolean) => {
    let menuItems: any[] = [];
    switch(type) {
      case CASE_AUDIT_TYPE.Asset:
        menuItems = [...assetTypeActionMenuItems];
        break;
      case CASE_AUDIT_TYPE.Notes:
        menuItems = getNoteActionMenuItems(Boolean(isHighlightedItem));
        break;
      case CASE_AUDIT_TYPE.Share:
        menuItems = [...sharingTypeActionMenuItems];
        break;
      default:
        break;
    }
    if(menuItems.length > 0) {
      if(isHighlightedItem === true) {
        menuItems.unshift({
          label: t('UnHighlight'),
          icon: null,
          onClickHandler: (row: TCaseTimeline) => onUpdateHighlightClick(row, false),
        })
      }
      else {
        menuItems.unshift({
          label: t('Highlight'),
          icon: null,
          onClickHandler: (row: TCaseTimeline) => onUpdateHighlightClick(row, true),
        })
      }
    }
    return menuItems;
  }

  const getAssetThumbnailContent = (assetType: number, thumbnail: string | null) => {
    switch (assetType) {
      case CASE_ASSET_TYPE.Audio:
      case CASE_ASSET_TYPE.AudioOnly:
        return <i className="fa-regular fa-waveform-lines" />;
      case CASE_ASSET_TYPE.Video:
      case CASE_ASSET_TYPE.Image:
        if(thumbnail != null && thumbnail != "") {
          return <img src={`data:image/jpeg;base64,${thumbnail}`} alt="Alt Text" />
        }
        else {
          return <i className="fas fa-solid fa-file-video" />;
        }
      default:
        return <div className="Unspecified-file-type"><i className="fas fa-solid fa-file" /></div>;
    }
  }

  const getTimelineThumbnailContent = (type: number, assetType: number, thumbnail: string | null) => {
    let content = null;
    switch(type) {
      case CASE_AUDIT_TYPE.Asset:
        content = getAssetThumbnailContent(assetType, thumbnail)
        break;
      case CASE_AUDIT_TYPE.Notes:
        content = <i className="icon icon-notebook" />
        break;
      case CASE_AUDIT_TYPE.Share:
        content = <i className="icon icon-notebook" />
        break;
      case CASE_AUDIT_TYPE.StatusUpdate:
        content = <i className="icon icon-flag3" />
        break;
      default:
        content = <i className="icon icon-flag3" />
        break;
    }
    return content;
  }

  return (
    <div className="caseTimeline-main">
      <div className="caseTimeline-content">
        <div className="caseTimeline-searchArea">
          <TextField
            value={searchText}
            type="text"
            label={t('Search')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e)}
          />
          <div className="caseDetailFilterAutocompleteContainer">
            <CRXMultiSelectBoxLight
              id="searchBy"
              className="caseDetailFilterAutocomplete"
              label= "Search By"
              multiple={false}
              value={ searchBy }
              options={filterAutocompleteOptions}
              onChange={(e: any, value: AutoCompleteOptionType) => onSearchByChange(e, value)}
              onOpen={(e: any) => {
                e.preventDefault();
              }}
              CheckBox={false}
              checkSign={false}
              required={false}
            />
          </div>
        </div>
        <div className="caseTimeline-sectionSeparator">
          <i className='far fa-ellipsis-h'></i>
        </div>
        <div className="caseTimeline-highlightsArea">
          <CRXHeading className="highlightsArea-subHeading" variant="subtitle1" >{t('HIGHLIGHTS')} </CRXHeading>
          {
            highlightsData.map((item, idx: number) => {
              return (
                <div className='caseTimeline-item'
                  key={`caseHighlight-item-${idx}`}>
                  <div className="caseTimeline-item-timestamp">
                    { moment(item.timeStamp).local().format("MM/DD/YYYY HH:mm:ss") }
                    </div>
                  <div className="caseTimeline-item-detailContainer">
                    <div className="caseTimeline-item-thumbnail">
                      { getTimelineThumbnailContent(item.type, item.assetType, item.thumbnail) }
                    </div>
                    <div className="caseTimeline-item-detail">
                      {item.isEdit === true ?
                      (
                        <EditableCaseNote key={`caseHighlight-item-editableNote-${item.recId}-${idx}`} text={item.text}
                          onSave={(value: string) => onSaveNoteButtonClick(value, item)} onCancel={() => onCancelNoteButtonClick(item, true)} />
                      )
                      : <div>
                          { item.type === CASE_AUDIT_TYPE.Asset ?
                              t(item.text)
                            : item.text }
                        </div>
                      }
                    </div>
                    {
                      item.type !== CASE_AUDIT_TYPE.StatusUpdate && props.isViewOnly !== true ?
                      <CasesActionMenu
                        row={item}
                        menuItems={getActionMenuItem(item.type, true)}
                        offsetX={5}
                        offsetY={-24}
                        className=''
                        hasEditMenu={false}
                        showToastMsg={(obj: any) => {}}//showToastMsg(obj)}
                      />
                      : null
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="caseTimeline-sectionSeparator">
          <i className='far fa-ellipsis-h'></i>
        </div>
        <div className="caseTimelineButtonContainer">
          <CRXButton
              className="caseTimelineAddNoteButton secondary"
              color="secondary"
              variant="outlined"
              onClick={() => onAddNoteClick()}
              disabled={props.isViewOnly === true}
            >
              {t("Add Note")}
          </CRXButton>
          <div className="caseTimelineSortbyContainer">
            <CRXHeading variant="subtitle1" className="label">
              {t("Sort_By")}
            </CRXHeading>
            <CRXRadio
              className='caseTimelineSortByRadioBtn'
              disableRipple={true}
              content={sortByRadioOptionsRef.current}
              value={sortBy}
              setValue={(value: string) => { value === "2" ? setSortBy(value) : setSortBy("1") }}
            />
          </div>
        </div>
        <div className="caseTimeline-detail">
          {
            filteredTimelineData.map((item, idx: number) => {
              return (
                <div className={`caseTimeline-item ${item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes ? '--temporaryHeight' : ''}`}
                  key={`caseTimeline-item-${idx}`}>
                  <div className="caseTimeline-item-timestamp">
                    { item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes ? item.timeStamp : moment(item.timeStamp).local().format("MM/DD/YYYY HH:mm:ss") }
                    </div>
                  <div className="caseTimeline-item-detailContainer">
                    <div className="caseTimeline-item-thumbnail">
                      { getTimelineThumbnailContent(item.type, item.assetType, item.thumbnail) }
                    </div>
                    <div className="caseTimeline-item-detail">
                      {item.isEdit === true ?
                      (
                        <EditableCaseNote key={`caseTimeline-item-editableNote-${item.recId}-${idx}`} text={item.text}
                          onSave={(value: string) => onSaveNoteButtonClick(value, item)} onCancel={() => onCancelNoteButtonClick(item, false)} />
                      )
                      : <div>
                          { item.type === CASE_AUDIT_TYPE.Asset ?
                              t(item.text)
                            : item.text }
                        </div>
                      }
                    </div>
                    {
                      item.type !== CASE_AUDIT_TYPE.StatusUpdate && !(item.recId === -1 && item.type === CASE_AUDIT_TYPE.Notes)
                        && props.isViewOnly !== true ?
                      <CasesActionMenu
                        row={item}
                        menuItems={getActionMenuItem(item.type)}
                        offsetX={5}
                        offsetY={-24}
                        className=''
                        hasEditMenu={false}
                        showToastMsg={(obj: any) => {}}//showToastMsg(obj)}
                      />
                      : null
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

type EditableCaseNoteType = {
  text: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const EditableCaseNote: FC<EditableCaseNoteType> = (props) => {
  const [value, setValue] = useState<string>(props.text);

  const { t } = useTranslation<string>();

  const onValueChange = (e: any) => {
    if(e != null && e.target && typeof(e.target.value) === "string") {
      e.preventDefault();
      setValue(e.target.value);
    }
  }

  return (
    <>
      <TextField
        id="addNote"
        key="addNote"
        label={t('Note')}
        required={false}
        value={ value }// ? temporaryNoteValue : item.text}
        onChange={(e: any) => onValueChange(e)}
        disabled = {false}
        type="text"
        multiline
        variant="outlined"
        rows={1}
      />
      <div className="caseTimeline-item-noteButtonContainer">
        <CRXButton
          className="caseDetailButton secondary"
          color="secondary"
          variant="outlined"
          onClick={() => props.onSave(value)}
        >
          {t("Save")}
        </CRXButton>
        <CRXButton
          className="caseDetailButton secondary"
          color="secondary"
          variant="outlined"
          onClick={() => props.onCancel()}
        >
          {t("Cancel")}
        </CRXButton>
      </div>
    </>
  )
}
