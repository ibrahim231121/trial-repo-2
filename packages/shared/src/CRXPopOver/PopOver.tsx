import React from 'react'
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import "./popOver.scss";


type typoProps = {
    children : React.ReactNode,
    open : boolean 
    anchorEl: HTMLElement
    id? : string,
    placement : string,
    className? : string,
    onSetAnchorE1: (v: HTMLElement | null) => void;
}


const useStyles = makeStyles(() => ({
  paper: {
    overflowX: "unset",
    overflowY: "unset",
    backgroundColor: "#333333",
    boxShadow : "none",
    "&::before": {
      },
    },
  })
)


const CRXPopOver: React.FC<typoProps> = ({children, open, anchorEl, id, className, onSetAnchorE1}) => {

  const classes = useStyles();

    const handlePopoverClose = () => {
      onSetAnchorE1(null);
    };

    return (
        <Popover
          classes={{ paper: classes.paper + ' CRXPopOverArrow' }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          className={className}
        >
          { children }
        </Popover>
    )
}

export default CRXPopOver;