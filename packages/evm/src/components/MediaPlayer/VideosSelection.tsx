import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { CRXPopOver } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { CRXHeading } from "@cb/shared";
import { CRXCheckBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { CRXRadio } from "@cb/shared";
import { Radio } from "@mui/material";

interface VideosSelectionProp {
  timelinedetail: any[],
  settimelinedetail: any,
  setAnchorEl: any,
  anchorEl: any,
  indexNumber: any
}

type CheckValue = {
  isChecked: boolean;
  assetId: string;
};

const VideosSelection = ({ timelinedetail, settimelinedetail, setAnchorEl, anchorEl, indexNumber }: VideosSelectionProp) => {

  const open = Boolean(anchorEl);
  const [checkedVideo, setCheckedVideo] = React.useState<string>("");

  const confirmEvent = () => {
    if (checkedVideo !== "") {
      var tempArray = [...timelinedetail];
      var tempItemToRemove = tempArray.find((x: any) => x.indexNumberToDisplay == indexNumber);
      if (tempItemToRemove !== undefined) {
        tempItemToRemove.enableDisplay = false;
        tempItemToRemove.indexNumberToDisplay = 0;
      }
      var tempItem = tempArray.find((x: any) => x.id == checkedVideo);
      if (tempItem !== undefined) {
        tempItem.enableDisplay = true;
        tempItem.indexNumberToDisplay = indexNumber;
      }
      settimelinedetail(tempArray);
    }
    else
    {
      alert("Please select some video")
    }
  };




  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <CRXPopOver
      open={open}
      anchorEl={anchorEl}
      onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
      className={"CRXPopoverCss"}
    >
      <div className="CRXPopupInnerDiv">
        <div className="CRXPopupCrossButton">
          <CRXButton
            className={"CRXCloseButton"}
            disableRipple={true}
            onClick={onClose}
          >
            <div className="icon icon-cross2 detailPopupCloseIcon"></div>
          </CRXButton>
        </div>
        <div className="CRXPopupHeader">
          <CRXHeading className="DRPTitle" variant="h3">
            Select a video to view
          </CRXHeading>
        </div>
        <div className="CRXPopupTableDiv">
          <table>
            <tbody>
              <tr className="CRXPopupTableRow">
                <td className="CRXPopupTableCellOne">
                </td>
                <td className="CRXPopupTableCellTwo"></td>
              </tr>
              {timelinedetail.filter((x: any) => x.enableDisplay == false).map((video: any, index: number) => {
                const id = `checkBox'+${index}`;

                return (
                  <>
                    <tr key={index}>
                      <td>
                        <Radio
                          checked={checkedVideo === video.id}
                          onChange={(e: any) => e.target.checked ? setCheckedVideo(video.id) : ""}
                          value={video.id}
                          name="radio-buttons" />
                      </td>
                      <td>
                        {video.id}
                      </td>
                    </tr>

                  </>
                );
              })
              }
            </tbody>
          </table>

          <CRXButton className='primary' onClick={confirmEvent}>
            Confirm selection for view
          </CRXButton>



        </div>
      </div>
    </CRXPopOver>
  );
};

export default VideosSelection;