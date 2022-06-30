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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation<string>();
  return (
    <Dialog open={isOpen} className={"crx-confirm-modal " + className}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{title || t('Please_confirm')}</Typography>
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
            {t("You_are_attempting_to")} {t("close")} {(text !== undefined && text !== "" ? `${t("the")} ${text}` : t("the_modal_dialog") )}. 
            {t("If_you_close_the_modal_dialog,")} 
            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
            <br /> <br />
            {t("Are_you_sure_you_would_like_to")} {t("close")} {t("the")} {(text !== undefined && text !== "" ? `${t("the")} ${text}` : t("the_modal_dialog") )}?
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
