import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./EditableSelect.scss";
import CloseIcon from '@material-ui/icons/Close';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface selectBoxProps {
  multiple?: boolean;
  options: any[];
  CheckBox?: boolean;
  id?: string;
  clearText:()=>void;
  className?: string;
  placeHolder?: string;
  onChange: (e: any,value:any) => void;
  onInputChange: (e: any) => void;
}

interface renderCheck {
  selected?: boolean;
  title?: string;
  year?: number;
}

const CRXAutocomplete = ({
  multiple = false,
  onChange,
  onInputChange,
  options,
  CheckBox,
  clearText,
  id,
  className,
  placeHolder
}: selectBoxProps) => {
  const data = options;

  // const renderCheckBox = (option: renderCheck, selected: boolean) => {
  //   if (CheckBox === true) {
  //     return (
  //       <>
  //         <Checkbox
  //           icon={icon}
  //           checkedIcon={checkedIcon}
  //           style={{ marginRight: 8 }}
  //           checked={selected}
  //         />
  //         {option.title ? option.title : " "}
  //       </>
  //     );
  //   } else {
  //     return <>{option.title} </>;
  //   }
  // };

  return (
    <Autocomplete
      multiple={multiple}
      className={"getac-simple-select " + className}
      id={id}
      //closeIcon={<button onClick={clearText}> <CloseIcon   fontSize="small" /></button>}
      options={data}
      // disableCloseOnSelect
       autoSelect={true}
      getOptionLabel={(option: any) => option
      }
      // onCancel= {(e : object, reason : string) => (console.log("dasda"))}
      onInputChange={onInputChange}
      onChange={(e,value) => {
        return onChange(e,value);
      }}
      // renderOption={(option: renderCheck, { selected }) =>
      //   renderCheckBox(option, selected)
      // }
      renderInput={(params: object) => (
        <TextField
         placeholder={placeHolder}
          className="selectBoxTextField"
          {...params}
          variant="outlined"
        />
      )}
    />
  );
};

export default CRXAutocomplete;
