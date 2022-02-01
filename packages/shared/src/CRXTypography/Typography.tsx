import React from "react";
import Typography from "@material-ui/core/Typography";
import "./Typography.scss";

type varients =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "button"
  | "overline"
  | "srOnly"
  | "inherit";

type typoProps = {
  children: React.ReactNode;
  variant: varients; // h1, h2, h3, h4, h5, h6, p,
  id?: string;
  className?: string;
  align?: any;
  noWrap?: boolean;
  onMouseEnter?: (e: any) => void;
  onMouseLeave?: (e: any) => void;
  lightMode?: boolean;
};

const CRXTypography = ({
  children,
  variant,
  align,
  id,
  className,
  onMouseEnter,
  onMouseLeave,
  noWrap = false,
  lightMode = false,
}: typoProps) => {

const checkStyle = lightMode ? "crxTypoThemeB" : "";

  return (
    <Typography
      id={id}
      align={align}
      className={className + " " + checkStyle}
      noWrap={noWrap}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      variant={variant}
    >
      {children}
    </Typography>
  );
};

export default CRXTypography;
