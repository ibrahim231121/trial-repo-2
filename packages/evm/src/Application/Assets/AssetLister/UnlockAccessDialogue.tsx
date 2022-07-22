import React from 'react';
import { CRXConfirmDialog } from "@cb/shared";
import { useTranslation } from "react-i18next";

type RestrictAccessDialogueProps = {
    openOrCloseModal: boolean;
    setOpenOrCloseModal: (param: boolean) => void;
    onConfirmBtnHandler: () => void;
}

const UnlockAccessDialogue: React.FC<RestrictAccessDialogueProps> = (props) => {
    const { t } = useTranslation<string>();
    return (
        <div className='restrict-modal-dialogue'>
            <CRXConfirmDialog
                className="crx-unblock-modal CRXRestrictAssetModal"
                title={t("Please_confirm")}
                setIsOpen={props.setOpenOrCloseModal}
                onConfirm={props.onConfirmBtnHandler}
                isOpen={props.openOrCloseModal}
                primary={t("Confirm")}
                secondary={t("Cancel")}
            >
                <div className='modalContentText'>
                    {/* <div className='cancelConfrimText'>
                        You are attempting to <strong>close</strong> the Manage Default Unit Template. If you close it, any changes
                        you've made will not be saved. You will not be able to undo this action.{' '}
                    </div> */}
                    <div className='cancelConfrimText'>
                        {"Are you sure_want_to_unlock_access_to_the_selected_asset(s)?"}
                    </div>
                </div>
                {/* <div className='modalBottomText modalBottomTextClose'>
                    Are you sure you would like to <strong>close</strong> Manage Default Unit Template?
                </div> */}
                <div className='modalBottomText modalBottomTextClose'>
                    </div>
            </CRXConfirmDialog>
        </div >
    );
}
export default UnlockAccessDialogue;