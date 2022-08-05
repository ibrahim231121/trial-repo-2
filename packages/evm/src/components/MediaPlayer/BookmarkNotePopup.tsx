import { CRXButton } from "@cb/shared";
import { CRXConfirmDialog } from "@cb/shared";
import { TextField } from "@cb/shared";
import { red } from "@material-ui/core/colors";
import React, { useEffect } from "react";
import { EvidenceAgent } from "../../utils/Api/ApiAgent";
import { Bookmark, Note } from "../../utils/Api/models/EvidenceModels";
import "./BookmarkNotePopup.scss";


interface BookmarkNotePopupprops {
  bookmarkNotePopupObj: any
  bookmarkNotePopupArrObj: any
  setBookmarkNotePopupArrObj: any
  EvidenceId: any
  timelinedetail: any
  settimelinedetail: any
  toasterMsgRef: any
}


const BookmarkNotePopup = ({bookmarkNotePopupObj, bookmarkNotePopupArrObj, setBookmarkNotePopupArrObj, EvidenceId, timelinedetail, settimelinedetail, toasterMsgRef}: BookmarkNotePopupprops) => {
  const [description, setDescription] = React.useState<string>("");
  const [editDescription, setEditDescription] = React.useState<boolean>(false);
  const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
  const [enableOnSave, setEnableOnSave] = React.useState<boolean>(false);
  const [onSave, setOnSave] = React.useState<boolean>(true);
  const [showButton, setShowButton] = React.useState<boolean>(false);

  React.useEffect(() => {
    setDescription(bookmarkNotePopupObj.description);
  }, []);

  React.useEffect(() => {
    if(bookmarkNotePopupObj.description == description){
      setOnSave(true)
    }
    else{
      setOnSave(false)
    }
  }, [description]);

  let inputRef: any;
  useEffect(() => {
    if (editDescription) {
      inputRef.focus();
    }
  }, [editDescription]);

  const onRemove = (del : boolean) => {
    if(del){
      let tempData = [...timelinedetail];
      if(bookmarkNotePopupObj.objtype == "Note"){
        tempData.forEach((x:any)=> 
          {if(x.dataId == bookmarkNotePopupObj.assetId){
              x.notes = x.notes.filter((y:any)=> y.id !== bookmarkNotePopupObj.id);
          }})
        settimelinedetail([...tempData]);
      }
      else if(bookmarkNotePopupObj.objtype == "Bookmark"){
        tempData.forEach((x:any)=> 
          {if(x.dataId == bookmarkNotePopupObj.assetId){
              x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkNotePopupObj.id);
          }})
        settimelinedetail([...tempData]);
      }
    }
    let temp :any[] = [...bookmarkNotePopupArrObj];
    let newBookmarkNotePopupArrObj = temp.filter((x:any) => !(x.id == bookmarkNotePopupObj.id && x.objtype == bookmarkNotePopupObj.objtype));
    setBookmarkNotePopupArrObj(newBookmarkNotePopupArrObj);
  }

  const onClickCancel = () => {
    setEditDescription(false);
    setEnableOnSave(false);
  }

  const onChangeDescription = (e : any) => {
    
    setDescription(e.target.value);
  }

  const mouseInPopup = () => {
    if(!(bookmarkNotePopupObj.madeBy == "System" && bookmarkNotePopupObj.objtype == "Bookmark")){
      setShowButton(true);
    }
  }

  const mouseOutPopup = () => {
    setShowButton(false);
    setEditDescription(false);
    setEnableOnSave(false);
  }

  const onClickEnableEdit = () => {
    setEditDescription(true);
    setEnableOnSave(true);
  }

  const onClickSave = () => {
    if(bookmarkNotePopupObj.objtype == "Bookmark"){
      onUpdateBookmark();
    }
    else if(bookmarkNotePopupObj.objtype == "Note")
    {
      onUpdateNote();
    }
  }

  const onUpdateBookmark = () => {
    const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmarkNotePopupObj.assetId+"/Bookmarks/"+bookmarkNotePopupObj.id;
    const body : Bookmark = {
        id: bookmarkNotePopupObj.id,
        assetId: bookmarkNotePopupObj.assetId,
        bookmarkTime: bookmarkNotePopupObj.bookmarkTime,
        position: bookmarkNotePopupObj.position,
        description: description,
        madeBy: bookmarkNotePopupObj.madeBy,
        version: bookmarkNotePopupObj.version
    };
    EvidenceAgent.updateBookmark(url, body).then(() => {
      updateBookmarkNotePopupObjState();
      toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});        
    })
    .catch((err: any) => {
      toasterMsgRef.current.showToaster({message: "Bookmark Update Error", variant: "error", duration: 5000, clearButtton: true});
      console.error(err);
    });
  }

  const onUpdateNote = () => {
    const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmarkNotePopupObj.assetId+"/Notes/"+bookmarkNotePopupObj.id;
    const body: Note = {
        assetId: bookmarkNotePopupObj.assetId, 
        id: bookmarkNotePopupObj.id,
        position: bookmarkNotePopupObj.position,
        description: description,
        version: bookmarkNotePopupObj.version,
        noteTime: bookmarkNotePopupObj.noteTime,
        madeBy: bookmarkNotePopupObj.madeBy,
    };
    EvidenceAgent.updateNote(url, body).then(() => {
      updateBookmarkNotePopupObjState();
      toasterMsgRef.current.showToaster({message: "Note Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});
    })
    .catch((err: any) => {
      toasterMsgRef.current.showToaster({message: "Error Note Update", variant: "Error", duration: 5000, clearButtton: true});
      console.error(err);
    });
  }

  const updateBookmarkNotePopupObjState = () => {
    let tempData = [...timelinedetail];
    if(bookmarkNotePopupObj.objtype == "Note"){
      tempData.forEach((x:any)=> 
        {if(x.dataId == bookmarkNotePopupObj.assetId){
          x.notes.forEach((y:any)=> 
            {if(y.id == bookmarkNotePopupObj.id){
              y.description = description;
            }});
        }})
      settimelinedetail([...tempData]);
    }
    else if(bookmarkNotePopupObj.objtype == "Bookmark"){
      tempData.forEach((x:any)=> 
        {if(x.dataId == bookmarkNotePopupObj.assetId){
          x.bookmarks.forEach((y:any)=> 
            {if(y.id == bookmarkNotePopupObj.id){
              y.description = description;
            }});
        }})
      settimelinedetail([...tempData]);
    }
    let tempData1 = [...bookmarkNotePopupArrObj];
    tempData1.forEach((x:any)=> 
      {if(x.id == bookmarkNotePopupObj.id && x.objtype == bookmarkNotePopupObj.objtype ){
        x.description = description;
      }})
    setBookmarkNotePopupArrObj(tempData1);
  }

  const onClickDelete = () => {
    setIsOpenConfirmDailog(true);
  }

  const onDeleteBookmark = () => {
    const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmarkNotePopupObj.assetId+"/Bookmarks/"+bookmarkNotePopupObj.id;
    EvidenceAgent.deleteBookmark(url).then(() => {
      onRemove(true);
      toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
      setIsOpenConfirmDailog(false);
    })
    .catch((err: any) => {
        toasterMsgRef.current.showToaster({message: "Bookmark Delete Error", variant: "error", duration: 5000, clearButtton: true});
        console.error(err);
    });
  }

  const onDeleteNote = () => {
    const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmarkNotePopupObj.assetId+"/Notes/"+bookmarkNotePopupObj.id;
    EvidenceAgent.deleteNote(url).then(() => {
      onRemove(true);
      toasterMsgRef.current.showToaster({message: "Note Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
      setIsOpenConfirmDailog(false);
    })
    .catch((err: any) => {
      toasterMsgRef.current.showToaster({message: "Error Deleting Note", variant: "Error", duration: 5000, clearButtton: true});
      console.error(err);
    });
  }

  const onDeleteConfirm = async () => {
    if(bookmarkNotePopupObj.objtype == "Bookmark"){
      onDeleteBookmark();
    }
    else if(bookmarkNotePopupObj.objtype == "Note")
    {
      onDeleteNote();
    }
  }

  return (
    <>
      <div id={"BookmarkNote-Popup"}  className="BookmarkNotePopup" onMouseOver={() => mouseInPopup()} onMouseLeave={() => mouseOutPopup()}>
        <div className="Popup-header">
          <div id={"Popup-Icon"}><i className={bookmarkNotePopupObj.objtype == "Bookmark" ? "fas fa-bookmark" : "fas fa-comment-alt-plus"}></i></div>
          <div>{bookmarkNotePopupObj.objtype}</div>
          {showButton && <CRXButton id="Popup-Remove" onClick={() => onRemove(false)}>
            X
          </CRXButton>}
        </div>
        <div className="Popup-body" >
          {showButton &&<CRXButton id="Popup-Delete" className="popupBtnNote" onClick={onClickDelete}>
            <i className="fa fa-trash" aria-hidden="true"></i>
          </CRXButton>}
          <div id={"Popup-Timer"}>{bookmarkNotePopupObj.timerValue}</div>
          {showButton &&<CRXButton id="Popup-Edit" className="popupBtnNote" onClick={onClickEnableEdit}>
            <i className="fa fa-edit"></i>
          </CRXButton>}
          <TextField
            type="text" 
            placeholder={"searchFieldPlaceholder"} 
            onChange={(e:any) => onChangeDescription(e)}
            value={description} 
            variant={"outlined"}
            inputProps={
              { readOnly: !editDescription, }
            }
            inputRef={(input:any) => {
              inputRef = input;
            }} 
            fullWidth 
          />
          <div className="btnCheck">
          {enableOnSave && <CRXButton onClick={onClickSave} disabled={onSave}>
            <i className="fa fa-check"></i>
          </CRXButton>}
          {enableOnSave && <CRXButton onClick={onClickCancel}>
            X
          </CRXButton>}
          </div>
   
        </div>
      </div>
      <CRXConfirmDialog
          setIsOpen={() => setIsOpenConfirmDailog(false)}
          onConfirm={onDeleteConfirm}
          title="Please Confirm"
          isOpen={IsOpenConfirmDailog}
          primary="Yes, Delete"
          secondary="No, Close"
          >
          {
              <div className="crxUplockContent">
              You are attempting to <strong>Delete</strong> the{" "}
              <strong>{bookmarkNotePopupObj.objtype}</strong>. If you close the form, any changes
              you've made will not be saved. You will not be able to undo this
              action.
              <p>
                  Are you sure like to <strong>Delete</strong> the {bookmarkNotePopupObj.objtype}?
              </p>
              </div>
          }
      </CRXConfirmDialog>
    </>
  );
};
export default BookmarkNotePopup;
