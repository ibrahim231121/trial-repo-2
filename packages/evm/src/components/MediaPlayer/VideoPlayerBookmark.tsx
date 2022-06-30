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

type VideoPlayerSnapshotFormProps = {
    description: string;
    imageString: string;
};

type VideoPlayerSnapshotProps = {
    openBookmarkForm: boolean;
    editBookmarkForm: boolean
    setopenBookmarkForm: any;
    seteditBookmarkForm: any;
    videoHandle: any;
    AssetData: any;
    EvidenceId: any;
    BookmarktimePositon?: number;
    bookmark: any;
    bookmarkAssetId?: number;
    toasterMsgRef: any;
    timelinedetail: any;
    settimelinedetail: any;
};

const VideoPlayerBookmark: React.FC<VideoPlayerSnapshotProps> = React.memo((props) => {
    const {openBookmarkForm,editBookmarkForm,setopenBookmarkForm,seteditBookmarkForm,videoHandle,AssetData,EvidenceId,BookmarktimePositon,bookmark,bookmarkAssetId,toasterMsgRef,timelinedetail,settimelinedetail} = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [removeClassName, setremoveClassName] = React.useState('');
    const [alert, setAlert] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const [alertType, setAlertType] = useState<string>('inline');
    const [errorType, setErrorType] = useState<string>('error');
    const alertRef = useRef(null);
    const [onSave, setOnSave] = useState(true);
    const [isSnapshotRequired, setIsSnapshotRequired] = React.useState(false);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [isSuccess, setIsSuccess] = React.useState({
        success: false,
        SuccessType: "",
    });
    const [formpayload, setFormPayload] = React.useState<VideoPlayerSnapshotFormProps>({
        description: editBookmarkForm ? bookmark.description:'',
        imageString: '',
    });

    const [bookmarkobj, setbookmarkobj] = React.useState<any>({
        assetId: editBookmarkForm ? bookmarkAssetId : AssetData.dataId,
        bookmarkTime: "",
        createdOn: "",
        modifiedOn: null,
        description: "",
        id: 0,
        madeBy: "",
        position: 0,
        version: ""
    });

    const [formpayloadErr, setFormPayloadErr] = React.useState({
        descriptionErr: '',
        imageStringErr: '',
    });

    React.useEffect(() => {
        setOpenModal(openBookmarkForm)
    }, []);

    React.useEffect(() => {
        if(isSuccess.success){
            var tempData = [...timelinedetail];
            if(isSuccess.SuccessType == "Add"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = [...x.bookmarks, bookmarkobj]
                            }})
                settimelinedetail([...tempData]);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
                if(!isSnapshotRequired){
                    setOpenModal(false);
                    setopenBookmarkForm(false);
                }
            }
            else if(isSuccess.SuccessType == "Update"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                                x.bookmarks = [...x.bookmarks, bookmarkobj];
                            }})
                settimelinedetail([...tempData]);
                setOpenModal(false);
                setopenBookmarkForm(false);
                seteditBookmarkForm(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
            else if(isSuccess.SuccessType == "Delete"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                            }})
                settimelinedetail([...tempData]);
                setOpenModal(false);
                setopenBookmarkForm(false);
                seteditBookmarkForm(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
        }
        
    }, [isSuccess]);

    React.useEffect(() => {
        if (isSnapshotRequired) {
            var w = videoHandle.videoWidth * 0.25;
            var h = videoHandle.videoHeight * 0.25;
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoHandle, 0, 0, w, h);
            }
            setFormPayload({ ...formpayload, imageString: canvas.toDataURL() })
        }
        else {
            setFormPayload({ ...formpayload, imageString: "" });
        }
    }, [isSnapshotRequired]);

    useEffect(() => {
        formpayload.description.length > 0 ? setOnSave(false) : setOnSave(true);
    }, [formpayload.description]);

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenModal(false);
        setopenBookmarkForm(false);
        seteditBookmarkForm(false);
    };

    const onAdd = async () => {
        if(formpayload.description.length > 0){
            await AddBookmark();
        }
        if(isSnapshotRequired){
            await AddSnapshot();
        }
    };

    const AddBookmark = async () => {
        const AssetId = AssetData.dataId;
        const body = {
            bookmarkTime: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            position: BookmarktimePositon,
            description: formpayload.description,
            madeBy: "User"
        };
        const bookmarkaddurl = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Bookmarks";
        await fetch(bookmarkaddurl, {
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
                        setbookmarkobj({ ...bookmarkobj, bookmarkTime: body.bookmarkTime, description: body.description, id: response, madeBy: body.madeBy, position: body.position });
                        setIsSuccess({...isSuccess, success: true, SuccessType: "Add"});
                        toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
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

    const AddSnapshot = async () => {
        const formdata = formpayload;
        var guid = uuidv4();
        const AssetFilebody = {
            name: "Snapshot_FILE_" + guid,
            type: "Image",
            extension: "jpeg",
            url: "www.hdc.com:8080",
            size: 1280,
            sequence: 0,
            duration: 0,
            checksum: {
                checksum: "bc527343c7ffc103111f3a694b004e2f",
                algorithm: "SHA-256",
                status: true
            },
            recording: {
                started: new Date(),
                ended: new Date()
            }
        };
        const Assetbody = {
            name: "Snapshot_" + guid,
            typeOfAsset: "Image",
            state: "Normal",
            status: "Queued",
            unitId: AssetData.unitId,
            duration: 0,
            recordedByCSV: null,
            bookMarks: [],
            files: [AssetFilebody],
            owners: [1],
            lock: { roles: [] },
            recording: {
                started: new Date(),
                ended: new Date()
            },
            isRestrictedView: false,
            buffering: {
                pre: 0,
                post: 0
              },
            audioDevice: null,
            camera: null,
            isOverlaid: false
        };
        
        await fetch(EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', TenantId: '1' },
            body: JSON.stringify(Assetbody)
        })
            .then(function (res) {
                if (res.ok) return res.json();
                else if (res.status == 500) {
                    setAlert(true);
                    setResponseError(
                        "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                    );
                } else return res.text();
            })
            .then((resp) => {
                if (resp !== undefined) {
                    let error = JSON.parse(resp);
                    if (error.errors !== undefined) {
                    }
                    else if (!isNaN(+error)) {
                        toasterMsgRef.current.showToaster({message: "Snapshot Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
                        setOpenModal(false);
                        setopenBookmarkForm(false);
                    } else {
                        setAlert(true);
                        setResponseError(error);
                    }
                }
            })
            .catch(function (error) {
                return error;
            });
    }

    const onUpdate = async () => {
        const body = {
            id: bookmark.id,
            bookmarkTime: bookmark.bookmarkTime,
            position: bookmark.position,
            description: formpayload.description,
            madeBy: bookmark.madeBy,
            version: bookmark.version
        };
        const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
            },
            body: JSON.stringify(body),
          };
        const url = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+bookmark.assetId+"/Bookmarks/"+bookmark.id;
        fetch(url, requestOptions)
        .then((response: any) => {
            if (response.ok) {
                setbookmarkobj({ ...bookmarkobj, bookmarkTime: body.bookmarkTime, description: body.description, id: body.id, madeBy: body.madeBy, position: body.position, version: body.version, createdOn: bookmark.createdOn, modifiedOn: bookmark.modifiedOn })
                setIsSuccess({...isSuccess, success: true, SuccessType: "Update"});
                toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});
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
            id: bookmark.id
        };
        const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
            },
          };
        const url = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+bookmark.assetId+"/Bookmarks/"+bookmark.id;
        fetch(url, requestOptions)
        .then((response: any) => {
            if (response.ok) {
                setbookmarkobj({ ...bookmarkobj, id: body.id })
                setIsSuccess({...isSuccess, success: true, SuccessType: "Delete"})
                toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
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
        if(editBookmarkForm){
            await onUpdate()
            if(isSnapshotRequired){
                await AddSnapshot();
            }
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

    const handlesnapshot = (e: any) => {
        setIsSnapshotRequired(e);
    }

    const checkDescription = () => {
        if (!formpayload.description) {
            setdescriptionErr('Description is required');
        }
        else {
            setdescriptionErr('');
        }
    }
    


    return (
        <div className='videoPlayerSnapshot'>
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
                    <strong>Bookmark</strong>. If you close the form, any changes
                    you've made will not be saved. You will not be able to undo this
                    action.
                    <p>
                        Are you sure like to <strong>Delete</strong> the Bookmark?
                    </p>
                    </div>
                }
            </CRXConfirmDialog>
            <CRXModalDialog
                maxWidth="gl"
                title="Bookmark"
                className={'CRXModal ___CRXBookMark__' + removeClassName}
                modelOpen={openModal}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className={` ${alert == true ? "__CRXAlertDes__" : ""}`}>
                    <CRXAlert
                        ref={alertRef}
                        message={responseError}
                        className='crxAlertSnapShotEditForm'
                        alertType={alertType}
                        type={errorType}
                        open={alert}
                        setShowSucess={() => null}
                    />
                    <div className="modalEditCrx">
                        <div className='CrxEditForm'>
                            <TextField
                                error={!!descriptionErr}
                                errorMsg={descriptionErr}
                                value={formpayload.description}
                                multiline
                                label='Description'
                                className='description-input'
                                required={true}
                                onChange={(e: any) => setFormPayload({ ...formpayload, description: e.target.value })}
                                onBlur={checkDescription}
                            />
                            <div className='crx-requird-check'>
                                <CRXCheckBox
                                    checked={isSnapshotRequired}
                                    lightMode={true}
                                    className='crxCheckBoxCreate'
                                    onChange={(e: any) => handlesnapshot(e.target.checked)}
                                />
                                <label>Take snapshort</label>
                            </div>
                        </div>
                        <div className='categoryModalFooter CRXFooter'>
                            <CRXButton className='primary' onClick={onSubmit} disabled={onSave}>
                                Save
                            </CRXButton>
                            <CRXButton className='secondary' onClick={handleClose}>
                                Cancel
                            </CRXButton>
                            {editBookmarkForm && <CRXButton className='secondary' onClick={onDeleteClick} style={{ left: "250px"}}>
                                Delete
                            </CRXButton>}
                        </div>
                    </div>
                </div>


            </CRXModalDialog>
        </div>
    );
});

export default VideoPlayerBookmark;