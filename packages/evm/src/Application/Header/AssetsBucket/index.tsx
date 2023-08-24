import React, { useEffect, useState, useRef, useContext } from "react";
import {
  CRXDrawer,
  CRXRows,
  CRXColumn,
  CRXAlert,
  CRXBadge,
  CRXTooltip,
  CRXRootRef,
  CRXProgressBar,
  CRXToaster,
  CrxAccordion,
  CRXConfirmDialog,
  CRXButton,
  CRXCheckBox,
} from "@cb/shared";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { AssetThumbnail } from "../../Assets/AssetLister/AssetDataTable/AssetThumbnail";
import {
  SearchObject,
  HeadCellProps,
  onTextCompare,
  onMultiToMultiCompare,
} from "../../../GlobalFunctions/globalDataTableFunctions";
import multitextDisplay from "../../../GlobalComponents/Display/MultiTextDisplay";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { ActionMenuPlacement, AssetBucket } from "../../Assets/AssetLister/ActionMenu/types";
import {
  updateDuplicateFound,
  loadFromLocalStorage,
} from "../../../Redux/AssetActionReducer";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { NotificationMessage } from "../CRXNotifications/notificationsTypes";
import {
  AddFilesToFileService,
  getFileSize,
  resumeFileUpload,
} from "../../../GlobalFunctions/FileUpload";
import { CRXModalDialog } from "@cb/shared";
import AddMetadataForm from "./AddMetadataForm";
import Cookies from "universal-cookie";
import { EVIDENCE_SERVICE_URL, FILE_SERVICE_URL_V2 } from "../../../utils/Api/url";
import Restricted from "../../../ApplicationPermission/Restricted";
import { FileAgent } from "../../../utils/Api/ApiAgent";
import "./overrideMainBucket.scss";
import ActionMenu from "../../Assets/AssetLister/ActionMenu";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { setAssetBucketBasket } from "../../../Redux/assetBucketBasketSlice";
import { Link } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";
import { CRXTruncation } from "@cb/shared";
import { AssetDetailRouteStateType } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import DetailedAssetPopup from "../../Assets/AssetLister/AssetDataTable/DetailedAssetPopup";
import { FileUploadInfo, isBucket } from "./CRXAssetsBucketPanelTypes";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from "@material-ui/core";
declare const window: any;
window.URL = window.URL || window.webkitURL;
const cookies = new Cookies();

const thumbTemplate = (assetId: string, evidence: SearchModel.Evidence) => {
  let { assetType, assetName } = evidence.masterAsset;
  let fileType = evidence.masterAsset?.files[0]?.type;
  let accessCode = evidence.masterAsset?.files[0]?.accessCode;
  return (
    <AssetThumbnail assetName={assetName} assetType={assetType} fileType={fileType} accessCode={accessCode} fontSize="61pt" />
  );
};

const useCricleStyle = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },

  circle: {
    strokeLinecap: 'round',
    color: '#c34400',
  },
}));

