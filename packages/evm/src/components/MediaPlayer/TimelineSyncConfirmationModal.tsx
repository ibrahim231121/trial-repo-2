import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import "./VideoPlayer.scss";
import { useHistory } from 'react-router-dom';

type VideoPlayerTimelineSyncConfirmationProps = {
    openTimelineSyncConfirmation: boolean;
    setOpenTimelineSyncConfirmation: any
};

const TimelineSyncConfirmationModal: React.FC<VideoPlayerTimelineSyncConfirmationProps> = React.memo((props) => {
    const { openTimelineSyncConfirmation, setOpenTimelineSyncConfirmation } = props;
    const history = useHistory();
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenTimelineSyncConfirmation(false);
        setOpenTimelineSyncConfirmation(false);
    };

    const handleBack = (e: React.MouseEvent<HTMLElement>) => {
        history.goBack();
    };



    return (
        <div className='videoPlayerNote'>
            <CRXModalDialog
                maxWidth="gl"
                title="Please confirm"
                className={'CRXModal '}
                modelOpen={openTimelineSyncConfirmation}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className=''>
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>

                            <p>You are attempting to close out of this screen with unsaved changes. If you close this screen, any un-saved changes will not be saved. You will not be able to undo this action.</p>
<p>Would you like to close this screen?</p>

                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton className='primary' onClick={handleBack}>
                            Yes, close
                            </CRXButton>
                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton className='primary' onClick={handleClose}>
                            No, do not close
                            </CRXButton>
                        </div>
                    </div>
                </div>


            </CRXModalDialog >
        </div >
    );
});

export default TimelineSyncConfirmationModal;











