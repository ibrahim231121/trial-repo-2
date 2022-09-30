import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CRXModalAssetViewReason } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { CRXAlert } from '@cb/shared';
import { TextField } from '@cb/shared';
import "./VideoPlayer.scss";
import { CRXCheckBox } from '@cb/shared';
import moment from 'moment';
import { CRXConfirmDialog } from '@cb/shared';
import { CRXSelectBox } from '@cb/shared';
import CRXAppDropdown from '../../Application/Header/AppBarMenu/AppBarLinks';
import axios from 'axios';

import { useHistory } from "react-router";
import { EvidenceAgent } from '../../utils/Api/ApiAgent';
import { AssetViewReason } from '../../utils/Api/models/EvidenceModels';


type VideoPlayerViewReasonProps = {
    openViewReason: boolean;
    EvidenceId: any;
    setOpenViewReason: any;
    AssetData: any;
    setViewReasonControlsDisabled: any;
    setReasonForViewing: any
};

type ViewReason = {
    displayText: string;
    value: string;
}
const VideoPlayerViewReason: React.FC<VideoPlayerViewReasonProps> = React.memo((props) => {
    const { openViewReason, EvidenceId, setOpenViewReason, AssetData, setViewReasonControlsDisabled, setReasonForViewing } = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [alert, setAlert] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const [alertType, setAlertType] = useState<string>('inline');
    const [errorType, setErrorType] = useState<string>('error');
    const alertRef = useRef(null);
    const [onSave, setOnSave] = useState(true);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [reason, setReason] = React.useState<string>("");
    const [description, setdescription] = React.useState("");
    const [abc, setAbc] = React.useState<boolean>(true);
    const [otherReason, setOtherReason] = React.useState(false);
    const [ip, setIP] = useState('');
    const [isSuccess, setIsSuccess] = React.useState({
        success: false,
        SuccessType: "",
    });
    const Reasons: ViewReason[] = [
        { displayText: "Reason 1", value: "Reason 1" },
        { displayText: "Reason 2", value: "Reason 2" },
        { displayText: "Reason 3", value: "Reason 3" },
        { displayText: "Reason 4", value: "Reason 4" },
        { displayText: "Other", value: "Other" },
    ]
    const history = useHistory();
    React.useEffect(() => {
        setOpenModal(openViewReason);
        getData();
    }, []);

    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        setIP(res.data.IPv4)
    }
    React.useEffect(() => {
        console.log(ip)
    }, [ip])
    const handleClose = async (e: React.MouseEvent<HTMLElement>) => {

        setOpenModal(false);
        setOpenViewReason(false);
    };

    const handleSave = async (e: React.MouseEvent<HTMLElement>) => {
        const AssetId = AssetData.id;
        const body : AssetViewReason = {
            id: 0,
            assetId: AssetId,
            userId: parseInt(localStorage.getItem('User Id') ?? "0"),
            ipAddress: ip,
            viewReason: reason == "Other" ? description : reason,
            viewedTime: new Date()
        };
        const AssetViewReasonURL = "/Evidences/" + EvidenceId + "/Assets/" + AssetId + "/AssetViewReasons";
        EvidenceAgent.addAssetViewReason(AssetViewReasonURL, body).then(()=>{
            setViewReasonControlsDisabled(false);
            setReasonForViewing(false);
        })
        .catch((e:any) => {
            console.log(e);
            setAlert(true);
            setResponseError(
                "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
            );
        })
        setOpenModal(false);
        setOpenViewReason(false);
    };



    const handleBack = (e: React.MouseEvent<HTMLElement>) => {
        history.goBack();
    };






    const onSubmit = async (e: any) => {
        setResponseError('');
        setAlert(false);
        // if (editNoteForm) {
        //     await onUpdate();
        // } else {
        //     await onAdd();
        // }
    };

    const onDeleteClick = async () => {
        setIsOpenConfirmDailog(true);
    };
    const onDeleteConfirm = async () => {
        setResponseError('');
        setAlert(false);
        // await onDelete();
    };
    const CheckOtherReason = () => {
        if (description.length == 0) {
            setdescriptionErr('Description is required');
            return;
        }
        setdescriptionErr('');
    }
    React.useEffect(() => {
        CheckOtherReason()
    }, [description])

    const ReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        setReason(e.target.value)
        if (e.target.value === "Other") {
            setOtherReason(true)
            return;
        }
        setOtherReason(false)
    }

const errorsReason = reason == "Other" && descriptionErr.length > 0  ? "__CRX__ErrorReason__" : "";
console.log(descriptionErr, "check")
    return (
        <div className='videoPlayerNote'>
            <CRXModalAssetViewReason
                maxWidth="gl"
                title="Asset view reason"
                className={'CRXModal CRXAssetReason'}
                modelOpen={openModal}
                onClose={handleClose}
                defaultButton={false}
                showSticky={true}
            >
                <div className={errorsReason}>
                {alert &&   <CRXAlert
                        ref={alertRef}
                        message={responseError}
                        className='crxAlertNoteEditForm'
                        alertType={alertType}
                        type={errorType}
                        open={alert}
                        setShowSucess={() => null}
                    />
                }
                    <div className='modalEditCrx'>
                        <div className='CrxEditForm'>
                        <div className="CrxCreateUser">
                            <div className="CrxIndicates">
                                <sup>*</sup> Indicates required field
                            </div>
                            </div>
                            <p>Please select a reason for viewing this asset.</p>
                            <label>Reason for viewing asset <sup>*</sup></label>
                            <CRXSelectBox
                                className="CRXViewReasonDropdown"
                                options={Reasons}
                                defaultOptionText={"-- Please select one --"}
                                disabled={false}
                                defaultOption={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { ReasonChange(e) }}
                            >

                            </CRXSelectBox>
                            {otherReason && <TextField
                                error={descriptionErr.length > 0 ? true : false}
                                errorMsg={descriptionErr}
                                value={description}
                                multiline
                                label='Other Description'
                                className='description-input crx-category-scroll'
                                required={true}
                                onChange={(e: any) => setdescription(e.target.value)}
                                onBlur={CheckOtherReason}
                            />}
                        </div>
                        <div className='modalFooter CRXFooter'>
                        <div className="nextBtn">
                            <CRXButton
                                className='primary'
                                onClick={handleSave}
                                disabled={reason.length == 0 || (reason == "Other" && descriptionErr.length > 0 ? true : false)}>
                                Submit asset view reason
                            </CRXButton>
                            </div>
                            <div className="cancelBtn">
                            <CRXButton className='secondary' onClick={handleBack}>
                                Back
                            </CRXButton>
                            </div>
                        </div>
                   
                    </div>
                </div>


            </CRXModalAssetViewReason >
        </div >
    );
});

export default VideoPlayerViewReason;