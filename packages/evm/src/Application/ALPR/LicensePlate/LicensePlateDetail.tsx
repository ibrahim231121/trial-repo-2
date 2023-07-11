import { TextField } from "@cb/shared";
import { Grid } from "@material-ui/core";
import { Link, useHistory, useParams } from 'react-router-dom';
import "./LicensePlateDetail.scss";
import { CRXInputDatePicker } from "@cb/shared";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef } from "react";
import { LicensePlateTemplate } from "../../../../src/utils/Api/models/HotListLicensePlate";
import { CRXConfirmDialog } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { CRXToaster } from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { AddLicensePlateData, ClearLicensePlateProperty, GetLicensePlateById, UpdateLicensePlateData } from "../../../Redux/AlprLicensePlateReducer";
import { NotificationMessage } from "../../Header/CRXNotifications/notificationsTypes";
import moment from "moment";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { CRXMultiSelectBoxLight } from "@cb/shared";
import { states } from "../GlobalDropdown";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";

const licensePlateInitialData: LicensePlateTemplate = {
    recId: 0,
    ncicNumber: '',
    dateOfInterest: '',
    licensePlate: '',
    stateId: 0,
    licenseYear: '',
    licenseType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleStyle: '',
    vehicleColor: '',
    notes: '',
    insertType: 0,
    createdOn: '',
    lastUpdatedOn: '',
    status: '',
    firstName: '',
    lastName: '',
    alias: '',
    violationInfo: '',
    importSerialId: '',
    agencyId: '',
    vehicleYear: '',
    hotList: '',
    stateName: ''
}

