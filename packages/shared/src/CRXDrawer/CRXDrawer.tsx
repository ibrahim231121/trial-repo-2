import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import "./CRXDrawer.scss";

type Anchor = "top" | "left" | "bottom" | "right";
type Variant = "permanent" | "persistent" | "temporary";

type CBXDrawerProps = {
  children: React.ReactNode;
  anchor: Anchor;
  variant?: Variant;
  button?: React.ReactNode;
  className?: string;
  backdropProps: string;
  btnStyle?: string;
  isOpen: boolean;
  toggleState: () => void;
};

const CRXDrawer = ({
  children,
  backdropProps = "0",
  anchor,
  btnStyle,
  variant,
  button,
  className,
  isOpen,
  toggleState,
}: CBXDrawerProps) => {
  return (
    <>
      <Button
        className={"drawerButton " + btnStyle}
        onClick={() => toggleState()}
      >
        {button}
      </Button>
      <Drawer
        className={"CBXdrawerPanel " + className}
        anchor={anchor}
        open={isOpen}
        onClose={() => toggleState()}
        variant={variant}
        BackdropProps={{ style: { opacity: backdropProps } }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default CRXDrawer;
