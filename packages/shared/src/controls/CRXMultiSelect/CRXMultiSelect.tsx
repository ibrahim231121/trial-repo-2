import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/Check";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import { makeStyles } from "@material-ui/core/styles";

import "./SelectBox.scss";

interface noOptionprops {
  width: string;
  marginLeft: string;
  top: string;
  whiteSpace: string;
  overFlow: string;
  textOverflow: string;
  fontSize: string;
  lineHeight: string;
  marginTop : string;
}
interface paddingLeftprops {
  marginLeft: string;
  marginRight: string;
  paddingRight: string;
  paddingLeft: string;
}

interface selectBoxProps {
  multiple?: boolean;
  CheckBox?: boolean;
  id?: string;
  className?: string;
  open: boolean;
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
  noOptions?: noOptionprops;
  paddLeft?: paddingLeftprops;
}
interface renderCheck {
  selected?: boolean;
  value?: string;
  year?: number;
}

export default function CRXMultiSelect(props: selectBoxProps) {
  const {
    multiple = false,
    CheckBox,
    id,
    className,
    autoComplete = false,
    autoSelect = false,
    useRef,
    options,
    value,
    onChange,
    onClose,
    onOpen,
    open,
    noOptions,
    paddLeft,
  } = props;
  const useStyles = makeStyles({
    root: {
      marginLeft: paddLeft && paddLeft.marginLeft,
      paddingRight: paddLeft && paddLeft.paddingRight,
      paddingLeft: paddLeft && paddLeft.paddingLeft,
      marginRight: paddLeft && paddLeft.marginRight,
      "&:hover": {
        backgroundColor: "transparent !important",
        boxShadow: "none !important",
      },
    },
    listbox: {
      borderRadius: "1px !important",
      backgroundColor: "#404041",
      paddingTop: "0px",
      width: noOptions && noOptions.width,
      marginLeft: noOptions && noOptions.marginLeft,
      border: "0 !important",
      left: "0",
      marginTop: noOptions && noOptions.marginTop,
      paddingBottom: "0",
      position: "absolute",
      maxHeight: "201px",
      minHeight: "35.5px",
      borderTop: "1px solid #888787 !important",
      top: noOptions && noOptions.top,
    },
    noOptions: {
      color: "#D1D2D4",
      backgroundColor: "#404041",
      height: "33px",
      lineHeight: "5px",
      marginLeft: noOptions && noOptions.marginLeft,
      width: noOptions && noOptions.width,
      position: "absolute",
      fontSize: "14px",
    },
    option: {
      height: "33px",
      color: "#D1D2D4",
      fontSize: noOptions && noOptions.fontSize,
      border: "0 !important",
      alignItems: "center",
      lineHeight: noOptions && noOptions.lineHeight,
      padding: "8px 0 9px",
      wordBreak: "break-all",
      '&[data-focus="true"]': {
        backgroundColor: "#6E6E6E",
        borderColor: "0",
        color: "#D1D2D4",
        height: "33px",
      },
      '&[aria-selected="true"]': {
        backgroundColor: "#231F20",
        borderColor: "transparent",
        color: "#D1D2D4",
        height: "33px",
      },
    },
  });
  const styles = useStyles();
  const classes = useStyles();
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
        // open={true}
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
          noOptions: styles.noOptions
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
          if (e.nativeEvent.data !== null) {
            settextFill(true);
          }
          if (e.nativeEvent.data == null) {
            settextFill(false);
          }
        }}
        renderInput={(params: object) => {
          return (
            <div>
              <TextField
                className={`selectBoxTextField selectBoxTextFieldAssets ${
                  textFill == true
                    ? "applyFieldBoreder"
                    : textFill == false
                    ? "removeFieldBoreder"
                    : ""
                }`}
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
