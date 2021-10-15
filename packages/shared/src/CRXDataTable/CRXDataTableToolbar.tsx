import React from 'react';
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
}) => {
  const classes = useToolbarStyles();

  const { t } = useTranslation<string>();

  return (

    <Toolbar
      className={clsx(classes.root)}>
      <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
        {(showCountText || showCountText === undefined) && <><b>{rowCount}</b> {t(id)}</>}
      </Typography>


      <DataTableClearFilter
        columnVisibilityBar={columnVisibilityBar}
        onClearAll={() => onClearAll()} />
      {(showCustomizeIcon || showCountText === undefined) &&
        <DataTableCustomizeColumns
          id={id}
          headCells={headCells}
          orderingColumn={orderingColumn}
          onReorder={(e: number[]) => onReOrder(e)}
          onChange={onChange}
          onHeadCellChange={onHeadCellChange}
          showCustomizeIcon={showCustomizeIcon}
        />
      }

    </Toolbar>

  );
};

export default DataTableToolbar;


