import React, { useEffect } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import { CRXModalDialog, CRXAlert } from '@cb/shared';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Category/FormContainer";
import { addAssetToBucketActionCreator } from "../../../../Redux/AssetActionReducer";
import AssignUser from '../AssignUser/AssignUser';
import ManageRetention from '../ManageRetention/ManageRetention';
import ShareAsset from '../ShareAsset/ShareAsset';

import { RootState } from "../../../../Redux/rootReducer";
import Restricted from "../../../../ApplicationPermission/Restricted";
import SecurityDescriptor from "../../../../ApplicationPermission/SecurityDescriptor";
import { useTranslation } from "react-i18next";
import RestrictAccessDialogue from "../RestrictAccessDialogue";
import http from "../../../../http-common";
import { EVIDENCE_PATCH_LOCK_UNLOCK_URL } from "../../../../utils/Api/url";
import { AxiosError } from "axios";

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
};

export interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  recordingStarted: string;
  categories: string[];
}

export enum PersmissionModel {
  View = 1,
  Share = 2,
  Update = 3,
  Exclusive = 4
}

export type securityDescriptorType = {
  groupId: number;
  permission: PersmissionModel;
}

const ActionMenu: React.FC<Props> = React.memo(({ selectedItems, row, showToastMsg }) => {

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const [shareAssetDisabled, setShareAssetDisabled] = React.useState<boolean>(false);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (selectedItems.length > 1) {
      setShareAssetDisabled(true);
    }
    else {
      setShareAssetDisabled(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {

    /**
     * ! This rerenders if row is updated, it means user clicked the menu from parent component.
     * ! So we need to reset the form index, so that it starts from start.
     */
    if (row?.evidence?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.evidence?.securityDescriptors));
    if (row?.categories?.length > 0) {
      setIsCategoryEmpty(false);
    } else {
      setIsCategoryEmpty(true);
    }
  }, [row]);

  const handleChange = () => {
    setOpenForm(true);
  };
  const addToAssetBucket = () => {
    //if undefined it means header is clicked
    if (row !== undefined && row !== null) {
      const find = selectedItems.findIndex(
        (selected: any) => selected.id === row.id
      );
      const data = find === -1 ? row : selectedItems;
      dispatch(addAssetToBucketActionCreator(data));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
  };
  const [openAssignUser, setOpenAssignUser] = React.useState(false);
  const [openManageRetention, setOpenManageRetention] = React.useState(false);
  const [openAssetShare, setOpenAssetShare] = React.useState(false);
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<any>([]);

  const handleOpenAssignUserChange = () => {
    setOpenAssignUser(true);
  };
  const handleOpenManageRetention = () => {
    setOpenManageRetention(true);
  }
  const handleOpenAssetShare = () => {
    setOpenAssetShare(true);
  }

  const MultiCompareAssetBucketData = (
    assetBucketData: AssetBucket[],
    selectedItems: any[]
  ) => {
    let assetBucketIds = assetBucketData.map((x: AssetBucket) => x.id);
    let selectedItemIds = selectedItems.map((x: any) => x.id);
    let value = selectedItemIds.map((x: number) => {
      if (assetBucketIds.includes(x)) return true;
      else return false;
    });
    return value;
  };

  if (row !== undefined && row !== null) {
    assetBucketData.map((data) => {
      if (data.id === row.id) addToAssetBucketDisabled = true;
    });
  } else if (selectedItems !== undefined && selectedItems.length > 0) {
    let value = MultiCompareAssetBucketData(assetBucketData, selectedItems);
    if (value.includes(false)) addToAssetBucketDisabled = false;
    else addToAssetBucketDisabled = true;
  }

  const findMaximumDescriptorId = (securityDescriptors: Array<securityDescriptorType>): number => {
    return Math.max.apply(Math, securityDescriptors.map((o) => {
      return parseInt(PersmissionModel[o.permission], 10);
    }));
  }

  const RestrictAccessClickHandler = () => setOpenRestrictAccessDialogue(true);

  const confirmCallBackForRestrictModal = () => {
    debugger;
    const _requestBody = [];
    for (const selectedItem of selectedItems) {
      _requestBody.push({
        evidenceId: row?.id,
        assetId: selectedItem.assetId,
        userRecId: localStorage.getItem('User Id'),
        operation: "Lock"
      });
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
  return (
    <>
      <FormContainer
        setOpenForm={() => setOpenForm(false)}
        openForm={openForm}
        rowData={row}
        isCategoryEmpty={isCategoryEmpty}
        setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
      />

      <CRXModalDialog
        maxWidth='lg'
        title={t("Assign_User")}  
        className={'CRXModal'}
        modelOpen={openAssignUser}
        onClose={() => setOpenAssignUser(false)}
        defaultButton={false}
        indicatesText={true}
      >
        <AssignUser
          selectedItems={selectedItems}
          filterValue={filterValue}
          setFilterValue={(v: any) => setFilterValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenAssignUser(false)}
          showToastMsg={(obj: any) => showToastMsg(obj)}

        />
      </CRXModalDialog>
      <CRXModalDialog
        maxWidth='lg'
        title={t("Modify_Retention")}
        className={'CRXModal'}
        modelOpen={openManageRetention}
        onClose={() => setOpenManageRetention(false)}
        defaultButton={false}
        indicatesText={true}

      >
        <ManageRetention
          items={selectedItems}
          filterValue={filterValue}
          //setFilterValue={(v: any) => setFilterValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenManageRetention(false)}
          showToastMsg={(obj: any) => showToastMsg(obj)}
        />
      </CRXModalDialog>
      <CRXModalDialog
        maxWidth='lg'
        title={t("Share_Asset")}
        className={'CRXModal'}
        modelOpen={openAssetShare}
        onClose={() => setOpenAssetShare(false)}
        defaultButton={false}
        indicatesText={true}

      >
        <ShareAsset
          items={selectedItems}
          filterValue={filterValue}
          //setFilterValue={(v: any) => setFilterValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenAssetShare(false)}
          showToastMsg={(obj: any) => showToastMsg(obj)}
        />
      </CRXModalDialog>

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
        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={addToAssetBucket}
              >
                <div className="crx-menu-icon"></div>
                <div
                  className={
                    addToAssetBucketDisabled === false
                      ? "crx-menu-list"
                      : "crx-menu-list disabledItem"
                  }
                >
                  {t("Add_to_asset_bucket")}
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        {/* <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">Set as primary asset</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem> */}

        <MenuItem>
          <Restricted moduleId={21}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content" onClick={handleOpenAssignUserChange}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-tag fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Assign_User")}</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
            <div className="crx-meu-content groupingMenu" onClick={handleOpenManageRetention}>
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list">{t("Modify_Retention")}</div>
            </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        {isCategoryEmpty === false ? (
          <MenuItem>
            <Restricted moduleId={3}>
              <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">{t("Edit_Category_and_Form")}</div>
                </div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        ) : (
          <MenuItem>
            <Restricted moduleId={2}>
              <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">{t("Categorize")}</div>
                </div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        )}

        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-envelope fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Email")}</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <SubMenu label={t("Export")}>
                    <MenuItem>Download asset(s)</MenuItem>
                    <MenuItem>Download metadata info</MenuItem>
                    <MenuItem>Download audit trail </MenuItem>
                  </SubMenu>
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        {/* <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={1} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-link fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Link_asset")}</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem> */}

        {/* <MenuItem disabled>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list disabledItem">
                  {t("Link_to_this_group")}
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem> */}

        {/* <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-external-link-square fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Move_asset")}</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem> */}
        {/* <MenuItem disabled>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list disabledItem">
                  {t("Move_to_this_group")}
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem> */}

        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
              {/* descriptorId={4} */}
              <div className="crx-meu-content crx-spac" onClick={RestrictAccessClickHandler}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-lock fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Restrict_access")}</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>
        {shareAssetDisabled === false ? (
          <MenuItem>
            <Restricted moduleId={0}>
              <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content crx-spac" onClick={handleOpenAssetShare}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-lock fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Share_Asset")}</div>
              </div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        ) : null
        }
      </Menu>

      <RestrictAccessDialogue
        openOrCloseModal={openRestrictAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenRestrictAccessDialogue(e)}
        onConfirmBtnHandler={confirmCallBackForRestrictModal}
      />
    </>
  );
});

export default ActionMenu;
