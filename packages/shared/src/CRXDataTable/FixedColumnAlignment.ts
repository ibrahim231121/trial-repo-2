export const fixedColumnAlignment = (showDragCol:boolean | undefined, showCheckBoxesCol:boolean | undefined, columnNumber:number) => {
    if(columnNumber === 1)
      showDragCol === false ? "0px" : "60px"
    if(columnNumber === 2)
    {
      showDragCol === false ? 
        (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "0px" : "62px" 
        : 
        (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? "62px" : "118px"                  
    }
  }