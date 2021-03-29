import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (e: any) => void;
}
const DatePicker: React.FC<Props> = ({ name, label, value, onChange }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        label={label}
        format="MMM/dd/yyyy"
        name={name}
        value={value}
        onChange={onChange}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
