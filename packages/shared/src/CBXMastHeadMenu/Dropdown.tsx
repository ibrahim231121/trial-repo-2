import * as React from "react";
import styled from 'styled-components';
import { MenuItem } from '@material-ui/core';
import NestedMenuItem from "./NestedMenuItem";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

interface Props {
    trigger? : any,
    menu : any,
    keepOpen?: any,
    isOpen?: any,
    onOpen?: any,
}

export type Ref = HTMLButtonElement 

export const Dropdown = React.forwardRef<Ref, Props>((props, ref) => {
    const {
        trigger,
        menu,
        keepOpen: keepOpenGlobal,
        isOpen: controlledIsOpen,
        onOpen: onControlledOpen
    } = props

    const [isInternalOpen, setInternalOpen] = React.useState(null);
    const isOpen = controlledIsOpen || isInternalOpen;

    let anchorRef : any = React.useRef(null);
    if (ref) {
      anchorRef = ref;
    }

    const handleOpen = (event : any) => {
      event.stopPropagation();

      if (menu.length) {
        onControlledOpen
          ? onControlledOpen(event.currentTarget)
          : setInternalOpen(event.currentTarget);
      }
    };

    const handleClose = (event : any) => {
      event.stopPropagation();

      if (anchorRef?.current && anchorRef?.current?.contains(event.target)) {
        return;
      }

      handleForceClose();
    };

    const handleForceClose = () => {
      onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    };

    const renderMenu:any = (menuItem : any, index : number) => {
      const { keepOpen: keepOpenLocal, ...props } = menuItem.props;

      let extraProps = {};
      if (props.menu) {
        extraProps = {
          parentMenuOpen: isOpen
        };
      }

      return React.createElement(menuItem.type, {
        ...props,
        key: index,
        ...extraProps,
        onClick: (event : any) => {
          event.stopPropagation();

          if (!keepOpenGlobal && !keepOpenLocal) {
            handleClose(event);
          }

          if (menuItem.props.onClick) {
            menuItem.props.onClick(event);
          }
        },
        children: props.menu
          ? React.Children.map(props.menu, renderMenu)
          : props.children
      });
    };

    return (
      <>
     
        {React.cloneElement(trigger, {
          onClick: isOpen ? handleForceClose : handleOpen,
          ref: anchorRef
        })}
        <ClickAwayListener onClickAway={(e : any) => handleClose(e)}>
            <Popper 
                className="subMenuItems" 
                open={!!isOpen} 
                anchorEl={anchorRef.current} 
                role={undefined} 
                transition 
                disablePortal={false}
                placement="right-end"
            >
            {
                <SubMenuContent>
                        {React.Children.map(menu, renderMenu)}
                </SubMenuContent>
            }
            </Popper>
        </ClickAwayListener>
      </>
    );
  }
);

export const DropdownMenuItem = styled(MenuItem)`
    text-align: center;
    margin: 0px;
    padding: 0px;
    white-space: break-spaces;
    display: block;
    width : 100%;
    border-left: 4px var(--color-transparent) solid;
    &:hover {
        background: var(--color-404041);
        border-left: 4px var(--color-d1d2d4) solid;
    }
    &:focus {
        background: var(--color-404041);
        border-left: 4px var(--color-d1d2d4) solid;
    }
`;

export const DropdownNestedMenuItem : any = styled(NestedMenuItem)`
  display: flex;
  justify-content: space-between !important;

  & > svg {
    margin-left: 32px;
  }
`;

const SubMenuContent : any = styled(Paper)`
    border-radius: 0px;
    box-shadow: var(--Box-shadow);
    background: var(--color-404041);
    &:li{
        border:0px;
        text-align : left;
        color : var(--color-d1d2d4)
    }
`