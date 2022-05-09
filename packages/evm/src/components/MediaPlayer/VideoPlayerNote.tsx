import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { CRXAlert } from '@cb/shared';
import { TextField } from '@cb/shared';
import { EVIDENCE_SERVICE_URL } from '../../utils/Api/url';
import "./VideoPlayer.scss";
import { CRXCheckBox } from '@cb/shared';
import moment from 'moment';
import { CRXConfirmDialog } from '@cb/shared';

type VideoPlayerNoteProps = {
    openNoteForm: boolean;
    editNoteForm: boolean
    setopenNoteForm: any;
    seteditNoteForm: any;
    AssetData: any;
    EvidenceId: any;
    NotetimePositon?: number;
    note: any;
    Data:any;
    setData: any;
    noteAssetId?: number;
    noteMsgRef: any;
};

const VideoPlayerNote: React.FC<VideoPlayerNoteProps> = React.memo((props) => {
    const {openNoteForm,editNoteForm,setopenNoteForm,seteditNoteForm,AssetData,EvidenceId,NotetimePositon,note,Data,setData,noteAssetId,noteMsgRef} = props;
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

    const [noteobj, setnoteobj] = React.useState<any>({
        assetId: editNoteForm ? noteAssetId : AssetData.id,
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
        if(isSuccess.success && isSuccess.SuccessType == "Add"){
            var tempData = [...Data];
            tempData.forEach((x:any)=> 
                        {if(x.id == noteobj.assetId){
                            x.notes = [...x.notes, noteobj]
                        }})
            setData([...tempData]);
            setOpenModal(false);
            setopenNoteForm(false);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
        }
        else if(isSuccess.success && isSuccess.SuccessType == "Update"){
            var tempData = [...Data];
            tempData.forEach((x:any)=> 
                        {if(x.id == noteobj.assetId){
                            x.notes = x.notes.filter((y:any)=> y.id !== noteobj.id);
                            x.notes = [...x.notes, noteobj];
                        }})
            setData([...tempData]);
            setOpenModal(false);
            setopenNoteForm(false);
            seteditNoteForm(false);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
        }
        else if(isSuccess.success && isSuccess.SuccessType == "Delete"){
            var tempData = [...Data]//JSON.parse(JSON.stringify(Data));
            tempData.forEach((x:any)=> 
                        {if(x.id == noteobj.assetId){
                            x.notes = x.notes.filter((y:any)=> y.id !== noteobj.id);
                        }})
            setData([...tempData]);
            setOpenModal(false);
            setopenNoteForm(false);
            seteditNoteForm(false);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
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
        const AssetId = AssetData.id;
        const body = {
            noteTime: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            position: NotetimePositon,
            description: description,
            madeBy: "Trigger"
        };
        const noteaddurl = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Notes";
        await fetch(noteaddurl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', TenantId: '1' },
            body: JSON.stringify(body)
        })
            .then(function (response) {
                if (response.ok) return response.json();
                else if (response.status == 500) {
                    setAlert(true);
                    setResponseError(
                        "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                    );
                } else return response.text();
            })
            .then((response) => {
                if (response !== undefined) {
                    let err = JSON.parse(response);
                    if (err.errors !== undefined) {
                    }
                    else if (!isNaN(+err)) {
                        setnoteobj({ ...noteobj, noteTime: body.noteTime, description: body.description, id: response, madeBy: body.madeBy, position: body.position });
                        setIsSuccess({...isSuccess, success: true, SuccessType: "Add"});
                        noteMsgRef.current.showToaster({message: "Note Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
                    } else {
                            setAlert(true);
                            setResponseError(err);
                    }
                }
            })
            .catch(function (error) {
                return error;
            });
    }

    

    const onUpdate = async () => {
        const body = {
            assetId: note.assetId, 
            id: note.id,
            position: note.position,
            description: description,
            version: note.version
        };
        const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
            },
            body: JSON.stringify(body),
          };
        const url = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+note.assetId+"/Notes/"+note.id;
        fetch(url, requestOptions)
        .then((response: any) => {
            if (response.ok) {
                setnoteobj({ ...noteobj, noteTime: note.noteTime, description: body.description, id: body.id, madeBy: note.madeBy, position: body.position, version: body.version, createdOn: note.createdOn, modifiedOn: note.modifiedOn })
                setIsSuccess({...isSuccess, success: true, SuccessType: "Update"});
                noteMsgRef.current.showToaster({message: "Note Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});
            } else {
                setAlert(true);
                setResponseError(
                    "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                );
            }
        })
        .catch((err: any) => {
            // setError(true);
            console.error(err);
        });
    };

    const onDelete = async () => {
        const body = {
            id: note.id
        };
        const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
            },
          };
        const url = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+note.assetId+"/Notes/"+note.id;
        fetch(url, requestOptions)
        .then((response: any) => {
            if (response.ok) {
                setnoteobj({ ...noteobj, id: body.id })
                setIsSuccess({...isSuccess, success: true, SuccessType: "Delete"})
                noteMsgRef.current.showToaster({message: "Note Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
            } else {
                setAlert(true);
                setResponseError(
                    "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                );
            }
        })
        .catch((err: any) => {
            // setError(true);
            console.error(err);
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
                className={'CRXModal '}
                modelOpen={openModal}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className=''>
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
                                className='description-input'
                                required={true}
                                onChange={(e: any) => setdescription(e.target.value)}
                                onBlur={checkDescription}
                            />
                        </div>
                        <div className='crxFooterEditFormBtn'>
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