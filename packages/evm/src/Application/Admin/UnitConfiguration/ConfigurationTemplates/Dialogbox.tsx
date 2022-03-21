import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Divider,
  DialogActions,
} from "@material-ui/core";

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
  className? : string
  text?: string;
  myVar:boolean;
};

const Dialogbox: React.FC<Props> = ({
  title,
  content,
  onConfirm,
  className,
  setIsOpen,
  isOpen,
  children, primary, secondary,
  text,
  myVar
}) => {
  return (
    <Dialog open={isOpen} className={"crx-confirm-modal " + className}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{title || 'Please confirm'}</Typography>
        </div>
        <div className="crossModal"  onClick={() => {setIsOpen(false)}}>
          <i className="icon icon-cross2 croseIcon"></i>
        </div>
      </DialogTitle>
      <DialogContent>
        {children ? (
          children
        ) : (
          <Typography variant="subtitle2">{content ? content : <span>
            You are attempting to close the {(text !== undefined && text !== "" ? text : "modal dialog" )}. 
            If you close the {(text !== undefined && text !== "" ? "form" : "modal dialog" )}, any changes you've made will not be saved. 
            You will not be able to undo this action.
            <br />
            <br />
            Are you sure you would like to close the {(text !== undefined && text !== "" ? "form" : "modal dialog" )}?
          </span>
          }</Typography>
        )}
      </DialogContent>
      <Divider className="CRXDivider" />
      <DialogActions className="crxConfirmFooterModal" style={{justifyContent:"space-around"}}>
      <div>
       <Button onClick={() => onConfirm()} disableRipple={true} className="secondaryBtn modal_confrim_btn" variant="contained">  {secondary || "secondary"} </Button>
      </div>    
        {myVar && 
      <div>
      <Button className="secondaryBtn modal_close_btn"
      disableRipple={false}
      onClick={() => {
      setIsOpen(false);
      }}
      
      >
        {primary || "primary"}
      </Button>
      </div>}
      </DialogActions>
    </Dialog>
  );
};









export default Dialogbox
