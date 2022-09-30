import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { TextField } from '@cb/shared';
import "./VideoPlayer.scss";
import { CRXCheckBox } from '@cb/shared';
import { CRXConfirmDialog } from '@cb/shared';
import { Asset, Bookmark, File as EvidenceFile } from '../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../utils/Api/ApiAgent';
import { AddFilesToFileService } from '../../GlobalFunctions/FileUpload';
import { useDispatch } from 'react-redux';
import { addTimelineDetailActionCreator } from '../../Redux/VideoPlayerTimelineDetailReducer';
declare const window: any;

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
};

const VideoPlayerBookmark: React.FC<VideoPlayerSnapshotProps> = React.memo((props) => {
    const {openBookmarkForm,editBookmarkForm,setopenBookmarkForm,seteditBookmarkForm,videoHandle,AssetData,EvidenceId,BookmarktimePositon,bookmark,bookmarkAssetId,toasterMsgRef,timelinedetail} = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [removeClassName, setremoveClassName] = React.useState('');
    const [onSave, setOnSave] = useState(true);
    const [isSnapshotRequired, setIsSnapshotRequired] = React.useState(false);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [snapshotImage, setSnapshotImage] = useState<File>();
    const [isSuccess, setIsSuccess] = React.useState({
        success: false,
        SuccessType: "",
    });
    const [formpayloadDescription, setFormPayloadDescription] = React.useState<string>(editBookmarkForm ? bookmark.description:"");
    const dispatch = useDispatch();

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

    useEffect(() => {
        window.onRecvData = new CustomEvent("onUploadSnapshotStatusUpdate");
        window.addEventListener("onUploadSnapshotStatusUpdate", uploadSnapshotStatusStatusUpdate);
      }, [])

    React.useEffect(() => {
        setOpenModal(openBookmarkForm)
    }, []);

    React.useEffect(() => {
        if(isSuccess.success){
            var tempData = JSON.parse(JSON.stringify(timelinedetail));
            if(isSuccess.SuccessType == "Add"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = [...x.bookmarks, bookmarkobj]
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
                if(!isSnapshotRequired){
                    setOpenModal(false);
                }
            }
            else if(isSuccess.SuccessType == "Update"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                                x.bookmarks = [...x.bookmarks, bookmarkobj];
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setOpenModal(false);
                seteditBookmarkForm(false);
                setIsSuccess({...isSuccess, success: false, SuccessType: ""});
            }
            else if(isSuccess.SuccessType == "Delete"){
                tempData.forEach((x:any)=> 
                            {if(x.dataId == bookmarkobj.assetId){
                                x.bookmarks = x.bookmarks.filter((y:any)=> y.id !== bookmarkobj.id);
                            }})
                dispatch(addTimelineDetailActionCreator([...tempData]));
                setOpenModal(false);
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
            //Usage example:
            urltoFile(canvas.toDataURL(), 'Snapshot.png','image/png')
            .then(function(file)
            {
                setSnapshotImage(file); 
                console.log(file);
            });
        }
    }, [isSnapshotRequired]);

    useEffect(() => {
        formpayloadDescription.length > 0 ? setOnSave(false) : setOnSave(true);
    }, [formpayloadDescription]);

    function urltoFile(url:any, filename:any, mimeType:any){
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename, {type: mimeType});})
        );
    }

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        setOpenModal(false);
        setopenBookmarkForm(false);
        seteditBookmarkForm(false);
    };

    const onAdd = async () => {
        setOnSave(true);
        if(formpayloadDescription.length > 0){
            await AddBookmark();
            if(!isSnapshotRequired){
                setOnSave(false);
            }
        }
        if(isSnapshotRequired){
            await AddSnapshotBase();
            setOnSave(false);
        }
    };

    const AddBookmark = async () => {
        const AssetId = AssetData.dataId;
        const body : Bookmark = {
            id: 0,
            assetId: AssetId,
            bookmarkTime: new Date(),
            position: BookmarktimePositon ?? 0,
            description: formpayloadDescription,
            madeBy: "User",
            version: ""
        };
        const bookmarkaddurl = "/Evidences/"+EvidenceId+"/Assets/"+AssetId+"/Bookmarks";
        setopenBookmarkForm(false);
        EvidenceAgent.addBookmark(bookmarkaddurl, body).then((response: any) => {
            setbookmarkobj({ ...bookmarkobj, bookmarkTime: body.bookmarkTime, description: body.description, id: response, madeBy: body.madeBy, position: body.position });
            setIsSuccess({...isSuccess, success: true, SuccessType: "Add"});
            toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
        })
        .catch((e:any) =>{
            toasterMsgRef.current.showToaster({message: "Bookmark Not Saved", variant: "error", duration: 5000, clearButtton: true});
        })
    }

    const AddSnapshotBase = async () => {
        handleOnUpload();
    }

    const handleOnUpload = async () => {
        if(snapshotImage){
            let files = [];
            let file: any = snapshotImage;
            file.id = +new Date();
            files.push(file);
            AddFilesToFileService(files);
        }
    }

    const uploadSnapshotStatusStatusUpdate =  (data: any) => {
        if(data.data.percent == 100 && data.data.fileSize == data.data.loadedBytes){
            AddSnapshot(data.data);
        }
        else if(data.data.error){
            toasterMsgRef.current.showToaster({message: "Snapshot Upload Error", variant: "error", duration: 5000, clearButtton: true});
        }
    }

    const AddSnapshot = async (fileresponse: any) => {
        
        const AssetFilebody : EvidenceFile = {
            id:0,
            filesId: 0,
            assetId: 0,
            name: fileresponse.fileName,
            type: "Image",
            extension: "png",
            url: fileresponse.url,
            size: snapshotImage?.size ?? 1280,
            sequence: 0,
            duration: 0,
            checksum: {
                checksum: "bc527343c7ffc103111f3a694b004e2f",
                algorithm: "SHA-256",
                status: true
            },
            recording: {
                started: new Date(),
                ended: new Date(),
                timeOffset: 0
            }
        };
        const Assetbody : Asset = {
            id: 0,
            name: fileresponse.fileName,
            typeOfAsset: "Image",
            state: "Normal",
            status: "Available",
            unitId: AssetData.unitId,
            duration: 0,
            bookMarks: [],
            files: [AssetFilebody],
            owners: [{
                id: "",
                cmtFieldValue: 1,
                record: []
            }],
            lock: { roles: [] },
            recording: {
                started: new Date(),
                ended: new Date(),
                timeOffset: 0,
            },
            isRestrictedView: false,
            buffering: {
                pre: 0,
                post: 0
              },
            isOverlaid: false,
            notes: []
        };
        const url = "/Evidences/" + EvidenceId + "/Assets";
        EvidenceAgent.addAsset(url, Assetbody).then(() => {
            toasterMsgRef.current.showToaster({message: "Snapshot Sucessfully Saved", variant: "Success", duration: 5000, clearButtton: true});
            setOpenModal(false);
            setopenBookmarkForm(false);
        })
        .catch((e:any) =>{
            toasterMsgRef.current.showToaster({message: "Snapshot Saved Error", variant: "error", duration: 5000, clearButtton: true});
        })
    }

    const onUpdate = async () => {
        const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmark.assetId+"/Bookmarks/"+bookmark.id;
        const body : Bookmark = {
            id: bookmark.id,
            assetId: bookmark.assetId,
            bookmarkTime: bookmark.bookmarkTime,
            position: bookmark.position,
            description: formpayloadDescription,
            madeBy: bookmark.madeBy,
            version: bookmark.version
        };
        setopenBookmarkForm(false);
        EvidenceAgent.updateBookmark(url, body).then(() => {
            setbookmarkobj({ ...bookmarkobj, bookmarkTime: body.bookmarkTime, description: body.description, id: body.id, madeBy: body.madeBy, position: body.position, version: body.version, createdOn: bookmark.createdOn, modifiedOn: bookmark.modifiedOn })
            setIsSuccess({...isSuccess, success: true, SuccessType: "Update"});
            toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});        
        })
        .catch((err: any) => {
            toasterMsgRef.current.showToaster({message: "Bookmark Update Error", variant: "error", duration: 5000, clearButtton: true});
            console.error(err);
        });
    };

    const onDelete = async () => {
        const url = "/Evidences/"+EvidenceId+"/Assets/"+bookmark.assetId+"/Bookmarks/"+bookmark.id;
        setopenBookmarkForm(false);
        EvidenceAgent.deleteBookmark(url).then(() => {
            setbookmarkobj({ ...bookmarkobj, id: bookmark.id })
            setIsSuccess({...isSuccess, success: true, SuccessType: "Delete"})
            toasterMsgRef.current.showToaster({message: "Bookmark Sucessfully Deleted", variant: "Success", duration: 5000, clearButtton: true});
        })
        .catch((err: any) => {
            toasterMsgRef.current.showToaster({message: "Bookmark Delete Error", variant: "error", duration: 5000, clearButtton: true});
            console.error(err);
        });
    };

    const onSubmit = async (e: any) => {
        if(editBookmarkForm){
            await onUpdate()
            if(isSnapshotRequired){
                await AddSnapshotBase();
            }
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

    const handlesnapshot = (e: any) => {
        setIsSnapshotRequired(e);
    }

    const checkDescription = () => {
        if (!formpayloadDescription) {
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
                <div>
                    <div className="modalEditCrx">
                        <div className='CrxEditForm'>
                            <TextField
                                error={!!descriptionErr}
                                errorMsg={descriptionErr}
                                value={formpayloadDescription}
                                multiline
                                label='Description'
                                className='description-input'
                                required={true}
                                onChange={(e: any) => setFormPayloadDescription(e.target.value )}
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