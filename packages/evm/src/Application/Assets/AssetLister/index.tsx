import React from "react";
import AssetLister from "./AssetLister";
const MainAssetLister = (props:{}) => {
  return (
    <div className="advanceSearchContent">
        <AssetLister {...props} />
    </div>
  );
};

export default MainAssetLister;
