import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./SelectBox.scss";
import el from "date-fns/esm/locale/el/index.js";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  name: string;
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
    isSearchable,
    options,
    value,
    onChange,
    name = "",
    onClose,
  } = props;

  const renderCheckBox = (option: renderCheck, selected: boolean) => {
    if (CheckBox) {
      return (
        <>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.value ? option.value : " "}
        </>
      );
    } else {
      return <>{option.value} </>;
    }
  };
  let inputRef: any;
  useEffect(() => {
    if (useRef) {
      inputRef.focus();
    }
  }, [useRef]);

  return (
    <>
      <Autocomplete
        onClose={onClose}
        disableCloseOnSelect
        multiple={multiple}
        autoComplete={autoComplete}
        className={"getac-simple-select " + className}
        id={id}
        options={options}
        autoSelect={autoSelect}
        openOnFocus={true}
        value={value}
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
          console.log(e);
        }}
        renderInput={(params: object) => {
          return (
            <TextField
              className="selectBoxTextField"
              {...params}
              variant="outlined"
              inputRef={(input) => {
                inputRef = input;
              }}
            />
          );
        }}
      />
    </>
  );
}
