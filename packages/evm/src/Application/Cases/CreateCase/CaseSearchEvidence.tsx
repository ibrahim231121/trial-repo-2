import { FC, useEffect, useMemo, useRef, useState } from "react";
import { CRXButton, CRXRows, CRXColumn, CRXRadio, CRXMultiSelectBoxLight, CRXInputDatePicker, CrxAccordion, CRXCheckBox } from "@cb/shared";
import { AutoCompleteOptionType, CASE_SEARCH_BY, CaseSearchEvidenceData, SearchByUser } from "../CaseTypes";
import { useTranslation } from "react-i18next";
import { SearchAgent, UsersAndIdentitiesServiceAgent } from "../../../utils/Api/ApiAgent";
import './CaseSearchEvidence.scss';
import moment from "moment";
import Pagination from "@material-ui/lab/Pagination";
import { AssetBucket } from "../../Assets/AssetLister/ActionMenu/types";
import CaseAsset from "./CaseAsset";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { SearchType } from "../../Assets/utils/constants";
import { CheckEvidenceExpire } from "../../../GlobalFunctions/CheckEvidenceExpire";

type SearchByValues = {
  cadId: AutoCompleteOptionType,
  users: SearchByUser[],
  startDate: string,
  endDate: string
}

type CaseSearchEvidencePropTypes = {
  data: CaseSearchEvidenceData,
  cadAutoCompleteOptions: any[],
  storeData: <TKey extends keyof CaseSearchEvidenceData>(field: TKey, value: CaseSearchEvidenceData[TKey]) => void,
}

