import React from 'react';
import {DialogTitle, Dialog, DialogActions, Button, Divider} from '@material-ui/core';
import './modal.scss';

//CRX Modal
import { makeStyles } from "@material-ui/core/styles";

type maxWith = 'lg' | 'md' | 'sm' | 'xl' | 'xs';
type mouseEvents = React.MouseEvent<HTMLElement>; 

export interface crxDialogProps {
  modelOpen: boolean;
  onClose: (e: mouseEvents) => void;
  title : string,
  children: React.ReactNode,
  onSave : (e: mouseEvents) => void,
  className? : string,
  maxWidth : maxWith,
  saveButtonTxt: string,
  cancelButtonTxt: string,
  secondaryButton? : boolean,
  id? : string
}



const CRXModalDialog = (props: crxDialogProps) => {

  const widgetStyle = makeStyles({
    CRXArrowStyle: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  });

  const classes = widgetStyle();

  const { 
    id,
    onClose, 
    modelOpen, 
    title, 
    children, 
    onSave, 
    className, 
    maxWidth,
    secondaryButton = false,
    cancelButtonTxt, 
    saveButtonTxt = "Primery Button" } = props;

  return (
    <Dialog 
      scroll="paper" 
      id={id} 
      className={"crx-model" + " " + className} 
      aria-labelledby="simple-dialog-title" 
      open={modelOpen} 
      maxWidth={maxWidth}
      >
         <div className="CRXPopupCrossButton">
            <Button
              className={classes.CRXArrowStyle + " CRXCloseButton"}
              onClick={onClose}
              disableRipple={true}>
              <i className="icon-cross2 closeModalIcon"></i>
            </Button>
          </div>
        <DialogTitle className="modelTitle">{title}</DialogTitle>
        <div className="CRXContent">
          { children }
        </div>
        <Divider className="CRXDivider" />
        <DialogActions className="CRXFooter">
        
            <Button disableRipple={true} className="modalPrimeryBtn" onClick={(e : mouseEvents) => onSave(e)}>{saveButtonTxt}</Button>
            {
              secondaryButton &&
              <Button disableRipple={true} className="modalSecrndoryBtn" onClick={(e : mouseEvents) => onClose(e)}>{cancelButtonTxt}</Button>
              
            }
        </DialogActions>
    </Dialog>
  );
}


export default CRXModalDialog