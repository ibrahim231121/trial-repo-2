import React, { useEffect, useRef, useState } from 'react'
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface popoverProps  {
    content : any,
    id : any,
    isPopover : boolean | undefined,
    minWidth? : any, 
    title? : string,
    maxWidth? : any
    link? : any,
    middle? : boolean
}


const CRXMiddleTruncationPopover = ({content, id, link, middle, isPopover, minWidth, maxWidth} : popoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(false);
    let open = Boolean(anchorEl);
    const middleText = content.toString().length;
    const [truncationButton, setTruncationBtn] = useState();
    const popoverRefs = useRef(content)
    
    const truncationPopoverClose = (_ : any) => {
       
        // if (popoverRefs.current && popoverRefs.current.contains(e.target as HTMLElement)) {
        //     return;
        //   }
          setAnchorEl(false);
    };

    const truncationPopoverOpen = (_ : any) => {
        setAnchorEl((prevOpen) => !prevOpen)
    }

    
    const prevOpen = React.useRef(anchorEl);

    React.useEffect(() => {
        if (prevOpen.current === true && anchorEl === false) {
            
            popoverRefs.current!.focus();
        }

        prevOpen.current = anchorEl;
        
    }, [anchorEl]);

    const truncate = (fullStr:any, strLen:any) => {
        
        const dataLength = fullStr.toString().length;

        if (dataLength <= strLen) return  setTruncationBtn(fullStr);
       
       
        var separator:any = separator || '...';
        var sepLen = separator.length,
            charsToShow = strLen - sepLen,
            frontChars = Math.ceil(charsToShow/2),
            backChars = Math.floor(charsToShow/2);
            
            const middleElip =  fullStr.substr(1, frontChars) + 
            separator + 
            fullStr.substr(dataLength - backChars);
            
        return setTruncationBtn(middleElip)
    };

    useEffect(() => {
        if(middle === true) {
            truncate(content, 25)
        }
       
    },[])
    
    const useGapStyles = makeStyles({
        root : {
            position : "relative!important" as any,
        },
        paper: {
            marginBottom: "2rem",
            overflowY: "auto",
            position: "absolute",
            top: "-73px !important" as any,
            minHeight: "auto",
            maxHeight: "118px",
            left: "-20px!important" as any,
            
        }
    });

    const classespop = useGapStyles()
    return (
        <div className='_truncation_Popover'>
        {isPopover &&  (isPopover == true && middleText > 25 && middle === true) ?   
            <div className='dataMidTruncation _group_truncation_text '>
            <div className='_truncation_text' 
                onMouseEnter={(e : any) => truncationPopoverOpen(e)} 
                onMouseLeave={(e : any) => truncationPopoverClose(e)}
                ref={popoverRefs} 
                style={{
                    minWidth :  minWidth + "px", 
                    maxWidth : maxWidth + "px",
                    textDecoration : `${open === true ?  "underline" : "" }`,
                    color : `${open === true ? "#FF6E20" : "#C34400"}`,
                    cursor : "pointer"
                }}
            >
            {"#" + truncationButton}

            </div>
            </div>
            : <div
            onMouseEnter={(e : any) => truncationPopoverOpen(e)}  
            onMouseLeave={(e : any) => truncationPopoverClose(e)}
            style={{
                minWidth :  minWidth + "px", 
                maxWidth : maxWidth + "px",
                textDecoration : `${open === true ?  "underline" : "" }`,
                color : `${open === true ? "#FF6E20" : "#C34400"}`,
                cursor : "pointer"
            }}
            className='_withoutTruncation _group_truncation_text ' ref={popoverRefs}>{ link && link}</div> 
        }
        <ClickAwayListener onClickAway={truncationPopoverClose}>
        <Popover
            id={"popover_" + id}
            open={anchorEl}
            anchorEl={popoverRefs.current}
            onClose={(e : any) => truncationPopoverClose(e)}
            marginThreshold={16}
            disablePortal
            hideBackdrop={true}
            classes={{
                ...classespop
            }}
            container={document.body}
            anchorPosition={{top : 0, left : 0}}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: 'center',
              }}
            className="crx_middle_popover"
            
        >
            
            <div className='_middle_popover_content'>{content}</div>
            
        </Popover>
        </ClickAwayListener>
        </div>
    )
}

export default CRXMiddleTruncationPopover;
