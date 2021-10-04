import React, { useEffect } from "react";
import {
  CRXDrawer,
  CRXRows,
  CRXColumn,
  CRXDataTable,
  CRXAlert,
  CRXBadge,
  CRXTooltip,
  CRXRootRef
} from "@cb/shared";
import BucketActionMenu from "../../Assets/components/ActionMenu/BucketActionMenu";
import "./CRXBucket.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { AssetThumbnail } from "../../Assets/components/DataGrid/AssetThumbnail";
import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onTextCompare,
  onMultiToMultiCompare,
  onSetSearchDataValue,
} from "../../../utils/globalDataTableFunctions";
import textDisplay from "../../../components/DateDisplayComponent/TextDisplay";
import multitextDisplay from "../../../components/DateDisplayComponent/MultiTextDisplay";
import MultSelectiDropDown from "../../../components/SearchComponents/MultSelectiDropDown";
import TextSearch from "../../../components/SearchComponents/TextSearch";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { assetRow } from "../../Assets/components/ActionMenu/types";

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

const CRXAssetsBucketPanel = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket
  );
  const [selectedItems, setSelectedItems] = React.useState<assetRow[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<assetRow>();
  const [rows, setRows] = React.useState<AssetBucket[]>(assetBucketData);
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");

  useEffect(() => {
    //const data:AssetBucket[]= assetBucketData.map((d:AssetBucket)=> ( { id:d.id,assetId:d.assetId,assetName:d.assetName,recordingStarted:d.recordingStarted,categories:d.categories}))
    setRows(assetBucketData);
  }, [assetBucketData]);

  const ToggleButton = (
    <CRXBadge itemCount={assetBucketData.length} color="primary">
      <CRXTooltip
        className="bucketIcon"
        title="Asset Bucket can be used to build cases and do one action on many assets at the same time."
        iconName="fas icon-drawer2"
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

    return (
      <MultSelectiDropDown
        headCells={headCells}
        colIdx={colIdx}
        reformattedRows={rowsParam}
        isSearchable={true}
        onMultiSelectChange={onSelection}
        onSetSearchData={onSetSearchData}
        onSetHeaderArray={onSetHeaderArray}
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
    {
      label: `${t("AssetID")}`,
      id: "assetName",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, "linkColor"),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      minWidth: "100",
      maxWidth: "100",
    },
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

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

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

  return (  
    <CRXDrawer
      className="CRXBucketPanel"
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
      <CRXRows container spacing={0}>
        <CRXColumn item xs={12} className="topColumn">
          <CRXAlert
            className="crx-alert-notification"
            message="check it out"
            type="success"
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
                      <span className="textFileBrowser">file browser</span>
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
                        selectedItems={selectedItems} />}
                        getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
                        showToolbar={false}
                        dataRows={rows}
                        headCells={headCells}
                        orderParam={order}
                        orderByParam={orderBy}
                        searchHeader={true}
                        columnVisibilityBar={true}
                        allowDragableToList={false}
                        className="ManageAssetDataTable crxTableHeight bucketDataTable"
                        getSelectedItems={(v: assetRow[]) => setSelectedItems(v)}
                        onResizeRow={resizeRow}
                        dragVisibility={false}
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}
                      />
                    </>
                  ) : (
                    <div className="bucketContent">Your Asset Bucket is empty.</div>
                  )
                }
                </div>
              )}
            </Draggable>
          </>
        </CRXRootRef>      
        )}
      </Droppable>
    </CRXDrawer>    
  );
};

export default CRXAssetsBucketPanel;