const CaseSearchEvidence: FC<CaseSearchEvidencePropTypes> = (props) => {
    const [searchBy, setSearchBy] = useState<CASE_SEARCH_BY>(props.data !=null ? props.data.searchBy : CASE_SEARCH_BY.cadId);
    const [isRelatedAssetsExpanded, setIsRelatedAssetExpanded] = useState<string>("");
    const [userAutoCompleteOptions, setUserAutoCompleteOptions] = useState<SearchByUser[]>([]);
    const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState<boolean>(true);
    const [searchByData, setSearchByData] = useState<SearchByValues>({
      cadId: props.data != null ? props.data.cadId : {id: 0, label: ""},
      users: props.data != null ? props.data.users : [],
      startDate: props.data != null ? props.data.startDate : "",
      endDate: props.data != null ? props.data.endDate : ""
    });
    const [, setUpdateState] = useState<boolean>(false);
  
    const { t } = useTranslation<string>();
  
    const predictiveSearchTimeoutRef = useRef<number>(0);
    const searchedDataRef = useRef<SearchByValues>({
      cadId: {id: 0, label: ""},
      users: [],
      startDate: "",
      endDate: ""
    });
    const searchByRadioOptionsRef = useRef<any>([
      // {value: CASE_SEARCH_BY.cadId, label: `${t("CAD_ID")}`, Comp: () => { }},
      {value: CASE_SEARCH_BY.userAndDate, label: `${t("User_and_Date")}`, Comp: () => { }}
    ]);

    useEffect(() => {
      checkSearchDataValid();
    }, [searchBy, searchByData]);
  
    const getPredictiveUsers = (value: string) => {
      UsersAndIdentitiesServiceAgent.getPredictiveUsers(value)
      .then((res: any) => {
        if(Array.isArray(res)) {
          const users = res.map((item: any) : SearchByUser => (
            {
              id: item.id,
              label: item.fName + " " + item.lName,
              userName: item.userName,
              selectedAssets: []
            }
          ));
          if(Array.isArray(users))
            setUserAutoCompleteOptions(users);
        }
      })
      .catch((ex: any) => {
        console.error(ex);
      })
    }

    const checkSearchDataValid = () : void => {
      if(searchBy === CASE_SEARCH_BY.cadId && searchByData.cadId != null && searchByData.cadId.id > 0) {
        setIsSearchButtonDisabled(false);
        return;
      }
      if(searchBy === CASE_SEARCH_BY.userAndDate) {
        if(Array.isArray(searchByData.users) && searchByData.users.length > 0 && moment(searchByData.startDate).isValid() && moment(searchByData.endDate).isValid()) {
          setIsSearchButtonDisabled(false);
          return;
        }
      }
      setIsSearchButtonDisabled(true);
    }
  
    const onInputChangeHandler = (e: any) => {
      clearTimeout(predictiveSearchTimeoutRef.current);
      if(e && e.target && e.target != null) {
        e.preventDefault();
        const value = e.target.value;
        if(value != null) {
          if(value && value.length >= 3) {
            predictiveSearchTimeoutRef.current = window.setTimeout(() => {
              getPredictiveUsers(value);
            }, 1000)
          }
          else {
            setUserAutoCompleteOptions([]);
          }
        }
        else {
          setUserAutoCompleteOptions([]);
        //   setSelectedUser([]);
        }
      }
    }
  
    const onUserChangeHandler = (e: any, value: any[]) => {
      if(e) {
        e.preventDefault();
        if(Array.isArray(value)) {
          const formattedUsers = value.map(item => {
            const user = searchedDataRef.current.users.find(x => x.id === item.id);
            if(user != null) {
              item.selectedAssets = user.selectedAssets ?? [];
            }
            return item;
          });
          props.storeData("users", formattedUsers);
          setSearchByData(prevState => ({
            ...prevState,
            users: formattedUsers
          }));
        }
        else {
          setSearchByData(prevState => ({
            ...prevState,
            users: []
          }));
        }
      }
    }

    const onDateChange = (field: "startDate" | "endDate", event: any) => {
      if(event && event.target != null) {
        event.preventDefault();
        const {value} = event.target;
        let fieldValue: any = null;
        if(moment(value).isValid()) {
          fieldValue = value;
        }
        props.storeData(field, value);
        setSearchByData(prevState => ({
          ...prevState,
          [field]: fieldValue
        }));
      }
    }

    const onSearchClick = () => {
      searchedDataRef.current = {...searchByData, users: JSON.parse(JSON.stringify(searchByData.users))};
      setUpdateState(prevState => !prevState);
    }

    const onSearchByClick = (value: CASE_SEARCH_BY) => {
      const searchByValue = value === CASE_SEARCH_BY.userAndDate ? value : CASE_SEARCH_BY.cadId;
      props.storeData("searchBy", searchByValue);
      setSearchBy(value);
    }

    const updateUserAssets = (user: SearchByUser) => {
      const deepCopy = [...searchByData.users];
      deepCopy.forEach(item => {
        if(item.id === user.id) {
          item.selectedAssets = user.selectedAssets;
        }
        return item;
      });
      props.storeData("users", deepCopy);
    }

    const maxDate = () => {
      var now = new Date();
      let date = moment(now).format("YYYY-MM-DD").toString();
      return date;
    }

    const minDate = (date:any) => {
      let FormattedDate = moment(date).format("YYYY-MM-DD").toString();
      return FormattedDate;
    }

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
                  setValue={(value: CASE_SEARCH_BY) => onSearchByClick(value)}
              />
              {
                searchBy === CASE_SEARCH_BY.userAndDate ?
                  <div className="searchByUserAndDateContainer">
                    <div className="searchByUserContainer">
                      <CRXMultiSelectBoxLight
                        id="UserName"
                        className="searchByAutoComplete"
                        label= "User Name"
                        multiple={true}
                        value={ searchByData.users }
                        options={Array.isArray(userAutoCompleteOptions) ? userAutoCompleteOptions : []}
                        onChange={(e: any, value: SearchByUser[]) => onUserChangeHandler(e, value)}
                        onOpen={(e: any) => { e.preventDefault(); }}
                        onInputChange={onInputChangeHandler}
                        CheckBox={true}
                        checkSign={false}
                        required={false}
                      />
                    </div>
                    <div className="searchByDateContainer">
                      <div className="datePickerContainer">
                        <label>{t("Start_Date")}</label>
                        <CRXInputDatePicker
                          value={searchByData.startDate}
                          type="date"
                          onChange={(e: any) => {
                          onDateChange("startDate", e)}}
                          minDate = {searchByData.endDate != "" ? minDate(searchByData.endDate) : "YYYY-MM-DD"}
                          maxDate = {maxDate() || "YYYY-MM-DD"}
                        />
                        
                      </div>
                      {console.log(searchByData,"searchByData")}
                      <div className="datePickerContainer">
                        <label>{t("End_Date")}</label>
                        <CRXInputDatePicker
                          value={searchByData.endDate || ""}
                          type="date"
                          onChange={(e: any) => onDateChange("endDate", e)}
                          minDate = {searchByData.startDate != ""  ?  minDate(searchByData.startDate) : "YYYY-MM-DD"}
                          maxDate = {maxDate() || "YYYY-MM-DD" }
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
                  onClick={() => onSearchClick() }
                  disabled={isSearchButtonDisabled}
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
          {/* <CRXColumn
            className=""
            container="container"
            item="item"
            lg={2}
            xs={4}
            spacing={0}
          /> */}
          <CRXColumn
            className=""
            container="container"
            item="item"
            lg={12}
            xs={12}
            spacing={0}
          >
            <div className="createCaseWizardMatchingResultContainer">
              <label className="matchingResultHeading">Matching Results</label>
              <div className="matchingResultContent">
              {
                searchedDataRef.current.users.map((item, idx: number) => {
                  return (
                    <UserAssets key={`user-asset-key-${item}-${idx}`} user={item} startDate={searchedDataRef.current.startDate}
                      endDate={searchedDataRef.current.endDate} updateUserAssets={updateUserAssets}/>
                  )
                })
              }
              </div>
            </div>
          </CRXColumn>
        </CRXRows>
        {/* <CRXRows
          className=""
          container="container"
          spacing={0}
        > */}
          {/* <CRXColumn
            className=""
            container="container"
            item="item"
            lg={2}
            xs={4}
            spacing={0}
          /> */}
          {/* <CRXColumn
            className=""
            container="container"
            item="item"
            lg={12}
            xs={12}
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
          </CRXColumn> */}
        {/* </CRXRows> */}
      </div>
    )
}

