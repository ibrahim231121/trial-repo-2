import React, {useEffect} from "react";
import { CRXDrawer, CRXIcon, CRXRows, CRXColumn,CRXDataTable,HeadCellProps,TextField,CRXPaper,CRXHeading,CRXMultiSelect, CRXBadge, CRXTooltip  } from "@cb/shared";
import ActionMenu from "../../Assets/components/ActionMenu";
import "./CRXBucket.scss";
import { useTranslation } from "react-i18next";
import thumbImg from "../../../Assets/Images/thumb.png";

const ToggleButton = (
  <CRXBadge itemCount={100}>
      <CRXTooltip
        className="bucketIcon"
        title="Asset Bucket can be used to build cases and do one action on many assets at the same time."
        iconName="fas icon-drawer2"
        placement="left"
      ></CRXTooltip>
    </CRXBadge>
); 

type SearchObject = {
  columnName: string;
  colIdx: number;
  value: string|string[];
};

type Order = "asc" | "desc";

interface HeadCellProps {
  id: string;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth: string;
  maxWidth?: string;
  dataComponent?:(()=>React.ReactNode) |((rowData: string[])=>React.ReactNode ) | ((text: string)=>React.ReactNode)|( (rowData: string)=>React.ReactNode) ;
  searchFilter?: boolean;
  searchComponent?: (rowParam:any[],headCell:HeadCellProps[],colIdx:number)=>React.ReactNode; // (Dropdown / Multiselect / Input / Custom Component)
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
  headerText?: string;
}

interface AssetBucket{
  id:number,
  assetId:number,
  assetName:string,
  recordingStarted:string,
  categories:string[]
}

const textTemplate = (text: string) => {
  return <div className="filterOption">{text}</div>;
};

const assetNameTemplate = (rowData:string) => {
  return (
    <>
      <div className="alignLeft linkColor">
        {rowData}
      </div>
    </>
  );
};

const thumbTemplate = () => {  
  return (
    <>
      <div className="assetThumb">
        <i className="tumbPlayIcon icon-play3"></i>
        <img src={thumbImg} alt="Asset Thumb" />
      </div>
    </>
  );
};

const assetCategoryTemplate = (rowData: string[]) => {  
  return (
    <>
      <div className="alignLeft">
        {rowData.map((item: string) => item).join(", ")}
      </div>
    </>
  );
};

