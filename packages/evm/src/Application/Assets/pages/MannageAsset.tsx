import React from "react";
import SearchComponent from "../components/SearchComponent/SearchComponent";

const MannageAsset = (props:{}) => {
  return (
    <div className="advanceSearchContent">
        <SearchComponent {...props} />
    </div>
  );
};

export default MannageAsset;
