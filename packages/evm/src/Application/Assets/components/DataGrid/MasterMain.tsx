import React, { useEffect, useState } from 'react';
import {CRXDataTable, Order, HeadCellProps, TextField, CRXSelectBox } from "@cb/shared";
import moment from 'moment';
import './ManageAssetGrid.scss'
import thumbImg from '../../../../Assets/Images/thumb.png'
import {useTranslation} from 'react-i18next'; 


type Order = 'asc' | 'desc';

type SearchObject = {
  columnName: string;
  colIdx: number;
  value: any;
}

interface HeadCellProps {
  disablePadding: boolean;
  id: any;
  value: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth: string;
  maxWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean; 
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component) 
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
}

const thumbTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div className="assetThumb">
          <img src={thumbImg} alt="Asset Thumb" />
        </div>
      </React.Fragment>
  );
}

const textTemplate = (text: string) => {
  return (
      <div className="filterOption">
        {text}
      </div>
  );
}


//-----------------
const assetNameTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          {rowData}
        </div>
      </React.Fragment>
  );
}
const assetTypeTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          {rowData}
        </div>
      </React.Fragment>
  );
}
const assetUnitTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          {rowData}
        </div>
      </React.Fragment>
  );
}
const assetCategoryTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          {rowData.map((item:any) => item).join(', ')}
        </div>
      </React.Fragment>
  );
}
const assetRecordedByTemplate = (rowData: any[]) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          {rowData.map((item:any) => item).join(', ')}
        </div>
      </React.Fragment>
  );
}
const assetExpiryDateTemplate = (rowData: any) => {
  const stillUtc = moment.utc(rowData).toDate();
  const localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  return (
      <React.Fragment>
          {localDateTime}
          
      </React.Fragment>
  );
}
const assetHolduntillTemplate = (rowData: any) => {
  const stillUtc = moment.utc(rowData).toDate();
  const localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  return (
      <React.Fragment>
          {localDateTime}
          
      </React.Fragment>
  );
}
const assetStatusTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          <p style={{maxHeight:"8px"}}>{rowData}</p>
        </div>
      </React.Fragment>
  );
}
//-----------------

