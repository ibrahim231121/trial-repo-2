import { CRXAlert } from "@cb/shared";
import { CRXToaster } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { CRXMultiSelectBoxLight, TextField } from "@cb/shared";
import { CRXConfirmDialog } from "@cb/shared";
import { Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HotListDataSourceMappingTemplate, HotListDataSourceTemplate } from "../../../../utils/Api/models/HotListDataSourceModels";
import './DataSourceDetail.scss';
import { useStyles } from "../DataSourceStyling/DataSource";
import * as Yup from "yup";
import { urlList, urlNames } from "../../../../utils/urlList";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
import { ConnectionTypeDropDown, GetAlprDataSourceList, SourceTypeDropDown } from "../../../../Redux/AlprDataSourceReducer"


const DataSourceInitialData: HotListDataSourceTemplate = {
    syserial: 0,
    sourceTypeId: 0,
    name: '',
    sourceName: "",
    sourceTypeName: '',
    user: "",
    password: "",
    confirmPassword: "",
    connectionType: '',
    schedulePeriod: '',
    locationPath: "",
    port: "",
    lastRun: '',
    status: "",
    statusDesc: "",
    sourceType:{sysSerial:0,sourceTypeName:''}
    // mappingFields: mappingInitialData
}
const DataSourceDetail = (props: any) => {
    const { id } = useParams<{ id: string }>();//get data from url 
    const classes: any = useStyles();
    const { t } = useTranslation<string>();
    const history = useHistory();
    const dispatch = useDispatch();
    const [alprDataSource, setalprDataSource] = React.useState<HotListDataSourceTemplate>(DataSourceInitialData);
    //flag when all validation passed
    const [validationFlag, setvalidationFlag] = React.useState<boolean>(true);

    
    //Source Options DropDown
    const SourceOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.SourceType);
    // const [SourceOptions, setSourceOptions] = React.useState<any>();

    //Connection Type DropDown from redux
    const ConnectionTypeOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.ConnectionType);

    //Initial state Payload 
    const [dataSourcePaylod, setDataSourcePaylod] = React.useState<HotListDataSourceTemplate>(DataSourceInitialData);

    //Use effect to check validation in initial payload state everytime whenever any changes occurs in text boxes
    useEffect(() => {
        if (dataSourcePaylod?.name !== "" && dataSourcePaylod.password && dataSourcePaylod?.confirmPassword && dataSourcePaylod?.confirmPassword.toUpperCase() === dataSourcePaylod?.password.toUpperCase()) {
            props.saveButtonDisable(false);
            props.dataSource(dataSourcePaylod);
        }
        else {
            props.saveButtonDisable(true)
        }
    }, [dataSourcePaylod]);

    useEffect(() => {
        if (props?.dataSourceData) {

            setDataSourcePaylod(props?.dataSourceData);

        }
    }, [alprDataSource]);

    useEffect(() => {
        console.log(props?.dataSourceData)
        if (Object.keys(props?.dataSourceData).length > 0) {
            setalprDataSource(props?.dataSourceData)
            setDataSourcePaylod(props?.dataSourceData);
            dispatch(ConnectionTypeDropDown());
            dispatch(SourceTypeDropDown());
        }
    }, [props?.dataSourceData])
    // on text box change function
    const setFieldValue = (field: string, e: any) => {
        if (field === "Name") {
            setDataSourcePaylod({ ...dataSourcePaylod, name: e });
        }
        else if (field === "SourceType") {
            console.log(e)
            let sourceTypeData={sysSerial:+e,
                sourceTypeName:SourceOptions.find((x:any)=>x.id==e)?.label};
            setDataSourcePaylod({ ...dataSourcePaylod, sourceType: sourceTypeData });
        }
        else if (field === "SourceName") {
            setDataSourcePaylod({ ...dataSourcePaylod, sourceName: e });
        }
        else if (field === "UserId") {
            setDataSourcePaylod({ ...dataSourcePaylod, user: e });
        }
        else if (field === "Password") {
            setDataSourcePaylod({ ...dataSourcePaylod, password: e });
        }
        else if (field === "ConfirmPassword") {
            setDataSourcePaylod({ ...dataSourcePaylod, confirmPassword: e });
        }
        else if (field === "ConnectionType") {
            setDataSourcePaylod({ ...dataSourcePaylod, connectionType: e });
        }
        else if (field === "SchedulePeriod") {
            setDataSourcePaylod({ ...dataSourcePaylod, schedulePeriod: e });
        }
        else if (field === "LocationPath") {
            setDataSourcePaylod({ ...dataSourcePaylod, locationPath: e });
        }
        else if (field === "Port") {
            setDataSourcePaylod({ ...dataSourcePaylod, port: e });
        }

    }

    return (
        <div className="CrxCreateDataSource CreateDataSourceUi">
            <div >

                <div className="modalEditCrx">
                    {/* <Formik
                        enableReinitialize={true}
                        initialValues={DataSourcePaylod}
                        validationSchema={DataSourceValidationSchema}
                        onSubmit={(values) => {
                            console.log("SUBMIT : " + values);
                        }}
                    >
                        {({ setFieldValue, values, errors, isValid }) => (
                            <Form> */}
                    <div className="CrxEditForm">
                        <Grid container>
                            <Grid item xs={11} sm={12} md={12} lg={5} >
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Name") + ':'}
                                        value={dataSourcePaylod.name}
                                        onChange={(e: any) => setFieldValue("Name", e.target.value)}
                                        error={dataSourcePaylod.name === ''}
                                        errorMsg={t("Name_field_required")}
                                    />
                                </div>
                                <div className="crxEditFilter editFilterUi">
                                    <CRXMultiSelectBoxLight

                                        className="categortAutocomplete CrxUserEditForm"
                                        label={t("Source_Type") + ':'}
                                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                        multiple={false}
                                        CheckBox={true}
                                        options={SourceOptions}
                                        required={false}
                                        isSearchable={true}
                                        value={dataSourcePaylod?.sourceType?.sysSerial === 0 ? "" : { id: dataSourcePaylod?.sourceType?.sysSerial, label: dataSourcePaylod?.sourceType?.sourceTypeName }}

                                        onChange={(
                                            e: React.SyntheticEvent,
                                            value: any
                                        ) => {
                                            setFieldValue("SourceType", value === null ? -1 : Number.parseInt(value?.id))
                                        }}
                                        onOpen={(e: any) => {

                                        }}
                                    />
                                </div>
                                <div className={classes.DataSourceDropDown}></div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Source_Name") + ':'}
                                        value={dataSourcePaylod.sourceName}
                                        onChange={(e: any) => setFieldValue("SourceName", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("User_Id") + ':'}
                                        value={dataSourcePaylod.user}
                                        onChange={(e: any) => setFieldValue("UserId", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Password") + ':'}
                                        value={dataSourcePaylod.password}
                                        onChange={(e: any) => setFieldValue("Password", e.target.value)}
                                        error={dataSourcePaylod.password === ''}
                                        errorMsg={t("Password_is_required")}
                                    // onBlur={(e: any) => checkRequiredFields(e.target.value)}
                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Confirm_Password") + ':'}
                                        value={dataSourcePaylod.confirmPassword}
                                        onChange={(e: any) => setFieldValue("ConfirmPassword", e.target.value)}
                                        error={dataSourcePaylod.password !== dataSourcePaylod.confirmPassword}
                                        errorMsg={t("Password_didn't_match")}
                                    />
                                </div>
                            </Grid>
                            <div className='grid_spacer'>
                            </div>
                            <Grid item xs={12} sm={12} md={12} lg={5} >

                                <div >
                                    <div className="crxEditFilter editFilterUi">
                                        <CRXMultiSelectBoxLight

                                            className="categortAutocomplete CrxUserEditForm"
                                            label={t("Connection_Type") + ':'}
                                            // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                            multiple={false}
                                            CheckBox={true}
                                            options={ConnectionTypeOptions}
                                            required={false}
                                            isSearchable={true}
                                            value={dataSourcePaylod.connectionType === '' ? { id: 1, label: 'FTP' } :
                                                { id: dataSourcePaylod.connectionType, label: ConnectionTypeOptions.find((x: any) => x.id === dataSourcePaylod.connectionType)?.label }}

                                            onChange={(
                                                e: React.SyntheticEvent,
                                                value: any
                                            ) => {
                                                setFieldValue("ConnectionType", value === null ? -1 : Number.parseInt(value?.id))
                                            }}
                                            onOpen={(e: any) => {

                                            }}
                                        />
                                    </div>
                                    <div className={classes.DataSourceDropDown}></div>
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Schedule_Period") + ':'}
                                        multiline={false}
                                        value={dataSourcePaylod?.schedulePeriod}
                                        onChange={(e: any) => setFieldValue("SchedulePeriod", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Location_Path") + ':'}
                                        multiline={false}
                                        value={dataSourcePaylod.locationPath}
                                        onChange={(e: any) => setFieldValue("LocationPath", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Port") + ':'}
                                        multiline={false}
                                        value={dataSourcePaylod.port}
                                        onChange={(e: any) => setFieldValue("Port", e.target.value)}

                                    />
                                </div>

                            </Grid>
                        </Grid>
                    </div>

                </div>



            </div>
        </div>
    );
}


export default DataSourceDetail;