import React, { useRef, useState } from 'react'
import Button from "@material-ui/core/Button"
import styled from 'styled-components';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Popper, {PopperPlacementType }  from '@material-ui/core/Popper';

type PopoverProps = {
    content : any,
    placement? :PopperPlacementType | undefined,
    arrow? : boolean
}

const TextButton = styled(Button)`
        height: 80px; 
        background: transparent;
        color: #333;
        padding: 0px;
        text-align: left;
        line-height: 23px;
        font-size: 14px;
        .MuiButton-label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            white-space: break-spaces;
            word-break: break-all;
            text-transform: none;
        } 
`
const Label = styled.label`
        font-size:14px;
        color : #333;
        line-height : 23px;
        text-align : left;
`
const Content = styled('div')`
        width : 100%;
        overflow-y: auto;
        overflow-x: clip;
        padding: 16px;
`
const usePopoverStyled = makeStyles({
    root : {
        
    },
    popover : {
        
        
    },
    paper: {
        minWidth : "280px",
        maxWidth : "400px",
        maxHeight : "350px",
        padding: "0px",
        backgroundColor : "#333333",
        color : "#d1d2d4",
        lineHeight : "22px",
        textTransform: "none",
        boxShadow : "0px 0px 6px 0px rgba(0,0,0,0.2);",
        borderRadius : "0px",
        fontSize: "14px",
        textAlign: "left",
        wordBreak: "break-all",
        zIndex: 999,
        '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            marginTop: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
              borderWidth: '0 2em 2em 2em',
              borderColor: `transparent transparent #333 transparent`,
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
              borderColor: `#333 transparent transparent transparent`,
            },
          },
          '&[x-placement*="right"] $arrow': {
            left: 0,
            marginLeft: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
              borderWidth: '1.5em 1.5em 1.5em 0',
              borderColor: `transparent #333 transparent transparent`,
            },
          },
          '&[x-placement*="left"] $arrow': {
            right: 0,
            marginRight: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
              borderWidth: '1.5em 0 1.5em 1.5em',
              borderColor: `transparent transparent transparent #333`,
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
    }
})
const CRXTruncation = ({content, placement, arrow = true} : PopoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const buttonRef = useRef(null);
    const [arrowRef, setArrowRef] = useState<any>();
    const popoverStyled = usePopoverStyled()
    const handleClick = (event : any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    
    return (
          <>
            {content && content.length > 75 ?
                <TextButton 
                className='truncation_button' 
                ref={buttonRef} 
                onClick={handleClick} 
                onMouseEnter={handleClick} 
                onMouseLeave={handleClose}
                >
                {content}
                </TextButton>
           : <Label className='truncation_button'>{content}</Label> }
            
            
           <Popper
            open={open}
            anchorEl={buttonRef.current}
            placement={placement == undefined ? "top" : placement}
            disablePortal={false}
            className = {
                popoverStyled.paper
            }
            modifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent',
              },
              offset: {
                enabled: true,
                offset: '0, 17'
               },
              arrow: {
                name: 'arrow',
                enabled: true,
                element: arrowRef,
              },
            }}
          ><Content className='content-truncation'>{content}</Content>
          {arrow ? <span className={popoverStyled.arrow} ref={setArrowRef} /> : null}
          </Popper>
          </>
    )
}

export default CRXTruncation;