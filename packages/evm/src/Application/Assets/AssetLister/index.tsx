import React from "react";
import { urlList, urlNames } from "../../../utils/urlList";
import AssetLister from "./AssetLister";
const MainAssetLister = (props:any) => {
  const [isOpen,setIsOpen] = React.useState(false);
  const {location} = props
  const urlname = urlList.filter((item:any) => item.name === urlNames.assetSearchResult)[0].url
  React.useEffect(() => {
    if(location.pathname == urlname){
    setIsOpen(true)
    }
    else{
    setIsOpen(false)
    }
  },[location])

  return (
    <div className="advanceSearchContent">
        <AssetLister {...props} isopen= {isOpen} />
    </div>
  );
};

export default MainAssetLister;
