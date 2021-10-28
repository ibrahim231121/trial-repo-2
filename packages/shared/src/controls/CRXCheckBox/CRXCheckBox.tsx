import React from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import './CheckBox.scss'

interface Props {
  name?: string;
  label?: string;
  checked?: boolean;
  inputProps?: string,
  disabled?: boolean;
  isError?:boolean;
  lightMode? : boolean,
  onChange: (e: any) => void;
  className? : string,
  selectedRow? : boolean,

}

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'none',
    },
  },
  icon: {
    borderRadius: 0,
    outline:"1px solid #d1d2d4",
    width:"18px",
    fontSize:"18px",
    boxShadow: 'none',
    color:'#fff',
    'input:hover ~ &': {
      border:"0px solid #333333",
      borderRadius: "0px",
      outline:"1px solid #333333",
      backgroundColor: '#ffffff',
    },
    'input:selected ~ &': {
      outline:"1px solid #d1d2d4",
      backgroundColor: '#ffffff',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      color: '#e5e5e5',
      outline:'1px solid #979797',
      background: '#e5e5e5',
    },
  },
});
const CRXCheckBox: React.FC<Props> = ({ className, selectedRow = false ,isError = false, disabled = false , checked, lightMode = false, onChange, name, inputProps = 'uncontrolled-checkbox' }) => {
  const classes = useStyles();
  const checkBoxSelected = lightMode ? 'crxSelectedLight' : 'crxSelectedDark';
  const checkBoxIconClass = selectedRow ? 'fal fa-check-square crxCheckForDarBg' : 'fas fa-check-square';
  const disable = disabled && "disabled";
  const error = isError && 'error';
  return (
    <>
      <Checkbox
      
        className={classes.root + " CRXCheckBox " + className  + disable }
        checked={checked}
        disableRipple
        onChange={onChange}
        name={name}
        disabled={disabled}
        checkedIcon={<span className={checkBoxIconClass + " " + checkBoxSelected + " " + error} />}
        icon={<span className={classes.icon + " fas fa-square"} />}
        inputProps={{ 'aria-label': inputProps }}
    
        
      />
    </>
  );
};

export default CRXCheckBox;
