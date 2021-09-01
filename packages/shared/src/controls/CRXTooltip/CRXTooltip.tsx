import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

type tooltipProps = {
    placement? : string,
    title : string,
    className? : string,
    iconName: string
}
const CRXUseStyles = makeStyles((theme) => ({
    arrow: {
      color: '#333333',
    },
    tooltip: {
      backgroundColor: "#333333",
      color:"#d1d2d4",
      fontFamily:'Arial',
      fontSize: "14px",
      padding:"8px 16px",
      boxShadow:"20% 0 5px #000000",
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
  
    return <Tooltip arrow classes={classes} {...props} />;
}
  
const CRXTooltip = ({placement, title, className,iconName} : tooltipProps) => {
    const clsxs = CRXIconStyle()
    return (
        <>
        <CRXCustomizedTooltip
            placement={placement}
            title={title}
            className={className}
            >
            <i className={iconName + " " + clsxs.iconCls}></i>
        </CRXCustomizedTooltip>
        </>
    )
}

export default CRXTooltip;