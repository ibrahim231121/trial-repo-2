import React, { useEffect, useRef } from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import {
  CRXModalDialog,
  CRXConfirmDialog,
  CRXTooltip
} from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import CategoryFormContainer from "../Category/CategoryFormContainer";
import {
  addAssetToBucketActionCreator,
  removeAssetFromBucketActionCreator,
  updateAssetLockField,
} from "../../../../Redux/AssetActionReducer";
import AssignUser from "../AssignUser/AssignUser";
import ManageRetention from "../ManageRetention/ManageRetention";
import ShareAsset from "../ShareAsset/ShareAsset";
import { RootState } from "../../../../Redux/rootReducer";
import { useTranslation } from "react-i18next";
import RestrictAccessDialogue from "../RestrictAccessDialogue";
import { AxiosError } from "axios";
import UnlockAccessDialogue from "../UnlockAccessDialogue";
import { useHistory } from "react-router";
import { urlList, urlNames } from "../../../../utils/urlList";
import { EvidenceAgent, FileAgent, CasesAgent } from "../../../../utils/Api/ApiAgent";
import {
  ActionMenuPlacement,
  AssetBucket,
  AssetLink,
  AssetLockUnLockErrorType,
  LockUnlockAsset,
  MasterAssetEvidence,
  ObjectToUpdateAssetBucket,
  Props,
} from "./types";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { SearchType } from "../../utils/constants";
import Cookies from "universal-cookie";
import { IDecoded, getToken } from "../../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import ActionMenuCheckList from "../../../../ApplicationPermission/ActionMenuCheckList";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import {
  Asset,
  AssetAction,
  AssetLog,
  AssetRestriction,
  Evidence,
  EvidenceAssetNotes,
  MultiAssetLog,
} from "../../../../utils/Api/models/EvidenceModels";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { AssetRetentionFormat } from "../../../../GlobalFunctions/AssetRetentionFormat";
import { CheckEvidenceExpire } from "../../../../GlobalFunctions/CheckEvidenceExpire";
import { clearAddGroupedSelectedAssetsActions} from "../../../../Redux/groupedSelectedAssetsActions";
import AssetLinkConfirm from "../AssetLinkConfirm/AssetLinkConfirm";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { REDIRECT_URL_AICOORDINATOR } from "../../../../utils/Api/url";
import SubmitAnalysis from "../SubmitAnalysis/SubmitAnalysis";
import { AssetStatus } from "../../../../GlobalFunctions/globalDataTableFunctions";
import { ActionMenuRestrictActionOccured } from "../../../../Redux/ActionMenuEffectReducer";
import AssignToCase from "../AssignToCase/AssignToCase";
import { setLoaderValue } from "../../../../Redux/loaderSlice";
import { CASE_ASSET_TYPE, TCaseAsset } from "../../../Cases/CaseTypes";
import { formatString, getAssetTypeEnumValue, getCaseIdOpenedForEvidence, getChildAssetsSequenceNumber, getMaxCaseAssetSequenceNumber } from "../../../Cases/utils/globalFunctions";
import { clearAllGroupedSelectedAssets } from "../../../../Redux/groupedSelectedAssets";
import { typeOfAudioAssetToInclude, typeOfDocAssetToInclude, typeOfImageAssetToInclude, typeOfOtherAssetToInclude, typeOfVideoAssetToInclude } from "../../Detail/AssetDetailsTemplate";
import { setSharePopupStatus } from "../../../../Redux/assetBucketBasketSlice";
import MultiExportMetadataAsset from "../MultiExportMetadataAsset";
import { addMultiAssetLog } from "../../../../Redux/AssetLogReducer";
import { findMaximumDescriptorId } from "../../../../GlobalFunctions/SecurityDescriptor";
import { convertTimeToAmPm } from "../../../../utils/convertTimeToAmPm";
import { forEach } from "lodash";
import auditTrailPDFDownload, { convertDateTime, toDataURL } from "../../utils/auditTrailPDF";

type EvidenceAssets = {
  evidenceId: string;
  AssetIds: string[];
  masterAssetId : number;
}

type FilesModel = {
  accessCode : string;
  fileRecId : number;
  evidenceId : number;
  assetId : number;
  masterAssetId : number;
}

const downloadExeFileByFileResponse = (
  response: any,
  assetName: string
) => {
  let fileStream = response.data;
  const fileName = assetName + ".exe";
  const blob = new Blob([fileStream], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  link.click();
  if (link.parentNode) {
	link.parentNode.removeChild(link);
  }
};

export function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}
export const milliSecondsToTimeFormat = (date: Date) => {
  let numberFormatting =
    padTo2Digits(date.getUTCHours()) +
    ":" +
    padTo2Digits(date.getUTCMinutes()) +
    ":" +
    padTo2Digits(date.getUTCSeconds());
  let hourFormatting =
    date.getUTCHours() > 0 ? date.getUTCHours() : undefined;
  let minuteFormatting =
    date.getUTCMinutes() > 0 ? date.getUTCMinutes() : undefined;
  let secondFormatting =
    date.getUTCSeconds() > 0 ? date.getUTCSeconds() : undefined;
  let nameFormatting =
    (hourFormatting ? hourFormatting + " Hours " : "") +
    (minuteFormatting ? minuteFormatting + " Minutes " : "") +
    (secondFormatting ? secondFormatting + " Seconds " : "");
  return numberFormatting + " (" + nameFormatting + ")";
};

export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const retentionSpanText = (holdUntil?: Date, expireOn?: Date) => {
  if (holdUntil) {
    return AssetRetentionFormat(holdUntil);
  } else if (expireOn) {
    return AssetRetentionFormat(expireOn);
  }
};

