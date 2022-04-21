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
import CRXButton from '../../controls/CRXButton/CRXButton'

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
  className?: string
  text?: string;
  primaryDisabled?: boolean
};

const CRXConfirmDialog: React.FC<Props> = ({
  title,
  content,
  onConfirm,
  className,
  setIsOpen,
  isOpen,
  children, primary, secondary, primaryDisabled,
  text
}) => {
  return (
    <Dialog open={isOpen} className={"crx-confirm-modal userConfirmationModal crx-unblock-modal " + className}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography className="userConfirmTitle" variant="h6">{title || 'Please confirm'}</Typography>

        </div>
      </DialogTitle>
      <div className="CRXPopupCrossButton">
        <Button
          className={className + " CRXCloseButton"}
          onClick={() => setIsOpen(false)}
          disableRipple={true}>
          <i className="icon icon-cross2 closeModalIconUnblock"></i>
        </Button>
      </div>
      <DialogContent>
        {children ? (
          children
        ) : (
          <Typography className="userModalContent" variant="subtitle2">{content ? content : <span>
            <div className="cancelConfrimtextContent">
            You are attempting to <strong>close</strong> the {(text !== undefined && text !== "" ? text : "modal dialog")}.
            If you close the {(text !== undefined && text !== "" ? "form" : "modal dialog")}, any changes you've made will not be saved.
            You will not be able to undo this action.</div>

            <div className="modalConfirmtextUser">Are you sure you would like to <strong>close</strong> the {(text !== undefined && text !== "" ? "form" : "modal dialog")}?</div>
          </span>
          }</Typography>
        )}
      </DialogContent>
      <Divider className="CRXDivider" />
      <DialogActions className="crxConfirmFooterModal">
        <CRXButton
          id="yes"
          disabled={primaryDisabled}
          className="primary"
          variant="contained"
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
        >
          {primary || "primary"}
        </CRXButton>

        <CRXButton
          id="no"
          onClick={() => setIsOpen(false)}
          className="secondary"
          variant="outlined"
          color="secondary">
          {secondary || "secondary"}
        </CRXButton>
      </DialogActions>
    </Dialog>
  );
};

export default CRXConfirmDialog;
