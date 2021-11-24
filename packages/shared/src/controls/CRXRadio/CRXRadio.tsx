import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import './CRXRadio.scss';

type Props = {
  content: { value: any; label: string;isDisabled: boolean;isDisableRipple:boolean; Comp:any}[];
  value:any;
  setValue:any;
  className?:string;
  disableRipple? :boolean;
};

const useStyles = makeStyles({
  icon: {
    fontSize: "18px",
    color:"#D1D2D4",
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

const CRXRadio: React.FC<Props> = ({ content ,value,setValue,className }) => {
//   const [value, setValue] = React.useState("female");
  const classes = useStyles()
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const radioIcon = "icon icon-radio-unchecked";
  const cehckedIcon = "icon-radio-checked";
  return (
    <FormControl component="fieldset">
      <RadioGroup
      className={className + " crx-radio-btn"}
        value={value}
 
        onChange={handleChange}
      >
        {content.map((x) => (
          <>
            <FormControlLabel
            key={x.value}
              value={x.value}
              disabled={x.isDisabled}
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
  );
};
export default CRXRadio