type UserAssetsPropTypes = {
  user: SearchByUser,
  startDate: string,
  endDate: string,
  updateUserAssets: (user: SearchByUser) => void,
}

const UserAssets: FC<UserAssetsPropTypes> = (props) => {

  const [selectedAssets, setSelectedAssets] = useState<SearchModel.Evidence[]>(props.user.selectedAssets ?? []);
  const [paginatedAssets, setPaginatedAssets] = useState<SearchModel.Evidence[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 12,
    totalPages: 1
  });

  const fetchedAssetsRef = useRef<SearchModel.Evidence[]>([]);
  const isFirstRenderRef = useRef<boolean>(true);

  const ADVANCE_SEARCH_QUERY: any = {
    bool: {
      must: [],
      filter: []
    },
  };

  useEffect(() => {
    if(isFirstRenderRef.current === false) {
      const startIndex = pagination.page == 1 ? 0 : ((pagination.page - 1) * pagination.size);
      const endIndex = (pagination.page * pagination.size);
      const assetsPerPage = fetchedAssetsRef.current.slice(startIndex, endIndex);
      setPaginatedAssets(assetsPerPage);
    }
  }, [pagination]);

  useEffect(() => {
    if(!isFirstRenderRef.current) {
      props.updateUserAssets({...props.user, selectedAssets: selectedAssets});
    }
  }, [selectedAssets])

  useEffect(() => {
    fetchAssetsByOwner();
    if(isFirstRenderRef.current == true) {
      isFirstRenderRef.current = false; 
    }
    else {
      setSelectedAssets(props.user.selectedAssets);
    }
  }, [props.user, props.startDate, props.endDate]);

  

  const fetchAssetsByOwner = () => {
    if(props.user) {
      const val = {
        bool: {
          should: [{ match: { 'asset.owners': `${props.user.userName}` } }],
        },
      };
      ADVANCE_SEARCH_QUERY.bool.must.push(val);
    }
    if (props.startDate) {
      ADVANCE_SEARCH_QUERY.bool.must.push({
        range: {
          'asset.recordingStarted': {
            gte: `${moment(props.startDate).toISOString()}`,
          },
        },
      });
    }
    if (props.endDate) {
      ADVANCE_SEARCH_QUERY.bool.must.push({
        range: {
          'asset.recordingEnded': {
            lte: `${moment(props.endDate).toISOString()}`,
          },
        },
      });
    }
    SearchAgent.getAssetBySearch(JSON.stringify(ADVANCE_SEARCH_QUERY), [{key: "SearchType", value: SearchType.AdvanceSearch}])
    .then((response: SearchModel.Evidence[]) => {
      console.log(response);
      if(Array.isArray(response)) {
        fetchedAssetsRef.current = response.filter(item => CheckEvidenceExpire(item) === false);
        customPagination();
        // setSearchedAssets(customData);
      }
    })
    .catch(ex => {
      console.log(ex);
    })
  }

  const customPagination = () => {
    if(Array.isArray(fetchedAssetsRef.current)) {      
      let totalPages = Math.ceil(fetchedAssetsRef.current.length / pagination.size);
      
      setPagination(prevState => ({
        ...prevState,
        totalPages: totalPages
      }));
    }
  }

  const onSelectAllAssetsClick = (e: any) => {
    const isChecked = e.target.checked == true ? true : false;
      if(isChecked) {
        setSelectedAssets(fetchedAssetsRef.current);
      }
      else {
        setSelectedAssets([]);
    }
  }

  const onSelectAssetClick = (e: any, item: SearchModel.Evidence) => {
    const assetsCopy = [...selectedAssets];
    const selectedItem = assetsCopy.find(a => a.masterAsset.assetId === item.masterAsset.assetId);
    if(e.target.checked) {
      if(selectedItem === undefined)
        assetsCopy.push(item);
      setSelectedAssets(assetsCopy);
    }
    else {
      if(selectedItem != undefined) {
        setSelectedAssets(assetsCopy.filter(a => a.masterAsset.assetId !== selectedItem.masterAsset.assetId));
      }
    }
  }

  const onPaginationChange = (event: any, page: number) => {
    event.preventDefault();
    console.log(page);
    setPagination(prevState => ({
      ...prevState,
      page: page
    }));
  }

  return(
    <div className="userAssetsContainer">
      <div className="userAssetsHeader">
        <div className="userInformationContainer">
          <CRXCheckBox
            checked={selectedAssets.length > 0 && selectedAssets.length === fetchedAssetsRef.current.length}
            onChange={(e: any) => onSelectAllAssetsClick(e)}
            name="selectAll"
            className="userAssetsSelectAll"
            lightMode={true}
          />
          <label>{props.user.label + "  [" + fetchedAssetsRef.current.length + "]" }</label>
        </div>

        {pagination.totalPages > 0 &&
        <Pagination className="userAssetsPagination" page={pagination.page} count={pagination.totalPages} onChange={onPaginationChange}/>}
      </div>
      <div className="userAssetsBody">
      {paginatedAssets.map((item) => {
          const asset = selectedAssets.find(a => a.masterAsset.assetId === item.masterAsset.assetId)
          return (
            <CaseAsset item={item} hasCheckbox={true} onSelectAssetClick={onSelectAssetClick}
              isChecked={(asset != null && item.masterAsset.assetId === asset.masterAsset.assetId)}/>
          );
        })}
      </div>
    </div>
  )
}

export default CaseSearchEvidence;
