import React from "react";
import { urlList, urlNames } from "../../../utils/urlList";
import Footer from "../../Footer";
import "./AlprAdvanceSearch.scss";
import AlprAdvanceSearch from './AlprAdvanceSearch';

const ManageALPR = (props: any, bottom: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { location } = props
  const urlname = urlList.filter((item: any) => item.name === urlNames.AlprAdvanceSearchResult)[0].url
  React.useEffect(() => {
    if (location.pathname == urlname) {
      setIsOpen(true)
    }
    else {
      setIsOpen(false)
    }
  }, [location])

  return (
    <>
      <div className="Alpr_advanceSearchContent">
        <AlprAdvanceSearch {...props} isopen={isOpen} />
      </div>
      <footer>
        <Footer SetBottomPos={bottom} />
      </footer>
    </>
  );
};

export default ManageALPR;
