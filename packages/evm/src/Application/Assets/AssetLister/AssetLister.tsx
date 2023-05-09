import React, { useEffect, useRef, useState } from 'react';
import PredictiveSearchBox from './PredictiveSearchBox/PredictiveSearchBox';
import { CRXButton, CRXRows, CRXColumn,CRXAlert  } from '@cb/shared';
import AdvanceOption from './AdvanceOption';
import MasterMain from './AssetDataTable';
import jwt_decode from "jwt-decode";
import './AssetLister.scss';
import SelectedAsset from './SelectedAsset';
import "../../../Assets/css/animate.min.css";
import queries from '../QueryManagement/queries';
import { DateTimeComponent, DateTimeObject } from '../../../GlobalComponents/DateTime';
import { getAssetSearchInfoAsync, getAssetSearchNameAsync } from "../../../Redux/AssetSearchReducer";
import { RootState } from "../../../Redux/rootReducer";
import { useDispatch, useSelector } from 'react-redux';
import { enterPathActionCreator } from '../../../Redux/breadCrumbReducer';
import moment from 'moment';
import { GenerateLockFilterQuery, SearchType } from '../utils/constants'
import {
  dateOptionsTypes,
  basicDateDefaultValue,
  approachingDateDefaultValue,
  dateOptions
} from '../../../utils/constant';
import usePostFetch from '../../../utils/Api/usePostFetch';
import { getToken, IDecoded } from "../../../Login/API/auth";
import { useTranslation } from "react-i18next";
import { getCategoryAsync } from '../../../Redux/categoryReducer';
import { getStationsInfoAllAsync } from '../../../Redux/StationReducer';
import Cookies from 'universal-cookie';
import { SearchModel } from '../../../utils/Api/models/SearchModel';
import { useParams } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';
import { CRXTooltip } from '@cb/shared';
import { IconButton } from '@material-ui/core';
import "../../../Assets/css/animate.min.css";

