import React from "react";
import { Typography, TextField } from "@material-ui/core";
import "./Input.scss";


interface errorMessageType {
  required: string;
  validation: string;
};
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
  required?: boolean;
  errorMsg?: errorMessageType | string;
  placeholder?: string;
  defaultValue?: any;
  regex: RegExp;
}

const CRXInput = ({
  value,
  defaultValue,
  placeholder,
  name,
  onChange,
  className,
  errorMsg,
  disabled,
  required = false,
  id,
  type,
  label,
  regex,
  ...others
}: InputProps) => {
  const [error, setError] = React.useState<boolean>(false);
  const [_errorMsg, setErrorMsg] = React.useState<string>('');
  const disableds = disabled ? "disabled" : " "; //Class will be apply on disaled
  const errors = error ? "errors" : " "; //Class will be apply on Error
  const errorMsgIcon = (
    <i className="fas fa-exclamation-circle">
      <span className="crxErrorMsg"> {errorMsg}</span>
    </i>
  );

  const reformatedLabel = () => {
    if (required) {
      return (
        <label className="requiredLable">
          <span className="inputLabel">{label} </span>
          <span
            className="inputLabelReq"
            style={{ color: `${error ? "#aa1d1d" : "#000"}` }}
          >
            *
          </span>
        </label>
      );
    } else {
      return <span className="inputLabelNoReq">{label} </span>;
    }
  };

  const validateRegex = (value: string) => {
    return regex.test(String(value).toLowerCase());
  };

  const checkError = (val: string) => {
    let requiredValidationComplete = requiredValidator(val);
    if (requiredValidationComplete) {
      regexValidator(val);
      return;
    }
  };

  const requiredValidator = (val: string) => {
    if (required) {
      if (val.length === 0) {
        const errorMessage = errorMsg ? typeof (errorMsg) === 'object' ? errorMsg.required : errorMsg
          : "Required field";
        setErrorMsg(errorMessage);
        setError(true);
        return false;
      }
      setError(false);
      regexValidator(val);
    }
    return true;
  }
  const regexValidator = (val: string) => {
    if (regex) {
      const isFieldValid = validateRegex(val);
      if (!val) {
        setError(false);
        return true;
      }
      if (!isFieldValid) {
        const errorMessage = errorMsg ? typeof (errorMsg) === 'object' ? errorMsg.validation : errorMsg : "Field not validated";
        setErrorMsg(errorMessage);
        setError(true);
        return false;
      }
      setError(false);
      return true;
    }
    return true;
  }

  return (
    <>
      <span>
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <span>
          <TextField
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              checkError(e.target.value);
            }}
            value={value}
            defaultValue={defaultValue}
            name={name}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e);
              checkError(e.target.value);
            }}
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
              {errorMsgIcon}
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
