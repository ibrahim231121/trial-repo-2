import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import "./multiSelectBoxCategory.scss";


interface multiSelectProps {
  multiple?: boolean;
  options: any[];
  onChange: (e: any, v: any) => void;
  id: string;
  defaultValue?: any[];
  className?: string;
  value: any;
  autoComplete?: boolean;
  visibility?: boolean;
}

const MultiSelectBoxCategory = ({
  id,
  multiple,
  options,
  onChange,
  defaultValue,
  className,
  value,
  autoComplete = false,
  visibility,
}: multiSelectProps) => {

  const useSelectBoxStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      border: "3px solid transparent",
      outline: "1px solid #D1D2D4",
      paddingLeft: "5px",
      "&:hover": {
        outline: "1px solid #888787",
      },

      "& > *": {
        margin: theme.spacing(0),
      },
    },

    focused: {
      border: "3px solid #888787",
      outline: "1px solid transparent",
      "&:over": {
        border: "3px solid #888787",
        outline: "1px solid transparent",
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
      marginLeft: "-7px",
      maxHeight: "332px",
      minHeight: "165px",
      overflowY: "auto",
      width: "497px",
      position: "relative",
      backgroundColor: "#fff",
      top: "9px",
      left: "0px",
      "& > ul": {
        padding: "0px",
        maxHeight: "100vh",
        overflow: "hidden",
      },
    },
    popper: {},
    option: {
      height: "33px",
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "#333",
      fontSize: "14px",
      alignItems: "flex-start",
      padding: "0px 12px",
      placeItems: "center",
      '&[aria-selected="true"]': {
        backgroundColor: "#6E6E6E",
        color: "#F5F5F5",
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
        backgroundColor: "#F5F5F5",
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
      paddingTop: "4px",
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
      height: "20px",
      position: "relative",
      marginRight: "14px",
      marginLeft: "5px",
      top: "-1px",
      "& .MuiChip-deleteIcon": {
        
        display: !visibility && "none"
      },
      
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
      "&:after" : {
        display : !visibility && "none"
      },
    },
  })
);


  const classes = useSelectBoxStyle();
  const [styelHeight, setAutoHeight] = React.useState<string>("31px");

  React.useEffect(() => {
    value.length > 3 ? setAutoHeight("auto") : setAutoHeight("31px");
  }, [value, styelHeight]);

  const opupOpenCret = <i className="fas fa-caret-down"></i>;
  return (
    <>
      <Autocomplete
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        filterSelectedOptions={false}
        disableClearable
        disableCloseOnSelect={true}
        closeText=""
        openText=""
        style={{ height: styelHeight }}
        className={"crxMultiAutocomplete " + className + " " + classes.root}
        classes={{
          paper: classes.paper,
          popper: classes.popper,
          option: classes.option,
          popupIndicator: classes.popupIndicator,
          popupIndicatorOpen: classes.popupIndicatorOpen,
          tag : classes.tag,
          focused: classes.focused,
        }}
        multiple={multiple}
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        getOptionLabel={(option) => option.label ?? option}
        getOptionSelected={(option: any, value: any) =>
          option.label == value.label
        }
        popupIcon={opupOpenCret}
        renderOption={(option: any, { selected }) => (
          <React.Fragment>
            {
            <i
              className="far fa-check checkIcon"
              style={{ visibility: selected ? "visible" : "hidden" }}
            />
            {option.label}
          </React.Fragment>
        )}
        renderInput={(params: any) => (
          <TextField {...params} variant="filled" />
        )}

      />
    </>
  );
};

export default MultiSelectBoxCategory;
