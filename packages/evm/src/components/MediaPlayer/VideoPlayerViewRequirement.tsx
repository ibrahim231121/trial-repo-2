import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import {  } from '@cb/shared';
import "./VideoPlayer.scss";

type VideoPlayerViewRequirementProps = {
    openViewRequirement: boolean;
    setOpenViewRequirement: any;
    setReasonForViewing: any
};

const VideoPlayerViewRequirement: React.FC<VideoPlayerViewRequirementProps> = React.memo((props) => {
    const { openViewRequirement, setOpenViewRequirement, setReasonForViewing } = props;
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenViewRequirement(false);
        setReasonForViewing(true)
    };




    return (
        <div className='videoPlayerNote'>
            <CRXModalDialog
            maxWidth="lg"
            title="Attention: This asset requires a reason for viewing"
            className={'CRXModal '}
            modelOpen={openViewRequirement}
            onClose={handleClose}
            showSticky={false}
            onSave={()=>{}}
            >
                <div className=''>
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>

                            <p>You must enter a reason for viewing in order to view the asset.</p>

                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton className='primary' onClick={handleClose}>
                            Enter a reason for viewing
                            </CRXButton>
                        </div>
                    </div>
                </div>


            </CRXModalDialog >
        </div >
    );
});

export default VideoPlayerViewRequirement;











