import React, { useEffect } from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./CheckBox.scss";

interface Props {
  name?: string;
  label?: string;
  checked?: boolean;
  inputProps?: string;
  disabled?: boolean;
  isError?: boolean;
  lightMode?: boolean;
  onChange: (e: any) => void;
  className?: string;
  selectedRow?: boolean;
  inputRef? : any
}

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "none",
    },
  },
  icon: {
    fontSize: "18px",
    color: "#d1d2d4",
    backgroundColor: "#fff",
    "input:hover ~ &": {
      color:"#333333"
    },
    // "input:selected ~ &": {
    //   color: "#F5F5F5",
    // },
    "input:disabled ~ &": {
      color: "#979797",
    },
  },
});
const CRXCheckBox: React.FC<Props> = ({
  className,
  selectedRow = false,
  isError = false,
  disabled = false,
  checked,
  lightMode = false,
  onChange,
  name,
  inputRef,
  inputProps = "uncontrolled-checkbox",
}) => {
  const classes = useStyles();
  const checkBoxSelected = lightMode ? "crxSelectedLight" : "crxSelectedDark";
  const [checkBoxIconClass, setCheckBoxIconClass] = React.useState<any>();
  const disable = disabled && "disabled";
  const error = isError && "error";
  const checkStyle = lightMode ? "checkBoxLightTheme" : "checkBoxDarkTheme";
  useEffect(() => {
    if(selectedRow == true && checkBoxSelected == "crxSelectedDark" && checked == true) {
      setCheckBoxIconClass("fas fa-check-square crxCheckForDarBg");
    } else if(selectedRow == true && checkBoxSelected == "crxSelectedLight" && checked == true) {
        setCheckBoxIconClass("fas fa-check-square");
    }else {
      setCheckBoxIconClass("fas fa-check-square")
    }
  },[checked]);
  return (
    <>
      <Checkbox
        inputRef={inputRef}
        className={classes.root + " CRXCheckBox " + className + " " + disable + " " + checkStyle}
        checked={checked}
        disableRipple
        onChange={onChange}
        name={name}
        disabled={disabled}
        checkedIcon={
          <span
            className={checkBoxIconClass + " " + `${checkBoxSelected}` + " " + disabled}
          />
        }
        icon={<span className={classes.icon + " fal fa-square" + " " + error} />}
        inputProps={{ "aria-label": inputProps }}
      />
    </>
  );
};

export default CRXCheckBox;
