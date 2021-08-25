import React from 'react';
import PredictiveSearchBox from './PredictiveSearchBox/PredictiveSearchBox';
import { CRXButton, CRXRows, CRXColumn } from '@cb/shared';
import AdvanceOptions from './AdvanceOptions';
import MasterMain from '../DataGrid/MasterMain';
import './SearchComponent.scss';
import SelectedAsset from './SelectedAsset';
import queries from '../../QueryManagement/queries';
import constants from '../../utils/constants';
import {DateTimeComponent, DateTimeObject } from '../../../../components/DateTimeComponent';
import { useDispatch } from 'react-redux';
import { enterPathActionCreator } from '../../../../Redux/breadCrumbReducer';
import { scroller } from 'react-scroll';
import moment from 'moment';
import {
dateOptionsTypes,
  basicDateDefaultValue,
  approachingDateDefaultValue,
  dateOptions
} from '../../../../utils/constant';
import usePostFetch from '../../../../utils/Api/usePostFetch';
import { useState } from 'react';
import { useEffect } from 'react';



const AssetSearchType = {
  basicSearch: "BasicSearch",
  approachingDeletion:"ApproachingDeletion"
}

const SearchComponent = (props: any) => {
  const dispatch = useDispatch();
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showAdvanceSearch, setAdvanceSearch] = React.useState(true); //showShortCutSearch
  const [showShortCutSearch, setShowShortCutSearch] = React.useState(true);
  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();
  const [querryString, setQuerryString] = React.useState('');
  const [defaultDateValue, setDefaultDateValue] = React.useState(basicDateDefaultValue);
 const [dateOptionType, setDateOptionType] = React.useState(dateOptionsTypes.basicoptions);

  const [searchData, setSearchData] = React.useState<any>();
  const [brdState, setBrdState] = React.useState<any>('');
  const [predictiveText, setPredictiveText] = React.useState('');

  const [searchType, setSearchType] = React.useState(AssetSearchType.basicSearch)
 
  const [dateTimeDropDown, setDateTimeDropDown] = React.useState<DateTimeObject>({
                                                                  startDate: moment().startOf("day").subtract(29, "days").set("second", 0).format(), 
                                                                  endDate: moment().endOf("day").set("second", 0).format(), 
                                                                  value:basicDateDefaultValue, 
                                                                  displayText:basicDateDefaultValue
                                                                });
  const [dateTimeAsset, setDateTimeAsset] = React.useState<DateTimeObject>({
                                                                  startDate: "", 
                                                                  endDate: "", 
                                                                  value:"", 
                                                                  displayText:""
                                                                });

  const [showAssetDateCompact, setShowAssetDateCompact] = React.useState(true);

  const [compactDateRange, setCompactDateRange] = React.useState({
                                                          showCompact:false,
                                                          minDate:"",
                                                          maxDate:""
                                                  });

  const iconRotate = showAdvance ? ' ' : 'rotate90';
  const url = '/Evidence?Size=500&Page=1';
  const [postDataForSearch, responseForSearch] = usePostFetch<any>(url);
  
  const QUERRY: any = {
    bool: {
      must: [
        {
          query_string: {
            query: `${querryString}`,
            fields: [
              'asset.assetName',
              'categories',
              'cADId',
              'asset.recordedBy',
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

  React.useEffect(() => {
    setSearchData(responseForSearch);
  }, [responseForSearch]);


  // fetchData
  const fetchData = (querry: any, searchType: any) => {

    /* Previous Fetch Logic */
    // fetch(url, {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Group-Ids': '1,2,3,4,5',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(querry || QUERRY),
    // }).then((response) => response.json()).then(res => setSearchData(res));
    /* res => setSearchData(res) ==> This part is handled in useEffect, line no 70.  */

    /* Applying usePostFetch Hook*/
    postDataForSearch(querry || QUERRY, {
      'Group-Ids': '1,2,3,4,5',
      'Content-Type': 'application/json',
    });

    if (searchType === constants.SearchType.SimpleSearch || searchType === constants.SearchType.ShortcutSearch) {
      setShowShortCutSearch(false);
      setAdvanceSearch(false);
    } else if (searchType === constants.SearchType.AdvanceSearch) {
      scroller.scrollTo('advanceSearchContet', {
        duration: 100,
        delay: 100,
        smooth: true,
        offset: -130,
      });
    }

    dispatch(enterPathActionCreator({ val: 'Search Results' }));

    const titleCOnt = document.getElementsByClassName('titlePage');
    var appendClass = document.getElementsByClassName('bottomLine');
    if (appendClass.length === 0) {
      titleCOnt[0].innerHTML += '<div class="bottomLine"></div>';
    }
  };

  const Search = () => {
   
    console.log("set Date time asset");
    console.log(dateTimeDropDown);

    const NormalSearch =() =>{

      setDateTimeAsset(dateTimeDropDown)
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

      fetchData(QUERRY, constants.SearchType.SimpleSearch);
      setAdvanceSearch(false);
      setShowAssetDateCompact(true);
    };

    if (querryString &&
      querryString.length > 0 &&
      querryString.startsWith(constants.assetShortCutPrefix)
    ) {
      let exactShortCutName = querryString.substring(1);
      let shortCut = shortcutData.find(x => x.text === exactShortCutName);
      if (shortCut) {
        if (shortCut.text === constants.AssetShortCuts.ApproachingDeletion) {
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
  };

  const shortcutData = [
    {
      text: constants.AssetShortCuts.NotCategorized,
      query: () => queries.GetAssetsUnCategorized( dateTimeDropDown.startDate, dateTimeDropDown.endDate),
      renderData: function () {
        setPredictiveText(constants.AssetShortCutsWithPrefix.NotCategorized);
        setQuerryString(constants.AssetShortCutsWithPrefix.NotCategorized);
        fetchData(this.query(), constants.SearchType.ShortcutSearch);
        setDateTimeAsset(dateTimeDropDown);
        setShowAssetDateCompact(true);

      },
    },
    {
      text: constants.AssetShortCuts.Trash,
      query: () => queries.GetAssetsBySatus(constants.AssetStatus.Trash),
      renderData: function () {
        setPredictiveText(constants.AssetShortCutsWithPrefix.Trash);
        setQuerryString(constants.AssetShortCutsWithPrefix.Trash);
        fetchData(this.query(), constants.SearchType.ShortcutSearch);
        setDateTimeAsset(dateTimeDropDown);
        setShowAssetDateCompact(true);

      },
    },
    {
      text: constants.AssetShortCuts.ApproachingDeletion,
      query: () =>
        queries.GetAssetsApproachingDeletion(dateTimeDropDown.startDate, dateTimeDropDown.endDate),
        renderData: function (dateTimeObject : DateTimeObject | undefined = undefined) {

            setDateOptionType(dateOptionsTypes.approachingDeletion); 
            setSearchType(AssetSearchType.approachingDeletion);
            setPredictiveText(constants.AssetShortCutsWithPrefix.ApproachingDeletion);
            setQuerryString(constants.AssetShortCutsWithPrefix.ApproachingDeletion);

            if(!dateTimeObject){
              var  approachingdateValue = dateOptions.approachingDeletion.find(x=> x.value === approachingDateDefaultValue);
              if(approachingdateValue != null){
                fetchData(queries.GetAssetsApproachingDeletion(approachingdateValue.startDate(), approachingdateValue.endDate()),constants.SearchType.ShortcutSearch) 
               
                var  defaultDateValue = dateOptions.basicoptions.find(x=> x.value === basicDateDefaultValue);
                if(defaultDateValue !== undefined){

                  var approachingDefaultDateValue :DateTimeObject ={
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
            else{
              fetchData(queries.GetAssetsApproachingDeletion(dateTimeObject.startDate, dateTimeObject.endDate),constants.SearchType.ShortcutSearch) 
            }

            var  approachingMaxDateValue = dateOptions.approachingDeletion.find(x=> x.value === "next 30 days");
            if(approachingMaxDateValue){
              console.log("max date");
              console.log(approachingMaxDateValue);
              setCompactDateRange({
                  showCompact:true,
                  minDate:approachingMaxDateValue.startDate(),
                  maxDate:approachingMaxDateValue.endDate()
              })
            }
            setShowAssetDateCompact(false);
      },
    },
  ];


  React.useEffect(() => {
    dispatch(enterPathActionCreator({ val: '' }));
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
        if (o != undefined && o.key == 'username') {
          const val = {
            bool: {
              should: [{ match: { 'asset.recordedBy': `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        } else if (o != undefined && o.key == 'unit') {
          const val = {
            bool: {
              should: [{ match: { 'asset.unit': `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        } else if (o != undefined && o.key == 'category') {
          const val = {
            bool: {
              should: [{ match: { categories: `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        }
      });

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

      fetchData(AdvancedSearchQuerry, constants.SearchType.AdvanceSearch);
    }
  }, [addvancedOptions]);

  const onChangePredictiveSearch = (e: any) => {
    setQuerryString(e);
    if ( e.startsWith('#') &&  e === constants.AssetShortCutsWithPrefix.ApproachingDeletion ) {
     // setDateOptionsState(approachingDeletionDateOptions);
     setDateOptionType(dateOptionsTypes.approachingDeletion); 
     setDefaultDateValue(approachingDateDefaultValue);

    } else {
      setDateOptionType(dateOptionsTypes.basicoptions); 
      setDefaultDateValue(basicDateDefaultValue);
      //setDateOptionsState(dateOptions.basicoptions);
    }
  };

  const getAllOptions = (e: any) => {
    setAddvancedOptions(e);
    setDateTimeDropDown({
      startDate: e.dateTimeDropDown.startDate,
      endDate: e.dateTimeDropDown.endDate,
      value: e.dateTimeDropDown.value,
      displayText:e.dateTimeDropDown.displayText
    });
    setDateTimeAsset({
      startDate: e.dateTimeDropDown.startDate,
      endDate: e.dateTimeDropDown.endDate,
      value: e.dateTimeDropDown.value,
      displayText:e.dateTimeDropDown.displayText
    })
  };

  return (
    <div className='advanceSearchChildren'>
      <div className='searchComponents'>
        <div className='predictiveSearch'>
          <CRXRows container spacing={0}>
            <CRXColumn item xs={6} className='topColumn'>
              <label className='searchLabel'>Search Assets</label>
              <PredictiveSearchBox
                onSet={(e) => onChangePredictiveSearch(e)}
                value={predictiveText}
              />
            </CRXColumn>
            <CRXColumn item xs={6}>
              <label className='dateTimeLabel'>Date and Time</label>
              <DateTimeComponent
                showCompact={compactDateRange.showCompact}
                minDate={compactDateRange.minDate}
                maxDate={compactDateRange.maxDate}               
                dateTimeDetail={dateTimeDropDown}
                getDateTimeDropDown = {(dateTime:DateTimeObject)=> setDateTimeDropDown(dateTime) }
                dateOptionType={dateOptionType}
                />
            </CRXColumn>
          </CRXRows>
        </div>

        <div className='preSearcBtnContent'>
          <CRXButton
            className='PreSearchButton'
            onClick={Search}
            disabled={querryString.length < 1 ? true : false}
            color='primary'
            variant='contained'
          >
            Search
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
                  scroller.scrollTo('advanceSearchContet', {
                    duration: 100,
                    delay: 100,
                    smooth: true,
                    offset: -70,
                  });
                  setShowAdvance(!showAdvance);
                }}
                className='PreSearchButton'
              >
                <i className={'fas fa-sort-down ' + iconRotate}></i> Advanced
                Search
              </CRXButton>

              {showAdvance && (
                <AdvanceOptions
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
          <div className='dataTabAssets'>
            <MasterMain
              key={Math.random()}
              rowsData={searchData}
              showDateCompact={showAssetDateCompact}
              dateOptionType={dateOptionType === dateOptionsTypes.approachingDeletion ? "" : dateOptionType }
              dateTimeDetail={dateTimeAsset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
