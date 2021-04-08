import React, { useEffect } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import "@material-ui/icons"
import {DataTableToolbarProps, useToolbarStyles, HeadCellProps} from "./CRXDataTableTypes"
import MultiSelect from "react-multi-select-component";

export default function  EnhancedTableToolbar (props: DataTableToolbarProps){
    const classes = useToolbarStyles();
    const { numSelected, headCells, rowCount, columnVisibilityBar, onChange } = props;
    const [selected, setSelected] = React.useState<HeadCellProps[]>(headCells);
  
    useEffect(() => {
      //console.log(selected)
      if(selected !== null)
      {
        headCells.map((_, x) => {
            headCells[x].visible = false  
        }) 
        selected.map((select) => {  
          headCells.map((headCell, j) => {
            if(select.value === headCell.value)
              headCells[j].visible = true  
          })             
        })
      }
      onChange()
      
    },[selected])

    return (
      <Toolbar
        className={clsx(classes.root)}>
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            <b>{rowCount}</b> assets
          </Typography>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
              { columnVisibilityBar === true ? (
                  <>
                  <MultiSelect className={classes.alignment}
                    options={headCells}
                    value= {selected}
                    onChange={setSelected}
                    labelledBy={"Select"}
                    hasSelectAll={true}
                  />
                  </>
                ) : null
              }
          </>          
        )}
      </Toolbar>
    );
  };