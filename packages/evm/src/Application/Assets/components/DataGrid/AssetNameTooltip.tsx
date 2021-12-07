import React, { useState } from "react";
import { CRXPopOver, CRXHeading, CRXTooltip } from "@cb/shared";

import "./DetailedAssetPopup.scss";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  popper: {
    width: "230px",
  },
  arrow: {
    Left : "201px"
  }
}));

type Props = {
    assetName: string
}

const AssetNameTooltip: React.FC<Props> = ({assetName}) => {
  const classes = useStyles();
  
  

  const { t } = useTranslation<string>();
  const assteTitle = <CRXHeading className="CRXPopupTableAssetName"> {assetName} </CRXHeading>
  return (
    <>
      { assetName.length > 23 ? (
        <CRXTooltip 
          className="assetsGroupPopupTootip"
          placement="top-end"
          title={assetName}
          content={assteTitle}
         
        />
        
      ): assteTitle 
      }
    </>
  );
};

export default AssetNameTooltip;
