import React, { useEffect } from "react";
import {
  CRXDrawer,
  CRXRows,
  CRXColumn,
  CRXDataTable,
  CRXAlert,
  CRXBadge,
  CRXTooltip,
  CRXRootRef,
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
import {addNotificationMessages }  from "../../../Redux/notificationPanelMessages";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { NotificationMessage } from "../CRXNotifications/notificationsTypes"

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
  const [sucess, setSucess] = React.useState<{  msg: string }>({
    msg: "",
  });
  const [attention, setAttention] = React.useState<{ msg: string }>({
    msg: "",
  });
  const [showSucess, setShowSucess] = React.useState<boolean>(false);
  const [showMessageClx, setShowMessageClx] = React.useState<string>("bucketMessageHide");
  const [showAttention, setShowAttention] = React.useState<boolean>(false);

  const prevCount = usePrevious(assetBucketData.length);
  const prevIsDuplicate = usePrevious(isDuplicateFound);
  const [files, setFiles] = React.useState<any>(null);

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
      width : "116px",
      marginLeft : "-1px",
      whiteSpace : "nowrap",
      overFlow : "hidden",
      textOverflow : "ellipsis",
      marginRight : "0",
      paddingLeft : "5px !important",
      paddingRight : "10px !important",
      fontSize : "13px",
      lineHeight : "15px",
      top : "0px",
      marginTop : "0"
    }
    const paddLeft = {
      marginLeft : "2px",
      paddingRight: "3px !important",
      marginRight : "2px",
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
    if(windowSize < 1080 && rows.length < 3) {
      setScroll("hideScroll");
      
    }else if(windowSize >= 1080 && rows.length < 4) {
      setScroll("hideScroll");
    }else {
      setScroll("");
    }
  },[rows, sucess])

  useEffect(() => {
    if(sucess.msg !== undefined && sucess.msg !== "") {
      let notificationMessage: NotificationMessage = {
          title: "Asset Bucket", 
          message: sucess.msg, 
          type: "success",
          date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  },[sucess])

  useEffect(() => {
    if(attention.msg !== undefined && attention.msg !== "") {
      let notificationMessage: NotificationMessage = {
          title: "Asset Bucket", 
          message: attention.msg, 
          type: "info",
          date: moment(moment().toDate()).local().format("YYYY / MM / DD HH:mm:ss")
      }
      dispatch(addNotificationMessages(notificationMessage));
    }
  },[attention])

  const handleOnUpload = (e:any) => {
    setFiles(e.target.files);
  };

  useEffect(() => {
    console.log("Files ",files);
  },[files])

  //const onUpload = async (e: any) => {
    //e.preventDefault();

    //let res = await uploadFile(file);
    //console.log(res.data);
  //};

  //const uploadFile = async (file:any) => {
    // const formData = new FormData();
    // formData.append("avatar", file);

    // return await axios.post(UPLOAD_ENDPOINT, formData, {
    //   headers: {
    //     "content-type": "multipart/form-data"
    //   }
    // });
  //};
  React.useEffect(()=> {

    const trAtiveValue =  document.querySelector(".rc-menu--open")?.closest("tr[class*='MuiTableRow-hover-']");

    let dataui = document.querySelectorAll("tr[class*='MuiTableRow-root-']");

    let trAtiveArray = Array.from(dataui);

    trAtiveArray.map((e)=>{

       if(e.classList.contains("SelectedActionMenu")) {

         e.classList.remove("SelectedActionMenu")

       } else {

        trAtiveValue?.classList.add("SelectedActionMenu");
       }

     })

  })
  return (
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
    <CRXRows container spacing={0} className={showSucess ? " " : "bucketMessageHide"}>
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
                    <div className="uploadContent">
                      <div className="iconArea">
                        <i className="fas fa-layer-plus"></i>
                      </div>
                      <div className="textArea">
                        Drag and drop an <b>asset</b> to the Asset Bucket to add, or use the
                        <br />
                        <div>
                          <input
                            style={{display:"none"}}
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
                      className={`ManageAssetDataTable crxTableHeight bucketDataTable ${scrollHide}  ${ showMessageClx == "bucketMessageHide" ? '' : 'crxMessageShow' }`}
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
  );
};

export default CRXAssetsBucketPanel;
