import * as React from "react";
import Button from "@material-ui/core/Button";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./CRXButton.scss";

interface buttonProps {
  id: string;
  children?: React.ReactNode;
  onClick?: (e: any, value?: any) => void;
  color?: "default" | "primary" | "secondary";
  variant?: "contained" | "outlined" | "text";
  className?: string;
  disabled?: boolean;
  primary?:boolean
}
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

const CRXButton = ({
  id,
  children,
  color,
  variant,
  className,
  disabled,
  onClick,
  primary,
  ...props
}: buttonProps) => {
  const disabledClass = className==="tertiary" && disabled && "tertiaryDisabled"
  return (
    <ThemeProvider theme={theme}>
      <Button
        style={{background:'transparent'}}
        id={id}
        color={color || "primary"}
        variant={variant || "outlined"}
        className={`CRXButton ${className} ` + disabledClass}
        onClick={onClick}
        disabled={disabled}
        disableRipple={true}
        {...props}
      >
        {children}
      </Button>
    </ThemeProvider>
  );
};

export default CRXButton;
