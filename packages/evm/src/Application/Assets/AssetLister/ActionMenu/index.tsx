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
import { CRXModalDialog, CRXAlert, CRXConfirmDialog, CRXToaster } from '@cb/shared';
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
import { FILE_SERVICE_URL, EVIDENCE_EXPORT_META_DATA_URL } from "../../../../utils/Api/url";
import { AxiosError, AxiosResponse } from "axios";
import SubmitAnalysis from "../SubmitAnalysis/SubmitAnalysis";
import UnlockAccessDialogue from "../UnlockAccessDialogue";
import { AssetRestriction, MetadataFileType, PersmissionModel } from "./AssetListerEnum";
import { useHistory, useParams } from "react-router";import { urlList, urlNames } from "../../../../utils/urlList";import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { AssetLockUnLockErrorType, securityDescriptorType } from "./types";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
  setIsOpen: any
  IsOpen: any
  Asset?: any;
  portal?: boolean
};

export interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  recordingStarted: string;
  categories: string[];
}

const ActionMenu: React.FC<Props> = React.memo(({ selectedItems, row, showToastMsg, setIsOpen, portal, IsOpen, Asset }) => {

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const [multiAssetDisabled, setMultiAssetDisabled] = React.useState<boolean>(false);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(false);
  const [isLockedAccess, setIsLockedAccess] = React.useState<boolean>(false);
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isSelectedItem, setIsSelectedItem] = React.useState<boolean>(false);
  const [isModalOpen,setIsModalOpen] = React.useState<boolean>(false);
  const [assetLockUnLockError, setAssetLockUnLockError] = React.useState<AssetLockUnLockErrorType>({
    isError: false,
    errorMessage: ''
  });

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
     * ! Comment For 'Category'.
     */
    if (row?.evidence?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.evidence?.securityDescriptors));
    if (row?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.securityDescriptors));
    if (row?.categories?.length == 0)
      setIsCategoryEmpty(true);
    if (row?.evidence?.masterAsset?.lock)
      setIsLockedAccess(true);
  }, [row]);

  const handleChange = () => setOpenForm(true);
  const addToAssetBucket = () => {
    //if undefined it means header is clicked
    if (row !== undefined && row !== null) {
      const find = selectedItems.findIndex(
        (selected: any) => selected.id === row.id
      );

      const data = find === -1 ? row : selectedItems;
      // To cater object is not extensible issue,
      let newObject = { ...data };

      if (data.evidence) {
        newObject.isMaster = data.evidence.masterAssetId === data.id;
      }
      else {
        newObject.isMaster = data.masterAssetId === Asset.assetId;
        newObject.selectedAssetId = Asset.assetId;
      }
      dispatch(addAssetToBucketActionCreator(newObject));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
    // showToastMsg({
    //   message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
    //   variant: "success",
    //   duration: 7000,
    // })
  };
  const [openAssignUser, setOpenAssignUser] = React.useState(false);
  const [openManageRetention, setOpenManageRetention] = React.useState(false);
  const [openAssetShare, setOpenAssetShare] = React.useState(false);
  const [openAssignSubmission, setOpenAssignSubmission] = React.useState(false);

  const [openSubmitAnalysis, setOpenSubmitAnalysis] = React.useState(false);
  const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
  const [openUnlockAccessDialogue, setOpenUnlockAccessDialogue] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<any>([]);
  const [IsformUpdated, setIsformUpdated] = React.useState(false);
  const history  = useHistory();
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
  const toasterRef = useRef<typeof CRXToaster>(null);

  const confirmCallBackForRestrictAndUnLockModal = (operation: string) => {
    const _requestBody = [];
    if (isSelectedItem) {
      selectedItems.map((x: any) => {
        if (x.evidence.masterAsset.lock) {
          _requestBody.push({
            evidenceId: x.id,
            assetId: x.assetId,
            userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
            operation: operation
          })
        }
      })
    }
    else {
      _requestBody.push({
        evidenceId: row?.id,
        assetId: row.assetId,
        userRecId: parseInt(localStorage.getItem('User Id') ?? "0"),
        operation: operation
      })
    }
    const _body = JSON.stringify(_requestBody);
    EvidenceAgent.LockOrUnLockAsset(_body).then(() => {
      toasterRef.current.showToaster({
        message: operation === AssetRestriction.Lock ? t('Access_Restricted') : t('Access_Unlocked'),
        variant: "success",
        duration: 7000,
      });
      const successMessage = operation === AssetRestriction.Lock ? t('The_asset_are_locked') : t('The_asset_are_unlocked');
      setSuccessMessage(successMessage);
      setSuccess(true);
      setTimeout(() => {
        dispatch(getAssetSearchInfoAsync(""));
        setOpenRestrictAccessDialogue(false);
        setOpenUnlockAccessDialogue(false);
        setSuccess(false);
      }, 2000);
    })
      .catch((error) => {
        const err = error as AxiosError;
        let errorMessage = '';
        if (err.request.status === 409) {
          errorMessage = operation === AssetRestriction.Lock ? t('The_asset_is_already_locked') : t('The_asset_is_already_unlocked');
        } else {
          errorMessage = operation === AssetRestriction.Lock ? t('We_re_sorry_The_asset_cant_be_locked_Please_retry_or_contact_your_Systems_Administrator') : t('We_re_sorry_The_asset_cant_be_unlocked_Please_retry_or_contact_your_Systems_Administrator');
        }
        setAssetLockUnLockError({
          isError: true,
          errorMessage: errorMessage
        });
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
    const fileType = MetadataFileType.PDF;
    const url = `${EVIDENCE_EXPORT_META_DATA_URL}/${evidenceId}/${assetId}/${fileType}`;
    http.get(url, {
      headers: {
        TenantId: '1',
        'Content-Type': 'application/json',
      },
      responseType: 'blob'
    })
      .then((response) => {
        downloadFileByFileResponse(response, assetId);
      }).catch((error) => {
        const err = error as AxiosError;
        if (err.request.status === 500) {
          setErrorMessage("We 're sorry. Please retry or contact your Systems Administrator");
        }
        setError(true);
      });
  }

  const downloadFileByFileResponse = (response: AxiosResponse, assetId: number) => {
    let fileStream = response.data;
    const fileName = `${assetId}_Metadata.pdf`;
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
  const closeDialog = () => {
    setIsModalOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.assets)[0]
        .url
    );
  };
  const handleCloseRetention = () => {
    if (IsformUpdated)
      setIsModalOpen(true);
    else
      setOpenManageRetention(false);
  }
  return (
    <>
    <CRXConfirmDialog
        setIsOpen={() => setIsModalOpen(false)}
        onConfirm={closeDialog}
        isOpen={isModalOpen}
        className="userGroupNameConfirm"
        primary={t("Yes_close")}
        secondary={t("No,_do_not_close")}
        text="user group form"
      >
        <div className="confirmMessage">
          {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
          <strong>{t("'user form'")}</strong>. {t("If_you_close_the_form")}, 
          {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
          <div className="confirmMessageBottom">
          {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
          </div>
        </div>
      </CRXConfirmDialog>
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
        onClose={() => handleCloseRetention()}
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
          setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
        />
      </CRXModalDialog>
      <CRXModalDialog
        maxWidth='lg'
        title={t("Share_Asset")}
        className={'CRXModal __Crx__Share__asset'}
        modelOpen={openAssetShare}
        onClose={() => setOpenAssetShare(false)}
        defaultButton={false}
        indicatesText={true}
        showSticky={true}

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

      {success && <CRXAlert message={successMessage} alertType='toast' open={true} />}
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
        portal={portal}
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
              <div className="crx-menu-list">{t("Set_as_primary")}</div>
            </div>
            </SecurityDescriptor> 
           </Restricted> 
          </MenuItem>
         ) : null
        } 

        <MenuItem>
          {/* <Restricted moduleId={21}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}> */}
          <div className="crx-meu-content" onClick={handleOpenAssignUserChange}>
            <div className="crx-menu-icon">
              <i className="far fa-user-tag fa-md"></i>
            </div>
            <div className="crx-menu-list">{t("Assign_User")}</div>
          </div>
          {/* </SecurityDescriptor>
          </Restricted> */}
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

        {isCategoryEmpty ? (
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
        ) : (
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
        )}

        {isLockedAccess ?
          <MenuItem>
            <Restricted moduleId={0}>
              <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
                {/* descriptorId={4} */}
                <div className="crx-meu-content crx-spac" onClick={UnlockAccessClickHandler}>
                  <div className="crx-menu-icon">
                    <i className="far fa-user-lock fa-md"></i>
                  </div>
                  <div className="crx-menu-list">UnLock Access</div>
                </div>
              </SecurityDescriptor>
            </Restricted>
          </MenuItem>
          :
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
        }

        {/* Remove this menu against this ticket GEP-2612 */}
        {/* <MenuItem>
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
        </MenuItem> */}

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
            {/* descriptorId={4} */}
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
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

        {/* Remove this menu against this ticket GEP-2612 */}
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



        {multiAssetDisabled === false ? (
          <MenuItem>
            {/* <Restricted moduleId={0}> */}
            {/* <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}> */}
            <div className="crx-meu-content crx-spac" onClick={handleOpenAssetShare}>
              <div className="crx-menu-icon">
                <i className="far fa-user-lock fa-md"></i>
              </div>
              <div className="crx-menu-list">{t("Share_Asset")}</div>
            </div>
            {/* </SecurityDescriptor> */}
            {/* </Restricted> */}
          </MenuItem>
        ) : null
        }

        {multiAssetDisabled === false ? (
          <MenuItem>
            <Restricted moduleId={0}>
              {/* <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}> */}
              <div className="crx-meu-content crx-spac" onClick={handleOpenAssignSubmission}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-lock fa-md"></i>
                </div>
                <div className="crx-menu-list">{t("Submit_For_Analysis")}</div>
              </div>
              {/* </SecurityDescriptor> */}
            </Restricted>
          </MenuItem>
        ) : null
        }
      </Menu>

      <RestrictAccessDialogue
        openOrCloseModal={openRestrictAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenRestrictAccessDialogue(e)}
        onConfirmBtnHandler={() => confirmCallBackForRestrictAndUnLockModal(AssetRestriction.Lock)}
        isError = {assetLockUnLockError.isError}
        errorMessage = {assetLockUnLockError.errorMessage}
      />
      <UnlockAccessDialogue
        openOrCloseModal={openUnlockAccessDialogue}
        setOpenOrCloseModal={(e) => setOpenUnlockAccessDialogue(e)}
        onConfirmBtnHandler={() => confirmCallBackForRestrictAndUnLockModal(AssetRestriction.UnLock)}
        isError = {assetLockUnLockError.isError}
        errorMessage = {assetLockUnLockError.errorMessage}
      />

    </>
  );
});

export default ActionMenu;
