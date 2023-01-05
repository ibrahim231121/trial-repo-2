import React from "react";
import { Badge } from "@material-ui/core";
import "./CRXBadge.scss";

type varients = "dot" | "standard";
type color = "default" | "error" | "primary" | "secondary";

type badgeProps = {
  className?: string;
  itemCount: number;
  variant: varients;
  color? : color 
};

const CRXBadge: React.FC<badgeProps> = ({
  className,
  itemCount,
  children,
  variant,
  color = "default"
}) => {
  const [invisible, setInvisible] = React.useState(true);
  // const colorClass = color && "default"
  React.useEffect(() => {
    const checkVisiblity = itemCount > 0 ? false : true;
    setInvisible(checkVisiblity);
  }, [itemCount]);

  const badgeBar = invisible ? "badgeBarEnable" : "badgeBarDisabled" ;
  return (
    <>
      <Badge
        badgeContent={itemCount}
        invisible={invisible}
        color={color}
        variant={variant}
        className={`CRXBadge CRXBadgeComponent-${color}  ${className} ${badgeBar}`}
      >
        {children}
      </Badge>
    </>
  );
};

export default CRXBadge;
