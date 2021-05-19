import React from "react";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import { DateContextProvider } from "../components/SearchComponent/DateContext";

const MannageAsset = () => {
  return (
    <div className="advanceSearchContent">
      <DateContextProvider>
        <SearchComponent />
      </DateContextProvider>
    </div>
  );
};

export default MannageAsset;
