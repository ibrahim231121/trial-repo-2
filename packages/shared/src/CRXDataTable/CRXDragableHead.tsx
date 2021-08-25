import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { SortableContainer } from "react-sortable-hoc";

//Use the react-sortable-hoc wrappers around the matui elements
const DragableHead = SortableContainer(( props: any) => {
    return (
      <TableHead>
        <TableRow>
          {props.children}
        </TableRow>
      </TableHead>
    );
  });

// const DragableCell = SortableElement(( props: any) => {
//   return <>{props.value}</>;
// });

export default DragableHead;