import React, { useEffect, useState } from 'react';
import {CRXDataTable, Order, HeadCellProps, TextField, CRXSelectBox } from "@cb/shared";
import moment from 'moment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import './ManageAssetGrid.scss'
import thumbImg from '../../../../Assets/Images/thumb.png'
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
  minWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean; 
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component) 
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
}

type RowDataProps = {
  asset: Person;
  id: string;
  type: string;
  tags: string;
  description: string;
  devices: string;
  user: string;
  station: string;
  captured: Date;
  uploaded: string;
  lifeSpan: string; 
}

type Person = {
  name: string;
  age: number;
  email: string;
  url: string;
}

function createData(
  asset: Person,
  id: string,
  type: string,
  tags: string,
  description: string,
  devices: string,
  user: string,
  station: string,
  captured: Date,
  uploaded: string,
  lifeSpan: string,  
  ): RowDataProps {
    return { asset, id, type, tags, description, devices, user, station, captured, uploaded, lifeSpan };
  }

const personTemplate = (rowData: Person) => {
  return (
      <React.Fragment>
        <div className="assetThumb">
          <img src={thumbImg} alt="Asset Thumb" />
        </div>
      </React.Fragment>
  );
}

const dateTimeTemplate = (dateTime: Date) => {
  const stillUtc = moment.utc(dateTime).toDate();
  const localDateTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  return (
      <React.Fragment>
          {localDateTime}
          
      </React.Fragment>
  );
}

const iconTemplate = () => {
  return (
      <React.Fragment>
        <Button >
          <MoreVertIcon />
        </Button>
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

const dataAndTime = new Date()  


//-----------------
type Asset = {
  assetName: string;
  assetType: string;
  unit: string;
}

type RowProps = {
  action: any;
  id: string;
  asset: Asset;
  devices: string;
  station: string;
  recordedBy: string;
  expiryDate: string;
  status: string;
}

const assetNameTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          <p style={{maxHeight:"8px"}}>{rowData.assetName}</p>
        </div>
      </React.Fragment>
  );
}
const assetTypeTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          <p style={{maxHeight:"8px"}}>{rowData.assetType}</p>
        </div>
      </React.Fragment>
  );
}
const assetUnitTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          <p style={{maxHeight:"8px"}}>{rowData.unit}</p>
        </div>
      </React.Fragment>
  );
}
const assetRecordedByTemplate = (rowData: any) => {
  return (
      <React.Fragment>
        <div style={{textAlign:"left"}}>
          <p style={{maxHeight:"8px"}}>{rowData.recordedBy.map((item:any) => item).join(', ')}</p>
        </div>
      </React.Fragment>
  );
}
const assetExpiryDateTemplate = (rowData: any) => {
  const stillUtc = moment.utc(rowData.expiryDate).toDate();
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
          <p style={{maxHeight:"8px"}}>{rowData.status}</p>
        </div>
      </React.Fragment>
  );
}
//-----------------

