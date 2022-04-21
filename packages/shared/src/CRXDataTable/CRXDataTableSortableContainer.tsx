import React from "react";
import "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { SortableContainer } from "react-sortable-hoc";
import CRXCheckBox from "../controls/CRXCheckBox/CRXCheckBox";
import SortableItem from "./CRXDataTableSortableItem";
import { HeadCellProps } from "./CRXDataTableTypes";

type SortableListProps = {
  orderColumn: number[];
  headCells: HeadCellProps[];
  chkStyle: any;
  onReOrderChange: (v: boolean, index: number) => void;
  dragHideState: any;
};

const SortableList = SortableContainer(
  ({
    orderColumn,
    headCells,
    chkStyle,
    onReOrderChange,
    dragHideState,
  }: SortableListProps) => {
    const handleCheckChange = (event: any, index: number) => {
      onReOrderChange(event.target.checked, index);
    };

    let hide: any;
    const dragableSortTarget = (colIdx: any) => {
      const names: any = headCells[colIdx].id;
      if (colIdx > 0 && dragHideState[names] === true) {
        return (hide = "");
      } else {
        return (hide = "sortDragHide");
      }
    };
    return (
      <ul className="columnUlList">
        {orderColumn.map(
          (colIdx: any, index: number) => (
            dragableSortTarget(colIdx),
            (
              <React.Fragment key={index}>
                {headCells[colIdx].keyCol === false ||
                headCells[colIdx].keyCol === undefined ? (
                  <>
                    <SortableItem
                      key={colIdx}
                      index={index}
                      value={
                        <FormControlLabel
                          value={headCells[colIdx].label}
                          control={
                            <CRXCheckBox
                              className="customizeCheckBox"
                              checked={headCells[colIdx].visible}
                              onChange={(e) => handleCheckChange(e, colIdx)}
                            />
                          }
                          //icon={<span className={chkStyle.icon} />}
                          className={chkStyle.root + " shoHideCheckbox"}
                          //color="default" />}
                          label={headCells[colIdx].label}
                          labelPlacement="end"
                        />
                      }
                    />
                    <div className={"dragableGuide " + hide}>
                      <i className="fas fa-scrubber leftCircle"></i>
                      <i className="fas fa-scrubber rightCircle"></i>
                    </div>
                  </>
                ) : null}
              </React.Fragment>
            )
          )
        )}
      </ul>
    );
  }
);

export default SortableList;
