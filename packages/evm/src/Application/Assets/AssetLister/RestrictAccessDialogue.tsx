import React from 'react';
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";

type RestrictAccessDialogueProps = {
    openOrCloseModal: boolean;
    setOpenOrCloseModal: (param: boolean) => void;
    onConfirmBtnHandler: () => void;
    isError: boolean;
    errorMessage: string;
}

const RestrictAccessDialogue: React.FC<RestrictAccessDialogueProps> = (props) => {
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
                    {props.isError &&
                        <CRXAlert
                            className='cateoryAlert-Error errorMessageCategory'
                            message={props.errorMessage}
                            type='error'
                            alertType='inline'
                            open={true}
                        />
                    }
                    <div className='cancelConfrimText'>
                        {t("Are_you_sure_want_to_restrict_access_to_the_selected_asset(s)?")}
                    </div>
                </div>
                <div className='modalBottomText modalBottomTextClose'>
                    {t("Access_to_the_selected_asset(s)_will_be_restricted_to_user_groups_with_the_view_locked_asset_permission.")}
                </div>
            </CRXConfirmDialog>
        </div >
    );
}
export default RestrictAccessDialogue;