import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@material-ui/core";
import "./numberField.scss"


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
  regex ?: RegExp;
  error? : boolean,
  parentId? : string,
  eyeIcon? : boolean,
  showHideText? : boolean,
  showPassword? : () => void,
  max? : number,
  min? : number
}

const CRXNumberField = ({
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
  parentId,
  type,
  error,
  label,
  regex,
  eyeIcon,
  showHideText,
  showPassword,
  max,
  min,
  ...others
}: InputProps) => {
  const [_, setError] = React.useState<boolean>(false);
  const [_errorMsg, setErrorMsg] = React.useState<string>('');
  const [isTypeInputNumber, setIsTypeInputNumber] = useState<string>("")
  const [isEyeIconClass, setIsEyeIconClass] = useState<string>("")
  const disableds = disabled ? "disabled" : " "; //Class will be apply on disaled
  const errors = error ? "errors" : " "; //Class will be apply on Error
  const inputRefs = useRef(null)
  const errorMsgIcon = (
    <i className="fas fa-exclamation-circle">
      <span className="crxErrorMsg"> {errorMsg}</span>
    </i>
  );

  useEffect(() => {
     if(type === "number") {
        setIsTypeInputNumber("input_number_field");
      }

      eyeIcon == true ? setIsEyeIconClass("isEyeIconClass") : setIsEyeIconClass("Crx_defaultText")

  },[])
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
    return regex?.test(String(value).toLowerCase());
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


  // const removeActiveClass = (e : any) => {
  //   const current: any | undefined = inputRefs.current;
  //   if(e.target.className == 'fas fa-sort-down' || e.target.className == 'fas fa-sort-up'){
  //     if(current !== undefined && current.target) {
  //       setIsActive("inputNumberIsActive");
  //     }
           
  //   }else {
  //     setIsActive("");
  //   }
    
  // }

  const removeSigns = () => {
    var input: any = inputRefs.current;
    input.value = parseInt(input.value.toString().replace('+', '').replace('-', ''))
  }

  return (
    <>
      <span id={parentId} className="number_field_textBox">
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <span className={`number_field_child  ${isTypeInputNumber}  ${isEyeIconClass}`}>
          
         
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            ref={inputRefs}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              checkError(e.target.value);
            }}
            max={max}
            min={min}
            value={value}
            defaultValue={defaultValue}
            name={name}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e);
              checkError(e.target.value);
            }}
            className={
              "CBX-Number-input " + disableds + " " + errors + " " + className + " "
            }
            onKeyUp={removeSigns}
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

export default CRXNumberField;

