import React, { useEffect, useState, useRef } from "react";
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
  CRXCheckBox
} from "@cb/shared";
import BucketActionMenu from "../../Assets/AssetLister/ActionMenu/BucketActionMenu";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { AssetThumbnail } from "../../Assets/AssetLister/AssetDataTable/AssetThumbnail";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  Order,
  onTextCompare,
  onMultiToMultiCompare,
  onSetSearchDataValue,
} from "../../../GlobalFunctions/globalDataTableFunctions";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import multitextDisplay from "../../../GlobalComponents/Display/MultiTextDisplay";
import MultSelectiDropDown from "../../../GlobalComponents/DataTableSearch/MultSelectiDropDown";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { assetRow } from "../../Assets/AssetLister/ActionMenu/types";
import { updateDuplicateFound, loadFromLocalStorage } from "../../../Redux/AssetActionReducer";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { NotificationMessage } from "../CRXNotifications/notificationsTypes"

//--for asset upload
import { AddFilesToFileService, getFileSize, resumeFileUpload } from "../../../GlobalFunctions/FileUpload"
import { CRXModalDialog } from "@cb/shared";
import AddMetadataForm from "./AddMetadataForm";
import Cookies from 'universal-cookie';
import { FILE_SERVICE_URL } from '../../../utils/Api/url'
import Restricted from "../../../ApplicationPermission/Restricted";
declare const window: any;
// window.onRecvData = new CustomEvent("onUploadStatusUpdate");
// window.onRecvError = new CustomEvent("onUploadError");
window.URL = window.URL || window.webkitURL;
const cookies = new Cookies();
//for asset upload--

interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  assetType: string;
  recordingStarted: string;
  categories: string[];
}

const thumbTemplate = (assetType: string) => {
  return <AssetThumbnail assetType={assetType} fontSize="61pt" />;
};

