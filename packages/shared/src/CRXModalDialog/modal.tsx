import React from 'react';
import { DialogTitle, DialogActions, Button, Divider } from '@material-ui/core';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import './modal.scss';

//CRX Modal
import { makeStyles } from "@material-ui/core/styles";
import CRXConfirmDialog from '../components/CRXConfirmDialog/CRXConfirmDialog'

type maxWith = 'lg' | 'md' | 'sm' | 'xl' | 'xs';
type mouseEvents = React.MouseEvent<HTMLElement>;

export interface crxDialogProps {
  modelOpen: boolean;
  onClose: (e: mouseEvents) => void;
  title: string,
  children: React.ReactNode,
  onSave: (e: mouseEvents) => void,
  className?: string,
  maxWidth: maxWith,
  saveButtonTxt: string,
  cancelButtonTxt: string,
  secondaryButton?: boolean,
  primaryButton?: boolean,
  closeWithConfirm?: boolean,
  confirmContent?: any,
  id?: string,
  subTitleText?: string,
  showSticky? : boolean
}



const CRXModalDialog = (props: crxDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const widgetStyle = makeStyles({
    CRXArrowStyle: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    root : {
      zIndex : "13000 !important" as any,
    }
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
    maxWidth = "xl",
    secondaryButton = false,
    primaryButton = false,
    cancelButtonTxt,
    showSticky = false,
    saveButtonTxt = "Primery Button", closeWithConfirm, subTitleText } = props;

  const [maxWidthProps, setmaxWidthProps] = React.useState<DialogProps['maxWidth']>('lg');
  const [primaryBtn , setPlrimary] = React.useState<boolean>(false);
  const [secondaryBtn, setSecondaryBtn] = React.useState<boolean>(false);
  React.useEffect(() => {
    
    setmaxWidthProps(maxWidth);
    setPlrimary(primaryButton);
    setSecondaryBtn(secondaryButton);
    
  }, [maxWidthProps])

  return (
    <Dialog
      scroll="paper"
      id={id}
      className={"crx-model" + " " + className + " " + classes.root}
      aria-labelledby="simple-dialog-title"
      open={modelOpen}
      maxWidth={maxWidthProps}
      
    >
      <div className="CRXPopupCrossButton">
        <Button
          className={classes.CRXArrowStyle + " CRXCloseButton"}
          onClick={(e: any) => closeWithConfirm ? setIsOpen(true) : onClose(e)}
          disableRipple={true}>
          <i className="icon icon-cross2 closeModalIcon"></i>
        </Button>
      </div>
      <DialogTitle id="simple-dialog-title" className="modelTitle">{title}</DialogTitle>
      {(subTitleText !== null && subTitleText != undefined) ?
        <div className="CrxIndicates"><sup>*</sup>{subTitleText ? subTitleText : "Indicates required field"}</div> : ""}

      {
        (showSticky && showSticky == true) ? 
        <div className="optionalSticky"></div> : ""
      }
      <div className="CRXContent CRXContent_user">
        {children}
        <CRXConfirmDialog
          setIsOpen={setIsOpen}
          onConfirm={onClose}
          isOpen={isOpen}
          primary="Yes"
          secondary="No"
        />
      </div>
      
      {primaryBtn && secondaryBtn && <>
        <Divider className="CRXDivider" />

        <DialogActions className="CRXFooter">

          <Button disableRipple={true} className="modalPrimeryBtn" onClick={(e: mouseEvents) => onSave(e)}>{saveButtonTxt}</Button>
          <Button disableRipple={true} className="modalSecrndoryBtn" onClick={(e: mouseEvents) => onClose(e)}>{cancelButtonTxt}</Button>

          
        </DialogActions>
      </>}
    </Dialog>
  );
}


export default CRXModalDialog
