import React, { useEffect, useState, useRef } from 'react';
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
  //value: any;
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
  headerText?: string;
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
        <div className="linkColor" style={{textAlign:"left"}}>
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
        <div style={{textAlign:"left"}} className="linkColor">
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
          {rowData}
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
      obj["description"] = row["description"]
      obj["categories"] = row["categories"]   
      obj["devices"] = row["devices"]
      obj["station"] = row["station"]
      obj["recordedBy"] = row.asset["recordedBy"]
      obj["recordingStarted"] = row.asset["recordingStarted"]
      obj["status"] = row.asset["status"]
      
      reformattedRows.push(obj)
    })
    const {t} = useTranslation<string>();
    const [rows, setRows] = React.useState<any[]>(reformattedRows);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('assetName');  
    const [searchData , setSearchData] = React.useState<SearchObject[]>([]);

    
    const SearchText = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {  

      function handleChange(e: any,colIdx: number) {
        selectChange(e,colIdx)   
        headCells[colIdx].headerText = e.target.value   
      }

      return (
        <TextField value={(headCells[colIdx].headerText === undefined) ? headCells[colIdx].headerText = "" : headCells[colIdx].headerText} 
          id={"CRX_" + colIdx} 
          onChange={(e: any) => handleChange(e,colIdx)} />
      );
    }

    const searchDate = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {

      function handleChange(e: any,colIdx: number) {
        selectChange(e,colIdx)   
        headCells[colIdx].headerText = e.target.value   
      }

      return (
        <TextField value={(headCells[colIdx].headerText === undefined) ? headCells[colIdx].headerText = "" : headCells[colIdx].headerText} 
          id={"CRX_" + colIdx} type="date" 
          onChange={(e: any) => handleChange(e,colIdx)}  />
      );
    }
    
    const searchDropDown = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => 
    {
      let options = reformattedRows.map((r: any, _: any) => {
        let option: any = {}
        let x = headCells[colIdx].id
          option["value"] = r[headCells[colIdx].id]
        return option
      })  

      // For those properties which contains an array
      if(headCells[colIdx].id.toString() === "categories" || headCells[colIdx].id.toString() === "recordedBy")
      {
        let moreOptions: any = []
        reformattedRows.map((r: any, _: any) => {
          let x = headCells[colIdx].id
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

      function handleChange(e: any,colIdx: number) {
        selectChange(e,colIdx)   
        headCells[colIdx].headerText = e.target.value   
      }
    
      return (
          <div className="filterSelect">
              <CRXSelectBox 
                className="selectFilter"
                popover="dropdownPaper"
                options={unique} 
                id={colIdx} 
                onChange={(e: any) => handleChange(e,colIdx)} 
                onClick={(e : any) => console.log(e)}  
                value={(headCells[colIdx].headerText === undefined) ? headCells[colIdx].headerText = "" : headCells[colIdx].headerText}  
              />
          </div>
      );
    }

    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>
    ([
      { label:`${t('ID')}`,            id:"id",              align: "right", disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: SearchText, keyCol:true, visible:false , minWidth:"120"},
      { label:`${t('AssetThumbnail')}`,id:"assetId",         align: "left",  disablePadding: false, dataComponent: thumbTemplate, minWidth:"155", maxWidth : "171"},
      { label:`${t('AssetID')}`,       id:"assetName",       align: "left",  disablePadding: false, dataComponent: assetNameTemplate, sort: true, searchFilter:true, searchComponent: SearchText, minWidth:"180"},
      { label:`${t('AssetType')}`,     id:"assetType",       align: "left",  disablePadding: false, dataComponent: assetTypeTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"200", visible: false},
      { label:`${t('Description')}`,   id:"description",     align: "left",  disablePadding: false, dataComponent: assetUnitTemplate, sort: true, searchFilter:true, searchComponent: SearchText, minWidth: "200"},
      { label:`${t('Categories')}`,    id:"categories",      align: "left",  disablePadding: false, dataComponent: assetCategoryTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"150"},
      { label:`${t('Device')}`,        id:"devices",         align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"100", visible: false},
      { label:`${t('Station')}`,       id:"station",         align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"120", visible: false},
      { label:`${t('Username')}`,      id:"recordedBy",      align: "left",  disablePadding: false, dataComponent: assetRecordedByTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"135"},
      { label:`${t('Captured')}`,      id:'recordingStarted',align: "center",disablePadding: false, dataComponent: assetHolduntillTemplate,  sort: true, minWidth:"120", searchFilter:true, searchComponent: searchDate},
      { label:`${t('FileStatus')}`,    id:'status',          align: "left",  disablePadding: false, dataComponent: assetStatusTemplate,  sort: true, minWidth:"110", searchFilter:true, searchComponent: searchDropDown},
    ]);

    const selectChange=(e: any, colIdx: number)  =>
    { 
      if(e.target.value !== "" && e.target.value !== undefined)
      {
        let newItem = {
          columnName: headCells[colIdx].id.toString(),
          colIdx,
          value: e.target.value
        }     
        setSearchData((prevArr)=>(prevArr.filter((e)=>(e.columnName !== headCells[colIdx].id.toString()))))
        setSearchData((prevArr)=>([...prevArr, newItem]))

      }
      else 
        setSearchData((prevArr)=>(prevArr.filter((e)=>(e.columnName !== headCells[colIdx].id.toString()))))
    }

    useEffect(() => {
      let dataRows: any = reformattedRows
      searchData.forEach((el:SearchObject) => {
        if(el.columnName === "assetName")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].id].toLowerCase().indexOf(el.value.toLowerCase()) !== -1
                      })
        if(el.columnName === "assetType")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id] === el.value) 
        if(el.columnName === "description")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].id].toLowerCase().indexOf(el.value.toLowerCase()) !== -1
                      })
        if(el.columnName === "categories")
          dataRows = dataRows.filter(function(x: any) {
                        return x[headCells[el.colIdx].id].map((item:any) => item).join(', ').toLowerCase().includes(el.value.toLowerCase())
                      })
        if(el.columnName === "devices")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id] === el.value)
        if(el.columnName === "station")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id] === el.value)
        if(el.columnName === "recordedBy")
          dataRows = dataRows.filter(function(x: any) {
                        return x[headCells[el.colIdx].id].map((item:any) => item).join(', ').toLowerCase().includes(el.value.toLowerCase())
                      })
        if(el.columnName === "expiryDate")
        {
          dataRows = dataRows.filter( (x:any) => DateFormat(x[headCells[el.colIdx].id]) === DateFormat(el.value)) 
        }
        if(el.columnName === "recordingStarted")
        {
          dataRows = dataRows.filter( (x:any) => DateFormat(x[headCells[el.colIdx].id]) === DateFormat(el.value)) 
        }
        if(el.columnName === "status")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id] === el.value) 
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

    const onClearAll = () => {
      setSearchData([]);
      let headCellReset = headCells.map((headCell,i) => {
        headCell.headerText = ""
        return headCell
      })
      setHeadCells(headCellReset);
    }

    return (
      <React.Fragment >
        {/* <div style={{width: "500px", height: "300px", overflow: "auto"}}>
          <table className="freeze-table" width="700px">
            <thead>
              <tr>
                <th style={{minWidth:"55px",width:"55px"}} className="col-id-no fixed-header">Id</th>
                <th style={{minWidth:"100px",width:"100px"}} className="col-first-name fixed-header">First Name</th>
                <th style={{minWidth:"75px",width:"75px"}}>Last Name</th>
                <th style={{minWidth:"300px",width:"300px"}}>Address</th>
                <th style={{minWidth:"100px",width:"100px"}}>Phone</th>
                <th style={{minWidth:"75px",width:"75px"}}>DOB</th>
              </tr>
              <tr>
                <th style={{minWidth:"55px",width:"55px"}} className="col-id-no fixed-header"></th>
                <th style={{minWidth:"100px",width:"100px"}} className="col-first-name fixed-header"></th>
                <th style={{minWidth:"75px",width:"75px"}}></th>
                <th style={{minWidth:"300px",width:"300px"}}></th>
                <th style={{minWidth:"100px",width:"100px"}}></th>
                <th style={{minWidth:"75px",width:"75px"}}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-id-no" scope="row">31</td>
                <td className="col-first-name" scope="row">Barry</td>
                <td>Allen</td>
                <td>Florida, United States of America</td>
                <td>2111111</td>
                <td>02-02-1983</td>
              </tr>
              <tr>
                <td className="col-id-no" scope="row">53</td>
                <td className="col-first-name" scope="row">Jerry</td>
                <td>Iyori</td>
                <td>Karachi, Islamic Republic of Pakistan</td>
                <td>5444444</td>
                <td>26-11-1987</td>
              </tr>
              <tr>
                <td className="col-id-no" scope="row">64</td>
                <td className="col-first-name" scope="row">Kenn</td>
                <td>Moiz</td>
                <td>Lahore, Islamic Republic of Pakistan</td>
                <td>35555555</td>
                <td>23-02-1982</td>
              </tr>
              <tr>
                <td className="col-id-no" scope="row">23</td>
                <td className="col-first-name" scope="row">Peter</td>
                <td>Parkar</td>
                <td>Florida, Azerbaijan</td>
                <td>87777777</td>
                <td>14-02-1984</td>
              </tr>
              <tr>
                <td className="col-id-no" scope="row">76  </td>
                <td className="col-first-name" scope="row">Barry</td>
                <td>Allen</td>
                <td>Palestine, Turkey Istanbul</td>
                <td>96666666</td>
                <td>04-02-1985</td>
              </tr>
            </tbody>

          </table>
        </div> */}
      { rows && <CRXDataTable
                  dataRows={rows} 
                  headCells={headCells}
                  orderParam={order} 
                  orderByParam={orderBy}
                  searchHeader={true}
                  columnVisibilityBar={true}   
                  allowDragableToList={false}
                  className="ManageAssetDataTable"
                  onClearAll={onClearAll}
                />    
      }
    </React.Fragment>               
    )
}

export default MasterMain