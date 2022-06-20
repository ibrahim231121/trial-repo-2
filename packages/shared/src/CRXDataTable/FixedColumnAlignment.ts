export const fixedColumnAlignment = (showDragCol:boolean | undefined, showCheckBoxesCol:boolean | undefined, columnNumber:number) => {
  let x:string = "0px";
  if(columnNumber === 1)
      showDragCol === false ? x = "0px" : x = "60px"
    if(columnNumber === 2)
    {
      // showDragCol === false ? 
        (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? x = "0px" : x = "60px" 
        // : 
        // (showCheckBoxesCol === false || showCheckBoxesCol !== undefined ) ? x = "60px" : x = "118px"                  
    }
    return x
  }