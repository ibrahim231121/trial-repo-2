import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

type tooltipProps = {
  placement?: string;
  title: any;
  className?: string;
  iconName?: string;
  content?: any;
  arrow?: boolean;
  id? : string,
  disablePortal? : boolean
};
const CRXUseStyles = makeStyles(() => ({
  arrow: {
    color: "#333"

  },
  tooltip: {
    backgroundColor: "#333333",
    color: "#d1d2d4",
    fontFamily: "Arial",
    fontSize: "14px",
    padding: "12px 16px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.20)",
    borderRadius: "0px",
    maxWidth: "400px",
    minWidth: "auto",
    textAlign : "center"
  },
  popper : {
    color : "#d1d2d4",
    maxWidth : "400px"
  }
}));

const CRXIconStyle = makeStyles(() => ({
  iconCls: {
    position: "relative",
    top: "0px",
    height: "17px",
    '&:hover': {
      color : "#333",
    }

  },
}));

function CRXCustomizedTooltip(props: any) {
  const classes = CRXUseStyles();

  return (
    <Tooltip
    PopperProps={{
      disablePortal: props.disablePortal,
      popperOptions: {
      //positionFixed: true,
      }
    }}
      arrow
      classes={{
        arrow:
          props.placement.length && classes.arrow + " crxArrowTooltip",

        tooltip:
          props.placement.length && classes.tooltip + " " + " crxTooltipAll",
          popper : classes.popper + " " + props.className
      }}
      {...props}
    />
  );
}

const CRXTooltip = ({
  placement,
  title,
  className,
  iconName,
  content,
  arrow = true,
  id,
  disablePortal = false
}: tooltipProps) => {
  const clsxs = CRXIconStyle();

  const [tooltipIsOpen, setTooltipIsOpen] = React.useState(false);
  const tooltipData = () => {
    if (content == undefined) {
      return <i className={iconName + " crxTooltip " + clsxs.iconCls}></i>;
    } else {
      return <div className="tooltipContent">{content}</div>;
    }
  };

  const addTooltipTitle: string = title;

  return (
    <>
      <CRXCustomizedTooltip
        id={id}
        arrow={arrow}
        placement={placement}
        title={addTooltipTitle}
        className={className}
        onClick={() => setTooltipIsOpen(true)}
        open={tooltipIsOpen}
        onOpen={() => setTooltipIsOpen(true)}
        onClose={() => setTooltipIsOpen(false)}
        disablePortal={disablePortal}
      >
        {tooltipData()}
      </CRXCustomizedTooltip>
    </>
  );
};

export default CRXTooltip;