const CRXAssetsBucketPanel = () => {  

  let reformattedRows: AssetBucket[] = [];

  let obj: AssetBucket={
    id : 1,
    assetId : 123,
    assetName : "asset123",
    recordingStarted : "2021-07-01T13:50:15.172Z",
    categories : ["Murder","Killing"]
  };

  reformattedRows.push(obj);

  let obj1: AssetBucket={
    id : 2,
    assetId : 456,
    assetName : "asset456",
    recordingStarted : "2021-07-01T13:50:15.172Z",
    categories : ["Snatching","Torchering"]
  };

  reformattedRows.push(obj1);

  let obj2: AssetBucket={
    id : 3,
    assetId : 789,
    assetName : "asset789",
    recordingStarted : "2021-07-01T13:50:15.172Z",
    categories : ["Snatching","Killing"]
  };

  reformattedRows.push(obj2);

  let obj3: AssetBucket={
    id : 4,
    assetId : 102,
    assetName : "asset102",
    recordingStarted : "2021-07-01T13:50:15.172Z",
    categories : ["Snatching","Killing"]
  };

  reformattedRows.push(obj3);
   
  const [isOpen,setIsOpen]=React.useState<boolean>(false);
  const [selectedItems, setSelectedItems] = React.useState<AssetBucket[]>([]);
  const [rows, setRows] = React.useState<AssetBucket[]>(reformattedRows);
  const { t } = useTranslation<string>();
  const [searchData, setSearchData] = React.useState<SearchObject[]>([]);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("recordingStarted");
  console.log(orderBy);

  const toggleState = () =>
    setIsOpen((prevState) => (!prevState));

    const SearchText = (
      rowsParam: any[],
      headCells: HeadCellProps[],
      colIdx: number
    ) => {      
      function handleChange(e: any, colIdx: number) {
        console.log("handleChange",e)
        selectChange(e, colIdx);
        headCells[colIdx].headerText = e.target.value;
      }
  
      return (
        <TextField
          value={
            headCells[colIdx].headerText === undefined
              ? (headCells[colIdx].headerText = "")
              : headCells[colIdx].headerText
          }
          id={"CRX_" + colIdx.toString()}
          onChange={(e: any) => handleChange(e, colIdx)}
        />
      );
    };

    const MultiDropDown = (
      rowsParam: any[],
      headCells: HeadCellProps[],
      colIdx: number,
      isSearchable: boolean
    ) => {
      const [filterValue, setFilterValue] = React.useState<any>([]);
      const [openState, setOpenState] = React.useState<boolean>(true);
      const [buttonState, setButtonState] = React.useState<boolean>(false);
  
      let options = reformattedRows.map((row: any, _: any) => {
        let option: any = {};
        let x = headCells[colIdx].id;
        option["value"] = row[headCells[colIdx].id];
        return option;
      });
  
      // For those properties which contains an array
      if (
        headCells[colIdx].id.toString() === "categories"
      ) {
        let moreOptions: any = [];
        reformattedRows.map((row: any, _: any) => {
          let x = headCells[colIdx].id;
          row[x].forEach((element: any) => {
            let moreOption: any = {};
            moreOption["value"] = element;
            moreOptions.push(moreOption);
          });
        });
        options = moreOptions;
      }
      //------------------
  
      let unique: any = options.map((x: any) => x);
  
      if (options.length > 0) {
        unique = [];
        unique[0] = options[0];
  
        for (var i = 0; i < options.length; i++) {
          if (!unique.some((item: any) => item.value === options[i].value)) {
            let value: any = {};
            value["value"] = options[i].value;
            unique.push(value);
          }
        }
      }
  
      function handleChange(e: any, colIdx: number, v: any) {
        setFilterValue((val: []) => [...v]);
        selectMultiChange(e, colIdx, v);
        headCells[colIdx].headerText = e.target.value;
      }
      function GetClassName() {
        return openState ? "" : "hide";
      }
      function GetButtonClass() {
        return buttonState ? "" : "hide";
      }
      function OnCloseEffect(e: any, r: any) {
        if (filterValue.length > 0) {
          setButtonState(true);
  
          setOpenState(false);
        } else {
          setButtonState(false);
          setOpenState(true);
        }
      }
      function ClearFilter() {
        setOpenState(true);
        setButtonState(false);
        setFilterValue([]);
      }
      useEffect(() => {
        if (filterValue.length == 0) {
          setSearchData((prevArr) =>
            prevArr.filter(
              (e) => e.columnName !== headCells[colIdx].id.toString()
            )
          );
        }
      }, [filterValue]);
      return (
        <div className="">
          <CRXRows container spacing={2}>
            <CRXColumn item xs={6}>
              <CRXPaper
                variant="outlined"
                elevation={1}
                square={true}
                className={"centerPosition"}
              >
                <CRXHeading variant="h6" align="left">
                  {" "}
                </CRXHeading>
                <div className={GetButtonClass()}>
                  <button
                    className="fas fa-filter"
                    onClick={(e) => setOpenState((state) => !state)}
                  ></button>
                  <button
                    className="fas fa-times"
                    onClick={(e) => ClearFilter()}
                  ></button>
                </div>
  
                <CRXMultiSelect
                  className={GetClassName()}
                  onClose={(e: any, r: any) => {
                    return OnCloseEffect(e, r);
                  }}
                  // name={"AssetType"}
                  multiple={true}
                  CheckBox={true}
                  options={unique}
                  value={filterValue}
                  autoComplete={false}
                  useRef={openState && buttonState}
                  isSearchable={isSearchable}
                  onChange={(event: any, newValue: any) => {
                    return handleChange(event, colIdx, newValue);
                  }}
                />
              </CRXPaper>
            </CRXColumn>
          </CRXRows>
        </div>
      );
    };

    const SearchMultiDropDown = (
      rowsParam: any[],
      headCells: HeadCellProps[],
      colIdx: number
    ) => {      
      return MultiDropDown(rowsParam, headCells, colIdx, true);
    };

    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>([
      {
        label: `${t("ID")}`,
        id: "id",
        align: "right",
        dataComponent: textTemplate,
        sort: true,
        searchFilter: true,
        searchComponent: SearchText,
        keyCol: true,
        visible: false,
        minWidth: "80",
        maxWidth: "100",
      },
      {
        label: `${t("AssetThumbnail")}`,
        id: "assetId",
        align: "left",
        dataComponent: thumbTemplate,
        minWidth: "80",
        maxWidth: "100",
      },
      {
        label: `${t("AssetID")}`,
        id: "assetName",
        align: "left",
        dataComponent: assetNameTemplate,
        sort: true,
        searchFilter: true,
        searchComponent: SearchText,
        minWidth: "100",
        maxWidth: "100",

      },{
        label: `${t("Categories")}`,
        id: "categories",
        align: "left",
        dataComponent: assetCategoryTemplate,
        sort: true,
        searchFilter: true,
        searchComponent: SearchMultiDropDown,
        minWidth: "100",
        maxWidth: "100",
      },
    ]);

    const selectChange = (e: any, colIdx: number) => {
      if (e.target.value !== "" && e.target.value !== undefined) {
        let newItem = {
          columnName: headCells[colIdx].id.toString(),
          colIdx,
          value: e.target.value,
        };
        setSearchData((prevArr) =>
          prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
        setSearchData((prevArr) => [...prevArr, newItem]);
      } else
        setSearchData((prevArr) =>
          prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
    };

    const selectMultiChange = (e: any, colIdx: number, v: []) => {    
      if (v.length == 0) {
        setSearchData((prevArr) =>
          prevArr.filter((e) => e.columnName !== headCells[colIdx].id.toString())
        );
      } else {
        for (var i = 0; i < v.length; i++) {
          let newItem = {
            columnName: headCells[colIdx].id.toString(),
            colIdx,
            value: v.map((x, i) => {
              return x["value"];
            }),
          };
          setSearchData((prevArr) =>
            prevArr.filter(
              (e) => e.columnName !== headCells[colIdx].id.toString()
            )
          );
          setSearchData((prevArr) => [...prevArr, newItem]);
        }
      }
    };

    useEffect(() => {
      dataArrayBuilder();
    }, [searchData]);

    const dataArrayBuilder = () => {
      let dataRows: any = reformattedRows;
      searchData.forEach((el: SearchObject) => {       
        if (el.columnName === "assetName")
          dataRows = dataRows.filter(function (x: any) {
            return (
              x[headCells[el.colIdx].id]
                .toLowerCase()
                .indexOf(el.value.toString().toLowerCase()) !== -1
            );
          });
          if (["categories"].includes(el.columnName)) {
            dataRows = dataRows.filter((x: any) => {
              return x[headCells[el.colIdx].id]
                .map((y: any) => el.value.includes(y))
                .includes(true);
            });
          }
      });
      setRows(dataRows);
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
      <CRXRows container spacing={0}>
        <CRXColumn item xs={11} className="bucketPanelTitle">
          <label>Your Asset Bucket</label>
        </CRXColumn>
        <CRXColumn item xs={1} className="topColumn">
          <i
            className="fas fa-times"
            onClick={() => setIsOpen( false )}
          ></i>
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
      {/* <div className="bucketContent">Your Asset Bucket is empty.</div> */}

      <div className="bucketViewLink">View on Assets Bucket page <i className="icon-arrow-up-right2"></i> </div>  
      <CRXDataTable
          actionComponent={
            <ActionMenu isSelected={selectedItems.length > 0 ? true : false} />
          }
          showToolbar={false}
          dataRows={rows}
          headCells={headCells}
          orderParam={order}
          orderByParam={orderBy}
          searchHeader={true}
          columnVisibilityBar={true}
          allowDragableToList={false}
          className="ManageAssetDataTable crxTableHeight"
          getSelectedItems={(v: any) => setSelectedItems(v)}
        />
    
    </CRXDrawer>
  );
};

export default CRXAssetsBucketPanel;
