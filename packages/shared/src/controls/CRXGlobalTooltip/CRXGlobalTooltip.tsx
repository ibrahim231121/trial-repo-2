import React from 'react';
import {  makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';


interface tooltipProps  {
    placement? : "right" | "right-start" | "right-end" | "left" | "left-start" | "left-end" | "bottom" | "bottom-start" | "bottom-end" | "top" | "top-end" | "top-start";
    title : string,
    className? : string,
    iconName?: string,
    content? : HTMLCollection,
    arrow: boolean
}

const CRXUseStyles = makeStyles(() => ({
    arrow: {
      color: '#333',
    },
    
    tooltip: {
      backgroundColor: "#333333",
      color:"#d1d2d4",
      fontFamily:'Arial',
      fontSize: "14px",
      padding:"16px",
      boxShadow:"20% 0 5px #000000",
      borderRadius : "0px",
      maxWidth:"350px",
    },

}));

const CRXIconStyle = makeStyles(() => ({
    iconCls : {
        position:"relative",  
        top:"1px",
        height:"17px"
    }
}))
function CRXCustomizedTooltip(props : any, {arrow} : tooltipProps) {
    const classes = CRXUseStyles();
  
    return <Tooltip arrow = {arrow}
    classes={{
        
        arrow :  classes.arrow,
        tooltip :  classes.tooltip
    }} 
    {...props} />;
}
  
const CRXGlobalTooltip = ({placement = "top", title, className,iconName, content, arrow = true} : tooltipProps) => {

  const placementType = {
  "top-start" : "top-start",
  "top": "top",
  "top-end" : "top-end",
  "right-start" : "right-start",
  "right": "right",
  "right-end" : "right-end",
  "bottom-start" : "bottom-start",
  "bottom": "bottom",
  "bottom-end" : "bottom-end",
  "left-start" : "left-start",
  "left": "left",
  "left-end" : "left-end",
  }
   
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
            placement={placementType[placement]}
            title={title}
            className={className}
            arrow = {arrow}
            >
            {tooltipData()}
            
        </CRXCustomizedTooltip>
        </>
    )
}

export default CRXGlobalTooltip;  