const ActionMenu: React.FC<Props> = React.memo(
  ({
	row,
	selectedItems = [],
	setSelectedItems,
	isPrimaryOptionOpen = false,
	asset,
	portal,
	showToastMsg,
	setIsPrimaryOptionOpen,
	actionMenuPlacement,
	className,
	actionViewScroll = "close",
	setIsAddedToBucket, 
	isRelatedAsset

  }) => {
	const cookies = new Cookies();
	const history = useHistory();
	const { t } = useTranslation<string>();
	const dispatch = useDispatch();
	let addToAssetBucketDisabled: boolean = false;
	const assetBucketData: AssetBucket[] = useSelector(
	  (state: RootState) => state.assetBucket.assetBucketData
	);
	const groupedSelectedAssets: any = useSelector(
	  (state: RootState) => state.groupedSelectedAssetsReducer.groupedSelectedAssets
	);
	const groupedSelectedAssetsActions: any = useSelector(
	  (state: RootState) => state.groupedSelectedAssetsActionsReducer.groupedSelectedAssetsActions
	);
	const [closeButton , setCloseButton] = React.useState(false);
	const [closeButtonDownloadAsset , setCloseButtonDownloadAsset] = React.useState(false);
	const [multiAssetDisabled, setMultiAssetDisabled] = React.useState<boolean>(false);
	const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(false);
	const [isLockedAccess, setIsLockedAccess] = React.useState<boolean>(false);
	const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
	const [openForm, setOpenForm] = React.useState(false);
	const [isSelectedItem, setIsSelectedItem] = React.useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	
	const [isRmvAssetConfModalOpen, setIsRmvAssetConfModalOpen] = React.useState<boolean>(false);

    const [isAssetLinkConfirm, setIsAssetLinkConfirm] = React.useState<boolean>(false);
    const [evidenceIdsList, setEvidenceIdsList] = React.useState<string[]>([]);
    const [evidenceFileList, setEvidenceFileList] = React.useState<FilesModel[]>([]);
    const [evidenceAssetList, setEvidenceAssetList] = React.useState<EvidenceAssets[]>([]);
    const [openMultiExportMetadataAsset, setMultiExportMetadataAsset] = React.useState(false);
    const [multiExportAsset, setMultiExportAsset] = React.useState(false);
    const [isMetadataOnly, setIsMetadataOnly] = React.useState<boolean>(false);
    const [isRetry, setIsRetry] = React.useState<boolean>(false);
    const [assetlinks, setAssetLinks] = React.useState<AssetLink[]>([]);
    const [assetLockUnLockError, setAssetLockUnLockError] = React.useState<AssetLockUnLockErrorType>
      ({
        isError: false,
        errorMessage: "",
      });
    const { UserId, AssignedModules }: IDecoded = jwt_decode(cookies.get("access_token"));
    const { getGroupIds } = React.useContext(ApplicationPermissionContext);
    const [securityDescriptorsArray, setSecurityDescriptorsArray] = React.useState<Array<SearchModel.SecurityDescriptor>>([]);
    const [openAssignUser, setOpenAssignUser] = React.useState(false);
    const [openManageRetention, setOpenManageRetention] = React.useState(false);
    const [openAssetShare, setOpenAssetShare] = React.useState(false);
    const [openAssetLink, setOpenAssetLink] = React.useState(false);
    const [openAssetMove, setOpenAssetMove] = React.useState(false);
    const [openAssetAction, setOpenAssetAction] = React.useState<AssetAction[]>([]);
    const [openSubmitAnalysis, setOpenSubmitAnalysis] = React.useState(false);
    const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] = React.useState(false);
    const [openUnlockAccessDialogue, setOpenUnlockAccessDialogue] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState<any>([]);
    const [IsformUpdated, setIsformUpdated] = React.useState(false);
    const [selectedMaster, setSelectedMaster] = React.useState<MasterAssetEvidence[]>();
    const [isMultiSelectEvidenceExpired, setIsMultiSelectEvidenceExpired] = React.useState(false);
    const [isAssetLinkedOrMoved, setisAssetLinkedOrMoved] = React.useState<string>("");
    const [isSubmittedForRedaction, setIsSubmittedForRedaction] = React.useState<boolean>(false)
    const [openAssignToCase, setOpenAssignToCase] = React.useState<boolean>(false);
    const caseIdOpenedForEvidenceRef = useRef({id: "0", title: ""});
    const caseOpenedForEvidenceDataRef = useRef(null);
    const typeOfAssetToInclude = [...typeOfVideoAssetToInclude, ...typeOfDocAssetToInclude, ...typeOfImageAssetToInclude, ...typeOfAudioAssetToInclude, ...typeOfOtherAssetToInclude];
    const assetLog : AssetLog = { action : "Export", notes : ""};
    const multiAssetLog : MultiAssetLog = { assetLog : assetLog, evidenceAssetNotes:[]}
    const metadataActionMenu = ["MetadataOnly", "Metadata Only"]
    React.useEffect(() => {
      if (row == undefined && selectedItems != null) {
        let masterIds: MasterAssetEvidence[] = [];
        selectedItems.map((obj: any) => {
          masterIds.push({
            masterId: obj.assetId,
            evidenceId: obj.evidence.id,
            assetName: obj.assetName,
            assetType: obj.assetType,
            fileType: obj.evidence.asset.find((x: any) => x.assetId == obj.assetId).files[0]?.type,
            expireOn: obj.expireOn,
            holduntil: obj.holduntil,

		  });
		});
		setSelectedMaster(masterIds);

	  }

	  if(row){
		let asset: Asset = row.evidence.asset.filter((asset: any) => asset.assetId == row.assetId)[0]
		if(asset && asset.redactionStatus !== null && asset.redactionStatus === 1){
		  setIsSubmittedForRedaction(true)
		}
		else{
		  setIsSubmittedForRedaction(false)
		}
	  }
	  calculateSecurityDescriptor();
	  checkIsMultiAssetDisabled();
	  checkIsSelectedItem();
	  /**
	  ** Check for Lock property in Evidence response,
	  ** look for every asset in evidence row, to show message in Action Menu Item.
	  */
	  checkIsAssetLock();
	  /**
	   ** Category Window Depends on Evidence Response Provided from Parent Element,
	   ** as response is different for every screen,
	   ** we need to check from which screen action menu is opened.
	   */
	  ((row) || (selectedItems.length > 0)) && checkIsAssetCategorize();
	  checkIsAssetLinkedOrMove();
	  checkIsAssetStatus();
	}, [row, selectedItems]);

	React.useEffect(() => {
	  if (openAssetAction.length > 0) {
		dispatch(clearAllGroupedSelectedAssets());

		dispatch(clearAddGroupedSelectedAssetsActions(openAssetAction));

		showToastMsg?.({
		  message: t("Asset " + openAssetAction[0].actionType + " ready"),
		  variant: "success",
		  duration: 5000,
		});
	  }

	}, [openAssetAction]);

	React.useEffect(() => {
	  setCloseButton(false)
	}, []);

	React.useEffect(() => {
	  if (closeButton) {
		setMultiExportMetadataAsset(false);
		setCloseButton(false);
	  }
	}, [closeButton]);

	React.useEffect(() => {
	  if (closeButtonDownloadAsset) {
		setMultiExportAsset(false);
		setCloseButtonDownloadAsset(false);
	  }
	}, [closeButtonDownloadAsset]);

	React.useEffect(() => {
	  let assetsList: AssetLink[] = [];
	  groupedSelectedAssets.map((obj: any) => {
		if (obj.isChecked == true) {
		  assetsList.push({
			masterId: obj.masterId,
			assetId: obj.assetId,
			evidenceId: obj.evidenceId,
			assetName: obj.assetName,
			assetType: obj.assetType,
			fileType: obj.fileType,
			expireOn: obj.expireOn,
			holduntil: obj.holduntil,
		  });
		}
	  });
	  selectedMaster?.map((obj: MasterAssetEvidence) => {
		assetsList.push({
		  masterId: obj.masterId,
		  assetId: obj.masterId,
		  evidenceId: obj.evidenceId,
		  assetName: obj.assetName,
		  assetType: obj.assetType,
		  fileType: obj.fileType,
		  expireOn: obj.expireOn,
		  holduntil: obj.holduntil
		});
	  });
	  setAssetLinks(assetsList);
	  
	}, [groupedSelectedAssets]);

	const checkIsAssetLock = () => {
	  const assetId = row?.assetId;
	  if (assetId) {
		for (const asset of row?.evidence?.asset) {
		  if (asset.assetId == assetId) {
			if (asset.lock) {
			  setIsLockedAccess(true);
			}
			else {
			  setIsLockedAccess(false);
			}
		  }
		}
	  }
	  else {
		let unlockAssetCount = 0;
		for (const items of selectedItems) {
		  const asset = items.evidence.asset.find((x : any) => x.assetId == items.assetId);
		  if (!asset.lock) {
			unlockAssetCount += 1;
		  }
		}
		if (unlockAssetCount > 0) {
		  setIsLockedAccess(false);
		}
		else {
		  setIsLockedAccess(true);
		}
	  }
	}

	const checkIsAssetStatus = () => {
	  const assetId = row?.assetId;
	  if(assetId){
	   let assets =  row?.evidence?.asset.filter((x: any) => x.assetId == assetId);
	  for(const asset of assets){
		if(asset.status ==  AssetStatus.MetadataOnly){
		  setIsRetry(false);
		  setIsMetadataOnly(true);
		}
		else if(asset.status == AssetStatus.RequestUpload){
		  
		setIsMetadataOnly(false);
		setIsRetry(true)
		}

		else{
		  setIsMetadataOnly(false);
		}
	  } 
	}
	}

	const checkIsAssetCategorize = () => {
	  //NOTE: Single Select Case.
	  if (row && selectedItems.length <= 1) {
		if (row.evidence.categories.length === 0) {
		  setIsCategoryEmpty(true);
		  return;
		}
		setIsCategoryEmpty(false);
	  }
	  //NOTE: Multi Select Case. 
	  else {
		const isEditCase = selectedItems.some((item: any) => item.evidence.categories.length > 0);
		if (isEditCase) {
		  setIsCategoryEmpty(false);
		  return;
		}
		setIsCategoryEmpty(true);
	  }
	}

	const checkIsAssetLinkedOrMove = () => {
	  if (row?.onlyforlinkedasset == "link") {
		setisAssetLinkedOrMoved("");
	  }
	  else if (row?.onlyforlinkedasset == "move")
	  {
		setisAssetLinkedOrMoved("");
	  }
	  else {
		setisAssetLinkedOrMoved(groupedSelectedAssetsActions[0]?.actionType?.toString());
	  }
	}

	const checkIsMultiAssetDisabled = () => {
	  if (selectedItems.length > 1) {
		setMultiAssetDisabled(true);
	  } else {
		setMultiAssetDisabled(false);
	  }
	}

	const checkIsSelectedItem = () => {
	  if (selectedItems.length > 0) {
		setIsSelectedItem(true);
	  } else {
		setIsSelectedItem(false);
	  }
	}

	const handleOpenAssignUserChange = () => setOpenAssignUser(true);
	const handleOpenManageRetention = () => setOpenManageRetention(true);
	const handleOpenAssetShare = () => setOpenAssetShare(true);
	const handleAssetLinkOpen = () => setOpenAssetLink(true);
	const handleAssetMoveOpen = () => setOpenAssetMove(true);
	const handleOpenAssignSubmission = () => setOpenSubmitAnalysis(true);
	const handlePrimaryAsset = () => setIsPrimaryOptionOpen?.(true);
	const handleChange = () => setOpenForm(true);
	const restrictAccessClickHandler = () => setOpenRestrictAccessDialogue(true);
	const unlockAccessClickHandler = () => setOpenUnlockAccessDialogue(true);
	
	const handleOpenAssignToCaseChange = () => {
	  const caseId = checkCaseOpenedForEvidence();
	  if(caseId > 0) {
		dispatch(setLoaderValue({isLoading: true}));
		CasesAgent.getCase(`/Case/${caseId}`)
		.then(res => {
		  if(res != null) {
			let existingAssetsCount = 0;
			let sequenceNumber = 0;
			const selectedAssetsCopy = Array.isArray(selectedItems) ? [...selectedItems] : [];
			if(selectedAssetsCopy.find((x: any) => x.id === row.id) === undefined) {
			  selectedAssetsCopy.push(row);
			}
			if(res != null && Array.isArray(res.caseAssets)) {
			  sequenceNumber = getMaxCaseAssetSequenceNumber(res.caseAssets);
			  for(let assetItem of selectedAssetsCopy) {
				if(res.caseAssets.find((x: any) => x.assetId === assetItem.assetId) != null) {
				  existingAssetsCount++;
				}
			  }
			}
			if(existingAssetsCount > 0) {
			  caseOpenedForEvidenceDataRef.current = res;
			  dispatch(setLoaderValue({isLoading: false}));
			  setOpenAssignToCase(true);
			}
			else {
			  const caseAssetList: TCaseAsset[] = []
			  selectedAssetsCopy.forEach((item) => {
				if(!CheckEvidenceExpire(item.evidence)) {
				  sequenceNumber++;
				  let masterAsset: SearchModel.Asset | null = null;
				  const childAssets: SearchModel.Asset[] = [];
  
				  if(item.evidence && Array.isArray(item.evidence.asset)) {
					  const assets = item.evidence.asset;
					  for(let i = 0; i < assets.length; i++) {
						if(assets[i].assetId === item.assetId) {
							masterAsset = assets[i];
						}
						else {
							childAssets.push(assets[i]);
						}
					  }
				  }
  
				  if(masterAsset != null) {
					addAssetToCaseAssetList(item.id, caseId, masterAsset, sequenceNumber.toString(), caseAssetList);
				  }
				  if(Array.isArray(childAssets) && childAssets.length > 0) {
					childAssets.forEach((obj, idx) => {
					  const formattedSequence = getChildAssetsSequenceNumber((idx + 1).toString(), 3);
					  addAssetToCaseAssetList(item.id, caseId, obj, sequenceNumber + '_' + formattedSequence, caseAssetList);
					});
				  }
				}
			  })
			  CasesAgent.tagAssetsToCase(caseAssetList)
			  .then(res => {
				dispatch(setLoaderValue({isLoading: false}));
				dispatchEvidenceToSearch();
				typeof showToastMsg === "function" && showToastMsg({
				  message: formatString(t("The_selected_assets_have_been_added_to_Case_{0}"), caseIdOpenedForEvidenceRef.current.title),
				  variant: "success",
				  duration: 5000,
				});
			  })
			  .catch(ex => {
				console.log(ex);
				dispatch(setLoaderValue({isLoading: false}));
			  });
			}
		  }
		})
		.catch((ex: any) => {
		  caseOpenedForEvidenceDataRef.current = null;
		  dispatch(setLoaderValue({isLoading: false}));
		});
	  }
	  else {
		caseOpenedForEvidenceDataRef.current = null;
		setOpenAssignToCase(true);
	  }
	}

	const addAssetToCaseAssetList = (evidenceId: number, caseId: number, asset: SearchModel.Asset, sequenceNumber: string, caseAssetList: TCaseAsset[]) => {
	  caseAssetList.push({
		id: '0',
		caseId: caseId,
		assetId: asset.assetId,
		evidenceId: evidenceId,
		notes: '',
		sequenceNumber: sequenceNumber.toString(),
		assetName: asset.assetName,
		assetType: getAssetTypeEnumValue(asset.assetType) ?? CASE_ASSET_TYPE.Others,
		fileId: asset?.files[0]?.filesId,
		fileName: asset?.files[0]?.fileName ?? "",
		fileType: asset?.files[0]?.type,
	  });
  }
	  
	const handleAssignToCaseClose = (refreshGrid?: boolean) => {
	  setOpenAssignToCase(false);
	  if(refreshGrid === true && actionMenuPlacement === ActionMenuPlacement.AssetLister)
		dispatchEvidenceToSearch();
	}

	const checkCaseOpenedForEvidence = () => {
	  const caseOpenedForEvidence = getCaseIdOpenedForEvidence();
	  if((caseOpenedForEvidence != null && parseInt(caseOpenedForEvidence.id) > 0)) {
		caseIdOpenedForEvidenceRef.current = caseOpenedForEvidence;
		return parseInt(caseOpenedForEvidence.id);
	  }
	  return 0;
	}

	const multiCompareAssetBucketData = (
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

	const confirmCallBackForRestrictAndUnLockModal = (operation: string) => {
	  let _requestBody: Array<LockUnlockAsset> = [];
	  const groupRecIdArray = getGroupIds();
	  if (isSelectedItem) {
		selectedItems.map((x: any) => {
		  _requestBody.push({
			evidenceId: x.evidence.id,
			assetId: x.assetId,
			groupRecIdList: groupRecIdArray,
			operation: operation
		  } as LockUnlockAsset);
		});
	  } else {
		_requestBody.push({
		  evidenceId: row?.evidence.id,
		  assetId: row.assetId,
		  groupRecIdList: groupRecIdArray,
		  operation: operation
		} as LockUnlockAsset);
	  }
	  isSelectedItem && setSelectedItems?.([]); 
	  EvidenceAgent.LockOrUnLockAsset(JSON.stringify(_requestBody))
		.then(() => {
		  showToastMsg?.({
			message:
			  operation === AssetRestriction.Lock
				? t("Access_Restricted")
				: t("Access_Unlocked"),
			variant: "success",
			duration: 7000,
		  });

		  setTimeout(() => {
			dispatch(
			  getAssetSearchInfoAsync({
				QUERRY: "",
				searchType: SearchType.SimpleSearch,
			  })
			);
			setOpenRestrictAccessDialogue(false);
			setOpenUnlockAccessDialogue(false);
		  }, 2000);

		  dispatch(updateAssetLockField({
			requestBody: _requestBody,
			assetBucketData: assetBucketData
		  } as ObjectToUpdateAssetBucket));

		  if (actionMenuPlacement === ActionMenuPlacement.AssetDetail) {
			const isAllowedToAccessLockAsset = AssignedModules.split(',').includes('29');
			if (isAllowedToAccessLockAsset)
			  dispatch(ActionMenuRestrictActionOccured());
			else
			  window.location.href = urlList.filter((item: any) => item.name === urlNames.assets)[0].url;
		  }
		  if (actionMenuPlacement === ActionMenuPlacement.AssetBucket || actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			dispatch(ActionMenuRestrictActionOccured());
		  }
		})
		.catch((error) => {
		  const err = error as AxiosError;
		  let errorMessage = "";
		  if (err.request.status === 409) {
			errorMessage =
			  operation === AssetRestriction.Lock
				? t("The_asset_is_already_locked")
				: t("The_asset_is_already_unlocked");
		  } else {
			errorMessage =
			  operation === AssetRestriction.Lock
				? t(
				  "We_re_sorry_The_asset_cant_be_locked_Please_retry_or_contact_your_Systems_Administrator"
				)
				: t(
				  "We_re_sorry_The_asset_cant_be_unlocked_Please_retry_or_contact_your_Systems_Administrator"
				);
		  }
		  setAssetLockUnLockError({
			isError: true,
			errorMessage: errorMessage,
		  });
		});
	};

	const handleDownloadAssetClick = () => {
	  window.onbeforeunload = null;
	  let filesList: FilesModel[] = [];
	  var evidenceIds: string[] = [];
	  var rowEvidenceId: string = "";
	  var rowAssetId: any = "";
	  var isSingleRow: boolean = true;
	  var assetIds: string[] = [];
	  var assetId: number = 0;
	  var evidenceId: number = 0;
	  var masterAssetId : number = 0;
	  if (selectedItems.length != 0) {
		if (row != null) {
		  evidenceIds = selectedItems?.map((x: any) => { return x?.evidence?.id })
		  assetIds = selectedItems?.map((x: any) => { return x.assetId })
		  rowEvidenceId = row?.evidence?.id;
		  rowAssetId = +row?.assetId;
		  evidenceIds = Array.from(new Set(evidenceIds));
		  assetIds = Array.from(new Set(assetIds))
		  if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			isSingleRow = !evidenceIds.includes(rowEvidenceId) && !assetIds.includes(rowAssetId);
			if (!isSingleRow) {
			  selectedItems.map((selecttedRow: any) => {
				selecttedRow?.evidence?.asset?.map((asset: any) => {
				  asset?.files?.map((file: any) => {
					AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, selecttedRow?.evidence?.id, selecttedRow?.evidence?.masterAssetId, file?.type);
				  })
				})
			  });
			}
		  }
		  else if (actionMenuPlacement === ActionMenuPlacement.DetailedAssets || actionMenuPlacement === ActionMenuPlacement.AssetBucket) {
			isSingleRow =  !assetIds.includes(rowAssetId);
			if (!isSingleRow) {
			  selectedItems?.map((selectedRow: any) => {
				selectedRow?.evidence?.asset?.map((asset: any) => {
				  if (selectedRow?.assetId.toString() == asset?.assetId.toString()) {
					asset?.files?.map((file: any) => {
					  AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, selectedRow?.evidence?.id, selectedRow?.evidence?.masterAssetId, file?.type);
					})
				  }
				})
			  })
			}
		  }

		  if (isSingleRow) {
			evidenceIds = row?.evidence?.id.toString().split(',');
			if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			  row?.evidence?.asset?.map((asset: any) => {
				asset?.files?.map((file: any) => {
				  AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, row?.evidence?.id, row?.evidence?.masterAssetId, file?.type);
				})
			  })
			}
			else {
			  row?.evidence?.asset?.map((asset: any) => {
				if (rowAssetId.toString() === asset?.assetId.toString()) {
				  asset?.files?.map((file: any) => {
					AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, row?.evidence?.id, row?.evidence?.masterAssetId, file?.type);
				  })
				}
			  })
			}
		  }
		}
		else {
		  if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			selectedItems.map((selecttedRow: any) => {
			  selecttedRow?.evidence?.asset?.map((asset: any) => {
				asset?.files?.map((file: any) => {
				  AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, selecttedRow?.evidence?.id, selecttedRow?.evidence?.masterAssetId, file?.type);
				})
			  })
			});
		  }
		  else if (actionMenuPlacement === ActionMenuPlacement.AssetBucket) {
			selectedItems?.map((selectedRow: any) => {
			  selectedRow?.evidence?.asset?.map((asset: any) => {
				if (selectedRow?.assetId.toString() == asset?.assetId.toString()) {
				  asset?.files?.map((file: any) => {
					AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, selectedRow?.evidence?.id, selectedRow?.evidence?.masterAssetId, file?.type);
				  })
				}
			  })
			})
		  }
		}
	  }
	  else {
		let evidence = row?.evidence;
		evidenceIds = evidence?.id.toString().split(',');
		rowEvidenceId = evidence?.id.toString();
		rowAssetId = row?.assetId;
		assetIds.push(rowAssetId);
		if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
		  evidence?.asset.map((asset: any) => {
			asset?.files?.map((file: any) => {
			  AddFileList(filesList, file.accessCode, file.filesId, asset?.assetId, evidence?.id, evidence?.masterAssetId, file?.type);
			})
		  })
		}
		else {
		  evidence?.asset.map((asset: any) => {
			if (rowAssetId?.toString() === asset?.assetId?.toString()) {
			  asset?.files?.map((file: any) => {
				AddFileList(filesList,file.accessCode, file.filesId, asset?.assetId, evidence?.id, evidence?.masterAssetId, file?.type);
			  })
			}
		  })
		}
	  }
	  if (IsGroupedAset(filesList) && actionMenuPlacement === ActionMenuPlacement.AssetLister) {
		setMultiExportAsset(true);
		setEvidenceFileList(filesList);
	  }
	  else {
		if (filesList.length > 0) {
		  if (filesList.length === 1) {
			let url: any = `/Files/download/${filesList[0].fileRecId}/${filesList[0].accessCode}`
			FileAgent.getDownloadFileUrl(url)
			  .then((response) => {
				downloadFileByURLResponse(response);
			  })
			  .catch(() => {
				showToastMsg?.({
				  message: t("Unable_to_download_file"),
				  variant: "error",
				  duration: 5000,
				});
			  });
		  } else {
			var filesDownload: { accessCode: string; fileRecId: number; }[] = [];
			var fileExportLog: FilesModel[] = [];
			filesList?.map((x: any) => {
			  filesDownload.push({
				accessCode: x?.accessCode,
				fileRecId: x?.fileRecId
			  })
			  fileExportLog.push({
				assetId: x.assetId,
				evidenceId: x.evidenceId,
				masterAssetId: x.masterAssetId,
				accessCode: x?.accessCode,
				fileRecId: x?.fileRecId
			  })
			});
		   
			let me = { fileRequest: filesDownload, operationType: 1 }
			createMultiExportRequest(me);
			showToastMsg?.({
			  message: t("files will be downloaded shortly"),
			  variant: "success",
			  duration: 5000,
			});
		  }
		}
	  }
	};

	function AddFileList(filesList: FilesModel[], accessCode: string, fileRecId: number, assetId: number, evidenceId: number, masterAssetId: number, fileType: string) {
	  const fileTypeGPS = "GPS";
	  if (fileType != fileTypeGPS) {
		filesList.push({
		  accessCode: accessCode,
		  fileRecId: fileRecId,
		  assetId: assetId,
		  evidenceId: evidenceId,
		  masterAssetId: masterAssetId
		})
	  }
	}

	const IsGroupedAset = (filesList: FilesModel[]) => {
	  let condition: boolean = false;
	  var files = filesList.filter((x: any) => x.masterAssetId != 0);
	  var assetIds = filesList.map((x: any) => { return x.assetId });
	  assetIds = Array.from(new Set(assetIds))
	  if (files.length > 0 && assetIds.length > 1) {
		var evidenceIds = files.map((x: any) => { return x?.evidenceId });
		evidenceIds = Array.from(new Set(evidenceIds));
		evidenceIds?.map((evidenceId: number) => {
		  if (files.filter((file: any) => file.evidenceId == evidenceId)?.length > 1) {
			condition = true;
		  }
		})
	  }
	  return condition;
	}

	const DownloadAsset = (isMasterAsset: boolean = false) => {
	  
	  window.onbeforeunload = null;
	  var fileList = returnFileList(evidenceFileList, isMasterAsset);
	  if (fileList.length > 0) {
		if (fileList.length === 1) {
		  let url: any = `/Files/download/${fileList[0].fileRecId}/${fileList[0].accessCode}`
		  FileAgent.getDownloadFileUrl(url)
			.then((response) => {
			  downloadFileByURLResponse(response);
			})
			.catch(() => {
			  showToastMsg?.({
				message: t("Unable_to_download_file"),
				variant: "error",
				duration: 5000,
			  });
			});
		} else {
		  let me = { fileRequest: fileList, operationType: 1 }
		  createMultiExportRequest(me);
		  showToastMsg?.({
			message: t("files will be downloaded shortly"),
			variant: "success",
			duration: 5000,
		  });
		}
		var tempList:EvidenceAssetNotes[] = [];
		fileList.forEach(e => {
		  
		  tempList.push({
			assetId : e.assetId,
			evidenceId : e.evidenceId,
			notes : ""
		  })
		});
		  var tmp = getFileExport(tempList, "File Exported");
		  multiAssetLog.evidenceAssetNotes = tmp;
		  dispatch(addMultiAssetLog(multiAssetLog));
		  
		
	  }
	  setEvidenceFileList([]);
	}

	const returnFileList = (filesList: FilesModel[], isMasterAsset: boolean = false) => {
	  var evidenceIds = filesList.map((x: any) => { return x?.evidenceId })
	  evidenceIds = Array.from(new Set(evidenceIds));
	  var fileList: { accessCode: string; fileRecId: number; assetId: number; evidenceId: number}[] = [];
	  evidenceIds.map((evidenceId: number) => {
		var files = filesList.filter((file: any) => file.evidenceId == evidenceId);
		files?.map((file: any) => {
		  if (isMasterAsset) {
			if (file.masterAssetId == file.assetId) {
			  fileList.push(
				{
				  accessCode: file?.accessCode,
				  fileRecId: file?.fileRecId,
				  assetId: file?.assetId,
				  evidenceId: file?.evidenceId
				}
			  )
			}
		  }
		  else {
			fileList.push(
			  {
				accessCode: file?.accessCode,
				fileRecId: file?.fileRecId,
				assetId: file?.assetId,
				evidenceId: file?.evidenceId
			  }
			)
		  }
		})
	  })
	  return fileList;
	}

	const createMultiExportRequest = (
	  multiFilesRequest: any) => {
	  FileAgent.getMultiDownloadFileUrl(multiFilesRequest)
		.then((response) => {
		  downloadExeFileByFileResponse(response, "getacvideo-multidownloader");
		})
		.catch(() => {
		  showToastMsg?.({
			message: t("Unable_to_download_file"),
			variant: "error",
			duration: 5000,
		  });
		});
	};

	const handleDownloadMetaDataClick = () => {
	  /**
	   * ! This snippet is only for Asset Lister.
	   * ! Since there will be no child asset in lister, so only row data would be extracted.
	   * ! For child asset, extract 'selectedItem' prop.
	   */
	  var evidenceIds: string[] = [];
	  var rowEvidenceId: string = "";
	  var rowAssetId: any = "";
	  var isSingleRow: boolean = true;
	  var assetIds: string[] = [];
	  let evidenceAssets: EvidenceAssets[] = [];
	  var masterAssetId: number | any = 0;
	  if (selectedItems.length != 0) {
		if (row != null) {
		  evidenceIds = selectedItems?.map((x: any) => { return x?.evidence?.id })
		  assetIds = selectedItems?.map((x: any) => { return x.assetId })
		  rowEvidenceId = row?.evidence?.id;
		  rowAssetId = +row?.assetId;
		  evidenceIds = Array.from(new Set(evidenceIds));
		  assetIds = Array.from(new Set(assetIds))
		  if (actionMenuPlacement === ActionMenuPlacement.AssetLister ) {
			isSingleRow = !evidenceIds.includes(rowEvidenceId) && !assetIds.includes(rowAssetId);
			if (!isSingleRow) {
			  selectedItems.map((row: any) => {
				masterAssetId = row?.evidence?.masterAssetId;
				assetIds = row?.evidence?.asset?.map((x: any) => { return x?.assetId });
				assetIds = Array.from(new Set(assetIds))
				evidenceAssets.push(
				  {
					evidenceId: row?.evidence?.id,
					AssetIds: assetIds,
					masterAssetId: row?.evidence?.masterAsset?.assetId
				  }
				)
			  });
			}
		  }
		  // else if (actionMenuPlacement === ActionMenuPlacement.DetailedAssets) {
		  //   isSingleRow = !assetIds.includes(rowAssetId);
		  //   if (!isSingleRow) {
		  //     selectedItems.map((row: any) => {
		  //       masterAssetId = row?.evidence?.masterAssetId;
		  //       assetIds = row?.evidence?.asset?.map((x: any) => { return x?.assetId });
		  //       assetIds = Array.from(new Set(assetIds))
		  //       evidenceAssets.push(
		  //         {
		  //           evidenceId: row?.evidence?.id,
		  //           AssetIds: assetIds,
		  //           masterAssetId: row?.evidence?.masterAsset?.assetId
		  //         }
		  //       )
		  //     });
		  //   }
		  // }
		  else if (actionMenuPlacement === ActionMenuPlacement.AssetBucket || actionMenuPlacement === ActionMenuPlacement.DetailedAssets) {
			isSingleRow =  !assetIds.includes(rowAssetId);
			if (!isSingleRow) {
			  selectedItems.map((row: any) => {
				let evidenceAsset = evidenceAssets?.find((x: EvidenceAssets) => x.evidenceId == row?.evidence?.id);
				if (evidenceAsset) {
				  evidenceAsset.AssetIds.push(row?.assetId.toString())
				}
				else {
				  evidenceAssets.push(
					{
					  evidenceId: row?.evidence?.id,
					  AssetIds: assetIds.toString().split(','),
					  masterAssetId: row.evidence.masterAssetId,
					}
				  )
				}
			  });
			}
		  }

		  if (isSingleRow) {
			masterAssetId = 0;
			evidenceIds = row?.evidence?.id.toString().split(',');
			if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			  masterAssetId = row?.evidence?.masterAssetId;
			  assetIds = [];
			  row?.evidence?.asset?.map((asset: any) => {
				assetIds.push(asset?.assetId);
			  })
			}
			else {
			  assetIds = row?.assetId.toString().split(',')
			}
			assetIds = Array.from(new Set(assetIds))
			evidenceAssets = [{
			  evidenceId: rowEvidenceId,
			  AssetIds: assetIds,
			  masterAssetId: masterAssetId,
			}]
		  }
		}
		else {
		  if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
			selectedItems?.map((x: any) => {
			  masterAssetId = x?.evidence?.masterAssetId
			  x?.evidence?.asset?.map((asset: any) => {
				assetIds.push(asset?.assetId);
			  })
			  assetIds = Array.from(new Set(assetIds))
			  evidenceAssets.push(
				{
				  evidenceId: x?.evidence?.id,
				  AssetIds: assetIds,
				  masterAssetId: masterAssetId,
				}
			  )
			  assetIds = [];
			})
			evidenceIds = evidenceAssets?.map((x: any) => { return x?.evidenceId })
		  }
		  else if (actionMenuPlacement === ActionMenuPlacement.AssetBucket) {
			selectedItems.map((rowEvidence: any) => {
			  let evidenceAsset = evidenceAssets?.find((x: EvidenceAssets) => x.evidenceId == rowEvidence?.evidence?.id);
			  if (evidenceAsset) {
				evidenceAsset.AssetIds.push(rowEvidence?.assetId.toString())
			  }
			  else {
				evidenceAssets.push(
				  {
					evidenceId: rowEvidence?.evidence?.id,
					AssetIds: rowEvidence?.assetId.toString().split(','),
					masterAssetId: masterAssetId,
				  }
				)
			  }
			});
			evidenceIds = evidenceAssets?.map((x: any) => { return x?.evidenceId })
		  }
		}
	  }
	  else {
		let evidence = row?.evidence;
		evidenceIds = evidence?.id.toString().split(',');
		rowEvidenceId = evidence?.id.toString();
		rowAssetId = row?.assetId;
		assetIds.push(rowAssetId);
		if (actionMenuPlacement !== ActionMenuPlacement.AssetDetail) {
		  if (actionMenuPlacement === ActionMenuPlacement.DetailedAssets) {
			//evidence?.asset.map((x: any) => {
			  assetIds.push(rowAssetId);
			//})
		  }
		  else
		  {
			evidence?.asset.map((x: any) => {
			  assetIds.push(x?.assetId);
			})
		  }
		}
		else {
		  if (rowAssetId.toString() === row?.evidence?.masterAssetId.toString()) {
			assetIds = [];
			masterAssetId = row?.evidence?.masterAssetId;
			evidence?.asset.map((x: any) => {
			  assetIds.push(x?.assetId);
			})
		  }
		}
		if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
		  masterAssetId = row?.evidence?.masterAssetId;
		}
		assetIds = Array.from(new Set(assetIds))
		evidenceAssets.push(
		  {
			evidenceId: rowEvidenceId,
			AssetIds: assetIds,
			masterAssetId: masterAssetId,
		  }
		)
	  }

	  if (actionMenuPlacement !== ActionMenuPlacement.DetailedAssets && evidenceAssets?.find((x: any) => x.masterAssetId != 0 && x.AssetIds.length > 1)) {
		setMultiExportMetadataAsset(true);
		setEvidenceAssetList(evidenceAssets);
		setEvidenceIdsList(evidenceIds);
	  }
	  else {
		let headers = [
		  {
			key: 'EvidenceIds',
			value: evidenceIds.join()
		  }
		];
		EvidenceAgent.getEvidences(headers).then((response: Evidence[]) => {
		  downloadMetaDataPDF(response, evidenceAssets);
		  successFullyDownloadToastMessage();
		  return response
		}).catch(() => {
		  showToastMsg?.({
			message: t("Unable_to_download_response"),
			variant: "error",
			duration: 5000,
		  });
		})
	  }
	};

	const successFullyDownloadToastMessage = () => {
	  showToastMsg?.({
		message: t("file downloaded successfully"),
		variant: "success",
		duration: 5000,
	  });
	}

	const getMetadataExport = (evidences : Evidence[], noteStr: string, isGroupedAsset: boolean) => {
	  var temp: EvidenceAssetNotes[] = [];
	  evidences.forEach(e => {
		temp.push({
		  evidenceId: e.id,
		  assetId: e.assets.master.id,
		  notes: "Asset " + noteStr
		})
		if(isGroupedAsset == false)
		{
		e.assets.children.forEach(a => {
		  temp.push({
			evidenceId: e.id,
			assetId: a.id,
			notes: "Asset " + noteStr
		  })
		});
		}
	  });
	  return temp;
	}
	const getFileExport = (filemodel : EvidenceAssetNotes[], noteStr: string) => {
	  var temp: EvidenceAssetNotes[] = [];
	  filemodel.forEach(e => {
		temp.push({
		  evidenceId: e.evidenceId,
		  assetId: e.assetId,
		  notes: "Asset " + noteStr
		})
	  });
	  return temp;
	}
	function DownloadMetadata(isGroupedAsset = false) {
	  
	  let headers = [
		{
		  key: 'EvidenceIds',
		  value: evidenceIdsList.join()
		}
	  ];
	  EvidenceAgent.getEvidences(headers).then((response: Evidence[]) => {
		downloadMetaDataPDF(response, evidenceAssetList, isGroupedAsset);
		  var tmp = getMetadataExport(response , "Metadata Exported",isGroupedAsset);
		  multiAssetLog.evidenceAssetNotes = tmp;
		  dispatch(addMultiAssetLog(multiAssetLog));
		  successFullyDownloadToastMessage();
		return response
	  }).catch(() => {
		showToastMsg?.({
		  message: t("Unable_to_download_response"),
		  variant: "error",
		  duration: 5000,
		});
	  })
	}

	function downloadMetaDataPDF(evidences: Evidence[], evidenceAssetsList: EvidenceAssets[], isGroupedAsset: boolean = false) {
	  evidences?.forEach((x: Evidence) => {
		var evidenceAssetObj = evidenceAssetsList?.find((eAsset: EvidenceAssets) => eAsset?.evidenceId == x?.id?.toString());
		if (!isGroupedAsset) {
		  x?.assets?.children?.forEach((asset: any) => {
			if (evidenceAssetObj) {
			  evidenceAssetObj?.AssetIds?.forEach((assetId: any) => {
				if (asset?.id?.toString() == assetId?.toString()) {
				  printPDF(x, asset);
				}
			  });
			}
		  });
		}
		let masterAsset = x?.assets?.master;
		if (masterAsset && evidenceAssetObj?.AssetIds?.find((mAsset: string) => mAsset?.toString() == masterAsset?.id?.toString())) {
		  printPDF(x, masterAsset);
		}
	  });
	  setEvidenceAssetList([]);
	  setEvidenceIdsList([]);
	}

	function printPDF(evidence: Evidence, asset: any) {
	  const head = [["", "", t("Asset_Bookmark"), ""]];
	  let assetName = asset?.name;
	  let data: any[] = [];
	  let arrS: any[] = [];
	  asset?.bookMarks?.forEach((x: any) => {
		arrS.push(x?.id);
		arrS.push(new Date(x?.bookmarkTime).toLocaleString());
		arrS.push(x?.description);
		arrS.push(x?.madeBy);
		data.push(arrS);
		arrS = [];
	  });
	  let userName = "";

	  asset?.owners?.map((owner: any) => {
		owner?.record?.map((record: any) => {
		  if (record?.key == "UserName") {
			userName += record?.value + ",";
		  }
		})
	  });

	  userName = userName.length > 0 ? userName.slice(0, -1) : userName;
	  const doc = new jsPDF();
	  doc.setFontSize(11);
	  doc.setTextColor(100);
	  let yaxis1 = 14;
	  let yaxis2 = 70;
	  let xaxis = 25;

	  doc.text(t("Asset_name") + ":", yaxis1, xaxis);
	  doc.text(assetName, yaxis2, xaxis);
	  xaxis += 5;

	  doc.text(t("Asset_status") + ":", yaxis1, xaxis);
	  doc.text(asset?.status, yaxis2, xaxis);
	  xaxis += 5;

	  let categoriesName = "";
	  let tempXAxis = 0;
	  evidence?.categories?.map((x: any) => {
		categoriesName += x?.name + "\n";
		tempXAxis += 4;
	  });
	  doc.text(t("Categories") + ":", yaxis1, xaxis);
	  doc.text(categoriesName, yaxis2, xaxis);
	  xaxis += 5 + tempXAxis;

	  asset?.files?.map((file: any) => {
		let checksum = file?.checksum?.checksum;
		doc.text(t("Checksum") + ":", yaxis1, xaxis);
		doc.text(checksum ? checksum : "", yaxis2, xaxis);
		xaxis += 5;
	  });

	  let size = asset?.files?.filter((x: any) => typeOfAssetToInclude?.includes(x?.type)).reduce((a: any, b: any) => a + b?.size, 0)
	  doc.text(t("File_Size") + ":", yaxis1, xaxis);
	  doc.text(formatBytes(size, 2), yaxis2, xaxis);
	  xaxis += 5;

	  doc.text(t("Asset_Duration") + ":", yaxis1, xaxis);
	  doc.text(milliSecondsToTimeFormat(new Date(asset?.duration)), yaxis2, xaxis);
	  xaxis += 5;

	  doc.text(t("User_Id") + ":", yaxis1, xaxis);
	  doc.text(userName, yaxis2, xaxis);
	  xaxis += 5;

	  autoTable(doc, {
		startY: xaxis,
		head: head,
		body: data,
		didDrawCell: (data: any) => {
		},
	  });
	  doc.save(assetName + ".pdf");
	}


    const onClickDownloadAssetTrail = async () => {
      if(selectedItems.length > 0){
        let image = await toDataURL(window.location.origin + '/assets/images/Getac_logo_orange.jpg').then(dataUrl => {
          return dataUrl;
        })
        image = image ? image : "";
        selectedItems.forEach(async (x:any) => {
          await downloadTrailFunction(image,x?.evidence.id,x?.assetId);
        });
      }
      else if(row) {
        let image = await toDataURL(window.location.origin + '/assets/images/Getac_logo_orange.jpg').then(dataUrl => {
          return dataUrl;
        })
        image = image ? image : "";
        downloadTrailFunction(image,row?.evidence.id,row?.assetId);
      }
    };

    const downloadTrailFunction = async (image: any, evidenceId: any, assetId: any) => {
      let assetTrail = await getAssetTrail(evidenceId,assetId);
      let getAssetData = await getAssetInfo(evidenceId);
      let AllAssetData = [getAssetData.assets.master, ...getAssetData.assets.children];
      let currentAssetData = AllAssetData.find((x:any)=> x.id == assetId);
      let assetInfo;
      if(currentAssetData){
        if (getAssetData) {
          let categories: any[] = getAssetData.categories.map((x: any) => {
              return x.name;
          });

          let owners: any[] = currentAssetData.owners.map(
            (x: any) =>
              x.record.find((y: any) => y.key == "UserName")?.value ?? ""
          );

          let unit  = currentAssetData.unitId <= 0 ? "N/A" : currentAssetData.unit?.record.find((y: any) => y.key == "Name")?.value ?? "N/A"
            
          let checksum: number[] = [];
          currentAssetData.files.forEach((x: any) => {
            checksum.push(x.checksum.checksum);
          });

          let size = currentAssetData.files.reduce(
            (a, b) => a + b.size,
            0
          );

		  let categoriesForm: string[] = [];
		  getAssetData.categories.forEach((x: any) => {
			categoriesForm.push(x.record.cmtFieldName);
		  });

          assetInfo = {
            owners: owners.join(", "),
            unit: unit.toString(),
            capturedDate: convertDateTime(getAssetData.createdOn).join(" "),
            checksum: checksum,
            duration: milliSecondsToTimeFormat(
              new Date(currentAssetData.duration)
            ),
            size: formatBytes(size, 2),
            retention:
              retentionSpanText(
                getAssetData.holdUntil,
                getAssetData.expireOn
              ) ?? "",
            categories: categories.join(", "),
            categoriesForm: categoriesForm,
            id: currentAssetData.id,
            assetName: currentAssetData.name,
            typeOfAsset: currentAssetData.typeOfAsset,
            status: currentAssetData.status,
            camera: currentAssetData.camera ?? "",
            recordedBy: currentAssetData?.recordedByCSV ?? "",
          };
        }

        
      }
      let uploadCompletedOn = await getuploadCompletedOn(
        currentAssetData?.files
      );
      let uploadCompletedOnFormatted = uploadCompletedOn
          ? convertDateTime(uploadCompletedOn).join(" ")
          : "";

      //download
      if (assetTrail && assetInfo) {
        auditTrailPDFDownload(assetTrail, assetInfo, uploadCompletedOnFormatted,image)
        successFullyDownloadToastMessage();
        var temp: EvidenceAssetNotes[] = [];
        temp.push({
          evidenceId: getAssetData.id,
          assetId: assetInfo.id,
          notes: "Asset Audit Trail Exported",
        })
        multiAssetLog.evidenceAssetNotes = temp;

        dispatch(addMultiAssetLog(multiAssetLog));
      }
    };


    const getAssetTrail = async (evidenceId: any,assetId: any) => {
      return await EvidenceAgent.getAssetTrail(
        `/Evidences/${evidenceId}/Assets/${assetId}/AssetTrail`
      ).then((response) => response);
    };

    const getAssetInfo = async (evidenceId: any) => {
      return await EvidenceAgent.getEvidence(evidenceId).then(
        (response: Evidence) => response
      );
    };

	const getuploadCompletedOn = async (files: any) => {
	  if (files) {
		let uploadCompletedOn;
		for (const file of files) {
		  if (file.type == "Video") {
			let url = "/Files/"+file.filesId +"/"+ file.accessCode;
			await FileAgent.getFile(url).then((response) => {
			  uploadCompletedOn = response.history.uploadCompletedOn;
			});
			break;
		  }
		}
		return uploadCompletedOn;
	  }
	};

	const downloadExeFileByFileResponse = (
	  response: any,
	  assetName: string
	) => {
	  let fileStream = response.data;
	  const fileName = assetName + ".exe";
	  const blob = new Blob([fileStream], { type: "application/octet-stream" });
	  const link = document.createElement("a");
	  link.href = window.URL.createObjectURL(blob);
	  link.setAttribute("download", fileName);
	  link.click();
	  if (link.parentNode) {
		link.parentNode.removeChild(link);
	  }
	  showToastMsg?.({
		message: t("file downloaded successfully"),
		variant: "success",
		duration: 5000,
	  });
	};

	const downloadFileByURLResponse = (url: string) => {
	  // Create Link to trigger browser api to download.
	  const link = document.createElement("a");
	  // Give url to link.
	  link.href = url;
	  //set download attribute to that link.
	  link.setAttribute("download", ``);
	  // Append to html link element page.
	  document.body.appendChild(link);
	  successFullyDownloadToastMessage();
	  // start download.
	  link.click();
	  // Clean up and remove the link.
	  if (link.parentNode) {
		link.parentNode.removeChild(link);
	  }
	};

	const closeDialog = () => {
	  setIsModalOpen(false);
	  setIsRmvAssetConfModalOpen(false);
	  setOpenManageRetention(false);
	  setOpenAssignUser(false);
	  setIsAssetLinkConfirm(false);
	  history.push(
		urlList.filter((item: any) => item.name === urlNames.assets)[0].url
	  );
	};
	const RemoveMultipleAssetsConfirm = () => {
	  // For Asset Bucket Top Action Menu
	  if (row == undefined && selectedItems.length > 0) {
	  setIsRmvAssetConfModalOpen(false);
	  removeFromAssetBucket();
	  }
	};
	const handleCloseRetention = () => {
	  if (IsformUpdated) setIsModalOpen(true);
	  else setOpenManageRetention(false);
	};

	const handleCloseAssignUser = () => {
	  if (IsformUpdated) setIsModalOpen(true);
	  else setOpenAssignUser(false);
	};

	const addToAssetBucket = () => {
	  //if undefined it means header is clicked
	  if (row !== undefined && row !== null) {
		if (selectedItems.length > 0) {
		  dispatch(addAssetToBucketActionCreator(selectedItems));
		} else {
		  const find = selectedItems.findIndex(
			(selected: any) => selected.id === row.id
		  );

		  const data = find === -1 ? row : selectedItems;
		  // To cater object is not extensible issue,
		  let newObject = { ...data };

		  if (data.evidence) {
			newObject.isMaster = data.evidence.masterAssetId === data.id;
			const isLock = data.evidence.asset.find((x : any)=> x.assetId == data.assetId)?.lock;
			newObject.lock = isLock ?? null;
		  } else {
			newObject.isMaster = data.masterAssetId === asset.assetId;
			newObject.selectedAssetId = asset.assetId;
		  }
		  dispatch(addAssetToBucketActionCreator(newObject));
		}
	  } else {
		dispatch(addAssetToBucketActionCreator(selectedItems));
	  }
	  setIsAddedToBucket(true);
	};
	const OpenRemoveAssetConfModal = () => { 
	  setIsRmvAssetConfModalOpen(true);
	}
	const removeFromAssetBucket = () => {
		if (row && !selectedItems.includes(row)) {
			const find = selectedItems.findIndex(
				(selected: SearchModel.Asset) => selected.assetId === +row.assetId
			);
			const data = find === -1 ? row : selectedItems;
			dispatch(removeAssetFromBucketActionCreator(data))
		}
		if (row == undefined && selectedItems.length > 0) {
			dispatch(removeAssetFromBucketActionCreator(selectedItems));
			setSelectedItems && setSelectedItems([])
			return
		}
		if (row && selectedItems.includes(row)) {
			
			dispatch(removeAssetFromBucketActionCreator(selectedItems))
		}
		
	  //if (row) {
	  // For Asset Bucket Top Action Menu
	//   console.log("row",row);
	//   if (row == undefined && selectedItems.length > 0) {
	// 	dispatch(removeAssetFromBucketActionCreator(selectedItems));
	// 	setSelectedItems && setSelectedItems([])
	// 	return
	//   }
	//   // --------------------------------

	//   const find = selectedItems.findIndex(
	// 	(selected: SearchModel.Asset) => selected.assetId === row.id ?? row.assetId
	//   );
	//   const data = find === -1 ? selectedItems :  row ;

	//   dispatch(removeAssetFromBucketActionCreator(data));
	//   if (find !== -1) {
	// 	setSelectedItems && setSelectedItems([])
	// 	return;
	//   }
	//   // }
	//   else {
	// 	const selectedData: any = []
	// 	selectedData.push(row)
	// 	const data = selectedItems.length ? selectedItems : selectedData;
	// 	dispatch(removeAssetFromBucketActionCreator(data));
	// 	setSelectedItems && setSelectedItems([])
	// 	return;
	//   }
	};

	const calculateSecurityDescriptor = (): void => {
	  //NOTE: Multiple Assets selected.
	  if (selectedItems.length > 0) {
		//NOTE : Multiple Assets are selected, but did n't clicked on specific row.
		const assetIdSecurityDescriptorCollection: any[] = [];
		for (const asset of selectedItems) {
		  assetIdSecurityDescriptorCollection.push({
			assetId: asset.assetId,
			securityDescriptorMaxId: findMaximumDescriptorId(
			  asset.evidence.securityDescriptors
			),
			isEvidenceExpired: CheckEvidenceExpire(asset.evidence),
		  });
		}

		let isEvidenceExpired =
		  assetIdSecurityDescriptorCollection.filter(
			(x: any) => x.isEvidenceExpired === true
		  )?.length > 0;
		setIsMultiSelectEvidenceExpired(isEvidenceExpired);
		const lowestSecurityDescriptorAssetIdAndDescriptor =
		  assetIdSecurityDescriptorCollection.sort((a: any, b: any) =>
			a.securityDescriptorMaxId > b.securityDescriptorMaxId ? 1 : -1
		  )[0];
		setMaximumDescriptor(
		  lowestSecurityDescriptorAssetIdAndDescriptor.securityDescriptorMaxId
		);
		const lowestSecurityDescriptorAssetObject = selectedItems.find(
		  (x: any) =>
			x.assetId === lowestSecurityDescriptorAssetIdAndDescriptor.assetId
		);
		setSecurityDescriptorsArray(
		  lowestSecurityDescriptorAssetObject.evidence.securityDescriptors
		);
		return;
	  }
	  //NOTE : Clicked on row.
	  else {
		if (row?.evidence?.securityDescriptors) {
		  setMaximumDescriptor(
			findMaximumDescriptorId(row.evidence.securityDescriptors)
		  );
		  setSecurityDescriptorsArray(row.evidence.securityDescriptors);
		  setIsMultiSelectEvidenceExpired(false);
		  return;
		}
	  }
	};

	if (row !== undefined && row !== null) {
		
	  assetBucketData.forEach((data) => {
		if (+data.assetId === +row.assetId) addToAssetBucketDisabled = true;
	  });
	} else if (selectedItems !== undefined && selectedItems.length > 0) {
	  let value = multiCompareAssetBucketData(assetBucketData, selectedItems);
	  if (value.includes(false)) addToAssetBucketDisabled = false;
	  else addToAssetBucketDisabled = true;
	}

    if (row !== undefined && row !== null) {
      assetBucketData.forEach((data) => {
        if (data.assetId === row.assetId) addToAssetBucketDisabled = true;
      });
    } else if (selectedItems !== undefined && selectedItems.length > 0) {
      let value = multiCompareAssetBucketData(assetBucketData, selectedItems);
      if (value.includes(false)) addToAssetBucketDisabled = false;
      else addToAssetBucketDisabled = true;
    }


	const isEvidenceCategorizedByCurrentUser = () => {
	  let categorizedBy: number = 0;
	  if ((!row) && selectedItems.length > 1) {
		categorizedBy = selectedItems[0].evidence.categorizedBy;
	  } else {
		if (actionMenuPlacement === ActionMenuPlacement.AssetLister)
		  categorizedBy = row?.categorizedBy;
		else
		  categorizedBy = row?.evidence.categorizedBy;
	  }
	  if (categorizedBy) {
		if (categorizedBy === Number(UserId))
		  return true;
		else
		  return false;
	  }
	  return false;
	}

	const evidenceCategorizedBy = (): number | null => {
	  if ((!row) && (selectedItems.length > 1)) {
		const evidenceCategorizedBy: Array<{ evidenceId: number, categorizedBy: number }> = [];
		for (const asset of selectedItems) {
		  if (asset.evidence.categorizedBy) {
			evidenceCategorizedBy.push({
			  evidenceId: Number(asset.evidence.id),
			  categorizedBy: Number(row?.evidence.categorizedBy)
			});
		  }
		}
	  }
	  if (row?.evidence) {
		if (row?.evidence.categorizedBy)
		  return Number(row?.evidence.categorizedBy);
		else
		  return null;
	  }
	  return null;
	}

	const linkAssetHandler = () => {
	  let tempLinkedAssets: AssetAction[] = [];
	  if (assetlinks.length > 0) {
		assetlinks.map((x: AssetLink) => {
		  tempLinkedAssets.push({
			masterId: x.masterId,
			assetId: x.assetId,
			evidenceId: x.evidenceId,
			actionType: "link",
			assetName: x.assetName,
			assetType: x.assetType,
			fileType: x.fileType,
			expireOn: x.expireOn,
			holduntil: x.holduntil,
			isRestricted: row.evidence.asset.find((y: any) => y.assetId == x.assetId).lock,
		  });

		});
	  }
	  else {
		if(row != null){
		tempLinkedAssets.push({
		  masterId: row.evidence.masterAssetId,
		  assetId: row.assetId,
		  evidenceId: row.evidence.id,
		  actionType: "link",
		  assetName: row.evidence.asset.find((x: any) => x.assetId == row.assetId).assetName,
		  assetType: row.evidence.asset.find((x: any) => x.assetId == row.assetId).assetType,
		  fileType: row.evidence.asset.find((x: any) => x.assetId == row.assetId).files[0].type,
		  expireOn: row.evidence.expireOn,
		  holduntil: row.evidence.holdUntil,
		  isRestricted: row.evidence.asset.find((x: any) => x.assetId == row.assetId).lock,
			});
		  }
	  }

	  ////Master Assets////
	  if (selectedItems.length > 0) {
		selectedItems.map((obj: any) => {

		  if (tempLinkedAssets.filter(x => x.assetId == obj.assetId).length == 0) {
			tempLinkedAssets.push({
			  masterId: obj.assetId,
			  assetId: obj.assetId,
			  evidenceId: obj.id,
			  actionType: "link",
			  assetName: obj.assetName,
			  assetType: obj.assetType,
			  fileType: obj.evidence.asset.find((x: any) => x.assetId == obj.assetId).files[0].type,
			  expireOn: obj.evidence.expireOn,
			  holduntil: obj.evidence.holduntil,
			  isRestricted: obj.evidence.asset.find((x: any) => x.assetId == obj.assetId).lock,
			});
		  }
		})

	  }
	  else {
		if (tempLinkedAssets.filter(x => x.assetId == row.assetId).length == 0) {
		  tempLinkedAssets.push({
			masterId: row.assetId,
			assetId: row.assetId,
			evidenceId: row.id,
			actionType: "link",
			assetName: row.assetName,
			assetType: row.assetType,
			fileType: row.evidence.asset.find((x: any) => x.assetId == row.assetId).files[0].type,
			expireOn: row.evidence.expireOn,
			holduntil: row.evidence.holduntil,
			isRestricted: row.evidence.asset.find((x: any) => x.assetId == row.assetId).lock,
		  });
		}
	  }
	  setOpenAssetAction(tempLinkedAssets);
	  setSelectedItems && setSelectedItems([])
	}

	const linkToAssetHandler = () => {
	  if(isDisabled("link") == true)
		{
	  handleAssetLinkOpen();
	  let tempLinkedAssets: AssetAction[] = [];
		}
	}

	const moveAssetHandler = () => {
	  let tempLinkedAssets: AssetAction[] = [];
	  if (assetlinks.length > 0) {
		assetlinks.map((x: AssetLink) => {
		  tempLinkedAssets.push({
			masterId: x.masterId,
			assetId: x.assetId,
			evidenceId: x.evidenceId,
			actionType: "move",
			assetName: x.assetName,
			assetType: x.assetType,
			fileType: x.fileType,
			expireOn: row.expireOn,
			holduntil: row.holduntil,
			isRestricted: row.evidence.asset.find((y: any) => y.assetId == x.assetId).lock,
		  });
		});
	  }
	  else {
		tempLinkedAssets.push({
		  masterId: row.evidence.masterAssetId,
		  assetId: row.assetId,
		  evidenceId: row.evidence.id,
		  actionType: "move",
		  assetName: row.evidence.asset.find((x: any) => x.assetId == row.assetId).assetName,
		  assetType: row.evidence.asset.find((x: any) => x.assetId == row.assetId).assetType,
		  fileType: row.evidence.asset.find((x: any) => x.assetId == row.assetId).files[0].type,
		  expireOn: row.expireOn,
		  holduntil: row.holduntil,
		  isRestricted: row.evidence.asset.find((x: any) => x.assetId == row.assetId).lock,
		});
	  }
	  setOpenAssetAction(tempLinkedAssets);
	}

	const moveToAssetHandler = () => {
	  if(isDisabled("move") == true)
	  {
	  handleAssetMoveOpen();
	  //dispatch(clearAllGroupedSelectedAssetsActions());
	  }
	}

	const dispatchEvidenceToSearch = () => {
	  let local_evidenceSearchType: any = localStorage.getItem("evidenceSearchType");
	  if (local_evidenceSearchType) {
		let searchType = JSON.parse(local_evidenceSearchType).searchValue;
		setTimeout(() => {
		  dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: searchType, }));
		}, 2000);
	  }
	}
	
	const UploadMasterAssetRequest = (evidenceId: number, isRetry: boolean) => {
	  const url = `Evidences/${evidenceId}/Assets/RequestingMasterAssetUpload?isRetry=${isRetry}`;
	  EvidenceAgent.masterAssetRequestUpload(url).then((resp: any) => {
		showToastMsg?.({
		  message:
			"Asset Status Updated",
		  variant: "success",
		  duration: 7000,
		});
		dispatchEvidenceToSearch()
		
	  })
	}

	const UploadChildAssetRequest = (evidenceId: number, assetId: number, isRetry: boolean) => {
	  const url = `Evidences/${evidenceId}/Assets/${assetId}/RequestingChildAssetUpload?isRetry=${isRetry}`;
	  EvidenceAgent.masterAssetRequestUpload(url).then(() => {
		showToastMsg?.({
		  message:
			"Asset Status Updated",
		  variant: "success",
		  duration: 7000,
		});
		dispatchEvidenceToSearch()
	  
	  })
	}

	const AssetStatusUpdate = (assetId: number, masterAssetId: number, evidenceId: number) => {
	  assetId == masterAssetId ? UploadMasterAssetRequest(evidenceId, isRetry) : UploadChildAssetRequest(evidenceId, assetId, isRetry);
	}

	const requestUploadAsset = () => {
	  if (isSelectedItem) {
		selectedItems.map((x: any) => {
		  AssetStatusUpdate(x.assetId, x.evidence.masterAssetId, x.evidence.id)
		});

	  } else {
		AssetStatusUpdate(row.assetId, row.evidence.masterAssetId, row.evidence.id)
	  }
	}

	useEffect(()=>{
	  const htmlModelStyle: any = document?.querySelector("html");  
		  if(openForm || openAssetShare) {
				htmlModelStyle.setAttribute("class", "removeScrollModel"); 
			}
			else {
				htmlModelStyle.removeAttribute("class","removeScrollModel"); 
			}
	},[openForm,openAssetShare])

	useEffect(()=>{
	  dispatch(setSharePopupStatus({sharePopup:openAssetShare }))
	},[openAssetShare])

	const assetBucketClass = addToAssetBucketDisabled ? "bucketWithRemoveAsset" : "bucketWithAddAsset";
	const isDisabled = (actionType: string) => {
	  if(actionType == "move")
	  {
	  return (
	  (actionMenuPlacement == ActionMenuPlacement.AssetLister
	  && groupedSelectedAssetsActions.length > 0
	  && multiAssetDisabled == false
	  && isAssetLinkedOrMoved == "move")? true: false)
	  }
	  else
	  {
		return ((actionMenuPlacement == ActionMenuPlacement.AssetLister
		  && groupedSelectedAssetsActions.length > 0
		  && isAssetLinkedOrMoved == "link")? true: false)
	  }
	}

	const CheckSubMenuAction = (row: any, asset: any, selectedItems: any) => {
		return (!CheckEvidenceExpire(row?.evidence) && metadataActionMenu.indexOf(asset?.status ?? row?.evidence?.asset?.find((x: any) => x?.assetId?.toString() === row?.assetId?.toString())?.status) === -1 && !CheckIsSelectedItemsEvidenceExpire(selectedItems));
	}

	const CheckIsSelectedItemsEvidenceExpire = (selectedItems: any) => {
		let isEvidenceExpire = false;
		selectedItems?.map((x: any) => {
			if (CheckEvidenceExpire(x?.evidence)) {
				isEvidenceExpire = true;
			}
		})
		return isEvidenceExpire;
	}
  

	return (
	  <>
		<CategoryFormContainer
		  setOpenForm={() => setOpenForm(false)}
		  openForm={openForm}
		  evidenceId={row?.evidence.id}
		  isCategoryEmpty={isCategoryEmpty}
		  setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
		  categorizedBy={evidenceCategorizedBy()}
		  isCategorizedBy={isEvidenceCategorizedByCurrentUser()}
		  selectedItems={selectedItems}
		  setSelectedItems={setSelectedItems}
		/>

        <Menu
          key="right"
          align="center"
          viewScroll={actionViewScroll}
          direction="right"
          position="auto"
          offsetX={25}
          offsetY={12}
          onItemClick={(e) => (e.keepOpen = true)}
          className={`menuCss mainListerAction  ${assetBucketClass} ${className} `}
          portal={portal}
          menuButton={
            <MenuButton>
              <i
                className={
                  actionMenuPlacement == ActionMenuPlacement.AssetDetail
                    ? "fas fa-ellipsis-h"
                    : "far fa-ellipsis-v"
                }
              ></i>
            </MenuButton>
          }
        >
          {addToAssetBucketDisabled === false  ?
          <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={0}
                descriptorId={1}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Add_to_asset_bucket")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={addToAssetBucket}
              >
                <div className="crx-menu-icon">
                  <i className="icon-drawer"></i>
                  <i className="icon_position_plus icon icon-plus"></i>
                </div>
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
            </ActionMenuCheckList>
          </MenuItem>
          : 
            <MenuItem>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={(row == undefined && selectedItems.length > 0) ? OpenRemoveAssetConfModal : removeFromAssetBucket}
              >
                <div className="crx-menu-icon">
                   <i className="icon-drawer"></i>
                   <i className="icon_position_minus icon icon-minus"></i>
                </div>
                <div className="crx-menu-list">
                  {`${t("Remove_from_asset_bucket")}`}
                </div>
              </div>
            </MenuItem>
            }
           {!isRelatedAsset &&<MenuItem>
            <ActionMenuCheckList
              asset={asset}
              moduleId={isCategoryEmpty ? 2 : 3}
              descriptorId={4}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={isCategoryEmpty ? t("Categorize") : t("Edit_category_and_form")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              isCategorizedByCheck={true}
              isCategorizedBy={isEvidenceCategorizedByCurrentUser()}
            >
              <div className="crx-meu-content" onClick={handleChange}>
                <div className="crx-menu-icon">
                  <i className="fa-regular fa-clipboard-list-check"></i>
                </div>
                <div className="crx-menu-list">
                  {isCategoryEmpty ? t("Categorize") : t("Edit_category_and_form")}
                </div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>
}

          {row?.evidence?.evidenceRelations?.length > 0 ?
            null
            : 
            (!isRelatedAsset && multiAssetDisabled == false && isPrimaryOptionOpen && (
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={30}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Set_as_primary")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div className="crx-meu-content" onClick={handlePrimaryAsset}>
                  <div className="crx-menu-icon"></div>
                  <div className="crx-menu-list">{t("Set_as_primary")}</div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
            ))}
          {
            row?.evidence && !CheckEvidenceExpire(row?.evidence) && (
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={77}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Assign_to_case")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
              <div
                className="crx-meu-content"
                onClick={handleOpenAssignToCaseChange}
              >
                <div className="crx-menu-icon">
                  <i className="fa-regular fa-briefcase"></i>
                </div>
                {
                  checkCaseOpenedForEvidence() > 0 ?
                    <CRXTooltip content={
                      <div className="crx-menu-list">{t("Assign_to_case")}</div>
                      } arrow={false} title={caseIdOpenedForEvidenceRef.current.title} placement="right" className="caseOpenedForEvidenceTooltip"/>
                  : <div className="crx-menu-list">{t("Assign_to_case")}</div>
                }
              </div>
              </ActionMenuCheckList>
            </MenuItem>
          )}

          {!isRelatedAsset && <MenuItem>
            <ActionMenuCheckList
              asset={asset}
              moduleId={21}
              descriptorId={3}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={t("Assign_user")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
            >
              <div
                className="crx-meu-content"
                onClick={handleOpenAssignUserChange}
              >
                <div className="crx-menu-icon">
                  <i className="fa-regular fa-user-tag"></i>
                </div>
                <div className="crx-menu-list">{t("Assign_user")}</div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>
}

          {!isRelatedAsset &&<MenuItem>
            {
             row?.evidence?.evidenceRelations?.length > 0 ?
               null
            :  <ActionMenuCheckList
                asset={asset}
                moduleId={27}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Modify_retention")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content groupingMenu"
                  onClick={handleOpenManageRetention}
                >
                  <div className="crx-menu-icon"></div>
                  <div className="crx-menu-list">{t("Modify_retention")}</div>
                </div>
              </ActionMenuCheckList> 
            }
          </MenuItem>
}
          {multiAssetDisabled === false && row && row.assetType === 'Video' && !isSubmittedForRedaction &&
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={70}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Submit_to_Getac_AI")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content groupingMenu"
                  onClick={handleOpenAssignSubmission}
                >
                  <div className="crx-menu-icon">
                    <i className="fa-regular fa-photo-film"></i>
                  </div>
                  <div className="crx-menu-list">
                    {t("Submit_to_Getac_AI")}
                  </div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          }
          {!isRelatedAsset && multiAssetDisabled === false && row && row.assetType === 'Video' && isSubmittedForRedaction &&
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={70}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Review_in_Getac_AI")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content groupingMenu"
                  onClick={() => window.open(`${REDIRECT_URL_AICOORDINATOR}?assetName=${row.assetName}`, "_blank")}
                >
                  <div className="crx-menu-icon">
                    <i className="fa-regular fa-photo-film"></i>
                  </div>
                  <div className="crx-menu-list">
                    {t("Review_in_Getac_AI")}
                  </div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          }
          {!isRelatedAsset && multiAssetDisabled === false && row && row.assetType === 'Video' && isSubmittedForRedaction &&
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={70}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Submit_again_to_Getac_AI")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content groupingMenu"
                  onClick={handleOpenAssignSubmission}
                >
                  <div className="crx-menu-icon">
                  </div>
                  <div className="crx-menu-list">
                    {t("Submit_again_to_Getac_AI")}
                  </div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          }

          <MenuItem>
            <ActionMenuCheckList
              asset={asset}
              moduleId={15}
              descriptorId={2}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={t("Share_asset")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
            >
              <div className="crx-meu-content" onClick={handleOpenAssetShare}>
                <div className="crx-menu-icon">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="crx-menu-list">{t("Share_asset")}</div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>


		  
  
          <MenuItem>
            <ActionMenuCheckList
              asset={asset}
              moduleId={35}
              descriptorId={2}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={t("Export")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
            >
              <div className="crx-meu-content groupingMenu export">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <SubMenu label={t("Export")}>
                    {CheckSubMenuAction(row, asset, selectedItems) ? (
                      <MenuItem onClick={() => {
                        handleDownloadAssetClick()
                      }}>
                        {t("Download_asset(s)")}
                      </MenuItem>
                    ) : null}
                    <MenuItem onClick={handleDownloadMetaDataClick}>
                      {t("Download_metadata_info")}
                    </MenuItem>
					{CheckSubMenuAction(row, asset, selectedItems) ? (
                      <MenuItem onClick={onClickDownloadAssetTrail}>
                        {t("Download_audit_trail")}
                      </MenuItem>
                    ) : null}
                  </SubMenu>
                </div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>
          


          {(actionMenuPlacement != ActionMenuPlacement.AssetDetail && actionMenuPlacement != ActionMenuPlacement.AssetBucket) ? (
          <MenuItem>
          {row?.evidence?.evidenceRelations?.length > 0 ?
               null
            : 
           !isRelatedAsset && <ActionMenuCheckList
              asset={asset}
              moduleId={71}
              descriptorId={3}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={t("Link_asset")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
            >
              <div
                className="crx-meu-content"
                onClick={linkAssetHandler}
              >
                <div className="crx-menu-icon">
                  <i className="far fa-link fa-md"></i>
                </div>

				<div className="crx-menu-list">{t("Link_asset")}</div>

			  </div>
			</ActionMenuCheckList>
		  }
		  </MenuItem>
		  ) : null }

{(actionMenuPlacement != ActionMenuPlacement.AssetDetail && actionMenuPlacement != ActionMenuPlacement.AssetBucket) && !isRelatedAsset && (
    <MenuItem  disabled={isDisabled("link")} className={isDisabled("link") == true ? "list_style_enabled" : "list_style_disabled"}>
                <ActionMenuCheckList
                  asset={asset}
                  moduleId={71}
                  descriptorId={3}
                  maximumDescriptor={maximumDescriptor}
                  evidence={row?.evidence}
                  actionMenuName={t("Link_to_this_group")}
                  securityDescriptors={securityDescriptorsArray}
                  isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
                >
                  <div
                    className="crx-meu-content"
                    onClick={linkToAssetHandler}
                  >
                    <div className="crx-menu-icon">
                      {/* <i className="far fa-user-lock fa-md"></i> */}
                    </div>

					<div className={(isDisabled("link") == true)?
			 ("crx-menu-list"):("crx-menu-list disabledItem")}>{t("Link_to_this_group")}</div>

				  </div>
				</ActionMenuCheckList>
			  </MenuItem>
)}
          {row?.evidence?.evidenceRelations?.length > 0 ?
          null
          : 
          (actionMenuPlacement == ActionMenuPlacement.DetailedAssets && !isRelatedAsset ? (
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={71}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Move_asset")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content"
                  onClick={moveAssetHandler}
                >
                  <div className="crx-menu-icon">
                    <i className="far fa-square-arrow-up-right fa-md"></i>
                  </div>

				  <div className="crx-menu-list">{t("Move_asset")}</div>

				</div>
			  </ActionMenuCheckList>
			</MenuItem>
		  ) : null)}
		  
		  {(actionMenuPlacement != ActionMenuPlacement.AssetDetail && actionMenuPlacement != ActionMenuPlacement.AssetBucket) && !isRelatedAsset && (
			  <MenuItem disabled={isDisabled("move")} className={isDisabled("move") == true ? "list_style_enabled" : "list_style_disabled"}>
				<ActionMenuCheckList
				  asset= {asset}
				  moduleId={71}
				  descriptorId={3}
				  maximumDescriptor={maximumDescriptor}
				  evidence={row?.evidence}
				  actionMenuName={t("Move_to_this_group")}
				  securityDescriptors={securityDescriptorsArray}
				  isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
				  
				>
				  <div
					className="crx-meu-content groupingMenu"
					onClick={moveToAssetHandler}
				  >
					<div className="crx-menu-icon">
					  {/* <i className="far fa-user-lock fa-md"></i> */}
					</div>

					<div className=
					{(isDisabled("move") == true)?
					   ("crx-menu-list"):("crx-menu-list disabledItem")} >
						{t("Move_to_this_group")}
						</div>

				  </div>
				</ActionMenuCheckList>
			  </MenuItem>
          )}
    
          {!isRelatedAsset && isMetadataOnly  || isRetry ? (<MenuItem>
                <ActionMenuCheckList
                  asset={asset}
                  moduleId={72}
                  descriptorId={3}
                  maximumDescriptor={maximumDescriptor}
                  evidence={row?.evidence}
                  actionMenuName={t("Request_Upload")}
                  securityDescriptors={securityDescriptorsArray}
                  isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
                >
                  <div
                    className="crx-meu-content groupingMenu crx-spac"
                    onClick={requestUploadAsset}
                  >
                    <div className="crx-menu-icon">
                      {/* <i className="far fa-user-lock fa-md"></i> */}
                    </div>
                <div className="crx-menu-list">{isMetadataOnly ? t("Request_Upload") : t("Retry_Request_Upload")}</div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>) : ""}

          {!isRelatedAsset && isLockedAccess ? (
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={0}
                descriptorId={2}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Unlock_access")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content crx-spac"
                  onClick={unlockAccessClickHandler}
                >
                  <div className="crx-menu-icon">
                    <i className="far fa-user-lock fa-md"></i>
                  </div>
                  <div className="crx-menu-list">{t("Unlock_access")}</div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          ) : (!isRelatedAsset &&
            <MenuItem>
              <ActionMenuCheckList
                asset={asset}
                moduleId={28}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Restrict_access")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content crx-spac"
                  onClick={restrictAccessClickHandler}
                >
                  <div className="crx-menu-icon">
                    <i className="fa-regular fa-user-lock"></i>
                  </div>
                  <div className="crx-menu-list">{t("Restrict_access")}</div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          )}
          
        </Menu>

		<RestrictAccessDialogue
		  openOrCloseModal={openRestrictAccessDialogue}
		  setOpenOrCloseModal={(e) => setOpenRestrictAccessDialogue(e)}
		  onConfirmBtnHandler={() =>
			confirmCallBackForRestrictAndUnLockModal(AssetRestriction.Lock)
		  }
		  isError={assetLockUnLockError.isError}
		  errorMessage={assetLockUnLockError.errorMessage}
		/>
		<MultiExportMetadataAsset
		  primaryMessage={t("Yes_all_grouped_asset_metadata")}
		  title={t("Export_Asset_Metadata")}
		  message={t('Would_you_like_to_include_all_grouped_asset_metadata_in_your_export')}
		  openOrCloseModal={openMultiExportMetadataAsset}
		  setOpenOrCloseModal={(e) => {
			setMultiExportMetadataAsset(e)
			DownloadMetadata(true);
		  }
		  }
		  onConfirmBtnHandler={() => {
			setMultiExportMetadataAsset(false)
			DownloadMetadata();
		  }
		  }
		  isError={false}
		  errorMessage={""}
		  setCloseButton={setCloseButton}
		/>

		<MultiExportMetadataAsset
		  primaryMessage={t("Yes_export_all_grouped_assets")}
		  title={t("Export_Assets")}
		  message={t('Would_you_like_to_include_all_grouped_assets_in_your_export')}
		  openOrCloseModal={multiExportAsset}
		  setOpenOrCloseModal={(e) => {
			setMultiExportAsset(e)
			DownloadAsset(true);
		  }
		  }
		  onConfirmBtnHandler={() => {
			setMultiExportAsset(false)
			DownloadAsset();
		  }
		  }
		  isError={false}
		  errorMessage={""}
		  setCloseButton={setCloseButtonDownloadAsset}
		/>
		<UnlockAccessDialogue
		  openOrCloseModal={openUnlockAccessDialogue}
		  setOpenOrCloseModal={(e) => setOpenUnlockAccessDialogue(e)}
		  onConfirmBtnHandler={() =>
			confirmCallBackForRestrictAndUnLockModal(AssetRestriction.UnLock)
		  }
		  isError={assetLockUnLockError.isError}
		  errorMessage={assetLockUnLockError.errorMessage}
		/>

		<CRXModalDialog
		  maxWidth="lg"
		  title={t("Assign_user")}
		  className={"CRXModal CRXModalAssignUser"}
		  modelOpen={openAssignUser}
		  onClose={() => handleCloseAssignUser()}
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
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
			setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
		  />
		</CRXModalDialog>
		<CRXModalDialog
		  maxWidth="lg"
		  title={t("Modify_retention")}
		  className={"CRXModal"}
		  modelOpen={openManageRetention}
		  onClose={() => handleCloseRetention()}
		  defaultButton={false}
		  indicatesText={true}
		>
		  <ManageRetention
			items={selectedItems}
			filterValue={filterValue}
			rowData={row}
			setRemovedOption={(e: any) => { }}
			setOnClose={() => setOpenManageRetention(false)}
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
			setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
		  />
		</CRXModalDialog>
		<CRXModalDialog
		  maxWidth="lg"
		  title={t("Share_asset")}
		  className={"CRXModal __Crx__Share__asset"}
		  modelOpen={openAssetShare}
		  onClose={() => setOpenAssetShare(false)}
		  defaultButton={false}
		  indicatesText={true}
		  showSticky={true}
		>
		  <ShareAsset
			filterValue={filterValue}
			rowData={row}
			childAssets={assetlinks}
			items={selectedItems} //{assetlinks}
			setRemovedOption={(e: any) => { }}
			setOnClose={() => setOpenAssetShare(false)}
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
			actionPlacement = {actionMenuPlacement}
		  />
		</CRXModalDialog>

		<CRXModalDialog
		  maxWidth="lg"
		  title={isSubmittedForRedaction?t("Submit_again_to_Getac_AI"):t("Submit_to_Getac_AI")}
		  className={"CRXModal"}
		  modelOpen={openSubmitAnalysis}
		  onClose={() => setOpenSubmitAnalysis(false)}
		  defaultButton={false}
		  indicatesText={true}
		>
		  <SubmitAnalysis
			items={selectedItems}
			filterValue={filterValue}
			rowData={row}
			setRemovedOption={(e: any) => { }}
			setOnClose={() => setOpenSubmitAnalysis(false)}
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
			isSubmittedForRedaction={isSubmittedForRedaction}
		  />
		</CRXModalDialog>
		<CRXModalDialog
		  maxWidth="lg"
		  title={t("Please_Confirm")}
		  className={"CRXModal __Crx__Share__asset"}
		  modelOpen={openAssetLink}
		  onClose={() => setOpenAssetLink(false)}
		  defaultButton={false}
		  indicatesText={true}
		  showSticky={true}
		>
		  <AssetLinkConfirm 
			filterValue={filterValue}
			rowData={row}
			items={selectedItems}
			setRemovedOption={(e: any) => { }}
			setOnClose={() => setOpenAssetLink(false)}
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
		  />
		</CRXModalDialog>
		<CRXModalDialog
		  maxWidth="lg"
		  title={t("Please_Confirm")}
		  className={"CRXModal __Crx__Share__asset"}
		  modelOpen={openAssetMove}
		  onClose={() => setOpenAssetMove(false)}
		  defaultButton={false}
		  indicatesText={true}
		  showSticky={true}
		>
		  <AssetLinkConfirm
			filterValue={filterValue}
			rowData={row}
			items={selectedItems}
			setRemovedOption={(e: any) => { }}
			setOnClose={() => setOpenAssetMove(false)}
			showToastMsg={(obj: any) => showToastMsg?.(obj)}
		  />
		</CRXModalDialog>
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
			{t("You_are_attempting_to")} <strong> {t("close")}</strong>{" "}
			{t("the")} <strong>{t("'user form'")}</strong>.{" "}
			{t("If_you_close_the_form")},
			{t("any_changes_you_ve_made_will_not_be_saved.")}{" "}
			{t("You_will_not_be_able_to_undo_this_action.")}
			<div className="confirmMessageBottom">
			  {t("Are_you_sure_you_would_like_to")}{" "}
			  <strong>{t("close")}</strong> {t("the_form?")}
			</div>
		  </div>
		</CRXConfirmDialog>

		<CRXConfirmDialog
		  setIsOpen={() => setIsRmvAssetConfModalOpen(false)}
		  onConfirm={RemoveMultipleAssetsConfirm}
		  isOpen={isRmvAssetConfModalOpen}
		  className="userGroupNameConfirm"
		  primary={t("Yes")}
		  secondary={t("Cancel")}
		  text="user group form"
		>
		  <div className="confirmMessage">
			{t("Are_you_sure_you_want_to_delete_all_Assets_from_Bucket")} 
		   
		  </div>
		</CRXConfirmDialog>
		<CRXModalDialog
		  maxWidth="lg"
		  title={t('Assign_to_case')}
		  className={"CRXModal CRXModalAssignToCase"}
		  modelOpen={openAssignToCase}
		  onClose={() => handleAssignToCaseClose()}
		  defaultButton={false}
		>
		  <AssignToCase selectedItems={selectedItems} rowData={row} isCaseOpenedForEvidence={caseOpenedForEvidenceDataRef.current != null}
			selectedCaseData={caseOpenedForEvidenceDataRef.current} showToastMsg={showToastMsg}
			onClose={(refreshGrid?: boolean) => { handleAssignToCaseClose(refreshGrid) }}/>
		</CRXModalDialog>
	  </>
	);
  }
);

export default ActionMenu;
export { downloadExeFileByFileResponse };
