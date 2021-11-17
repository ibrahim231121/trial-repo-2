import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

type Props = {
  content: { value: any; label: string;isDisabled: boolean;Comp:any}[];
  value:any;
  setValue:any;
};

const CRXRadio: React.FC<Props> = ({ content ,value,setValue }) => {
//   const [value, setValue] = React.useState("female");

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup
        value={value}
        onChange={handleChange}
      >
        {content.map((x) => (
          <>
            <FormControlLabel
            key={x.value}
              value={x.value}
              disabled={x.isDisabled}
              control={<Radio />}
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