const LicensePlateDetail = (props: any) => {
    const { id } = useParams<{ id: string }>(); //get data from url 
    const history = useHistory();
    const { t } = useTranslation<string>();
    const userMsgFormRef = useRef<typeof CRXToaster>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const licensePlateFormRef = useRef<typeof CRXToaster>(null);
    const [licensePlatePayload, setLicensePlatePayload] = React.useState<LicensePlateTemplate>(licensePlateInitialData);
    const LicensplateData: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensplateData);
    const LicensePlateToasterData: any = useSelector((state: RootState) => state.alprLicensePlateReducer.LicensePlateToasterData);
    const dispatch = useDispatch();
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
    const LicensePlateValidationSchema = Yup.object().shape({
        licensePlate: Yup.string().required(t("LicensePlate_is_required")).min(6, t('Minimum_Lenght_NumberPlate')),
        dateOfInterest: Yup.date().defined(t("DateOfInterest_is_required")),

    });
    const closeDialog = () => {
        setIsOpen(true);
    };
    const errorMsgIconForDoI = (
        <i className="fas fa-exclamation-circle">
            <span className="crxErrorMsg"> {t("Date_of_Interest_field_required")}</span>
        </i>
    );
    const errorMsgIconForLP = (
        <i className="fas fa-exclamation-circle">
            <span className="crxErrorMsg"> {t("License_Plate_field_required")}</span>
        </i>
    );
    const LicensePlateFormMessages = (obj: any) => {
        licensePlateFormRef?.current?.showToaster({
            message: obj.message,
            variant: obj.variant,
            duration: obj.duration,
            clearButtton: true,
        });
    };
    const onMessageShow = (isSuccess: boolean, message: string) => {
        LicensePlateFormMessages({
            message: message,
            variant: isSuccess ? 'success' : 'error',
            duration: 7000
        });
        if (isSuccess) {
            let notificationMessage: NotificationMessage = {
                title: t("License_Plate"),
                message: message,
                type: "success",
                date: moment(moment().toDate())
                    .local()
                    .format("YYYY/MM/DD HH:mm:ss"),
            };
            dispatch(addNotificationMessages(notificationMessage));
        }
    };
    const handleClose = () => {
        history.push(
            urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url
        );
        setIsOpen(false)
    };
    const onSubmit = (values: any) => {
        if (id)//for updation
        {
            let params = { id: id, body: values }
            dispatch(UpdateLicensePlateData(params))
        }
        else//for Insertion
        {
            let params = { body: values };
            dispatch(AddLicensePlateData(params))
        }

    }

    useEffect(() => {
        if (id != undefined) {
            dispatch(GetLicensePlateById(id));
        }

    }, []);

    useEffect(() => {
        if (id && LicensplateData && LicensplateData?.recId) {
            let objectCopy = LicensplateData;
            objectCopy = { ...objectCopy, dateOfInterest: moment(moment(LicensplateData.dateOfInterest).toDate()).format("YYYY-MM-DD hh:mm") }
            setLicensePlatePayload(objectCopy);

            dispatch(enterPathActionCreator({ val: `License Plate : ${LicensplateData.licensePlate}` }));
        } else {
            setLicensePlatePayload(licensePlateInitialData);
            dispatch(enterPathActionCreator({ val: '' }));
        }
    }, [LicensplateData]);

    useEffect(() => {
        licensePlatePayload.licensePlate !== '' && licensePlatePayload.dateOfInterest !== '' ? setSaveBtnDisable(false) : setSaveBtnDisable(true);

    }, [licensePlatePayload]);

    useEffect(() => {
        if (LicensePlateToasterData.statusCode == "204" || LicensePlateToasterData.statusCode == "201") {
            onMessageShow(true, t("License_Plate_Saved_Successfully"));
            dispatch(ClearLicensePlateProperty('LicensePlateToasterData'));
            history.push(
                urlList.filter((item: any) => item.name === urlNames.LicensePlateList)[0].url
            );
        } else if (LicensePlateToasterData.response) {
            onMessageShow(false, t("An issue occurred while saving, please try again."));
            dispatch(ClearLicensePlateProperty('LicensePlateToasterData'));
        }
    }, [LicensePlateToasterData]);

    return (
        <div>
            <div className="LicensePlate_Create LicensePlate_CrxCreate LicensePlate_CreatUI LicensePlate_SearchComponents">
                <div >
                    <div className='LicensePlateCrxIndicates'>
                        <sup>*</sup> {t("Indicates_required_field")}
                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={licensePlatePayload}
                        validationSchema={LicensePlateValidationSchema}
                        onSubmit={(values) => {
                        }}
                    >
                        {({ setFieldValue, values, errors, isValid, dirty, touched, setFieldTouched }) => (
                            <Form>
                                <div className="LicensePlate_ModalEditCrx">
                                    <div className="CrxEditForm">

                                        <div className="CrxEditForm">
                                            <Grid container>
                                                <Grid item xs={11} sm={12} md={12} lg={5} >
                                                    <div id="lp_div">
                                                        <TextField
                                                            id="LicensePlate"
                                                            required={true}
                                                            label={t("License_Plate") + ":"}
                                                            value={values.licensePlate}
                                                            onChange={(e: any) => {
                                                                setFieldTouched("licensePlate", true)
                                                                setFieldValue("licensePlate", e.target.value)
                                                            }}
                                                            error={touched?.licensePlate && (errors.licensePlate ?? "").length > 0}
                                                            errorMsg={errors.licensePlate}
                                                        />
                                                    </div>

                                                    <div className='dataPickerCustom crxCreateEditDate DeactivationDateUi'>
                                                        <label>{t("Date_of_Interest")}: <span className='DateTimeInputLabelReq'><sup>*</sup></span></label>
                                                        <CRXInputDatePicker
                                                            id="dateOfInterest"
                                                            value={values.dateOfInterest}
                                                            type='datetime-local'
                                                            className='dateTimeInput'
                                                            minDate={''}
                                                            maxDate={''}
                                                            required={true}
                                                            onChange={(e: any) => {
                                                                setFieldTouched("dateOfInterest", true)
                                                                setFieldValue('dateOfInterest', e.target.value)
                                                            }
                                                            }
                                                            error={touched?.dateOfInterest && (errors.dateOfInterest ?? "").length > 0}
                                                            errorMsg={errors.dateOfInterest}

                                                        />
                                                        {touched?.dateOfInterest && (errors.dateOfInterest ?? "").length > 0 ? (
                                                            <div style={{ marginTop: '40px', marginLeft: '145px' }} className="MuiTypography-root errorStateContent MuiTypography-caption MuiTypography-gutterBottom MuiTypography-displayBlock">
                                                                <i className="fas fa-exclamation-circle">
                                                                    <span className="crxErrorMsg"> {errors.dateOfInterest}</span>
                                                                </i>
                                                            </div>
                                                        ) : null}

                                                    </div>

                                                    <TextField
                                                        id="LicenseType"
                                                        required={false}
                                                        label={t("License_Type") + ":"}
                                                        value={values.licenseType}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("LicenseType", true)
                                                            setFieldValue("licenseType", e.target.value)
                                                        }}
                                                        error={touched?.licenseType && (errors.licenseType ?? "").length > 0}
                                                        errorMsg={errors.licenseType}
                                                    />
                                                    <TextField
                                                        id="LicenseYear"
                                                        required={false}
                                                        label={t("License_Year") + ":"}
                                                        value={values.licenseYear}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("LicenseYear", true)
                                                            setFieldValue("licenseYear", e.target.value)
                                                        }}
                                                        error={touched?.licenseYear && (errors.licenseYear ?? "").length > 0}
                                                        errorMsg={errors.licenseYear}
                                                    />
                                                    <TextField
                                                        id="Agency"
                                                        required={false}
                                                        label={t("Agency_Id") + ":"}
                                                        value={values.agencyId}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("Agency", true)
                                                            setFieldValue("agencyId", e.target.value)
                                                        }}
                                                        error={touched?.agencyId && (errors.agencyId ?? "").length > 0}
                                                        errorMsg={errors.agencyId}
                                                    />
                                                    <div className="LicensePlate_CrxEditFilter LicensePlate_EditFilterUi">
                                                        <CRXMultiSelectBoxLight
                                                            className="CrxUserEditForm"
                                                            id="State"
                                                            label={t("State") + ':'}
                                                            multiple={false}
                                                            CheckBox={true}
                                                            options={states}
                                                            required={false}
                                                            isSearchable={true}
                                                            value={{ id: values.stateId, label: states.find((x) => x.id == values.stateId)?.label }}
                                                            onChange={(
                                                                e: React.SyntheticEvent,
                                                                value: any
                                                            ) => {
                                                                setFieldTouched("state", true)
                                                                setFieldValue("stateId", value == null ? 0 : Number.parseInt(value?.id))
                                                            }
                                                            }
                                                            error={touched?.agencyId && (errors.agencyId ?? "").length > 0}
                                                            errorMsg={errors.agencyId}
                                                        />
                                                    </div>
                                                    <TextField
                                                        id="firstName"
                                                        required={false}
                                                        label={t("First_Name") + ":"}
                                                        value={values.firstName}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("firstName", true)
                                                            setFieldValue("firstName", e.target.value)
                                                        }}
                                                        error={touched?.firstName && (errors.firstName ?? "").length > 0}
                                                        errorMsg={errors.firstName}
                                                    />

                                                    <TextField
                                                        id="lastName"
                                                        required={false}
                                                        label={t("Last_Name") + ":"}
                                                        value={values.lastName}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("lastName", true)
                                                            setFieldValue("lastName", e.target.value)
                                                        }}
                                                        error={touched?.lastName && (errors.lastName ?? "").length > 0}
                                                        errorMsg={errors.lastName}
                                                    />

                                                    <TextField
                                                        id="Notes"
                                                        required={false}
                                                        label={t("Notes") + ":"}
                                                        value={values.notes}
                                                        multiline={true}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("Notes", true)
                                                            setFieldValue("notes", e.target.value)
                                                        }}
                                                        error={touched?.notes && (errors.notes ?? "").length > 0}
                                                        errorMsg={errors.notes}
                                                    />
                                                </Grid>

                                                <div className='grid_spacer' />
                                                <Grid item xs={11} sm={12} md={12} lg={5} >
                                                    <TextField
                                                        id="Alias"
                                                        required={false}
                                                        label={t("Alias") + ":"}
                                                        value={values.alias}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("Alias", true)
                                                            setFieldValue("alias", e.target.value)
                                                        }}
                                                        error={touched?.alias && (errors.alias ?? "").length > 0}
                                                        errorMsg={errors.alias}
                                                    />

                                                    <TextField
                                                        id="VehicleYear"
                                                        required={false}
                                                        label={t("Vehicle_Year") + ":"}
                                                        value={values.vehicleYear}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("VehicleYear", true)
                                                            setFieldValue("vehicleYear", e.target.value)
                                                        }}
                                                        error={touched?.vehicleYear && (errors.vehicleYear ?? "").length > 0}
                                                        errorMsg={errors.vehicleYear}
                                                    />

                                                    <TextField
                                                        id="VehicleMake"
                                                        required={false}
                                                        label={t("Vehicle_Make") + ":"}
                                                        value={values.vehicleMake}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("VehicleMake", true)
                                                            setFieldValue("vehicleMake", e.target.value)
                                                        }}
                                                        error={touched?.vehicleMake && (errors.vehicleMake ?? "").length > 0}
                                                        errorMsg={errors.vehicleMake}
                                                    />

                                                    <TextField
                                                        id="VehicleModel"
                                                        required={false}
                                                        label={t("Vehicle_Model") + ":"}
                                                        value={values.vehicleModel}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("VehicleModel", true)
                                                            setFieldValue("vehicleModel", e.target.value)
                                                        }}
                                                        error={touched?.vehicleModel && (errors.vehicleModel ?? "").length > 0}
                                                        errorMsg={errors.vehicleModel}
                                                    />

                                                    <TextField
                                                        id="VehicleColor"
                                                        required={false}
                                                        label={t("Vehicle_Color") + ":"}
                                                        value={values.vehicleColor}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("VehicleColor", true)
                                                            setFieldValue("vehicleColor", e.target.value)
                                                        }}
                                                        error={touched?.vehicleColor && (errors.vehicleColor ?? "").length > 0}
                                                        errorMsg={errors.vehicleColor}
                                                    />

                                                    <TextField
                                                        id="VehicleStyle"
                                                        required={false}
                                                        label={t("Vehicle_Style") + ":"}
                                                        value={values.vehicleStyle}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("VehicleStyle", true)
                                                            setFieldValue("vehicleStyle", e.target.value)
                                                        }}
                                                        error={touched?.vehicleStyle && (errors.vehicleStyle ?? "").length > 0}
                                                        errorMsg={errors.vehicleStyle}
                                                    />

                                                    <TextField
                                                        id="NcicNumber"
                                                        required={false}
                                                        label={t("NCIC_Number") + ":"}
                                                        value={values.ncicNumber}
                                                        onChange={(e: any) => {
                                                            setFieldTouched("NcicNumber", true)
                                                            setFieldValue("ncicNumber", e.target.value)
                                                        }}
                                                        error={touched?.ncicNumber && (errors.ncicNumber ?? "").length > 0}
                                                        errorMsg={errors.ncicNumber}
                                                    />

                                                    {
                                                        !id ? <div /> :
                                                            <TextField
                                                                id="HotList"
                                                                required={false}
                                                                label={t("Hot_List") + ":"}
                                                                value={values.hotList}
                                                                disabled={true}
                                                            />
                                                    }

                                                    <div >
                                                        <TextField
                                                            id="ViolationInfo"
                                                            required={false}
                                                            multiline={true}
                                                            label={t("Violation_Info") + ":"}
                                                            value={values.violationInfo}
                                                            onChange={(e: any) => {
                                                                setFieldTouched("ViolationInfo", true)
                                                                setFieldValue("violationInfo", e.target.value)
                                                            }}
                                                            error={touched?.violationInfo && (errors.violationInfo ?? "").length > 0}
                                                            errorMsg={errors.violationInfo}
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>


                                    </div>
                                    <div className='crxFooterEditFormBtn'>
                                        <div className='__crxFooterBtnUser__'>
                                            <CRXButton className='primary'
                                                disabled={!isValid || !dirty}
                                                onClick={() => onSubmit(values)}
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
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div >
    )
}

export default LicensePlateDetail;