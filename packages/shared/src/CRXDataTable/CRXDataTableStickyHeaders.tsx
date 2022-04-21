import React from 'react'

import {
    DataTableStickyHeadersProps,
  } from "./CRXDataTableTypes";
  import DragableHead from "./CRXDragableHead";
  import SearchHeader from "./CRXDataTableSearchHeader";
  import DataTableHeader from "./CRXDataTableHeader";



const CRXDataTableStickyHeaders: React.FC<DataTableStickyHeadersProps> =  ({
    id,
    orderColumn,
    headCells,
    orderData,
    selectedItems,
    container,
    actionComponent,
    page,
    searchHeader,
    onHandleRequestSort,
    onMoveReorder,
    onReorderEnd,
    onResizeRow,
    getRowOnActionClick,
    dragVisibility,
    showCheckBoxesCol,
    showActionCol,
    showActionSearchHeaderCell,
    showHeaderCheckAll,
    onSetCheckAll,
    checkAllPageWise,
    initialRows,
   
}) => {
    return (
        <>
         <DragableHead
          lockAxis="x"
          hideSortableGhost={false}
          helperClass="helperClass"
          axis="x"
          onSortEnd={(e: any, _: any) => onReorderEnd(e,_)}
          onSortStart={(e:any) => onMoveReorder(e)}
        >
         
           <DataTableHeader
             orderColumn={orderColumn}
             headCells={headCells}
             orderData={orderData}
             onHandleRequestSort={(e:any) => onHandleRequestSort(e)}
             onResizeRow={(e:any) => onResizeRow(e)}
             dragVisibility={dragVisibility}
             showCheckBoxesCol={showCheckBoxesCol}
             showActionCol={showActionCol}
           />
   
         
        </DragableHead>

        {searchHeader === true ? (
          <SearchHeader
            id={id}
            page={page}
            orderColumn={orderColumn}
            selectedItems={selectedItems}
            headCells={headCells}
            orderData={orderData}
            container={container}
            actionComponent={actionComponent}
            getRowOnActionClick={getRowOnActionClick}
            dragVisibility={dragVisibility}
            showCheckBoxesCol={showCheckBoxesCol}
            showActionCol={showActionCol}
            showActionSearchHeaderCell={showActionSearchHeaderCell}
            showHeaderCheckAll={showHeaderCheckAll}
            onSetCheckAll={onSetCheckAll}
            checkAllPageWise={checkAllPageWise}
            initialRows={initialRows}
          />
        ) : null}
        </>
    )
}

export default CRXDataTableStickyHeaders;