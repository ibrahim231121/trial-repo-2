import { FC, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { AutoCompleteOptionType, Case, CASE_STATE, CASE_CLOSED_TYPE, CASE_CREATION_TYPE, TCaseAsset, TCaseFormType, CASE_ASSET_TYPE, CaseSearchEvidenceData, CASE_SEARCH_BY } from "../CaseTypes";
import { CasesAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import { CRXButton, CRXToaster, CRXCheckBox, CRXTabs, CrxTabPanel, CRXContainer } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import { loadFromLocalStorage } from "../../../Redux/AssetActionReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import CreateCase from "./CreateCase";
import './CreateCaseWizard.scss';
import randomNumberGenerator from "../../Assets/utils/numberGenerator";
import CaseSearchEvidence from './CaseSearchEvidence';
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import CaseAsset from "./CaseAsset";
import { getAssetTypeEnumValue, getChildAssetsSequenceNumber } from "../utils/globalFunctions";
import { CheckEvidenceExpire } from "../../../GlobalFunctions/CheckEvidenceExpire";
interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  assetType: string;
  recordingStarted: string;
  categories: string[];
  evidence: any;
}

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

const caseInitialState: TCaseFormType = {
  RecId:0,
  CaseId: "",
  CMT_CAD_RecId: 0,
  CADCsv: [],
  RMSId: "",
  State: { id: 0, label: "" },
  CaseLead: { id: 0, label: "" },
  Status:  { id: 0, label: "" },
  CreationType: { id: 0, label: "" },
  DescriptionPlainText: "",
  DescriptionJson: "",
  ClosedType: { id: 0, label: "" }
};

enum CASE_WIZARD_TAB {
  searchEvidence = 0,
  assetBucket = 1,
  caseInfomation = 2
}

const CreateCaseWizard = () => {

    const [isFormButtonDisabled, setIsFormButtonDisabled] = useState<boolean>(true);
    const [tabValue, setTabValue] = useState<number>(CASE_WIZARD_TAB.searchEvidence);

    const [caseLeadAutoCompleteOptions, setCaseLeadAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
    const [statusAutoCompleteOptions, setStatusAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
    const [, setUpdateState] = useState<boolean>(true);

    const { t } = useTranslation<string>();
    const history = useHistory();
    const dispatch = useDispatch();

    const toasterRef = useRef<typeof CRXToaster>(null);
    const stepperButtonContainerRef = useRef<HTMLDivElement | null>(null);
    const formValuesRef = useRef<TCaseFormType>(caseInitialState);
    const isFirstRenderRef = useRef<boolean>(true);
    const createCaseComponentRef = useRef<any>(null);
    const caseSearchEvidenceDataRef = useRef<CaseSearchEvidenceData>({
      searchBy: CASE_SEARCH_BY.userAndDate,
      cadId: {id: 0, label: ""},
      users: [],
      startDate: "",
      endDate: "",
    });
    const selectedAssetsFromSearchRef = useRef<SearchModel.Evidence[]>([]);
    const selectedAssetsFromBucketRef = useRef<AssetBucket[]>([]);

    const userList: any = useSelector((state: RootState) => state.userReducer.usersInfo);

    useEffect(() => {
      if(!isFirstRenderRef.current) {
        const statusValue = statusAutoCompleteOptions.find(x => x.label?.toLocaleLowerCase() === "new");
        if(statusValue != null && formValuesRef.current != null) {
          formValuesRef.current.Status = statusValue;
        }
        const currentUserId = parseInt(localStorage.getItem('User Id') ?? "0");
        const caseLead = caseLeadAutoCompleteOptions.find(x => x.id === currentUserId);
        if(caseLead != null) {
          formValuesRef.current.CaseLead = caseLead;
        }
        setUpdateState(prevState => !prevState);
      }
    }, [caseLeadAutoCompleteOptions, statusAutoCompleteOptions])

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
      isFirstRenderRef.current = false;
      formValuesRef.current.CaseId = generateUniqueCaseId();
      fetchAllDropDownsData();
      dispatch(loadFromLocalStorage()); // on load check asset bucket exists in local storage
      dispatch(getUsersInfoAsync(userPagerData));
    }, [])
  
    const fetchAllDropDownsData = async () => {
      await CasesAgent.getAllDropDownValues('/Case/GetAllDropDownValues')
      .then((response: any) => {
        if(response != null && Array.isArray(response.caseStatus)) {
          const statusAutoComplete = response.caseStatus.map((item: any) => ({
            id: item.id,
            label: item.label
          }));
          if(Array.isArray(statusAutoComplete)) {
            const itemToRemoveIndex = statusAutoComplete.findIndex(function(item) {
              return item.label === "Closed";
            });
            
            if(itemToRemoveIndex > -1){
              statusAutoComplete.splice(itemToRemoveIndex, 1);
            }
            setStatusAutoCompleteOptions(statusAutoComplete);
          }
        }
      })
      .catch(() => {});
    }

    const tabs = [
      { label: t("SEARCH_EVIDENCE"), index: 0 },
      { label: t("ASSET_BUCKET"), index: 1 },
      { label: t("CASE_INFORMATION"), index: 2 },
    ];
  
    const getCaseAssets = () => {
      const caseAssetsList: TCaseAsset[] = [];
      let sequenceNumber = 0;
      sequenceNumber = getAssetsFromSearch(sequenceNumber, caseAssetsList);
      getAssetsFromBucket(sequenceNumber, caseAssetsList);
      return caseAssetsList;
    }

    const getAssetsFromSearch = (sequenceNumber: number, caseAssetsList: TCaseAsset[]) => {
      Array.isArray(selectedAssetsFromSearchRef.current) && selectedAssetsFromSearchRef.current.length > 0 &&
      selectedAssetsFromSearchRef.current.forEach((item) => {
        if(caseAssetsList.findIndex(x => x.assetId === item.masterAsset.assetId) === -1 && !CheckEvidenceExpire(item)) {
          sequenceNumber++;
          addAssetToCaseAssetList(item.id, item.masterAsset, sequenceNumber.toString(), caseAssetsList);
          const childAssets = item.asset.filter(x => x.assetId != item.masterAsset.assetId);
          if(Array.isArray(childAssets)) {
            childAssets.forEach((obj, idx) => {
              const formattedSequence = getChildAssetsSequenceNumber((idx + 1).toString(), 3);
              addAssetToCaseAssetList(item.id, obj, sequenceNumber + '_' + formattedSequence, caseAssetsList);
            });
          }
        }
      });
      return sequenceNumber;
    }

    const getAssetsFromBucket = (sequenceNumber: number, caseAssetsList: TCaseAsset[]) => {
      Array.isArray(selectedAssetsFromBucketRef.current) && selectedAssetsFromBucketRef.current.length > 0 &&
      selectedAssetsFromBucketRef.current.forEach((item) => {
        if(caseAssetsList.findIndex(x => x.assetId === item.assetId) === -1 && !CheckEvidenceExpire(item.evidence)) {
          sequenceNumber++;
          let masterAsset: SearchModel.Asset | null = null;
          const childAssets: SearchModel.Asset[] = [];

          if(item.evidence && Array.isArray(item.evidence.asset)) {
            const assets = item.evidence.asset;
            for(let i = 0; i < assets.length; i++) {
              if(assets[i].assetId === item.assetId) {
                masterAsset = assets[i];
              }
              else {
                childAssets.push(assets[i]);
              }
            }
          }

          if(masterAsset != null)
            addAssetToCaseAssetList(item.evidence.id, masterAsset, sequenceNumber.toString(), caseAssetsList);
          if(Array.isArray(childAssets) && childAssets.length > 0) {
            childAssets.forEach((obj, idx) => {
              const formattedSequence = getChildAssetsSequenceNumber((idx + 1).toString(), 3);
              addAssetToCaseAssetList(item.id, obj, sequenceNumber + '_' + formattedSequence, caseAssetsList);
            });
          }
        }
      });
    }

    const addAssetToCaseAssetList = (evidenceId: number, asset: SearchModel.Asset, sequenceNumber: string, caseAssetList: TCaseAsset[]) => {
      caseAssetList.push({
        id: '0',
        caseId: 0,
        assetId: asset.assetId,
        evidenceId: evidenceId,
        notes: '',
        sequenceNumber: sequenceNumber.toString(),
        assetName: asset.assetName,
        assetType: getAssetTypeEnumValue(asset.assetType) ?? CASE_ASSET_TYPE.Others,
        fileId: asset?.files[0]?.filesId,
        fileName: asset?.files[0]?.fileName ?? "",
        fileType: asset?.files[0]?.type,
      });
    }
  
    const onSubmit= (values: TCaseFormType, setSubmitting: (isSubmitting: boolean) => void) => {
      let caseBody: Case = { 
        RecId:0,
        Title: values.CaseId,
        CMT_CAD_RecId:0,
        CADCsv: "",//values.CADCsv,
        RMSId: "",
        State: CASE_STATE.Open,
        StatusId: values.Status.id,
        CreationType: CASE_CREATION_TYPE.Manual,
        ClosedType: CASE_CLOSED_TYPE.Null,
        Description:{
          Formatted:  values.DescriptionJson,
          PlainText: values.DescriptionPlainText 
        },
        CreatedBy: parseInt(localStorage.getItem('User Id') ?? "0"),
        UpdatedBy: 0,
        UserId: values.CaseLead.id,
        CaseAssets: getCaseAssets()
      }
      CasesAgent.addCase('/Case',caseBody)
        .then((response: string) => {
          showToastMsg(t("You_have_saved_the_Case_successfully"),"success");
          setTimeout(() => {
            navigateToCaseDetail(response);
            setSubmitting(false);
          }, 2000);
        })
        .catch((e: any) => {
          setSubmitting(false);
          showToastMsg(t(e.response.data ?? "Something_went_wrong"),"error");
          console.error(e);
        });
    }
  
    const navigateToCases = () => {
      history.push(
        urlList.filter((item: any) => item.name === urlNames.cases)[0].url
      );
    };

    const navigateToCaseDetail = (id: string) => {
      const path = `${urlList.filter((item: any) => item.name === urlNames.editCase)[0].url}`;
      history.push(path.substring(0, path.lastIndexOf("/")) + "/" + id);
    }
  
    const showToastMsg = (message: string, variant: string) => {
      toasterRef.current.showToaster({
        message: (message),
        variant: variant,
        duration: 4000,
        clearButtton: true,
      });
  
      let notificationMessage: NotificationMessage = {
        title: t("Case_Detail"),
        message: t("You_have_saved_the_Case_successfully"),
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    };

    const generateUniqueCaseId = () => {
      const randomNumGenerated = randomNumberGenerator();
      return `${new Date().getUTCFullYear()}-${Math.floor(100000 + randomNumGenerated * 900000)}`
    }
  
    const updateFormValues = (values: any) => {
      if(values != null)
        formValuesRef.current = values; 
    }

    const isFormValid = (isInvalid: boolean) => {
      setIsFormButtonDisabled(isInvalid);
    }

    const onCancelClick = () => {
      navigateToCases();
    }

    const onBackClick = () => {
      setTabValue((prevState) => prevState - 1 > 0 ? prevState - 1 : CASE_WIZARD_TAB.searchEvidence);
    }

    const onSkipClick = () => {
      const users = [...caseSearchEvidenceDataRef.current.users];
      for(let i = 0; i < users.length; i++) {
        users[i].selectedAssets = [];
      }
      selectedAssetsFromSearchRef.current = [];
      selectedAssetsFromBucketRef.current = [];
      setTabValue(CASE_WIZARD_TAB.caseInfomation);
    }

    const onNextClick = () => {
      setTabValue((prevActiveStep) => (prevActiveStep + 1) <= 2 ? (prevActiveStep + 1) : CASE_WIZARD_TAB.caseInfomation);
    }

    const onCreateCaseClick = () => {
      if(createCaseComponentRef.current != null && createCaseComponentRef.current.formikElementRef != null) {
        createCaseComponentRef.current.formikElementRef.submitForm();
      }
    }

    const handleTabChange = (event: any, newValue: number) => setTabValue(newValue);

    const updateCaseSearchEvidenceData = <TKey extends keyof CaseSearchEvidenceData>(field: TKey, value: CaseSearchEvidenceData[TKey]) => {
      caseSearchEvidenceDataRef.current[field] = value;
      console.log(caseSearchEvidenceDataRef.current);
      if(field === "users") {
        updateSelectedAssets();
      }
    }

    const updateSelectedAssets = () => {
      let selectedAssets: any[] = [];
      const users = [...caseSearchEvidenceDataRef.current.users];
      for(let i = 0; i < users.length; i++) {
        const userSelectedAssets = [...users[i].selectedAssets];
        for(let j = 0; j < userSelectedAssets.length; j++) {
          if(selectedAssets.findIndex(x => x.id === userSelectedAssets[j]) === -1) {
            selectedAssets.push(userSelectedAssets[j]);
          }
        }
      }
      selectedAssetsFromSearchRef.current = selectedAssets;
    }

    const updateSelectedAssetsFromBucket = (assets: AssetBucket[]) => {
      if(Array.isArray(assets)) {
        selectedAssetsFromBucketRef.current = assets;
      }
      else {
        selectedAssetsFromBucketRef.current = [];
      }
    }

    return (
      <div className="createCaseStepperContent">
          <CRXTabs value={tabValue} onChange={handleTabChange} tabitems={tabs} stickyTab={142} />
          <CrxTabPanel value={tabValue} index={CASE_WIZARD_TAB.searchEvidence}>
           <CaseSearchEvidence data={caseSearchEvidenceDataRef.current} storeData={updateCaseSearchEvidenceData}
            cadAutoCompleteOptions={[]}/>
          </CrxTabPanel>
          <CrxTabPanel value={tabValue} index={CASE_WIZARD_TAB.assetBucket}>
            <CaseAssetBucket alreadySelectedAssets={selectedAssetsFromBucketRef.current} updateSelectedAssets={updateSelectedAssetsFromBucket}/>
          </CrxTabPanel>
          <CrxTabPanel value={tabValue} index={CASE_WIZARD_TAB.caseInfomation}>
            <CRXToaster ref={toasterRef} className="createCaseToster" />
            <CreateCase ref={createCaseComponentRef} isEdit={false} formValues={formValuesRef.current}
              caseLeadAutoCompleteOptions={caseLeadAutoCompleteOptions} statusAutoCompleteOptions={statusAutoCompleteOptions} 
              cadCsvAutoCompleteOptions={[]} updateFormValues={updateFormValues} onSubmit={onSubmit} validationCallback={isFormValid}
              />
            <CRXContainer className="createCaseSelectedAssetsContainer">
              <label className="selectedAssetsHeading">
                {t('Selected_Evidence')} [{selectedAssetsFromSearchRef.current.length + selectedAssetsFromBucketRef.current.length}]
              </label>
              <div className="selectedAssetsMatrix">
                {
                  selectedAssetsFromSearchRef.current.map((item) => {
                    return <CaseAsset item={item} isThumbnailOnly={true}/>
                  })
                }
                {
                  selectedAssetsFromBucketRef.current.map((item) => {
                    return <CaseAsset item={item} isThumbnailOnly={true}/>
                  })
                }
              </div>
            </CRXContainer>
          </CrxTabPanel>
          <div className="createCaseStepperButtonsContainer" ref={stepperButtonContainerRef}>
            <div className="createCaseStepperButtonsChildContainer">
              {
                tabValue === CASE_WIZARD_TAB.assetBucket || tabValue === CASE_WIZARD_TAB.caseInfomation ?
                <CRXButton
                  className="createCaseFormButtons secondary"
                  color="secondary"
                  variant="outlined"
                  onClick={onBackClick}
                >
                  { t("Back") }
                </CRXButton>
                : null
              }
              <CRXButton
                className="createCaseFormButtons secondary"
                color="secondary"
                variant="outlined"
                onClick={onCancelClick}
              >
                { t("Cancel") }
              </CRXButton>
            </div>
            <div className="createCaseStepperButtonsChildContainer">
              {
                tabValue === CASE_WIZARD_TAB.caseInfomation ?
                <CRXButton
                  id="createCaseSubmitButton"
                  disabled={isFormButtonDisabled}
                  className="createCaseFormButtons secondary"
                  variant="contained"
                  onClick={ () => onCreateCaseClick() }
                >
                  {t("Create_Case")}
                </CRXButton>
                :
                <>
                 {
                  tabValue === CASE_WIZARD_TAB.searchEvidence ?
                    <CRXButton
                      className="createCaseFormButtons secondary"
                      color="secondary"
                      variant="outlined"
                      onClick={onSkipClick}
                    >
                      {t("CREATE_EMPTY_CASE")}
                    </CRXButton>
                    : null
                 }
                  <CRXButton
                    className="createCaseFormButtons secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={onNextClick}
                    // disabled={ (!(assetBucketList.length > 0) && tabValue === 0) || tabValue === 1}
                  >
                    {t("Next")}
                  </CRXButton>
                </>
              }              
            </div>
          </div>
        </div>
    )
  }

type CaseAssetBucketPropType = {
  alreadySelectedAssets: AssetBucket[],
  updateSelectedAssets: (assets: AssetBucket[]) => void,
}

const CaseAssetBucket: FC<CaseAssetBucketPropType> = ({ alreadySelectedAssets, updateSelectedAssets }) => {

  const [selectedAssets, setSelectedAssets] = useState<AssetBucket[]>(Array.isArray(alreadySelectedAssets) ? alreadySelectedAssets : []);
  const [availableAssetsFromBucket, setAvailableAssetsFromBucket] = useState<AssetBucket[]>([]);

  const isFirstRenderRef = useRef<boolean>(true);

  const assetBucketList: AssetBucket[] = useSelector((state: RootState) => state.assetBucket.assetBucketData);
  const { t } = useTranslation<string>();

  useEffect(() => {
    if(!isFirstRenderRef.current) {
      updateSelectedAssets(selectedAssets);
    }
  }, [selectedAssets]);

  useEffect(() => {
    isFirstRenderRef.current = false;
    const availableAssets = assetBucketList.filter(item => !CheckEvidenceExpire(item.evidence));
    if(Array.isArray(availableAssets))
      setAvailableAssetsFromBucket(availableAssets);
    else
      setAvailableAssetsFromBucket([]);
  }, [assetBucketList]);

  const onSelectAllAssetsClick = (e: any) => {
    const isChecked = e.target.checked == true ? true : false;
    if(isChecked) {
      setSelectedAssets(assetBucketList);
    }
    else {
      setSelectedAssets([]);
    }
  }

  const onSelectAssetClick = (e: any, item: AssetBucket) => {
    const assetsCopy = [...selectedAssets];
    const selectedItem = assetsCopy.find(a => a.assetId === item.assetId);
    if(e.target.checked) {
      if(selectedItem === undefined)
        assetsCopy.push(item);
      setSelectedAssets(assetsCopy);
    }
    else {
      if(selectedItem != undefined) {
        setSelectedAssets(assetsCopy.filter(a => a.assetId !== selectedItem.assetId));
      }
    }
  }

  return (
    availableAssetsFromBucket.length > 0 ? (
      <>
        <div className="assetBucketSelectAllContainer">
          <CRXCheckBox
            checked={selectedAssets.length === availableAssetsFromBucket.length}
            onChange={(e: any) => onSelectAllAssetsClick(e)}
            name="selectAll"
            className="bucketListCheckedAll"
            lightMode={true}
          />
          <span className="selectAllText">
            {t("Select_All")}
          </span>
          {/* {t("View_on_assets_bucket_page")}{" "}
          <i className="icon icon-arrow-up-right2"></i>{" "} */}
          {/* <div className="bucketActionMenuAll"> */}
            {/* <div className={selectedAssets.length > 1 ? "" : " disableHeaderActionMenu"}> */}
            {/* <ActionMenu
              row={undefined}
              className=""
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              actionMenuPlacement={
                ActionMenuPlacement.AssetBucket
              }
            /> */}
            {/* </div>  */}
          {/* </div> */}
        </div>
        <div className="assetBucketListerScroll">
          <div className="assetBucketLister">
            {availableAssetsFromBucket.map((item) => {
                const asset = selectedAssets.find(a => a.assetId === item.assetId)
                return (
                  <CaseAsset item={item} hasCheckbox={true} onSelectAssetClick={onSelectAssetClick}
                    isChecked={(asset != null && item.assetId === asset.assetId) || (selectedAssets.length === assetBucketList.length)}/>
                );
            })}
          </div>
        </div>
      </>
    ) : (
      <div className="bucketContent">
        {t("Your_Asset_Bucket_is_empty.")}
      </div>
    )
  )
}
  
export default CreateCaseWizard;
