import * as React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const SplitButton = ({buttonArray, RevertToOriginal, UndoRedo, saveOffsets}: any) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [options, setOptions] = React.useState<any[]>(buttonArray);

  const handleClick = () => {
    if(selectedIndex == 0){saveOffsets()}
    else if(selectedIndex == 1){UndoRedo(-1)}
    else if(selectedIndex == 2){UndoRedo(1)}
    else if(selectedIndex == 3){UndoRedo(0)}
    else if(selectedIndex == 4){RevertToOriginal()}
  }

  const handleMenuItemClick = (event: any, index: any) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current) {
    setOpen(false);
      
    }

    setOpen(false);
  };

  return (
    <React.Fragment  >
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button  onClick={handleClick}>{options[selectedIndex].label}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : 'false'}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          className={open ? "splitOptionsEnabled" : "splitOptionsDisabled"}
        >
          <i className="fa-solid fa-caret-down"></i>

        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className="split-button-menu-main"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose} >
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.label}
                      disabled={option.disabled}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <span className='split_label_text'>{option.label}</span>
                      <span className='split_label_shortKey'>{option.shortKey}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

export default SplitButton