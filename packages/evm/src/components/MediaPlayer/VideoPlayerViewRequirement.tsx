import React, { useEffect, useRef, useState } from "react";
import { CRXModalAssetViewReason } from "@cb/shared";
import { CRXButton, CRXAlert } from "@cb/shared";
import "./VideoPlayer.scss";

type VideoPlayerViewRequirementProps = {
  openViewRequirement: boolean;
  setOpenViewRequirement: any;
  setReasonForViewing: any;
  setViewReasonRequired: any;
};

const VideoPlayerViewRequirement: React.FC<VideoPlayerViewRequirementProps> =
  React.memo((props) => {
    const { openViewRequirement, setOpenViewRequirement, setReasonForViewing, setViewReasonRequired } =
      props;
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
      setReasonForViewing(false);
      setOpenViewRequirement(false);
      setViewReasonRequired(false);
    };

    const handleNext = (e: React.MouseEvent<HTMLElement>) => {
      setReasonForViewing(true);
      setOpenViewRequirement(false);
    };

    React.useEffect(() => {
      setOpenViewRequirement(true);
    }, [])

    return (
      <div className="videoPlayerNote">
        <CRXModalAssetViewReason
          maxWidth="lg"
          title="Asset view requirement"
          className={"CRXModal CRXAssetViewRequirement"}
          modelOpen={openViewRequirement}
          onClose={handleClose}
          showSticky={false}
          onSave={() => {}}
        >
          <div className="">
            <div className="modalEditCrx">
              <div className="CrxEditForm">
                <CRXAlert
                className="CRXViewReasonAlert"
                  showCloseButton={false}
                  type="info"
                  open={true}
                  setShowSuces={true}
                  message="This asset requires a reason for viewing."
                  alertType="inline"
                />
                <p>
                  You must enter a reason for viewing in order to view the
                  asset.
                </p>
              </div>

              <div className="modalFooter CRXFooter">
                <div className="nextBtn">
                  <CRXButton className="primary" onClick={handleNext}>
                    Enter a reason for viewing
                  </CRXButton>
                  
                </div>
              </div>
            </div>
          </div>
        </CRXModalAssetViewReason>
      </div>
    );
  });

export default VideoPlayerViewRequirement;
