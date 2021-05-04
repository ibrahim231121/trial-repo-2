import React from "react";
import PredictiveSearchBox from "./PredictiveSearchBox/PredictiveSearchBox";
import TodayIcon from "@material-ui/icons/Today";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { CRXDropDown, CRXButton, CRXDateRangePicker } from "@cb/shared";
import AdvanceOptions from "./AdvanceOptions";
import MasterMain from "../DataGrid/MasterMain";
const SearchComponent = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [selectOption, setSelectOption] = React.useState("Please Select");
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [showDateRange, setShowDateRange] = React.useState(false);
  const [addvancedOptions, setAddvancedOptions] = React.useState<any>();

  const [querryString, setQuerryString] = React.useState("");
  const [startDate, setStartDate] = React.useState<any>();
  const [endDate, setEndDate] = React.useState(new Date().toISOString());
  const [searchData, setSearchData] = React.useState<any>();
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
        // {
        //   range: {
        //     "asset.recordingStarted": {
        //       gte: "2020-03-26T21:20:15.172Z",
        //     },
        //   },
        // },
        // {
        //   range: {
        //     "asset.recordingEnded": {
        //       lte: "2020-03-26T21:20:15.172Z",
        //     },
        //   },
        // },
      ],
    },
  };
  const AdvancedSearchQuerry: any = {
    bool: {
      must: [],
    },
  };

  const dateOptions = [
    { value: "today", displayText: "today " },
    { value: "yesterday", displayText: " yesterday" },
    { value: "last 7 days", displayText: "last 7 days" },
    { value: "last 30 days", displayText: "last 30 days" },
    { value: "current calendar month", displayText: "current calendar month" },
    { value: "last calendar month", displayText: "last calendar month" },
    { value: "custom", displayText: "custom" },
  ];
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
  const getDate = (type: string) => {
    switch (type) {
      case "yesterday":
        return ((d) => new Date(d.setDate(d.getDate() - 1)))(
          new Date()
        ).toISOString();
        break;
      case "today":
        return new Date();
        break;
      case "last 7 days":
        return ((d) => new Date(d.setDate(d.getDate() - 7)))(
          new Date()
        ).toISOString();
        break;
      case "last 30 days":
        return ((d) => new Date(d.setDate(d.getDate() - 30)))(
          new Date()
        ).toISOString();
        break;
      case "current calendar month":
        return ((d) => new Date(d.setDate(d.getDate() - 30)))(
          new Date()
        ).toISOString();
        break;
      case "last calendar month":
        return ((d) => new Date(d.setDate(d.getDate() - 30)))(
          new Date()
        ).toISOString();
        break;
      case "custom":
        return "custom";
        break;
      default:
        return new Date().toISOString();
    }
  };
  const Search = () => {
    const date = getDate(selectOption);
    console.log(startDate);
    console.log(endDate);
    if (date != "custom") {
      setStartDate(date);
      fetchData(QUERRY);
    }
  };
  const handleClickOutSide = (e: MouseEvent) => {
    const { current: wrap } = wrapperRef;
    if (
      wrapperRef.current !== null &&
      !wrapperRef.current.contains(e.target as HTMLElement)
    ) {
      setShowDateRange(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <div style={{ width: "100%" }}>
          <label className="dateTimeLabel">Search {"<Assets>"}</label>
          <PredictiveSearchBox onSet={(e) => setQuerryString(e)} />
        </div>
        <div style={{ width: "100%" }}>
          <label className="dateTimeLabel">Date and Time</label>
          <CRXDropDown
            value={selectOption}
            onChange={(e: any) => setSelectOption(e.target.value)}
            options={dateOptions}
          >
            <button
              style={{ background: "none", border: "none" }}
              onClick={() => setShowDateRange(true)}
            >
              <TodayIcon className="searchToday" />
            </button>
            {showDateRange && (
              <div ref={wrapperRef}>
                <CRXDateRangePicker
                  onChange={(data: any) => console.log(data)}
                />
              </div>
            )}
          </CRXDropDown>
        </div>
      </div>
      <div className="preSearcBtnContent">
        <CRXButton
          color="secondary"
          variant="outlined"
          className="PreSearchButton"
          onClick={Search}
          disabled={querryString.length < 1 ? true : false}
        >
          Search
        </CRXButton>
      </div>
      <div className="middleContent">
        <div className="listOfContent">
          <div className="listButton">
            <CRXButton className="listParentBtn">
              <ImageSearchIcon className="listIcon" />
            </CRXButton>
            <div className="count-badge">120</div>
          </div>
          <div className="iconBtnLabel">My Assets</div>
        </div>
        <div className="listOfContent">
          <div className="listButton">
            <CRXButton className="listParentBtn">
              <ImageSearchIcon className="listIcon" />
            </CRXButton>
            <div className="count-badge">15</div>
          </div>
          <div className="iconBtnLabel">Not Categorized</div>
        </div>
        <div className="listOfContent">
          <div className="listButton">
            <CRXButton className="listParentBtn">
              <ImageSearchIcon className="listIcon" />
            </CRXButton>
            <div className="count-badge">5</div>
          </div>
          <div className="iconBtnLabel">Approaching Deletion</div>
        </div>
      </div>
      <div className="advanceSearchContet">
        <CRXButton
          onClick={() => setShowAdvance(!showAdvance)}
          color="secondary"
          variant="outlined"
          className="PreSearchButton"
        >
          Advanced Search
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
