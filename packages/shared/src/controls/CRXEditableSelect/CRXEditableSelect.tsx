import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./EditableSelect.scss";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface selectBoxProps {
  multiple?: boolean;
  options: any[];
  CheckBox?: boolean;
  id?: string;
  className?: string;
  onChange: (e: any) => void;
  onInputChange: (e: any) => void;
}

interface renderCheck {
  selected?: boolean;
  title?: string;
  year?: number;
}

const CRXAutocomplete = ({
  multiple,
  onChange,
  onInputChange,
  options,
  CheckBox,
  id,
  className,
}: selectBoxProps) => {
  const data = options;

  const renderCheckBox = (option: renderCheck, selected: boolean) => {
    if (CheckBox === true) {
      return (
        <>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title ? option.title : " "}
        </>
      );
    } else {
      return <>{option.title} </>;
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      className={"getac-simple-select " + className}
      id={id}
      options={data}
      disableCloseOnSelect
      autoSelect={true}
      getOptionLabel={(option: renderCheck) =>
        option.title ? option.title : " "
      }
      onInputChange={onInputChange}
      onChange={(e) => {
        return onChange(e);
      }}
      renderOption={(option: renderCheck, { selected }) =>
        renderCheckBox(option, selected)
      }
      renderInput={(params: object) => (
        <TextField
          className="selectBoxTextField"
          {...params}
          variant="outlined"
        />
      )}
    />
  );
};

export default CRXAutocomplete;
