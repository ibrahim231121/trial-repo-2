import React, { useEffect } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Fade } from "@material-ui/core";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
  })
);


interface Props {
    message: string;
    type?: "error" | "warning" | "success" | "info";
    alertType:"inline"| "toast";
    showCloseButton:boolean
  }
const CRXAlert: React.FC<Props> = ({ message, type = "success" ,alertType="inline",showCloseButton=true}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [openSnack, setOpenSnack] = React.useState(true);

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
    <div className={classes.root}>
     {alertType==="inline" ? <>
     <Fade in={open}>
        <Alert
        severity={type}
          action={
 <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              {type!=="error" && <CloseIcon fontSize="inherit" />}
            </IconButton>}
        >
         <span>{type}: </span><span>{message}</span>
        </Alert>
      </Fade></>
      :<>
      <Fade in={openSnack} timeout={{ enter: 500, exit: 1000 }}>
      <Snackbar
        open={true}
        autoHideDuration={8500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          action={
            showCloseButton && (
              <Button onClick={handleClose} color="inherit" size="small">
                x
              </Button>
            )
          }
        >
          <span>{type}: </span><span>{message}</span>
        </Alert>
      </Snackbar>
    </Fade>
</>
        }
    </div>
  );
};

export default CRXAlert;
