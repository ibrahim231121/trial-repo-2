import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { CRXAlert } from '@cb/shared';
import { TextField } from '@cb/shared';
import "./VideoPlayer.scss";
import { CRXCheckBox } from '@cb/shared';
import moment from 'moment';
import { CRXConfirmDialog } from '@cb/shared';
import { EvidenceAgent } from '../../utils/Api/ApiAgent';
import { Note } from '../../utils/Api/models/EvidenceModels';
import { CMTEntityRecord } from '../../utils/Api/models/CommonModels';
import { useDispatch } from 'react-redux';
import { addTimelineDetailActionCreator } from '../../Redux/VideoPlayerTimelineDetailReducer';

type VideoPlayerNoteProps = {
    openNoteForm: boolean;
    editNoteForm: boolean
    setopenNoteForm: any;
    seteditNoteForm: any;
    AssetData: any;
    EvidenceId: any;
    NotetimePositon?: number;
    note: any;
    noteAssetId?: number;
    toasterMsgRef: any;
    timelinedetail: any;
};

const VideoPlayerNote: React.FC<VideoPlayerNoteProps> = React.memo((props) => {
    const {openNoteForm,editNoteForm,setopenNoteForm,seteditNoteForm,AssetData,EvidenceId,NotetimePositon,note,noteAssetId,toasterMsgRef,timelinedetail} = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [alert, setAlert] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const [alertType, setAlertType] = useState<string>('inline');
    const [errorType, setErrorType] = useState<string>('error');
    const alertRef = useRef(null);
    const [onSave, setOnSave] = useState(true);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [isSuccess, setIsSuccess] = React.useState({
        success: false,
        SuccessType: "",
    });
    const [description, setdescription] = React.useState(editNoteForm ? note.description : "");
    const dispatch = useDispatch();

    const [noteobj, setnoteobj] = React.useState<any>({
        assetId: editNoteForm ? noteAssetId : AssetData.dataId,
        createdOn: "",
        description: "",
        id: 0,
        madeBy: "",
        modifiedOn: null,
        noteTime: "",
        position: 0,
        version: ""
    });

    React.useEffect(() => {
        setOpenModal(openNoteForm)
    }, []);

    React.useEffect(() => {
        if(isSuccess.success){
            let tempData = JSON.parse(JSON.stringify(timelinedetail));
            if(isSuccess.SuccessType == "Add"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == noteobj.assetId){
                                x.notes = [...x.notes, noteobj]
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setOpenModal(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
            else if(isSuccess.SuccessType == "Update"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == noteobj.assetId){
                                x.notes = x.notes.filter((y:any)=> y.id !== noteobj.id);
                                x.notes = [...x.notes, noteobj];
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setOpenModal(false);
                seteditNoteForm(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
            else if(isSuccess.SuccessType == "Delete"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == noteobj.assetId){
                                x.notes = x.notes.filter((y:any)=> y.id !== noteobj.id);
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setOpenModal(false);
                seteditNoteForm(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
        }
    }, [isSuccess]);

    useEffect(() => {
        description.length > 0 ? setOnSave(false) : setOnSave(true);
    }, [description]);

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenModal(false);
        setopenNoteForm(false);
        seteditNoteForm(false);
    };

    const onAdd = async () => {
        if(description.length > 0){
            await AddNote();
        }
    };

    const AddNote = async () => {
        const AssetId = AssetData.dataId;
        const userIdBody: CMTEntityRecord = {
            id: "",
            cmtFieldValue: parseInt(localStorage.getItem('User Id') ?? "0"),
            record: []
          };
        const body : Note = {
            id: 0,
            assetId: AssetId,
            noteTime: new Date(),
            position: NotetimePositon ?? 0,
            description: description,
            madeBy: "User",
            version: "",
            userId: userIdBody
        };
        setopenNoteForm(false);
        const noteaddurl = "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Notes";
        EvidenceAgent.addNote(noteaddurl, body).then((response: any) => {
            setnoteobj({ ...noteobj, noteTime: body.noteTime, description: body.description, id: response, madeBy: body.madeBy, position: body.position });
            setIsSuccess({...isSuccess, success: true, SuccessType: "Add"});
            toasterMsgRef.current.showToaster({message: "Note Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
        })
        .catch((e:any) =>{
            setAlert(true);
            setResponseError(
                "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
            );
            setResponseError(e);
        })
    }

    

    const onUpdate = async () => {
        const url = "/Evidences/"+EvidenceId+"/Assets/"+note.assetId+"/Notes/"+note.id;
        const userIdBody: CMTEntityRecord = {
            id: "",
            cmtFieldValue: parseInt(localStorage.getItem('User Id') ?? "0"),
            record: []
          };
        const body: Note = {
            assetId: note.assetId, 
            id: note.id,
            position: note.position,
            description: description,
            version: note.version,
            noteTime: note.noteTime,
            madeBy: note.madeBy,
            userId: userIdBody
        };
        setopenNoteForm(false);
        EvidenceAgent.updateNote(url, body).then(() => {
            setnoteobj({ ...noteobj, noteTime: note.noteTime, description: body.description, id: body.id, madeBy: note.madeBy, position: body.position, version: body.version, createdOn: note.createdOn, modifiedOn: note.modifiedOn })
            setIsSuccess({...isSuccess, success: true, SuccessType: "Update"});
            toasterMsgRef.current.showToaster({message: "Note Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});
        })
        .catch((err: any) => {
            setAlert(true);
            setResponseError(
                "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
            );
            console.error(err);
        });
    };

    const onDelete = async () => {
        const url = "/Evidences/"+EvidenceId+"/Assets/"+note.assetId+"/Notes/"+note.id;
        setopenNoteForm(false);
        EvidenceAgent.deleteNote(url).then(() => {
            setnoteobj({ ...noteobj, id: note.id })
            setIsSuccess({...isSuccess, success: true, SuccessType: "Delete"})
            toasterMsgRef.current.showToaster({message: "Note Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
        })
        .catch(() => {
            setAlert(true);
            setResponseError(
                "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
            );
        });
    };

    const onSubmit = async (e: any) => {
        setResponseError('');
        setAlert(false);
        if(editNoteForm){
            await onUpdate();
        }else{
            await onAdd();
        }
    };

    const onDeleteClick = async () => {
        setIsOpenConfirmDailog(true);
    };
    const onDeleteConfirm = async () => {
        setResponseError('');
        setAlert(false);
        await onDelete();
    };

    const checkDescription = () => {
        if (!description) {
            setdescriptionErr('Description is required');
        }
        else {
            setdescriptionErr('');
        }
    }
    


    return (
        <div className='videoPlayerNote'>
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
                    <strong>Note</strong>. If you close the form, any changes
                    you've made will not be saved. You will not be able to undo this
                    action.
                    <p>
                        Are you sure like to <strong>Delete</strong> the Note?
                    </p>
                    </div>
                }
            </CRXConfirmDialog>
            <CRXModalDialog
                maxWidth="gl"
                title="Notes"
                className={'CRXModal ___CRXBookMark__ ___CRXBookNote__ '}
                modelOpen={openModal}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className={` ${alert == true ? "__CRXAlertDes__" : ""}`}>
                    <CRXAlert
                        ref={alertRef}
                        message={responseError}
                        className='crxAlertNoteEditForm'
                        alertType={alertType}
                        type={errorType}
                        open={alert}
                        setShowSucess={() => null}
                    />
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>
                            <TextField
                                error={!!descriptionErr}
                                errorMsg={descriptionErr}
                                value={description}
                                label='Description'
                                multiline
                                className='description-input'
                                required={true}
                                onChange={(e: any) => setdescription(e.target.value)}
                                onBlur={checkDescription}
                            />
                        </div>
                        <div className='categoryModalFooter CRXFooter'>
                            <CRXButton className='primary' onClick={onSubmit} disabled={onSave}>
                                Save
                            </CRXButton>
                            <CRXButton className='secondary' onClick={handleClose}>
                                Cancel
                            </CRXButton>
                            {editNoteForm && <CRXButton className='secondary' onClick={onDeleteClick} style={{ left: "250px"}}>
                                Delete
                            </CRXButton>}
                        </div>
                    </div>
                </div>


            </CRXModalDialog>
        </div>
    );
});

export default VideoPlayerNote;