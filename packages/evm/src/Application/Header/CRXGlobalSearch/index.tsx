import React from "react";
import { CRXDrawer, CRXIcon, CRXHeading,CRXTooltip } from "@cb/shared";
import GlobalSearch from "./GlobalSearchContent";
import "./index.scss";
import { useTranslation } from "react-i18next";

const ToggleButton = (
  <CRXIcon className="bucketIcon">
    <CRXTooltip iconName="fas fa-search" arrow={false} title="search" placement="bottom" className="crxSearchTooltip"/>
  </CRXIcon>
);

const toggleState = () => {};

const CRXGlobalSearchPanel = () => {
  const { t } = useTranslation<string>();
  return (
    <CRXDrawer
      className="CRXGlobalSearchPanel"
      anchor="right"
      button={ToggleButton}
      btnStyle="GlobalSearchIconButton"
      toggleState={toggleState}
    >
      <CRXHeading variant="h2" align="left" className="globalSearchHeading">
        {t("Global_Search")}
      </CRXHeading>
      <GlobalSearch />
    </CRXDrawer>
  );
};

export default CRXGlobalSearchPanel;
