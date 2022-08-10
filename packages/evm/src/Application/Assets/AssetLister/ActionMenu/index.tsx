import React, { useEffect, useRef } from "react";
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
import { EVIDENCE_PATCH_LOCK_UNLOCK_URL, FILE_SERVICE_URL, EVIDENCE_EXPORT_META_DATA_URL } from "../../../../utils/Api/url";
import { AxiosError, AxiosResponse } from "axios";
import SubmitAnalysis from "../SubmitAnalysis/SubmitAnalysis";
import { CRXToaster } from "@cb/shared";
import UnlockAccessDialogue from "../UnlockAccessDialogue";


type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
  setIsOpen: any
  IsOpen: any
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

const ActionMenu: React.FC<Props> = React.memo(({ selectedItems, row, showToastMsg, setIsOpen, IsOpen }) => {

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const [multiAssetDisabled, setMultiAssetDisabled] = React.useState<boolean>(false);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [isLockedAccess, setIsLockedAccess] = React.useState<boolean>(false);
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isSelectedItem, setIsSelectedItem] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (selectedItems.length > 1) {
      setMultiAssetDisabled(true);
    }
    else {
      setMultiAssetDisabled(false);
    }
    if (selectedItems.length > 0) {
      setIsSelectedItem(true);
    }
    else {
      setIsSelectedItem(false);

    }
  }, [selectedItems]);

  React.useEffect(() => {

    /**
     * ! This rerenders if row is updated, it means user clicked the menu from parent component.
     * ! So we need to reset the form index, so that it starts from start.
     */
    if (row?.evidence?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.evidence?.securityDescriptors));
    if (row?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.securityDescriptors));
    if (row?.categories?.length > 0) {
      setIsCategoryEmpty(false);
    } else {
      setIsCategoryEmpty(true);
    }

    if (row?.evidence?.masterAsset?.lock != null) {

      setIsLockedAccess(false)
    }
    else {

      setIsLockedAccess(true)
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
      // Apply Condition
      debugger
      Object.preventExtensions(data);
      let a = Object.isExtensible(data);
      if (data.evidence) {
        data.isMaster = data.evidence.masterAssetId === data.id;
      }
      else {
        data.isMaster = data.masterAssetId === data.id;
      }
      dispatch(addAssetToBucketActionCreator(data));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
    showToastMsg({
      message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
      variant: "success",
      duration: 7000,

    })
  };
  const [openAssignUser, setOpenAssignUser] = React.useState(false);
  const [openManageRetention, setOpenManageRetention] = React.useState(false);
  const [openAssetShare, setOpenAssetShare] = React.useState(false);
  const [openAssignSubmission, setOpenAssignSubmission] = React.useState(false);

  const [openSubmitAnalysis, setOpenSubmitAnalysis] = React.useState(false);
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
  const [openUnlockAccessDialogue, setOpenUnlockAccessDialogue] = React.useState(false);
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
  const handleOpenAssignSubmission = () => {
    setOpenSubmitAnalysis(true);
  }

  const handlePrimaryAsset = () => {
    setIsOpen(true);
  };
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
    assetBucketData.forEach((data) => {
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
  const UnlockAccessClickHandler = () => setOpenUnlockAccessDialogue(true);
  const userId = parseInt(localStorage.getItem('User Id') ?? "0")
  const toasterRef = useRef<typeof CRXToaster>(null);



  const confirmCallBackForRestrictModal = () => {
    const _requestBody = [];
    if (isSelectedItem) {
      selectedItems.map((x: any) => {
        if (x.evidence.masterAsset.lock) {
          _requestBody.push({
            evidenceId: x.id,
            assetId: x.assetId,
            userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
            operation: "UnLock"
          })
        }

      })
    }
    else {
      _requestBody.push({
        evidenceId: row?.id,
        assetId: row.assetId,
        userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
        operation: isLockedAccess ? "Lock" : "UnLock"
      })
    }
    // }
    const _body = JSON.stringify(_requestBody);
    const _url = `${EVIDENCE_PATCH_LOCK_UNLOCK_URL}`;
    fetch(_url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        TenantId: "1",
      },
      body: (_body),
    }).then(function (res) {
      if (res.status === 204) {
        toasterRef.current.showToaster({
          message: isLockedAccess ? "Access Restricted" : "Access Unlocked",
          variant: "success",
          duration: 7000,

        });
        setSuccess(true);
        setTimeout(() => {
          setOpenRestrictAccessDialogue(false);
          setOpenUnlockAccessDialogue(false);
          setSuccess(false);
        }, 3000);
      }
      return res.status;
    })
      .catch((errors) => {
        const err = errors as AxiosError;
        if (err.request.status === 409) {
          setErrorMessage("The_asset_is_already_locked");
        } else {
          setErrorMessage(t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"));
        }
        setError(true);
      });
  }


  const handleDownloadAssetClick = () => {
    const masterAsset = row.evidence.masterAsset;
    const assetFileId = masterAsset.files && masterAsset.files[0].filesId;
    if (!assetFileId) {
      setErrorMessage("There is no File against this Asset. Please contact your Systems Administrator");
      setError(true);
      return;
    }

    const url = `${FILE_SERVICE_URL}/download/${assetFileId}`;
    http.get(url)
      .then((response) => {
        downloadFileByURLResponse(response.data);
      }).catch((error) => {
        const err = error as AxiosError;
        if (err.request.status === 500) {
          setErrorMessage("We 're sorry. Please retry or contact your Systems Administrator");
        }
        setError(true);
      });
  }

  const handleDownloadMetaDataClick = () => {
    /**
     * ! This snippet is only for Asset Lister.
     * ! Since there will be no child asset in lister, so only row data would be extracted.
     * ! For child asset, extract 'selectedItem' prop.
     */
    if (selectedItems.length != 0) {

    }
    const evidenceId = row.evidence.id;
    const assetId = row.assetId;
    const fileType = 2;
    const url = `${EVIDENCE_EXPORT_META_DATA_URL}/${evidenceId}/${assetId}/${fileType}`;
    http.get(url, {
      headers: {
        TenantId: '1',
        'Content-Type': 'application/json',
      },
      responseType: 'blob'
    })
      .then((response) => {
        downloadFileByFileResponse(response);
      }).catch((error) => {
        const err = error as AxiosError;
        if (err.request.status === 500) {
          setErrorMessage("We 're sorry. Please retry or contact your Systems Administrator");
        }
        setError(true);
      });
  }


  const downloadFileByFileResponse = (response: AxiosResponse) => {
    let fileStream = response.data;
    const fileName = `Import_Video_${Date.now()}.pdf`;
    const blob = new Blob([fileStream],
      { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }

  const downloadFileByURLResponse = (url: string) => {
    // Create Link to trigger browser api to download.
    const link = document.createElement('a');
    // Give url to link.
    link.href = url;
    //set download attribute to that link.
    link.setAttribute('download', ``);
    // Append to html link element page.
    document.body.appendChild(link);
    // start download.
    link.click();
    // Clean up and remove the link.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }

  return (
    <>
      <CRXToaster ref={toasterRef} className="assetsBucketToster" />
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
        className={'CRXModal CRXModalAssignUser'}
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
      <CRXModalDialog
        maxWidth='lg'
        title={t("Submit_For_Analysis")}
        className={'CRXModal'}
        modelOpen={openSubmitAnalysis}
        onClose={() => setOpenSubmitAnalysis(false)}
        defaultButton={false}
        indicatesText={true}

      >

        <SubmitAnalysis
          items={selectedItems}
          filterValue={filterValue}
          //setFilterValue={(v: any) => setFilterValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenSubmitAnalysis(false)}
          showToastMsg={(obj: any) => showToastMsg(obj)}
        />
      </CRXModalDialog>


      {success && <CRXAlert message='Success: The assets are locked.' alertType='toast' open={true} />}
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
        key="right"
        align="center"
        viewScroll="auto"
        direction="right"
        position="auto"
        offsetX={25}
        offsetY={12}
        className="menuCss"

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


        {IsOpen ? (
          <MenuItem>
            <Restricted moduleId={30}>
              <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content" onClick={handlePrimaryAsset}>
                  <div className="crx-menu-icon"></div>
                  <div className="crx-menu-list">{t("Set_as_primary_asset")}</div>
                </div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        ) : null
        }

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

        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <SubMenu label={t("Export")}>
                    <MenuItem onClick={handleDownloadAssetClick}>
                      {t("Download_asset(s)")}
                    </MenuItem>
                    <MenuItem onClick={handleDownloadMetaDataClick}>
                      {t("Download_metadata_info")}
                    </MenuItem>
                    <MenuItem>{t("Download_audit_trail")}</MenuItem>
                  </SubMenu>
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <div className="crx-meu-content crx-spac" onClick={handleDownloadMetaDataClick}>
            <div className="crx-menu-icon">
              <i className="far fa-user-lock fa-md"></i>
            </div>
            <div className="crx-menu-list">For Meta Data Purpose</div>
          </div>
        </MenuItem>


        <MenuItem disabled>
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
        </MenuItem>


        <MenuItem>
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
        </MenuItem>

        <MenuItem disabled>
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
        </MenuItem>

        {isLockedAccess ?
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
                <div className="crx-menu-list">{t("Restrict_access")}</div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
          :
          null
        }

        {multiAssetDisabled === false ? (
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



        {multiAssetDisabled === false ? (
          <MenuItem>
            <Restricted moduleId={0}>
              <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content crx-spac" onClick={handleOpenAssignSubmission}>
                  <div className="crx-menu-icon">
                    <i className="far fa-user-lock fa-md"></i>
                  </div>
                  <div className="crx-menu-list">{t("Submit_For_Analysis")}</div>
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
      <UnlockAccessDialogue
        openOrCloseModal={openUnlockAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenUnlockAccessDialogue(e)}
        onConfirmBtnHandler={confirmCallBackForRestrictModal}
      />

    </>
  );
});

export default ActionMenu;