const MasterMain = (props:any) => {

    const dummyData = 
    [
      createData({name:"Faisal akhtar", age:30, email:"faisalakhter@gmail.com", url:"https://www.google.com"},'1','Video','Traffic','Case Number 35364','In Car','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(10, 'days').format('DD MMM YYYY'), '55d 11hr'),
      createData({name:"Missam akhtar", age:25, email:"faisalakhter@gmail.com", url:"https://www.dfgfdgf.com"},'2','Photo','Jail Check','General Incident','Rear Camera','missam.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(1, 'days').format('DD MMM YYYY'), '25d 22hr'), 
      createData({name:"Zuhaib Ahmed", age:52, email:"faisalakhter@gmail.com", url:"https://www.fgfgdfg.com"},'3','Video','Arrest','Case Number 52665','Body warn','zuhaib.ahmed','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'days').format('DD MMM YYYY'), '25d 22hr'),
      createData({name:"Saad Ahmed", age:14, email:"faisalakhter@gmail.com", url:"https://www.nhjdfgfdg.com"},'4','Meta Data only','Traffic Citation','General Incident','Front Camera','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'months').format('DD MMM YYYY'), '55d 11hr'), 
      createData({name:"Owais iqbal", age:41, email:"faisalakhter@gmail.com", url:"https://www.gfhfgfdhb.com"},'5','Photo','Arrest','General Incident','In Car','faisal.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(8, 'months').format('DD MMM YYYY'), '12d 1hr'), 
      createData({name:"Faizan Nasir", age:31, email:"faisalakhter@gmail.com", url:"https://www.ioyufgsrf.com"},'6','Video','Arrest','General Incident','Body warn','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(12, 'days').format('DD MMM YYYY'), '24 11hr'), 
      createData({name:"Shakeel Ahmed", age:21, email:"faisalakhter@gmail.com", url:"https://www.kdfgfdhg.com"},'7','Photo','Traffic','Case Number 951263','Body warn','missam.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(5, 'days').format('DD MMM YYYY'), '21d 11hr'), 
      createData({name:"Muhammad Aslam", age:12, email:"faisalakhter@gmail.com", url:"https://www.hdffghdxfg.com"},'8','PDF File','Traffic','General Incident','Body warn','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(6, 'months').format('DD MMM YYYY'), '23d 12hr'), 
      createData({name:"Rehan Faheem", age:13, email:"faisalakhter@gmail.com", url:"https://www.gnddgd.com"},'9','Video','Traffic','General Incident','In Car','zuhaib.ahmed','Dallas TX PD', dataAndTime, moment(new Date()).add(1, 'months').format('DD MMM YYYY'), '2d 11hr'), 
      createData({name:"Zeeshan Ahmed", age:16, email:"faisalakhter@gmail.com", url:"https://www.ugfgxwfgb.com"},'10','Video','Arrest','General Incident','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(19, 'days').format('DD MMM YYYY'), '65d 11hr'), 
      createData({name:"Tehseen Ahmed", age:61, email:"faisalakhter@gmail.com", url:"https://www.tgvvhjivdw.com"},'11','Photo','Traffic','Case Number 34264','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(3, 'months').format('DD MMM YYYY'), '7d 11hr'), 
      createData({name:"Farhan Hassan", age:24, email:"faisalakhter@gmail.com", url:"https://www.hesvjntdf.com"},'12','PDF File','Traffic','General Incident','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(4, 'months').format('DD MMM YYYY'), '46d 11hr'), 
      createData({name:"Ahsan Ahmed", age:34, email:"faisalakhter@gmail.com", url:"https://www.kfhfgsdfgj.com"},'13','Video','Arrest','Case Number 52456','In Car','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(3, 'days').format('DD MMM YYYY'), '19d 11hr'), 
      createData({name:"Faisal akhtar", age:30, email:"faisalakhter@gmail.com", url:"https://www.google.com"},'14','Video','Traffic','Case Number 35364','In Car','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(10, 'days').format('DD MMM YYYY'), '55d 11hr'),
      createData({name:"Zuhaib Ahmed", age:52, email:"faisalakhter@gmail.com", url:"https://www.fgfgdfg.com"},'15','Video','Arrest','Case Number 52665','Body warn','zuhaib.ahmed','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'days').format('DD MMM YYYY'), '25d 22hr'),
      createData({name:"Missam akhtar", age:25, email:"faisalakhter@gmail.com", url:"https://www.dfgfdgf.com"},'16','Photo','Jail Check','General Incident','Rear Camera','missam.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(1, 'days').format('DD MMM YYYY'), '25d 22hr'), 
      createData({name:"Saad Ahmed", age:14, email:"faisalakhter@gmail.com", url:"https://www.nhjdfgfdg.com"},'17','Meta Data only','Traffic Citation','General Incident','Front Camera','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'months').format('DD MMM YYYY'), '55d 11hr'), 
      createData({name:"Owais iqbal", age:41, email:"faisalakhter@gmail.com", url:"https://www.gfhfgfdhb.com"},'18','Photo','Arrest','General Incident','In Car','faisal.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(8, 'months').format('DD MMM YYYY'), '12d 1hr'), 
      createData({name:"Faizan Nasir", age:31, email:"faisalakhter@gmail.com", url:"https://www.ioyufgsrf.com"},'19','Video','Arrest','General Incident','Body warn','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(12, 'days').format('DD MMM YYYY'), '24 11hr'), 
      createData({name:"Shakeel Ahmed", age:21, email:"faisalakhter@gmail.com", url:"https://www.kdfgfdhg.com"},'20','Photo','Traffic','Case Number 951263','Body warn','missam.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(5, 'days').format('DD MMM YYYY'), '21d 11hr'), 
      createData({name:"Muhammad Aslam", age:12, email:"faisalakhter@gmail.com", url:"https://www.hdffghdxfg.com"},'21','PDF File','Traffic','General Incident','Body warn','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(6, 'months').format('DD MMM YYYY'), '23d 12hr'), 
      createData({name:"Rehan Faheem", age:13, email:"faisalakhter@gmail.com", url:"https://www.gnddgd.com"},'22','Video','Traffic','General Incident','In Car','zuhaib.ahmed','Dallas TX PD', dataAndTime, moment(new Date()).add(1, 'months').format('DD MMM YYYY'), '2d 11hr'), 
      createData({name:"Zeeshan Ahmed", age:16, email:"faisalakhter@gmail.com", url:"https://www.ugfgxwfgb.com"},'23','Video','Arrest','General Incident','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(19, 'days').format('DD MMM YYYY'), '65d 11hr'), 
      createData({name:"Tehseen Ahmed", age:61, email:"faisalakhter@gmail.com", url:"https://www.tgvvhjivdw.com"},'24','Photo','Traffic','Case Number 34264','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(3, 'months').format('DD MMM YYYY'), '7d 11hr'), 
      createData({name:"Farhan Hassan", age:24, email:"faisalakhter@gmail.com", url:"https://www.hesvjntdf.com"},'25','PDF File','Traffic','General Incident','Body warn','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(4, 'months').format('DD MMM YYYY'), '46d 11hr'), 
      createData({name:"Ahsan Ahmed", age:34, email:"faisalakhter@gmail.com", url:"https://www.kfhfgsdfgj.com"},'26','Video','Arrest','Case Number 52456','In Car','zuhaib.ahmed','FL Worth TX PD', dataAndTime, moment(new Date()).add(3, 'days').format('DD MMM YYYY'), '19d 11hr'), 
      createData({name:"Faisal akhtar", age:30, email:"faisalakhter@gmail.com", url:"https://www.google.com"},'27','Video','Traffic','Case Number 35364','In Car','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(10, 'days').format('DD MMM YYYY'), '55d 11hr'),
      createData({name:"Zuhaib Ahmed", age:52, email:"faisalakhter@gmail.com", url:"https://www.fgfgdfg.com"},'28','Video','Arrest','Case Number 52665','Body warn','zuhaib.ahmed','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'days').format('DD MMM YYYY'), '25d 22hr'),
      createData({name:"Missam akhtar", age:25, email:"faisalakhter@gmail.com", url:"https://www.dfgfdgf.com"},'29','Photo','Jail Check','General Incident','Rear Camera','missam.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(1, 'days').format('DD MMM YYYY'), '25d 22hr'), 
      createData({name:"Saad Ahmed", age:14, email:"faisalakhter@gmail.com", url:"https://www.nhjdfgfdg.com"},'30','Meta Data only','Traffic Citation','General Incident','Front Camera','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(3, 'months').format('DD MMM YYYY'), '55d 11hr'), 
      createData({name:"Owais iqbal", age:41, email:"faisalakhter@gmail.com", url:"https://www.gfhfgfdhb.com"},'31','Photo','Arrest','General Incident','In Car','faisal.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(8, 'months').format('DD MMM YYYY'), '12d 1hr'), 
      createData({name:"Faizan Nasir", age:31, email:"faisalakhter@gmail.com", url:"https://www.ioyufgsrf.com"},'32','Video','Arrest','General Incident','Body warn','faisal.akhtar','Dallas TX PD', dataAndTime, moment(new Date()).add(12, 'days').format('DD MMM YYYY'), '24 11hr'), 
      createData({name:"Shakeel Ahmed", age:21, email:"faisalakhter@gmail.com", url:"https://www.kdfgfdhg.com"},'33','Photo','Traffic','Case Number 951263','Body warn','missam.akhtar','FL Worth TX PD', dataAndTime, moment(new Date()).add(5, 'days').format('DD MMM YYYY'), '21d 11hr'), 
    ]

    const [rows, setRows] = React.useState<any[]>(props.rows);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('id');  
    const [searchData , setSearchData] = React.useState<SearchObject[]>([])

    const searchText = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => {
      return (
        <TextField onChange={(e: any) => selectChange(e,colIdx)}  />
      );
    }
    
    const searchDropDown = (rowsParam: any[], headCells: HeadCellProps[], colIdx: number) => 
    {
      const options = props.rows.map((r: any, _: any) => {
        let option: any = {}
        let x = headCells[colIdx].value
        if(x.toString() == "recordedBy")
          option["value"] = r[headCells[colIdx].id].recordedBy[0]
        else if(x.toString() == "assetName")
          option["value"] = r[headCells[colIdx].id].assetName
        else if(x.toString() == "assetType")
          option["value"] = r[headCells[colIdx].id].assetType
        else if(x.toString() == "status")
          option["value"] = r[headCells[colIdx].id].status
        else 
          option["value"] = r[headCells[colIdx].value]
        return option
      })  
      
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
                options={unique} 
                id="simpleSelectBox" 
                onChange={(e: any) => selectChange(e,colIdx)} 
                onClick={(e : any) => console.log(e)}  
                value={unique.value} 
              />
          </div>
      );
    }

    const [headCells, setHeadCells] = React.useState<HeadCellProps[]>
    ([
      { label:'ID',             id:"id",     value: 'id',      align: "right", disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchText, keyCol:true, minWidth:"125px", visible:false},
      { label:'Asset Thumbnail',id:"asset",  value: "assetId",  align: "left",  disablePadding: false, dataComponent: personTemplate},
      { label:'Asset Name',     id:"asset",  value: "assetName",  align: "left",  disablePadding: false, dataComponent: assetNameTemplate, sort: true, searchFilter:true, searchComponent: searchText},
      { label:'Asset Type',     id:"asset",  value: 'assetType',  align: "left",  disablePadding: false, dataComponent: assetTypeTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown},
      { label:'Unit',           id:"asset",  value: 'unit',  align: "left",  disablePadding: false, dataComponent: assetUnitTemplate, sort: true, searchFilter:true, searchComponent: searchText},
      { label:'Device',         id:"devices",value: 'devices',  align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown},
      { label:'Station',        id:"station",value: 'station', align: "left",  disablePadding: false, dataComponent: textTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown},
      { label:'Recorded By',    id:"asset",value: 'recordedBy', align: "left",  disablePadding: false, dataComponent: assetRecordedByTemplate, sort: true, searchFilter:true, searchComponent: searchDropDown, minWidth:"90px"},
      { label:'Expiry Date',    id:'asset',value: 'expiryDate',   align: "center",  disablePadding: false,dataComponent: assetExpiryDateTemplate,  sort: true, minWidth:"120px"},
      { label:'Status',         id:'asset',value: 'status',   align: "left",  disablePadding: false,dataComponent: assetStatusTemplate,  sort: true, minWidth:"120px", searchFilter:true, searchComponent: searchDropDown},
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
      console.log(searchData)
      let dataRows: any = props.rows
      searchData.forEach((el:SearchObject) => {
        if(el.columnName === "assetName")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].id].assetName.toLowerCase().indexOf(el.value.toLowerCase()) !== -1
                      })
        if(el.columnName === "assetType")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id].assetType === el.value) 
        if(el.columnName === "devices")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value)
        if(el.columnName === "station")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].value] === el.value)
        if(el.columnName === "recordedBy")
          dataRows = dataRows.filter(function(x: any) {
                          return x[headCells[el.colIdx].id].recordedBy[0].toLowerCase().includes(el.value.toLowerCase())
                      })
        if(el.columnName === "status")
          dataRows = dataRows.filter( (x:any) => x[headCells[el.colIdx].id].status === el.value) 
      })
      setRows(dataRows) 
    }, [searchData])

    return (
      <>
      {rows &&  <CRXDataTable
                  dataRows={rows} 
                  headCells={headCells}
                  orderParam={order} 
                  orderByParam={orderBy}
                  searchHeader={true}
                  columnVisibilityBar={true}   
                  allowDragableToList={true}
                  className="ManageAssetDataTable"    
                />    
      }
    </>               
    )
}

export default MasterMain