import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { CRXPopOver } from "@cb/shared";
import { CRXButton,CRXMultiViewStyle } from "@cb/shared";
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
      Comp: () => {},
    },
  ];

  const classes = CRXMultiViewStyle();

  const radioIconGrey = "iconGrey icon icon-radio-unchecked";
  const checkedIconGrey = "iconGrey icon-radio-checked";

  return (
    <>
      {anchorEl && anchorRef.current && anchorEl ? (
        <div className="CRXMultipleViewPopover">
          <Paper>
            <div className="CRXPopupInnerDiv">
              <div className="_popover_content _popover_title">
                <div className="CRXMultiBackIcon">
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
                            className={`CRXMultiViewDetail ${
                              checkedVideo === video.id
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
                                #8437653765376537653765374
                                {video.camera}
                              </div>
                              <div className="CRXMultiViewType">Body cam</div>
                              <div className="CRXMultiViewDate">
                                02 / 16 / 2019
                              </div>
                              <div className="CRXMultiViewTime">14:28:19</div>
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
                    onClick={confirmEvent}
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
