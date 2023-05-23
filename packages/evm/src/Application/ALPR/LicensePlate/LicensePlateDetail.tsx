import { TextField } from "@cb/shared";
// import { useStyles } from "../DataSourceStyling/DataSourceMapping";
import { Grid, Typography } from "@material-ui/core";
import { Link, useHistory, useParams } from 'react-router-dom';
import "./LicensePlateDetail.scss"
import { CRXInputDatePicker } from "@cb/shared";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef } from "react";
import { LicensePlateTemplate } from "../../../../src/utils/Api/models/HotListLicensePlate";
import { CRXConfirmDialog } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { CRXAlert } from "@cb/shared";
import { CRXToaster } from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { GetLicensePlateData } from "../../../Redux/AlprLicensePlateReducer";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../../Redux/rootReducer";
// import {SourceMapping } from "../../../../Redux/AlprDataSourceReducer"


const LicensePlateDetail = (props: any) => {
    const { id } = useParams<{ id: string }>();//get data from url 
    const [sourceMappingData, setsourceMappingData] = React.useState<any>([]);
    const [errorType, setErrorType] = React.useState<string>('error');
    const alertRef = useRef(null);
    const userMsgFormRef = useRef<typeof CRXToaster>(null);
    const [alertType, setAlertType] = React.useState<string>('inline');
    const history = useHistory();
    const [isOpen, setIsOpen] = React.useState(false);
    const [licensePlatePayload, setLicensePlatePayload]: any = React.useState<LicensePlateTemplate>(
        {
            id: 0,
            LicensePlate: '',
            DateOfInterest: '',
            LicenseType: '',
            LicenseYear: 0,
            Agency: '',
            State: '',
            FirstName: '',
            LastName: '',
            Alias: '',
            VehicleYear: '',
            VehicleMake: '',
            VehicleModel: '',
            VehicleColor: '',
            VehicleStyle: '',
            Notes: '',
            NCICNumber: '',
            ImportSerialId: '',
            ViolationInfo: '',
        });
    const [responseError, setResponseError] = React.useState<string>('');
    const LicensePlateList: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensePlateList);
    const dispatch = useDispatch();
    const { t } = useTranslation<string>();
    const [saveBtnDisable, setSaveBtnDisable] = React.useState<boolean>(true);
    const minStartDate = () => {
        var currentDate = new Date();
        var mm = '' + (currentDate.getMonth() + 1);
        var dd = '' + currentDate.getDate();
        var yyyy = currentDate.getFullYear();

        if (mm.length < 2) mm = '0' + mm;
        if (dd.length < 2) dd = '0' + dd;
        return [yyyy, mm, dd].join('-') + 'T00:00:00';
    };
    const setFieldValue = (field: string, e: any) => {
        debugger;
        switch (field) {
            case "LicensePlate":
                setLicensePlatePayload({ ...licensePlatePayload, LicensePlate: e });
                break;

            case "DateOfInterest":
                setLicensePlatePayload({ ...licensePlatePayload, DateOfInterest: e });
                break;

            case "LicenseType":
                setLicensePlatePayload({ ...licensePlatePayload, LicenseType: e });
                break;

            case "Agency":
                setLicensePlatePayload({ ...licensePlatePayload, Agency: e });
                break;

            case "State":
                setLicensePlatePayload({ ...licensePlatePayload, State: e });
                break;

            case "FirstName":
                setLicensePlatePayload({ ...licensePlatePayload, FirstName: e });
                break;

            case "LastName":
                setLicensePlatePayload({ ...licensePlatePayload, LastName: e });
                break;

            case "Alias":
                setLicensePlatePayload({ ...licensePlatePayload, Alias: e });
                break;

            case "VehicleYear":
                setLicensePlatePayload({ ...licensePlatePayload, VehicleYear: e });
                break;

            case "VehicleMake":
                setLicensePlatePayload({ ...licensePlatePayload, VehicleMake: e });
                break;

            case "VehicleModel":
                setLicensePlatePayload({ ...licensePlatePayload, VehicleModel: e });
                break;

            case "VehicleColor":
                setLicensePlatePayload({ ...licensePlatePayload, VehicleColor: e });
                break;

            case "VehicleStyle":
                setLicensePlatePayload({ ...licensePlatePayload, VehicleStyle: e });
                break;
            case "Notes":
                setLicensePlatePayload({ ...licensePlatePayload, Notes: e });
                break;

            case "NcicNumber":
                setLicensePlatePayload({ ...licensePlatePayload, NCICNumber: e });
                break;

            case "LicenseYear":
                const regex = /([0-9])+$/;
                if (regex.test(e) === true || e === '') {
                    setLicensePlatePayload({ ...licensePlatePayload, LicenseYear: e });
                }
                break;
            case "ViolationInfo":
                setLicensePlatePayload({ ...licensePlatePayload, ViolationInfo: e });
                break;

            default:
                break;
        }

    }
    useEffect(() => {
        dispatch(GetLicensePlateData());
    }, [])

    useEffect(() => {
        if (LicensePlateList.length > 0) {
            let selectedData = LicensePlateList.filter((x: any) => { return (x.id == id) })
            if (selectedData.length > 0)
                setLicensePlatePayload(selectedData[0])
        }
    }, [LicensePlateList])

    useEffect(() => {
        licensePlatePayload.LicensePlate !== '' && licensePlatePayload.DateOfInterest !== '' ? setSaveBtnDisable(false) : setSaveBtnDisable(true);

    }, [licensePlatePayload])
    const handleClose = () => {
        history.push(
            urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url
        );
        setIsOpen(false)
    };
    const closeDialog = () => {
        setIsOpen(true);
    };
    const errorMsgIcon = (
        <i className="fas fa-exclamation-circle">
            <span className="crxErrorMsg"> {t("Date_of_Interest_field_required")}</span>
        </i>
    );

    const onSubmit=(values:any)=>
    {
        // licensePlatePayload
        history.push(
            urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url
          );
    }
    return (
        <div>
            <div className="createLicensePlate CrxCreateUser CreatLicensePlateUi LicensePlateSearchComponents">
                <div >

                </div>
                <div >
                    <div className='CrxIndicates'>
                        <sup>*</sup> {t("Indicates_required_field")}
                    </div>
                    <div className="modalEditCrx">
                        {/* <Formik
                enableReinitialize={true}
                initialValues={HotListPaylod}
                validationSchema={HotListValidationSchema}
                onSubmit={(values) => {
                  console.log("SUBMIT : " + values);
                }}
              > */}
                        {/* {({ setFieldValue, values, errors, isValid, dirty }) => (
                  <Form> */}
                        <div className="CrxEditForm">

                            <Grid container>
                                <Grid item xs={11} sm={12} md={12} lg={5} >
                                    <TextField
                                        required={true}
                                        label={t("License_Plate") + ":"}
                                        value={licensePlatePayload.LicensePlate}
                                        onChange={(e: any) => setFieldValue("LicensePlate", e.target.value)}
                                        error={licensePlatePayload.LicensePlate === ''}
                                        errorMsg={t("License_Plate_field_required")}
                                    />
                                    <div className='dataPickerCustom crxCreateEditDate DeactivationDateUi'>
                                        <label>{t("Date_of_Interest")}: <span className='DateTimeInputLabelReq'><sup>*</sup></span></label>
                                        <CRXInputDatePicker

                                            // value={licensePlatePayload.DateOfInterest}
                                            value={licensePlatePayload.DateOfInterest.includes('.') ? licensePlatePayload.DateOfInterest.split('.')[0] : licensePlatePayload.DateOfInterest}
                                            type='datetime-local'
                                            className='dateTimeInput'
                                            onChange={(e: any) => setFieldValue('DateOfInterest', e.target.value)}
                                            minDate={minStartDate()}
                                            maxDate=''

                                        />
                                        {licensePlatePayload.DateOfInterest === '' ?
                                            <Typography
                                                className="errorStateContent dateTimeFIeldRequiredMsg"
                                                variant="caption"
                                                display="block"
                                                gutterBottom
                                            >
                                                {errorMsgIcon}
                                            </Typography> : ''}

                                    </div>

                                    <TextField
                                        required={false}
                                        label={t("License_Type") + ":"}
                                        value={licensePlatePayload.LicenseType}
                                        onChange={(e: any) => setFieldValue("LicenseType", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("License_Year") + ":"}
                                        value={licensePlatePayload.LicenseYear}
                                        onChange={(e: any) => setFieldValue("LicenseYear", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Agency_Id") + ":"}
                                        value={licensePlatePayload.Agency}
                                        onChange={(e: any) => setFieldValue("Agency", e.target.value)}

                                    />
                                    <TextField
                                        required={false}
                                        label={t("State_Id") + ":"}
                                        value={licensePlatePayload.State}
                                        onChange={(e: any) => setFieldValue("State", e.target.value)}

                                    />
                                    <TextField
                                        required={false}
                                        label={t("First_Name") + ":"}
                                        value={licensePlatePayload.FirstName}
                                        onChange={(e: any) => setFieldValue("FirstName", e.target.value)}

                                    />
                                    <TextField
                                        required={false}
                                        label={t("Last_Name") + ":"}
                                        value={licensePlatePayload.LastName}
                                        onChange={(e: any) => setFieldValue("LastName", e.target.value)}

                                    />
                                    <TextField
                                        required={false}
                                        label={t("Notes") + ":"}
                                        value={licensePlatePayload.Notes}
                                        onChange={(e: any) => setFieldValue("Notes", e.target.value)}
                                        multiline={true}
                                    />
                                </Grid>
                                <div className='grid_spacer' />

                                <Grid item xs={11} sm={12} md={12} lg={5} >
                                    <div className="">
                                        <div className="">
                                            <TextField
                                                required={false}
                                                label={t("Alias") + ":"}
                                                value={licensePlatePayload.Alias}
                                                onChange={(e: any) => setFieldValue("Alias", e.target.value)}
                                            />

                                            <TextField
                                                required={false}
                                                label={t("Vehicle_Year") + ":"}
                                                value={licensePlatePayload.VehicleYear}
                                                onChange={(e: any) => setFieldValue("VehicleYear", e.target.value)}
                                            />
                                            <TextField
                                                required={false}
                                                label={t("Vehicle_Make") + ":"}
                                                value={licensePlatePayload.VehicleMake}
                                                onChange={(e: any) => setFieldValue("VehicleMake", e.target.value)}
                                            />
                                            <TextField
                                                required={false}
                                                label={t("Vehicle_Model") + ":"}
                                                value={licensePlatePayload.VehicleModel}
                                                onChange={(e: any) => setFieldValue("VehicleModel", e.target.value)}
                                            />
                                            <TextField
                                                required={false}
                                                label={t("Vehicle Color") + ":"}
                                                value={licensePlatePayload.VehicleColor}
                                                onChange={(e: any) => setFieldValue("VehicleColor", e.target.value)}
                                            />
                                            <TextField
                                                required={false}
                                                label={t("Vehicle Style") + ":"}
                                                value={licensePlatePayload.VehicleStyle}
                                                onChange={(e: any) => setFieldValue("VehicleStyle", e.target.value)}
                                            />

                                            <TextField
                                                required={false}
                                                label={t("NCIC_Number") + ":"}
                                                value={licensePlatePayload.NcicNumber}
                                                onChange={(e: any) => setFieldValue("NcicNumber", e.target.value)}
                                            />
                                            <div style={{ marginTop: '99px' }}>
                                                <TextField
                                                    required={false}
                                                    multiline={true}
                                                    label={t("Violation_Info") + ":"}
                                                    value={licensePlatePayload.ViolationInfo}
                                                    onChange={(e: any) => setFieldValue("ViolationInfo", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className='crxFooterEditFormBtn'>
                            <div className='__crxFooterBtnUser__'>
                                <CRXButton className='primary'
                                    disabled={saveBtnDisable}
                                  onClick={() => onSubmit(licensePlatePayload)}
                                >
                                    {t("Save")}
                                </CRXButton>

                                <Link to={urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url} className="btnCancelAssign">
                                    {t("Cancel")}
                                </Link>
                            </div>
                            <div className='__crxFooterBtnUser__'>
                                <CRXButton
                                    onClick={closeDialog}
                                    className="groupInfoTabButtons-Close secondary"
                                    color="secondary"
                                    variant="outlined"
                                >
                                    Close
                                </CRXButton>
                            </div>
                        </div>

                        <CRXConfirmDialog
                            setIsOpen={() => { setIsOpen(false) }}
                            onConfirm={handleClose}
                            isOpen={isOpen}
                            className="Categories_Confirm"
                            primary={t("Yes_close")}
                            secondary={t("No,_do_not_close")}
                            text="retention policy form"
                        >
                            <div className="confirmMessage">
                                {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" form"}
                                <strong>{ }</strong>. {t("If_you_close_the_form")},
                                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                                <div className="confirmMessageBottom">
                                    {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                                </div>
                            </div>
                        </CRXConfirmDialog>


                        {/* </Form> */}
                        {/* )}
              </Formik> */}
                    </div>



                </div>
            </div>
        </div >
    )
}

export default LicensePlateDetail;