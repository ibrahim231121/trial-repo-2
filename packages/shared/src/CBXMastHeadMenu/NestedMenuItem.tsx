import * as React from "react";
import ArrowRight from "@mui/icons-material/ArrowRight";
import {Menu, MenuItem } from '@material-ui/core';

interface Props  {
  parentMenuOpen : boolean;
  label : string;
  rightIcon : HTMLCollection | JSX.Element;
  keepOpen : boolean;
  className? : string;
  tabIndex : any;
  ContainerProps : any;
  children : any;
  rightAnchored : any;
  customTheme : any
}

export type Ref = HTMLButtonElement;

const NestedMenuItem = React.forwardRef<Ref , Props>((props, ref) => {
  const {
    parentMenuOpen,
    label,
    rightIcon = <ArrowRight style={{ fontSize: 16 }} />,
    keepOpen,
    children,
    customTheme,
    className,
    tabIndex: tabIndexProp,
    ContainerProps: ContainerPropsProp = {},
    rightAnchored,
    ...MenuItemProps
  } = props;

  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

  const menuItemRef : any = React.useRef(null);
  React.useImperativeHandle(ref, () => menuItemRef.current);

  const containerRef : any = React.useRef(null);
  React.useImperativeHandle(containerRefProp, () => containerRef.current);

  const menuContainerRef : any = React.useRef(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(false);

  const handleMouseEnter = (event : any) => {
    setIsSubMenuOpen(true);

    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(event);
    }
  };

  const handleMouseLeave = (event : any) => {
    setIsSubMenuOpen(false);

    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(event);
    }
  };

  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement;

    for (const child of menuContainerRef.current?.children ?? []) {
      if (child === active) {
        return true;
      }
    }
    return false;
  };

  const handleFocus = (event : any) => {
    if (event.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }

    if (ContainerProps?.onFocus) {
      ContainerProps.onFocus(event);
    }
  };

  const handleKeyDown = (event : any) => {
    if (event.key === "Escape") {
      return;
    }

    if (isSubmenuFocused()) {
      event.stopPropagation();
    }

    const active : any = containerRef.current?.ownerDocument?.activeElement;

    if (event.key === "ArrowLeft" && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      event.target === containerRef.current &&
      event.target === active
    ) {
      const firstChild = menuContainerRef.current?.children[0];
      firstChild?.focus();
    }
  };

  const open = isSubMenuOpen && parentMenuOpen;

  let tabIndex;
  // if (!props?.disabled) {
  //   tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  // }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <MenuItem
        {...MenuItemProps}
        data-open={!!open || undefined}
        className={className}
        ref={menuItemRef}
       
      >
        {label}
        <div style={{ flexGrow: 1 }} />
        {rightIcon}
      </MenuItem>
      <Menu
        hideBackdrop
        style={{ pointerEvents: "none" }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: rightAnchored ? "left" : "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: rightAnchored ? "right" : "left"
        }}
        
        open={!!open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false);
        }}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: "auto" }}>
          {children}
        </div>
      </Menu>
    </div>
  );
});

export default NestedMenuItem;
