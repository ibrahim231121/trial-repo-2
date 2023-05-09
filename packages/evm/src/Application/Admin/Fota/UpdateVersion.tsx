import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CRXButton, CRXDataTable, CRXToaster, CRXSelectBox } from "@cb/shared";
import { HeadCellProps, PageiGrid, SearchObject, ValueString, onClearAll, onResizeRow, onSaveHeadCellData, onSetHeadCellVisibility, onSetSearchDataValue, onSetSingleHeadCellVisibility, onTextCompare, Order } from "../../../GlobalFunctions/globalDataTableFunctions";
import { RootState } from "../../../Redux/rootReducer";
import { DeviceType, UpdateVersion } from "../../../utils/Api/models/UnitModels";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import TextSearch from "../../../GlobalComponents/DataTableSearch/TextSearch";
import textDisplay from "../../../GlobalComponents/Display/TextDisplay";
import { getAllUpdateVersionsPagedAsync } from "../../../Redux/UpdateVersionSlices";
import { ClickAwayListener } from "@material-ui/core";
import UpdateVersionsActionMenu from "./UpdateVersionActionMenu";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useHistory } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";


type UpdateVersionsObj = {
  id: number;
  version: string;
  createdOn: string;
  modifiedOn: string;
}

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const UpdateVersions: React.FC = () => {
  const history = useHistory();
  const retentionMsgFormRef = useRef<typeof CRXToaster>(null);
  const { t } = useTranslation<string>();
  const [id, setId] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [rows, setRows] = React.useState<UpdateVersionsObj[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<UpdateVersionsObj[]>([]);
  const [selectedActionRow, setSelectedActionRow] = useState<UpdateVersionsObj[]>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const [selectedDeviceType, setSelectedDeviceType] = React.useState<DeviceType | undefined>({ id: 0, name: "" });
  const [openAddNewFileModal, setOpenAddNewFileModal] = React.useState<boolean>(false);

  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage
  })
  const dispatch = useDispatch();
  const isFirstRenderRef = useRef<boolean>(true);
  const [reformattedRows, setReformattedRows] = React.useState<UpdateVersionsObj[]>([]);
  const filterUpdateVersions: any = useSelector((state: RootState) => state.updateVersionsSlice.updateVersionsPaged);


  // File upload



  useEffect(() => {
    if (paging)
      setUpdateVersions()
    setPaging(false)
  }, [pageiGrid])

  useEffect(() => {
    setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
    setPaging(true)

  }, [page, rowsPerPage])

  useEffect(() => {
    setUpdateVersions();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "CategoriesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
  }, []);

  const retentionFormMessages = (obj: any) => {
    retentionMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }
  const onChange = (valuesObject: ValueString[], colIdx: number) => {
    headCells[colIdx].headerArray = valuesObject;
    onSelection(valuesObject, colIdx);
  }

  const onSelection = (v: ValueString[], colIdx: number) => {
    if (v.length > 0) {
      for (let i = 0; i < v.length; i++) {
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
        prevArr.filter(
          (e) => e.columnName !== headCells[colIdx].id.toString()
        )
      );
    }
  }

  const searchText = (
    rowsParam: UpdateVersionsObj[],
    headCell: HeadCellProps[],
    colIdx: number
  ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject, colIdx)} />
    );
  };

  const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
    {
      label: t("ID"),
      id: "id",
      align: "right",
      dataComponent: () => null,
      sort: false,
      searchFilter: false,
      searchComponent: () => null,
      keyCol: true,
      visible: false,
      minWidth: "80",
      width: "",
      maxWidth: "100",
    },
    {
      label: `${t("Device Type")}`,
      id: "deviceType",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Version Number")}`,
      id: "version",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Total Devices")}`,
      id: "totalDevices",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Success")}`,
      id: "totalSuccess",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Fail")}`,
      id: "totalFail",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Pending")}`,
      id: "totalPending",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Date Created")}`,
      id: "createdOn",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    },
    {
      label: `${t("Last Updated")}`,
      id: "updateOn",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: true,
      searchFilter: true,
      searchComponent: searchText,
      width: "926",
      maxWidth: "800"
    }
  ]);

  const setUpdateVersions = () => {
    let UpdateVersionRows: UpdateVersionsObj[] = [];
    if (filterUpdateVersions?.data && filterUpdateVersions?.data.length > 0) {
      UpdateVersionRows = filterUpdateVersions?.data.map((updateVersion: UpdateVersion) => {
        return {
          id: updateVersion.id,
          name: updateVersion.name,
          deviceType: updateVersion.deviceType?.name,
          version: updateVersion.version,
          totalDevices: updateVersion.totalDevices,
          totalFail: updateVersion.totalFail,
          totalPending: updateVersion.totalPending,
          totalSuccess: updateVersion.totalSuccess,
          modifiedOn: updateVersion.history.modifiedOn,
          createdOn: updateVersion.history.createdOn
        }
      })
    }
    setRows(UpdateVersionRows);
    setReformattedRows(UpdateVersionRows)
  }

  const dataArrayBuilder = () => {
    let dataRows: UpdateVersionsObj[] = reformattedRows;
    searchData.forEach((el: SearchObject) => {
      dataRows = onTextCompare(dataRows, headCells, el);
    });
    setRows(dataRows);
  };

  React.useEffect(() => {
    setUpdateVersions();
  }, [filterUpdateVersions?.data]);

  React.useEffect(() => {
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
  }, [])

  useEffect(() => {
    dataArrayBuilder();
  }, [searchData]);

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const UpdateVersionsAction = () => {
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllUpdateVersionsPagedAsync(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const onClickOpenModel = (modelOpen: boolean, id: number, title: string) => {
    setId(id);
    setTitle(title);
    setOpenModel(modelOpen);
  }

  const onMessageShow = (isSuccess: boolean, message: string) => {
    retentionFormMessages({
      message: message,
      variant: isSuccess ? 'success' : 'error',
      duration: 7000
    });
  }

  const handleKeyDown = (event: any) => {
    // if (event.key === 'Enter') {
    //   getFilteredCategoryData()
    // }
  }

  const handleBlur = () => {
    // if(isSearchable) {     
    //   getFilteredCategoryData()
    // }
  }

  const onClickSchedule = () => {
    history.push(urlList.filter((item:any) => item.name === urlNames.filterUpdateVersion)[0].url);
  }


  return (
    <>
      <ClickAwayListener onClickAway={handleBlur}>
        <div className="switchLeftComponents manageCRXUpdateVersion" onKeyDown={handleKeyDown}>
          <CRXToaster ref={retentionMsgFormRef} />
          {
            rows && (
              <CRXDataTable
                id="CRXUpdateVersion"
                actionComponent={<UpdateVersionsActionMenu
                  row={selectedActionRow}
                  selectedItems={selectedItems}
                  getRowData={UpdateVersionsAction}
                  getSelectedData={getSelectedItemsUpdate}
                  getSuccess={getSuccessUpdate}
                  onClickOpenModel={onClickOpenModel}
                  onMessageShow={onMessageShow}
                />}
                toolBarButton={
                  <>
                  <Restricted moduleId={9}>
                    <CRXButton
                      id={"createVersion"}
                      className="primary manageVersionBtn" 
                      onClick={() => {onClickSchedule()}}
                    >
                        {t("Schedule Version Update")}
                    </CRXButton>
                    </Restricted>
                    {/* <CRXButton className="secondary manageUserBtn mr_L_10" onClick={() => getFilteredUserData()}> {t("Filter")} </CRXButton> */}
                  </>
                }
                getRowOnActionClick={(val: any) => setSelectedActionRow(val)}
                dataRows={rows}
                headCells={headCells}
                orderParam={ORDER_BY}
                orderByParam={ORDER_BY_PARAM}
                showToolbar={true}
                showCountText={false}
                columnVisibilityBar={true}
                dragVisibility={false}
                showCheckBoxesCol={true}
                showActionCol={true}
                searchHeader={true}
                allowDragableToList={false}
                showTotalSelectedText={false}
                showActionSearchHeaderCell={true}
                showCustomizeIcon={true}
                className="crxTableHeight crxTableDataUi RetentionPoliciesTableTemplate RetentionPoliciesTable_UI"
                onClearAll={clearAll}
                getSelectedItems={(v: UpdateVersionsObj[]) => setSelectedItems(v)}
                onResizeRow={resizeRowConfigTemp}
                onHeadCellChange={onSetHeadCells}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                page={page}
                rowsPerPage={rowsPerPage}
                setPage={(pages: any) => setPage(pages)}
                setRowsPerPage={(setRowsPages: any) => setRowsPerPage(setRowsPages)}
                totalRecords={filterUpdateVersions?.totalCount}
                //Please dont miss this block.
                offsetY={62}
                headerPositionInit={210}
                topSpaceDrag={98}
                
              //End here
              />

            )
          }
        </div>
      </ClickAwayListener>


    </>
  );
};

export default UpdateVersions;
