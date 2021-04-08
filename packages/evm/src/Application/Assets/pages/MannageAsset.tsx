import React from "react";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import { CRXContainer }  from '@cb/shared'
const MannageAsset = () => {
  return (
    <div>
      <CRXContainer maxWidth="lg" disableGutters={false}>
        <SearchComponent />
      </CRXContainer>
    </div>
  );
};

export default MannageAsset;
