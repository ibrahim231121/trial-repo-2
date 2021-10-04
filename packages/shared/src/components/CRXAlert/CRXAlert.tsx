import React, { useEffect } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Fade } from "@material-ui/core";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import "./CRXAlert.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    notification: {
      background: "rgba(250,250,250,0.9)",
      border: "1px solid #646464",
      color: "#666666",
      fontSize: "12px",
      minHeight: "35px",
      maxHeight: "auto",
      paddingLeft: "14px",
      paddingRight: "18px",
      paddingTop: "10px",
      paddingBottom: "0",
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
}
const CRXAlert: React.FC<Props> = ({
  message,
  type = "success",
  alertType = "inline",
  showCloseButton = true,
  className,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openSnack, setOpenSnack] = React.useState(true);
  const [showIcon, setshowIcon] = React.useState({
    success: true,
    error: false,
    warning: false,
    info: true,
  });
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
    let timer: any = null;
    timer = setTimeout(() => {
      if (type === "success") {
        setOpen(false);
      }
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  return (
    <div className={classes.root + " crx-message-alert"}>
      {alertType === "inline" ? (
        <>
          <Fade in={open}>
            <Alert
              severity={type}
              className={classes.notification + " " + className}
              icon={<span className={"fas " + setIcon[type]} />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {showIcon[type] && <i className="icon-cross"></i>}
                </IconButton>
              }
            >
              <span>
                <span>{messageType[type]}: </span>
                {message}
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
