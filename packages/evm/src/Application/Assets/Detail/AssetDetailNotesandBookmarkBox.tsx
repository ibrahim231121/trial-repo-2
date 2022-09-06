import React, { useEffect, useState } from "react";
import { CRXButton, TextField } from "@cb/shared";

import "./AssetDetailsPanel.scss";
import { CRXTooltip, CRXConfirmDialog } from "@cb/shared";
import { useDispatch } from "react-redux";
import { addTimelineDetailActionCreator } from "../../../Redux/VideoPlayerTimelineDetailReducer";
import { Bookmark, Note } from "../../../utils/Api/models/EvidenceModels";
import { EvidenceAgent } from "../../../utils/Api/ApiAgent";
import { CMTEntityRecord } from "../../../utils/Api/models/CommonModels";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import moment from "moment";
import { useTranslation } from "react-i18next";

type Timeline = {
  recording_start_point: number;
  recording_Start_point_ratio: number;
  recording_end_point: number;
  recording_end_point_ratio: number;
  recordingratio: number;
  bookmarks: any;
  notes: any;
  startdiff: number;
  video_duration_in_second: number;
  src: string;
  id: string;
  dataId: string;
  unitId: string;
  enableDisplay: boolean,
  indexNumberToDisplay: number,
  camera: string,
  timeOffset: number,
}

interface propsObject {
  stateObj: any
  EvidenceId: any
  timelinedetail: Timeline[]
  selectDropDown: any
  onClickBookmarkNote: any
  toasterMsgRef: any
}


