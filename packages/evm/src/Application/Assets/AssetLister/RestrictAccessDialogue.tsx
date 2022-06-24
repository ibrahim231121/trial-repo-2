import React from 'react';
import { CRXConfirmDialog } from "@cb/shared";

type RestrictAccessDialogueProps = {
    openOrCloseModal: boolean;
    setOpenOrCloseModal: (param: boolean) => void;
    onConfirmBtnHandler: () => void;
}

const RestrictAccessDialogue: React.FC<RestrictAccessDialogueProps> = (props) => {
    return (
        <div className='restrict-modal-dialogue'>
            <CRXConfirmDialog
                className="crx-unblock-modal CRXRestrictAssetModal"
                title={"Please confirm"}
                setIsOpen={props.setOpenOrCloseModal}
                onConfirm={props.onConfirmBtnHandler}
                isOpen={props.openOrCloseModal}
                primary={"Confirm"}
                secondary={"Cancel"}
            >
                <div className='modalContentText'>
                    {/* <div className='cancelConfrimText'>
                        You are attempting to <strong>close</strong> the Manage Default Unit Template. If you close it, any changes
                        you've made will not be saved. You will not be able to undo this action.{' '}
                    </div> */}
                    <div className='cancelConfrimText'>
                        Are you sure want to restrict access to the selected asset(s)?
                    </div>
                </div>
                {/* <div className='modalBottomText modalBottomTextClose'>
                    Are you sure you would like to <strong>close</strong> Manage Default Unit Template?
                </div> */}
                <div className='modalBottomText modalBottomTextClose'>
                    Access to the selected asset(s) will be restricted to user groups with the view locked asset permission.
                </div>
            </CRXConfirmDialog>
        </div >
    );
}
export default RestrictAccessDialogue;