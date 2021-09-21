import React, { ReactNode } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

type tooltipProps = {
    placement? : string,
    title : string,
    className? : string,
    iconName?: string,
    content? : HTMLCollection
}
const CRXUseStyles = makeStyles((theme) => ({
    arrow: {
      color: '#333',
    },
    
    arrowTopEnd: {
        color: '#333333',
        left : "215px !important",
        bottom : "0em !important"
      },

    tooltip: {
      backgroundColor: "#333333",
      color:"#d1d2d4",
      fontFamily:'Arial',
      fontSize: "14px",
      padding:"8px 16px",
      boxShadow:"20% 0 5px #000000",
      borderRadius : "0px",
      maxWidth:"250px",
    },

    tooltipTopEnd: {
        backgroundColor: "#333333",
        color:"#d1d2d4",
        fontFamily:'Arial',
        fontSize: "14px",
        padding:"8px 16px",
        boxShadow:"20% 0 5px #000000",
        borderRadius : "0px",
        maxWidth:"250px",
        top : "10px"
      },

}));

const CRXIconStyle = makeStyles(() => ({
    iconCls : {
        position:"relative",
        top:"1px",
        height:"17px"
    }
}))
function CRXCustomizedTooltip(props : any) {
    const classes = CRXUseStyles();
  
    return <Tooltip arrow classes={{
        arrow : props.placement == "top-end" ? classes.arrowTopEnd : classes.arrow,
        tooltip : props.placement == "top-end" ? classes.tooltipTopEnd : classes.tooltip
    }} {...props} />;
}
  
const CRXTooltip = ({placement, title, className,iconName, content} : tooltipProps) => {
   
    const clsxs = CRXIconStyle();
   
    const tooltipData = () => {
        if(content == undefined) {
            return <i className={iconName + " " + clsxs.iconCls}></i>;
        } else {
            return <div className="tooltipContent">{content}</div>
        }
    }
    return (
        <>
        <CRXCustomizedTooltip
            placement={placement}
            title={title}
            className={className}
            
            >
            {tooltipData()}
            
        </CRXCustomizedTooltip>
        </>
    )
}

export default CRXTooltip;