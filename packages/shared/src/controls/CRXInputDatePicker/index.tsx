import React from "react";
import { Input } from "@material-ui/core";

//Props type
interface InputProps {
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name: string;
  disabled?: boolean;
  defaultValue?: any;
  minDate?: string;
  maxDate?: string;
}

const CRXInputDatePicker = ({
  value,
  defaultValue,
  name,
  onChange,
  className,
  id,
  minDate,
  maxDate,
  disabled
}: InputProps) => {
  return (
      <Input
        value={value}
        className={"CBX-inputDatePicker " + className}
        defaultValue={defaultValue}
        name={name}
        onChange={onChange}
        id={id}
        disabled = {disabled}
        type="datetime-local"
        inputProps={{ min: minDate, max: maxDate }}
      />
  );
};

export default CRXInputDatePicker;
