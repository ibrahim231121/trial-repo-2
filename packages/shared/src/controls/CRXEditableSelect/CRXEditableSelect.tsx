import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles, createStyles} from '@material-ui/core/styles'
import "./EditableSelect.scss";
import { Typography } from "@material-ui/core";
import CRXTooltip from "../CRXTooltip/CRXTooltip"
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
interface selectBoxProps {
  multiple?: boolean;
  options: any[];
  CheckBox?: boolean;
  id?: string;
  label?: string | undefined;
  clearText:()=>void;
  className?: string;
  placeHolder?: string;
  onChange: (e: any,value:any) => void;
  onInputChange: (e: any) => void;
  freeSolo : boolean;
  value:string;
  required: boolean;
  error?: boolean;
  errorMsg?: string;
  FilterAddClass?:string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp : (event: React.KeyboardEvent<HTMLImageElement>) => void; 
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
  popper : {
    zIndex : "99999" as any,
  },
  clearIndicator : {
    visibility: "hidden",
    '&:hover' : {
      backgroundColor : "transparent",
      visibility: "hidden",
    },
    '&:focus' : {
      backgroundColor : "transparent"
    }
  }
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
  value,
  label,
  required,
  error,
  errorMsg,
  onBlur,
  onKeyUp,
  FilterAddClass,
}: selectBoxProps) => {

  const data = options;
  // const errors = error ? "errors" : " "; 
  const [editable,setEditable] = React.useState("");
  const errorMsgIcon = (
    <i className="fas fa-exclamation-circle">
      <span className="crxErrorMsg"> {errorMsg}</span>
    </i>
  );
  const classes = optionStyle()
  const handleOnOpen = () => {
  }

  const reformatedLabel = () => {
    if (required) {
      return (
        <span className="requiredLable">
          {label}{" "}
          <span style={{ color: `${error ? "#aa1d1d" : "#000"}` }}>*</span>
        </span>
      );
    } else {
      return <span>{label} </span>;
    }
  };
  const opupOpenCret = <i className="fas fa-caret-down"></i>
  
  return (
    <>
      <span >
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <span>
    <Autocomplete
      multiple={multiple}
      className={"getac-simple-select " + className + " " + classes.root + " " + `${editable}`}
      id={id}
      freeSolo={freeSolo}
      popupIcon={opupOpenCret}
      clearText=""
      closeIcon={<CRXTooltip iconName="fal fa-times" arrow={false} title="clear" placement="top" id="clearIconSelectBox_search" className="predictiveSearchCloseIcon"/>}
       ChipProps={{
          deleteIcon: <ClearSharpIcon fontSize="large" fontWeight="bold" />,
        }}
      options={data}
      autoSelect={true}
      value={value}
      getOptionLabel={(option: any) => option
      }
      
      onInputChange={onInputChange}
      classes={{
        option: classes.option,
        paper : classes.paper,
        clearIndicator : classes.clearIndicator,
        popper : classes.popper + " " + FilterAddClass
      }}
      onChange={(e,value) => {
        if(value){
          setEditable('CRXAISearchFiltere');
         }
         else {
          setEditable('');
         }
        return onChange(e,value);
      }}
      onOpen={() => handleOnOpen()}
     
      renderInput={(params: object) => (
              
        <TextField
         placeholder={placeHolder}
         onBlur={onBlur}
          className={"getac-simple-select"+ " " + "error" +  " " + "selectBoxTextField"}
          error={error}
          {...params}
          variant="outlined"
          
          InputLabelProps={ { required: required }} 
          onKeyUp = {(event: React.KeyboardEvent<HTMLImageElement>) =>
            onKeyUp(event)}
        />

      )}
    />
    
    {error && (
            <Typography
              className="errorStateContent"
              variant="caption"
              display="block"
              gutterBottom
            >
               {errorMsgIcon}
            </Typography>
          )}
        </span>
      </span>
    </>
  
  );
};

export default CRXAutocomplete;
