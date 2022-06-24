import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import './index.scss'
import { removeAssetFromBucketActionCreator } from "../../../../Redux/AssetActionReducer";
import { useDispatch } from "react-redux";
import { assetRow } from "./types";
import RestrictAccessDialogue from "../RestrictAccessDialogue";

type Props = {
  selectedItems: assetRow[];
  row?: assetRow;
  setSelectedItems?: any
};



const BucketActionMenu: React.FC<Props> = ({ selectedItems = [], row, setSelectedItems }) => {
  const dispatch = useDispatch()
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);

  const removeFromAssetBucket = () => {
    if (row) {
      const find = selectedItems.findIndex((selected: assetRow) => selected.id === row.id)
      const data = find === -1 ? row : selectedItems
      dispatch(removeAssetFromBucketActionCreator(data))
      if (find !== -1) {
        setSelectedItems([])
      }
    }
    else {
      dispatch(removeAssetFromBucketActionCreator(selectedItems))
      setSelectedItems([])
    }
  }

  const RestrictAccessClickHandler = () => setOpenRestrictAccessDialogue(true);
  
  const confirmCallBackForRestrictModal = () => {
    alert('Confirm Btn Clicked!')
  }

  return (
    <>
    <Menu
      align="start"
      viewScroll="initial"
      direction="right"
      position="auto"
      className="menuCss"
      arrow
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    >

      <MenuItem >
        <div className="crx-meu-content groupingMenu crx-spac" onClick={removeFromAssetBucket} >
          <div className="crx-menu-icon"></div>
          <div className="crx-menu-list">
            Remove from asset bucket
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-clipboard-list fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Categorize
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            Set as primary asset
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            Assign to case
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-user-tag fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Assign user
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content ">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            Modify Retention
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            TBD
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-envelope fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Email
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            <SubMenu label="Export">
              <MenuItem>File</MenuItem>
              <MenuItem>Metadata</MenuItem>
              <MenuItem>Evidence overlaid video</MenuItem>
              <MenuItem>Metadata overlaid video</MenuItem>
            </SubMenu>
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">
            <i className="far fa-photo-video fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Open in Getac AI tools App
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-link fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Link asset
          </div>
        </div>
      </MenuItem>
      <MenuItem disabled>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list disabledItem">
            Link to this group
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-external-link-square fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Move asset
          </div>
        </div>
      </MenuItem>
      <MenuItem disabled>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list disabledItem">
            Move to this group
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content crx-spac" onClick={RestrictAccessClickHandler}>
          <div className="crx-menu-icon">
            <i className="far fa-user-lock fa-md"></i>
          </div>
          <div className="crx-menu-list">
            Restrict access
          </div>
        </div>
      </MenuItem>
    </Menu>

    <RestrictAccessDialogue
        openOrCloseModal={openRestrictAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenRestrictAccessDialogue(e)}
        onConfirmBtnHandler={confirmCallBackForRestrictModal}
      />
    </>
  );
};
export default BucketActionMenu;