const usePrevious = (value: any) => {
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const CRXAssetsBucketPanel = ({ isOpenBucket, isGuestUser }: isBucket) => {
  const dispatch = useDispatch();
  const checkBoxRef = useRef(null);
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const { getModuleIds } = useContext(ApplicationPermissionContext);
  const RestrictEffectOccured = useSelector((state: RootState) => state.ActionMenuEffectSlice.RestrictEffect);
  const [activeScreen, setActiveScreen] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenMeta, setIsOpenMeta] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChecked, setChecked] = useState<any>([]);
  const [isCheckedAll, setCheckedAll] = useState<boolean>(false);
  const [, setIsEvidenceUploaded] = useState<boolean>(true)
  const dataTableStickyPos = document.querySelector(".CRXAppBar");
  const isDuplicateFound: boolean = useSelector(
    (state: RootState) => state.assetBucket.isDuplicateFound
  );
  const [selectedItems, setSelectedItems] = useState<SearchModel.Asset[]>(
    []
  );
  const [rows, setRows] = useState<AssetBucket[]>(assetBucketData);
  const { t } = useTranslation<string>();
  const [searchData,] = useState<SearchObject[]>([]);
  const [, setScroll] = useState("");
  const [mainProgressError, setMainProgressError] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [onAddEvidence, setonAddEvidence] = useState<boolean>(false);
  const [onSaveEvidence, setonSaveEvidence] = useState<number>(0);
  const [isCheckTrue, setIsCheckTrue] = useState<boolean>(false);
  const [success,] = useState<{ msg: string }>({
    msg: "",
  });
  const [attention, setAttention] = useState<{ msg: string }>({
    msg: "",
  });
  const [showMessageClx, setShowMessageClx] = useState<string>("bucketMessageHide");
  const [showAttention, setShowAttention] = useState<boolean>(false);
  const [showUploadAttention, setShowUploadAttention] = useState<boolean>(false);
  const prevCount = usePrevious(assetBucketData.length);
  const prevIsDuplicate = usePrevious(isDuplicateFound);
  const [fileCount, setFileCount] = useState<number>(0);
  const fileCountRef = useRef(fileCount);
  const [files, setFiles] = useState<any[]>([]);
  const [totalFileSize, setTotalFileSize] = useState<string>("");
  const [showWifiIcon, setShowWifiIcon] = useState<boolean>(false);
  const [uploadInfo, setUploadInfo] = useState<FileUploadInfo[]>([]);
  const [totalFilePer, setTotalFilePer] = useState<any>(0);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [expanded, isExpaned] = useState<string | boolean>();
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const [isSubProgressBarOpen, setIsSubProgressBarOpen] = useState<boolean>(false);
  const [isMainProgressBarOpen, setIsMainProgressBarOpen] = useState<boolean>(false);
  const [isMetaDataOpen, setIsMetaDataOpen] = useState<boolean>(false);
  const [isFileUploadHide, setIsFileUploadHide] = useState<boolean>(false);
  const [isFileUploadingStart, setIsFileUploadingStart] = useState<boolean>(false);
  const [fileToRemove, setFileToRemove] = useState<string>("");
  const [isMessageRedisplay, setMessageRedisplay] = useState<boolean>(false);
  const [IsformUpdated, setIsformUpdated] = useState(false);
  let userId = localStorage.getItem('User Id');
  const [headCells,] = useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: true,
      searchFilter: true,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      maxWidth: "100",
    },
    {
      label: t("Asset_Thumbnail"),
      id: "assetType",
      align: "left",
      minWidth: "80",
      maxWidth: "100",
      dataComponent: (event: any, evidence: any) =>
        thumbTemplate(event, evidence),
      detailedDataComponentId: "evidence",
    },
    {
      label: t("Category"),
      id: "categories",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      minWidth: "100",
      maxWidth: "100",
    },
  ]);
  const isViewAssetPermission = getModuleIds().includes(1);
  const bucketIconByState = isViewAssetPermission && assetBucketData.length > 0 ? "icon-drawer" : "icon-drawer2";
  const totalAssetBucketCount = isViewAssetPermission ? assetBucketData.length + fileCount : 0 + fileCount;
  window.onbeforeunload = () => {
    if (window.TotalFilePer != 0 && window.TotalFilePer < 100) {
      return "";
    }
  };
  let firstExecution = 0; // Store the first execution time
  const interval = 7000; // 7 seconds
  //Error message system administrator
  const [errorMsg, setErrorMsg] = useState<any>({
    msg: "",
    type: "",
  });
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [errorMsgClass, setErrorMsgClass] = useState<string>(
    "erroMessageContainerHide"
  );

  useEffect(() => {
    // on load check asset bucket exists in local storage
    if (isGuestUser == false) {
      dispatch(loadFromLocalStorage());
    }

    setCheckedAll(false);
    const uploadItem = JSON.parse(localStorage.getItem("uploadedFiles_" + userId) || "[]");
    uploadInfoFromLocalStorage(uploadItem);
    if (uploadItem.length > 0) {
      setMessageRedisplay(true);
    }
    window.onRecvBucketData = new CustomEvent("onUploadStatusUpdate");
    window.onRecvError = new CustomEvent("onUploadError");
    window.addEventListener("onUploadStatusUpdate", uploadStatusUpdate);
    window.addEventListener("onUploadError", uploadError);
    const trAtiveValue = document
      .querySelector(".rc-menu--open")
      ?.closest("tr[class*='MuiTableRow-hover-']");

    let dataui = document.querySelectorAll("tr[class*='MuiTableRow-root-']");
    let trAtiveArray = Array.from(dataui);
    trAtiveArray.forEach((e) => {
      if (e.classList.contains("SelectedActionMenu")) {
        e.classList.remove("SelectedActionMenu");
      } else {
        trAtiveValue?.classList.add("SelectedActionMenu");
      }
    });
  }, [RestrictEffectOccured]);//NOTE: Added this dependency, to restart the component. It will run for the first time, and each time when ever there is event fired from ActionMenu.

  useEffect(() => {
    if (isOpen)
      dataTableStickyPos?.classList.add("dataTableStickyPos");
    else
      dataTableStickyPos?.classList.remove("dataTableStickyPos");
    dispatch(setAssetBucketBasket({ isOpen: isOpen }));
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(isOpenBucket);
  }, [isOpenBucket]);

  useEffect(() => {
    if (
      isDuplicateFound != prevIsDuplicate &&
      prevIsDuplicate != undefined &&
      isDuplicateFound !== false
    ) {
      setAttention({
        msg: t(
          "An_asset_you_are_attempting_to_add_to_the_asset_bucket_has_already_been_added."
        ),
      });
      setShowMessageClx("bucketMessageShow");
      setShowAttention(true);

      dispatch(updateDuplicateFound());
    }
  }, [isDuplicateFound]);

  const alertMessage = () => {

    if (window.Timer == null) {
      window.time = new Date().getTime()
      showToastMsg()

      window.Timer = setInterval(function () {
        window.clearInterval(window.Timer);
      }, 7000);
    } else if (((new Date()).getTime() - window.time) / 1000 > 7) {
      window.clearInterval(window.Timer);
      window.Timer = null;
    }
  }

  useEffect(() => {
    setRows(assetBucketData);
    assetBucketData.forEach((x: any) => {
      isChecked[x.assetId] = false;
    });
    setCheckedAll(false);
    let local_assetBucket: any = localStorage.getItem("assetBucket");
    let isBucket: any =
      localStorage.getItem("isBucket") !== null
        ? localStorage.getItem("isBucket")
        : "False";

    if (
      local_assetBucket !== null &&
      local_assetBucket.length != 0 &&
      prevCount == 0 &&
      assetBucketData.length > prevCount &&
      isBucket == "True"
    ) {
      localStorage.setItem("isBucket", "False");
      // showToastMsg();
      alertMessage();
    } else if (assetBucketData.length > prevCount && isBucket == "True") {
      localStorage.setItem("isBucket", "False");
      // showToastMsg();
      alertMessage();
    } else if (assetBucketData.length < prevCount) {
      const totalRemoved = prevCount - assetBucketData.length;
      toasterRef.current.showToaster({
        message: `${totalRemoved} ${totalRemoved > 1 ? t("assets") : t("asset")} ${t("removed_the_asset_bucket")}`,
        variant: "success",
        duration: 7000,
      });

      const notificationMessage: NotificationMessage = {
        title: t("Asset_Lister"),
        message: `${totalRemoved} ${totalRemoved > 1 ? t("assets") : t("asset")} ${t("removed_the_asset_bucket")}`,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [assetBucketData]);

  useEffect(() => {
    let dataRows: AssetBucket[] = assetBucketData;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (["categories"].includes(el.columnName))
        dataRows = onMultiToMultiCompare(dataRows, headCells, el);
    });
    setRows(dataRows);
  }, [searchData]);

  useEffect(() => {
    const windowSize = window.screen.height;
    if (windowSize < 1080 && rows.length < 3) {
      setScroll("hideScroll");
    } else if (windowSize >= 1080 && rows.length < 4) {
      setScroll("hideScroll");
    } else {
      setScroll("");
    }
  }, [rows, success]);

  useEffect(() => {
    if (success.msg !== undefined && success.msg !== "") {
      const notificationMessage: NotificationMessage = {
        title: t("Asset_Bucket"),
        message: success.msg,
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [success]);

  useEffect(() => {
    if (attention.msg !== undefined && attention.msg !== "") {
      const notificationMessage: NotificationMessage = {
        title: t("Asset_Bucket"),
        message: attention.msg,
        type: "info",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [attention]);

  useEffect(() => {
    setIsFileUploadingStart(true);
    let totalPercentage = 0;
    let eCount = 0;
    if (totalFilePer === 100 && files.length == 0) {
      setUploadInfo([]);
      setFiles([]);
      setTotalFilePer(0);
      window.TotalFilePer = 0;
    }

    uploadInfo.forEach((x) => {
      if (x.uploadInfo.removed != true) {
        totalPercentage = totalPercentage + x.uploadInfo.uploadValue;
      }
      if (x.uploadInfo.error == true) {
        eCount++;
      }
      if (x.uploadInfo.removed) {
        //if file is remove, then remove from uploadinfo state
        setUploadInfoRemoveCase(x.fileName);
      }
    });

    if (totalPercentage == 0 && fileCountRef.current == 0) {
      setIsMetaDataOpen(false);
      setShowUploadAttention(false);
    }
    if (totalPercentage != 0 && fileCountRef.current != 0) {
      let totalPer = Math.round(totalPercentage / fileCountRef.current);
      setTotalFilePer(totalPer);
      totalPercentage = totalPer;
      window.TotalFilePer = totalPer;
    }

    if (eCount == fileCount && eCount != 0 && fileCount != 0) {
      setMainProgressError(true);
    } else {
      setMainProgressError(false);
    }
    //in any error show badge
    setErrorCount(eCount);

    if (uploadInfo.length > 0 && totalFilePer < 100) {
      if (!isCheckTrue) {
        setIsMetaDataOpen(true);
        setShowUploadAttention(true);
        // setFileCount(files.length)
      }
      if (!onAddEvidence && fileCount > 0) {
        setIsMainProgressBarOpen(true);
        setIsSubProgressBarOpen(true);
        // setFileCount(files.length)
      }

      uploadInfo.forEach((x: any) => {
        if (x.isPause) {
          setIsMetaDataOpen(false);
        }
      })

      //this is the case of auto retry if any error occur
      if (eCount > 0 && window.Timer == null) {
        window.Timer = setInterval(function () {
          FileAgent.getHealthCheck()
            .then((response: any) => {
              if (response == true) {
                setShowWifiIcon(true);
                uploadInfo.forEach((x) => {
                  if (x.uploadInfo.error == true) {
                    resumeFile(x);
                  }
                });
                window.clearInterval(window.Timer);
              }
            })
            .catch((ex: any) => { });
        }, 5000);
      } else if (eCount == 0) {
        window.clearInterval(window.Timer);
        window.Timer = null;
      }
    }

    if (uploadInfo.length > 0 && totalPercentage == 100) {
      if (isCheckTrue) {
        setIsMetaDataOpen(false);
        if (onSaveEvidence > 0) {
          files.forEach((x: any) => {
            onUploadingComplete(onSaveEvidence, x.uploadedFileName)
          })
          setonSaveEvidence(0);
          //setFiles([]);
        }
        setFiles([])
        setUploadInfo([])
        window.evidenceUploaded = true
      }
      else {
        setIsMetaDataOpen(true);
        setIsMainProgressBarOpen(true);
        setShowUploadAttention(true);
      }
    }

  }, [uploadInfo]);

  useEffect(() => {
    // This case execute when there is a delay in response from evidence and the progress bar reaches to 100%
    if (onSaveEvidence > 0 && totalFilePer == 100) {
      files.map((x: any) => {
        onUploadingComplete(onSaveEvidence, x.uploadedFileName);
      })
    }
  }, [onSaveEvidence])

  useEffect(() => {
    if (totalFilePer === 100) {
      if (!isMessageRedisplay) {
        toasterRef.current.showToaster({
          message: t("File(s) uploaded"),
          variant: "success",
          duration: 7000,
          className: "upload_file_success",
          clearButtton: true,
        });
      }
      
      if (isCheckTrue) {
        setIsMainProgressBarOpen(false);
        setIsFileUploadHide(false);
        setShowUploadAttention(true)
        setIsSubProgressBarOpen(false);
        setIsCheckTrue(false);
        setFileCount(0);
        setTotalFilePer(0);
        window.TotalFilePer = 0;
      } else {
        setIsFileUploadHide(false);
        setShowUploadAttention(true)
      }
      if (!onAddEvidence) {
        setIsFileUploadHide(false);
        setShowUploadAttention(true)
      }
    }

    if (uploadInfo.length > 0 && totalFilePer < 100) {
      if (!isCheckTrue) {
        setFileCount(files.length);
      }
      if (!onAddEvidence) {
        setFileCount(files.length);
      }
    }

  }, [totalFilePer]);

  useEffect(() => {
    if (isCheckTrue) {
      setIsMetaDataOpen(false);
      setShowUploadAttention(false);
    }
  }, [isCheckTrue]);

  useEffect(() => {
    if (onAddEvidence) {
      toasterRef.current.showToaster({
        message: t("Asset(s) saved"),
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
      window.EvidenceSaved = true
      localStorage.removeItem("uploadedFiles_" + userId);
      setIsEvidenceUploaded(false);
      setIsMetaDataOpen(false);
      setShowUploadAttention(false);
      setonAddEvidence(false);
      setIsMainProgressBarOpen(false);
      setIsSubProgressBarOpen(false);

      setIsFileUploadHide(true);
      if (totalFilePer == 100) {
        setIsFileUploadHide(false);
        if (onAddEvidence) {
          setFiles([]);
          setUploadInfo([]);
          setTotalFilePer(0);
          window.TotalFilePer = 0;
        }
        setFileCount(0);
      } else {
        setIsCheckTrue(true);
      }
      //if evidence added then remove entry from local storage
      localStorage.removeItem("uploadedFiles_" + userId);
    }
  }, [onAddEvidence]);

  useEffect(() => {
    let fileSize: number = 0;
    for (let i = 0; i < files.length; i++) {
      fileSize = fileSize + files[i].size;
    }
    setTotalFileSize(getFileSize(fileSize));
  }, [files]);

  useEffect(() => {
    const setSelectFill = [...selectedItems];
    assetBucketData.forEach((element: any) => {
      setSelectFill.push(element);
    });
    if (isCheckedAll)
      setSelectedItems(setSelectFill);
  }, [isCheckedAll]);

  useEffect(() => {
    setTimeout(() => {
      setShowWifiIcon(false);
    }, 10000);
  }, [showWifiIcon == true]);

  const onFileUploadErrorBdage = () => {
    return (
      <>
        <div className="errorBadge">
          <span>!</span>
          <CRXTooltip
            className="bucketIcon"
            title={t(
              "Asset_Bucket_can_be_used_to_build_cases_and_do_one_action_on_many_assets_at_the_same_time."
            )}
            iconName={"fas " + bucketIconByState}
            placement="left"
            arrow
            id="bucket_tooltip_asset_1"
          ></CRXTooltip>
        </div>
      </>
    );
  };

  const showToastMsg = () => {
    toasterRef.current.showToaster({
      message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
      variant: "success",
      duration: 7000,
      clearButtton: true,
    });

    const notificationMessage: NotificationMessage = {
      title: t("Asset_Lister"),
      message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
      type: "success",
      date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss"),
    };
    dispatch(addNotificationMessages(notificationMessage));
  };

  const ToggleButton = errorCount > 0 ? (
    onFileUploadErrorBdage()
  ) : (
    <CRXBadge itemCount={totalAssetBucketCount} color="primary">
      <CRXTooltip
        className="bucketIcon bucketIcon_tooltip"
        title={t(
          "Asset_Bucket_can_be_used_to_build_cases_and_do_one_action_on_many_assets_at_the_same_time."
        )}
        iconName={"fas " + bucketIconByState}
        placement="left"
        id="bucket_tooltip_asset_2"
        arrow={true}
      ></CRXTooltip>
    </CRXBadge>
  );

  const toggleState = () => setIsOpen((prevState: boolean) => !prevState);

  const uploadInfoFromLocalStorage = (uploadItem: any) => {
    if (uploadItem.length > 0) {
      let totalPercentage = 0;
      let files: any[] = [];
      window.tasks = window.tasks || [];
      let uploadInfo: FileUploadInfo[] = [];

      uploadItem.map((x: any) => {
        let loadedBytes = x.blockIds
          .map((y: any) => y.loadedBytes)
          .reduce((partialSum: number, a: number) => partialSum + a, 0);

        let _uploadInfo: FileUploadInfo;
        _uploadInfo = {
          fileName: x.fileName,
          fileId: x.file.uploadedFileId,
          accessCode: x.file.accessCode,
          isCompleted: loadedBytes == x.file.size,
          state: x.file.state,
          uploadInfo: {
            uploadValue: Math.round(
              (Math.ceil(loadedBytes) / x.file.size) * 100
            ),
            uploadText: x.fileName,
            uploadFileSize:
              getFileSize(loadedBytes) + " of " + getFileSize(x.file.size),
            error: false,
            removed: false,
          },
          isPause: false,
        };
        uploadInfo.push(_uploadInfo);
        totalPercentage =
          totalPercentage +
          Math.round((Math.ceil(loadedBytes) / x.fileSize) * 100);
        files.push(x.file);

        window.tasks[x.fileName] = {};
        window.tasks[x.fileName].file = x.file;
        window.tasks[x.fileName].blockIds = x.blockIds;
      });
      setUploadInfo(uploadInfo);
      setFileCount(uploadItem.length);
      fileCountRef.current = uploadItem.length;
      setTotalFilePer(Math.round(totalPercentage / uploadItem.length));
      window.TotalFilePer = Math.round(totalPercentage / uploadItem.length);
      setFiles(files);
      setIsSubProgressBarOpen(true);
    }
  }

  const emptyfileOnClick = async (e: any) => {
    e.target.value = null;
  }

  const removeExtension = (filename: string) => {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  }

  const handleOnUpload = async (e: any) => {

    setIsFileUploadingStart(false);
    window.evidenceUploaded = false
    window.EvidenceSaved = false
    setIsEvidenceUploaded(false);
    setMessageRedisplay(false);
    let av = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let fileName = e.target.files[i].name.replaceAll(" ", "_");
      if (e.target.files[i].size <= 10) {
        toasterRef.current.showToaster({
          message: t("File_Size_Must_Be"),
          variant: "error",
          duration: 7000,
          clearButtton: true,
        });
        return false;
      }

      if (fileName.length < 3 || fileName.length > 128) {
        toasterRef.current.showToaster({
          message: t("Minimum_3_and_maximum_128_characters_are_allowed"),
          variant: "error",
          duration: 7000,
          clearButtton: true,
        });
        return false;
      } else {
        fileName = removeExtension(fileName);
        let pattern = new RegExp("^([a-zA-Z0-9._-]){1}[A-Za-z0-9._-]*$");
        if (!pattern.test(fileName)) {
          toasterRef.current.showToaster({
            message: t(
              "Error_File_name_is_invalid_please_use_only_alphanumeric_and_dot_dash_Underscore_characters",
            ),
            variant: "error",
            duration: 7000,
            clearButtton: true,
          });
          setIsFileUploadingStart(true);
          return false;
        }

      }

      //for getting duration
      let fileNameExtension = e.target.files[i].name.substring(
        e.target.files[i].name.lastIndexOf("."),
        e.target.files[i].name.length
      );
      if (
        fileNameExtension === ".mp4" ||
        fileNameExtension === ".mp3" ||
        fileNameExtension === ".mkv" ||
        fileNameExtension === ".webm" ||
        fileNameExtension === ".3gp" ||
        fileNameExtension === ".wav"
      ) {
        //wmv and avi does not support by browser
        av.push({ file: e.target.files[i] });
      }
    }

    setFileCount((prev) => {
      fileCountRef.current = prev + e.target.files.length;
      return prev + e.target.files.length;
    });

    for (let i = 0; i < e.target.files.length; i++) {
      e.target.files[i].id = +new Date();
    }

    setFiles((prev) => {
      return [...prev, ...e.target.files];
    });

    AddFilesToFileService(e.target.files, window.onRecvBucketData);
    av.forEach(async (x) => {
      await getDuration(x.file)
        .then
        //duration => console.log("File Duration ", duration)
        ();
    });
  }

  const getDuration = async (file: any) => {
    let videoNode = document.createElement("video");
    videoNode.preload = "metadata";
    let promise = new Promise(function (resolve, reject) {
      videoNode.addEventListener("loadedmetadata", function () {
        file.duration = videoNode.duration;
        resolve(videoNode.duration);
      });
      videoNode.addEventListener("error", function (e) {
        reject("Error");
      });
    });

    const URL = window.URL || window.webkitURL;
    videoNode.src = URL.createObjectURL(file);
    return promise;
  }

  const uploadStatusUpdate = (data: any) => {
    let _uploadInfo: FileUploadInfo;
    setUploadInfo((prevState) => {
      const newUploadInfo = [...prevState];
      const rec = newUploadInfo.find((x) => x.fileName == data.data.fileName);
      if (prevState.length > 0) {
        if (rec != undefined || rec != null) {
          return uploadStatusCase(data, rec, newUploadInfo);
        } else {
          _uploadInfo = getUploadInfo(data)
          return [...prevState, _uploadInfo];
        }
      } else {
        if (window.evidenceUploaded) {
          return prevState
        }
        else {

          _uploadInfo = getUploadInfo(data);
          return [...prevState, _uploadInfo];
        }
      }
    });
  }

  const uploadStatusCase = (
    data: any,
    rec: FileUploadInfo,
    newUploadInfo: FileUploadInfo[]
  ) => {
    if (data.data.error) {
      //Fire Patch request to change the status of File.
      updateStatusOfFile(data.data.fileId, data.data.accessCode);
      onFileUploadError();
      rec.uploadInfo.error = true;
      return [...newUploadInfo];
    }
    if (data.data.removed) {
      rec.uploadInfo.removed = true;
      return [...newUploadInfo];
    }
    const checkValue = () => {
      if (data.data.loadedBytes == data.data.fileSize) {
        if (!window.EvidenceSaved) {
          saveFileToLocalStorage(data.data.fileName)
        }
        return true
      }
      else {
        return false
      }
    }
    rec.fileName = data.data.fileName;
    rec.fileId = data.data.fileId;
    rec.isCompleted = checkValue();
    rec.uploadInfo = {
      uploadValue:
        data.data.percent > rec.uploadInfo.uploadValue
          ? data.data.percent
          : rec.uploadInfo.uploadValue,
      uploadText: data.data.fileName,
      uploadFileSize:
        data.data.percent > rec.uploadInfo.uploadValue
          ? data.data.loadedBytes + " of " + data.data.fileSize
          : rec.uploadInfo.uploadFileSize,
      error: false,
      removed: false,
    };

    return [...newUploadInfo];
  }

  const updateStatusOfFile = (id: string, accessCode: string) => {
    const body = [
      {
        op: "replace",
        path: "state",
        value: "Abandoned",
      },
    ];
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
      body: JSON.stringify(body),
    };
    let url: any = FILE_SERVICE_URL_V2 + `/Files/${id}/${accessCode}`
    fetch(url, requestOptions)
      .then((resp: any) => {
        console.info(resp);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  const onFileUploadError = () => {
    //this function is used for avoiding multiple error message at a time
    let date = new Date();
    let milliseconds = date.getTime();
    if (milliseconds - firstExecution > interval) {
      firstExecution = milliseconds;
      toasterRef.current.showToaster({
        message: t("File(s)_failed_to_upload."),
        variant: "error",
        duration: 7000,
        clearButtton: true,
      });
    }
  }

  const handleClickOpen = () => {
    setIsModalOpen(true);
  }

  const setUploadInfoRemoveCase = (fileName: string) => {
    setUploadInfo((prevState) => {
      if (prevState.length > 0) {
        const newUploadInfo = [...prevState];
        return newUploadInfo.filter((y) => y.fileName != fileName);
      }
      return prevState;
    });
  }

  const onUploadingComplete = async (evidenceId: number, assetName: string) => {

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("access_token")}`,
        TenantId: "1"

      },
    };
    await fetch(
      EVIDENCE_SERVICE_URL + `/Evidences/` + evidenceId + `/Assets/` + assetName + `/UploadingComplete`,
      requestOptions
    );
  }

  const saveFileToLocalStorage = async (fileName: any) => {

    let uploadItem = JSON.parse(localStorage.getItem("uploadedFiles_" + userId) || "[]");
    let index = uploadItem.findIndex((x: any) => x.fileName == fileName);

    let selectedItem = {
      fileName: fileName,
      blockIds: window.tasks[fileName].blockIds,
      file: {
        duration: window.tasks[fileName].file.duration,
        uploadUri: window.tasks[fileName].file.uploadUri,
        uploadedFileId: window.tasks[fileName].file.uploadedFileId,
        uploadedFileName: window.tasks[fileName].file.uploadedFileName,
        url: window.tasks[fileName].file.url,
        lastModified: window.tasks[fileName].file.lastModified,
        lastModifiedDate: window.tasks[fileName].file.lastModifiedDate,
        name: window.tasks[fileName].file.name,
        size: window.tasks[fileName].file.size,
        type: window.tasks[fileName].file.type,
        state: "Uploaded",
      }
    };
    if (index == -1)
      uploadItem.push(selectedItem);
    else
      uploadItem[index] = selectedItem;

    localStorage.setItem("uploadedFiles_" + userId, JSON.stringify(uploadItem));
  }


  const checkValue = (data: any) => {
    if (data.data.loadedBytes == data.data.fileSize) {
      if (!window.EvidenceSaved) {
        saveFileToLocalStorage(data.data.fileName)
      }
      return true
    }
    else {
      return false
    }
  }

  const getUploadInfo = (data: any) => {
    return {
      fileName: data.data.fileName,
      fileId: data.data.fileId,
      accessCode: data.data.accessCode,
      isCompleted: checkValue(data),
      state: data.data.state,
      uploadInfo: {
        uploadValue: data.data.percent,
        uploadText: data.data.fileName,
        uploadFileSize: data.data.loadedBytes + " of " + data.data.fileSize,
        error: false,
        removed: false,
      },
      isPause: false,
    };
  }

  const uploadError = (data: any) => {

    setIsFileUploadingStart(true);
    setErrorMsg({
      msg: data.data.message,
      type: data.data.variant,
    });
    setErrorMsgClass("erroMessageContainerShow");
    setShowErrorMsg(true);

    setFileCount((prev) => {
      return prev >= data.data.fileCountAtError
        ? prev - data.data.fileCountAtError
        : prev;
    });
    setFiles((pre) => {
      return pre.filter((x) => x.id !== data.data.filesId[0]);
    });
  }

  const uploadProgressStatus = () => {
    const prog = uploadInfo.map((item: FileUploadInfo, i: number) => {
      if (item.uploadInfo.removed != true) {
        return (
          <div className="crxProgressbarBucket">
            <CRXProgressBar
              id="raw"
              loadingText={item.uploadInfo.uploadText}
              value={item.uploadInfo.uploadValue}
              error={item.uploadInfo.error}
              width={280}
              removeIcon={
                <div className="cencel-loading">
                  {
                    <button onClick={() => cancelFileUpload(item)}>
                      <i className="fas fa-minus-circle"></i>
                    </button>
                  }
                  {!item.isPause &&
                    !item.uploadInfo.error &&
                    !item.isCompleted && (
                      <button onClick={() => pauseFileUpload(item)}>
                        <i className="fa fa-pause" aria-hidden="true"></i>
                      </button>
                    )}

                  {item.isPause && !item.uploadInfo.error && (
                    <button onClick={() => resumeFile(item)}>
                      <i className="fa fa-play" aria-hidden="true"></i>
                    </button>
                  )}
                </div>
              }
              maxDataSize={true}
              loadingCompleted={item.uploadInfo.uploadFileSize} //"5.0Mb"
            />
          </div>
        );
      }
    });
    return prog;
  }

  const retryFile = (file: FileUploadInfo) => {
    resumeFile(file);
  }

  const cancelFileUpload = (file: FileUploadInfo) => {
    window.tasks[file.fileName].isPause = false;
    setFileToRemove(file.fileName);
    setIsOpenConfirm(true);
  }

  const resumeFile = (file: FileUploadInfo) => {
    resumeFileUpload(file.fileName, window.onRecvBucketData);
    //find the file and set to pause status
    setUploadInfo((prev) => {
      if (prev.length > 0) {
        const newUploadInfo = [...prev];
        const rec = newUploadInfo.find((x) => x.fileName == file.fileName);
        if (rec != undefined || rec != null) {
          rec.isPause = false;
          return newUploadInfo;
        }
      }
      return [...prev];
    });
  }

  const pauseFileUpload = (file: FileUploadInfo) => {
    window.tasks[file.fileName].isPause = true;
    window.tasks[file.fileName].abortSignal.abort();

    //find the file and set to pause status
    setUploadInfo((prev) => {
      if (prev.length > 0) {
        const newUploadInfo = [...prev];
        const rec = newUploadInfo.find((x) => x.fileName == file.fileName);
        if (rec != undefined || rec != null) {
          rec.isPause = true;
          return newUploadInfo;
        }
      }
      return [...prev];
    });
  }

  const onConfirm = () => {
    window.tasks[fileToRemove]?.abortSignal?.abort();
    setFileCount((prev) => {
      fileCountRef.current = prev - 1;
      if (prev - 1 == 0) {
        setIsMainProgressBarOpen(false);
      }
      return prev - 1;
    });

    //incase of error or file uploaded, if user remove file
    let f1 = uploadInfo.find((x) => x.fileName == fileToRemove);
    if (f1 != null && (f1.uploadInfo.error || f1.isCompleted)) {
      setUploadInfo((prevState) => {
        if (prevState.length > 0) {
          const newUploadInfo = [...prevState];
          let findIndex = newUploadInfo.findIndex(
            (x) => x.fileName == fileToRemove
          );
          newUploadInfo.splice(findIndex, 1);
          return newUploadInfo;
        }
        return prevState;
      });
    }
    setFiles(files.filter((x) => x.uploadedFileName != fileToRemove));
    updateFileStatus(files.find((x) => x.uploadedFileName == fileToRemove));

    setIsOpenConfirm(false);

    //if the file stored in local storage, then remove it
    let uploadItem = JSON.parse(localStorage.getItem("uploadedFiles_" + userId) || "[]");
    let index = uploadItem.findIndex((x: any) => x.fileName == fileToRemove);
    if (index > -1) {
      uploadItem.splice(index, 1);
      localStorage.setItem("uploadedFiles_" + userId, JSON.stringify(uploadItem));
    }
    if (fileCountRef.current == 0) {
      setIsMetaDataOpen(false);
      setShowUploadAttention(false);
    }
  }

  const updateFileStatus = async (file: any) => {
    let body = [
      {
        op: "replace",
        path: "state",
        value: "Cancelled",
      },
    ];
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
      body: JSON.stringify(body),
    };
    let url: any = FILE_SERVICE_URL_V2 + `/Files/${file.uploadedFileId}/${file.accessCode}`
    const resp = await fetch(url, requestOptions);
    if (resp.ok) {
      toasterRef.current.showToaster({
        message: t("File_has_been_removed_successfully"),
        variant: "success",
        duration: 7000,
        clearButtton: true,
      });
      const notificationMessage: NotificationMessage = {
        title: t("Asset_Bucket"),
        message: t("File_has_been_removed_successfully"),
        type: "success",
        date: moment(moment().toDate())
          .local()
          .format("YYYY / MM / DD HH:mm:ss"),
      };
      dispatch(addNotificationMessages(notificationMessage));
    } else {
    }
  }

  const selectAssetFromList = (e: any, row: SearchModel.Asset) => {
    if (!e.target.checked) setCheckedAll(false);
    setChecked({ ...isChecked, [row.assetId]: e.target.checked });
    /*
    * * Change made to tackle situation, in which it is mandatory to select checkbox.  
    */
    //setSelectedItems([...selectedItems, row]);

    if (e.target.checked)
      setSelectedItems((prevArr) => [...prevArr, row]);
    else
      setSelectedItems((prevArr) =>
        prevArr.filter((e) => e.assetId !== row.assetId)
      );
  }

  const selectAllAssetFromList = (e: any) => {
    setCheckedAll(e.target.checked == true ? true : false);
    rows.forEach((row: AssetBucket, index: number) => {
      isChecked[row.assetId] = e.target.checked;
    });
    setSelectedItems([]);
  }

  const OfflineOnlineStatus = (): JSX.Element => {
    if (errorCount > 0) {
      return (
        <div className="offline">
          <i className="fa-solid fa-wifi-slash"></i>
        </div>
      );
    } else if (errorCount == 0 && showWifiIcon == true)
      return (
        <div className="online">
          <i className="fa-solid fa-wifi "></i>
        </div>
      );
    else {
      return (
        <div>
        </div>
      );
    }
  }

  const closeDialog = () => {
    setIsOpenMeta(false);
    setIsModalOpen(false);
  }

  const onCloseCrossMeta = (e: any) => {
    if (IsformUpdated)
      setIsOpenMeta(true);
    else
      setIsModalOpen(false);

  }

  const onCloseCancelMeta = (e: any) => {
    setActiveScreen(0);
    setIsModalOpen(false);
  }

  const assetNameTemplate = (assetName: string, evidence: SearchModel.Evidence, assetId: number) => {
    let masterAsset = evidence.masterAsset;
    let assets = evidence.asset.filter(x => x.assetId != masterAsset.assetId);
    let dataLink =
      <>
        <Link
          className="linkColor"
          to={{
            pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
            state: {
              evidenceId: evidence.id,
              assetId: masterAsset.assetId,
              assetName: assetName,
              evidenceSearchObject: evidence
            } as AssetDetailRouteStateType,
          }}
        >
          <div className="assetName">

            <CRXTruncation placement="top" content={assetName.length >
              25
              ? assetName.substring(0,
                25
              ) + "..."
              : assetName} />
          </div>
        </Link>
        <DetailedAssetPopup asset={assets} row={evidence} />
      </>
    return dataLink;
  }

  const showToastMsgFromActionMenu = (obj: any) => {
    toasterRef.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }

  const useCricleStyleClass = useCricleStyle()
  return (
    <>
      <CRXToaster ref={toasterRef} className="assetsBucketToster" />
      <CRXDrawer
        className="CRXBucketPanel crxBucketPanelStyle"
        anchor="right"
        button={ToggleButton}
        btnStyle="bucketIconButton"
        isOpen={isOpen}
        toggleState={toggleState}
        variant="persistent"
      >
        <Droppable droppableId="assetBucketEmptyDroppable">
          {(provided: any) => (
            <CRXRootRef provided={provided}>
              <>
                <Draggable
                  draggableId="assetBucketEmptyDraggable"
                  index={0}
                  isDragDisabled={true}
                >
                  {(provided: any) => (
                    <div
                      id="divMainBucket"
                      className="divMainBucket"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CRXRows container spacing={0}>
                        <CRXColumn item xs={11} className="bucketPanelTitle">
                          <label>{t("Your_Asset_Bucket")}</label>
                        </CRXColumn>
                        <CRXColumn item xs={1} className="topColumn">
                          <i
                            className="icon icon-cross2"
                            onClick={() => setIsOpen(false)}
                          ></i>
                        </CRXColumn>
                      </CRXRows>

                      <CRXRows container spacing={0} className={showMessageClx}>
                        <CRXColumn item xs={12} className="topColumn">
                          <CRXAlert
                            className="crx-alert-notification"
                            alertType="inline"
                            message={attention.msg}
                            type="info"
                            open={showAttention}
                            setShowSucess={setShowAttention}
                          />
                        </CRXColumn>
                      </CRXRows>
                      {showErrorMsg && (
                        <CRXRows className={errorMsgClass}>
                          <CRXColumn>
                            <CRXAlert
                              className="crx-alert-notification"
                              message={errorMsg.msg}
                              type={errorMsg.type}
                              alertType="inline"
                              persist={true}
                              open={showErrorMsg}
                              setShowSucess={setShowErrorMsg}
                            />
                          </CRXColumn>
                        </CRXRows>
                      )}
                      <CRXRows
                        container
                        spacing={0}
                        className={
                          `bucket_metadata
                          ${showUploadAttention
                            ? "file-upload-show"
                            : "file-upload-hide"
                          }`}
                      >
                        <CRXAlert
                          className={"crx-alert-notification file-upload"}
                          message={"sucess.msg"}
                          type="info"
                          open={showUploadAttention}
                          setShowSucess={setShowUploadAttention}
                          alertType="inline"
                          persist={true}
                          showCloseButton={false}
                          children={
                            <div className="check">
                              <div className="attentionPera">
                                {t('Please_add_metadata_to_finish_saving_your_uploaded_files')}
                              </div>
                              <div className="btn-center">
                                <CRXButton
                                  id="metdaModalButton"
                                  className="MuiButton-containedPrimary"
                                  onClick={handleClickOpen}
                                  color="primary"
                                  variant="contained"
                                >
                                  {t("Add_metadata")}
                                </CRXButton>
                              </div>
                            </div>
                          }
                        />

                        <CRXModalDialog
                          className="add-metadata-window __Add__MetaData__Window__ __Add__MetaData__Window__UI  MetaData_Window"
                          maxWidth="xl"
                          title={t("Choose_asset_metadata")}
                          cancelButtonTxt="Cancel"
                          showSticky={true}
                          modelOpen={isModalOpen}
                          onClose={(e: React.MouseEvent<HTMLElement>) =>
                            onCloseCrossMeta(e)
                          }
                        >
                          <AddMetadataForm
                            onClose={(e: React.MouseEvent<HTMLElement>) =>
                              onCloseCancelMeta(e)
                            }
                            uploadFile={files}
                            uploadInfo={uploadInfo}
                            setAddEvidence={setonAddEvidence}
                            setEvidenceId={setonSaveEvidence}
                            uploadAssetBucket={assetBucketData}
                            activeScreen={activeScreen}
                            setActiveScreen={setActiveScreen}
                            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
                          />
                        </CRXModalDialog>
                      </CRXRows>
                      {!isFileUploadHide ? (
                        <Restricted moduleId={26}>
                          <div className="uploadContent">
                            <div className="iconArea">
                              <i className="fas fa-layer-plus"></i>
                            </div>
                            <div className="textArea">
                              {t("Drag_and_drop_an")} <b>{t("asset")}</b>{" "}
                              {t("to_the_Asset_Bucket_to_add_or_use_the")}
                              <br />
                              <div>
                                {isFileUploadingStart ?
                                  <input
                                    style={{ display: "none" }}
                                    id="upload-Button-file"
                                    multiple
                                    type="file"
                                    onChange={handleOnUpload}
                                    onClick={emptyfileOnClick}
                                  />
                                  : <></>}
                                <label htmlFor="upload-Button-file">
                                  {isFileUploadingStart ?
                                    <a className="textFileBrowser">
                                      {t("file_browser")}
                                    </a> : <CircularProgress
                                      variant="indeterminate"
                                      disableShrink
                                      //className={classes.top}
                                      classes={{
                                        ...useCricleStyleClass,
                                      }}
                                      size={12}
                                      thickness={6}
                                    //{...props}
                                    />
                                  }
                                </label>
                              </div>
                            </div>
                          </div>
                        </Restricted>
                      ) : (
                        <></>
                      )}

                      {isMainProgressBarOpen && !onAddEvidence && (
                        <>
                          <div className="uploading-text">
                            {totalFilePer == 100 ? "Uploaded:" : "Uploading:"}
                            {OfflineOnlineStatus()}
                          </div>
                          <div className="crxProgressbarBucket mainProgressBar">
                            <CRXProgressBar
                              id="raw"
                              loadingText={
                                fileCount > 1
                                  ? fileCount +
                                  ` ${t("assets")} ` +
                                  "(" +
                                  totalFileSize +
                                  ")"
                                  : fileCount +
                                  ` ${t("asset")} ` +
                                  "(" +
                                  totalFileSize +
                                  ")"
                              }
                              value={totalFilePer}
                              error={mainProgressError}
                              maxDataSize={true}
                              width={100}
                              widthInPercentage={true}
                            />
                          </div>
                        </>
                      )}
                      {uploadInfo.filter((x) => x.uploadInfo.removed != true)
                        .length > 0 &&
                        fileCount > 0 &&
                        isSubProgressBarOpen && (
                          <CrxAccordion
                            title={t("Upload_Details")}
                            id="accorIdx2"
                            className="crx-accordion crxAccordionBucket"
                            ariaControls="Content2"
                            name="panel1"
                            isExpanedChange={isExpaned}
                            expanded={expanded === "panel1"}
                          >
                            {uploadProgressStatus()}
                          </CrxAccordion>
                        )}

                      <Restricted moduleId={1}>
                        {rows.length > 0 ? (
                          <>
                            <div className="bucketViewLink">
                              <CRXCheckBox
                                inputRef={checkBoxRef}
                                checked={isCheckedAll}
                                onChange={(e: any) => selectAllAssetFromList(e)}
                                name="selectAll"
                                className="bucketListCheckedAll"
                                lightMode={true}
                              />
                              <span className="selectAllText">
                                {t("Select_All")}
                              </span>
                              <div className="bucketActionMenuAll">
                                <div
                                  className={
                                    selectedItems.length > 1 ? "" : " disableHeaderActionMenu"
                                  }>
                                  <ActionMenu
                                    row={undefined}
                                    className=""
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    actionMenuPlacement={
                                      ActionMenuPlacement.AssetBucket
                                    }
                                    showToastMsg={(obj: any) => showToastMsgFromActionMenu(obj)}
                                    
                                  />
                                </div>
                              </div>

                            </div>
                            <div className="bucketScroll">
                              <div className="bucketList" id="assetBucketLists">
                                {assetBucketData.map((x: any, index) => {
                                  let selectedAsset = x.evidence.asset.filter(
                                    (y: any) => x.assetId == y.assetId
                                  );
                                  return (
                                    <div className="bucketLister">
                                      <div className="assetCheck">
                                        <CRXCheckBox
                                          inputRef={checkBoxRef}
                                          checked={
                                            isChecked[x.assetId] || isCheckedAll
                                          }
                                          onChange={(e: any) =>
                                            selectAssetFromList(e, x)
                                          }
                                          name={x.assetId}
                                          lightMode={true}
                                        />
                                      </div>
                                      <div className="bucketThumb">
                                        <AssetThumbnail
                                          evidence={x.evidence}
                                          assetName={selectedAsset[0].assetName}
                                          assetType={selectedAsset[0].assetType}
                                          fileType={
                                            selectedAsset[0]?.files[0]?.type
                                          }
                                          accessCode={selectedAsset[0]?.files[0]?.accessCode}
                                          fontSize="61pt"
                                          asset={selectedAsset[0]}
                                        />
                                      </div>
                                      <div className="bucketListTextData">
                                        {x?.isMaster ? (
                                          <>
                                            <div className="bucketListAssetName">
                                              {
                                                assetNameTemplate(selectedAsset[0].assetName, x.evidence, selectedAsset[0].assetId)
                                              }

                                            </div>
                                            <div className="bucketListRec">
                                              {selectedAsset[0].assetType}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="bucketListAssetName">
                                              {assetNameTemplate(selectedAsset[0].assetName, x.evidence, selectedAsset[0].assetId)}
                                            </div>
                                            <div className="bucketListRec">
                                              {selectedAsset[0].assetType}
                                            </div>
                                          </>
                                        )}
                                        {x.evidence.categories &&
                                          x.evidence.categories.length > 0 && (
                                            <div className="bucketListRec">
                                              {x.evidence.categories
                                                .map((item: any) => item)
                                                .join(", ")}
                                            </div>
                                          )}
                                      </div>
                                      <div className="bucketActionMenu">
                                        <ActionMenu
                                          row={x}
                                          selectedItems={selectedItems}
                                          setSelectedItems={setSelectedItems}
                                          actionMenuPlacement={
                                            ActionMenuPlacement.AssetBucket
                                          }
                                          className="drawerBucket_actionMenu"
                                          actionViewScroll="initial"
                                          showToastMsg={(obj: any) => showToastMsgFromActionMenu(obj)}
                                          
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="bucketContent">
                            {t("Your_Asset_Bucket_is_empty.")}
                          </div>
                        )}
                      </Restricted>
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </>
            </CRXRootRef>
          )}
        </Droppable>
      </CRXDrawer>
      <CRXConfirmDialog
        className="crx-unblock-modal"
        title={t("Please_confirm")}
        setIsOpen={setIsOpenConfirm}
        onConfirm={onConfirm}
        isOpen={isOpenConfirm}
        primary={t("Yes_remove")}
        secondary={t("No_do_not_remove")}
        maxWidth="sm"
      >
        <div className="crxUplockContent __CRX__Uploading__Content">
          <div className="uploadCancelText">
            {t("You are attempting to")} <strong>{t("remove")}</strong>{" "}
            {t("the file")} <strong>({fileToRemove})</strong>{" "}
            {t("asset from this upload.")} {t("Once you remove it")},{" "}
            {t("you will not be able to undo this action.")}
          </div>
          <div className="uploadCancelBottom">
            {t("Are you sure you would like to")} <strong>{t("remove")}</strong>{" "}
            {t("this asset from this upload?")}
          </div>
        </div>
      </CRXConfirmDialog>
      <CRXConfirmDialog
        setIsOpen={() => setIsOpenMeta(false)}
        onConfirm={closeDialog}
        isOpen={isOpenMeta}
        className="userGroupNameConfirm"
        primary={t("Yes_close")}
        secondary={t("No,_do_not_close")}
        text="user group form"
      >
        <div className="confirmMessage">
          {t("You_are_attempting_to")}{" "}
          <strong> {t("close")}</strong> {t("the")}{" "}
          <strong>{t("'asset_metadata'")}</strong>.{" "}
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
};

export default CRXAssetsBucketPanel;