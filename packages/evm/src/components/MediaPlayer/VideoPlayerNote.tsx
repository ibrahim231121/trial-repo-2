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
import { AssetLogType, Note } from '../../utils/Api/models/EvidenceModels';
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
    saveLogs: any
};

const VideoPlayerNote: React.FC<VideoPlayerNoteProps> = React.memo((props) => {
    const {openNoteForm,editNoteForm,setopenNoteForm,seteditNoteForm,AssetData,EvidenceId,NotetimePositon,note,noteAssetId,toasterMsgRef,timelinedetail,saveLogs} = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [onSave, setOnSave] = useState(true);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [description, setdescription] = React.useState(editNoteForm ? note.description : "");
    const dispatch = useDispatch();

    const [ currentAssetId, setcurrentAssetId ] = React.useState<any>(editNoteForm ? noteAssetId : AssetData.dataId);

    React.useEffect(() => {
        setOpenModal(openNoteForm)
    }, []);

    const setNotesInTimelineDetail = (SuccessType: any, NTObj: any) => {
        let tempData = JSON.parse(JSON.stringify(timelinedetail));
        if(SuccessType == "Add"){
            tempData.forEach((x:any)=> 
                        {if(x.dataId == NTObj.assetId){
                            x.notes = [...x.notes, NTObj]
                        }})
            dispatch(addTimelineDetailActionCreator([...tempData]));
            setOpenModal(false);
        }
        else if(SuccessType == "Update"){
            tempData.forEach((x:any)=> 
                        {if(x.dataId == NTObj.assetId){
                            x.notes = x.notes.filter((y:any)=> y.id !== NTObj.id);
                            x.notes = [...x.notes, NTObj];
                        }})
            dispatch(addTimelineDetailActionCreator([...tempData]));
            setOpenModal(false);
            seteditNoteForm(false);
        }
        else if(SuccessType == "Delete"){
            tempData.forEach((x:any)=> 
                        {if(x.dataId == NTObj.assetId){
                            x.notes = x.notes.filter((y:any)=> y.id !== NTObj.id);
                        }})
            dispatch(addTimelineDetailActionCreator([...tempData]));
            setOpenModal(false);
            seteditNoteForm(false);
        }
    };

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
        if((NotetimePositon ?? 0) > 0)
        {
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
                user: userIdBody
            };
            setopenNoteForm(false);
            const noteaddurl = "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Notes";
            EvidenceAgent.addNote(noteaddurl, body).then((response: any) => {
                let responseObj = {
                    assetId: currentAssetId,
                    createdOn: "",
                    description: body.description,
                    id: response,
                    madeBy: body.madeBy,
                    modifiedOn: null,
                    noteTime: body.noteTime,
                    position: body.position,
                    version: ""
                }
                setNotesInTimelineDetail("Add", responseObj);
                toasterMsgRef.current.showToaster({message: "Note Sucessfully Saved", variant: "success", duration: 5000, clearButtton: true});
                saveLogs(Number(currentAssetId), "Note Taken");
            })
            .catch((e:any) =>{
                toasterMsgRef.current.showToaster({message: "Some error occured", variant: "error", duration: 5000, clearButtton: true});
            })
        }
        else
        {
            setopenNoteForm(false);
            toasterMsgRef.current.showToaster({message: "Current time should be greater than 0", variant: "error", duration: 5000, clearButtton: true});
        }
    }

    

    const onUpdate = async () => {
        if((NotetimePositon ?? 0) > 0)
        {
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
                user: userIdBody
            };
            setopenNoteForm(false);
            EvidenceAgent.updateNote(url, body).then(() => {
                let responseObj = {
                    assetId: currentAssetId,
                    createdOn: note.createdOn,
                    description: body.description,
                    id: body.id,
                    madeBy: note.madeBy,
                    modifiedOn: note.modifiedOn,
                    noteTime: note.noteTime,
                    position: body.position,
                    version: body.version
                }
                setNotesInTimelineDetail("Update", responseObj);
                toasterMsgRef.current.showToaster({message: "Note Sucessfully Updated", variant: "success", duration: 5000, clearButtton: true});
                saveLogs(body.assetId, "Note Update");
            })
            .catch((err: any) => {
                toasterMsgRef.current.showToaster({message: "Some error occured", variant: "error", duration: 5000, clearButtton: true});

            });
        }
        else
        {
            setopenNoteForm(false);
            toasterMsgRef.current.showToaster({message: "Current time should be greater than 0", variant: "error", duration: 5000, clearButtton: true});
        }
    };

    const onDelete = async () => {
        if((NotetimePositon ?? 0) > 0)
        {
            const url = "/Evidences/"+EvidenceId+"/Assets/"+note.assetId+"/Notes/"+note.id;
            setopenNoteForm(false);
            EvidenceAgent.deleteNote(url).then(() => {
                let responseObj = {
                    assetId: currentAssetId,
                    id: note.id
                }
                setNotesInTimelineDetail("Delete", responseObj);
                toasterMsgRef.current.showToaster({message: "Note Sucessfully Deleted", variant: "success", duration: 5000, clearButtton: true});
            })
            .catch(() => {
                toasterMsgRef.current.showToaster({message: "Some error occured", variant: "error", duration: 5000, clearButtton: true});

            });
        }
        else
        {
            setopenNoteForm(false);
            toasterMsgRef.current.showToaster({message: "Current time should be greater than 0", variant: "error", duration: 5000, clearButtton: true});
        }
    };

    const onSubmit = async (e: any) => {
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
                <div>
                    <div className='modalEditCrx'>
                        {editNoteForm && <CRXAlert
                          className={"crx-alert-notification file-upload"}
                          message={"sucess.msg"}
                          type="info"
                          open={editNoteForm}
                          alertType="inline"
                          persist={true}
                          showCloseButton={false}
                          children={
                            <div>
                                Note already exists at this time
                            </div>
                          }
                        />}
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
                            {/* {editNoteForm && <CRXButton className='secondary' onClick={onDeleteClick} style={{ left: "250px"}}>
                                Delete
                            </CRXButton>} */}
                        </div>
                    </div>
                </div>


            </CRXModalDialog>
        </div>
    );
});

export default VideoPlayerNote;