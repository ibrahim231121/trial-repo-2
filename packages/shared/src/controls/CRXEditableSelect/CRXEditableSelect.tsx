import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles, createStyles} from '@material-ui/core/styles'
import "./EditableSelect.scss";

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
  freeSolo : boolean;
  value:string
}

const optionStyle = makeStyles(() =>
createStyles({
  "& .MuiAutocomplete-popper" : {
    width: "100%"
  },
  root : {
    "&:focus" : {
      border :"3px solid #888787"
    }
  },
  option: {
    height: '33px',
    alignItems: 'flex-start',
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize:"14px",
    margin:"0px",
    color:"#333",
    borderBottom: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #e7e8ea",
    },
    "&:focus": {
      backgroundColor: "#6e6e6e",
      color:"#f5f5f5",
      borderBottom: "1px solid #6e6e6e",
    }
    
  },
  paper : {
    borderRadius: "0px",
    border: "0px solid #bebebe",
    boxShadow: "rgba(0,0,0,0.20) 0px 0px 5px 0px",
    marginTop: "3px !important",
    padding:"0px",
    '& .MuiAutocomplete-paper' : {
      margin: "0px 0 !important",
    },
    '& .MuiAutocomplete-listbox' : {
      padding:"0px",
      top:"-10px",
      border: "1px solid #bebebe",
      borderTop:"0px",
      maxHeight:"201px"
    }
  },
 
}))

const CRXAutocomplete = ({
  multiple = false,
  freeSolo = true,
  onChange,
  onInputChange,
  options,
  id,
  className,
  placeHolder,
  value
}: selectBoxProps) => {

  const data = options;
  const classes = optionStyle()
  const handleOnOpen = () => {
  }
  return (
    <Autocomplete
      multiple={multiple}
      className={"getac-simple-select " + className + " " + classes.root}
      id={id}
      freeSolo={freeSolo}
      options={data}
      autoSelect={true}
      value={value}
      getOptionLabel={(option: any) => option
      }
      onInputChange={onInputChange}
      classes={{
        option: classes.option,
        paper : classes.paper
      }}
      onChange={(e,value) => {
        return onChange(e,value);
      }}
      onOpen={() => handleOnOpen()}
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
