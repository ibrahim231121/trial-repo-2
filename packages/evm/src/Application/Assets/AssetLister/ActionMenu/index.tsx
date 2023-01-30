import React from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import {
  CRXModalDialog,
  CRXAlert,
  CRXConfirmDialog,
  CRXToaster,
} from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Category/FormContainer";
import {
  addAssetToBucketActionCreator,
  removeAssetFromBucketActionCreator,
} from "../../../../Redux/AssetActionReducer";
import AssignUser from "../AssignUser/AssignUser";
import ManageRetention from "../ManageRetention/ManageRetention";
import ShareAsset from "../ShareAsset/ShareAsset";
import { RootState } from "../../../../Redux/rootReducer";
import { useTranslation } from "react-i18next";
import RestrictAccessDialogue from "../RestrictAccessDialogue";
import { AxiosError, AxiosResponse } from "axios";
import SubmitAnalysis from "../SubmitAnalysis/SubmitAnalysis";
import UnlockAccessDialogue from "../UnlockAccessDialogue";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../../utils/urlList";
import { EvidenceAgent, FileAgent } from "../../../../utils/Api/ApiAgent";
import {
  ActionMenuPlacement,
  AssetBucket,
  AssetLockUnLockErrorType,
} from "./types";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { SearchType } from "../../utils/constants";
import Cookies from "universal-cookie";
import { IDecoded } from "../../../../Login/API/auth";
import jwt_decode from "jwt-decode";
import ActionMenuCheckList from "../../../../ApplicationPermission/ActionMenuCheckList";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import {
  AssetRestriction,
  Evidence,
  EvidenceChildSharingModel,
  MetadataFileType,
  PersmissionModel,
  securityDescriptorType,
} from "../../../../utils/Api/models/EvidenceModels";
import { getAssetTrailInfoAsync } from "../../../../Redux/AssetDetailsReducer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { AssetRetentionFormat } from "../../../../GlobalFunctions/AssetRetentionFormat";
import { CheckEvidenceExpire } from "../../../../GlobalFunctions/CheckEvidenceExpire";
import { clearAddGroupedSelectedAssetsActions, clearAllGroupedSelectedAssetsActions } from "../../../../Redux/groupedSelectedAssetsActions";

type Props = {
  row: any;
  selectedItems?: any;
  setSelectedItems?: (obj: any) => void;
  isPrimaryOptionOpen?: boolean;
  asset?: any;
  portal?: boolean;
  showToastMsg?: (obj: any) => void;
  setIsPrimaryOptionOpen?: (obj: boolean) => void;
  actionMenuPlacement: ActionMenuPlacement;
  className?: string
};