function usePrevious(value: any) {
  const ref: any = React.useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

type isBucket = {
  isOpenBucket: boolean
}
const CRXAssetsBucketPanel = ({ isOpenBucket }: isBucket) => {

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isChecked, setChecked] = useState<any>([]);
  const [isCheckedAll, setCheckedAll] = useState<boolean>(false)
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  useEffect(() => {
    setIsOpen(isOpenBucket)
  }, [isOpenBucket])

  const isDuplicateFound: boolean = useSelector(
    (state: RootState) => state.assetBucket.isDuplicateFound
  );
  const [selectedItems, setSelectedItems] = React.useState<assetRow[]>([]);
  const [rows, setRows] = React.useState<AssetBucket[]>(assetBucketData);
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [scrollHide, setScroll] = React.useState("");
  const [mainProgressError, setMainProgressError] = React.useState<boolean>(false);
  const [errorCount, setErrorCount] = React.useState<number>(0);
  const [onAddEvidence, setonAddEvidence] = React.useState<boolean>(false);
  const [sucess, setSucess] = React.useState<{ msg: string }>({
    msg: "",
  });
  const [attention, setAttention] = React.useState<{ msg: string }>({
    msg: "",
  });
  const [showSucess, setShowSucess] = React.useState<boolean>(false);
  const [showMessageClx, setShowMessageClx] = React.useState<string>("bucketMessageHide");
  const [showAttention, setShowAttention] = React.useState<boolean>(false);
  const [showUploadAttention, setShowUploadAttention] = React.useState<boolean>(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const [isNext, setIsNext] = React.useState(false);


  const prevCount = usePrevious(assetBucketData.length);
  const prevIsDuplicate = usePrevious(isDuplicateFound);
  //--for asset upload
  const [fileCount, setFileCount] = React.useState<number>(0);
  const fileCountRef = React.useRef(fileCount);
  const [files, setFiles] = React.useState<any[]>([]);
  const [totalFileSize, setTotalFileSize] = React.useState<string>("");


  const [uploadInfo, setUploadInfo] = useState<FileUploadInfo[]>([]);
  const [totalFilePer, setTotalFilePer] = React.useState<any>(0);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [expanded, isExpaned] = React.useState<string | boolean>();
  const [isOpenConfirm, setIsOpenConfirm] = React.useState<boolean>(false);
  const [isSubProgressBarOpen, setIsSubProgressBarOpen] = React.useState<boolean>(false);
  const [isMainProgressBarOpen, setIsMainProgressBarOpen] = React.useState<boolean>(false);
  const [isMetaDataOpen, setIsMetaDataOpen] = React.useState<boolean>(false);
  const [isFileUploadHide, setIsFileUploadHide] = useState<boolean>(false);
  const [fileToRemove, setFileToRemove] = React.useState<string>("");
  //--for asset upload
  const dispatch = useDispatch()

  useEffect(() => {
    // on load check asset bucket exists in local storage
    dispatch(loadFromLocalStorage());
    setCheckedAll(false)
  }, []);


  useEffect(() => {
    if (isDuplicateFound != prevIsDuplicate && prevIsDuplicate != undefined && isDuplicateFound !== false) {
      setAttention({
        msg: t("An_asset_you_are_attempting_to_add_to_the_asset_bucket_has_already_been_added."),
      });
      setShowMessageClx("bucketMessageShow")
      setShowAttention(true);

      dispatch(updateDuplicateFound());
    }
  }, [isDuplicateFound]);



  useEffect(() => {

    setRows(assetBucketData);
    assetBucketData.forEach((x: any) => {
      isChecked[x.assetId] = false;
    })
    setCheckedAll(false)
    let local_assetBucket: any = localStorage.getItem("assetBucket");
    let isBucket: any = localStorage.getItem("isBucket") !== null ? localStorage.getItem("isBucket") : "False";

    if (local_assetBucket !== null && local_assetBucket.length != 0 && prevCount == 0 && assetBucketData.length > prevCount && isBucket == "True") {
      localStorage.setItem("isBucket", "False");
      showToastMsg()
    }
    else
      if (assetBucketData.length > prevCount && isBucket == "True") {
        localStorage.setItem("isBucket", "False");
        showToastMsg()

      }
      else
        if (assetBucketData.length < prevCount) {
          const totalRemoved = prevCount - assetBucketData.length;

          toasterRef.current.showToaster({
            message: `${totalRemoved} ${totalRemoved > 1 ? t("assets") : t("asset")} ${t("removed_the_asset_bucket")}`,
            variant: "success",
            duration: 7000,

          });

          let notificationMessage: NotificationMessage = {
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

  const showToastMsg = () => {
    toasterRef.current.showToaster({
      message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
      variant: "success",
      duration: 7000,
      clearButtton: true,
    });

    let notificationMessage: NotificationMessage = {
      title: t("Asset_Lister"),
      message: t("You_have_added_the_selected_assets_to_the_asset_bucket."),
      type: "success",
      date: moment(moment().toDate())
        .local()
        .format("YYYY / MM / DD HH:mm:ss"),
    };
    dispatch(addNotificationMessages(notificationMessage));
  };

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    // let timer: any = null;
    // timer = setTimeout(() => {
    //   setShowAttention((prev: boolean) => false);
    //   setShowSucess((prev: boolean) => false);
    //   setShowMessageClx("bucketMessageHide");
    // }, 7000);
    // return () => {
    //   clearTimeout(timer);
    // };
  }, [isDuplicateFound == true]);


  const bucketIconByState = assetBucketData.length > 0 ? "icon-drawer" : "icon-drawer2"
  const totalAssetBucketCount = assetBucketData.length + fileCount
  const onFileUploadErrorBdage = () => {
    return <>
      <div className="errorBadge">
        <span>
          !
        </span>
        <CRXTooltip
          className="bucketIcon"
          title={t("Asset_Bucket_can_be_used_to_build_cases_and_do_one_action_on_many_assets_at_the_same_time.")}
          iconName={"fas " + bucketIconByState}
          placement="left"
          arrow={true}
        ></CRXTooltip>
      </div>
    </>
  }

  const ToggleButton = (
    errorCount > 0 ? onFileUploadErrorBdage() :
      <CRXBadge itemCount={totalAssetBucketCount} color="primary">
        <CRXTooltip
          className="bucketIcon"
          title={t("Asset_Bucket_can_be_used_to_build_cases_and_do_one_action_on_many_assets_at_the_same_time.")}
          iconName={"fas " + bucketIconByState}
          placement="left"
          arrow={true}
        ></CRXTooltip>
      </CRXBadge>
  );
  const toggleState = () => setIsOpen((prevState: boolean) => !prevState);

  // const searchText = (
  //   rowsParam: AssetBucket[],
  //   headCells: HeadCellProps[],
  //   colIdx: number
  // ) => {
  //   const onChange = (valuesObject: ValueString[]) => {
  //     headCells[colIdx].headerArray = valuesObject;
  //     onSelection(valuesObject, colIdx);
  //   };

  //   return (
  //     <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
  //   );
  // };

  // const searchMultiDropDown = (
  //   rowsParam: AssetBucket[],
  //   headCells: HeadCellProps[],
  //   colIdx: number
  // ) => {
  //   const onSetSearchData = () => {
  //     setSearchData((prevArr) =>
  //       prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
  //     );
  //   };

  //   const onSetHeaderArray = (v: ValueString[]) => {
  //     headCells[colIdx].headerArray = v;
  //   };
  //   const noOptionStyled = {
  //     width: "116px",
  //     marginLeft: "-1px",
  //     whiteSpace: "nowrap",
  //     overFlow: "hidden",
  //     textOverflow: "ellipsis",
  //     marginRight: "0",
  //     paddingLeft: "5px !important",
  //     paddingRight: "10px !important",
  //     fontSize: "13px",
  //     lineHeight: "15px",
  //     top: "0px",
  //     marginTop: "0"
  //   }
  //   const paddLeft = {
  //     marginLeft: "2px",
  //     paddingRight: "3px !important",
  //     marginRight: "2px",
  //     paddingLeft: "2px",


  //   }
  //   return (
  //     <MultSelectiDropDown
  //       headCells={headCells}
  //       colIdx={colIdx}
  //       reformattedRows={rowsParam}
  //       isSearchable={true}
  //       onMultiSelectChange={onSelection}
  //       onSetSearchData={onSetSearchData}
  //       onSetHeaderArray={onSetHeaderArray}
  //       widthNoOption={noOptionStyled}
  //       checkedStyle={paddLeft}
  //     />
  //   );
  // };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
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
      dataComponent: thumbTemplate,
      minWidth: "80",
      maxWidth: "100",
    },
    // {
    //   label: `${t("AssetID")}`,
    //   id: "assetName",
    //   align: "left",
    //   dataComponent: (e: string) => textDisplay(e, "linkColor"),
    //   sort: true,
    //   searchFilter: true,
    //   searchComponent: searchText,
    //   minWidth: "100",
    //   maxWidth: "100",
    // },
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

  const dataArrayBuilder = () => {
    let dataRows: AssetBucket[] = assetBucketData;
    searchData.forEach((el: SearchObject) => {
      if (el.columnName === "assetName")
        dataRows = onTextCompare(dataRows, headCells, el);
      if (["categories"].includes(el.columnName))
        dataRows = onMultiToMultiCompare(dataRows, headCells, el);
    });
    setRows(dataRows);
  };

  React.useEffect(() => {
    const windowSize = window.screen.height;
    if (windowSize < 1080 && rows.length < 3) {
      setScroll("hideScroll");

    } else if (windowSize >= 1080 && rows.length < 4) {
      setScroll("hideScroll");
    } else {
      setScroll("");
    }
  }, [rows, sucess])

  useEffect(() => {
    if (sucess.msg !== undefined && sucess.msg !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Asset_Bucket"),
        message: sucess.msg,
        type: "success",
        date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [sucess])

  useEffect(() => {
    if (attention.msg !== undefined && attention.msg !== "") {
      let notificationMessage: NotificationMessage = {
        title: t("Asset_Bucket"),
        message: attention.msg,
        type: "info",
        date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [attention])

  //--for asset upload
  const handleOnUpload = async (e: any) => {

    var av = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let fileName = e.target.files[i].name.replaceAll(' ', '_');

      if (fileName.length < 3 || fileName.length > 128) {
        toasterRef.current.showToaster({
          message: t("Minimum_3_and_maximum_128_characters_are_allowed"), variant: "error", duration: 7000, clearButtton: true
        });
        return false;
      }
      else {
        var pattern = new RegExp("^([A-Z]|[a-z]){1}[A-Za-z0-9._-]*$");
        if (!pattern.test(fileName)) {
          toasterRef.current.showToaster({
            message: t("Only_alphabets_digits_and_,_-_are_allowed._Must_start_with_an_alphabet_only"), variant: "error", duration: 7000, clearButtton: true
          });
          return false;
        }
      }

      //for getting duration
      var fileNameExtension = e.target.files[i].name.substring(
        e.target.files[i].name.lastIndexOf("."),
        e.target.files[i].name.length
      );
      if (fileNameExtension === ".mp4" ||
        fileNameExtension === ".mp3" ||
        fileNameExtension === ".mkv" ||
        fileNameExtension === ".webm" ||
        fileNameExtension === ".3gp" ||
        fileNameExtension === ".wav") {
        //wmv and avi does not support by browser       
        av.push({ file: e.target.files[i] });
      }

    }

    setFileCount(prev => {
      fileCountRef.current = prev + e.target.files.length;
      return prev + e.target.files.length
    });

    for (let i = 0; i < e.target.files.length; i++) {
      e.target.files[i].id = +new Date();
    }

    setFiles(prev => { return [...prev, ...e.target.files] });
    AddFilesToFileService(e.target.files);

    av.forEach(async x => {
      await getDuration(x.file).then(
        //duration => console.log("File Duration ", duration)
      )
    });

  }
  const getDuration = async (file: any) => {
    let videoNode = document.createElement("video");
    videoNode.preload = 'metadata';
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
    setUploadInfo(prevState => {
      if (prevState.length > 0) {
        const newUploadInfo = [...prevState];
        const rec = newUploadInfo.find(x => x.fileName == data.data.fileName);
        if (rec != undefined || rec != null) {
          return uploadStatusCase(data, rec, newUploadInfo);
        }
        else {
          _uploadInfo = getUploadInfo(data);
          return [...prevState, _uploadInfo]
        }
      }
      else {
        _uploadInfo = getUploadInfo(data);
        return [...prevState, _uploadInfo]
      }
    });
  }
  const uploadStatusCase = (data: any, rec: FileUploadInfo, newUploadInfo: FileUploadInfo[]) => {
    if (data.data.error) {
      //Fire Patch request to change the status of File.
      updateStatusOfFile(data.data.fileId);
      onFileUploadError();
      rec.uploadInfo.error = true;
      return [...newUploadInfo]
    }
    if (data.data.removed) {
      rec.uploadInfo.removed = true;
      return [...newUploadInfo]
    }
    rec.fileName = data.data.fileName;
    rec.fileId = data.data.fileId;
    rec.isCompleted = data.data.loadedBytes == data.data.fileSize
    rec.uploadInfo = {
      uploadValue: data.data.percent,
      uploadText: data.data.fileName,
      uploadFileSize: data.data.loadedBytes + " of " + data.data.fileSize,
      error: false,
      removed: false,
    };

    return [...newUploadInfo]
  }

  const updateStatusOfFile = (id: string) => {
    const body = [
      {
        "op": "replace",
        "path": "state",
        "value": "Abandoned"
      }
    ];
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 'TenantId': '1', 'Authorization': `Bearer ${cookies.get('access_token')}`
      },
      body: JSON.stringify(body)
    };
    fetch(FILE_SERVICE_URL + `?id=` + id, requestOptions)
      .then((resp: any) => {
        console.info(resp);
      }).catch((err: any) => {
        console.error(err);
      });
  }


  let firstExecution = 0; // Store the first execution time
  const interval = 7000; // 7 seconds
  const onFileUploadError = () => {
    //this function is used for avoiding multiple error message at a time
    var date = new Date();
    var milliseconds = date.getTime();
    if ((milliseconds - firstExecution) > interval) {
      firstExecution = milliseconds;
      toasterRef.current.showToaster({
        message: t("File(s)_failed_to_upload."), variant: "error", duration: 7000, clearButtton: true
      });
    }
  }
  useEffect(() => {
    let fileSize: number = 0;
    for (let i = 0; i < files.length; i++) {
      fileSize = fileSize + files[i].size;
    }
    setTotalFileSize(getFileSize(fileSize));
  }, [files])


  interface UploadInfo {
    uploadValue: number,
    uploadText: string,
    uploadFileSize: string,
    error: boolean,
    removed?: boolean
  }
  interface FileUploadInfo {
    uploadInfo: UploadInfo,
    fileName: string,
    fileId: string,
    isPause: boolean,
    isCompleted: boolean
  }



  const handleClickOpen = () => {
    setIsModalOpen(true);
  }
  const handleClose = (e: any) => {
    setIsModalOpen(false);
  }




  useEffect(() => {
    var totalPercentage = 0;
    var eCount = 0;
    if (totalFilePer === 100 && files.length == 0) {
      setUploadInfo([])
      setTotalFilePer(0)
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

    if (totalPercentage != 0 && fileCountRef.current != 0) {

      setTotalFilePer(Math.round(totalPercentage / fileCountRef.current));
    }

    if (eCount == fileCount && (eCount != 0 && fileCount != 0)) {
      setMainProgressError(true);
    }
    else {
      setMainProgressError(false);
    }
    //in any error show badge
    setErrorCount(eCount);


    if (uploadInfo.length > 0 && totalFilePer < 100) {
      if (!isCheckTrue) {

        setIsMetaDataOpen(true)
        setShowUploadAttention(true);
        // setFileCount(files.length)

      }
      if (!onAddEvidence && fileCount > 0) {

        setIsMainProgressBarOpen(true)
        setIsSubProgressBarOpen(true)
        // setFileCount(files.length)

      }
    }


  }, [uploadInfo])

  const setUploadInfoRemoveCase = (fileName: string) => {
    setUploadInfo(prevState => {
      if (prevState.length > 0) {
        const newUploadInfo = [...prevState];
        return newUploadInfo.filter(y => y.fileName != fileName);
      }
      return prevState
    })
  }

  const [isCheckTrue, setIsCheckTrue] = useState<boolean>(false);

  useEffect(() => {
    if (totalFilePer === 100) {
      toasterRef.current.showToaster({
        message: t("File(s) uploaded"), variant: "success", duration: 7000, clearButtton: true
      });
      if (isCheckTrue) {
        setIsMainProgressBarOpen(false);
        setIsFileUploadHide(false)
        setIsSubProgressBarOpen(false)
        setIsCheckTrue(false)
        setUploadInfo([])
        setFiles([])
        setFileCount(0)

      }
      else {
        setIsMainProgressBarOpen(true);
        setIsSubProgressBarOpen(true)
        setIsFileUploadHide(false)

      }

      if (!onAddEvidence) {
        setIsFileUploadHide(false)
      }
    }

    if (uploadInfo.length > 0 && totalFilePer < 100) {
      if (!isCheckTrue) {

        setFileCount(files.length)
      }
      if (!onAddEvidence) {
        setFileCount(files.length)
      }
    }

  }, [totalFilePer])


  useEffect(() => {
    if (isCheckTrue) {
      setIsMetaDataOpen(false);
      setShowUploadAttention(false);
    }
  }, [isCheckTrue])


  useEffect(() => {
    if (onAddEvidence) {
      toasterRef.current.showToaster({
        message: t("Asset(s) saved"), variant: "success", duration: 7000, clearButtton: true
      });
      setIsMetaDataOpen(false);
      setShowUploadAttention(false)
      setonAddEvidence(false)
      setIsMainProgressBarOpen(false);
      setIsSubProgressBarOpen(false)

      setIsFileUploadHide(true)
      if (totalFilePer == 100) {
        setIsFileUploadHide(false)
        if (onAddEvidence) {

          setFiles([])
          setUploadInfo([])
        }
        setFileCount(0)
      }
      else {
        setIsCheckTrue(true);
      }
    }
  }, [onAddEvidence])

  const getUploadInfo = (data: any) => {
    return {
      fileName: data.data.fileName,
      fileId: data.data.fileId,
      isCompleted: data.data.loadedBytes == data.data.fileSize,
      uploadInfo: {
        uploadValue: data.data.percent,
        uploadText: data.data.fileName,
        uploadFileSize: data.data.loadedBytes + " of " + data.data.fileSize,
        error: false,
        removed: false,
      },
      isPause: false
    };
  }

  //Error message system administrator
  const [errorMsg, setErrorMsg] = useState<any>({
    msg: '',
    type: '',
  })
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [errorMsgClass, setErrorMsgClass] = useState<string>("erroMessageContainerHide")
  const uploadError = (data: any) => {
    // toasterRef.current.showToaster({
    //   message: data.data.message, variant: data.data.variant, duration: data.data.duration, clearButtton: data.data.clearButtton, persist : true
    // });


    setErrorMsg({
      msg: data.data.message,
      type: data.data.variant,

    })
    setErrorMsgClass("erroMessageContainerShow")
    setShowErrorMsg(true);

    setFileCount((prev) => { return prev >= data.data.fileCountAtError ? prev - data.data.fileCountAtError : prev })
    setFiles((pre) => {
      return pre.filter(x => x.id !== data.data.filesId[0]);
    })
  }


  useEffect(() => {
    window.onRecvData = new CustomEvent("onUploadStatusUpdate");
    window.onRecvError = new CustomEvent("onUploadError");
    window.addEventListener("onUploadStatusUpdate", uploadStatusUpdate)
    window.addEventListener("onUploadError", uploadError)
    // return () => window.removeEventListener("onUploadStatusUpdate", MyData);
  }, [])

  const uploadProgressStatus = () => {

    const prog = uploadInfo.map((item: FileUploadInfo, i: number) => {
      if (item.uploadInfo.removed != true) {

        return <div className="crxProgressbarBucket">
          <CRXProgressBar
            id="raw"
            loadingText={item.uploadInfo.uploadText}
            value={item.uploadInfo.uploadValue}
            error={item.uploadInfo.error}
            width={280}
            removeIcon={
              <div className="cencel-loading">
                {<button onClick={() => cancelFileUpload(item)}><i className="fas fa-minus-circle"></i></button>}
                {!item.isPause && !item.uploadInfo.error && !item.isCompleted &&
                  <button onClick={() => pauseFileUpload(item)}><i className="fa fa-pause" aria-hidden="true"></i></button>}

                {item.isPause && !item.uploadInfo.error &&
                  <button onClick={() => resumeFile(item)}><i className="fa fa-play" aria-hidden="true"></i></button>}
                {item.uploadInfo.error && <button onClick={() => retryFile(item)}><i className="fa fa-repeat" aria-hidden="true"></i></button>}
              </div>
            }
            maxDataSize={true}
            loadingCompleted={item.uploadInfo.uploadFileSize}//"5.0Mb"
          />

        </div>
      }
    })
    return prog
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
    resumeFileUpload(file.fileName);
    //find the file and set to pause status
    setUploadInfo(prev => {
      if (prev.length > 0) {
        const newUploadInfo = [...prev];
        const rec = newUploadInfo.find(x => x.fileName == file.fileName);
        if (rec != undefined || rec != null) {
          rec.isPause = false;
          return newUploadInfo;
        }
      }
      return [...prev]
    });
  }
  const pauseFileUpload = (file: FileUploadInfo) => {
    window.tasks[file.fileName].isPause = true;
    window.tasks[file.fileName].abortSignal.abort();

    //find the file and set to pause status
    setUploadInfo(prev => {
      if (prev.length > 0) {
        const newUploadInfo = [...prev];
        const rec = newUploadInfo.find(x => x.fileName == file.fileName);
        if (rec != undefined || rec != null) {
          rec.isPause = true;
          return newUploadInfo;
        }
      }
      return [...prev]
    });

  }
  const onConfirm = () => {
    window.tasks[fileToRemove].abortSignal.abort();
    setFileCount(prev => {

      fileCountRef.current = prev - 1;
      if (prev - 1 == 0) {
        setIsMainProgressBarOpen(false);
      }
      return prev - 1;
    });

    //incase of error or file uploaded, if user remove file
    let f1 = uploadInfo.find(x => x.fileName == fileToRemove);
    if (f1 != null && (f1.uploadInfo.error || f1.isCompleted)) {
      setUploadInfo(prevState => {
        if (prevState.length > 0) {
          const newUploadInfo = [...prevState];
          let findIndex = newUploadInfo.findIndex(x => x.fileName == fileToRemove);
          newUploadInfo.splice(findIndex, 1)
          return newUploadInfo;
        }
        return prevState
      })
    }
    setFiles(files.filter(x => x.uploadedFileName != fileToRemove));
    updateFileStatus(files.find(x => x.uploadedFileName == fileToRemove))

    setIsOpenConfirm(false);
  }

  const updateFileStatus = async (file: any) => {
    var body = [
      {
        "op": "replace",
        "path": "state",
        "value": "Cancelled"
      }
    ]
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 'TenantId': '1', 'Authorization': `Bearer ${cookies.get('access_token')}`
      },
      body: JSON.stringify(body)
    };
    const resp = await fetch(FILE_SERVICE_URL + `?id=` + file.uploadedFileId, requestOptions);
    if (resp.ok) {
      toasterRef.current.showToaster({
        message: t("File_has_been_removed_successfully"), variant: "success", duration: 7000, clearButtton: true
      });
    }
    else {

    }
  }
  //for asset upload--

  useEffect(() => {

    const trAtiveValue = document.querySelector(".rc-menu--open")?.closest("tr[class*='MuiTableRow-hover-']");

    let dataui = document.querySelectorAll("tr[class*='MuiTableRow-root-']");

    let trAtiveArray = Array.from(dataui);

    trAtiveArray.map((e) => {

      if (e.classList.contains("SelectedActionMenu")) {

        e.classList.remove("SelectedActionMenu")

      } else {

        trAtiveValue?.classList.add("SelectedActionMenu");
      }

    })

  });

  const [activeScreen, setActiveScreen] = useState<number>(0);
  const checkBoxRef = useRef(null);
  const selectAssetFromList = (e: any, row: assetRow) => {
    if (!e.target.checked)
      setCheckedAll(false)
    setChecked({ ...isChecked, [row.assetId]: e.target.checked });
    /*
    * * Change made to tackle situation, in which it is mandatory to select checkbox.  
    */
    setSelectedItems([...selectedItems, row]);
    if (e.target.checked)
      setSelectedItems((prevArr) => [...prevArr, row]);
    else
      setSelectedItems((prevArr) => prevArr.filter((e) => e.id !== row.id));
  }

  const selectAllAssetFromList = (e: any) => {

    setCheckedAll(e.target.checked == true ? true : false)
    rows.forEach((row: AssetBucket, index: number) => {
      isChecked[row.assetId] = e.target.checked;
    })
    setSelectedItems([])
  }

  useEffect(() => {
    const setSelectFill = [...selectedItems];
    assetBucketData.forEach((element: any) => {
      setSelectFill.push(element);
    })
    if (isCheckedAll)
      setSelectedItems(setSelectFill);

    isCheckedAll == true ? setSelectedItems(setSelectFill) : setSelectedItems([])
  }, [isCheckedAll]);

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
                  isDragDisabled={true}>

                  {(provided: any) => (
                    <div id="divMainBucket"
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
                          <i className="icon icon-cross2" onClick={() => setIsOpen(false)}></i>
                        </CRXColumn>
                      </CRXRows>

                      <CRXRows container spacing={0} className={showMessageClx} >
                        <CRXColumn item xs={12} className="topColumn">
                          <CRXAlert
                            className="crx-alert-notification"
                            alertType="inline"
                            message={attention.msg}
                            type="info"
                            open={showAttention}
                            setShowSucess={setShowAttention}

                          />
                          {/* <CRXAlert
                            className="crx-alert-notification"
                            message={sucess.msg}
                            type="success"
                            open={showSucess}
                            setShowSucess={setShowSucess}
                          />*/}

                        </CRXColumn>
                      </CRXRows>
                      {showErrorMsg && <CRXRows className={errorMsgClass}>
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
                      </CRXRows>}
                      <CRXRows container spacing={0} className={isMetaDataOpen ? "file-upload-show" : "file-upload-hide"} >
                        <CRXAlert
                          className={"crx-alert-notification file-upload"}
                          message={"sucess.msg"}
                          type="info"
                          open={showUploadAttention}
                          setShowSucess={setShowUploadAttention}
                          alertType="inline"
                          persist={true}
                          children={<div className="check"><div className="attentionPera">Please add metadata to finish saving your uploaded files</div>
                            <div className="btn-center">
                              <CRXButton
                                id="metdaModalButton"
                                className="MuiButton-containedPrimary"
                                onClick={handleClickOpen}
                                color='primary'
                                variant='contained'

                              >
                                {t("Add_metadata")}
                              </CRXButton>
                            </div>
                          </div>
                          }
                        />


                        <CRXModalDialog
                          className="add-metadata-window __Add__MetaData__Window__"
                          maxWidth="xl"
                          title={t("Choose_asset_metadata")}
                          cancelButtonTxt="Cancel"
                          showSticky={true}
                          modelOpen={isModalOpen}
                          onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}

                        >
                          <AddMetadataForm
                            setCloseWithConfirm={setCloseWithConfirm}
                            onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
                            uploadFile={files}
                            setAddEvidence={setonAddEvidence}
                            uploadAssetBucket={assetBucketData}
                            activeScreen={activeScreen}
                            setActiveScreen={setActiveScreen}
                          />
                        </CRXModalDialog>
                      </CRXRows>
                      {!isFileUploadHide ?
                        <Restricted moduleId={1}>
                          <div className="uploadContent">
                            <div className="iconArea">
                              <i className="fas fa-layer-plus"></i>
                            </div>
                            <div className="textArea">
                              {t("Drag_and_drop_an")} <b>{t("asset")}</b> {t("to_the_Asset_Bucket_to_add_or_use_the")}
                              <br />
                              <div>
                                <input
                                  style={{ display: "none" }}
                                  id="upload-Button-file"
                                  multiple
                                  type="file"
                                  onChange={handleOnUpload}

                                />
                                <label htmlFor="upload-Button-file">
                                  <a className="textFileBrowser">{t("file_browser")}</a>
                                </label>
                              </div>
                            </div>
                          </div>
                        </Restricted>
                        : <></>
                      }

                      {
                        isMainProgressBarOpen && !onAddEvidence && <>
                          <div className="uploading-text">{totalFilePer == 100 ? "Uploaded:" : "Uploading:"} </div>
                          <div className="crxProgressbarBucket mainProgressBar">
                            <CRXProgressBar
                              id="raw"
                              loadingText={fileCount > 1 ? fileCount + ` ${t("assets")} ` + "(" + totalFileSize + ")" : fileCount + ` ${t("asset")} ` + "(" + totalFileSize + ")"}
                              value={totalFilePer}
                              error={mainProgressError}
                              maxDataSize={true}
                              width={410}
                            // loadingCompleted={"uploadFileSize"}//"5.0Mb"
                            />
                          </div>
                        </>}
                      {
                        uploadInfo.filter(x => x.uploadInfo.removed != true).length > 0 && fileCount > 0 && isSubProgressBarOpen && <CrxAccordion
                          title={t("Upload_Details")}
                          id="accorIdx2"
                          className="crx-accordion crxAccordionBucket"
                          ariaControls="Content2"
                          name="panel1"
                          isExpanedChange={isExpaned}
                          expanded={expanded === "panel1"}
                        >
                          {uploadProgressStatus()}

                        </CrxAccordion>}

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
                            /><span className="selectAllText">{t("Select_All")}</span>
                            {t("View_on_assets_bucket_page")} <i className="icon icon-arrow-up-right2"></i>{" "}
                          </div>
                          <div className="bucketScroll">
                            <div className="bucketList" id="assetBucketLists">
                              {
                                assetBucketData.map((x: any, index) => {
                                  return <div className="bucketLister">
                                    <div className="assetCheck">

                                      <CRXCheckBox
                                        inputRef={checkBoxRef}
                                        checked={isChecked[x.assetId] || isCheckedAll}
                                        onChange={(e: any) => selectAssetFromList(e, x)}
                                        name={x.assetId}
                                        lightMode={true}
                                      />
                                    </div>
                                    <div className="bucketThumb"><AssetThumbnail assetType={x.assetType} fontSize="61pt" /></div>
                                    <div className="bucketListTextData">
                                      {
                                        x?.isMaster ?
                                          <>
                                            <div className="bucketListAssetName">{x.assetName}</div>
                                            <div className="bucketListRec">{x.assetType}</div>
                                          </>
                                          :
                                          x?.asset?.filter((y: any) => y.assetId === x.selectedAssetId).map((u: any) => (
                                            <>
                                              <div className="bucketListAssetName">{u.assetName}</div>
                                              <div className="bucketListRec">{u.assetType}</div>
                                            </>
                                          ))
                                      }
                                      <div className="bucketListRec">
                                        {x.categories.map((item: any) => item).join(", ")}
                                      </div>
                                    </div>
                                    <div className="bucketActionMenu">{<BucketActionMenu
                                      row={x}
                                      setSelectedItems={setSelectedItems}
                                      selectedItems={selectedItems} />
                                    }
                                    </div>
                                  </div>
                                })
                              }
                            </div>
                          </div>

                        </>
                      ) : (
                        <div className="bucketContent">{t("Your_Asset_Bucket_is_empty.")}</div>
                      )
                      }

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
          <div className='uploadCancelText'>
            {t("You are attempting to")} <strong>{t("remove")}</strong> {t("the file")} <strong>({fileToRemove})</strong> {t("asset from this upload.")}  {t("Once you remove it")}, {t("you will not be able to undo this action.")}
          </div>
          <div className='uploadCancelBottom'>
            {t("Are you sure you would like to")} <strong>{t("remove")}</strong> {t("this asset from this upload?")}
          </div>
        </div>

      </CRXConfirmDialog>
    </>
  );
};

export default CRXAssetsBucketPanel;
