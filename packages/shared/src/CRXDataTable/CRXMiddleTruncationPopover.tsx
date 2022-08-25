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
    
}


const CRXMiddleTruncationPopover = ({content, id, isPopover, minWidth, maxWidth} : popoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const middleText = content.toString().length;
    const [truncationButton, setTruncationBtn] = useState();
    const popoverRefs = useRef(content)

    const truncationPopoverOpen = (e : any) => {
        
        setAnchorEl(e.currentTarget)
        
    }

    const truncationPopoverClose = () => {
        setAnchorEl(null);
        
    };
    
    const truncate = (fullStr:any, strLen:any) => {
        
        const dataLength = fullStr.toString().length;

        if (dataLength <= strLen) return fullStr;
        
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
        truncate(content, 22)
    },[])
    
    const useGapStyles = makeStyles({
        root : {
            position : "relative!important" as any,
        },
        paper: {
            marginBottom: "2rem",
            overflowY: "auto",
            position: "absolute",
            top: "-152px!important" as any,
            minHeight: "118px",
            left: "-20px!important" as any,
            
        }
    });

    const classespop = useGapStyles()
    return (
        <div className='_truncation_Popover'>
        {isPopover &&  (isPopover == true && middleText > 20) ?   
            <div className='dataMidTruncation _group_truncation_text '>
            <div className='_truncation_text' 
                onMouseEnter={(e : any) => truncationPopoverOpen(e)} 
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
            : <div className='_withoutTruncation _group_truncation_text ' ref={popoverRefs}>{"#" + content}</div> 
        }
        <ClickAwayListener onClickAway={truncationPopoverClose}>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={truncationPopoverClose}
            marginThreshold={16}
            disablePortal
            hideBackdrop={true}
            classes={{
                ...classespop
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
            className="crx_middle_popover"
            
        >
            
            <div className='_middle_popover_content'>{content}</div>
            
        </Popover>
        </ClickAwayListener>
        </div>
    )
}

export default CRXMiddleTruncationPopover;
