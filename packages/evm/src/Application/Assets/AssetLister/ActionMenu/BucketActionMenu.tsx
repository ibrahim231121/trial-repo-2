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
import { AssetLockUnLockErrorType, assetRow } from "./types";
import RestrictAccessDialogue from "../RestrictAccessDialogue";
import Restricted from "../../../../ApplicationPermission/Restricted";
import SecurityDescriptor from "../../../../ApplicationPermission/SecurityDescriptor";
import { CRXAlert } from "@cb/shared";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";

type Props = {
  selectedItems: assetRow[];
  row: assetRow;
  setSelectedItems?: any;
  isChecked?: any
};

const BucketActionMenu: React.FC<Props> = ({ selectedItems = [], row, setSelectedItems, isChecked }) => {
  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
  const [assetLockUnLockError, setAssetLockUnLockError] = React.useState<AssetLockUnLockErrorType>({
    isError: false,
    errorMessage: ''
  });

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
        userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
        operation: "Lock"
      });
    }
    else {
      if (selectedItems.length > 0) {
        for (const selectedItem of selectedItems) {
          _requestBody.push({
            evidenceId: row?.id,
            assetId: selectedItem.assetId,
            userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
            operation: "Lock"
          });
        }
      }
      const _body = JSON.stringify(_requestBody);
      EvidenceAgent.LockOrUnLockAsset(_body).then(() => {
        setSuccessMessage(t('The_asset_are_locked'));
        setSuccess(true);
        setTimeout(() => {
          dispatch(getAssetSearchInfoAsync(""));
          setOpenRestrictAccessDialogue(false);
          setSuccess(false);
        }, 2000);
      })
        .catch((error) => {
          let errorMessage = '';
          const err = error as AxiosError;
          if (err.request.status === 409) {
            errorMessage = t('The_asset_is_already_locked');
          } else {
            errorMessage = t('We_re_sorry_The_asset_cant_be_locked_Please_retry_or_contact_your_Systems_Administrator');
          }
          setAssetLockUnLockError({
            errorMessage: errorMessage,
            isError: true
          });
        });
    }
  }

  return (
    <>
      {success && <CRXAlert message={successMessage} alertType='toast' open={true} />}
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

        <MenuItem>
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
        isError = {assetLockUnLockError.isError}
        errorMessage = {assetLockUnLockError.errorMessage}
      />
    </>
  );
};
export default BucketActionMenu;
