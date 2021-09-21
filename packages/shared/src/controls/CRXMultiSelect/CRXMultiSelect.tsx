import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/Check";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import { makeStyles } from "@material-ui/core/styles";
import { ClickAwayListener } from "@material-ui/core";

import "./SelectBox.scss";
import { classNames } from "../../CRXNestedMenu/ClassNames";

interface selectBoxProps {
  multiple?: boolean;
  CheckBox?: boolean;
  id?: string;
  className?: string;
  autoComplete?: boolean;
  autoSelect?: boolean;
  useRef?: boolean;
  isSearchable?: boolean;
  options: any[];
  value: any;
  onChange: (e: any, v: any) => void;
  onClose: (e: any, v: any) => void;
  onOpen?: (e: any) => void;
  name: string;
}
interface renderCheck {
  selected?: boolean;
  value?: string;
  year?: number;
}

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent !important",
      boxShadow: "none !important",
    },
  },
  listbox: {
    borderRadius: "1px !important",
    backgroundColor: "#404041",
    paddingTop: "0px",
    width: "286.8px",
    marginLeft: "-12px",
    border: "0 !important",
    left: "0",
    marginTop: "4px",
    paddingBottom: "0",
    position: "absolute",
    maxHeight: "201px",
    minHeight: "35.5px",
    borderTop: "1px solid #888787 !important",
    top: "7px",
  },
  noOptions: {
    color: "#D1D2D4",
    backgroundColor: "#404041",
    height: "33px",
    lineHeight: "5px",
    marginLeft: "-12px",
    width: "287px",
    position: "absolute",
    fontSize: "14px",
  },
  option: {
    height: "33px",
    color: "#D1D2D4",
    fontSize: "14px",
    border: "0 !important",
    alignItems: "center",
    padding: "8px 0 9px",
    '&[data-focus="true"]': {
      backgroundColor: "#6E6E6E",
      borderColor: "0",
      color: "#D1D2D4",
      height:"33px",
      overflowY:"hidden",
    },
    '&[aria-selected="true"]': {
      backgroundColor: "#231F20",
      borderColor: "transparent",
      color: "#D1D2D4",
      height:"33px",
      overflowY:"hidden",
    },
  },
});
export default function CRXMultiSelect(props: selectBoxProps) {
  const styles = useStyles();
  const classes = useStyles();
  const {
    multiple = false,
    CheckBox,
    id,
    className,
    autoComplete = false,
    autoSelect = false,
    useRef,
    isSearchable,
    options,
    value,
    onChange,
    name = "",
    onClose,
    onOpen,
  } = props;
  const [textFill, settextFill] = React.useState<boolean>(false);
  const renderCheckBox = (option: renderCheck, selected: boolean) => {
    if (CheckBox) {
      return (
        <>
          <Checkbox
            disableRipple
            icon={
              <CheckBoxOutlineBlankIcon
                fontSize="small"
                style={{ color: "transparent" }}
              />
            }
            checkedIcon={
              <CheckBoxIcon fontSize="small" style={{ color: "#fff" }} />
            }
            style={{ marginRight: 0, paddingRight: 7 }}
            classes={{ root: classes.root }}
            checked={selected}
          />
          {option.value ? option.value : " "}
        </>
      );
    } else {
      return <>{option.value}</>;
    }
  };
  let inputRef: any;
  useEffect(() => {
    if (useRef) {
      inputRef.focus();
    }
  }, []);

  return (
    <div className="Autocomplete_multi">
      <Autocomplete
        onClose={onClose}
        onOpen={onOpen}
        disableCloseOnSelect
        ChipProps={{
          deleteIcon: <ClearSharpIcon fontSize="large" fontWeight="bold" />,
        }}
        multiple={multiple}
        autoComplete={autoComplete}
        className={"getac-simple-select crx-getac-dropdown " + className}
        id={id}
        options={options}
        autoSelect={autoSelect}
        value={value}
        classes={{
          option: styles.option,
          listbox: styles.listbox,
          noOptions: styles.noOptions,
        }}
        getOptionLabel={(option: renderCheck) =>
          option.value ? option.value : " "
        }
        getOptionSelected={(option: renderCheck, value: renderCheck) =>
          option.value === value.value
        }
        renderOption={(option: renderCheck, { selected }) => {
          return renderCheckBox(option, selected);
        }}
        onChange={onChange}
        onInputChange={(e) => {
          if(e.nativeEvent.data !== null) {
            settextFill(true);
          } 
          if(e.nativeEvent.data == null) {
            settextFill(false);
          } 
        }}
        renderInput={(params: object) => {
          return (
            <div>
              <TextField
                className={`selectBoxTextField selectBoxTextFieldAssets ${textFill == true ? 'applyFieldBoreder' : textFill == false ?  'removeFieldBoreder' : ''}`}
                {...params}
                placeholder="search and select..."
                inputRef={(input) => {
                  inputRef = input;
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
