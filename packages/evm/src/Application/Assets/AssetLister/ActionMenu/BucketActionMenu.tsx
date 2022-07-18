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
import Restricted from "../../../../ApplicationPermission/Restricted";
import SecurityDescriptor from "../../../../ApplicationPermission/SecurityDescriptor";
import { EVIDENCE_PATCH_LOCK_UNLOCK_URL } from "../../../../utils/Api/url";
import http from "../../../../http-common";
import { CRXAlert } from "@cb/shared";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type Props = {
  selectedItems: assetRow[];
  row: assetRow;
  setSelectedItems?: any;
  isChecked?: any
};

const BucketActionMenu: React.FC<Props> = ({ selectedItems = [], row, setSelectedItems, isChecked }) => {
  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
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
    const _requestBody = [];
    /*
    * * Multiple Asset Not Selected.
    */
    if (Object.keys(isChecked).length == 0) {
      _requestBody.push({
        evidenceId: row?.id,
        assetId: row?.assetId,
        userRecId: localStorage.getItem('User Id'),
        operation: "Lock"
      });
    }
    else {
      if (selectedItems.length > 0) {
        for (const selectedItem of selectedItems) {
          _requestBody.push({
            evidenceId: row?.id,
            assetId: selectedItem.assetId,
            userRecId: localStorage.getItem('User Id'),
            operation: "Lock"
          });
        }
      }
      const _body = JSON.stringify(_requestBody);
      const _url = `${EVIDENCE_PATCH_LOCK_UNLOCK_URL}`;
      http.patch(_url, _body).then((response) => {
        if (response.status === 204) {
          setSuccess(true);
          setTimeout(() => {
            setOpenRestrictAccessDialogue(false);
            setSuccess(false);
          }, 3000);
        }
      })
        .catch((error) => {
          const err = error as AxiosError;
          if (err.request.status === 409) {
            setErrorMessage("The asset is already locked.");
          } else {
            setErrorMessage("We 're sorry. The asset can't be locked. Please retry or  contact your Systems Administrator");
          }
          setError(true);
        });
    }
  }

  return (
    <>
      {success && <CRXAlert message='Success: The assets are locked.' alertType='toast' open={true} />}
      {error && (
        <CRXAlert
          message={errorMessage}
          type='error'
          alertType='inline'
          open={true}
        />
      )}

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
