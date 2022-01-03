import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { darkTheme, lightTheme } from "./CRXTheme"
import "./globalSelectBox.scss";


      "& > *": {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "2px solid #fff",
      outline: "1px solid #888787",
      "&:over": {
        border: "2px solid #fff",
        outline: "1px solid #888787",
      },
    },
    icon: {
      color: "#D1D2D4",
      fontSize: "14px",
      fontWeight: "normal",
      paddingRight: "7px",
      marginTop: "1px",
      "&:hover": {
        color: "#333333",
      },
    },

    paper: {
      borderRadius: "0px",
      border: "1px solid #707070",
      boxShadow: "0px 0px 5px #00000033",
      marginTop: "0px",
      marginLeft: "0px",
      maxHeight: "332px",
      minHeight: "165px",
      overflowY: "auto",
      width: "101.5%",
      position: "relative",
      backgroundColor: "#404041",
      top: "3px",
      left: "-8px",

      "& > ul": {
        padding: "0px",
        maxHeight: "100vh",
        overflow: "hidden",
      },
    },
    popper: {},
    clearIndicator: {
      color: "#333333",
      background: "transparent",
      fontSize: "12px",
      padding: "0px 0px 0px",
      "&:hover": {
        background: "transparent",
      },
      "&:i": {
        fontWeight: "bold",
      },
    },
    endAdornment: {
      right: "10px !important",
      top: "3px",
    },
    option: {
      height: "33px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#D1D2D4",
      fontSize: "14px",
      alignItems: "flex-start",
      padding: "0px 15px",
      placeItems: "center",
      '&[aria-selected="true"]': {
        backgroundColor: "#231F20",
        color: "#D1D2D4",
        "&:hover": {
          backgroundColor: "#6E6E6E",
          color: "#F5F5F5",
        },
      },
      // '&[data-focus="true"]': {
      //   backgroundColor: "#6E6E6E",
      //   color: "#F5F5F5",
      // },
      "&:hover": {
        backgroundColor: "#231F20",
        color: "#D1D2D4",
      },
      "&:focus": {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
      },
    },
    popupIndicator: {
      backgroundColor: "transparent",
      color: "#333",
      fontSize: "21px",
      paddingRight: "3px",
      paddingTop: "0px",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    popupIndicatorOpen: {
      transform: "rotate(0deg)",
    },
    tag: {
      backgroundColor: "#fff",
      border: "1px solid #bebebe",
      borderRadius: "1px",
      color: "#333",
      padding: "0px",
      height: "22px",
      position: "relative",
      marginRight: "4px",
      marginLeft: "3px",
      top: "0px",
      "&:hover": {
        backgroundColor: "#F3F4F5",
        border: "1px solid #888787",
        color: "#333333",
        "&:after": {
          color: "#333333",
        },
      },
      "&:span": {
        padding: "0px",
      },
    },
  })
);

interface selectBoxProps {
  multiple?: boolean;
  options: any[];
  value?: any[];
  CheckBox?: boolean;
  id?: string;
  className?: string;
  onChange: (e: any) => void;
  onInputChange?: (e: any) => void;
  autoComplete?: boolean;
  // autoSelect? : boolean,
  open: boolean;
  getOptionLabel: (option: any) => string;
  inputFocus?: any;
  getOptionSelected?: (option: any, label: any) => boolean;
  checkSign?: boolean;
  onClose?: (e: object, reason: string) => void;
  filterOptions?: any;
  clearSelectedItems?: (e: React.SyntheticEvent) => void;
  noOptionsText?: string;
  theme?: string
}

interface renderCheck {
  selected?: boolean;
  label?: string;
  id?: string;
}

const CRXGlobalSelectFilter = ({
  multiple = false,
  clearSelectedItems,
  value,
  checkSign = false,
  getOptionLabel,
  getOptionSelected,
  autoComplete = false,
  onChange,
  options,
  onInputChange,
  CheckBox,
  id,
  className,
  noOptionsText,
  open,
  theme
}: selectBoxProps) => {

  const data = options;
  const classes = theme == 'light' ? lightTheme() : darkTheme();
  const changeStyle = multiple ? "filteredStyle" : " ";
  const opupOpenCret = checkSign || CheckBox ? <i className="fas fa-caret-down"></i> : " ";
  const [opens, setOpen] = useState<boolean>(open);
  const [valState, setValState] = useState<any[]>();
  
  const renderCheckBox = (option: renderCheck, selected: boolean) => {
    if (CheckBox === true) {
      return (
        <>
          <Checkbox
            disableRipple
            icon={<i className="far fa-square selectBoxIcon"></i>}
            checkedIcon={
              <i className="far fa-check-square selectBoxIconCecked "></i>
            }
            style={{ marginRight: 5, paddingLeft: 0 }}
            checked={selected}
          />
          {option.label ? option.label : " "}
        </>
      );
    } else if (checkSign == true) {
      return (
        <>
          <i
            className="fas fa-check checkIcon"
            style={{ visibility: selected ? "visible" : "hidden" }}
          />
          {option.label}
        </>
      );
    } else {
      return <>{option.label}</>;
    }
  };

  React.useEffect(() => {
    setValState(value);
    console.log("value", value);
  }, [value]);

  const clearAllSelectedItems = () => {
    const clearButton: any = document.getElementsByClassName(
      "MuiAutocomplete-clearIndicator"
    )[0];
    clearButton && clearButton.click();
    setOpen(!opens);
    clearSelectedItems;
  };

  return (
    
    <div className="gridFilterGlobal">
      {(value !== undefined && value.length > 0 && !opens) ? (
        <div className="afterSelectedValue">
          <button onClick={() => setOpen(!opens)} className="filterOpenButton">
            <i className="fas fa-filter"></i>
          </button>
          <button className="filterCloseButton" onClick={clearAllSelectedItems}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      ) : null}
      <Autocomplete
        multiple={multiple}
        autoComplete={autoComplete}
        className={
          "crx-global-Select" + ' ' + theme + " " +
          className +
          " " +
          classes.root +
          " " +
          changeStyle
        }
        id={id}
        open={opens}
        closeIcon={<i className="icon-cross"></i>}
        onClose={() => setOpen(false)}
        onMouseDown={() => console.log("opens", opens)}
        value={valState}
        options={data}
        popupIcon={opupOpenCret}
        disableCloseOnSelect
        autoSelect={false}
        openOnFocus={false}
        onOpen={() => setOpen(true)}
        getOptionSelected={getOptionSelected}
        getOptionLabel={getOptionLabel}
        renderOption={(option: any, { selected }) =>
          renderCheckBox(option, selected)
        }
        noOptionsText={<div className="noOptions">{noOptionsText}</div>}
        // onFocus ={(e:any) => {
        //   setOpen(true)
        // }}
        // onBlur={(e:any)=>{
        //   setOpen(false)
        // }}
        classes={classes}
        onInputChange={onInputChange}
        onChange={onChange}
        renderInput={(params: object) => (
          <>
            <TextField
              className="selectBoxTextField"
              onClick={() => setOpen(true)}
              {...params}
              variant="outlined"
            />
          </>
        )}
      />
    </div>
    
  );
};

export default CRXGlobalSelectFilter;
