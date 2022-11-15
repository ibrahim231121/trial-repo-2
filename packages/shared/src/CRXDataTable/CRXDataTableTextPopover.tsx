import React,{ useEffect, useRef, useState } from 'react'
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface popoverProps  {
    content : any,
    isPopover : boolean | undefined,
    minWidth? : any, 
    title : string,
    counts?: any,
    maxWidth? : any,
}

const useGapStyles = makeStyles({
    root : {
        position : "relative!important" as any,
        zIndex : -1,
    },
    paper: {
        marginBottom: "2rem",
        overflowY: "auto",
        position: "absolute",
        top: "-165px!important" as any,
        minHeight: "95px",
        zIndex : -1,
        left: "-12px!important" as any,
        '@media screen and (min-width:1024px)': {
            left: "-63px!important" as any,
        }
    }
});

  const  CRXDataTableTextPopover = ({content, isPopover, counts, minWidth, maxWidth}:popoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [initScroll, setInitScroll] = useState<any>()
    const popoverRefs = useRef(content)
    const paperRef = useRef<HTMLInputElement>(null)
    const classesPopover = useGapStyles()

    const popoverHandleClose = () => {
        
        setAnchorEl(null);
        
        // const tableRow:HTMLElement | null = popoverRefs.current.parentElement.parentElement.parentElement;
        // tableRow && ( tableRow.style.background = "" );
        // tableRow?.childNodes.forEach(x => {
        //     (x as HTMLElement).style.color = ""
        // });
    }

    const handleScroll = () => {
        
        const currentScrollY = window.scrollY;
        if (initScroll < currentScrollY) {
            popoverHandleClose()
        }
        setInitScroll(currentScrollY)
      };
    
      useEffect(() => {
        let windScroll = window.scrollY
        setInitScroll(windScroll)
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    },[initScroll])
    
    const popoverHandleClick = (e : any) => {
        
        setAnchorEl(e.currentTarget)
        
        // const tableRow:HTMLElement | null = popoverRefs.current.parentElement;
        // tableRow && (tableRow.style.background = "#333");
        // tableRow?.childNodes.forEach(x => {
        //     (x as HTMLElement).style.color = "#d1d2d4"
        // });
        
    }

    const open = Boolean(anchorEl);
    const contentlength = counts.toString().length;
    const calcMinWidth:any = minWidth - 30;
    const calcMaxWidth:any = maxWidth - 65;
    return (
        <div className='assetIdx'>
            {isPopover && (isPopover == true && contentlength > 28) ? 
        <div 
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        className='popoverChar' 
        ref={popoverRefs}
        style={{
            minWidth :  calcMinWidth + "px", 
            maxWidth : calcMaxWidth + "px",
            width : calcMinWidth + "px",
            textDecoration : `${open === true ? "underline" : "" }`,
            cursor : "pointer"
        }}
        onMouseEnter={(e : any) => popoverHandleClick(e)}
        onMouseLeave={popoverHandleClose}
        
        >
            {content}
        </div>
        : content }
        <ClickAwayListener onClickAway={popoverHandleClose}>
           
        <Popover
            id="mouse-over-popover"
            ref={paperRef}
            open={open}
            anchorEl={anchorEl}
            getContentAnchorEl={(anchorEl : any) => anchorEl}
            onClose={popoverHandleClose}
            marginThreshold={16}
            disablePortal
            hideBackdrop={true}
            classes={{
                ...classesPopover
            }}
            container={popoverRefs.current}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              
              transformOrigin={{
                vertical: "bottom",
                horizontal: 'center',
              }}
            className="crx_popover_customized"
            disableRestoreFocus
        >
            <div className='popover_content'>{content}</div>
        </Popover>
        </ClickAwayListener>
        </div>
    )
}

export default CRXDataTableTextPopover;