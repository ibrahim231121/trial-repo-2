import React, { useEffect,useRef,useState,useContext} from "react";
import { CRXDataTable } from "@cb/shared";
import { useTranslation } from "react-i18next";
import textDisplay from "../../../../GlobalComponents/Display/TextDisplay";
import { useDispatch, useSelector } from "react-redux";
import UploadPoliciesTemplateActionMenu from './UploadPoliciesTemplateActionMenu';
import TextSearch from "../../../../GlobalComponents/DataTableSearch/TextSearch";
import './uploadPoliciesList.scss'
import anchorDisplay from '../../../../utils/AnchorDisplay';
import { urlList, urlNames } from "../../../../utils/urlList"
import { useHistory } from "react-router-dom";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXButton } from "@cb/shared";
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';


import {
  ValueString,
  HeadCellProps,
  onResizeRow,
  Order,
  onSetSingleHeadCellVisibility,
  onClearAll,
  onSetHeadCellVisibility,
  onSaveHeadCellData,
  PageiGrid
} from "../../../../GlobalFunctions/globalDataTableFunctions";
import {CRXAlert,CRXToaster} from "@cb/shared";
import {getAllUploadPoliciesFilter} from '../../../../Redux/UploadPolicies';
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import Restricted from "../../../../ApplicationPermission/Restricted";


type UploadPoliciesTemplate = {
  id : number;
  description: string;
}

const ORDER_BY = "asc" as Order;
const ORDER_BY_PARAM = "recordingStarted";

const UploadPoliciesList: React.FC = () => {
  const { t } = useTranslation<string>();

  const [rows, setRows] = React.useState<UploadPoliciesTemplate[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<UploadPoliciesTemplate[]>([]);
  const [selectedActionRow,setSelectedActionRow] = useState<UploadPoliciesTemplate[]>();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [paging, setPaging] = React.useState<boolean>();
  const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: page,
    size: rowsPerPage
  })
  const uploadMsgFormRef = useRef<typeof CRXToaster>(null);
  const dispatch = useDispatch();
  let history = useHistory();

  const reformattedRowsRef = useRef<UploadPoliciesTemplate[]>();
  const filterUploadPolicies: any = useSelector((state: RootState) => state.uploadPoliciesSlice.filterUploadPolicies);
  const { getModuleIds} = useContext(ApplicationPermissionContext);
  useEffect(() => {
    if(paging)
      dispatch(getAllUploadPoliciesFilter(pageiGrid));
    setPaging(false)
  },[pageiGrid])
  

  useEffect(() => {
    document
      .querySelector(".footerDRP")
      ?.closest(".MuiMenu-paper")
      ?.classList.add("MuiMenu_Modal_Ui");
  });

  useEffect(() => {
    setPageiGrid({...pageiGrid, page:page, size:rowsPerPage}); 
    setPaging(true)
  },[page, rowsPerPage])

  useEffect(() => {
    let headCellsArray = onSetHeadCellVisibility(headCells);
    setHeadCells(headCellsArray);
    onSaveHeadCellData(headCells, "uploadPoliciesTemplateDataTable");
    dispatch(enterPathActionCreator({ val: "" }));
}, []);

