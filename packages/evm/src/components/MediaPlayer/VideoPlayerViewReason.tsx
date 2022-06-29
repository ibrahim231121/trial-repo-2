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
import { CRXDropDown } from '@cb/shared';
import CRXAppDropdown from '../../Application/Header/AppBarMenu/AppBarLinks';
import axios from 'axios';

import { useHistory } from "react-router";


type VideoPlayerViewReasonProps = {
    openViewReason: boolean;
    EvidenceId: any;
    setOpenViewReason: any;
    AssetData: any;
    setViewReasonControlsDisabled: any
};

type ViewReason = {
    displayText: string;
    value: string;
}

const VideoPlayerViewReason: React.FC<VideoPlayerViewReasonProps> = React.memo((props) => {
    const { openViewReason, EvidenceId, setOpenViewReason, AssetData, setViewReasonControlsDisabled } = props;
    const [openModal, setOpenModal] = React.useState(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [alert, setAlert] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const [alertType, setAlertType] = useState<string>('inline');
    const [errorType, setErrorType] = useState<string>('error');
    const alertRef = useRef(null);
    const [onSave, setOnSave] = useState(true);
    const [descriptionErr, setdescriptionErr] = React.useState("");
    const [reason, setReason] = React.useState<string | null>("Reason 1");
    const [description, setdescription] = React.useState("");
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
        const body = {
            id: null,
            assetId: AssetId,
            cmtUserRecId: 1,
            sourceIPAddress: ip,
            ViewReason: reason == "Other" ? description : reason,
        };
        const AssetViewReasonURL = EVIDENCE_SERVICE_URL + "/Evidences/" + EvidenceId + "/Assets/" + AssetId + "/AssetViewReasons";
        await fetch(AssetViewReasonURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', TenantId: '1' },
            body: JSON.stringify(body)
        })
            .then(function (response) {
                if (response.ok) {
                    setViewReasonControlsDisabled(false);
                    return response.json();
                }
                else if (response.status == 500) {
                    setAlert(true);
                    setResponseError(
                        "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                    );
                } else return response.text();
            })
            .catch(function (error) {
                return error;
            });




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

    return (
        <div className='videoPlayerNote'>
            <CRXModalDialog
                maxWidth="gl"
                title="Asset view reason"
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

                            <p>Please select a reason for viewing this asset. Reason for viewing asset * </p>
                            <CRXDropDown
                                options={Reasons}
                                disabled={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { ReasonChange(e) }}
                            >

                            </CRXDropDown>
                            {otherReason && <TextField
                                error={descriptionErr.length > 0 ? true : false}
                                errorMsg={descriptionErr}
                                value={description}
                                label='Other Description'
                                className='description-input'
                                required={true}
                                onChange={(e: any) => setdescription(e.target.value)}
                                onBlur={CheckOtherReason}
                            />}
                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton
                                className='primary'
                                onClick={handleSave}
                                disabled={reason == "Other" && descriptionErr.length > 0 ? true : false}>
                                Save
                            </CRXButton>
                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <CRXButton className='primary' onClick={handleBack}>
                                Back
                            </CRXButton>
                        </div>
                    </div>
                </div>


            </CRXModalDialog >
        </div >
    );
});

export default VideoPlayerViewReason;