const AssetDetailNotesandBookmarkBox = ({ stateObj, EvidenceId, timelinedetail, selectDropDown, onClickBookmarkNote, toasterMsgRef }: propsObject) => {
  const { t } = useTranslation<string>();
  const [description, setDescription] = React.useState<string>("");
  const [editDescription, setEditDescription] = React.useState<boolean>(false);
  const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
  const [enableOnSave, setEnableOnSave] = React.useState<boolean>(false);
  const [onSave, setOnSave] = React.useState<boolean>(false);
  const [isReadMore, setIsReadMore] = useState<boolean>(false);
  const [madeByName, setMadeByName] = React.useState<string>("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!editDescription){
      if(stateObj.description.length > 50 && !isReadMore){
        setDescription(stateObj.description.slice(0,49));
      }
      else{
        setDescription(stateObj.description);
      }
      setMadeByName(stateObj.madeBy);
    }
  });

  React.useEffect(() => {
    if (isReadMore) {
      setDescription(stateObj.description);
    }
  }, [isReadMore]);

  let inputRef: any;
  useEffect(() => {
    if (editDescription) {
      inputRef.focus();
      setIsReadMore(true);
    }
  }, [editDescription]);

  const onRemove = (del: boolean) => {
    if (del) {
      let tempData = JSON.parse(JSON.stringify(timelinedetail));
      if(selectDropDown == "notes"){
        tempData.forEach((x:any)=> 
          {if(x.dataId == stateObj.assetId){
              x.notes = x.notes.filter((y:any)=> y.id !== stateObj.id);
          }})
        dispatch(addTimelineDetailActionCreator(tempData));
      }
      else if(selectDropDown == "bookmarks"){
        tempData.forEach((x:any)=> 
          {if(x.dataId == stateObj.assetId){
              x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== stateObj.id);
          }})
        dispatch(addTimelineDetailActionCreator(tempData));
      }
    }
  };

  const onClickCancel = () => {
    setEditDescription(false);
    setEnableOnSave(false);
    setIsReadMore(false);
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };


  const onClickEnableEdit = async () => {
    await setIsReadMore(true);
    setEditDescription(true);
    setEnableOnSave(true);
  };

  const onUpdateDone = async () => {
    await setIsReadMore(false);
    setEditDescription(false);
    setEnableOnSave(false);
  }

  const onClickSave = () => {
    if (selectDropDown == "bookmarks") {
      onUpdateBookmark();
    } else if (selectDropDown == "notes") {
      onUpdateNote();
    }
  };

  const onUpdateBookmark = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      stateObj.assetId +
      "/Bookmarks/" +
      stateObj.id;
    const body: Bookmark = {
      id: stateObj.id,
      assetId: stateObj.assetId,
      bookmarkTime: stateObj.bookmarkTime,
      position: stateObj.position,
      description: description,
      madeBy: stateObj.madeBy,
      version: stateObj.version,
    };
    EvidenceAgent.updateBookmark(url, body)
      .then(() => {
        updateBookmarkNoteObjState();
        onUpdateDone();
        toasterMsgRef.current.showToaster({
          message: "Bookmark saved",
          variant: "Success",
          duration: 5000,
          clearButtton: true,
        });
      })
      .catch((err: any) => {
        onUpdateDone();
        toasterMsgRef.current.showToaster({
          message: "Bookmark error",
          variant: "error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };

  const onUpdateNote = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      stateObj.assetId +
      "/Notes/" +
      stateObj.id;
    const userIdBody: CMTEntityRecord = {
      id: "",
      cmtFieldValue: parseInt(localStorage.getItem("User Id") ?? "0"),
      record: [],
    };
    const body: Note = {
      assetId: stateObj.assetId,
      id: stateObj.id,
      position: stateObj.position,
      description: description,
      version: stateObj.version,
      noteTime: stateObj.noteTime,
      madeBy: stateObj.madeBy,
      userId: userIdBody,
    };
    EvidenceAgent.updateNote(url, body)
      .then(() => {
        updateBookmarkNoteObjState();
        onUpdateDone();
        toasterMsgRef.current.showToaster({
          message: "Note saved",
          variant: "Success",
          duration: 5000,
          clearButtton: true,
        });
      })
      .catch((err: any) => {
        onUpdateDone();
        toasterMsgRef.current.showToaster({
          message: "Note error",
          variant: "Error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };

  const updateBookmarkNoteObjState = () => {
    let tempData = JSON.parse(JSON.stringify(timelinedetail));
    if (selectDropDown == "notes") {
      tempData.forEach((x: any) => {
        if (x.dataId == stateObj.assetId) {
          x.notes.forEach((y: any) => {
            if (y.id == stateObj.id) {
              y.description = description;
            }
          });
        }
      })
      dispatch(addTimelineDetailActionCreator(tempData));
    }
    else if (selectDropDown == "bookmarks") {
      tempData.forEach((x: any) => {
        if (x.dataId == stateObj.assetId) {
          x.bookmarks.forEach((y: any) => {
            if (y.id == stateObj.id) {
              y.description = description;
            }
          });
        }
      })
      dispatch(addTimelineDetailActionCreator(tempData));
    }
  };

  const onClickDelete = () => {
    setIsOpenConfirmDailog(true);
  };

  const onDeleteBookmark = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      stateObj.assetId +
      "/Bookmarks/" +
      stateObj.id;
    EvidenceAgent.deleteBookmark(url)
      .then(() => {
        onRemove(true);
        toasterMsgRef.current.showToaster({
          message: "Bookmark Sucessfully Deleted",
          variant: "Success",
          duration: 5000,
          clearButtton: true,
        });
        setIsOpenConfirmDailog(false);
      })
      .catch((err: any) => {
        toasterMsgRef.current.showToaster({
          message: "Bookmark Delete Error",
          variant: "error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };

  const onDeleteNote = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      stateObj.assetId +
      "/Notes/" +
      stateObj.id;
    EvidenceAgent.deleteNote(url)
      .then(() => {
        onRemove(true);
        toasterMsgRef.current.showToaster({
          message: "Note Sucessfully Deleted",
          variant: "Success",
          duration: 5000,
          clearButtton: true,
        });
        setIsOpenConfirmDailog(false);
      })
      .catch((err: any) => {
        toasterMsgRef.current.showToaster({
          message: "Error Deleting Note",
          variant: "Error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };

  const onDeleteConfirm = async () => {
    if (selectDropDown == "bookmarks") {
      onDeleteBookmark();
    } else if (selectDropDown == "notes") {
      onDeleteNote();
    }
  };

  const handleReadMore = ()=>{
    setIsReadMore(true);
  }
  const handleReadLess = ()=>{
    setIsReadMore(false);
 }

  return (
    <>
      <div className="item_asset_detail_bookmarks">
        <a onClick={() => selectDropDown == "notes" ? onClickBookmarkNote(stateObj, 2) : onClickBookmarkNote(stateObj, 1)} >
          <div className="_bookmark_time_user_flex">
            <div className="_bookmark_time">
              {selectDropDown == "notes" ? moment(stateObj.noteTime).format("HH:MM:SS") : moment(stateObj.bookmarkTime).format("HH:MM:SS")}
            </div>
            <div className="_bookmark_users">
              {` ${t("Form")} : ${stateObj.madeBy}`}
            </div>
          </div>
          <div className="textToggler">
            <TextField
              type="text"
              placeholder={"Type your note here"}
              onChange={(e: any) => onChangeDescription(e)}
              value={description}
              multiline
              variant={"outlined"}
              inputProps={{ readOnly: !editDescription }}
              inputRef={(input: any) => {
                inputRef = input;
              }}
              fullWidth
            />
            {stateObj.description.length >= 50 && (description.length >= 50 ? <i className="fas fa-angle-up" onClick={() => handleReadLess() }> {t("Showless")} </i> : <i className="fas fa-angle-down" onClick={() => handleReadMore() }> {t("Read_More")} </i>)}
            {((selectDropDown == "bookmarks" && stateObj.madeBy == "User") || selectDropDown == "notes") && enableOnSave &&
              <div className="_field_action_container">
                <CRXButton onClick={onClickSave} disabled={onSave}>
                  <CRXTooltip
                    iconName="far fa-check"
                    placement="bottom"
                    title="done"
                    arrow={false}
                    className="_field_action_button"
                  ></CRXTooltip>
                </CRXButton>
                <CRXButton onClick={onClickCancel}>
                  <CRXTooltip
                    iconName="fas fa-times"
                    placement="bottom"
                    title="cancel"
                    arrow={false}
                    className="_field_action_button"
                  ></CRXTooltip>
                </CRXButton>
              </div>
            }
          </div>
          <div className="_side_panel_bookmark_menu">
            {stateObj.madeBy == "User" &&
              <div className="menu">
                <Menu
                  align="start"
                  viewScroll="initial"
                  direction="bottom"
                  position="auto"
                  arrow
                  menuButton={
                    <MenuButton>
                      <CRXTooltip
                        className="CRXTooltip_form"
                        iconName="far fa-ellipsis-v"
                        title="actions"
                        placement="right"
                      />
                    </MenuButton>}>
                  <MenuItem>

                    <div onClick={() => onClickDelete()}
                      className="crx-meu-content groupingMenu crx-spac">
                      <div className="crx-menu-icon">
                        <i className="fas fa-trash"></i>
                      </div>
                      <div className="_NB_menu_item">
                        {t("Delete")}
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem>
                    <div onClick={() => onClickEnableEdit()}
                      className="crx-meu-content groupingMenu crx-spac">
                      <div className="crx-menu-icon">
                        <i className="fas fa-edit"></i>
                      </div>
                      <div className="_NB_menu_item">
                        {t("Edit")}
                      </div>
                    </div>

                  </MenuItem>
                </Menu>
              </div>
            }
          </div>
        </a>
      </div>
      <CRXConfirmDialog
        setIsOpen={() => setIsOpenConfirmDailog(false)}
        onConfirm={onDeleteConfirm}
        className="__CRX_BookMarkNote_Delete_Modal__"
        title="Please Confirm"
        isOpen={IsOpenConfirmDailog}
        primary="Yes, delete"
        secondary="No, do not delete"
      >
        {
          <div className="crxUplockContent">
            You are attempting to <strong>delete</strong> the{" "}
            {selectDropDown}. You will not be able to undo this
            action.
            <p>
              Are you sure you would like to <strong>delete</strong> the{" "}
              {selectDropDown}?
            </p>
          </div>
        }
      </CRXConfirmDialog>
    </>
  );
};

export default AssetDetailNotesandBookmarkBox;

