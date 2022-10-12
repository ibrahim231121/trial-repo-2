import React, { useEffect } from "react";
import {
  CRXMultiSelect,
  CRXPaper,
  CRXHeading,
  CRXColumn,
  CRXRows,
} from "@cb/shared";
import { ValueString, KeyValue } from "../../GlobalFunctions/globalDataTableFunctions"

interface noOptionprops {
  width? : string,
  marginLeft? : string,
  overFlow? : string,
  textOverflow? : string,
  whiteSpace? : string,
  marginRight? : string,
  paddingLeft? : string,
  paddingRight?: string,
  marginTop? : string
}
interface paddingLeftprops {
  marginLeft : string,
  paddingRight : string,
  marginRight : string,
  paddingLeft : string,
}

interface parentStyleProps {
  width? : string,
  padding? : string,
  margin? : string,
}

type Props = {
  headCells: any[],
  colIdx: number,
  reformattedRows: any[],
  isSearchable: boolean,
  parentStye? : parentStyleProps,
  onMultiSelectChange: (value: KeyValue[], colIdx: number) => void
  onSetSearchData: () => void
  onSetHeaderArray: (e: any) => void,
  widthNoOption?:noOptionprops,
  checkedStyle?: paddingLeftprops,
}

function findUniqueOptions(options: any) {
  let unique: any = options.map((x: any) => x);
    if (options.length > 0) {
      unique = [];
      unique[0] = options[0];
      for (var i = 0; i < options.length; i++) {
        if (!unique.some((item: any) => item.name === options[i].name)) {
          let value: any = {};
          value["id"] = options[i].id;
          value["name"] = options[i].name;
          unique.push(value);
        }
      }
    }
    return unique;
}


const MultSelectiDropDownValues: React.FC<Props> = ({
  headCells,
  colIdx,
  reformattedRows,
  isSearchable,
  parentStye,
  onMultiSelectChange,
  onSetSearchData,
  onSetHeaderArray,
  widthNoOption,
  checkedStyle
    
}
) => {

  

  let options  = findUniqueOptions(reformattedRows);

  options = options.map((row: any, _: any) => {
    let option: any = {};
    option["id"] = row.id
    option["value"] = row.name
    return option;
  });

  const [filterValue, setFilterValue] = React.useState<any>([]);
  const [openState, setOpenState] = React.useState<boolean>(false);
  const [buttonState, setButtonState] = React.useState<boolean>(false);
  const [filterClick, setFilterClick] = React.useState<boolean>(false);

  function handleChange(e: any, colIdx: number, value: any) {
    setFilterValue((val: []) => [...value]);
    onMultiSelectChange(value, colIdx);
    onSetHeaderArray(value)
  }

  function GetClassName() {
    return openState? "" : "hide";
  }

  function GetButtonClass() {
    return buttonState ? "autocompleteSpacer" : "hide";
  }

  function OnCloseEffect(e: any, r: any) {
    if (e.target.classList.contains("MuiSvgIcon-root") || e.target.hasAttribute("d") || e.target.classList.contains("MuiIconButton-label") || e.target.matches("span[class*='MuiIconButton-label-']") || e.target.matches("span[class*='MuiSvgIcon-root-']")) {
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

  function onOpenEffect(e: any) {
    if (e.target.classList.contains("MuiSvgIcon-root") || e.target.hasAttribute("d") || e.target.classList.contains("MuiIconButton-label") || e.target.matches("span[class*='MuiIconButton-label-']") || e.target.matches("span[class*='MuiSvgIcon-root-']")) {
      setFilterClick(false);
    }
  }

  function ClearFilter() {
    setOpenState(true);
    setButtonState(false);
    setFilterValue([]);
    onSetHeaderArray([])
    setFilterClick(false);
  }

  useEffect(() => {
    ClearFilter()
  }, [headCells]);

  useEffect(() => {
    if (filterValue.length === 0) {
      
      onSetSearchData()
    }
  }, [filterValue]);

  const setOpenStateFunc = (e : any) => {
    setOpenState(true);
    setFilterClick(true)
  }
    const noOptionCss = widthNoOption
    const paddLeftCss = checkedStyle
  
    return (
      <div className="">
        {/* <CRXRows container spacing={2}>
          <CRXColumn item xs={6}> */}
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
                  onClick={(e) => setOpenStateFunc(e)}
                ></button>
                <button
                  className="icon icon-cross2 croseIcon"
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
                noOptions={noOptionCss}
                checkedStyle={paddLeftCss}
                parentStye={parentStye}
                // name={"AssetType"}
                multiple={true}
                CheckBox={true}
                options={options}
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
          {/* </CRXColumn>
        </CRXRows> */}
      </div>
    );
  };

export default MultSelectiDropDownValues;