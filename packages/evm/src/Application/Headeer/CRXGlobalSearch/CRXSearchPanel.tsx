import React from "react";
import { CRXDrawer, CRXIcon, CRXHeading } from "@cb/shared";
import GlobalSearch from "./GlobalSearchContent";
import "./CRXGlobalSearch.scss";
const ToggleButton = (
  <CRXIcon className="bucketIcon">
    <i className="fas fa-search"></i>
  </CRXIcon>
);

const toggleState = () => {};

const CRXGlobalSearchPanel = () => {
  return (
    <CRXDrawer
      className="CRXGlobalSearchPanel"
      anchor="right"
      button={ToggleButton}
      btnStyle="GlobalSearchIconButton"
      toggleState={toggleState}
    >
      <CRXHeading variant="h2" align="left" className="globalSearchHeading">
        Global Search
      </CRXHeading>
      <GlobalSearch />
    </CRXDrawer>
  );
};

export default CRXGlobalSearchPanel;
