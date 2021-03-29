import React from "react";
import { Typography, TextField } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import "./Input.scss";

//Props type
interface InputProps {
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  errorMsg?: string;
}

const CRXInput = ({
  value,
  name,
  onChange,
  className,
  errorMsg,
  error,
  disabled,
  required,
  id,
  type,
}: InputProps) => {
  const disableds = disabled ? "disabled" : " "; //Class will be apply on disaled
  const errors = error ? "errors" : " "; //Class will be apply on Error

  const errMsgContent = () => {
    if (error === true) {
      return (
        <Typography
          className="errorStateContent"
          variant="caption"
          display="block"
          gutterBottom
        >
          <ErrorIcon className="errorState" /> {errorMsg}
        </Typography>
      );
    } else {
      return;
    }
  };

  return (
    <>
      <TextField
        value={value}
        name={name}
        disabled={disabled}
        error={error}
        onChange={onChange}
        className={"CBX-input " + disableds + " " + errors + " " + className}
        id={id}
        required={required}
        type={type}
      />
      {errMsgContent()}
    </>
  );
};

export default CRXInput;

//CRX-input Default class name
//disableds class when input box set disableds
//errors class on error
//className you can add your custom class name
