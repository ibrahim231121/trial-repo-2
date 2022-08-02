import React, { useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import { Button, Fade } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import "./CRXAlert.scss";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    notification: {
      background: "rgba(250,250,250,0.9)",
      border: "1px solid #646464",
      color: "#666666",
      fontSize: "12px",
      // minHeight: "35px",
      // maxHeight: "50px",
      paddingLeft: "14px",
      paddingRight: "18px",
      paddingTop: "8px",
      paddingBottom: "8px",
      display: "flex",
      placeItems: "center",
      opacity: "1", 
      visibility: "visible" ,
      boxShadow: "none",
    },
  })
);

interface Props {
  message: string;
  type?: "error" | "warning" | "success" | "info";
  alertType: "inline" | "toast";
  showCloseButton: boolean;
  className: string;
  open: boolean;
  setShowSucess: any;
  persist?: boolean;
  children?: HTMLElement
}
const CRXAlert: React.FC<Props> = ({
  message,
  type = "success",
  alertType = "inline",
  showCloseButton = true,
  className,
  open, setShowSucess, persist, children
}) => {
  const classes = useStyles();
  const [openState, setOpenState] = React.useState(open);
  const [openSnack, setOpenSnack] = React.useState(true);

  // const showIcon = {
  //   success: true,
  //   error: false,
  //   warning: false,
  //   info: true,
  // };

  const messageType = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Attention",
  };

  const setIcon = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };
  useEffect(() => {
    setOpenState(open)
  }, [open])

  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => {
      if (type === "success") {
        setOpenState(false);
      }
      else if (type === "info" && persist === null) {
        setOpenState(false);
      }
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = (_?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (

    <div className={classes.root + " crx-message-alert"}>

      {alertType === "inline" ? (
        <>
          <Fade in={openState}>
            <Alert
              severity={type}
              className={classes.notification + " " + className}
              icon={<span className={"fas " + setIcon[type]} />}
              action={
                showCloseButton &&  <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setShowSucess(false)
                    setOpenState(false);
                  }}
                >
                  { <i className="icon icon-cross2"></i>}
                </IconButton>
              }
            >
              <span>
                <span>{messageType[type]}: </span>
                {children ?? message}
              </span>
            </Alert>
          </Fade>
        </>
      ) : (
        <>
          <Fade in={openSnack} timeout={{ enter: 500, exit: 1000 }}>
            <Snackbar
              open={true}
              autoHideDuration={8500}
              onClose={handleClose}
              className={className}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                severity="success"
                className={classes.notification}
                icon={<span className={"fas " + setIcon[type]} />}
                action={
                  showCloseButton && (
                    <Button onClick={handleClose} color="inherit" size="small">
                      <i className="icon-cross"></i>
                    </Button>
                  )
                }
              >
                <span>
                  <span>{messageType[type]}: </span>
                  {message}
                </span>
              </Alert>
            </Snackbar>
          </Fade>
        </>
      )}
    </div>
  );
};

export default CRXAlert;
