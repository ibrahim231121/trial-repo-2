import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import IconButton from '@material-ui/core/IconButton';
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  useStyles,
  MultiLevelProps,
} from "./CRXDataTableTypes";
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";


const DataTableMultiLevel: React.FC<MultiLevelProps> = ({
  headCells,
  rows,
  className,
  finalLevel,
  onSetCheckAllLevel,
  onSetRow,
  onUnCheckAllParent
}) => {

  const orderColumn = new Array(headCells.length).fill(null).map((_, i) => i)
  const classes = useStyles();

  const [active, setActive] = React.useState<boolean>(false)

  const [checkAllBasicLevel, setCheckAllBasicLevel] = React.useState<boolean>(false)
  const [checkAllAdvanceLevel, setCheckAllAdvanceLevel] = React.useState<boolean>(false)
  const [checkAllRestrictLevel, setCheckAllRestrictLevel] = React.useState<boolean>(false)

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>, colIdx:number) => {
    if(colIdx === finalLevel-1) {
      setCheckAllBasicLevel(e.target.checked)
      onSetCheckAllLevel(e.target.checked,"Basic")
    }
    else if(colIdx === finalLevel) {
      setCheckAllAdvanceLevel(e.target.checked)
      onSetCheckAllLevel(e.target.checked,"Advance")
    }
    else if(colIdx === finalLevel+1) {
      setCheckAllRestrictLevel(e.target.checked)
      onSetCheckAllLevel(e.target.checked,"Restrictive")
    }
  }

  const onSetRowMultiLevel = (check:boolean, row:any) => {
    setActive(!active)
    onSetRow(check, row)
    if(row.levelType !== undefined && check === false) {
      if(row.levelType === "Basic") 
        setCheckAllBasicLevel(check)
      else if(row.levelType === "Advance") 
        setCheckAllAdvanceLevel(check)
      else if(row.levelType === "Restrictive") 
        setCheckAllRestrictLevel(check)
      onUnCheckAllParent(check, row)
    }
  }

  const getCheckAllValues = (colIdx:number) => {
    let value: boolean = false;
    if(colIdx === finalLevel-1)
      value = checkAllBasicLevel
    else if(colIdx === finalLevel)
      value = checkAllAdvanceLevel
    else if(colIdx === finalLevel+1)
      value = checkAllRestrictLevel
    return value
  }

  return (
    <>
      
        <TableContainer
          className={className}
          component={Paper}
        >
          <Table
            className={"CRXMultiDataTableCustom " + classes.table}
            aria-label="simple table"
            size="small"
            stickyHeader
          >
          <TableHead> 
          <TableRow>
          {orderColumn.map((colIdx, i) => (
            <TableCell className={classes.multiTableStikcyHeader + " CRXMultiDataTableLabelCell"} key={i} 
                //style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible === true) ? "" : "none"}`}}
                align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}>
            <div className={classes.headerCellDiv + " crxMultiTableHeader"}
            style={
                {
                minWidth:`${(headCells[colIdx].minWidth === undefined) ? "" : headCells[colIdx].minWidth}`+"px",
                maxWidth:`${(headCells[colIdx].maxWidth === undefined) ? "" : headCells[colIdx].maxWidth}`+"px"
                }
            } 
            >
            <div className="multiTableHeaderCell"
                key={headCells[colIdx].id}>
                <label> 
                    {headCells[colIdx].label} 
                </label>
                {(colIdx >= finalLevel-1) ? 
                  <CRXCheckBox
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e,colIdx)}
                    checked={getCheckAllValues(colIdx)}
                    selectedRow={getCheckAllValues(colIdx)}
                    lightMode={false}
                  />
                  :
                  null
                }       
            </div>
            </div>  
                
            </TableCell>  
        ))}
        </TableRow>
        </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <MultiLevelRows 
                      row={row} 
                      index={index} 
                      headCells={headCells}
                      onSetRow={onSetRowMultiLevel}
                      finalLevel={finalLevel}
                    > </MultiLevelRows>
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    
    </>
  );
};
export default DataTableMultiLevel;

