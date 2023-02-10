import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { CRXPopOver } from "@cb/shared";
import { CRXButton, CRXMultiViewStyle } from "@cb/shared";
import { CRXHeading } from "@cb/shared";
import { CRXCheckBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { IconButton, Radio } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { addTimelineDetailActionCreator } from "../../Redux/VideoPlayerTimelineDetailReducer";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import Paper from "@material-ui/core/Paper";
import { CRXTooltip } from "@cb/shared";

interface VideosSelectionProp {
  timelinedetail: any[];
  setAnchorEl: any;
  setIndexAnchorE1: any;
  anchorEl: any;
  indexNumber: any;
  setupdateVideoSelection: any;
  anchorRef: any;
  setscreenChangeVideoId : any;
}

type CheckValue = {
  isChecked: boolean;
  assetId: string;
};

const VideosSelection = ({
  timelinedetail,
  setAnchorEl,
  setIndexAnchorE1,
  anchorEl,
  indexNumber,
  setupdateVideoSelection,
  anchorRef,
  setscreenChangeVideoId,
}: VideosSelectionProp) => {
  const [checkedVideo, setCheckedVideo] = React.useState<string>("");
  const dispatch = useDispatch();

  const confirmEvent = async () => {
    if (checkedVideo !== "") {
      var tempArray = JSON.parse(JSON.stringify(timelinedetail));
      var tempItemToRemove = tempArray.find(
        (x: any) => x.indexNumberToDisplay == indexNumber
      );
      if (tempItemToRemove !== undefined) {
        tempItemToRemove.enableDisplay = false;
        tempItemToRemove.indexNumberToDisplay = 0;
      }
      var tempItem = tempArray.find((x: any) => x.id == checkedVideo);
      if (tempItem !== undefined) {
        setscreenChangeVideoId(tempItem.id);
        tempItem.enableDisplay = true;
        tempItem.indexNumberToDisplay = indexNumber;
        setIndexAnchorE1(0);
      }
      await dispatch(addTimelineDetailActionCreator(tempArray));
      setCheckedVideo("");
      setupdateVideoSelection(true);
      onClosePopover();
    } else {
      alert("Please select some video");
    }
  };

  const onClosePopover = () => {
    setAnchorEl(null);
    setIndexAnchorE1(0);
  };
  const RadioBtnValues = [
    {
      value: 1,
      Comp: () => { },
    },
  ];

  const classes = CRXMultiViewStyle();

  const radioIconGrey = "iconGrey icon icon-radio-unchecked";
  const checkedIconGrey = "iconGrey icon-radio-checked";
  const MultiBackTooltip = () => {
      setAnchorEl(null);
      
    }
  return (
    <>
      {anchorEl && anchorRef.current && anchorEl ? (
        <div className="CRXMultipleViewPopover">
          <Paper>
            <div className="CRXPopupInnerDiv">
              <div className="_popover_content _popover_title">
                <div className="CRXMultiBackIcon" onClick={() => MultiBackTooltip()}>
                  <CRXTooltip
                    placement="left"
                    title="back"
                    arrow={false}
                    iconName="fas fa-chevron-left chevronLeft"
                  />
                </div>
                <div className="title_text">Select a video to view</div>
              </div>

              <div className="CRXPopupHeader">
                <CRXHeading className="DRPTitle" variant="h3">
                  GROUPED ASSETS
                </CRXHeading>
              </div>
              <div className="CRXPopupTableDiv">
                <div className="CRXMultiViewList crx-category-scroll">
                  {timelinedetail
                    .filter((x: any) => x.enableDisplay == false)
                    .map((video: any, index: number) => {
                      const id = `checkBox'+${index}`;
                      const videoCheckRadio = () => {
                        setCheckedVideo(video.id);
                      };
                      return (
                        <>
                          <div
                            className={`CRXMultiViewDetail ${checkedVideo === video.id
                                ? "CRXMultiViewDetailActive"
                                : ""
                              }`}
                            onClick={(e: any) => videoCheckRadio()}
                            key={index}
                          >
                            <div className="CRXMultiViewRadio">
                              <Radio
                                className="CRXMultiViewRadioBtn"
                                checkedIcon={
                                  <span
                                    className={
                                      classes.checkedIconGrey +
                                      " " +
                                      checkedIconGrey
                                    }
                                  ></span>
                                }
                                icon={
                                  <span
                                    className={
                                      classes.iconGrey + " " + radioIconGrey
                                    }
                                  ></span>
                                }
                                checked={checkedVideo === video.id}
                                disableRipple={false}
                                onChange={(e: any) =>
                                  e.target.value
                                    ? setCheckedVideo(video.id)
                                    : ""
                                }
                                value={video.id}
                                name="radio-buttons"
                              />
                            </div>
                            <div className="CRXMultiViewthumb">
                              <video src={video.src} />
                            </div>
                            <div className="CRXMultiViewDetailList">
                              <div className="CRXMultiViewName">
                                {video.assetName}
                              </div>
                              {video.camera && <div className="CRXMultiViewType">{video.camera}</div>}
                              <div className="CRXMultiViewDate">
                                {new Date(video.recording_started).toLocaleDateString()}
                              </div>
                              <div className="CRXMultiViewTime">{new Date(video.recording_started).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
                <div className="CRXMultiViewFooter">
                  <CRXButton
                    className="primary"
                    disabled={checkedVideo === "" ? true : false}
                    onClick={(e: any) => { confirmEvent(); }}
                  >
                    Confirm selection for view
                  </CRXButton>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      ) : (
        " "
      )}
    </>
  );
};

export default VideosSelection;
