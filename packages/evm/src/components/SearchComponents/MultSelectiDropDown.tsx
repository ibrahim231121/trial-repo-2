import React, { useEffect } from "react";
import {
  CRXMultiSelect,
  CRXPaper,
  CRXHeading,
  CRXColumn,
  CRXRows,
} from "@cb/shared";
import { ValueString } from "../../utils/globalDataTableFunctions"

type Props = {
    headCells: any[],
    colIdx: number,
    reformattedRows: any[],
    isSearchable: boolean,
    onMultiSelectChange: (value: ValueString[], colIdx: number) => void
    onSetSearchData: () => void
    onSetHeaderArray: (e: any) => void,
}


const MultSelectiDropDown: React.FC<Props> = ({
    headCells,
    colIdx,
    reformattedRows,
    isSearchable,
    onMultiSelectChange,
    onSetSearchData,
    onSetHeaderArray,
}
  ) => {
    const [filterValue, setFilterValue] = React.useState<any>([]);
    const [openState, setOpenState] = React.useState<boolean>(false);
    const [buttonState, setButtonState] = React.useState<boolean>(false);
    const [filterClick , setFilterClick] = React.useState<boolean>(false);

    let options = reformattedRows.map((row: any, _: any) => {
      let option: any = {};
      option["value"] = row[headCells[colIdx].id];
      return option;
    });

    // For those properties which contains an array
    if (
      headCells[colIdx].id.toString() === "categories" ||
      headCells[colIdx].id.toString() === "recordedBy"
    ) {
      let moreOptions: any = [];
      reformattedRows.map((row: any, _: any) => {
        let x = headCells[colIdx].id;
        row[x].forEach((element: any) => {
          let moreOption: any = {};
          moreOption["value"] = element;
          moreOptions.push(moreOption);
        });
      });
      options = moreOptions;
    }
    //------------------

    let unique: any = options.map((x: any) => x);

    if (options.length > 0) {
      unique = [];
      unique[0] = options[0];
      for (var i = 0; i < options.length; i++) {
        if (!unique.some((item: any) => item.value === options[i].value)) {
          let value: any = {};
          value["value"] = options[i].value;
          unique.push(value);
        }
      }
    }

    function handleChange(e: any, colIdx: number, v: any) {  
      setFilterValue((val: []) => [...v]);   
      onMultiSelectChange(v, colIdx);
      onSetHeaderArray(v)
    }

    function GetClassName() {
      return openState ? "" : "hide";
    }

    function GetButtonClass() {
      return buttonState ? "autocompleteSpacer" : "hide";
    }

    function OnCloseEffect(e: any, r: any) {
      if(e.target.classList.contains("MuiSvgIcon-root") || e.target.hasAttribute("d") || e.target.classList.contains("MuiIconButton-label") || e.target.matches("span[class*='MuiIconButton-label-']") || e.target.matches("span[class*='MuiSvgIcon-root-']")  ) {
        setFilterClick(true);
       }
      if (filterValue.length > 0) {
        setButtonState(true);
        setOpenState(false);
      } else {
        setButtonState(false);
        setOpenState(true);
      }
    }

   function onOpenEffect(e:any) {
    if(e.target.classList.contains("MuiSvgIcon-root") || e.target.hasAttribute("d") ||  e.target.classList.contains("MuiIconButton-label")  || e.target.matches("span[class*='MuiIconButton-label-']") || e.target.matches("span[class*='MuiSvgIcon-root-']") ) {
      setFilterClick(false);
    }
   } 

    function ClearFilter() {
      setOpenState(true);
      setButtonState(false);
      setFilterValue([]);
      onSetHeaderArray([])
    }

    useEffect(() => {
      ClearFilter()
    }, [headCells]);

    useEffect(() => {
      if (filterValue.length === 0) {
        onSetSearchData()
      }
    }, [filterValue]);

    return (
      <div className="">
        <CRXRows container spacing={2}>
          <CRXColumn item xs={6}>
            <CRXPaper
              variant="outlined"
              elevation={1}
              square={true}
              className={"centerPosition"}
            >
              <CRXHeading variant="h6" align="left">
                {" "}
              </CRXHeading>
              <div className={GetButtonClass() + ' crx-icon-filter'}>
                <button
                  className="fas fa-filter"
                  onClick={(e) => setOpenState((state) => !state)}
                ></button>
                <button
                  className="icon-cross2 croseIcon"
                  onClick={(e) => ClearFilter()}
                ></button>
              </div>

              <CRXMultiSelect
                className={` ${GetClassName()} ${filterClick ? "openAutoMulti" : "closeAutoMulti"} `}
                onClose={(e: any, r: any) => {
                  return OnCloseEffect(e, r)  
                }}
                onOpen={(e: any) => {
                  return onOpenEffect(e);
                }}
                // name={"AssetType"}
                multiple={true}
                CheckBox={true}
                options={unique}
                value={
                  headCells[colIdx].headerArray === undefined
                    ? (headCells[colIdx].headerArray = [])
                    : headCells[colIdx].headerArray
                }
                autoComplete={false}
                useRef={openState && buttonState }
                isSearchable={isSearchable}
                onChange={(event: any, newValue: any) => {
                  return handleChange(event, colIdx, newValue);
                }}
              />
            </CRXPaper>
          </CRXColumn>
        </CRXRows>
      </div>
    );
  };

  export default MultSelectiDropDown;