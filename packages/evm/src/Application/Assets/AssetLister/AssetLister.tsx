import React from 'react';
import PredictiveSearchBox from './PredictiveSearchBox/PredictiveSearchBox';
import { CRXButton, CRXRows, CRXColumn } from '@cb/shared';
import AdvanceOption from './AdvanceOption';
import MasterMain from './AssetDataTable';
import jwt_decode from "jwt-decode";
import './AssetLister.scss';
import SelectedAsset from './SelectedAsset';
import queries from '../QueryManagement/queries';
import { DateTimeComponent, DateTimeObject } from '../../../GlobalComponents/DateTime';
import { getAssetSearchInfoAsync } from "../../../Redux/AssetSearchReducer";
import { RootState } from "../../../Redux/rootReducer";
import { useDispatch, useSelector } from 'react-redux';
import { enterPathActionCreator } from '../../../Redux/breadCrumbReducer';
import moment from 'moment';
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
const SearchComponent = (props: any) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  let decoded: IDecoded = jwt_decode(cookies.get("access_token"));
  const [username, SetUsername] = React.useState("");
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showAdvanceSearch, setAdvanceSearch] = React.useState(true);
  const [showShortCutSearch, setShowShortCutSearch] = React.useState(true);
  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();
  const [querryString, setQuerryString] = React.useState('');
  const [dateOptionType, setDateOptionType] = React.useState(dateOptionsTypes.basicoptions);
  const [searchData, setSearchData] = React.useState<any>();
  const [predictiveText, setPredictiveText] = React.useState('');
  const [dateTimeDropDown, setDateTimeDropDown] = React.useState<DateTimeObject>({
    startDate: moment().startOf(t("day")).subtract(29, t("days")).set(t("second"), 0).format(),
    endDate: moment().endOf(t("day")).set(t("second"), 0).format(),
    value: basicDateDefaultValue,
    displayText: basicDateDefaultValue
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
  const iconRotate = showAdvance ? ' ' : 'rotate90';
  const responseForSearch: any = useSelector(
    (state: RootState) => state.assetSearchReducer.assetSearchInfo
  );
  const [isSearchBtnDisable, setIsSearchBtnDisable] = React.useState<boolean>(true);

  const searchType ={
    SimpleSearch: "SimpleSearch",
    AdvanceSearch: "AdvanceSearch",
    ShortcutSearch:"ShortcutSearch",
    ViewOwnAssets: "ViewOwnAssets"
  }
  const QUERRY: any = {
    bool: {
      must: [
        {
          query_string: {
            query: `${querryString}`,
            fields: [
              'asset.assetName',
              'masterAsset.assetName',
              'categories',
              'cADId',
              'asset.unit',
              'asset.owners',
              'description'
            ],
          },
        },
      ],
    },
  };
  const AdvancedSearchQuerry: any = {
    bool: {
      must: [],
    },
  };

  const shortcutData = [
    {
      text: 'My Assets',
      query: () => queries.GetAssetsByUserName(decoded.UserName),
      renderData: function () {
        fetchData(this.query(), searchType.ViewOwnAssets);
      },
    },
    {
      text: t("Not_Categorized"),
      query: () => queries.GetAssetsUnCategorized(dateTimeDropDown.startDate, dateTimeDropDown.endDate),
      renderData: function () {
        setPredictiveText(t("Not_Categorized"));
        fetchData(this.query(), searchType.ShortcutSearch);
        setDateTimeAsset(dateTimeDropDown);
        setShowAssetDateCompact(true);
        setIsSearchBtnDisable(false);
      },
    },
    {
      text: t("Approaching_Deletion"),
      query: () =>
        queries.GetAssetsApproachingDeletion(dateTimeDropDown.startDate, dateTimeDropDown.endDate),
      renderData: function (dateTimeObject: DateTimeObject | undefined = undefined) {
        setDateOptionType(dateOptionsTypes.approachingDeletion);
        setPredictiveText(t("Approaching_Deletion"));
        setIsSearchBtnDisable(false);
        if (!dateTimeObject) {
          let approachingdateValue = dateOptions.approachingDeletion.find(x => x.value === approachingDateDefaultValue);
          if (approachingdateValue != null) {
            fetchData(queries.GetAssetsApproachingDeletion(approachingdateValue.startDate(), approachingdateValue.endDate()), searchType.ShortcutSearch)
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
              setDateTimeAsset(dateValueObj);
            }
          }
        }
        else {
          fetchData(queries.GetAssetsApproachingDeletion(dateTimeObject.startDate, dateTimeObject.endDate), searchType.ShortcutSearch)
        }

        let approachingMaxDateValue = dateOptions.approachingDeletion.find(x => x.value === t("next_30_days"));
        if (approachingMaxDateValue) {

          setCompactDateRange({
            showCompact: true,
            minDate: approachingMaxDateValue.startDate(),
            maxDate: approachingMaxDateValue.endDate()
          })
        }
        setShowAssetDateCompact(false);
      },
    },
    
  ];

  React.useEffect(() => {
    dispatch(getCategoryAsync());
    dispatch(getStationsInfoAllAsync());
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  React.useEffect(() => {
    let obj: any = {};
    if (addvancedOptions && addvancedOptions.options) {
      obj = addvancedOptions.options.map((x: any) => {
        if (x.inputValue) {
          return { key: x.key, inputValue: x.inputValue };
        }
      });

      obj.map((o: any) => {
        if(o)
        {
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
                should: [{ match: { categories: `${o.inputValue}` } }],
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

      fetchData(AdvancedSearchQuerry, searchType.AdvanceSearch);
    }
  }, [addvancedOptions]);

  React.useEffect(() => {
    if (responseForSearch.length > 0) {
      setSearchData(responseForSearch);
    }
    else {
      setSearchData([]);
    }
  }, [responseForSearch]);

  React.useEffect(() => {
    setSearchData(null);
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 186, behavior: "smooth" });
  }, [searchData]);

  React.useEffect(() => {
    // NOTE: To Enable Search Button, on the basis of Query String.
    if (querryString.length > 1)
      setIsSearchBtnDisable(false);
  }, [querryString]);

  React.useEffect(() => {
    if (dateTimeDropDown.value === 'anytime' && querryString.length === 0)
      setIsSearchBtnDisable(true);
    else
      setIsSearchBtnDisable(false);
  }, [dateTimeDropDown]);


  const Search = () => {
    if (querryString && querryString.length > 0 && querryString.startsWith("#")) {
      let exactShortCutName = querryString.substring(1);
      let shortCut = shortcutData.find(x => x.text === exactShortCutName);
      if (shortCut) {
        if (shortCut.text === t("Approaching_Deletion")) {
          shortCut.renderData(dateTimeDropDown);
        } else {
          shortCut.renderData(undefined) // For Trash and Not Categorized
        }
      } else {
        NormalSearch();
      }
    } else {
      NormalSearch();
    }
  }

  const NormalSearch = () => {
    if (dateTimeDropDown.value !== 'anytime') {
      setDateTimeAsset(dateTimeDropDown);
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
    if (predictiveText === t("Approaching_Deletion")) {
      fetchData(queries.GetAssetsApproachingDeletion(dateTimeDropDown.startDate, dateTimeDropDown.endDate), searchType.ShortcutSearch);
    }
    else {
      if (querryString.length === 0) {
        const modifiedQuery = removeQueryStringObjectFromQuery(QUERRY);
        fetchData(modifiedQuery, searchType.SimpleSearch);
      } else {
        fetchData(QUERRY, searchType.SimpleSearch);
      }
    }
    setAdvanceSearch(false);
    setShowAssetDateCompact(true);
  }

  const fetchData = (querry: any, searchValue: any) => {
    dispatch(getAssetSearchInfoAsync({ QUERRY: (querry || QUERRY), searchType: searchValue }));
    if (searchValue === searchType.SimpleSearch || searchValue === searchType.ShortcutSearch) {
      setShowShortCutSearch(false);
      setAdvanceSearch(false);
    }
    dispatch(enterPathActionCreator({ val: t('Search_Results') }));
    const titleCOnt = document.getElementsByClassName('titlePage');
    var appendClass = document.getElementsByClassName('bottomLine');
    if (appendClass.length === 0) {
      titleCOnt[0].innerHTML += '<div class="bottomLine"></div>';
    }
  }

  const onChangePredictiveSearch = (e: any) => {
    setQuerryString(e);
    if (e.startsWith('#') && e === t("Approaching_Deletion")) {
      setDateOptionType(dateOptionsTypes.approachingDeletion);
    } else {
      setDateOptionType(dateOptionsTypes.basicoptions);
    }
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
    return modifiedQuery;
  }

  return (
    <div className='advanceSearchChildren'>
      <div className='searchComponents'>
        <div className={`predictiveSearch ${searchData ? "CRXPredictiveDisable" : ""}`}>
          <CRXRows container spacing={0}>
            <CRXColumn item xs={6} className='topColumn'>
              <label className='searchLabel'>{t("Search_Assets")}</label>
              <PredictiveSearchBox
                onSet={(e) => onChangePredictiveSearch(e)}
                value={predictiveText}
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
            onClick={Search}
            color='primary'
            variant='contained'
          >
            {t("Search")}
          </CRXButton>
        </div>

        {showShortCutSearch && (
          <>
            <div className='middleContent'>
              <SelectedAsset shortcutData={shortcutData} />
            </div>
          </>
        )}

        {showAdvanceSearch && (
          <>
            <div className='advanceSearchContet'>
              <CRXButton
                onClick={() => {
                  setShowAdvance(!showAdvance);
                }}
                className='PreSearchButton'
              >
                <i className={'fas fa-sort-down ' + iconRotate}></i> {t("Advanced")}
                {t("Search")}
              </CRXButton>

              {showAdvance && (
                <AdvanceOption
                  getOptions={(e) => getAllOptions(e)}
                  hideOptions={() => setShowAdvance(false)}
                  dateOptionType={dateOptionType}
                  dateTimeDetail={dateTimeDropDown}
                />
              )}
            </div>
          </>
        )}
        {searchData && (
          <div className='dataTabAssets dataTabAssets_table'>
            <MasterMain
              key={Math.random()}
              rowsData={searchData}
              showDateCompact={showAssetDateCompact}
              dateOptionType={dateOptionType === dateOptionsTypes.approachingDeletion ? "" : dateOptionType}
              dateTimeDetail={dateTimeAsset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;

