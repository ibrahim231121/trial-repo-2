import React, { useEffect, useRef, useState } from 'react';
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
    Data:any;
    setData: any;
    bookmarkAssetId?: number;
    bookmarkMsgRef: any;
};
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const VideoPlayerBookmark: React.FC<VideoPlayerSnapshotProps> = React.memo((props) => {
    const {openBookmarkForm,editBookmarkForm,setopenBookmarkForm,seteditBookmarkForm,videoHandle,AssetData,EvidenceId,BookmarktimePositon,bookmark,Data,setData,bookmarkAssetId,bookmarkMsgRef} = props;
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
    const [isSuccess, setIsSuccess] = React.useState({
        success: false,
        SuccessType: "",
    });
    const [formpayload, setFormPayload] = React.useState<VideoPlayerSnapshotFormProps>({
        description: editBookmarkForm ? bookmark.description:'',
        imageString: '',
    });

    const [bookmarkobj, setbookmarkobj] = React.useState<any>({
        assetId: editBookmarkForm ? bookmarkAssetId : AssetData.id,
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
        if(isSuccess.success && isSuccess.SuccessType == "Add"){
            var tempData = [...Data];
            tempData.map((x:any)=> 
                        {if(x.id == bookmarkobj.assetId){
                            x.bookmarks = [...x.bookmarks, bookmarkobj]
                        }})
            setData([...tempData]);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            if(!isSnapshotRequired){
                setOpenModal(false);
                setopenBookmarkForm(false);
            }
        }
        else if(isSuccess.success && isSuccess.SuccessType == "Update"){
            var tempData = [...Data];
            tempData.map((x:any)=> 
                        {if(x.id == bookmarkobj.assetId){
                            x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                            x.bookmarks = [...x.bookmarks, bookmarkobj];
                        }})
            setData([...tempData]);
            setOpenModal(false);
            setopenBookmarkForm(false);
            seteditBookmarkForm(false);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
        }
        else if(isSuccess.success && isSuccess.SuccessType == "Delete"){
            var tempData = [...Data]//JSON.parse(JSON.stringify(Data));
            tempData.map((x:any)=> 
                        {if(x.id == bookmarkobj.assetId){
                            x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                        }})
            setData([...tempData]);
            setOpenModal(false);
            setopenBookmarkForm(false);
            seteditBookmarkForm(false);
            setIsSuccess({...isSuccess, success: false, SuccessType: ""});
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
            if(!editBookmarkForm){
            setOnSave(false);}
            setFormPayload({ ...formpayload, imageString: canvas.toDataURL() })
        }
        else {
            if(!editBookmarkForm){
            setOnSave(true);}
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
            setOpenModal(false);
            setopenBookmarkForm(false);
        }
    };

    const AddBookmark = async () => {
        const AssetId = AssetData.id;
        const body = {
            bookmarkTime: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
            position: BookmarktimePositon,
            description: formpayload.description,
            madeBy: "Trigger"
        };
        const bookmarkaddurl = EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Bookmarks";
        await fetch(bookmarkaddurl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', TenantId: '1' },
            body: JSON.stringify(body)
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
                        setbookmarkobj({ ...bookmarkobj, bookmarkTime: body.bookmarkTime, description: body.description, id: resp, madeBy: body.madeBy, position: body.position });
                        setIsSuccess({...isSuccess, success: true, SuccessType: "Add"});
                        bookmarkMsgRef.current.showToaster({message: "Bookmark Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
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

    const AddSnapshot = async () => {
        bookmarkMsgRef.current.showToaster({message: "Snapshot Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
        // const formdata = formpayload;
        // var guid = create_UUID();
        // const request = {
        //     "name": "Image_" + guid + "_" + formdata.description,
        //     "typeOfAsset": "Image",
        //     "state": "Normal",
        //     "status": "Uploading",
        //     "unitId": 9,
        //     "duration": 14,
        //     "recordedByCSV": "98p",
        //     "bookMarks": [
        //         {
        //             "bookmarkTime": "2022-02-04T09:33:34.650Z",
        //             "position": 10,
        //             "description": "Bookmark 2",
        //             "madeBy": "Trigger"
        //         }
        //     ],
        //     "files": [
        //         {
        //             "name": "FILE_Image_" + guid + "_" + formdata.description,
        //             "type": "Image",
        //             "extension": "jpeg",
        //             "url": formdata.imageString,
        //             "size": 1280,
        //             "sequence": 6,
        //             "duration": 3600,
        //             "checksum": {
        //                 "checksum": "bc527343c7ffc103111f3a694b004e2f",
        //                 "algorithm": "SHA-256",
        //                 "status": true
        //             },
        //             "recording": {
        //                 "started": "2021-10-19T15:30:19Z",
        //                 "ended": "2021-10-19T21:30:19Z"
        //             }
        //         }
        //     ],
        //     "owners": [
        //         10
        //     ],
        //     "lock": {
        //         "roles": []
        //     },
        //     "recording": {
        //         "started": "2021-10-19T15:30:19Z",
        //         "ended": "2021-10-19T15:30:19Z"
        //     },
        //     "isRestrictedView": false,
        //     "buffering": {
        //         "pre": 5,
        //         "post": 5
        //     },
        //     "audioDevice": null,
        //     "camera": null,
        //     "isOverlaid": true

        // };
        // await fetch(EVIDENCE_SERVICE_URL + "/Evidences/"+EvidenceId+"/Assets", {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', TenantId: '1' },
        //     body: JSON.stringify(request)
        // })
        //     .then(function (res) {
        //         if (res.ok) return res.json();
        //         else if (res.status == 500) {
        //             setAlert(true);
        //             setResponseError(
        //                 "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
        //             );
        //         } else return res.text();
        //     })
        //     .then((resp) => {
        //         if (resp !== undefined) {
        //             let error = JSON.parse(resp);
        //             if (error.errors !== undefined) {
        //             }
        //             else if (!isNaN(+error)) {
        //                 setOpenModal(false);
        //                 setopenBookmarkForm(false);
        //                 bookmarkMsgRef.current.showToaster({message: "Snapshot Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
        //             } else {
        //                 setAlert(true);
        //                 setResponseError(error);
        //             }
        //         }
        //     })
        //     .catch(function (error) {
        //         return error;
        //     });
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
                bookmarkMsgRef.current.showToaster({message: "Bookmark Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});
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
                bookmarkMsgRef.current.showToaster({message: "Bookmark Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
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
                className={'CRXModal ' + removeClassName}
                modelOpen={openModal}
                onClose={handleClose}
                defaultButton={false}
                showSticky={false}
            >
                <div className=''>
                    <CRXAlert
                        ref={alertRef}
                        message={responseError}
                        className='crxAlertSnapShotEditForm'
                        alertType={alertType}
                        type={errorType}
                        open={alert}
                        setShowSucess={() => null}
                    />
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>
                            <TextField
                                value={formpayload.description}
                                label='Description'
                                className='description-input'
                                onChange={(e: any) => setFormPayload({ ...formpayload, description: e.target.value })}
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
                        <div className='crxFooterEditFormBtn'>
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