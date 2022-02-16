import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "@material-ui/icons"

import { DataTableToolbarProps, useToolbarStyles } from "./CRXDataTableTypes"
import { useTranslation } from 'react-i18next';
import DataTableClearFilter from "./CRXDataTableFilter"
import DataTableCustomizeColumns from "./CRXDataTableCustomizeColumns"


const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  id,
  headCells,
  rowCount,
  columnVisibilityBar,
  onChange,
  onClearAll,
  onReOrder,
  orderingColumn,
  onHeadCellChange,
  showCountText,
  showCustomizeIcon,
  numSelected,
  showTotalSelectedText
}) => {
  const classes = useToolbarStyles();
  const [filterPopup, setFilterPopup] = useState<any>()
  const { t } = useTranslation<string>();4
  useEffect(() => {
    console.log("Filter", filterPopup)
    //setFilterPopup(null)
  },[filterPopup])
  const [showCustomize,setShowCustomize] = useState<any>();

  return (

    <Toolbar
      className={clsx("crxClearfilter stickyPos " + classes.root)}>

      {
        (showCountText || showCountText === undefined) ?
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {<><b>{rowCount}</b> {t(id)}</>}
          </Typography> : <></>
      }
      {
        (showTotalSelectedText || showTotalSelectedText === undefined) ?
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {<>{numSelected} total users in group </>}
          </Typography> : <></>
      }

      <DataTableClearFilter
        columnVisibilityBar={columnVisibilityBar}
        filterClose={showCustomize}
        onClearAll={() => onClearAll()} />
       {(showCustomizeIcon || showCountText === undefined) &&
        <DataTableCustomizeColumns
          id={id}
          filterWindow = {setShowCustomize}
          headCells={headCells}
          orderingColumn={orderingColumn}
          onReorder={(e: number[]) => onReOrder(e)}
          onChange={onChange}
          filterWindow={setFilterPopup}
          onHeadCellChange={onHeadCellChange}
          showCustomizeIcon={showCustomizeIcon}
        />
      }

    </Toolbar>

  );
};

export default DataTableToolbar;


