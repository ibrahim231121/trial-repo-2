import React from "react";
import PredictiveSearchBox from "./PredictiveSearchBox";
import TodayIcon from "@material-ui/icons/Today";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { CRXDropDown, CRXButton, CRXDateRangePicker } from "@cb/shared";
import AdvanceOptions from "./AdvanceOptions";
const SearchComponent = () => {
  const [selectOption, setSelectOption] = React.useState("Please Select");
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [showDate, setShowDate] = React.useState(false);
  const [querryString, setQuerryString] = React.useState("");
  const [startDate, setStartDate] = React.useState<any>();
  const [endDate, setEndDate] = React.useState(new Date().toISOString());
  const [searchData, setSearchData] = React.useState<any>();
  console.log("searchData", searchData);
  const url = "/Evidence?Size=10&Page=1";
  const querry = {
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
        {
          range: {
            "asset.recordingStarted": {
              gte: "2020-03-26T21:20:15.172Z",
            },
          },
        },
        {
          range: {
            "asset.recordingEnded": {
              lte: "2020-03-26T21:20:15.172Z",
            },
          },
        },
      ],
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
  const fetchData = () => {
    fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(querry),
    })
      .then((response) => response.json())
      .then((res) => {
        setSearchData(res);
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
      fetchData();
    }
  };
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
            <button onClick={() => setShowDate(true)}>
              <TodayIcon className="searchToday" />
            </button>
            {showDate && (
              <CRXDateRangePicker onChange={(data: any) => console.log(data)} />
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
          disabled={querryString.length < 3 ? true : false}
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
        {showAdvance && <AdvanceOptions />}
      </div>
    </div>
  );
};

export default SearchComponent;
