import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import './CRXRadio.scss';

type Props = {
  content?: { value: any; label: string;isDisabled: boolean;isDisableRipple:boolean; Comp:any; isChecked: any;}[];
  value:any;
  onChange?:any;
  setValue:any;
  className?:string;
  disableRipple? :boolean;
  name? : any;
  checked? : any,
  singleRadioChange? : any
};

const radioButtonStyle = makeStyles({
  root : {
    padding: "0px",
  },
  icon: {
    fontSize: "18px",
    color:"#d1d2d4",
    '&:hover' : {
      background:"transparent"
    }
  },
  checkedIcon: {
      fontSize: "18px",
      color:"#333",
      '&:hover' : {
        background:"transparent"
      }
  },
  colorSecondary : {
    '&:hover' : {
      background:"transparent"
    }
  }
});

const CRXRadio: React.FC<Props> = ({ content ,value,setValue, singleRadioChange, checked, name, className, onChange }) => {
//   const [value, setValue] = React.useState("female");
  const classes = radioButtonStyle()
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const radioIcon = "icon icon-radio-unchecked";
  const cehckedIcon = "icon-radio-checked";
  return (
    <>
    {content && content.length > 0 ?
    
    <FormControl component="fieldset">
      <RadioGroup
        className={className + " crx-radio-btn"}
        value={value}
        onChange={onChange ? onChange : handleChange}
      >
        {content && content.map((x) => (
          <>
            <FormControlLabel
            key={x.value}
              value={x.value}
              disabled={x.isDisabled}
              checked={x.isChecked}
              control={<Radio 
                disableRipple={true}
                checkedIcon={<span className={classes.checkedIcon + " " + cehckedIcon}></span>}
                icon={<span className={classes.icon + " " + radioIcon}></span>}
                
              />}
              label={x.label}
            />
            {x.Comp() && value ===x.value && x.Comp()}
          </>
        ))}
      </RadioGroup>
    </FormControl>
    : <Radio
        checked={checked === value}
        onChange={singleRadioChange}
        value={value}
        name={name}
        className = {classes.root}
        inputProps={{ 'aria-label': name }}
        checkedIcon={<span className={classes.checkedIcon + " " + cehckedIcon}></span>}
        icon={<span className={classes.icon + " " + radioIcon}></span>}
      />
    }
    </>
  );
};
export default CRXRadio