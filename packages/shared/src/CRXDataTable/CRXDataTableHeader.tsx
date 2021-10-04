import React from "react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from '@material-ui/core/IconButton';
import Draggable from "react-draggable";
import {
  useStyles,
  DataTableHeaderProps
} from "./CRXDataTableTypes";
import {useTranslation} from 'react-i18next'; 

const DataTableHeader: React.FC<DataTableHeaderProps> = ({orderColumn, headCells, orderData, onHandleRequestSort, onResizeRow, dragVisibility,showCheckBoxesCol}) => {

  const classes = useStyles();
  const {t} = useTranslation<string>();

  const resizeRow = (e: {
    colIdx: number;
    deltaX: number;
  }) => {
    onResizeRow(e) 
  }

  return (
    <>
        {(dragVisibility === true || dragVisibility === undefined) ? 
            <TableCell className={classes.headerStickness + " CRXDataTableLabelCell crxTableHeaderSize"} 
                style={{width: '60px', minWidth: "60px", left: 0, position: "sticky", zIndex: 4}}>
            </TableCell>
        : null
        }
        {(showCheckBoxesCol === true || showCheckBoxesCol === undefined) ? 
            <TableCell className={classes.headerStickness + " CRXDataTableLabelCell crxTableHeaderSize"} 
                style={{width: '58px', minWidth: "58px", left: `${(dragVisibility === false) ? "0px" : "60px"}`, position: "sticky", zIndex: 4}}>
            </TableCell>  
        : null
        }
        <TableCell className={classes.headerStickness + " CRXDataTableLabelCell crxTableHeaderSize"} 
            style={{width: '80px', minWidth: '80px', 
                    left: `${dragVisibility === false ? 
                        (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "0px" : "62px" 
                              : 
                        (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "62px" : "118px" 
                    }`,
                    position: "sticky", 
                    zIndex: 4}}>
            {t('Actions')}
        </TableCell> 
        {orderColumn.map((colIdx, i) => (
            //index needs to be CURRENT
            //key needs to be STATIC
            <TableCell className={classes.headerStickness + " CRXDataTableLabelCell"} key={i} 
                style={{display:`${(headCells[colIdx].visible === undefined || headCells[colIdx].visible === true) ? "" : "none"}`}}
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
            </div>
            <div className="gridSortResize">
            {(headCells[colIdx].sort === true) ? (
            
                    <span  className="GridSortIcon"                         
                    onClick={() => onHandleRequestSort(headCells[colIdx].id)}
                    >
                    {(orderData.orderBy === headCells[colIdx].id) ? (
                        <span> 
                        {orderData.order === 'desc' ? 
                            <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                                <i className="fas fa-sort-up"></i>                                       
                            </IconButton>
                            : 
                            <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                                <i className="fas fa-sort-down"></i>
                            </IconButton>
                            }
                        </span>
                    ) : 
                    <IconButton aria-label="expand row" size="small" className={classes.iconArrows}>
                            <i className="fas fa-sort"></i>
                    </IconButton>
                    }
                    </span>
                ) : (
                null
                )
            }    
            <Draggable
                axis="none"
                defaultClassName="DragHandle"
                defaultClassNameDragging="DragHandleActive"
                onDrag={(_, { deltaX }) =>
                resizeRow({
                    colIdx,
                    deltaX
                })
                }
                position={{ x: 0, y: 0}}
            >
                <span className="DragHandleIcon"></span>
            </Draggable>
            </div>
            </div>  
                
            </TableCell>  
        ))}
    </>
  );
};

export default DataTableHeader;
