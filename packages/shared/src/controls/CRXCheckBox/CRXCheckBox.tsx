import React from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import './CheckBox.scss'

interface Props {
  name?: string;
  label?: string;
  checked?: boolean;
  inputProps?: string,
  lightMode? : boolean,
  onChange?: (e: any) => void;
  onClick? : (e : any) => void;
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
    border:"1px solid #d1d2d4",
    width: 16,
    height: 16,
    boxShadow: 'none',
    backgroundColor: '#fff',
    'input:hover ~ &': {
      border:"2px solid #333333",
      borderRadius: "2px"
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
});
const CRXCheckBox: React.FC<Props> = ({ className, selectedRow = false,  checked, lightMode = false, onChange, name, onClick, inputProps = 'uncontrolled-checkbox' }) => {
  const classes = useStyles();
  const checkBoxSelected = lightMode ? 'crxSelectedLight' : 'crxSelectedDark';
  const checkBoxIconClass = selectedRow ? 'fal fa-check-square crxCheckForDarBg' : 'fas fa-check-square';
  return (
    <>
      <Checkbox
        className={classes.root + " CRXCheckBox " + className}
        checked={checked}
        disableRipple
        onChange={onChange}
        name={name}
        checkedIcon={<span className={checkBoxIconClass + " " + checkBoxSelected} />}
        icon={<span className={classes.icon} />}
        inputProps={{ 'aria-label': inputProps }}
        onClick={onClick}
      />
    </>
  );
};

export default CRXCheckBox;
// {
//   /* <Checkbox name={​​​​​​name}​​​​​​ checked={​​​​​​value}​​​​​​ onChange={​​​​​​onChange}​​​​​​ /> */
// }