const SearchComponent = (props: any) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  let decoded: IDecoded = jwt_decode(cookies.get("access_token"));
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showAdvanceSearch, setAdvanceSearch] = React.useState(false);
  const [showShortCutSearch, setShowShortCutSearch] = React.useState(true);
  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();
  const [dateOptionType, setDateOptionType] = React.useState(dateOptionsTypes.basicoptions);
  const [searchData, setSearchData] = React.useState<SearchModel.Evidence[]>([]);
  const [predictiveText, setPredictiveText] = React.useState('');
  const [searchResultText, setSearchResultText] = React.useState<any>({
    type : '',
    name : ''
  });
  const [querryString, setQuerryString] = React.useState('');
  const [randomKey, setRandomKey] = React.useState(0);
  const [stickyBorder, setStickyBorder] = React.useState(false);
  const [dateTimeDropDown, setDateTimeDropDown] = React.useState<DateTimeObject>({
    startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
    endDate: moment().endOf("day").set("second", 0).format(),
    value: basicDateDefaultValue,
    displayText: basicDateDefaultValue
  });
  const [fieldsNumber,setFieldsNumber] = useState(0);
  const [errorMessage, setErrorMessage] = React.useState<any>({
    message: "",
    type: "",
    alertType: ""
  });
  const [dateTimeAsset, setDateTimeAsset] = React.useState<DateTimeObject>({
    startDate: "",
    endDate: "",
    value: "",
    displayText: ""
  });

  const [showAssetDateCompact, setShowAssetDateCompact] = React.useState(true);
  const [compactDateRange, setCompactDateRange] = React.useState({
    showCompact: false,
    minDate: "",
    maxDate: ""
  });
  const evidenceSearchType = {
    MyAsstes: "#My Assets",
    NotCategorized: "#Not Categorized",
    ApproachingDeletion: "#Approaching Deletion"
  }
  const iconRotate = showAdvance ? ' ' : 'rotate90';
  const responseForSearch: SearchModel.Evidence[] = useSelector(
    (state: RootState) => state.assetSearchReducer.assetSearchInfo
  );
  const responseForSearchName: any = useSelector(
    (state: RootState) => state.assetSearchReducer.assetSearchName
  );
  const [isSearchBtnDisable, setIsSearchBtnDisable] = React.useState<boolean>(true);
  const QUERRY: any = {
    bool: {
      must: [
        {
          multi_match: {
            query: `${querryString}*`,
            fields: [
              'asset.assetName',
              'masterAsset.assetName',
              'categories',
              'cADId',
              'asset.unit',
              'asset.owners',
              'formData.key',
              'formData.value'
            ],
            operator : 'and'
          },
        },
      ],
      filter: []
    },
  };
  const AdvancedSearchQuerry: any = {
    bool: {
      must: [],
      filter: []
    },
  };
  const [isEmptySearch,setIsEmptySearch] = React.useState<boolean>(false);
  const [searchResult,setSearchResult] = React.useState<boolean>(false)

  const shortcutData = [
    {
      text: 'My Assets',
      query: () => queries.GetAssetsByUserName(decoded),
      renderData: function () {
        setQuerryString(evidenceSearchType.MyAsstes);
        setDateTimeAsset(dateTimeDropDown);
        fetchData(this.query(), SearchType.ViewOwnAssets,evidenceSearchType.MyAsstes);
        setPredictiveText(evidenceSearchType.MyAsstes);
        setSearchResultText({type : "Search Term:", name : evidenceSearchType.MyAsstes})
        setShowAssetDateCompact(true);
        setShowShortCutSearch(false);
        setAdvanceSearch(false);

      },
    },
    {
      text: t("Not_Categorized"),
      query: () => queries.GetAssetsUnCategorized(dateTimeDropDown.startDate, dateTimeDropDown.endDate, decoded),
      renderData: function () {
        setDateOptionType(dateOptionsTypes.basicoptions);
        setQuerryString(evidenceSearchType.NotCategorized);
        let categorydateValue = dateOptions.basicoptions.find(x => x.value === (dateTimeDropDown.displayText != "anytime" ? basicDateDefaultValue : dateTimeDropDown.displayText));
        if(categorydateValue != null)
        fetchData(queries.GetAssetsUnCategorized(categorydateValue.startDate(), categorydateValue.endDate(), decoded), SearchType.ShortcutSearch,evidenceSearchType.NotCategorized);
        setPredictiveText(evidenceSearchType.NotCategorized);
        setSearchResultText({type : "Search Term:", name : evidenceSearchType.NotCategorized})
        setDateTimeAsset(dateTimeDropDown);
        setShowAssetDateCompact(true);
        setIsSearchBtnDisable(false);
        setShowShortCutSearch(false);
        setAdvanceSearch(false);
      },
    },
    {
      text: t("Approaching_Deletion"),
      query: () =>
        queries.GetAssetsApproachingDeletion(dateTimeDropDown.startDate, dateTimeDropDown.endDate, decoded),
      renderData: function (dateTimeObject: DateTimeObject | undefined = undefined) {
        setQuerryString(evidenceSearchType.ApproachingDeletion);
        setDateOptionType(dateOptionsTypes.approachingDeletion);
        setPredictiveText(evidenceSearchType.ApproachingDeletion);
        setSearchResultText({type : "Search Term :", name : evidenceSearchType.ApproachingDeletion})
        setIsSearchBtnDisable(false);
        if (!dateTimeObject) {
          let approachingdateValue = dateOptions.approachingDeletion.find(x => x.value === (dateTimeDropDown.displayText != "anytime" ? dateTimeDropDown.displayText : approachingDateDefaultValue));
          if (approachingdateValue != null) {
            fetchData(queries.GetAssetsApproachingDeletion(approachingdateValue.startDate(), approachingdateValue.endDate(), decoded), SearchType.ShortcutSearch,evidenceSearchType.ApproachingDeletion)
            let defaultDateValue = dateOptions.basicoptions.find(x => x.value === basicDateDefaultValue);
            if (defaultDateValue !== undefined) {
              let approachingDefaultDateValue: DateTimeObject = {
                startDate: approachingdateValue.startDate(),
                endDate: approachingdateValue.endDate(),
                value: approachingdateValue.value,
                displayText: approachingdateValue.displayText
              }
              let dateValueObj: DateTimeObject = {
                startDate: defaultDateValue.startDate(),
                endDate: defaultDateValue.endDate(),
                value: defaultDateValue.value,
                displayText: defaultDateValue.displayText
              }
              setDateTimeDropDown(approachingDefaultDateValue);
              setDateTimeAsset(approachingDefaultDateValue);
            }
          }
        }
        else {
          fetchData(queries.GetAssetsApproachingDeletion(dateTimeObject.startDate, dateTimeObject.endDate, decoded), SearchType.ShortcutSearch,'')
        }

        let approachingMaxDateValue = dateOptions.approachingDeletion.find(x => x.value === t("next_30_days"));
        if (approachingMaxDateValue) {

          setCompactDateRange({
            showCompact: true,
            minDate: approachingMaxDateValue.startDate(),
            maxDate: approachingMaxDateValue.endDate()
          })
        }

        setShowAssetDateCompact(true);
        setAdvanceSearch(false);
      },
    },
  ];

  React.useEffect(() => {
    if(props.isopen){
      dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: "" }));
      dispatch(getAssetSearchNameAsync({ QUERRY: "",dateTime: dateTimeDropDown,SearchType: "" }));
      setShowShortCutSearch(false);
      if (addvancedOptions && addvancedOptions.options) {
        setAdvanceSearch(true);
      }

    }
    else{
       setDateTimeDropDown({
        startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
        endDate: moment().endOf("day").set("second", 0).format(),
        value: basicDateDefaultValue,
        displayText: basicDateDefaultValue
      });
      setPredictiveText('')
      setSearchData([])
      setShowShortCutSearch(true);
      setAdvanceSearch(true);
    }
    dispatch(getCategoryAsync());
    dispatch(getStationsInfoAllAsync());
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, [props.isopen]);


  React.useEffect(() => {
    if(responseForSearchName[0] != undefined){
     if( props.isopen) {
      setPredictiveText( responseForSearchName[1].replaceAll('*', ''))
      setDateTimeDropDown(responseForSearchName[0])
    }
      else{
        setPredictiveText("")
        setDateTimeDropDown({
          startDate: moment().startOf("day").subtract(10000, "days").set("second", 0).format(),
          endDate: moment().endOf("day").set("second", 0).format(),
          value: basicDateDefaultValue,
          displayText: basicDateDefaultValue
        });
      }
      setQuerryString(responseForSearchName[1].replaceAll('*', ''))
    }
  },[searchData])

  React.useEffect(() => {
    if(isEmptySearch && responseForSearch.length === 0){
      setSearchResult(true)
      setErrorMessage({
        message: t("No_Assets_found._Try_modifying_your_search_or_reach_out_to_your_admin_with_questions_on _permissions."),
        type: "info",
        alertType: "inline"
      })
    }
    else if(responseForSearch.length !== 0){
      setSearchResult(false)
    }
    else{
      setSearchResult(false)
    }
    if(+responseForSearch === 500 || +responseForSearch === 400){
      setSearchResult(true);
      setErrorMessage({
        message : "An Error occurred with your search, please try again. Contact your admin if issues persist.",
        type : "error",
        alertType : "inline"
      })
    }
  },[responseForSearch])

  React.useEffect(() => {
    if(isEmptySearch && searchData.length === 0){
      setAdvanceSearch(true)
      setShowShortCutSearch(true);
    }
    else if(searchData.length !== 0){
      setShowShortCutSearch(false);
      setAdvanceSearch(false)
    }
    else{
      setSearchResult(false)
    }
  },[isEmptySearch,searchData])

  React.useEffect(() => {
    let obj: any = {};
    if (addvancedOptions && addvancedOptions.options) {
      obj = addvancedOptions.options.map((x: any) => {
        if (x.inputValue) {
          return { key: x.key, inputValue: x.inputValue };
        }
      });

      obj.map((o: any) => {
        if (o) {
          if (o.key == 'username') {
            const val = {
              bool: {
                should: [{ match: { 'asset.owners': `${o.inputValue}` } }],
              },
            };
            AdvancedSearchQuerry.bool.must.push(val);
          } else if (o.key == 'unit') {
            const val = {
              bool: {
                should: [{ match: { 'asset.unit': `${o.inputValue}` } }],
              },
            };
            AdvancedSearchQuerry.bool.must.push(val);
          } else if (o.key == 'category') {
            const val = {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: `${o.inputValue}*`,
                      fields: [
                        'categories'
                      ],
                      operator : 'and'
                    },
                  },
                ]
              },
            };
            AdvancedSearchQuerry.bool.must.push(val);
          }
        }

      });

      if (dateTimeDropDown.displayText != "anytime") {
        if (addvancedOptions.dateTimeDropDown.startDate) {
          AdvancedSearchQuerry.bool.must.push({
            range: {
              'asset.recordingStarted': {
                gte: `${moment(addvancedOptions.dateTimeDropDown.startDate).toISOString()}`,
              },
            },
          });
        }

        if (addvancedOptions.dateTimeDropDown.endDate) {
          AdvancedSearchQuerry.bool.must.push({
            range: {
              'asset.recordingEnded': {
                lte: `${moment(addvancedOptions.dateTimeDropDown.endDate).toISOString()}`,
              },
            },
          });
        }
      }
      const lockQuery = GenerateLockFilterQuery(decoded);
      AdvancedSearchQuerry.bool.filter = lockQuery;
      fetchData(AdvancedSearchQuerry, SearchType.AdvanceSearch,'');
    }
  }, [addvancedOptions]);


  React.useEffect(() => {
    if (responseForSearch.length > 0) {
      const footer : any = document.querySelector(".footerDiv")
      setSearchData(responseForSearch);
      setRandomKey(Math.random())
      footer && (footer.style.bottom = "18px")
    }
    else {
      setSearchData([]);
    }
  }, [responseForSearch]);

  React.useEffect(() => {
    setSearchData([]);
  }, []);

  React.useEffect(() => {
   if( showAdvanceSearch == true ) {
    window.scrollTo({ top: 0, behavior: "smooth" });

   }else {
    window.scrollTo({ top: 2, behavior: "smooth" });
    
   }
   
  }, [searchData]);

  React.useEffect(() => {
    // NOTE: To Enable Search Button, on the basis of Query String.
    if (dateTimeDropDown.value === 'anytime' && querryString.length > 0)
      setIsSearchBtnDisable(false);
      else if(dateTimeDropDown.value === 'anytime' && querryString.length === 0){
        setIsSearchBtnDisable(true);
      }
  }, [querryString]);

  React.useEffect(() => {
    if (dateTimeDropDown.value === 'anytime' && querryString.length === 0)
      setIsSearchBtnDisable(true);
    else
      setIsSearchBtnDisable(false);
  }, [dateTimeDropDown]);

  const Search = () => {
    setSearchResultText({type : "Search Term:", name :querryString})
    if (querryString && querryString.length > 0 && querryString.includes("#")) {
      if (querryString.startsWith("#")) {
        let exactShortCutName = querryString.substring(1);
        let shortCut = shortcutData.find(x => x.text === exactShortCutName);
        if (shortCut) {
          shortCut.renderData();
        } else {
          setSearchData([]);

        }
        
      }
    } else {
      NormalSearch();
    }
    closeSearchPanel()
  }

  const NormalSearch = () => {
    setDateTimeAsset(dateTimeDropDown);
    if (dateTimeDropDown.value !== 'anytime') {

      if (dateTimeDropDown.startDate) {
        QUERRY.bool.must.push({
          range: {
            'asset.recordingStarted': {
              gte: `${moment(dateTimeDropDown.startDate).toISOString()}`,
            },
          },
        });
      }
      if (dateTimeDropDown.endDate) {
        QUERRY.bool.must.push({
          range: {
            'asset.recordingEnded': {
              lte: `${moment(dateTimeDropDown.endDate).toISOString()}`,
            },
          },
        });
      }
    }
    if (predictiveText === evidenceSearchType.ApproachingDeletion) {
      fetchData(queries.GetAssetsApproachingDeletion(dateTimeDropDown.startDate, dateTimeDropDown.endDate, decoded), SearchType.ShortcutSearch,evidenceSearchType.ApproachingDeletion);
    }
    else {
      if (querryString.length === 0) {
        const modifiedQuery = removeQueryStringObjectFromQuery(QUERRY);
        fetchData(modifiedQuery, SearchType.SimpleSearch,'');
      } else {
        const lockQuery = GenerateLockFilterQuery(decoded);
        QUERRY.bool.filter = lockQuery;
        fetchData(QUERRY, SearchType.SimpleSearch,'');
      }
    }
    setAdvanceSearch(false);
    setShowAssetDateCompact(true);
  }

  const fetchData = (querry: any, searchValue: any,searchValueType: any) => {
    setIsEmptySearch(true);
    setSearchResult(false)
    dispatch(getAssetSearchInfoAsync({ QUERRY: (querry || QUERRY), searchType: searchValue }));
    dispatch(getAssetSearchNameAsync({ QUERRY: QUERRY,dateTime: dateTimeDropDown,searchType: {searchValue,searchValueType} }));

    if (searchValue === SearchType.SimpleSearch || searchValue === SearchType.ShortcutSearch) {
      setShowShortCutSearch(false);
      setAdvanceSearch(false);
    }
    if(!props.isopen){
      dispatch(enterPathActionCreator({ val: t('Search_Results') }));
    }
  }
  const onChangePredictiveSearch = (e: any) => {
    setQuerryString(e);
    let dateOptionType = dateOptionsTypes.basicoptions;
    if (e === evidenceSearchType.ApproachingDeletion) {
      dateOptionType = dateOptionsTypes.approachingDeletion;
    } else {
      dateOptionType = dateOptionsTypes.basicoptions;

      setDateTimeAsset(dateTimeDropDown);
    }
    setDateOptionType(dateOptionType);
    
  }

  const getAllOptions = (e: any) => {
    setAddvancedOptions(e);
    setDateTimeDropDown({
      startDate: e.dateTimeDropDown.startDate,
      endDate: e.dateTimeDropDown.endDate,
      value: e.dateTimeDropDown.value,
      displayText: e.dateTimeDropDown.displayText
    });
    setDateTimeAsset({
      startDate: e.dateTimeDropDown.startDate,
      endDate: e.dateTimeDropDown.endDate,
      value: e.dateTimeDropDown.value,
      displayText: e.dateTimeDropDown.displayText
    })
  }

  const removeQueryStringObjectFromQuery = (queryToModify: any) => {
    let modifiedQuery = JSON.parse(JSON.stringify(queryToModify)); // Copy object without reference.
    let must = modifiedQuery.bool.must;
    must.splice(0, 1);
    modifiedQuery.bool.must = must;
    const lockQuery = GenerateLockFilterQuery(decoded);
    modifiedQuery.bool.filter = lockQuery;
    return modifiedQuery;
  }

  useEffect(() => {
   document.addEventListener("scroll",() =>{
    if(window.pageYOffset > 100) {
        setStickyBorder(true);
      }else {
        setStickyBorder(false);
      }
    })
  },[])

  const stickyBorderClass = stickyBorder ? "stickyBorder_Add" : "stickyBorder_Remove"; 
  const searchBar : any = useRef()
  const adSearchBar : any = useRef()
  const titleSearchBox : any = useRef();
  const [searchPanelModal, setSearchPanelModal] = useState<string>("panel_show");
  const [searchPanelIdentifer,setSearchPanelIdentifer] = useState<boolean>(false);
  const [isOverLay, setIsOverlay] = useState<boolean>(false)
  const [advanceSearchText, setSdvanceSearchText] = useState<any[]>([])

  useEffect(() => {
    showAdvanceSearch == true ? setSearchPanelModal("panel_show main_master_page_panel") : setSearchPanelModal("panel_hide")
  },[showAdvanceSearch])

  const showSearchBar = () => {
    setSearchPanelModal("panel_show panelDesign panelDesignUi panelDesignPopup ") 
    setSearchPanelIdentifer(true);
    setIsOverlay(true)
  }

  useEffect(()=>{
    let htmlElement = document.querySelector("html");
    if(searchPanelIdentifer) {
      htmlElement?.classList.add("removeScrollHtml");
    }else {
      htmlElement?.classList.remove("removeScrollHtml");
    }
  },[searchPanelIdentifer])


  const closeSearchPanel = () => {
    setSearchPanelModal("panel_hide") 
    setSearchPanelIdentifer(false);
    setIsOverlay(false)
  }
  const searchButton = <IconButton
  aria-controls="viewControle"
  className="viewControleButton"
  aria-haspopup="true"
  onClick={showSearchBar}
  disableRipple={true}
