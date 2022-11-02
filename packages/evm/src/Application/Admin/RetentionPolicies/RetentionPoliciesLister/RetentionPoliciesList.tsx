import React, { useEffect,useRef,useState,useContext} from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import RetentionPoliciesTemplateActionMenu from './RetentionPoliciesTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './retentionPoliciesList.scss'
import anchorDisplay from '../../../../utils/AnchorDisplay';
import { urlList, urlNames } from "../../../../utils/urlList"
import { useHistory } from "react-router-dom";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton } from "@cb/shared";
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import RetentionPoliciesDetail from "../RetentionPoliciesDetail/RetentionPoliciesDetail";


import {
  SearchObject,
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onSetSearchDataValue,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  PageiGrid,
  GridFilter
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import {CRXAlert} from "@cb/shared";
import {getAllRetentionPoliciesFilter} from '../../../../Redux/RetentionPolicies';
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import Restricted from "../../../../ApplicationPermission/Restricted";
import { number } from "yup/lib/locale";


type RetentionPoliciesTemplate = {
  id : number;
  name: string;
  retentionTimeOrSpace: string;
  softDeleteTime: string;  
  description: string;
}

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const RetentionPoliciesList: React.FC = () => {
  const { t } = useTranslation<string>();
  const [id, setId] = React.useState<number>(0);
  const [title, setTitle] = React.useState<string>("");
  const [rows, setRows] = React.useState<RetentionPoliciesTemplate[]>([]);
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<RetentionPoliciesTemplate[]>([]);
  const [selectedActionRow,setSelectedActionRow] = useState<RetentionPoliciesTemplate[]>();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [paging, setPaging] = React.useState<boolean>();
  const [openModel, setOpenModel] = React.useState<boolean>(false);  
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage
  })
  const dispatch = useDispatch();
  let history = useHistory();

  const isFirstRenderRef = useRef<boolean>(true);
  const reformattedRowsRef = useRef<RetentionPoliciesTemplate[]>();
  const filterRetentionPolicies: any = useSelector((state: RootState) => state.retentionPoliciesSlice.filterRetentionPolicies);
  const { getModuleIds} = useContext(ApplicationPermissionContext);
  useEffect(() => {
    if(paging)
      setRetentionPoliciesData()
    setPaging(false)
  },[pageiGrid])

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage}); 
    setPaging(true)
    
  },[page, rowsPerPage])

  useEffect(() => {
    setRetentionPoliciesData();
    isFirstRenderRef.current = false;
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "RetentionPoliciesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
}, []);


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
      rowsParam: RetentionPoliciesTemplate[],
      headCell: HeadCellProps[],
      colIdx: number
    ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject,colIdx)} />
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
      label: `${t("Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) =>  textDisplay(e, " "),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "300",
      width: "500", 
      maxWidth: "600"
    },
    {
      label: `${t("Retention_Time_Or_Space")}`,
      id: "retentionTimeOrSpace",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, " "),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "100",
      width: "100",
      maxWidth: "100"
    },
    {
      label: `${t("Soft_Delete_Time")}`,
      id: "softDeleteTime",
      align: "left",
      dataComponent: (e: string) =>  textDisplay(e, " "),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "100",
      width: "100",
      maxWidth: "100"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) =>  textDisplay(e, " "),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "300",
      width: "400",
      maxWidth: "500"
    },

  ]);

  const setRetentionPoliciesData = () => {
    let RetentionPoliciesTemplateRows: RetentionPoliciesTemplate[] = []
    if (filterRetentionPolicies?.data && filterRetentionPolicies?.data.length > 0) {
      RetentionPoliciesTemplateRows = filterRetentionPolicies?.data.map((template: any) => {
        return { 
            id: template.id,
            name:template.name ,
            retentionTimeOrSpace:  getTimeSpaceValue(template.detail.limit.hours) ,
            softDeleteTime: getTimeSpaceValue(template.detail.limit.gracePeriodInHours) ,
            description: template.description , 
        }
      })
    }

    setRows(RetentionPoliciesTemplateRows);
    reformattedRowsRef.current = RetentionPoliciesTemplateRows;
  }

  console.log(filterRetentionPolicies);

  React.useEffect(() => {
    setRetentionPoliciesData();
  }, [filterRetentionPolicies?.data]);

  React.useEffect (() => {
    dispatch(getAllRetentionPoliciesFilter(pageiGrid));
  },[])

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const getSuccessUpdate = () => {
    setSuccess(true);
  }

  const RetentionPoliciesAction = () => {
    dispatch(getAllRetentionPoliciesFilter(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllRetentionPoliciesFilter(pageiGrid));
    setSearchData([]);
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };

  const onClickOpenModel = (modelOpen: boolean,id:number,title:string) => {    
    setId(id);
    setTitle(title);
    setOpenModel(modelOpen);
  }

  const getTimeSpaceValue = (hours: number) => {
    let days = parseInt(String(hours/24));
    let remainingHours = hours - (days * 24); 
    return days + "d " + remainingHours  +"h ";        
  }

  const updateOpenModel = (modelOpen: boolean) => {
    setOpenModel(modelOpen);
    dispatch(getAllRetentionPoliciesFilter(pageiGrid))
  }
  return (
    <div className="CrxRetentionPoliciesTable switchLeftComponents">
          {success && (
              <CRXAlert
                message={t("Success_You_have_deleted_the_Retention_Policies")}
                alertType="toast"
                open={true}
              />
          )}
        {
        rows && (
          <CRXDataTable
            id="RetentionPoliciesTemplateDataTable"
            actionComponent={<RetentionPoliciesTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={RetentionPoliciesAction}
              getSelectedData= {getSelectedItemsUpdate}
              getSuccess = {getSuccessUpdate}
              onClickOpenModel = {onClickOpenModel}
            />}
            toolBarButton = {
              <>
              <Restricted moduleId={0}>
                
                 <CRXButton className="RetentionPoliciesBtn" onClick={() => { onClickOpenModel(true,0,"Create Retention Policy") }}>
                  {t("Create_Retention_Policies")}
                </CRXButton>
              </Restricted>              
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
            searchHeader={false}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={true}
            className="crxTableHeight crxTableDataUi RetentionPoliciesTableTemplate"
            onClearAll={clearAll}
            getSelectedItems={(v: RetentionPoliciesTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            offsetY={206}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(pages:any) => setPage(pages)}
            setRowsPerPage= {(setRowsPages:any) => setRowsPerPage(setRowsPages)}
            totalRecords={filterRetentionPolicies?.totalCount}

          />
         
        )
      }
      {
        openModel &&
       (<RetentionPoliciesDetail  id={id}  title={title}  openModel = {updateOpenModel} />)
      }
    </div>
  );
};

export default RetentionPoliciesList;
