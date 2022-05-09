import React, { useEffect, useState, useRef } from "react";
import {
  CRXDrawer,
  CRXRows,
  CRXColumn,
  CRXDataTable,
  CRXAlert,
  CRXBadge,
  CRXTooltip,
  CRXRootRef,
  CRXProgressBar,
  CRXToaster,
  CrxAccordion, 
  CRXConfirmDialog,
  CRXButton
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
  onResizeRow,
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
import { AddFilesToFileService, getFileSize } from "../../../GlobalFunctions/FileUpload"
import { CRXModalDialog } from "@cb/shared";
import AddMetadataForm from "./AddMetadataForm";
import Cookies from 'universal-cookie';
import { FILE_SERVICE_URL } from '../../../utils/Api/url'
declare const window: any;
window.onRecvData = new CustomEvent("onUploadStatusUpdate");
window.onRecvError = new CustomEvent("onUploadError");

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

const CRXAssetsBucketPanel = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );
  const isDuplicateFound: boolean = useSelector(
    (state: RootState) => state.assetBucket.isDuplicateFound
  );
  const [selectedItems, setSelectedItems] = React.useState<assetRow[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<assetRow>();
  const [rows, setRows] = React.useState<AssetBucket[]>(assetBucketData);
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  const [scrollHide, setScroll] = React.useState("");
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
  //--for asset upload
  const dispatch = useDispatch()

  useEffect(() => {
    // on load check asset bucket exists in local storage
    dispatch(loadFromLocalStorage());
  }, [])

  useEffect(() => {
    if (isDuplicateFound != prevIsDuplicate && prevIsDuplicate != undefined && isDuplicateFound !== false) {
      setAttention({
        msg: "An Asset you are attempting to add to the Asset Bucket has already been added",
      });
      setShowAttention(true);
      dispatch(updateDuplicateFound());
    }
  }, [isDuplicateFound])

  useEffect(() => {
    setRows(assetBucketData);
    let local_assetBucket = localStorage.getItem("assetBucket");
    if (local_assetBucket !== null && JSON.parse(local_assetBucket).length != 0 && prevCount == 0 && assetBucketData.length > prevCount) {
      setSucess({
        msg: "You have added the selected assets to the asset bucket.",
      });
      setShowMessageClx("bucketMessageShow")
      setShowSucess(true);
    }
    else if (assetBucketData.length > prevCount) {
      setSucess({
        msg: "You have added the selected assets to the asset bucket.",
      });
      setShowMessageClx("bucketMessageShow")
      setShowSucess(true);
    }
    else if (assetBucketData.length < prevCount) {
      const totalRemoved = prevCount - assetBucketData.length;
      setShowMessageClx("bucketMessageShow")
      setShowSucess(true);
      setSucess({
        msg: `${totalRemoved} ${totalRemoved > 1 ? "assets" : "asset"
          } removed the asset bucket`,
      });
    }
  }, [assetBucketData]);

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => {
      setShowAttention((prev: boolean) => false);
      setShowSucess((prev: boolean) => false);
      setShowMessageClx("bucketMessageHide");
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, [isDuplicateFound == true]);

  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => {
      setShowSucess((prev: boolean) => false);
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, [assetBucketData.length]);

  const bucketIconByState = assetBucketData.length > 0 ? "icon-drawer" : "icon-drawer2"
  const ToggleButton = (
    <CRXBadge itemCount={assetBucketData.length} color="primary">
      <CRXTooltip
        className="bucketIcon"
        title="Asset Bucket can be used to build cases and do one action on many assets at the same time."
        iconName={"fas " + bucketIconByState}
        placement="left"
        arrow={true}
      ></CRXTooltip>
    </CRXBadge>
  );
  const toggleState = () => setIsOpen((prevState: boolean) => !prevState);

  const searchText = (
    rowsParam: AssetBucket[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    const onChange = (valuesObject: ValueString[]) => {
      headCells[colIdx].headerArray = valuesObject;
      onSelection(valuesObject, colIdx);
    };

    return (
      <TextSearch headCells={headCells} colIdx={colIdx} onChange={onChange} />
    );
  };

  const searchMultiDropDown = (
    rowsParam: AssetBucket[],
    headCells: HeadCellProps[],
    colIdx: number
  ) => {
    const onSetSearchData = () => {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    };

    const onSetHeaderArray = (v: ValueString[]) => {
      headCells[colIdx].headerArray = v;
    };
    const noOptionStyled = {
      width: "116px",
      marginLeft: "-1px",
      whiteSpace: "nowrap",
      overFlow: "hidden",
      textOverflow: "ellipsis",
      marginRight: "0",
      paddingLeft: "5px !important",
      paddingRight: "10px !important",
      fontSize: "13px",
      lineHeight: "15px",
      top: "0px",
      marginTop: "0"
    }
    const paddLeft = {
      marginLeft: "2px",
      paddingRight: "3px !important",
      marginRight: "2px",
      paddingLeft: "2px",


    }
    return (
      <MultSelectiDropDown
        headCells={headCells}
        colIdx={colIdx}
        reformattedRows={rowsParam}
        isSearchable={true}
        onMultiSelectChange={onSelection}
        onSetSearchData={onSetSearchData}
        onSetHeaderArray={onSetHeaderArray}
        widthNoOption={noOptionStyled}
        checkedStyle={paddLeft}
      />
    );
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: `${t("ID")}`,
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
      label: `${t("AssetThumbnail")}`,
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
      label: `${t("Categories")}`,
      id: "categories",
      align: "left",
      dataComponent: (e: string[]) => multitextDisplay(e, ""),
      sort: true,
      searchFilter: true,
      searchComponent: searchMultiDropDown,
      minWidth: "100",
      maxWidth: "100",
    },
  ]);

  const onSelection = (v: ValueString[], colIdx: number) => {
    if (v.length > 0) {
      for (var i = 0; i < v.length; i++) {
        let searchDataValue = onSetSearchDataValue(v, headCells, colIdx);
        setSearchData((prevArr) =>
          prevArr.filter(
            (e) => e.columnName !== headCells[colIdx].id.toString()
          )
        );
        setSearchData((prevArr) => [...prevArr, searchDataValue]);
      }
    } else {
      setSearchData((prevArr) =>
        prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
      );
    }
  };

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

  const resizeRow = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
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
        title: "Asset Bucket",
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
        title: "Asset Bucket",
        message: attention.msg,
        type: "info",
        date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  }, [attention])

  //--for asset upload
  const handleOnUpload = async (e: any) => {

    for (let i = 0; i < e.target.files.length; i++) {
      let fileName = e.target.files[i].name.replaceAll(' ', '_');

      if (fileName.length < 3 || fileName.length > 128) {
        toasterRef.current.showToaster({
          message: "Minimum 3 and maximum 128 characters are allowed", variant: "error", duration: 7000, clearButtton: true
        });
        return false;
      }
      else {
        var pattern = new RegExp("^([A-Z]|[a-z]){1}[A-Za-z0-9._-]*$");
        if (!pattern.test(fileName)) {
          toasterRef.current.showToaster({
            message: "Only alphabets, digits and _, - are allowed. Must start with an alphabet only", variant: "error", duration: 7000, clearButtton: true
          });
          return false;
        }
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
  }

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
    fileId: string
  }

  const [uploadInfo, setUploadInfo] = useState<FileUploadInfo[]>([]);
  const [totalFilePer, setTotalFilePer] = React.useState<any>(0);
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [expanded, isExpaned] = React.useState<string | boolean>();
  const [isOpenConfirm, setIsOpenConfirm] = React.useState<boolean>(false);
  const [fileToRemove, setFileToRemove] = React.useState<string>("");

  const uploadStatusUpdate = (data: any) => {

    let _uploadInfo: FileUploadInfo;
    setUploadInfo(prevState => {
      if (prevState.length > 0) {
        const newUploadInfo = [...prevState];
        const rec = newUploadInfo.find(x => x.fileName == data.data.fileName);

        if (rec != undefined || rec != null) {

          if (data.data.error != undefined || data.data.error != null) {
            rec.uploadInfo.error = true;
            return [...newUploadInfo]
          }
          if (data.data.removed != undefined || data.data.removed != null) {
            rec.uploadInfo.removed = true;
            return [...newUploadInfo]
          }
          rec.fileName = data.data.fileName;
          rec.fileId = data.data.fileId;
          rec.uploadInfo = {
            uploadValue: data.data.percent,
            uploadText: data.data.fileName,
            uploadFileSize: data.data.loadedBytes + " of " + data.data.fileSize,
            error: false
          };

          return [...newUploadInfo]
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
    fileName: string
  }
  const [mainProgressError, setMainProgressError] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setIsModalOpen(true);
  }
  const handleClose = (e: any) => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    var totalPercentage = 0;
    var errorCount = 0;

    uploadInfo.map((x) => {
      if (x.uploadInfo.removed != true) {
        totalPercentage = totalPercentage + x.uploadInfo.uploadValue;
      }
      if (x.uploadInfo.error == true) {
        errorCount++;
      }
    });

    if (totalPercentage != 0) {
      setTotalFilePer(Math.round(totalPercentage / fileCountRef.current));
    }

    if (errorCount == fileCount && (errorCount != 0 && fileCount != 0)) {
      setMainProgressError(true);
    }
    else {
      setMainProgressError(false);
    }
  }, [uploadInfo])

  useEffect(() => {
    if (totalFilePer === 100) {
      setShowUploadAttention(true);
    }

  }, [totalFilePer])

  const getUploadInfo = (data: any) => {
    return {
      fileName: data.data.fileName,
      fileId: data.data.fileId,
      uploadInfo: {
        uploadValue: data.data.percent,
        uploadText: data.data.fileName,
        uploadFileSize: data.data.loadedBytes + " of " + data.data.fileSize,
        error: false
      }
    };
  }
  const uploadError = (data: any) => {
    toasterRef.current.showToaster({
      message: data.data.message, variant: data.data.variant, duration: data.data.duration, clearButtton: data.data.clearButtton
    });
    setFileCount((prev) => { return prev >= data.data.fileCountAtError ? prev - data.data.fileCountAtError : prev })
    setFiles((pre) => {
      return pre.filter(x => x.id !== data.data.filesId[0]);
    })
  }


  useEffect(() => {
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
                <button onClick={() => cancelFileUpload(item)}><i className="fas fa-minus-circle"></i></button>
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
  const cancelFileUpload = (file: FileUploadInfo) => {
    setFileToRemove(file.fileName);
    setIsOpenConfirm(true);
  }
  const onConfirm = () => {
    window.tasks[fileToRemove].abort();
    setFileCount(prev => {
      fileCountRef.current = prev - 1;
      return prev - 1;
    });
    setFiles(files.filter(x => x.uploadedFileName != fileToRemove));
    updateFileStatus(files.find(x => x.uploadedFileName == fileToRemove))
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
        message: "File has been removed successfully", variant: "success", duration: 7000, clearButtton: true
      });
    }
    else {

    }
  }
  //for asset upload--

  React.useEffect(() => {

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

  })

  return (
    <>
      <CRXToaster ref={toasterRef} />
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
                    <div id="divMainBucket"
                      className="divMainBucket"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CRXRows container spacing={0}>
                        <CRXColumn item xs={11} className="bucketPanelTitle">
                          <label>Your Asset Bucket</label>
                        </CRXColumn>
                        <CRXColumn item xs={1} className="topColumn">
                          <i className="icon-cross2" onClick={() => setIsOpen(false)}></i>
                        </CRXColumn>
                      </CRXRows>
                      <CRXRows container spacing={0} className={showMessageClx} >
                        <CRXColumn item xs={12} className="topColumn">
                          <CRXAlert
                            className="crx-alert-notification"

                            message={attention.msg}
                            type="info"
                            open={showAttention}
                            setShowSucess={setShowAttention}
                          />
                          <CRXAlert
                            className="crx-alert-notification"
                            message={sucess.msg}
                            type="success"
                            open={showSucess}
                            setShowSucess={setShowSucess}
                          />

                        </CRXColumn>
                      </CRXRows>
                      <CRXRows container spacing={0} className={totalFilePer === 100 ? "file-upload-show" : "file-upload-hide"} >
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
                                  Add metadata
                              </CRXButton>
                            </div>
                          </div>
                          }
                        />
                        <CRXModalDialog
                          className="add-metadata-window"
                          primaryButton={true}
                          secondaryButton={true}
                          maxWidth="xl"
                          title="Choose asset metadata"
                          saveButtonTxt={isNext == false ? "Save" : "Next"}
                          cancelButtonTxt="Cancel"
                          showSticky={false}
                          modelOpen={isModalOpen}
                          onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
                        >
                          <AddMetadataForm
                            setCloseWithConfirm={setCloseWithConfirm}
                            onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
                            onSave
                            uploadFile={files}
                            setNextButton={setIsNext}
                            uploadAssetBucket={assetBucketData}
                          />
                        </CRXModalDialog>
                      </CRXRows>
                      <div className="uploadContent">
                        <div className="iconArea">
                          <i className="fas fa-layer-plus"></i>
                        </div>
                        <div className="textArea">
                          Drag and drop an <b>asset</b> to the Asset Bucket to add, or use the
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
                              <a className="textFileBrowser">file browser</a>
                            </label>
                          </div>

                        </div>

                      </div>
                      {fileCount > 0 && <>
                        <div className="uploading-text">{showUploadAttention ? "Uploaded:" : "Uploading:"} </div>
                        <div className="crxProgressbarBucket mainProgressBar">
                          <CRXProgressBar
                            id="raw"
                            loadingText={fileCount > 1 ? fileCount + " assets " + "(" + totalFileSize + ")" : fileCount + " asset " + "(" + totalFileSize + ")"}
                            value={totalFilePer}
                            error={mainProgressError}
                            maxDataSize={true}
                            width={410}
                          // loadingCompleted={"uploadFileSize"}//"5.0Mb"
                          />
                        </div>
                      </>}
                      {
                        uploadInfo.filter(x => x.uploadInfo.removed != true).length > 0 && <CrxAccordion
                          title="Upload Details"
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
                            View on Assets Bucket page <i className="icon-arrow-up-right2"></i>{" "}
                          </div>
                          <CRXDataTable
                            tableId="assetBucket"
                            actionComponent={<BucketActionMenu
                              row={selectedActionRow}
                              setSelectedItems={setSelectedItems}
                              selectedItems={selectedItems} />
                            }
                            getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
                            showToolbar={false}
                            dataRows={rows}
                            headCells={headCells}
                            orderParam={order}
                            orderByParam={orderBy}
                            searchHeader={true}
                            columnVisibilityBar={true}
                            className={`ManageAssetDataTable crxTableHeight bucketDataTable ${scrollHide}  ${showMessageClx == "bucketMessageHide" ? '' : 'crxMessageShow'}`}
                            getSelectedItems={(v: assetRow[]) => setSelectedItems(v)}
                            onResizeRow={resizeRow}
                            setSelectedItems={setSelectedItems}
                            selectedItems={selectedItems}
                            dragVisibility={false}
                          />
                        </>
                      ) : (
                        <div className="bucketContent">Your Asset Bucket is empty.</div>
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
        title="Please confirm"
        setIsOpen={setIsOpenConfirm}
        onConfirm={onConfirm}
        isOpen={isOpenConfirm}
        primary="Yes, remove"
        secondary="No, do not remove"
        maxWidth="sm"
      >
        <div className="crxUplockContent">
        <div className='uploadCancelText'>
            You are attempting to <strong>remove</strong> the <strong>(file name.file type)</strong> asset from this upload.  Once you remove it, you will not be able to undo this action.
        </div>
        <div className='uploadCancelBottom'>
        Are you sure you would to <strong>remove</strong>  this asset from this upload?
          </div>
        </div>

      </CRXConfirmDialog>
    </>
  );
};

export default CRXAssetsBucketPanel;
