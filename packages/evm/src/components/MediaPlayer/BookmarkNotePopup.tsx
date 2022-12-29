import { CRXButton } from "@cb/shared";
import { CRXConfirmDialog } from "@cb/shared";
import { TextField, CRXTooltip } from "@cb/shared";
import { red } from "@material-ui/core/colors";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTimelineDetailActionCreator } from "../../Redux/VideoPlayerTimelineDetailReducer";
import { EvidenceAgent } from "../../utils/Api/ApiAgent";
import { CMTEntityRecord } from "../../utils/Api/models/CommonModels";
import { Bookmark, Note } from "../../utils/Api/models/EvidenceModels";
import "./BookmarkNotePopup.scss";

interface BookmarkNotePopupprops {
  bookmarkNotePopupObj: any
  bookmarkNotePopupArrObj: any
  setBookmarkNotePopupArrObj: any
  EvidenceId: any
  timelinedetail: any
  toasterMsgRef: any
  setIsEditBookmarkNotePopup: any
}

const BookmarkNotePopup = ({
  bookmarkNotePopupObj,
  bookmarkNotePopupArrObj,
  setBookmarkNotePopupArrObj,
  EvidenceId,
  timelinedetail,
  toasterMsgRef,
  setIsEditBookmarkNotePopup
}: BookmarkNotePopupprops) => {
  const [description, setDescription] = React.useState<string>("");
  const [editDescription, setEditDescription] = React.useState<boolean>(false);
  const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
  const [enableOnSave, setEnableOnSave] = React.useState<boolean>(false);
  const [onSave, setOnSave] = React.useState<boolean>(false);
  const [showButton, setShowButton] = React.useState<boolean>(false);
  const [objTypeDescription, setObjTypeDescription] = React.useState<string>("");
  const [noteUserName, setNoteUserName] = React.useState<string>("");
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false)
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!editDescription) {
      setDescription(bookmarkNotePopupObj.description);
    }
  });

  React.useEffect(() => {
    if (bookmarkNotePopupObj.objtype == "Note") {
      let listOfKeyValue = bookmarkNotePopupObj?.userId?.record;
      if (listOfKeyValue && listOfKeyValue.length > 0) {
        listOfKeyValue.forEach((x: any) => {
          if (x.key == "UserName") {
            let username = bookmarkNotePopupObj.objtype + " from: ";
            setObjTypeDescription(username);
            setNoteUserName(x.value);
          }
        });
      } else {
        let username = bookmarkNotePopupObj.objtype + " from: ";
        setObjTypeDescription(username);
      }
    }
  }, []);

  React.useEffect(() => {
    if (bookmarkNotePopupObj.description == description) {
      setOnSave(true);
    } else {
      setOnSave(false);
    }
  }, [description]);

  let inputRef: any;
  useEffect(() => {
    setIsEditBookmarkNotePopup(editDescription);
    if (editDescription) {
      inputRef.focus();
    }
  }, [editDescription]);

  const onRemove = (del: boolean) => {
    if (del) {
      let tempData = JSON.parse(JSON.stringify(timelinedetail));
      if (bookmarkNotePopupObj.objtype == "Note") {
        tempData.forEach((x: any) => {
          if (x.dataId == bookmarkNotePopupObj.assetId) {
            x.notes = x.notes.filter((y: any) => y.id !== bookmarkNotePopupObj.id);
          }
        })
        dispatch(addTimelineDetailActionCreator(tempData));
      }
      else if (bookmarkNotePopupObj.objtype == "Bookmark") {
        tempData.forEach((x: any) => {
          if (x.dataId == bookmarkNotePopupObj.assetId) {
            x.bookmarks = x.bookmarks.filter((y: any) => y.id !== bookmarkNotePopupObj.id);
          }
        })
        dispatch(addTimelineDetailActionCreator(tempData));
      }
    }
    let temp: any[] = [...bookmarkNotePopupArrObj];
    let newBookmarkNotePopupArrObj = temp.filter(
      (x: any) =>
        !(
          x.id == bookmarkNotePopupObj.id &&
          x.objtype == bookmarkNotePopupObj.objtype
        )
    );
    setBookmarkNotePopupArrObj(newBookmarkNotePopupArrObj);
  };

  const onClickCancel = () => {
    setEditDescription(false);
    setEnableOnSave(false);
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };

  const mouseInPopup = () => {
    if (
      !(
        bookmarkNotePopupObj.madeBy == "System" &&
        bookmarkNotePopupObj.objtype == "Bookmark"
      )
    ) {
      setShowButton(true);
    }
  };

  const mouseOutPopup = () => {
    setShowButton(false);
    setEditDescription(false);
    setEnableOnSave(false);
  };

  const onClickEnableEdit = () => {
    setEditDescription(true);
    setEnableOnSave(true);
  };

  const onClickSave = () => {
    setEditDescription(false);
    setEnableOnSave(false);
    if (bookmarkNotePopupObj.objtype == "Bookmark") {
      onUpdateBookmark();
    } else if (bookmarkNotePopupObj.objtype == "Note") {
      onUpdateNote();
    }
  };

  const onUpdateBookmark = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      bookmarkNotePopupObj.assetId +
      "/Bookmarks/" +
      bookmarkNotePopupObj.id;
    const body: Bookmark = {
      id: bookmarkNotePopupObj.id,
      assetId: bookmarkNotePopupObj.assetId,
      bookmarkTime: bookmarkNotePopupObj.bookmarkTime,
      position: bookmarkNotePopupObj.position,
      description: description,
      madeBy: bookmarkNotePopupObj.madeBy,
      version: bookmarkNotePopupObj.version,
    };
    EvidenceAgent.updateBookmark(url, body)
      .then(() => {
        updateBookmarkNotePopupObjState();
        toasterMsgRef.current.showToaster({
          message: "Bookmark saved",
          variant: "success",
          duration: 5000,
          clearButtton: true,
        });
      })
      .catch((err: any) => {
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
      bookmarkNotePopupObj.assetId +
      "/Notes/" +
      bookmarkNotePopupObj.id;
    const userIdBody: CMTEntityRecord = {
      id: "",
      cmtFieldValue: parseInt(localStorage.getItem("User Id") ?? "0"),
      record: [],
    };
    const body: Note = {
      assetId: bookmarkNotePopupObj.assetId,
      id: bookmarkNotePopupObj.id,
      position: bookmarkNotePopupObj.position,
      description: description,
      version: bookmarkNotePopupObj.version,
      noteTime: bookmarkNotePopupObj.noteTime,
      madeBy: bookmarkNotePopupObj.madeBy,
      userId: userIdBody,
    };
    EvidenceAgent.updateNote(url, body)
      .then(() => {
        updateBookmarkNotePopupObjState();
        toasterMsgRef.current.showToaster({
          message: "Note saved",
          variant: "success",
          duration: 5000,
          clearButtton: true,
        });
      })
      .catch((err: any) => {
        toasterMsgRef.current.showToaster({
          message: "Note error",
          variant: "error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };

  const updateBookmarkNotePopupObjState = () => {
    let tempData = JSON.parse(JSON.stringify(timelinedetail));
    if (bookmarkNotePopupObj.objtype == "Note") {
      tempData.forEach((x: any) => {
        if (x.dataId == bookmarkNotePopupObj.assetId) {
          x.notes.forEach((y: any) => {
            if (y.id == bookmarkNotePopupObj.id) {
              y.description = description;
            }
          });
        }
      })
      dispatch(addTimelineDetailActionCreator(tempData));
    }
    else if (bookmarkNotePopupObj.objtype == "Bookmark") {
      tempData.forEach((x: any) => {
        if (x.dataId == bookmarkNotePopupObj.assetId) {
          x.bookmarks.forEach((y: any) => {
            if (y.id == bookmarkNotePopupObj.id) {
              y.description = description;
            }
          });
        }
      })
      dispatch(addTimelineDetailActionCreator(tempData));
    }
    let tempData1 = [...bookmarkNotePopupArrObj];
    tempData1.forEach((x: any) => {
      if (
        x.id == bookmarkNotePopupObj.id &&
        x.objtype == bookmarkNotePopupObj.objtype
      ) {
        x.description = description;
      }
    });
    setBookmarkNotePopupArrObj(tempData1);
  };

  const onClickDelete = () => {
    setIsOpenConfirmDailog(true);
  };

  const onDeleteBookmark = () => {
    const url =
      "/Evidences/" +
      EvidenceId +
      "/Assets/" +
      bookmarkNotePopupObj.assetId +
      "/Bookmarks/" +
      bookmarkNotePopupObj.id;
    EvidenceAgent.deleteBookmark(url)
      .then(() => {
        onRemove(true);
        toasterMsgRef.current.showToaster({
          message: "Bookmark Sucessfully Deleted",
          variant: "success",
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
      bookmarkNotePopupObj.assetId +
      "/Notes/" +
      bookmarkNotePopupObj.id;
    EvidenceAgent.deleteNote(url)
      .then(() => {
        onRemove(true);
        toasterMsgRef.current.showToaster({
          message: "Note Sucessfully Deleted",
          variant: "success",
          duration: 5000,
          clearButtton: true,
        });
        setIsOpenConfirmDailog(false);
      })
      .catch((err: any) => {
        toasterMsgRef.current.showToaster({
          message: "Error Deleting Note",
          variant: "error",
          duration: 5000,
          clearButtton: true,
        });
        console.error(err);
      });
  };
  useEffect(() => {
    if (confirmDelete) {
      onDeleteConfirm()
    }
  }, [confirmDelete]);



  const onDeleteConfirm = async () => {
    setIsOpenConfirmDailog(false);
    setEditDescription(false);
    setEnableOnSave(false);
    if (bookmarkNotePopupObj.objtype == "Bookmark") {
      onDeleteBookmark();
    } else if (bookmarkNotePopupObj.objtype == "Note") {
      onDeleteNote();
    }
  };

  const bookmarkNotePopup =
    bookmarkNotePopupObj.objtype == "Note" ? "__CRX_Note_Popup__" : "";

  return (
    <>
      <div
        id={"BookmarkNote-Popup"}
        className={`BookmarkNotePopup ${bookmarkNotePopup}`}
        onMouseOver={() => mouseInPopup()}
        onMouseLeave={() => mouseOutPopup()}
      >
        <div className="Popup-header">
          <div id={"Popup-Icon"}>
            <i
              className={
                bookmarkNotePopupObj.objtype == "Bookmark"
                  ? "fas fa-bookmark"
                  : "fas fa-comment-alt-plus"
              }
            ></i>
          </div>
          <div className="__bookmark_Note_Title__">
            <span>
              {bookmarkNotePopupObj.objtype == "Bookmark"
                ? bookmarkNotePopupObj.objtype
                : objTypeDescription}
            </span>
            {bookmarkNotePopupObj.objtype == "Note" ? (
              <span>{noteUserName}</span>
            ) : (
              ""
            )}
          </div>
          {showButton && (
            <CRXButton
              id="Popup-Remove"
              className="__CRX_Remore_Popup__"
              onClick={() => onRemove(false)}
            >
              <CRXTooltip
                iconName="icon icon-cross2"
                placement="bottom"
                title="close"
                arrow={false}
              >
              </CRXTooltip>
            </CRXButton>
          )}
        </div>
        <div className="Popup-body">
          <div className="__CRX_Delete_Edit_Btn__">
            {showButton && (
              <CRXButton
                id="Popup-Delete"
                className="popupBtnNote"
                onClick={onClickDelete}
              >
                <CRXTooltip
                  className="__CRX_BookNote_Tooltip__"
                  iconName="fas fa-trash-alt"
                  placement="bottom"
                  title="delete"
                  arrow={false}
                ></CRXTooltip>
              </CRXButton>
            )}
            <div id={"Popup-Timer"}>{bookmarkNotePopupObj.timerValue}</div>
            {showButton && (
              <CRXButton
                id="Popup-Edit"
                className="popupBtnNote"
                onClick={onClickEnableEdit}
              >
                {" "}
                <CRXTooltip
                  iconName="fas fa-pencil"
                  placement="bottom"
                  title="edit"
                  arrow={false}
                ></CRXTooltip>
              </CRXButton>
            )}
          </div>
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
          <div className="btnCheck">
            {enableOnSave && (
              <CRXButton onClick={onClickCancel}>
                <CRXTooltip
                  iconName="icon icon-cross2"
                  placement="bottom"
                  title="cancel"
                  arrow={false}
                ></CRXTooltip>
              </CRXButton>
            )}
            {enableOnSave && (
              <CRXButton onClick={onClickSave} disabled={onSave}>
                <CRXTooltip
                  iconName="far fa-check"
                  placement="bottom"
                  title="done"
                  arrow={false}
                ></CRXTooltip>
              </CRXButton>
            )}
          </div>
        </div>
      </div>
      <CRXConfirmDialog
        setIsOpen={() => setIsOpenConfirmDailog(false)}
        onConfirm={() => { setConfirmDelete(true) }}
        className="__CRX_BookMarkNote_Delete_Modal__"
        title="Please Confirm"
        isOpen={IsOpenConfirmDailog}
        primary="Yes, delete"
        secondary="No, do not delete"
      >
        {
          <div className="crxUplockContent">
            You are attempting to <strong>delete</strong> the{" "}
            {bookmarkNotePopupObj.objtype}. You will not be able to undo this
            action.
            <p>
              Are you sure you would like to <strong>delete</strong> the{" "}
              {bookmarkNotePopupObj.objtype}?
            </p>
          </div>
        }
      </CRXConfirmDialog>
    </>
  );
};
export default BookmarkNotePopup;
