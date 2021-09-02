import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/Check";
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import "./SelectBox.scss";
import el from "date-fns/esm/locale/el/index.js";
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
  name: string;
}
interface renderCheck {
  selected?: boolean;
  value?: string;
  year?: number;
}

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent !important',
      boxShadow:'none !important',
    },
  },
  listbox: {
    borderRadius:'1px !important',
    backgroundColor: '#404041',
    paddingTop:'0px',
    width:'288px',
    marginLeft:'-16px',
    border:'0 !important',
    marginTop:'4px',
    paddingBottom:'2.5px',
    position:'absolute',
  },
  option: {
    height:'33px',
    color:'#D1D2D4',
    fontSize:'14px',
    border:'0 !important',
    padding:'0 !important',
    margin:'0 !important',
    '&[data-focus="true"]': {
      backgroundColor: '#6E6E6E',
      borderColor: '0',
      color:'#D1D2D4'
    },
    '&[aria-selected="true"]': {
      backgroundColor: '#231F20',
      borderColor: 'transparent',
      color:'#D1D2D4'
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
  } = props;

  const renderCheckBox = (option: renderCheck, selected: boolean) => {
    if (CheckBox) {
      return (
        <>
          <Checkbox
           disableRipple
            icon={<CheckBoxOutlineBlankIcon fontSize="small"  style={{ color: 'transparent'}} />}
            checkedIcon={<CheckBoxIcon fontSize="small" style={{ color: '#fff'}} />}
            style={{ marginRight: 8 }}
            classes={{root:classes.root}}
            checked={selected}
          />
          {option.value ? option.value : " "}
         
        </>
      );
    } else {
      return <>{option.value}
       </>;
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
        ChipProps={{ deleteIcon: <ClearSharpIcon fontSize="large" fontWeight="bold" /> }}
        multiple={multiple}
        autoComplete={autoComplete}
        className={"getac-simple-select crx-getac-dropdown " + className}
        id={id}
        options={options}
        autoSelect={autoSelect}
        openOnFocus={true}
        value={value}
        classes={{
          option: styles.option,
          listbox: styles.listbox,
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
          console.log(e);
        }}
        renderInput={(params: object) => {
          return (
            <div>
            <TextField
              className="selectBoxTextField"
              {...params}
              placeholder="Search and Select..."
              inputRef={(input) => {
                inputRef = input;
              }}
            /></div>
          );
        }}
      />
    </>
  );
}
