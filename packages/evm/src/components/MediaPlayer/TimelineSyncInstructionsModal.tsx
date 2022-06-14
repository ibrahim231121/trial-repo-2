import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import "./VideoPlayer.scss";

type VideoPlayerTimelineSyncInstructionsProps = {
    openTimelineSyncInstructions: boolean;
    setOpenTimelineSyncInstructions: any;
};

const TimelineSyncInstructionsModal: React.FC<VideoPlayerTimelineSyncInstructionsProps> = React.memo((props) => {
    const { openTimelineSyncInstructions, setOpenTimelineSyncInstructions } = props;

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenTimelineSyncInstructions(false);
    };



    return (
        <div className='videoPlayerNote'>
            <CRXModalDialog
                maxWidth="gl"
                // title="Asset view reason"
                className={'CRXModal '}
                modelOpen={openTimelineSyncInstructions}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className=''>
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>

                            <p>Options to sync timelines start:</p>

                            <ul>
                                <li>Simply click anywhere on timeline to choose as new start time.</li>
                                <li>Single arrow for 100 millisecond change.</li>
                                <li>Double arrow for 1 second change.</li>
                                <li>Grab and drag beggining of timeline handle for big jump.</li>
                                <li>or, select timeline and Alt+arrow keys to move frame by frame.</li>
                            </ul>

                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton className='primary' onClick={handleClose}>
                            hide this message
                            </CRXButton>
                        </div>
                    </div>
                </div>


            </CRXModalDialog >
        </div >
    );
});

export default TimelineSyncInstructionsModal;











