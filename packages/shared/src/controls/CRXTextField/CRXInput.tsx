import React, { useEffect, useRef, useState } from "react";
import { Typography, TextField } from "@material-ui/core";
import CRXTooltip from "../CRXTooltip/CRXTooltip"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
  regex ?: RegExp;
  error? : boolean,
  parentId? : string,
  eyeIcon? : boolean,
  showHideText? : boolean,
  showPassword? : () => void
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
  parentId,
  type,
  error,
  label,
  regex,
  eyeIcon,
  showHideText,
  showPassword,
  ...others
}: InputProps) => {
  const [_, setError] = React.useState<boolean>(false);
  const [_errorMsg, setErrorMsg] = React.useState<string>('');
  const [isTypeInputNumber, setIsTypeInputNumber] = useState<string>("")
  const [isEyeIconClass, setIsEyeIconClass] = useState<string>("")
  const [isActive, setIsActive] = useState<string>(" ");
  const disableds = disabled ? "disabled" : " "; //Class will be apply on disaled
  const errors = error ? "errors" : " "; //Class will be apply on Error
  const inputRefs = useRef()
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

  const Increment = (_ : any, id : string) => {
    
    const incrementOne:any = document.querySelector('.CBX-input input[type=number]')
    const increment_ID: string = id;
    const idx = "increment_" + name;

    if(type === "number" && incrementOne != null && increment_ID === idx) {
        incrementOne.stepUp()
    }
    setIsActive("inputNumberIsActive");
  }

  const Decrement = (_ : any, id : string) => {
    const decrement_ID: string = id;
    const id_Dcreced : string = "decrement_" + name;
    const DecrementOne:any = document.querySelector('.CBX-input input[type=number]')
    if(type === "number" && DecrementOne != null && decrement_ID === id_Dcreced) {
        DecrementOne.stepDown()
    }
    setIsActive("inputNumberIsActive");
  }

  const removeActiveClass = (e : any) => {
    const current: any | undefined = inputRefs.current;
    if(e.target.className == 'fas fa-sort-down' || e.target.className == 'fas fa-sort-up'){
      if(current !== undefined && current.target) {
        setIsActive("inputNumberIsActive");
      }
           
    }else {
      setIsActive("");
    }
    
  }
  return (
    <>
      <span id={parentId} className="gridFilterTextBox">
        <Typography variant="subtitle1" className="label">
          {reformatedLabel()}
        </Typography>
        <span className={`gridFilterSpanUi  ${isTypeInputNumber}  ${isEyeIconClass}`}>
          <ClickAwayListener onClickAway={(e : any) => removeActiveClass(e)}>
          <TextField
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              checkError(e.target.value);
            }}
            inputRef={inputRefs}
            value={value}
            defaultValue={defaultValue}
            name={name}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e);
              checkError(e.target.value);
            }}
            className={
              "CBX-input " + disableds + " " + errors + " " + className + " " + isActive
            }
            id={id}
            type={type}
            placeholder={placeholder}
            {...others}
          />
         </ClickAwayListener>
          {
            eyeIcon && <CRXTooltip
                          placement="right-start"
                          title={showHideText ? "hide" : "show"}
                          className="eyeIconOptional"
                          content={<div>
                          <i className={ showHideText ? "fas fa-eye-slash" : " fas fa-eye"  }
                        onClick={showPassword}></i> 
                        </div>}
                        arrow={false}
                        />
          }
          {type === "number" && 
            <div className="_number_field_btn">
              <button id={"increment_" + name} className="_number_increment" onClick={(e : any) => Increment(e, "increment_" + name)}>
                <i className="fas fa-sort-up"></i>
              </button>
              <button id={"decrement_" + name} className="_number_decrement" onClick={(e : any) => Decrement(e, "decrement_" + name)}>
                <i className="fas fa-sort-down"></i>
              </button>
            </div>
          }
           
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
