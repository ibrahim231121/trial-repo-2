import React from "react";
import { Typography, TextField } from "@material-ui/core";
import "./Input.scss";

//Props type
interface InputProps {
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  type: string;
  name: string;
  label?: string | undefined;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: any;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const CRXInput = ({
  value,
  onBlur,
  defaultValue,
  placeholder,
  name,
  onChange,
  className,
  errorMsg,
  error,
  disabled,
  required,
  id,
  type,
  label,...others
}: InputProps) => {
  const disableds = disabled ? "disabled" : " "; //Class will be apply on disaled
  const errors = error ? "errors" : " "; //Class will be apply on Error

  // const errMsgContent = () => {
  //   if (error === true) {
  //     return (
  //       <Typography
  //         className="errorStateContent"
  //         variant="caption"
  //         display="block"
  //         gutterBottom
  //       >
  //         {errorMsg}
  //       </Typography>
  //     );
  //   } else {
  //     return;
  //   }
  // };

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

  return (
    <>
      <span style={{ display: "flex" }}>
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <span>
          <TextField
            onBlur={onBlur}
            value={value}
            defaultValue={defaultValue}
            name={name}
            disabled={disabled}
            error={error}
            onChange={onChange}
            className={
              "CBX-input " + disableds + " " + errors + " " + className
            }
            id={id}
            type={type}
            placeholder={placeholder}
            {...others}
          />
          {error && (
            <Typography
              className="errorStateContent"
              variant="caption"
              display="block"
              gutterBottom
            >
              {errorMsg}
            </Typography>
          )}
        </span>
      </span>
    </>
  );
};

export default CRXInput;

//CRX-input Default class name
//disableds class when input box set disableds
//errors class on error
//className you can add your custom class name
