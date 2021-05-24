import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import {Popper} from '@material-ui/core'
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
  freeSolo : boolean
}

interface renderCheck {
  selected?: boolean;
  title?: string;
  year?: number;
}

const optionStyle = makeStyles((theme: Theme) =>
createStyles({
  "& .MuiAutocomplete-popper" : {
    width: "100%"
  },
  option: {
    height: '33px',
    alignItems: 'flex-start',
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize:"14px",
    margin:"0px",
    color:"#333",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    },
    "&:focus": {
      backgroundColor: "#6e6e6e",
      color:"#f5f5f5",
    }
    
  },
  paper : {
    borderRadius: "0px",
    border: "0px solid #bebebe",
    boxShadow: "rgba(0,0,0,0.20) 0px 0px 4px 0px",
    marginTop: "0px !important",
    padding:"0px",
    '& .MuiAutocomplete-paper' : {
      margin: "0px 0 !important",
    },
    '& .MuiAutocomplete-listbox' : {
      padding:"0px",
      top:"-10px",
      border: "1px solid #bebebe",
    }
  },
 
}))

const CRXAutocomplete = ({
  multiple = false,
  freeSolo = true,
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
  const classes = optionStyle()
  
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
      freeSolo={freeSolo}
      //closeIcon={<button onClick={clearText}> <CloseIcon   fontSize="small" /></button>}
      options={data}
      // disableCloseOnSelect
      autoSelect={true}
      getOptionLabel={(option: any) => option
      }
      // onCancel= {(e : object, reason : string) => (console.log("dasda"))}
      onInputChange={onInputChange}
      classes={{
        option: classes.option,
        paper : classes.paper
      }}
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
