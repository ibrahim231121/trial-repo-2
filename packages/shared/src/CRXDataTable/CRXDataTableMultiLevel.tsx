import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { ThemeProvider } from "@material-ui/core/styles";
import {
  useStyles,
  MultiLevelProps,
  theme,
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
      onSetCheckAllLevel(e.target.checked,"basic")
    }
    else if(colIdx === finalLevel) {
      setCheckAllAdvanceLevel(e.target.checked)
      onSetCheckAllLevel(e.target.checked,"advance")
    }
    else if(colIdx === finalLevel+1) {
      setCheckAllRestrictLevel(e.target.checked)
      onSetCheckAllLevel(e.target.checked,"restrict")
    }
  }

  const onSetRowMultiLevel = (check:boolean, row:any) => {
    setActive(!active)
    onSetRow(check, row)
    if(row.levelType !== undefined && check === false) {
      if(row.levelType === "basic") 
        setCheckAllBasicLevel(check)
      else if(row.levelType === "advance") 
        setCheckAllAdvanceLevel(check)
      else if(row.levelType === "restrict") 
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
      <ThemeProvider theme={theme}>
        <TableContainer
          className={classes.container + " AssetsDataGrid " + className}
          component={Paper}
        >
          <Table
            className={"CRXDataTableCustom " + classes.table}
            aria-label="simple table"
            size="small"
            stickyHeader
          >

          {orderColumn.map((colIdx, i) => (
            <TableCell className={classes.headerStickness + " CRXDataTableLabelCell"} key={i} 
                //style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible === true) ? "" : "none"}`}}
                align={(headCells[colIdx].align === "right") ? 'right' : (headCells[colIdx].align === "left") ? 'left' : 'center'}>
            <div className={classes.headerCellDiv + " crxTableHeaderSize"}
            style={
                {
                minWidth:`${(headCells[colIdx].minWidth === undefined) ? "" : headCells[colIdx].minWidth}`+"px",
                maxWidth:`${(headCells[colIdx].maxWidth === undefined) ? "" : headCells[colIdx].maxWidth}`+"px"
                }
            } 
            >
            <div className={classes.headerStickness}
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
    </ThemeProvider>
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
      <TableRow >
        <TableCell className="DataTableBodyCell" style={{verticalAlign:"top", display:"none"}}>
          {row.level}
        </TableCell>

        <TableCell className="DataTableBodyCell"
          style={{textAlign:"left"}}>
          <div style={{display:"flex",paddingLeft:`${((row.level-1)*20).toString()}`+"px"}}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            </IconButton>
            <label style={{width:"100%"}}>{row.name}</label>
            <div style={{width:"70%", textAlign:"right"}}>
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
            return <TableCell className="DataTableBodyCell"></TableCell>
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
        <TableCell className="DataTableBodyCell" style={{verticalAlign:"top", display:"none"}}>
          {row.level}
        </TableCell>
        {Array.from(Array(row.level-1), () => {
            return <TableCell className="DataTableBodyCell"></TableCell>
          })
        }
        {
          (child && child.length > 0) ? 
          <>
            <TableCell className="DataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "basic").map((item:any) => {                   
                    return <AlllevelTypes row={item} onSetRow={(check:boolean, row:any) => onSetRow(check, row)}></AlllevelTypes>
                  }
                )}
            </TableCell>

            <TableCell className="DataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "advance").map((item:any) => {
                    return <AlllevelTypes row={item} onSetRow={(check:boolean, row:any) => onSetRow(check, row)}></AlllevelTypes>
                  }
                )}
            </TableCell>

            <TableCell className="DataTableBodyCell" style={{verticalAlign:"top"}}>
                {child.filter((x:any) => x.levelType === "restrict").map((item:any) => {
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
      <div style={{textAlign:"left", borderTop:"1px solid #ccc"}}>
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




