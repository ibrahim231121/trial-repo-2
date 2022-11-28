import React, { useEffect, useState }  from 'react'
import Popper  from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
// import "./PopOver.scss";


type typoProps = {
    children : React.ReactNode,
    open : boolean 
    anchorEl: HTMLElement
    id? : string,
    placement : string,
    className? : string,
    onSetAnchorE1: (v: HTMLElement | null) => void;
    arrowRef? : any,
    title : string,
    arrowDown : boolean
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
    '&[data-popper-placement*="top"] .arrowPopper': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `#fff transparent transparent transparent`,
        },
      },

    },
  })
)


const CRXPopOver: React.FC<typoProps> = ({children,title, arrowDown, open, anchorEl, id, className, onSetAnchorE1}) => {
  const classes = cbxPopoverStyle();
  const [initScroll, setInitScroll] = useState<any>()
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

    const arrow = document.querySelector('#arrow');
    return (
      <>
      
        <Popper
          className={ classes.paper + ' CBX_PopOver ' + className }
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="top-start"
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
            arrow: {
              enabled: false,
              element: arrow,
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
         {arrowDown && <div id="arrow" className='arrowPopper' data-popper-arrow></div> } 
        </Popper>
        
        </>
    )
}

export default CRXPopOver;