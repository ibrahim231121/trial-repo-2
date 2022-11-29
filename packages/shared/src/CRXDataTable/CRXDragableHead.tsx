import React, { useEffect } from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { SortableContainer } from "react-sortable-hoc";

//Use the react-sortable-hoc wrappers around the matui elements
const DragableHead = SortableContainer(( props: any) => {
  
  const [windScrollValue, setWindScrollValue] = React.useState<any>(0)
  
  function createScrollStopListener(element : any, callback : any, timeout : number) {
    let handle: any = null;
    const tbl : any = document.getElementsByClassName('AssetsDataGrid')[0]
    const onScroll = function() {
        
        if (handle) {
            clearTimeout(handle);
        }
        
        handle = setTimeout(callback, timeout || 200); // default 200 ms
        tbl && props.searchHeader == false && ( tbl.style.display = "inline-table")
        props.offsetY && window.pageYOffset > props.offsetY && setWindScrollValue(props.dragableHeaderPosition)
    };

    element.addEventListener('scroll', onScroll);
    return function() {
        element.removeEventListener('scroll', onScroll);
    };
  }
  
  useEffect(() => {
    const tblBlock : any = document.getElementsByClassName('AssetsDataGrid')[0]
    
    createScrollStopListener(window, function() {
      tblBlock && props.searchHeader == false &&  (tblBlock.style.display = "block")
      setWindScrollValue(window.pageYOffset - props.topSpaceDrag)
    }, 300);
  },[])

    return (
      <TableHead style={{"top" : windScrollValue +  "px"}}>
        <TableRow>
          {props.children}
        </TableRow>
      </TableHead>
    );
  });

export default DragableHead;