import React from "react";
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
}

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "none",
    },
  },
  icon: {
    fontSize: "18px",
    color: "#D1D2D4",
    "input:hover ~ &": {
      color:"#333333"
    },
    "input:selected ~ &": {
      color: "#F5F5F5",
    },
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
  inputProps = "uncontrolled-checkbox",
}) => {
  const classes = useStyles();
  const checkBoxSelected = lightMode ? "crxSelectedLight" : "crxSelectedDark";
  const checkBoxIconClass = selectedRow
    ? "fal fa-check-square crxCheckForDarBg"
    : "fas fa-check-square";
  const disable = disabled && "disabled";
  const error = isError && "error";
  return (
    <>
      <Checkbox
        className={classes.root + " CRXCheckBox " + className + disable}
        checked={checked}
        disableRipple
        onChange={onChange}
        name={name}
        disabled={disabled}
        checkedIcon={
          <span
            className={checkBoxIconClass + " " + checkBoxSelected + " " + disabled}
          />
        }
        icon={<span className={classes.icon + " fal fa-square" + " " + error} />}
        inputProps={{ "aria-label": inputProps }}
      />
    </>
  );
};

export default CRXCheckBox;
