import React from "react";
import PredictiveSearchBox from "./PredictiveSearchBox/PredictiveSearchBox";
import { CRXButton, CRXRows, CRXColumn } from "@cb/shared";
import AdvanceOptions from "./AdvanceOptions";
import MasterMain from "../DataGrid/MasterMain";
import "./SearchComponent.scss";
import SelectedAsset from "./SelectedAsset";
import queries from "../../QueryManagement/queries";
import constants from "../../utils/constants";
import DateTimeComponent from "../../../../components/DateTimeComponent";
import { useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../../Redux/breadCrumbReducer";
import { scroller } from "react-scroll";
import { basicDateOptions,approachingDeletionDateOptions, basicDateDefaultValue } from "../../../../utils/constant";

const SearchComponent = (props: any) => {
  const dispatch = useDispatch();
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showAdvanceSearch, setAdvanceSearch] = React.useState(true); //showShortCutSearch
  const [showShortCutSearch, setShowShortCutSearch] = React.useState(true);
  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();
  const [querryString, setQuerryString] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [dateOptionsState, setDateOptionsState] = React.useState(basicDateOptions);
  const [defaultDateValue, setDefaultDateValue] = React.useState("");
  const [searchData, setSearchData] = React.useState<any>();
  const [brdState, setBrdState] = React.useState<any>("");
  const [predictiveText, setPredictiveText] = React.useState("");
  const [dateTimeObj, setDateTimeObj] = React.useState({startDate: "", endDate: ""})
  const iconRotate = showAdvance ? " " : "rotate90";
  const url = "/Evidence?Size=500&Page=1";
  const QUERRY: any = {
    bool: {
      must: [
        {
          query_string: {
            query: `${querryString}`,
            fields: [
              "asset.assetName",
              "categories",
              "cADId",
              "asset.recordedBy",
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
  // fetchData
  const fetchData = (querry: any, searchType: any) => {
    fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(querry || QUERRY),
    })
      .then((response) => response.json())
      .then((res) => {
        setSearchData(res);
        return res;
      })
      .then(() => {
        if (
          searchType === constants.SearchType.SimpleSearch ||
          searchType === constants.SearchType.ShortcutSearch
        ) {
          setShowShortCutSearch(false);
          setAdvanceSearch(false);
        } else if (searchType === constants.SearchType.AdvanceSearch) {
          scroller.scrollTo("advanceSearchContet", {
            duration: 100,
            delay: 100,
            smooth: true,
            offset: -130,
          });
      }
      dispatch(enterPathActionCreator({ val: "Search Results" }));
      
      const titleCOnt = document.getElementsByClassName('titlePage');
      var appendClass = document.getElementsByClassName('bottomLine');
      if(appendClass.length === 0){
        titleCOnt[0].innerHTML += '<div class="bottomLine"></div>';
        console.log(titleCOnt);
      }
    })
  };

  const Search = () => {
   
    setDateTimeObj({startDate: startDate, endDate: endDate})
    const NormalSearch =() =>{

      if (startDate) {
        QUERRY.bool.must.push({
          range: {
            "asset.recordingStarted": {
              gte: `${startDate}`,
            },
          },
        });
      }
  
      if (endDate) {
        QUERRY.bool.must.push({
          range: {
            "asset.recordingEnded": {
              lte: `${endDate}`,
            },
          },
        });
      }

          //dispatch(enterPathAction Creator({ val: "Search Result" }));
    fetchData(QUERRY, constants.SearchType.SimpleSearch);
    setAdvanceSearch(false);
    //setBrdState("Search result");
  
    }

    if(querryString && querryString.length > 0 && querryString.startsWith(constants.assetShortCutPrefix)){

      let exactShortCutName = querryString.substring(1);
      let shortCut = shortcutData.find(x => x.text === exactShortCutName);
      if(shortCut){

        if(shortCut.text === constants.AssetShortCuts.ApproachingDeletion){
          shortCut.renderData(startDate,endDate);
        }else{
          shortCut.renderData();
        }
         
      }else{
        NormalSearch();
      }
    }else{
      NormalSearch();
    }
  };

  const shortcutData = [
    {
      text: constants.AssetShortCuts.NotCategorized,
      query: () => queries.GetAssetsUnCategorized(startDate,endDate),
      renderData: function () {
        setPredictiveText( constants.AssetShortCutsWithPrefix.NotCategorized);
        setQuerryString( constants.AssetShortCutsWithPrefix.NotCategorized);
        fetchData(this.query(), constants.SearchType.ShortcutSearch);
      },
    },
    {
      text: constants.AssetShortCuts.Trash,
      query: () => queries.GetAssetsBySatus(constants.AssetStatus.Trash),
      renderData: function () {
        setPredictiveText(constants.AssetShortCutsWithPrefix.Trash);
        setQuerryString(constants.AssetShortCutsWithPrefix.Trash);
        fetchData(this.query(), constants.SearchType.ShortcutSearch);
      },
    },
    {
      text: constants.AssetShortCuts.ApproachingDeletion,
      query: (startDate1:string,endDate1:string) => queries.GetAssetsApproachingDeletion(startDate1,endDate1)   ,
      renderData: function (startDate:string = "",endDate:string="") {
        setPredictiveText(constants.AssetShortCutsWithPrefix.ApproachingDeletion);
        setQuerryString(constants.AssetShortCutsWithPrefix.ApproachingDeletion);
        setDateOptionsState(approachingDeletionDateOptions);
        
        if(startDate === ""){
          startDate = approachingDeletionDateOptions[0].startDate();
        }
        if(endDate  === ""){
          endDate = approachingDeletionDateOptions[0].endDate();
        }
        setDefaultDateValue(approachingDeletionDateOptions[0].value);
        fetchData( this.query(startDate,endDate), constants.SearchType.ShortcutSearch); 
      },
    },
  ];

  React.useEffect(() => {
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

  React.useEffect(() => {
    let obj: any = {};

    if (addvancedOptions  && addvancedOptions.options) {
      obj = addvancedOptions.options.map((x: any) => {
        if (x.inputValue) {
          return { key: x.key, inputValue: x.inputValue };
        }
      });

      obj.map((o: any) => {
        if (o != undefined && o.key == "username") {
          const val = {
            bool: {
              should: [{ match: { "asset.recordedBy": `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        } else if (o != undefined && o.key == "unit") {
          const val = {
            bool: {
              should: [{ match: { "asset.unit": `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        } else if (o != undefined && o.key == "category") {
          const val = {
            bool: {
              should: [{ match: { categories: `${o.inputValue}` } }],
            },
          };
          AdvancedSearchQuerry.bool.must.push(val);
        }
      });

      if (addvancedOptions.startDate) {	
               AdvancedSearchQuerry.bool.must.push({	
                 range: {	
                 "asset.recordingStarted": {	
                    gte: `${addvancedOptions.startDate}`,	
                   },	
                },	
               });	
              }	
          	
              if (addvancedOptions.endDate) {	
                AdvancedSearchQuerry.bool.must.push({	
                  range: {	
                   "asset.recordingEnded": {	
                      lte: `${ addvancedOptions.endDate}`,	
                    },	
                 },	
               });	
              }

      fetchData(AdvancedSearchQuerry, constants.SearchType.AdvanceSearch);
    }
  }, [addvancedOptions]);


  const onChangePredictiveSearch = (e:
    
    any)=>{
    setQuerryString(e)
    if(e.startsWith("#") && e === constants.AssetShortCutsWithPrefix.ApproachingDeletion ){
        setDateOptionsState(approachingDeletionDateOptions);
    }
    else{
      setDefaultDateValue(basicDateDefaultValue);
      setDateOptionsState(basicDateOptions);
    }
  }

  const getAllOptions = (e: any) => {
    setAddvancedOptions(e)
    setDateTimeObj({startDate: e.startDate, endDate: e.endDate})
  }

  return (
    <div className="advanceSearchChildren">
      <div className="searchComponents">
        <div className="predictiveSearch">
          <CRXRows container spacing={0}>
            <CRXColumn item xs={6} className="topColumn">
              <label className="searchLabel">Search Assets</label>
              <PredictiveSearchBox
                onSet={(e) => onChangePredictiveSearch(e)}
                value={predictiveText}
              />
            </CRXColumn>
            <CRXColumn item xs={6}>
              <label className="dateTimeLabel">Date and Time</label>

              <DateTimeComponent
                getStartDate={(val: any) => { setStartDate(val)}}
                getEndDate={(val: any) => {  setEndDate(val) } }
                dateOptions={dateOptionsState}
                defaultValue={defaultDateValue}
                // minDate="2021-06-15T00:00"
                // maxDate="2021-06-20T00:00"
                // showChildDropDown={false}
              />
            </CRXColumn>
          </CRXRows>
        </div>

        <div className="preSearcBtnContent">
          <CRXButton
            className="PreSearchButton"
            onClick={Search}
            disabled={querryString.length < 1 ? true : false}
            color="primary"
            variant="contained"
          >
            Search
          </CRXButton>
        </div>

        {showShortCutSearch && (
          <>
            <div className="middleContent">
              <SelectedAsset shortcutData={shortcutData} />
            </div>
          </>
        )}
        {showAdvanceSearch && (
          <>
            <div className="advanceSearchContet">
              <CRXButton
                onClick={() => {
                  scroller.scrollTo("advanceSearchContet", {
                    duration: 100,
                    delay: 100,
                    smooth: true,
                    offset: -70,
                  });
                  setShowAdvance(!showAdvance)}}
                className="PreSearchButton"
              >
                <i className={"fas fa-sort-down " + iconRotate}></i> Advanced
                Search
              </CRXButton>

              {showAdvance && (
                <AdvanceOptions
                  getOptions={(e) => getAllOptions(e)}
                  hideOptions={() => setShowAdvance(false)}
                />
              )}
            </div>
          </>
        )}
        {searchData && (
          <div className="dataTabAssets">
            <MasterMain key={Math.random()} rows={searchData} dateTimeObj={dateTimeObj}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
