import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { SortableContainer } from "react-sortable-hoc";

//Use the react-sortable-hoc wrappers around the matui elements
const DragableHead = SortableContainer(( props: any) => {

    return (
      <TableHead style={{"top" : props.dragableHeaderPosition +  "px", zIndex : 999}}>
        <TableRow>
          {props.children}
        </TableRow>
      </TableHead>
    );
  });

export default DragableHead;