type AssetLink = {
  masterId: number,
  assetId: number,
  evidenceId: number
};
type AssetAction = {
  masterId: number,
  assetId: number,
  evidenceId: number,
  actionType: string,
}
type MasterAssetEvidence = {
  masterId: number,
  evidenceId: number
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
    className
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
    const [multiAssetDisabled, setMultiAssetDisabled] =
      React.useState<boolean>(false);
    const [isCategoryEmpty, setIsCategoryEmpty] =
      React.useState<boolean>(false);
    const [isLockedAccess, setIsLockedAccess] = React.useState<boolean>(false);
    const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
    const [openForm, setOpenForm] = React.useState(false);
    const [isSelectedItem, setIsSelectedItem] = React.useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [assetlinks, setAssetLinks] = React.useState<AssetLink[]>([]);

    const [assetLockUnLockError, setAssetLockUnLockError] =
      React.useState<AssetLockUnLockErrorType>({
        isError: false,
        errorMessage: "",
      });
    const { AssignedGroups, UserId }: IDecoded = jwt_decode(
      cookies.get("access_token")
    );
    const [securityDescriptorsArray, setSecurityDescriptorsArray] =
      React.useState<Array<SearchModel.SecurityDescriptor>>([]);
    const [openAssignUser, setOpenAssignUser] = React.useState(false);
    const [openManageRetention, setOpenManageRetention] = React.useState(false);
    const [openAssetShare, setOpenAssetShare] = React.useState(false);
    const [openAssetAction, setOpenAssetAction] = React.useState<AssetAction[]>([]);

    const [openSubmitAnalysis, setOpenSubmitAnalysis] = React.useState(false);
    const [openRestrictAccessDialogue, setOpenRestrictAccessDialogue] =
      React.useState(false);
    const [openUnlockAccessDialogue, setOpenUnlockAccessDialogue] =
      React.useState(false);
    const [filterValue, setFilterValue] = React.useState<any>([]);
    const [IsformUpdated, setIsformUpdated] = React.useState(false);
    const [selectedMaster, setSelectedMaster] = React.useState<MasterAssetEvidence[]>();

    const [selectedChild, setSelectedChild] = React.useState<EvidenceChildSharingModel[]>([]);
    const [isMultiSelectEvidenceExpired, setIsMultiSelectEvidenceExpired] =
      React.useState(false);

    const [isAssetLinkedOrMoved, setisAssetLinkedOrMoved] = React.useState<string>("");
    const EXPORT_ASSETS_AND_METADATA_PERMISSION = 60;
    React.useEffect(() => {
    }, [groupedSelectedAssetsActions])
    React.useEffect(() => {
      if (row == undefined && selectedItems != null) {
        let masterIds: MasterAssetEvidence[] = [];
        selectedItems.map((obj: any) => {
          masterIds.push({
            masterId: obj.assetId,
            evidenceId: obj.evidence.id,
          });
        });

        setSelectedMaster(masterIds);
      }

      calculateSecurityDescriptor();
      if (selectedItems.length > 1) {
        setMultiAssetDisabled(true);
      } else {
        setMultiAssetDisabled(false);
      }
      if (selectedItems.length > 0) {
        setIsSelectedItem(true);
      } else {
        setIsSelectedItem(false);
      }
      // Check for Lock property in Evidence response, to show message in Action Menu Item.
      if (row?.evidence?.masterAsset?.lock) {
        setIsLockedAccess(true);
      } else {
        setIsLockedAccess(false);
      }
      /**
       ** Category Window Depends on Evidence Response Provided from Parent Element,
       ** as response is different for every screen,
       ** we need to check from which screen action menu is opened.
       */
      if (actionMenuPlacement === ActionMenuPlacement.AssetLister) {
        if (row?.categories.length == 0) {
          setIsCategoryEmpty(true);
        }

      } else {
        if (row?.evidence.categories.length == 0) {
          setIsCategoryEmpty(true);
        }
      }
      if (row?.onlyforlinkedasset == "link") {
        setisAssetLinkedOrMoved("");

      }
      else if (row?.onlyforlinkedasset == "move") {
        setisAssetLinkedOrMoved("");

      }
      else {
        setisAssetLinkedOrMoved(groupedSelectedAssetsActions[0]?.actionType?.toString());

      }
    }, [row, selectedItems]);
    React.useEffect(() => {
      if (openAssetAction.length > 0) {
        dispatch(clearAddGroupedSelectedAssetsActions(openAssetAction));
      }

    }, [openAssetAction]);
    React.useEffect(() => {
      let assetsList: AssetLink[] = [];
      groupedSelectedAssets.map((obj: any) => {
        if (obj.isChecked == true) {
          assetsList.push({
            masterId: obj.masterId,
            assetId: obj.assetId,
            evidenceId: obj.evidenceId
          });
        }
      });
      selectedMaster?.map((obj: MasterAssetEvidence) => {
        assetsList.push({
          masterId: obj.masterId,
          assetId: obj.masterId,
          evidenceId: obj.evidenceId
        });
      });
      setAssetLinks(assetsList);
    }, [groupedSelectedAssets]);

    const handleOpenAssignUserChange = () => setOpenAssignUser(true);
    const handleOpenManageRetention = () => setOpenManageRetention(true);
    const handleOpenAssetShare = () => setOpenAssetShare(true);
    const handleOpenAssignSubmission = () => setOpenSubmitAnalysis(true);
    const handlePrimaryAsset = () => setIsPrimaryOptionOpen?.(true);
    const handleChange = () => setOpenForm(true);
    const restrictAccessClickHandler = () =>
      setOpenRestrictAccessDialogue(true);
    const unlockAccessClickHandler = () => setOpenUnlockAccessDialogue(true);

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

    const findMaximumDescriptorId = (
      securityDescriptors: Array<securityDescriptorType>
    ): number => {
      return securityDescriptors.length === 0
        ? 0
        : Math.max.apply(
          Math,
          securityDescriptors.map((o) => {
            return parseInt(PersmissionModel[o.permission], 10);
          })
        );
    };

    const confirmCallBackForRestrictAndUnLockModal = (operation: string) => {
      const _requestBody = [];
      let groupRecIdArray = AssignedGroups.split(",").map((item) => {
        return parseInt(item, 10);
      });
      if (isSelectedItem) {
        selectedItems.map((x: any) => {
          if (x.evidence.masterAsset.lock) {
            _requestBody.push({
              evidenceId: x.id,
              assetId: x.assetId,
              groupRecIdList: groupRecIdArray,
              operation: operation,
            });
          }
        });
      } else {
        _requestBody.push({
          evidenceId: row?.evidence.id,
          assetId: row.assetId,
          groupRecIdList: groupRecIdArray,
          operation: operation,
        });
      }
      const _body = JSON.stringify(_requestBody);
      EvidenceAgent.LockOrUnLockAsset(_body)
        .then(() => {
          showToastMsg && showToastMsg({
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
      if(row !== undefined && row !== null && row.evidence != null && row.evidence.asset !=null && row.evidence.asset.length == 1){// single asset export
      const assetId = row.evidence.asset.find((x: any) => x.assetId === row.assetId)
      const assetFileId = assetId.files.length > 0 ? assetId.files[0].filesId : null;
      if (!assetFileId) {
        showToastMsg?.({
          message: t("There_is_no_File_against_this_Asset"),
          variant: "error",
          duration: 5000,
        });
        return;
      }

      FileAgent.getDownloadFileUrl(assetFileId)
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
      } else if (selectedItems !== undefined && selectedItems !== null){ // multi asset export
              
        let  totalFiles  = selectedItems.map((e:any) => {   
             
          var filesArr  =  e.evidence.asset.map((a:any)  =>{
              var files =   a.files;               
            return files.map((x:any)  => {
                  return { fileRecId: x.filesId, accessCode : "accessCode" };
                 })           
                       
            });   
           
          return filesArr;
        });
        let me = {fileRequest : totalFiles.flat(1).flat(1),operationType : 1 }        
        showToastMsg?.({
          message: t("files will be downloaded shortly"),
          variant: "success",
          duration: 5000,
        });
        FileAgent.getMultiDownloadFileUrl(me)
        .then((response) => {
        
          downloadExeFileByFileResponse(response,"getacvideo-multidownloader");

        })       
        .catch(() => {
          showToastMsg?.({
            message: t("Unable_to_download_file"),
            variant: "error",
            duration: 5000,
          });
        });
      } else{
        showToastMsg?.({
          message: t("There_is_no_File_against_this_Asset"),
          variant: "error",
          duration: 5000,
        });
      }

    };

    const handleDownloadMetaDataClick = () => {
      /**
       * ! This snippet is only for Asset Lister.
       * ! Since there will be no child asset in lister, so only row data would be extracted.
       * ! For child asset, extract 'selectedItem' prop.
       */
      if (selectedItems.length != 0) {
      }
      const evidenceId = row.evidence.id;
      let assetId: number;
      let assetName: string;
      if (actionMenuPlacement === ActionMenuPlacement.AssetDetail) {
        assetId = row.evidence.asset[0].assetId;
        assetName = row.evidence.asset[0].assetName;
      } else {
        assetId = row.assetId;
        assetName = row.assetName;
      }
      const fileType = MetadataFileType.PDF;
      EvidenceAgent.ExportEvidence(evidenceId, assetId, fileType)
        .then((response) => {
          downloadFileByFileResponse(response, assetName);
        })
        .catch(() => {
          showToastMsg?.({
            message: t("Unable_to_download_response"),
            variant: "error",
            duration: 5000,
          });
        });
    };

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, "0");
    }

    const milliSecondsToTimeFormat = (date: Date) => {
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

    const formatBytes = (bytes: number, decimals: number = 2) => {
      if (!+bytes) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const retentionSpanText = (holdUntil?: Date, expireOn?: Date) => {
      if (holdUntil) {
        return AssetRetentionFormat(holdUntil);
      } else if (expireOn) {
        return AssetRetentionFormat(expireOn);
      }
    };

    const onClickDownloadAssetTrail = async () => {
      if (row) {
        let assetTrail = await getAssetTrail();
        let getAssetData = await getAssetInfo();
        let uploadCompletedOn = await getuploadCompletedOn(
          getAssetData?.assets?.master?.files
        );

        var assetInfo;
        if (getAssetData) {
          let categories: any[] = [];
          getAssetData.categories.forEach((x: any) => {
            x.formData.forEach((y: any) => {
              let formDatas: any[] = [];
              y.fields.map((z: any) => {
                let formData = {
                  key: z.key,
                  value: z.value,
                };
                formDatas.push(formData);
              });
              categories.push({
                name: y.name,
                formDatas: formDatas,
              });
            });
          });

          var owners: any[] = getAssetData.assets.master.owners.map(
            (x: any) =>
              x.record.find((y: any) => y.key == "UserName")?.value ?? ""
          );

          var unit: number[] = [];
          unit.push(getAssetData.assets.master.unitId);

          var checksum: number[] = [];
          getAssetData.assets.master.files.forEach((x: any) => {
            checksum.push(x.checksum.checksum);
          });

          let size = getAssetData.assets.master.files.reduce(
            (a, b) => a + b.size,
            0
          );

          var categoriesForm: string[] = [];
          getAssetData.categories.forEach((x: any) => {
            categoriesForm.push(x.record.cmtFieldName);
          });

          assetInfo = {
            owners: owners,
            unit: unit,
            capturedDate: moment(getAssetData.createdOn).format(
              "MM / DD / YY @ HH: mm: ss"
            ),
            checksum: checksum,
            duration: milliSecondsToTimeFormat(
              new Date(getAssetData.assets.master.duration)
            ),
            size: formatBytes(size, 2),
            retention:
              retentionSpanText(
                getAssetData.holdUntil,
                getAssetData.expireOn
              ) ?? "",
            categories: categories,
            categoriesForm: categoriesForm,
            id: getAssetData?.assets?.master?.id,
            assetName: getAssetData?.assets?.master?.name,
            typeOfAsset: getAssetData?.assets?.master?.typeOfAsset,
            status: getAssetData?.assets?.master?.status,
            camera: getAssetData?.assets?.master?.camera ?? "",
          };
        }

        let uploadCompletedOnFormatted = uploadCompletedOn
          ? moment(uploadCompletedOn).format("MM / DD / YY @ HH: mm: ss")
          : "";

        //download
        if (assetTrail && assetInfo) {
          downloadAssetTrail(assetTrail, assetInfo, uploadCompletedOnFormatted);
        }
      }
    };

    const getAssetTrail = async () => {
      const evidence = row.evidence;
      return await EvidenceAgent.getAssetTrail(
        `/Evidences/${evidence.id}/AssetTrail`
      ).then((response) => response);
    };

    const getAssetInfo = async () => {
      const evidence = row.evidence;
      return await EvidenceAgent.getEvidence(evidence.id).then(
        (response: Evidence) => response
      );
    };

    const getuploadCompletedOn = async (files: any) => {
      if (files) {
        let uploadCompletedOn;
        for (const file of files) {
          if (file.type == "Video") {
            await FileAgent.getFile(file.filesId).then((response) => {
              uploadCompletedOn = response.history.uploadCompletedOn;
            });
            break;
          }
        }
        return uploadCompletedOn;
      }
    };

    const downloadFileByFileResponse = (
      response: AxiosResponse,
      assetName: string
    ) => {
      let fileStream = response.data;
      const fileName = `${assetName}_Metadata.pdf`;
      const blob = new Blob([fileStream], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
    const downloadExeFileByFileResponse = (
      response: any,
      assetName: string
    ) => {
      let fileStream =  response.data;
      const fileName = assetName+".exe";
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
      // start download.
      link.click();
      // Clean up and remove the link.
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };

    const closeDialog = () => {
      setIsModalOpen(false);
      setOpenManageRetention(false);
      setOpenAssignUser(false);
      history.push(
        urlList.filter((item: any) => item.name === urlNames.assets)[0].url
      );
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
          } else {
            newObject.isMaster = data.masterAssetId === asset.assetId;
            newObject.selectedAssetId = asset.assetId;
          }
          dispatch(addAssetToBucketActionCreator(newObject));
        }
      } else {
        dispatch(addAssetToBucketActionCreator(selectedItems));
      }
    };

    const removeFromAssetBucket = () => {
      //if (row) {

      // For Asset Bucket Top Action Menu
      if (row == undefined && selectedItems.length > 0) {
        dispatch(removeAssetFromBucketActionCreator(selectedItems));
        setSelectedItems && setSelectedItems([])
        return
      }
      // --------------------------------

      const find = selectedItems.findIndex(
        (selected: SearchModel.Asset) => selected.assetId === row.id
      );
      const data = find === -1 ? row : selectedItems;

      dispatch(removeAssetFromBucketActionCreator(data));
      if (find !== -1) {
        setSelectedItems && setSelectedItems([])
        return;
      }
      // }
      else {
        dispatch(removeAssetFromBucketActionCreator(selectedItems));
        setSelectedItems && setSelectedItems([])
        return;
      }
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

        if (data.assetId === row.assetId) addToAssetBucketDisabled = true;
      });
    } else if (selectedItems !== undefined && selectedItems.length > 0) {
      let value = multiCompareAssetBucketData(assetBucketData, selectedItems);
      if (value.includes(false)) addToAssetBucketDisabled = false;
      else addToAssetBucketDisabled = true;
    }

    const downloadAssetTrail = (
      assetTrail: any,
      assetInfo: any,
      uploadedOn: any
    ) => {
      const head = [[t("Seq No"), t("Captured"), t("Username"), t("Activity")]];
      let data: any[] = [];
      let arrS: any[] = [];
      assetTrail.forEach((x: any) => {
        arrS.push(x.seqNo);
        arrS.push(new Date(x.performedOn).toLocaleString());
        arrS.push(x.userName);
        arrS.push(x.notes);
        data.push(arrS);
        arrS = [];
      });

      let CheckSum = assetInfo.checksum ? assetInfo.checksum.toString() : "";
      let assetId = assetInfo.id ? assetInfo.id.toString() : "";

      const doc = new jsPDF();
      doc.setFontSize(11);
      doc.setTextColor(100);
      let yaxis1 = 14;
      let yaxis2 = 70;
      let xaxis = 25;

      doc.text(t("CheckSum") + ":", yaxis1, xaxis);
      doc.text(CheckSum, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Asset Id") + ":", yaxis1, xaxis);
      doc.text(assetId, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Asset Type") + ":", yaxis1, xaxis);
      doc.text(assetInfo.typeOfAsset, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Asset Status") + ":", yaxis1, xaxis);
      doc.text(assetInfo.status, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Username") + ":", yaxis1, xaxis);
      doc.text(assetInfo.owners.join(", "), yaxis2, xaxis);
      xaxis += 5;

      let categoriesString = "";
      let tempxaxis = 0;
      assetInfo.categories.forEach((x: any, index: number) => {
        let formData = x.formDatas.map((y: any, index1: number) => {
          if (index1 > 0) {
            tempxaxis += 5;
          }
          return y.key + ": " + y.value + "\n";
        });
        categoriesString += (x.name ? x.name : "") + ":    " + formData + "\n";
        if (index > 0) {
          tempxaxis += 5;
        }
      });
      doc.text(t("Categories") + ":", yaxis1, xaxis);
      doc.text(categoriesString, yaxis2, xaxis);
      xaxis += tempxaxis + 5;

      doc.text(t("Camera Name") + ":", yaxis1, xaxis);
      doc.text(assetInfo.camera, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Captured") + ":", yaxis1, xaxis);
      doc.text(assetInfo.capturedDate, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Uploaded") + ":", yaxis1, xaxis);
      doc.text(uploadedOn, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Duration") + ":", yaxis1, xaxis);
      doc.text(assetInfo.duration, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Size") + ":", yaxis1, xaxis);
      doc.text(assetInfo.size, yaxis2, xaxis);
      xaxis += 5;

      doc.text(t("Retention") + ":", yaxis1, xaxis);
      doc.text(assetInfo?.retention, yaxis2, xaxis);
      xaxis += 5;

      autoTable(doc, {
        startY: xaxis,
        head: head,
        body: data,
        didDrawCell: (data: any) => {
        },
      });
      doc.save("ASSET ID_Audit_Trail.pdf");
    };

    const isEvidenceCategorizedByCurrentUser = () => {
      let categorizedBy: number;
      if (actionMenuPlacement === ActionMenuPlacement.AssetLister)
        categorizedBy = row?.categorizedBy;
      else
        categorizedBy = row?.evidence.categorizedBy;
      if (categorizedBy) {
        if (categorizedBy === Number(UserId))
          return true;
        else
          return false;
      }
      return false;
    }

    const evidenceCategorizedBy = (): number | null => {
      if (row?.evidence) {
        if (row?.evidence.categorizedBy) {
          return Number(row?.evidence.categorizedBy);
        } else {
          return null;
        }
      }
      return null;
    }
    const linkAssetHandler = () => {
      let tempLinkedAssets: AssetAction[] = [];
      if (assetlinks.length > 0) 
      {
        assetlinks.map((x: AssetLink) => {

          tempLinkedAssets.push({
            masterId: x.masterId,
            assetId: x.assetId,
            evidenceId: x.evidenceId,
            actionType: "link"
          });

        });
      }
      else
      {
        tempLinkedAssets.push({
          masterId: row.evidence.masterAssetId,
          assetId: row.assetId,
          evidenceId: row.evidence.id,
          actionType: "link"
        });
      }
      setOpenAssetAction(tempLinkedAssets);

    }
    const linkToAssetHandler = () => {
      let tempLinkedAssets: AssetAction[] = [];
      dispatch(clearAllGroupedSelectedAssetsActions());

    }
    const moveAssetHandler = () => {
      let tempLinkedAssets: AssetAction[] = [];
      if (assetlinks.length > 0) 
      {
      assetlinks.map((x: AssetLink) => {
        tempLinkedAssets.push({
          masterId: x.masterId,
          assetId: x.assetId,
          evidenceId: x.evidenceId,
          actionType: "move"
        });
      });
    }
    else
    {
      tempLinkedAssets.push({
        masterId: row.evidence.masterAssetId,
        assetId: row.assetId,
        evidenceId: row.evidence.id,
        actionType: "move"
      });
    }
      setOpenAssetAction(tempLinkedAssets);

    }
    const moveToAssetHandler = () => {
      let tempLinkedAssets: AssetAction[] = [];
      dispatch(clearAllGroupedSelectedAssetsActions());

    }
    return (
      <>
        <FormContainer
          setOpenForm={() => setOpenForm(false)}
          openForm={openForm}
          evidenceId={row?.evidence.id}
          isCategoryEmpty={isCategoryEmpty}
          setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
          categorizedBy={evidenceCategorizedBy()}
        />

        <Menu
          key="right"
          align="center"
          viewScroll="close"
          direction="right"
          position="auto"
          offsetX={25}
          offsetY={12}
          onItemClick={(e) => (e.keepOpen = true)}
          className="menuCss mainListerAction"
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
          <MenuItem>
            <ActionMenuCheckList
              moduleId={0}
              descriptorId={2}
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
            </ActionMenuCheckList>
          </MenuItem>

          {actionMenuPlacement == ActionMenuPlacement.AssetBucket && (
            <MenuItem>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={removeFromAssetBucket}
              >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  {`${t("Remove_from_asset_bucket")}`}
                </div>
              </div>
            </MenuItem>
          )}

          {isCategoryEmpty ? (
            <MenuItem>
              <ActionMenuCheckList
                moduleId={2}
                descriptorId={4}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Categorize")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
                isCategorizedByCheck={true}
                isCategorizedBy={isEvidenceCategorizedByCurrentUser()}
              >
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="fa-regular fa-clipboard-list-check"></i>
                  </div>
                  <div className="crx-menu-list">{t("Categorize")}</div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          ) : (
            <MenuItem>
              <ActionMenuCheckList
                moduleId={3}
                descriptorId={4}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Edit_category_and_form")}
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
                    {t("Edit_category_and_form")}
                  </div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          )}

          {isPrimaryOptionOpen && (
            <MenuItem>
              <ActionMenuCheckList
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
          )}

          <MenuItem>
            <ActionMenuCheckList
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

          <MenuItem>
            <ActionMenuCheckList
              moduleId={0}
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
          </MenuItem>

          {multiAssetDisabled === false ? (
            <MenuItem>
              <ActionMenuCheckList
                moduleId={0}
                descriptorId={3}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Submit_for_analysis")}
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
                    {t("Submit_for_analysis")}
                  </div>
                </div>
              </ActionMenuCheckList>
            </MenuItem>
          ) : null}

          <MenuItem>
            <ActionMenuCheckList
              moduleId={0}
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
                moduleId={0}
                descriptorId={2}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Link_asset")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content crx-spac"
                  onClick={linkAssetHandler}
                >
                  <div className="crx-menu-icon">
                    <i className="far fa-user-lock fa-md"></i>
                  </div>

                  <div className="crx-menu-list">{t("Link_asset")}</div>

                </div>
              </ActionMenuCheckList>
            </MenuItem>
          
          {actionMenuPlacement == ActionMenuPlacement.DetailedAssets ? (
            <MenuItem>
              <ActionMenuCheckList
                moduleId={0}
                descriptorId={2}
                maximumDescriptor={maximumDescriptor}
                evidence={row?.evidence}
                actionMenuName={t("Move_asset")}
                securityDescriptors={securityDescriptorsArray}
                isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
              >
                <div
                  className="crx-meu-content crx-spac"
                  onClick={moveAssetHandler}
                >
                  <div className="crx-menu-icon">
                    <i className="far fa-user-lock fa-md"></i>
                  </div>

                  <div className="crx-menu-list">{t("Move_asset")}</div>

                </div>
              </ActionMenuCheckList>
            </MenuItem>
          ) : null}
          {actionMenuPlacement == ActionMenuPlacement.AssetLister
            && groupedSelectedAssetsActions.length > 0
            //&& selectedAssetActionType == "link" 
            && isAssetLinkedOrMoved == "link"
            ? (

              <MenuItem>
                <ActionMenuCheckList
                  moduleId={0}
                  descriptorId={2}
                  maximumDescriptor={maximumDescriptor}
                  evidence={row?.evidence}
                  actionMenuName={t("Link_to_this_group")}
                  securityDescriptors={securityDescriptorsArray}
                  isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
                >
                  <div
                    className="crx-meu-content crx-spac"
                    onClick={linkToAssetHandler}
                  >
                    <div className="crx-menu-icon">
                      <i className="far fa-user-lock fa-md"></i>
                    </div>

                    <div className="crx-menu-list">{t("Link_to_this_group")}</div>

                  </div>
                </ActionMenuCheckList>
              </MenuItem>
            ) : null
          }
          {actionMenuPlacement == ActionMenuPlacement.AssetLister
            && groupedSelectedAssetsActions.length > 0
            //&& selectedAssetActionType == "move" 
            && isAssetLinkedOrMoved == "move"
            ? (
              <MenuItem>
                <ActionMenuCheckList
                  moduleId={0}
                  descriptorId={2}
                  maximumDescriptor={maximumDescriptor}
                  evidence={row?.evidence}
                  actionMenuName={t("Move_to_this_group")}
                  securityDescriptors={securityDescriptorsArray}
                  isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
                >
                  <div
                    className="crx-meu-content crx-spac"
                    onClick={moveToAssetHandler}
                  >
                    <div className="crx-menu-icon">
                      <i className="far fa-user-lock fa-md"></i>
                    </div>

                    <div className="crx-menu-list">{t("Move_to_this_group")}</div>

                  </div>
                </ActionMenuCheckList>
              </MenuItem>
            ) : null}
          <MenuItem>
            <ActionMenuCheckList
              moduleId={35}
              descriptorId={2}
              maximumDescriptor={maximumDescriptor}
              evidence={row?.evidence}
              actionMenuName={t("Export")}
              securityDescriptors={securityDescriptorsArray}
              isMultiSelectEvidenceExpired={isMultiSelectEvidenceExpired}
            >
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <SubMenu label={t("Export")}>
                    {!CheckEvidenceExpire(row?.evidence) ? (
                      <MenuItem onClick={() => {
                        handleDownloadAssetClick()
                      }}>
                        {t("Download_asset(s)")}
                      </MenuItem>
                    ) : null}
                    <MenuItem onClick={handleDownloadMetaDataClick}>
                      {t("Download_metadata_info")}
                    </MenuItem>
                    {!CheckEvidenceExpire(row?.evidence) ? (
                      <MenuItem onClick={onClickDownloadAssetTrail}>
                        {t("Download_audit_trail")}
                      </MenuItem>
                    ) : null}
                  </SubMenu>
                </div>
              </div>
            </ActionMenuCheckList>
          </MenuItem>

          {isLockedAccess ? (
            <MenuItem>
              <ActionMenuCheckList
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
          ) : (
            <MenuItem>
              <ActionMenuCheckList
                moduleId={0}
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
          title={t("Assign_User")}
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
          title={t("Modify_Retention")}
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
          title={t("Share_Asset")}
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
            items={assetlinks} //{selectedItems}
            setRemovedOption={(e: any) => { }}
            setOnClose={() => setOpenAssetShare(false)}
            showToastMsg={(obj: any) => showToastMsg?.(obj)}
          />
        </CRXModalDialog>

        <CRXModalDialog
          maxWidth="lg"
          title={t("Submit_For_Analysis")}
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
      </>
    );
  }
);

export default ActionMenu;
