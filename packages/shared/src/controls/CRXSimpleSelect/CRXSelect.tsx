import React, { forwardRef } from "react";
import { InputBase, Select, MenuItem } from "@material-ui/core";
import { withStyles} from "@material-ui/core/styles";
import "./SelectBox.scss";

//Select box props Types
type SelectBoxProps = {
  value: any;
  defaultValue: any;
  id: string;
  className?: string;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  onClick?: (e: React.MouseEventHandler<HTMLAnchorElement>) => void;
  IconName?: React.ReactElement<any>;
  icon?: boolean;
  options: Object[];
  popover?: string;
  defaultOption: boolean;
  defaultOptionText: string;
  ref?: any;
  IconComponent?: any;
  disabled:boolean
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

const CRXSelectBox: React.FC<SelectBoxProps> = forwardRef(
  (
    {
      onChange,
      value,
      id,
      className,
      popover,
      options,
      defaultOption = true,
      defaultOptionText = "Please Select",
      disabled=false,},
    ref
  ) => {
    const option = Object.assign(options).map((data: any, i: number) => {
      return (
        <StyledMenuItem aria-label="None" key={i} value={data.value}>
          {data.displayText ? data.displayText : data.value}
        </StyledMenuItem>
      );
    });

    return (
      <Select
        ref={ref}
        id="fagg"
        native={false}
        IconComponent={props => (
          <i {...props} className={`crxArrowDownSelect fas fa-caret-down ${props.className}`}>
            
          </i>)}
        className={"CRXSimpleSelect " + className}
        value={value}
        displayEmpty={true}
        defaultValue={defaultOptionText}
        onChange={onChange}
        input={<InputBase id={id} />}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          classes: {
            paper: popover + " paperStyle"
          },
          getContentAnchorEl: null,
        }}
        disabled={disabled}
      >
        {defaultOption && (
          <StyledMenuItem
            style={{ minWidth: "auto", left: "0px" }}
            value={defaultOptionText}
            disabled
          >
            {defaultOptionText}
          </StyledMenuItem>
        )}
        {option}
      </Select>
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
