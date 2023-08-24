import { CRXTooltip } from "@cb/shared";
import React, { useEffect } from "react";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import PDFViewer from "../../../components/MediaPlayer/PdfViewer/PDFViewer";
import { assetdata } from "./AssetDetailsTemplateModel";
import { CRXTabs } from "@cb/shared";
import { useTranslation } from "react-i18next";
import ImageViewer from "../../../components/MediaPlayer/ImageViewer/ImageViewer";
import { AppBar, Box, Tab, Tabs, Theme, Typography, makeStyles } from "@material-ui/core";
// import { useStyles } from "@cb/shared/build/CRXDataTable/CRXDataTableTypes";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


const AssetsDisplayTabsHeaders = (props: any) => {
  const { setTypeOfAssetCurrentTab, typeOfAssetTab, updatePrimaryAsset, categoryAssets, isSelected, assetId} = props;

  let sortedCategoryAssets = [...categoryAssets].sort((x: any, y: any) => x.id - y.id);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(1);
  useEffect(() => {
    setSelectedId(assetId)
  }, [assetId])
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: number,
  ) => {
    if (selectedId != id) {
      updatePrimaryAsset(id);
      setSelectedId(id);
      setOpen(false);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };




  return <>
    <div className="TabsMenuHead" >
      <button style={{ textDecoration: isSelected ? "underline" : "" }} className={!(categoryAssets?.length > 0) ? "split_btn_disabled" : "split_btn_enabled"} onClick={() => { setTypeOfAssetCurrentTab(typeOfAssetTab.index) }} disabled={!(categoryAssets?.length > 0)}>{typeOfAssetTab.label + " "+ "(" + categoryAssets.length + ")"}</button>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" className={!(categoryAssets?.length > 0) ? "split_btn_disabled_arrow" : "split_btn_enabled_arrow"}>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <i className="fas fa-caret-down"></i>
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        placement={"bottom-end"}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
            id="split-button-menu-main"
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" className="asset_detail_header_split_buttons" autoFocusItem>
                  {sortedCategoryAssets.map((option: any) => (
                    <MenuItem
                      key={option}
                      selected={option.id === selectedId}
                      onClick={(event) => handleMenuItemClick(event, option.id)}
                      disableRipple 
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>

  </>
};

export default AssetsDisplayTabsHeaders;
