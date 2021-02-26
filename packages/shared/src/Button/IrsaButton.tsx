import React from "react";
import Button from "@material-ui/core/Button";

interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
}
const IrsaButton = ({ children, onClick }: Props) => {
  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
        style={{ margin: "2%" }}
      >
        {children}
      </Button>
    </div>
  );
};

export default IrsaButton;
