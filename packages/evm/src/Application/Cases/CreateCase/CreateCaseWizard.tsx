import { FC, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { AutoCompleteOptionType, Case, CASE_STATE, CASE_CLOSED_TYPE, CASE_CREATION_TYPE, TCaseAsset, TCaseFormType, CASE_ASSET_TYPE } from "../CaseTypes";
import { CasesAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import { CRXButton, CRXToaster, CRXCheckBox, CRXTabs, CrxTabPanel, CRXRows, CRXColumn, CRXHeading, CRXRadio, CRXMultiSelectBoxLight,
  CRXInputDatePicker, CrxAccordion } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import { loadFromLocalStorage } from "../../../Redux/AssetActionReducer";
import { AssetThumbnail } from "../../Assets/AssetLister/AssetDataTable/AssetThumbnail";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import CreateCase from "./CreateCase";
import './CreateCaseWizard.scss';
interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  assetType: string;
  recordingStarted: string;
  categories: string[];
}

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

const CreateCaseWizard = () => {

    const [isFormButtonDisabled, setIsFormButtonDisabled] = useState<boolean>(true);
    const [tabValue, setTabValue] = useState<number>(0);

    const [caseLeadAutoCompleteOptions, setCaseLeadAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
    const [statusAutoCompleteOptions, setStatusAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
    const [selectedAssets, setSelectedAssets] = useState<AssetBucket[]>([]);

    const { t } = useTranslation<string>();
    const history = useHistory();
    const dispatch = useDispatch();

    const toasterRef = useRef<typeof CRXToaster>(null);
    const stepperButtonContainerRef = useRef<HTMLDivElement | null>(null);
    const formValuesRef = useRef<TCaseFormType | undefined>(undefined); 
    const isFirstRenderRef = useRef<boolean>(true);
    const createCaseComponentRef = useRef<any>(null);

    const assetBucketList: AssetBucket[] = useSelector((state: RootState) => state.assetBucket.assetBucketData);
    const userList: any = useSelector((state: RootState) => state.userReducer.usersInfo);

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
      fetchAllDropDownsData();
      dispatch(loadFromLocalStorage()); // on load check asset bucket exists in local storage
      dispatch(getUsersInfoAsync(userPagerData));
    }, [])
  
    const fetchAllDropDownsData = async () => {
      await CasesAgent.getAllDropDownValues('/Case/GetAllDropDownValues')
      .then((response: any) => {
        if(response != null && Array.isArray(response.caseStatus))
          setStatusAutoCompleteOptions(response.caseStatus);
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
      selectedAssets.forEach((item, idx) => {
        caseAssetsList.push({
          id: '0',
          caseId: 0,
          assetId: item.assetId,
          evidenceId: item.id,
          notes: '',
          sequenceNumber: `${item.assetId}-${idx}`,
          assetName: item.assetName,
          assetType: getAssetTypeEnumValue(item.assetType) ?? CASE_ASSET_TYPE.Others,
        })
      });
      return caseAssetsList;
    }

    const getAssetTypeEnumValue = (assetType: string) => {
      return CASE_ASSET_TYPE[assetType as keyof typeof CASE_ASSET_TYPE];
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

    const getAssetBucketContent = () => {
      return assetBucketList.length > 0 ? (
          <>
            <div className="assetBucketSelectAllContainer">
              <CRXCheckBox
                checked={selectedAssets.length === assetBucketList.length}
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
                {assetBucketList.map((item) => {
                  const asset = selectedAssets.find(a => a.assetId === item.assetId)
                  return (
                    <CaseAssetItem item={item} hasCheckbox={true} onSelectAssetClick={onSelectAssetClick}
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
      setTabValue((prevState) => prevState - 1 > 0 ? prevState - 1 : 0);
    }

    const onSkipClick = () => {
      setSelectedAssets([]);
      setTabValue(2);
    }

    const onNextClick = () => {
      setTabValue((prevActiveStep) => (prevActiveStep + 1) <= 2 ? (prevActiveStep + 1) : 2);
    }

    const onCreateCaseClick = () => {
      if(createCaseComponentRef.current != null && createCaseComponentRef.current.formikElementRef != null) {
        createCaseComponentRef.current.formikElementRef.submitForm();
      }
    }


    return (
      <div className="createCaseStepperContent">
          <CRXTabs value={tabValue} onChange={() => {}} tabitems={tabs} stickyTab={142} />
          <CrxTabPanel value={tabValue} index={0}>
           <SearchEvidence />
          </CrxTabPanel>
          <CrxTabPanel value={tabValue} index={1}>
            { getAssetBucketContent() }
          </CrxTabPanel>
          <CrxTabPanel value={tabValue} index={2}>
            <CRXToaster ref={toasterRef} className="createCaseToster" />
            <CreateCase ref={createCaseComponentRef} isEdit={false} formValues={formValuesRef.current}
              caseLeadAutoCompleteOptions={caseLeadAutoCompleteOptions} statusAutoCompleteOptions={statusAutoCompleteOptions} 
              cadCsvAutoCompleteOptions={[]} updateFormValues={updateFormValues} onSubmit={onSubmit} validationCallback={isFormValid}/>
          </CrxTabPanel>
          <div className="createCaseStepperButtonsContainer" ref={stepperButtonContainerRef}>
            <div className="createCaseStepperButtonsChildContainer">
              {
                tabValue === 1 ?
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
                tabValue === 2 ?
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
                  tabValue === 0 ?
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
                    disabled={ (!(assetBucketList.length > 0) && tabValue === 0) || (!(selectedAssets.length > 0) && tabValue === 1) }
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
  
export default CreateCaseWizard;

type CaseAssetItemType = {
  item: any,
  isChecked?: boolean,
  hasCheckbox?: boolean,
  onSelectAssetClick?: (e: any, item: any) => void
}

const CaseAssetItem : FC<CaseAssetItemType> = ({item, isChecked = false, hasCheckbox = false, onSelectAssetClick}) => {
  return (
    <div className="bucketLister">
      {
        hasCheckbox === true ?
        <div className="assetCheck">
          <CRXCheckBox
            checked={isChecked}
            onChange={(e: any) => typeof onSelectAssetClick === "function" ? onSelectAssetClick(e, item) : {}}
            name={item.assetId}
            lightMode={true}
          />
        </div>
        : null
      }
      
      <div className="bucketThumb">
        <AssetThumbnail
          assetName={item.assetName}
          assetType={item.assetType}
          fileType={item?.evidence?.masterAsset?.files[0]?.type}
          accessCode={item?.evidence?.masterAsset?.files[0]?.accessCode}
          fontSize="61pt"
        />
      </div>
      <div className="bucketListTextData">
        {/* <div className="bucketListAssetName">
          { assetNameTemplate(item.assetName, item.evidence) }
        </div>
        <div className="bucketListRec">
          {item.assetType}
        </div> */}
        {/* : ( */}
        <div className="bucketListAssetName">
          {item.assetName.length > 25
            ? item.assetName.substr(0, 25) + "..."
            : item.assetName}
            {/* assetNameTemplate(item.assetName,item.evidence) */}
        </div>
        <div className="bucketListRec">
          {item.assetType}
        </div>
        {/* )} */}
        {/* {assetBucketItem.evidence.categories &&
          assetBucketItem.evidence.categories.length > 0 && (
            <div className="bucketListRec">
              {assetBucketItem.evidence.categories
                .map((item: any) => item)
                .join(", ")}
            </div>
          )} */}
      </div>
      {/* <div className="bucketActionMenu">
        {
          <ActionMenu
            row={x}
            selectedItems={selectedItems}
            actionMenuPlacement={
              ActionMenuPlacement.AssetBucket
            }
          />
        }
      </div> */}
    </div>
  )
}

const SearchEvidence: FC<any> = (props) => {
  const [searchBy, setSearchBy] = useState("1");
  const [isRelatedAssetsExpanded, setIsRelatedAssetExpanded] = useState<string>("");

  const { t } = useTranslation<string>();

  const searchByRadioOptionsRef = useRef<any>([
    {
      value: "1", label: `${t("CAD_ID")}`, Comp: () => { }
    },
    {
      value: "2", label: `${t("User_and_Date")}`, Comp: () => { }
    }
  ]);

  return (
    <div className="createCaseWizardSearchEvidence">
      <CRXRows
        className=""
        container="container"
        spacing={0}
      >
        <CRXColumn
          className=""
          container="container"
          item="item"
          lg={2}
          xs={4}
          spacing={0}
        >
          <label className="searchByHeading">Search By</label>
        </CRXColumn>
        <CRXColumn 
          className=""
          container="container"
          item="item"
          lg={8}
          xs={12}
          spacing={0}
        >
          <div className="createCaseWizardSearchByContainer">
            <CRXRadio
                className='searchByRadioBtn'
                disableRipple={true}
                content={searchByRadioOptionsRef.current}
                value={searchBy}
                setValue={(value: string) => { value === "2" ? setSearchBy(value) : setSearchBy("1") }}
            />
            {
              searchBy === "2" ?
                <div className="searchByUserAndDateContainer">
                  <div className="searchByUserContainer">
                    <CRXMultiSelectBoxLight
                      id="UserName"
                      className="searchByAutoComplete"
                      label= "User Name"
                      multiple={false}
                      value={ null }
                      options={Array.isArray(props.userAutoCompleteOptions) ? props.userAutoCompleteOptions : []}
                      onChange={(e: any, value: AutoCompleteOptionType) => {}}
                      onOpen={(e: any) => {}}
                      CheckBox={true}
                      checkSign={false}
                      required={false}
                    />
                  </div>
                  <div className="searchByDateContainer">
                    <div className="datePickerContainer">
                      <label>{t("Start_Date")}</label>
                      <CRXInputDatePicker
                        value={null}
                        type="date"
                        onChange={(e: any) => { }}
                      />
                    </div>
                    <div className="datePickerContainer">
                      <label>{t("End_Date")}</label>
                      <CRXInputDatePicker
                        value={null}
                        type="date"
                        onChange={(e: any) => { }}
                      />
                    </div>
                  </div>
                </div> 
              :
                <CRXMultiSelectBoxLight
                  id="CADId"
                  className="searchByAutoComplete"
                  label= ""
                  multiple={false}
                  value={null}
                  options={Array.isArray(props.cadAutoCompleteOptions) ? props.cadAutoCompleteOptions : []}
                  onChange={( e: any, value: AutoCompleteOptionType) => {} }
                  onOpen ={() => {}}
                  CheckBox={true}
                  checkSign={false}
                  required={false}
                />

            }
            <div className="searchButtonContainer">
              <CRXButton
                className="createCaseFormButtons secondary"
                color="secondary"
                variant="outlined"
                onClick={() => {}}
              >
                { t("Search") }
              </CRXButton>
            </div>
          </div>
        </CRXColumn>
      </CRXRows>
      <CRXRows
        className=""
        container="container"
        spacing={0}
      >
        <CRXColumn
          className=""
          container="container"
          item="item"
          lg={2}
          xs={4}
          spacing={0}
        />
        <CRXColumn
          className=""
          container="container"
          item="item"
          lg={8}
          xs={4}
          spacing={0}
        >
          <div className="createCaseWizardMatchingResultContainer">
            <label className="matchingResultHeading">Matching Result</label>
            <div className="matchingResultContent">

            </div>
          </div>
        </CRXColumn>
      </CRXRows>
      <CRXRows
        className=""
        container="container"
        spacing={0}
      >
        <CRXColumn
          className=""
          container="container"
          item="item"
          lg={2}
          xs={4}
          spacing={0}
        />
        <CRXColumn
          className=""
          container="container"
          item="item"
          lg={8}
          xs={4}
          spacing={0}
        >
          <div className="createCaseWizardRelatedAssetsContainer">
            <CrxAccordion
              title={t("RELATED_ASSETS")}
              id="relatedAssetsPanel"
              className="relatedAssetsAccordion"
              ariaControls="Content1"
              name="relatedAssetsPanel"
              isExpanedChange={setIsRelatedAssetExpanded}
              expanded={isRelatedAssetsExpanded === "relatedAssetsPanel"}
            >
            </CrxAccordion>
          </div>
        </CRXColumn>
      </CRXRows>
    </div>
  )
}