const MasterMain = (props:any) => {

    let reformattedRows: any[] = [];
    props.rows.map((row:any, i:number) => {

      let obj: any = {}
      obj["id"] = row["id"]
      obj["assetId"] = row.asset["assetId"]
      obj["assetName"] = row.asset["assetName"]
      obj["assetType"] = row.asset["assetType"]
      obj["unit"] = row.asset["unit"]
      obj["categories"] = row["categories"]   
      obj["devices"] = row["devices"]
      obj["station"] = row["station"]
      obj["recordedBy"] = row.asset["recordedBy"]
      obj["holdUntill"] = row["holdUntill"]
      obj["status"] = row.asset["status"]
      
      reformattedRows.push(obj)
    })
    const {t} = useTranslation<string>();
    const [rows, setRows] = React.useState<any[]>(reformattedRows);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('assetName');  
    const [searchData , setSearchData] = React.useState<SearchObject[]>([]);
    

    const searchText = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {
      return (
        <TextField onChange={(e: any) => selectChange(e,colIdx)}  />
      );
    }
    const searchDate = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {
      return (
        <TextField type="date" onChange={(e: any) => selectChange(e,colIdx)}  />
      );
    }
    
    const searchDropDown = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => 
    {
      let options = reformattedRows.map((r: any, _: any) => {
        let option: any = {}
        let x = headCells[colIdx].value
          option["value"] = r[headCells[colIdx].value]
        return option
      })  

      // For those properties which contains an array
      if(headCells[colIdx].value.toString() === "categories" || headCells[colIdx].value.toString() === "recordedBy")
      {
        let moreOptions: any = []
        reformattedRows.map((r: any, _: any) => {
          let x = headCells[colIdx].value
          r[x].forEach((element: any) => {
            let moreOption: any = {}
            moreOption["value"] = element
            moreOptions.push(moreOption)
          });
        })    
        options = moreOptions
      }
      //------------------

      let unique: any = options.map((x:any) => x);

      if(options.length > 0)
      {       
        unique = []
        unique[0] = options[0]
        
        for (var i = 0; i < options.length; i++) {
          if(!unique.some((item: any) => item.value === options[i].value))
          {
            let value: any = {}
            value["value"] = options[i].value
            unique.push(value)
          }
        }
      }
    
      return (
          <div className="filterSelect">
              <CRXSelectBox 
                className="selectFilter"
                options={unique} 
                id="simpleSelectBox" 
                onChange={(e: any) => selectChange(e,colIdx)} 
                onClick={(e : any) => console.log(e)}  
                value={unique.value} 
              />
          </div>
      );
    }

    const dateExpireComponent = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {
      return (
        <TextField type="date" onChange={(e: any) => selectChange(e,colIdx)}  />
      )
    }
    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>
    ([
      { label: `${t('ID')}`,             id:"id",         value: 'id',         align: "right", disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchText, keyCol:true, visible:false , minWidth:"120"},
      { label: `${t('Asset Thumbnail')}`,id:"assetId",    value: "assetId",    align: "left",  disablePadding: false, dataComponent: thumbTemplate, minWidth:"155"},
      { label:`${t('Asset Name')}`,      id:"assetName",  value: "assetName",  align: "left",  disablePadding: false, dataComponent: assetNameTemplate, sort: true, searchFilter:true, searchComponent: searchText, minWidth:"120"},
      { label:`${t('Asset Type')}`,      id:"assetType",  value: 'assetType',  align: "left",  disablePadding: false, dataComponent: assetTypeTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"120"},
      { label:`${t('Unit')}`,            id:"unit",       value: 'unit',       align: "left",  disablePadding: false, dataComponent: assetUnitTemplate, sort: true, searchFilter:true, searchComponent: searchText, minWidth: "100"},
      { label:`${t('Categories')}`,      id:"categories", value: 'categories', align: "left",  disablePadding: false, dataComponent: assetCategoryTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"150"},
      { label:`${t('Device')}`,          id:"devices",    value: 'devices',    align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"80"},
      { label:`${t('Station')}`,         id:"station",    value: 'station',    align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"120"},
      { label:`${t('User Name')}`,       id:"recordedBy",   value: 'recordedBy', align: "left",  disablePadding: false, dataComponent: assetRecordedByTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"90"},
      { label:`${t('Expiry Date')}`,     id:'holdUntill', value: 'holdUntill', align: "center",disablePadding: false, dataComponent: assetHolduntillTemplate,  sort: true, minWidth:"120", searchFilter:true, searchComponent: searchDate},
      { label:`${t('Status')}`,          id:'status',     value: 'status',     align: "left",  disablePadding: false, dataComponent: assetStatusTemplate,  sort: true, minWidth:"90", searchFilter:true, searchComponent: searchDropDown},
    ]);

    const selectChange=(e: any, colIdx: number)  =>
    { 
      if(e.target.value !== "" && e.target.value !== undefined)
      {
        let newItem = {
          columnName: headCells[colIdx].value.toString(),
          colIdx,
          value: e.target.value
        }     
        setSearchData((prevArr)=>(prevArr.filter((e)=>(e.columnName !== headCells[colIdx].value.toString()))))
        setSearchData((prevArr)=>([...prevArr, newItem]))

      }
      else 
        setSearchData((prevArr)=>(prevArr.filter((e)=>(e.columnName !== headCells[colIdx].value.toString()))))
    }

    useEffect(() => {
      let dataRows: any = reformattedRows
      searchData.forEach((el:SearchObject) => {
        if(el.columnName === "assetName")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].value].toLowerCase().indexOf(el.value.toLowerCase()) !== -1
                      })
        if(el.columnName === "assetType")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value) 
        if(el.columnName === "unit")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].value].toLowerCase().indexOf(el.value.toLowerCase()) !== -1
                      })
        if(el.columnName === "categories")
          dataRows = dataRows.filter(function(x: any) {
                        return x[headCells[el.colIdx].value].map((item:any) => item).join(', ').toLowerCase().includes(el.value.toLowerCase())
                      })
        if(el.columnName === "devices")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value)
        if(el.columnName === "station")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value)
        if(el.columnName === "recordedBy")
          dataRows = dataRows.filter(function(x: any) {
                        return x[headCells[el.colIdx].value].map((item:any) => item).join(', ').toLowerCase().includes(el.value.toLowerCase())
                      })
        if(el.columnName === "expiryDate")
        {
          dataRows = dataRows.filter( (x:any) => DateFormat(x[headCells[el.colIdx].value]) === DateFormat(el.value)) 
        }
        if(el.columnName === "holdUntill")
        {
          dataRows = dataRows.filter( (x:any) => DateFormat(x[headCells[el.colIdx].value]) === DateFormat(el.value)) 
        }
        if(el.columnName === "status")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value) 
      })
      setRows(dataRows) 
    }, [searchData])
    
    useEffect(() => {    
      setRows(reformattedRows)    
    },[])

    function DateFormat(value: any) {
      const stillUtc = moment.utc(value).toDate();
      const localDate = moment(stillUtc).local().format('YYYY-MM-DD');
      return localDate
    }

    return (
      <>
      {rows &&  <CRXDataTable
                  dataRows={rows} 
                  headCells={headCells}
                  orderParam={order} 
                  orderByParam={orderBy}
                  searchHeader={true}
                  columnVisibilityBar={true}   
                  allowDragableToList={false}
                  className="ManageAssetDataTable"  
                />    
      }
    </>               
    )
}

export default MasterMain