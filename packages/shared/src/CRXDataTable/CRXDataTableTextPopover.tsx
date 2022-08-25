import React,{ useRef } from 'react'
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface popoverProps  {
    content : any,
    id : any,
    isPopover : boolean | undefined,
    minWidth? : any, 
    title : string,
    counts?: any,
    maxWidth? : any,
}

const useGapStyles = makeStyles({
    root : {
        position : "relative!important" as any,
    },
    paper: {
        marginBottom: "2rem",
        overflowY: "auto",
        position: "absolute",
        top: "-191px!important" as any,
        minHeight: "118px",
        left: "-12px!important" as any,
        '@media screen and (min-width:1024px)': {
            left: "-63px!important" as any,
        }
    }
});

  export default function CRXDataTableTextPopover ({content, id, isPopover, counts, minWidth, maxWidth}:popoverProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const popoverRefs = useRef(content)
    const paperRef = useRef<HTMLInputElement>(null)
    const classesPopover = useGapStyles()

    const popoverHandleClose = () => {
        setAnchorEl(null);
        const tableRow:HTMLElement | null = popoverRefs.current.parentElement.parentElement.parentElement;
        tableRow && ( tableRow.style.background = "" );
        tableRow?.childNodes.forEach(x => {
            (x as HTMLElement).style.color = ""
        });
    }

    const popoverHandleClick = (e : any) => {
        
        setAnchorEl(e.currentTarget)
        
        const tableRow:HTMLElement | null = popoverRefs.current.parentElement.parentElement.parentElement;
        tableRow && (tableRow.style.background = "#333");
        tableRow?.childNodes.forEach(x => {
            (x as HTMLElement).style.color = "#d1d2d4"
        });
        
    }

    const open = Boolean(anchorEl);
    const contentlength = counts.toString().length;
    const calcMinWidth:any = minWidth - 30;
    const calcMaxWidth:any = maxWidth - 65;
    return (
        <div className='assetIdx'>
            {isPopover && (isPopover == true && contentlength > 28) ? 
        <div 
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
        onMouseLeave={(e : any) => popoverHandleClick(e)}
        
        >
            {content}
        </div>
        : content }
        <ClickAwayListener onClickAway={popoverHandleClose}>
        <Popover
            id={id}
            ref={paperRef}
            open={open}
            anchorEl={anchorEl}
            onClose={popoverHandleClose}
            marginThreshold={16}
            disablePortal
            hideBackdrop={true}
            classes={{
                ...classesPopover
            }}
            container={document.body}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: 'center',
              }}
            className="crx_popover_customized"
            
        >
            <div className='popover_content'>{content}</div>
            
        </Popover>
        </ClickAwayListener>
        </div>
    )
}

