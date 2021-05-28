import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

type tooltipProps = {
    placement? : string,
    title : any,
}
const CRXUseStyles = makeStyles((theme) => ({
    arrow: {
      color: theme.palette.common.black,
      top: "6px !important"
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
      color:"#D1D1D4",
      fontSize: "14px",
      padding:"8px 16px"
    },
}));

const CRXIconStyle = makeStyles(() => ({
    iconCls : {
        position:"relative",
        top:"9px",
        height:"17px"
    }
}))
function CRXCustomizedTooltip(props : any) {
    const classes = CRXUseStyles();
  
    return <Tooltip arrow classes={classes} {...props} />;
}
  
const CRXTooltip = ({placement, title} : tooltipProps) => {
    const clsxs = CRXIconStyle()
    return (
        <>
        <CRXCustomizedTooltip
            placement={placement}
            title={title}>

            <i className={"fas fa-info-circle" + " " + clsxs.iconCls}></i>
        </CRXCustomizedTooltip>
        </>
    )
}

export default CRXTooltip;