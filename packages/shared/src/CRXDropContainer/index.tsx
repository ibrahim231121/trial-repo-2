import React from "react";
import { Dialog, IconButton} from "@material-ui/core";
import "./CRXDropContent.scss";
import { makeStyles } from "@material-ui/core/styles";

interface propsType {
  icon?: any;
  color?: "default" | "primary" | "secondary";
  className?: string;
  content: React.ReactNode;
  menuClass?: string;
  stateStatus:(v:boolean)=>void,
  openState: boolean,
  disableScrollLock:boolean
}
const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "transparent",
  },

  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden",
  },
  modalbox: {
    zIndex: "9999!important" as any,
  },
}));
const CRXDropContainer: React.FC<propsType> = ({
  color,
  className,
  content,
  openState,
  stateStatus
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(openState);
  
  
  React.useEffect(() => {
    // setOpen(openState);
    stateStatus(open)
  }, [open]);

  React.useEffect(() => {
    setOpen(openState);
  }, [openState]);


  const handleClose = () => {
    setOpen(false);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseKeyPress = (e : any) => {
    if(e.key == "Enter" && openState == true)  {
        setOpen(false);
    }
  }
  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      handleCloseKeyPress(e)
    })
    return () => {
      document.removeEventListener("keydown", handleCloseKeyPress)
    }

  },[openState])
  return (
    <div className="iconContent">
      <IconButton
        color={color}
        className={"buttonStyle " + className}
        component="div"
        onClick={handleClickOpen}
        disableRipple={true}
      >
        <div className="iconStyle"><i className="icon-calendar"></i></div>
      </IconButton>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          disableScrollLock={true}
          BackdropProps={{
            classes: {
              root: classes.root,
            },
          }}
          className={classes.modalbox}
        >
          {content}
        </Dialog>
      </div>
    </div>
  );
};

export default CRXDropContainer;
