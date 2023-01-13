import React, { useEffect, useState }  from 'react'
import Popper, {PopperPlacementType }  from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import "./popOver.scss";


type typoProps = {
    children : React.ReactNode,
    open : boolean 
    anchorEl: HTMLElement
    id? : string,
    placement? :PopperPlacementType | undefined,
    className? : string,
    onSetAnchorE1: (v: HTMLElement | null) => void;
    arrowRef? : any,
    title : string,
    arrowDown : boolean,
    disablePortal: boolean
}


const cbxPopoverStyle = makeStyles(() => ({
  paper: {
    overflowX: "unset",
    overflowY: "unset",
    backgroundColor: "#F2F2F2",
    border: "1px solid #707070",
    width: "505px",
    padding : "20px 0px 13px 22px",
    boxShadow : "0px 0px 5px #00000033",
          '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            marginTop: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
              borderWidth: '0 2em 2em 2em',
              borderColor: `transparent transparent #F2F2F2 transparent`,
            },
          },
          '&[x-placement*="top"] $arrow': {
            bottom: 0,
            left: 0,
            marginBottom: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
              borderWidth: '1.5em 1.5em 0 1.5em',
              borderColor: `#F2F2F2 transparent transparent transparent`,
            },
          },
          '&[x-placement*="right"] $arrow': {
            left: 0,
            marginLeft: '-1.5em',
            height: '3em',
            width: '1em',
            '&::before': {
              borderWidth: '1.5em 1.5em 1.5em 0',
              borderColor: `transparent #707070 transparent transparent`,
            },
            '&::after': {
              borderWidth: '1.5em 1.5em 1.5em 0',
              borderColor: `transparent #F2F2F2 transparent transparent`,
              marginTop: "-3em",
              marginLeft :"0.2em"
            },
          },
          '&[x-placement*="left"] $arrow': {
            right: 0,
            marginRight: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
              borderWidth: '1.5em 0 1.5em 1.5em',
              borderColor: `transparent transparent transparent #F2F2F2`,
            },
          },
    },
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
          '&::before': {
              content: '""',
              margin: 'auto',
              display: 'block',
              width: 0,
              height: 0,
              borderStyle: 'solid',
          },
          '&::after': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
        },
      }
  })
)


const CRXPopOver: React.FC<typoProps> = ({children,title, arrowDown, open, anchorEl,disablePortal=false ,placement="top-start",id, className, onSetAnchorE1}) => {
  const classes = cbxPopoverStyle();
  const [initScroll, setInitScroll] = useState<any>()
  const [arrowRef, setArrowRef] = useState<any>();
    const handlePopoverClose = () => {
      onSetAnchorE1(null);
    };

   
  
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (initScroll < currentScrollY) {
          handlePopoverClose()
      }
      setInitScroll(currentScrollY)
    };

      useEffect(() => {
        let windScroll = window.scrollY
        setInitScroll(windScroll)
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    },[initScroll])

    return (
      <>
      
        <Popper
          className={ classes.paper + ' CBX_PopOver ' + className }
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          disablePortal={disablePortal}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
            arrow: {
              enabled: arrowDown,
              element: arrowRef,
            },
            
          }}
          transition={false}
        >
          <div className='_popover_content'>
          <div className='_popover_title'>
            <div className='title_text'>{title}</div>
            <button onClick={() => handlePopoverClose()} className="_cbx_PopupCloseIcon">
              <span className='icon icon-cross2'></span>
            </button>
          </div>
          { children }

          
          </div>
         {arrowDown ? <span className={classes.arrow} ref={setArrowRef} /> : null}
        </Popper>
        
        </>
    )
}

export default CRXPopOver;