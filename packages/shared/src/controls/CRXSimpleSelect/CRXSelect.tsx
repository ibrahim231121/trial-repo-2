import React, { forwardRef, useState, useEffect } from "react";
import { InputBase, Select, MenuItem } from "@material-ui/core";
import { withStyles, makeStyles} from "@material-ui/core/styles";
import "./SelectBox.scss";

//Select box props Types
type SelectBoxProps = {
  value: any;
  defaultValue: any;
  id: string;
  className?: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  onClick?: (e: React.MouseEventHandler<HTMLAnchorElement>) => void;
  onClose?: any;
  IconName?: React.ReactElement<any>;
  icon?: boolean;
  options: Object[];
  defaultOption: boolean;
  defaultOptionText: string;
  ref?: any;
  IconComponent?: any;
  disabled:boolean,
  isRequried? : boolean,
  errorMsg? : string,
  error? : boolean,
  zIndex? : any,
  disablePortal?:boolean

};

//Style For Select Menu Paper
// const useStyle = makeStyles(() => ({
//   menuT: {
//     borderRadius: "0px",
//     border: "1px solid #bebebe",
//     minWidth: "200px !important",
//     marginLeft: "0px",
//   },
// }));

//Style For Select Option Item
const StyledMenuItem = withStyles(() => ({
  root: {
    fontSize: "14px",
    color: "#333333",
    height: "30px",
    borderRadius: "0px",
    textTransform : "capitalize",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      color: "#333333",
    },
    "&:focus": {
      backgroundColor: "#6e6e6e",
      color: "#f5f5f5",
      "&:hover": {
        backgroundColor: "#f5f5f5",
        color: "#333333",
      },
    },
  },
  iconStyle: {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'inline-block',
    color: '#c0c0c0',
    width: '24px',
    height: '24px',
    pointerEvents: 'none'
}
}))(MenuItem);

const CreateStyleProps = makeStyles(({
  popover : {
    position : "absolute"
  },
  rounded : {
    borderRadius : "0px",
    background : "#fff",
    boxShadow : "rgb(0 0 0 / 15%) 0px 0px 11px -2px",
    marginTop : "10px",
    maxHeight : "300px",
    border: "1px solid #d1d2d4",
    maxWidth: "100%"
  }
}))
const CRXSelectBox: React.FC<SelectBoxProps> = forwardRef(
  (
    {
      onChange,
      value,
      id,
      className,
      options,
      defaultOption = false,
      defaultOptionText,
      isRequried,
      errorMsg,
      onClose,
      error,
      zIndex = 13001,
      disablePortal,
      disabled=false,},
    ref
  ) => {
    const [errMsg, setErrorMsg] = useState<string | undefined>();
    const MenuPropsStyle = CreateStyleProps()
    const errorMessage = (!error && <div className='crxDropdownValidationError'><i className="fas fa-exclamation-circle"></i>  <span className="crxErrorMsg"> {errMsg}</span> </div>)

    const option = Object.assign(options).map((data: any, i: number) => {
      return (
        <StyledMenuItem aria-label="None" key={i} value={data.value}>
          {data.displayText ? data.displayText : data.value}
        </StyledMenuItem>
      );
    });

    useEffect(() => {
      setErrorMsg(errorMsg)
    },[errorMsg])

    return (
      
      <>
      <Select
        ref={ref}
        id={id}
        native={false}
        IconComponent={props => (
          <i {...props} className={`crxArrowDownSelect fas fa-caret-down ${props.className}`}>
            
          </i>)}
        className={"CRXSimpleSelect " + className}
        value={value}
        onClose={onClose}
        displayEmpty={true}
        defaultValue={defaultOptionText}
        onChange={onChange}
        input={<InputBase id={"input" + id} />}
        MenuProps={{
          style: {zIndex : zIndex, position : "absolute"},
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          classes: {
            paper: MenuPropsStyle.rounded
          },
          getContentAnchorEl: null,
          disablePortal: disablePortal,
        }}
       
        disabled={disabled}
      >
        {defaultOption && (
          <StyledMenuItem
            style={{ minWidth: "auto", left: "0px" }}
            value={defaultOptionText}
            disabled
            className="default_disabled"
          >
            <div className="default_disabled">{defaultOptionText}</div>
          </StyledMenuItem>
        )}
        {option}
      </Select>
      {isRequried && <div>{errorMessage}</div>}
      </>
    );
  }
);

export default CRXSelectBox;

//Selec Box usges:
//Select Box Use : <CRXSelectBox options={option} id="simpleSelectBox" onChange={inPutChange}  value={age} icon={true} IconName="far fa-calendar-alt" />
//ClassName for custom class
//Children add someting like this <option value="number or string"> text here : any </option>
//onChange function
//Icon Option is optional true : false,
//IconName is string type you can add you icon className by https://fontawesome.com/ and matrial Icon
