import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import './index.scss';
type Props = {
  title?: string;
  content?: string;
  onConfirm: any;
  setIsOpen: any;
  isOpen: boolean;
  children?: React.ReactNode;
  primary?: string,
  secondary?: string
};

const CRXConfirmDialog: React.FC<Props> = ({
  title,
  content,
  onConfirm,
  setIsOpen,
  isOpen,
  children, primary, secondary
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{title || 'Please confirm'}</Typography>
          <CloseIcon onClick={() => setIsOpen(false)} />
        </div>
      </DialogTitle>
      <DialogContent
        style={{
          "overflowY": "scroll",
          "maxHeight": "101px",
        }}
      >
        {children ? (
          children
        ) : (
          <Typography variant="subtitle2">{content ? content : <span>
            You are attempting to close the modal dialog.  If you close the modal dialog, any changes you've made will not be saved. You will not be able to undo this action.
            <br />
            <br />
            Are you sure you would like to close the modal dialog?
          </span>
          }</Typography>
        )}
      </DialogContent>
      <div>
        <hr />

      </div>
      <DialogActions style={{
        "display": "flex",
        "flexDirection": "row",
        "justifyContent": "end",
      }}>
        <Button className="primaryBtn"
          style={{ backgroundColor: "black", color: "white" }}
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
        >
          {primary || "primary"}
        </Button>
        <Button onClick={() => setIsOpen(false)} className="secondaryBtn">  {secondary || "secondary"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CRXConfirmDialog;
