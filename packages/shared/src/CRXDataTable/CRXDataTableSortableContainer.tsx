import React from 'react';
import "@material-ui/icons"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { SortableContainer } from "react-sortable-hoc";
import CRXCheckBox from '../controls/CRXCheckBox/CRXCheckBox'
import SortableItem from "./CRXDataTableSortableItem"

const SortableList = SortableContainer((props: any) => {
    const {orderColumn, selected, chkStyle, onReOrderChange, dragHideState, id} = props;
    const handleCheckChange = (event: any, index: number) => {    
  
      onReOrderChange(event.target.checked,index)
    }
  
    let hide:any; 
    const dragableSortTarget = (colIdx : any) =>{
        
        const names : any = selected[colIdx].id;
        if(colIdx > 0 && dragHideState[names] === true) {
          return hide = ""
        }else {
          return hide = "sortDragHide"
        }
     }
    return (
      <ul className="columnUlList">
        {orderColumn.map((colIdx: any, index: number) => (
          
          dragableSortTarget(colIdx),
          <>
          {(selected[colIdx].keyCol === false || selected[colIdx].keyCol === undefined) ? 
          <>
          <SortableItem 
            key={colIdx} 
            index={index}
            id={id}
            value={
     
                <FormControlLabel
                  value={selected[colIdx].label}
                  control={<CRXCheckBox className="customizeCheckBox" checked={selected[colIdx].visible} onChange={(e) => handleCheckChange(e,colIdx)} />}
                  //icon={<span className={chkStyle.icon} />}
                  className={chkStyle.root + " shoHideCheckbox"}
                  
                  //color="default" />}
                  label={selected[colIdx].label}
                  labelPlacement="end"
                />
                    
              } 
          />
          <div className={"dragableGuide " + hide} ><i className="fas fa-scrubber leftCircle"></i><i className="fas fa-scrubber rightCircle"></i></div>
              </>  
          :
          null
        }
          </>
        ))}
      </ul>
    );
  });

export default SortableList;