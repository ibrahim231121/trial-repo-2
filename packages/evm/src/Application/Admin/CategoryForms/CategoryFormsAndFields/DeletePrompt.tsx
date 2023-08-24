import React from 'react';
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";
import "./DeletePrompt.scss";
type DeletePromptProps = {
    openOrCloseModal: boolean;
    setOpenOrCloseModal: (param: boolean) => void;
    onConfirmBtnHandler: () => void;
    isError: boolean;
    errorMessage: string;
    formName : string;
    names : string;
    confirmationMessage : string;
}
const DeletePrompt : React.FC<DeletePromptProps> = (props) => {
    const { t } = useTranslation<string>();
    return (
        <div className='delete-prompt-modal-dialogue'>
            <CRXConfirmDialog
                className="crx-unblock-modal CRXDeletePrompt _delete_prompt_model_"
                title={t("Please_Confirm")}
                setIsOpen={props.setOpenOrCloseModal}
                onConfirm={props.onConfirmBtnHandler}
                isOpen={props.openOrCloseModal}
                primary={t("Yes_delete")}
                secondary={t("No_do_not_delete")}
            >
                <div className='modalContentText'>
                    {props.isError &&
                        <CRXAlert
                            className='cateoryAlert-Error errorMessageDeletePrompt'
                            message={props.errorMessage}
                            type='error'
                            alertType='inline'
                            open={true}
                        />
                    }
                    <div className='cancelConfrimText'>
                        <p className="configuserPara1">
                            {t("You_are_attempting_to")} <span className="boldPara">{t("delete")}&nbsp;</span>{props.formName}<span className="boldPara">&nbsp;{props.names}.</span>&nbsp;

                            {t("You_will_not_be_able_to_undo_this_action.")}
                        </p>
                        <p className="configuserPara2">{t(props.confirmationMessage)}</p>
                    </div>
                </div>
            </CRXConfirmDialog>
        </div >
    );
}
export default DeletePrompt;