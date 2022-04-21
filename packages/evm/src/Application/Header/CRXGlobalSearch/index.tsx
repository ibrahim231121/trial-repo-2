import React from "react";
import { CRXDrawer, CRXIcon, CRXHeading,CRXTooltip } from "@cb/shared";
import GlobalSearch from "./GlobalSearchContent";
import "./index.scss";
const ToggleButton = (
  <CRXIcon className="bucketIcon">
    <CRXTooltip iconName="fas fa-search" arrow={false} title="search" placement="bottom" className="crxSearchTooltip"/>
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
