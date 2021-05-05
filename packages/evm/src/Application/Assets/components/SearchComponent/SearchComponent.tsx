import React from "react";
import PredictiveSearchBox from "./PredictiveSearchBox/PredictiveSearchBox";
import { CRXButton } from "@cb/shared";
import AdvanceOptions from "./AdvanceOptions";
import MasterMain from "../DataGrid/MasterMain";
import "./SearchComponent.scss";
import DateTime from "./PredictiveSearchBox/DateTime";
import SelectedAsset from "./SelectedAsset";
const SearchComponent = () => {
  const [showAdvance, setShowAdvance] = React.useState(false);

  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();

  const [querryString, setQuerryString] = React.useState("");

  const [searchData, setSearchData] = React.useState<any>();
  const iconRotate = showAdvance ? " " : "rotate90";
  const url = "/Evidence?Size=10&Page=1";
  const QUERRY = {
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
  const fetchData = (querry: any) => {
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
      });
  };
  const Search = () => {
    fetchData(QUERRY);
  };
  React.useEffect(() => {
    let obj: any = {};

    if (addvancedOptions) {
      obj = addvancedOptions.map((x: any) => {
        if (x.inputValue) {
          return { key: x.value, inputValue: x.inputValue };
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
        } else if (o != undefined && o.key == "unitId") {
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
      fetchData(AdvancedSearchQuerry);
    }
  }, [addvancedOptions]);
  return (
    <div className="advanceSearchContent">
      <div className="predictiveSearch">
        <div style={{ width: "100%" }}>
          <label className="dateTimeLabel">Search Assets</label>
          <PredictiveSearchBox onSet={(e) => { setQuerryString(e)}} />
        </div>
        <div style={{ width: "100%" }}>
          <DateTime />
        </div>
      </div>
      <div className="preSearcBtnContent">
        <CRXButton
          className="PreSearchButton"
          onClick={Search}
          disabled={querryString.length < 1 ? true : false}
        >
          Search
        </CRXButton>
      </div>
      <div className="middleContent">
        <SelectedAsset />
      </div>

      <div className="advanceSearchContet">
        <CRXButton
          onClick={() => setShowAdvance(!showAdvance)}
          className="PreSearchButton"
        >
          <i className={"fas fa-sort-down " + iconRotate}></i> Advanced Search
        </CRXButton>
        {showAdvance && (
          <AdvanceOptions
            getOptions={(e) => setAddvancedOptions(e)}
            hideOptions={() => setShowAdvance(false)}
          />
        )}
      </div>
      {searchData && (
        <div className="dataTabAssets">
          <MasterMain key={Math.random()} rows={searchData} />
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
