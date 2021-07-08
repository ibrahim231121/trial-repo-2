import React, { useState } from "react";
import { CRXPopOver, CRXHeading } from "@cb/shared";

import "./DetailedAssetPopup.scss";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: "none"
  },
  paper: {
    pointerEvents: "auto",
    padding: theme.spacing(1)
  }
}));

type AssetNameProps = {
    assetName: string
}

const AssetNameTooltip: React.FC<AssetNameProps> = ({assetName}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const { t } = useTranslation<string>();

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(null);
  };

  return (
    <>
      <CRXHeading
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className="CRXPopupTableAssetName"
      >
        {assetName}
      </CRXHeading>
      {assetName.length > 25 ? (
        <CRXPopOver
          open={open}
          onClose={handlePopoverClose}
          anchorEl={anchorEl}
          onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
          className={classes.popover + ' CRXPopoverStyle'}
          classes={{
            paper: classes.paper
          }}
        >
          {assetName}
        </CRXPopOver>
      ) : null}
    </>
  );
};

export default AssetNameTooltip;