React.useEffect(() => {
  setUploadPoliciesData();
}, [filterUploadPolicies?.data]);

    const onChange = (valuesObject: ValueString[], colIdx: number) => {
      headCells[colIdx].headerArray = valuesObject;      
    }

    const searchText = (
      headCell: HeadCellProps[],
      colIdx: number
    ) => {
    return (
      <TextSearch headCells={headCell} colIdx={colIdx} onChange={(valueObject) => onChange(valueObject,colIdx)} />
    );
  };

  const AnchorDisplay = (e: string) => {
    if(getModuleIds().includes(0)) {
    return anchorDisplay(e, "linkColor", urlList.filter((item:any) => item.name === urlNames.uploadPoliciesEdit)[0].url)
    }
    else{
    let lastid = e.lastIndexOf("_");
    let text =  e.substring(0,lastid)
    return textDisplay(text,"")
    }
  }

  const UploadFormMessages = (obj: any) => {
    uploadMsgFormRef?.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
      className : "policy"
    });
  }

  const onMessageShow = (isSuccess:boolean,message: string) => {
    UploadFormMessages({
      message: message,
      variant: isSuccess? 'success' : 'error',
      duration: 5000,
      className: "policy"
    });    
  }

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
      label: `${t("Policy_Name")}`,
      id: "name",
      align: "left",
      dataComponent: (e: string) => AnchorDisplay(e),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "300",
      width: "800",
      maxWidth: "1200",
      detailedDataComponentId: "name",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
    {
      label: `${t("Description")}`,
      id: "description",
      align: "left",
      dataComponent: (e: string) => textDisplay(e, ''),
      sort: false,
      searchFilter: false,
      searchComponent: searchText,
      minWidth: "100",
      width: "100",
      maxWidth: "300",
      detailedDataComponentId: "name",
      attributeName: "Name",
      attributeType: "String",
      attributeOperator: "contains"
    },
  ]);

  const setUploadPoliciesData = () => {
    let uploadPoliciesTemplateRows: UploadPoliciesTemplate[] = []
    if (filterUploadPolicies?.data && filterUploadPolicies?.data.length > 0) {
      uploadPoliciesTemplateRows = filterUploadPolicies?.data.map((template: any) => {
        return { 
            id: template.id, 
            name: template.name + "_" + template.id, 
            description: template.description , 
        }
      })
    }
    setRows(uploadPoliciesTemplateRows);
    reformattedRowsRef.current = uploadPoliciesTemplateRows;
  }

  const getSelectedItemsUpdate = () => {
    setSelectedItems([]);
  }

  const UploadPolicyAction = () => {
    dispatch(getAllUploadPoliciesFilter(pageiGrid));
  }

  const resizeRowConfigTemp = (e: { colIdx: number; deltaX: number }) => {
    let headCellReset = onResizeRow(e, headCells);
    setHeadCells(headCellReset);
  };

  const clearAll = () => {
    pageiGrid.gridFilter.filters = []
    dispatch(getAllUploadPoliciesFilter(pageiGrid));  
    let headCellReset = onClearAll(headCells);
    setHeadCells(headCellReset);
  };
 

  const onSetHeadCells = (e: HeadCellProps[]) => {
    let headCellsArray = onSetSingleHeadCellVisibility(headCells, e);
    setHeadCells(headCellsArray);

  };
  return (
    <div className="CrxUploadPoliciesTable switchLeftComponents">
      <CRXToaster ref={uploadMsgFormRef} />
        {
        rows && (
          <CRXDataTable
            id="uploadPoliciesTemplateDataTable"
            actionComponent={<UploadPoliciesTemplateActionMenu
              row={selectedActionRow}
              selectedItems={selectedItems}
              getRowData={UploadPolicyAction}
              getSelectedData= {getSelectedItemsUpdate}
              onMessageShow = {onMessageShow}
            />}
            toolBarButton = {
              <>
              <Restricted moduleId={0}>
                <CRXButton className="UploadPoliciesBtn" onClick={() => { history.push(urlList.filter((item:any) => item.name === urlNames.uploadPoliciesCreate)[0].url) }}>
                  {t("Create_Upload_Policy")}
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
            columnVisibilityBar={false}
            dragVisibility={false}
            showCheckBoxesCol={true}
            showActionCol={true}
            searchHeader={true}
            allowDragableToList={false}
            showTotalSelectedText={false}
            showActionSearchHeaderCell={true}
            showCustomizeIcon={false}
            className="crxTableHeight crxTableDataUi UploadPoliciesTableTemplate UploadPoliciesTable_UI"
            onClearAll={clearAll}
            getSelectedItems={(v: UploadPoliciesTemplate[]) => setSelectedItems(v)}
            onResizeRow={resizeRowConfigTemp}
            onHeadCellChange={onSetHeadCells}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            offsetY={209}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage= {(pages:any) => setPage(pages)}
            setRowsPerPage= {(setRowsPages:any) => setRowsPerPage(setRowsPages)}
            totalRecords={filterUploadPolicies?.totalCount}
          />
        )
      }
    </div>
  );
};

export default UploadPoliciesList;