>
  <CRXTooltip iconName="fa-solid fa-file-magnifying-glass" className='crxTooltipFilter' placement={"top"} arrow={false} title={"search assets"}></CRXTooltip>
</IconButton>

const showAdvanceSearchBox = () => {
  setShowAdvance(!showAdvance)
  titleSearchBox.current.style.borderBottom = "1px solid #dedede"
  setTimeout(() => {
    const advanceSearchBox:any = document.querySelector("#advanceSearchBox")
    advanceSearchBox.scrollTop = 170;
    advanceSearchBox.scrollIntoView({behavior: 'smooth', block: 'start' });
    
  },500)
  
}
const PreSearchButtonClass = showAdvance ? "PreSearchButton_Open" : "PreSearchButton_Close";
const fieldsNumberClass = fieldsNumber == 1 ? "scrollMainPage_1" : fieldsNumber == 2 ? "scrollMainPage_2" : "" ;
  return (
    <div className='advanceSearchChildren'>
      <div className='searchComponents' style={{paddingTop : showShortCutSearch == false ? "56px" : "124px"}}>
       
      {isOverLay == true ? <div className='search-modal-overlay'></div> : ""} 
        <div ref={searchBar} className={`asset_lister_search_panel ${searchPanelModal}`}>
         
        {showShortCutSearch == false ?  <div className='modal-title_cs'>
          <div className='title_div'>Search Assets
          <div className='hr-line' ref={titleSearchBox}></div>
          </div>
          <div className='close-icon-modal'>
            <button className='closeButton-modal' onClick={() => closeSearchPanel()}>
              <i className='icon icon-cross2'></i>
            </button>
          </div>
          </div>
        : ""}

        <div className={`scrollMainPage ${fieldsNumberClass}`} ref={adSearchBar}>
        <div className={ `predictiveSearch_wraper`}>
        <div className={`predictiveSearch  ${searchData.length > 0 ? "CRXPredictiveDisable" : ""}`}>
          <CRXRows container spacing={0}>
            <CRXColumn item xs={6} className='topColumn'>
              <label className='searchLabel'>{t("Search_Assets_By")}</label>
              <PredictiveSearchBox

                onSet={(e) => onChangePredictiveSearch(e)}
                value={predictiveText}
                decoded={decoded}
                onKeyUp={(event: any) => {
                  
                if (event.keyCode == 13) 
                    Search()
                        
        }}
              />
            </CRXColumn>
           
            <CRXColumn item xs={6}>
              <label className='dateTimeLabel'>{t("Date_and_Time")}</label>

              <DateTimeComponent
                showCompact={compactDateRange.showCompact}
                minDate={compactDateRange.minDate}
                maxDate={compactDateRange.maxDate}
                dateTimeDetail={dateTimeDropDown}
                getDateTimeDropDown={(dateTime: DateTimeObject) => setDateTimeDropDown(dateTime)}
                dateOptionType={dateOptionType}
              />
            </CRXColumn>
          </CRXRows>
        </div>

        <div className='preSearcBtnContent'>
          <CRXButton
            className='PreSearchButton'
            onClick={() => Search()}
            color='primary'
            variant='contained'
            disabled={isSearchBtnDisable}
          >
            {t("Search")}
          </CRXButton>
        </div>
        </div>
        
        {showShortCutSearch && (
          <>
            <div className='middleContent'>
              <SelectedAsset shortcutData={shortcutData} />
            </div>
          </>
        )}

       
          
            <div className='advanceSearchContet'>
              <CRXButton
                onClick={() => showAdvanceSearchBox()}
                className={`PreSearchButton ${PreSearchButtonClass}` }
              >
                <i className={'fas fa-sort-down ' + iconRotate}></i> {t("Advanced")}&nbsp;
                {t("Search")}
              </CRXButton>

              {showAdvance && (
                <AdvanceOption
                  searchPanelIdentifer={searchPanelIdentifer}
                  getOptions={(e) => getAllOptions(e)}
                  hideOptions={() => setShowAdvance(false)}
                  dateOptionType={dateOptionType}
                  dateTimeDetail={dateTimeDropDown}
                  closeSearchPanel={() => closeSearchPanel()}
                  className="animate animate__slideInUp"
                  setSdvanceSearchText={setSdvanceSearchText}
                  setFieldsNumber={setFieldsNumber}
                  
                />
              )}
            </div>
          </div>

          
        
        </div>
        {searchResult &&  <CRXAlert
                    className=""
                    message= {errorMessage.message}
                    type={errorMessage.type}
                    alertType={errorMessage.alertType}
                    open={searchResult}
                    setShowSucess={() => null}
                  />
        }
        {(searchData.length > 0) && (
          <div className={`dataTabAssets dataTabAssets_table ${stickyBorderClass}`}>
            <MasterMain
              key={randomKey}
              rowsData={searchData}
              showDateCompact={showAssetDateCompact}
              dateOptionType={dateOptionType === dateOptionsTypes.approachingDeletion ? "" : dateOptionType}
              dateTimeDetail={dateTimeAsset}
              showAdvanceSearch={showAdvanceSearch}
              showSearchPanel={searchButton}
              searchResultText={searchResultText}
              advanceSearchText={advanceSearchText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;