const MultiLevelRows: React.FC<any> = ({row, index, headCells, collapsible, onSetRow, finalLevel}) => {

  const [open, setOpen] = React.useState<boolean>(collapsible);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {    
      onSetRow(e.target.checked, row)
  }

  return (
    <div key={index} style={{display:`${collapsible === true ? "none" : "contents"}`}}> 
      <TableRow>
        <TableCell className="multiDataTableBodyCell" style={{verticalAlign:"top", display:"none"}}>
          {row.level}
        </TableCell>

        <TableCell className="multiDataTableBodyCell"
          style={{textAlign:"left"}}>
          <div className="App-permission-parent">
            <IconButton
              aria-label="expand row"
              size="small"
              disableRipple
              className="multiTableC-Caret"
              onClick={() => setOpen(!open)}
            >
              {open ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}
            </IconButton>
            <label style={{width:"100%"}}>{row.name}</label>
            <div className="appPermissionLevel-checkbox">
              <span>
                <CRXCheckBox
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  checked={row.selected }
                  selectedRow={row.selected }
                  lightMode={true}
                />
              </span>
            </div>
          </div>
        </TableCell>
        {Array.from(Array(headCells.length-1), () => {
            return <TableCell className="multiDataTableBodyCell"></TableCell>
          })
        }
      </TableRow>
      {
        (row.children && row.children.length > 0 && row.level < finalLevel-1) ? 
          row.children.map((item:any, index:number) => {
            return <MultiLevelRows 
              row={item} 
              index={index} 
              headCells={headCells} 
              collapsible={open} 
              child={row.children} 
              onSetRow={(check:boolean, row:any) => onSetRow(check, row)}
              finalLevel={finalLevel}
              > 
              </MultiLevelRows>
          })
        : 
          row.children && row.children.length > 0 && 
          <LastLevelRow 
            row={row.children[0]} 
            collapsible={open} 
            child={row.children} 
            onSetRow={(check:boolean, row:any) => onSetRow(check, row)}
          > 
          </LastLevelRow>
      }
    </div>
    
  )              
};

const LastLevelRow: React.FC<any> = ({row, collapsible, child, onSetRow}) => {
  

  return (
    <div style={{display:`${collapsible === true ? "none" : "contents"}`}}> 
      <TableRow >
        <TableCell className="multiDataTableBodyCell" style={{verticalAlign:"top", display:"none"}}>
          {row.level}
        </TableCell>
        {Array.from(Array(row.level-1), () => {
            return <TableCell className="multiDataTableBodyCell"></TableCell>
          })
        }
        {
          (child && child.length > 0) ? 
          <>
            <TableCell className="multiDataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "Basic").map((item:any) => {                   
                    return <AlllevelTypes row={item} onSetRow={(check:boolean, row:any) => onSetRow(check, row)}></AlllevelTypes>
                  }
                )}
            </TableCell>

            <TableCell className="multiDataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "Advance").map((item:any) => {
                    return <AlllevelTypes row={item} onSetRow={(check:boolean, row:any) => onSetRow(check, row)}></AlllevelTypes>
                  }
                )}
            </TableCell>

            <TableCell className="multiDataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "Restrictive").map((item:any) => {
                    return <AlllevelTypes row={item} onSetRow={(check:boolean, row:any) => onSetRow(check, row)}></AlllevelTypes>
                  }
                )}
            </TableCell>
          </>
          : 
          null
        }
      </TableRow>
    </div>
  )              
};

const AlllevelTypes: React.FC<any> = ({row, onSetRow}) => {

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    onSetRow(e.target.checked, row)
  }

  return (
      <div className="multiDataTableCheckBox">
        <CRXCheckBox
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          checked={row.selected }
          selectedRow={row.selected }
          lightMode={true}
        />
        {row.name}
      </div>
  )
}




