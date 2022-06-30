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
import { useTranslation } from "react-i18next";

type Props = {
  selectedItems: assetRow[];
  row: assetRow;
  setSelectedItems?: any
};



const BucketActionMenu: React.FC<Props> = ({ selectedItems = [], row, setSelectedItems }) => {
  const dispatch = useDispatch()
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);

  const { t } = useTranslation<string>();
  const removeFromAssetBucket = () => {
    //if (row) {
      const find = selectedItems.findIndex((selected: assetRow) => selected.id === row.id)
      console.log("Find ", find)
      const data = find === -1 ? row : selectedItems
      dispatch(removeAssetFromBucketActionCreator(data))
      if (find !== -1) {
        setSelectedItems([])
      }
    // }
    // else {
    //   dispatch(removeAssetFromBucketActionCreator(selectedItems))
    //   setSelectedItems([])
    // }
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
          {`${t("Remove_from_asset_bucket")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-clipboard-list fa-md"></i>
          </div>
          <div className="crx-menu-list">
          {`${t("Categorize")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
          {`${t("Set_as_primary_asset")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
          {`${t("Assign_to_case")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-user-tag fa-md"></i>
          </div>
          <div className="crx-menu-list">
            {`${t("Assign_User")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content ">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
          {`${t("Modify_Retention")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
          {`${t("TBD")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-envelope fa-md"></i>
          </div>
          <div className="crx-menu-list">
          {`${t("Email")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list">
            <SubMenu label="Export">
              <MenuItem>{`${t("File")}`}</MenuItem>
              <MenuItem>{`${t("Metadata")}`}</MenuItem>
              <MenuItem>{`${t("Evidence_overlaid_video")}`}</MenuItem>
              <MenuItem>{`${t("Metadata_overlaid_video")}`}</MenuItem>
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
            {`${t("Open_in_Getac_AI_tools_App")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-link fa-md"></i>
          </div>
          <div className="crx-menu-list">
            {`${t("Link_asset")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem disabled>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list disabledItem">
          {`${t("Link_to_this_group")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content">
          <div className="crx-menu-icon">
            <i className="far fa-external-link-square fa-md"></i>
          </div>
          <div className="crx-menu-list">
          {`${t("Move_asset")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem disabled>
        <div className="crx-meu-content groupingMenu">
          <div className="crx-menu-icon">

          </div>
          <div className="crx-menu-list disabledItem">
          {`${t("Move_to_this_group")}`}
          </div>
        </div>
      </MenuItem>
      <MenuItem>
        <div className="crx-meu-content crx-spac" onClick={RestrictAccessClickHandler}>
          <div className="crx-menu-icon">
            <i className="far fa-user-lock fa-md"></i>
          </div>
          <div className="crx-menu-list">
          {`${t("Restrict_access")}`}
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
