import { CRXAlert } from "@cb/shared";
import { CRXToaster } from "@cb/shared";
import { CRXButton } from "@cb/shared";
import { CRXMultiSelectBoxLight, TextField } from "@cb/shared";
import { CRXConfirmDialog } from "@cb/shared";
import { Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HotListDataSourceTemplate } from "../../../../utils/Api/models/HotListDataSourceModels";
import './DataSourceDetail.scss';
import { useStyles } from "../DataSourceStyling/DataSource";
import * as Yup from "yup";
import { urlList, urlNames } from "../../../../utils/urlList";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
import { ConnectionTypeDropDown, GetAlprDataSourceList, SourceTypeDropDown } from "../../../../Redux/AlprDataSourceReducer"
const DataSourceDetail = (props: any) => {
    const { id } = useParams<{ id: string }>();//get data from url 
    const classes: any = useStyles();
    const { t } = useTranslation<string>();
    const history = useHistory();
    const dispatch = useDispatch();
    const [alprDataSource, setalprDataSource] = React.useState<any>([]);
    //flag when all validation passed
    const [validationFlag, setvalidationFlag] = React.useState<boolean>(true);

    //On Save Button Click

    // const onSubmit = () => {
    //     let GridData=[];
    //     if (parseInt(id) > 0) {
    //         let selectedData = GridData?.filter((item: any) => { return (item.id == id) });
    //         let indexNew = GridData.indexOf(selectedData[0])
    //         let keys = Object.keys(selectedData[0])

    //         let newDataObject = selectedData[0]

    //         keys.map((item: any) => {
    //             newDataObject = { ...newDataObject, [item]: values[item] }
    //         })
    //         let newGridData = [...GridData]

    //         newGridData.map((item: any, index: any) => {
    //             if (index == indexNew) {
    //                 newGridData[index] = newDataObject
    //             }
    //         })
    //         dispatch(UpdateHotListData({ newGridData }));
    //     }
    //     //else//Insertion
    //     //{
    //     //}
    //     history.push(
    //         urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
    //     );
    // }

    //Source Options DropDown
    const SourceOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.SourceType);
    // const [SourceOptions, setSourceOptions] = React.useState<any>();

    //Connection Type DropDown from redux
    const ConnectionTypeOptions: any = useSelector((state: RootState) => state.alprDataSourceReducer.ConnectionType);

    //Initial state Payload 
    const [DataSourcePaylod, setDataSourcePaylod] = React.useState<HotListDataSourceTemplate>({
        id: 0,
        Name: '',
        SourceName: "",
        SourceType: 0,
        UserId: "",
        Password: "",
        ConfirmPassword: "",
        ConnectionType: 0,
        SchedulePeriod: 0,
        LocationPath: "",
        Port: "",
        LastRun: '',
        Status: "",
        StatusDescription: "",
    });

    //Use effect to check validation in initial payload state everytime whenever any changes occurs in text boxes
    useEffect(() => {
        if (DataSourcePaylod.Name !== "" && DataSourcePaylod.Password !== "" && DataSourcePaylod.ConfirmPassword.toUpperCase() === DataSourcePaylod.Password.toUpperCase()) {
            props.saveButtonDisable(false);
            props.dataSource(DataSourcePaylod);
        }
        else {
            props.saveButtonDisable(true)
        }
    }, [DataSourcePaylod]);
    
    useEffect(() => {
        if (alprDataSource !== undefined) {
            let selectedRow = alprDataSource.filter((x: any) => x.id == id);
            if (selectedRow !== undefined && selectedRow !== null && selectedRow.length > 0) {
                setDataSourcePaylod(selectedRow[0]);
            }
        }
    }, [alprDataSource]);

    useEffect(() => {
        setalprDataSource(props.DataSourceData)
        dispatch(ConnectionTypeDropDown());
        dispatch(SourceTypeDropDown());
    }, [])
    // on text box change function
    const setFieldValue = (field: string, e: any) => {
        if (field === "Name") {
            setDataSourcePaylod({ ...DataSourcePaylod, Name: e });
        }
        else if (field === "SourceType") {
            setDataSourcePaylod({ ...DataSourcePaylod, SourceType: e });
        }
        else if (field === "SourceName") {
            setDataSourcePaylod({ ...DataSourcePaylod, SourceName: e });
        }
        else if (field === "UserId") {
            setDataSourcePaylod({ ...DataSourcePaylod, UserId: e });
        }
        else if (field === "Password") {
            setDataSourcePaylod({ ...DataSourcePaylod, Password: e });
        }
        else if (field === "ConfirmPassword") {
            setDataSourcePaylod({ ...DataSourcePaylod, ConfirmPassword: e });
        }
        else if (field === "ConnectionType") {
            setDataSourcePaylod({ ...DataSourcePaylod, ConnectionType: e });
        }
        else if (field === "SchedulePeriod") {
            setDataSourcePaylod({ ...DataSourcePaylod, SchedulePeriod: e });
        }
        else if (field === "LocationPath") {
            setDataSourcePaylod({ ...DataSourcePaylod, LocationPath: e });
        }
        else if (field === "Port") {
            setDataSourcePaylod({ ...DataSourcePaylod, Port: e });
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
                                        label={t("Name")+':'}
                                        value={DataSourcePaylod.Name}
                                        onChange={(e: any) => setFieldValue("Name", e.target.value)}
                                        error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name_field_required"}
                                    />
                                </div>
                                <div className="crxEditFilter editFilterUi">
                                    <CRXMultiSelectBoxLight

                                        className="categortAutocomplete CrxUserEditForm"
                                        label={t("Source_Type")+':'}
                                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                        multiple={false}
                                        CheckBox={true}
                                        options={SourceOptions}
                                        required={false}
                                        isSearchable={true}
                                        value={DataSourcePaylod.SourceType === 0 ? "" : { id: DataSourcePaylod.SourceType, label: SourceOptions.find((x: any) => x.id === DataSourcePaylod.SourceType)?.label }}

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
                                        label={t("Source_Name")+':'}
                                        value={DataSourcePaylod.SourceName}
                                        onChange={(e: any) => setFieldValue("SourceName", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("User_Id")+':'}
                                        value={DataSourcePaylod.UserId}
                                        onChange={(e: any) => setFieldValue("UserId", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Password")+':'}
                                        value={DataSourcePaylod.Password}
                                        onChange={(e: any) => setFieldValue("Password", e.target.value)}
                                        error={DataSourcePaylod.Password === ''}
                                        errorMsg={t("Password_is_required")}
                                    // onBlur={(e: any) => checkRequiredFields(e.target.value)}
                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Confirm_Password")+':'}
                                        value={DataSourcePaylod.ConfirmPassword}
                                        onChange={(e: any) => setFieldValue("ConfirmPassword", e.target.value)}
                                        error={DataSourcePaylod.Password !== DataSourcePaylod.ConfirmPassword}
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
                                            label={t("Connection_Type")+':'}
                                            // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                            multiple={false}
                                            CheckBox={true}
                                            options={ConnectionTypeOptions}
                                            required={false}
                                            isSearchable={true}
                                            value={DataSourcePaylod.ConnectionType === 0 ? { id: 1, label: 'FTP' } :
                                                { id: DataSourcePaylod.ConnectionType, label: ConnectionTypeOptions.find((x: any) => x.id === DataSourcePaylod.ConnectionType)?.label }}

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
                                        label={t("Schedule_Period")+':'}
                                        multiline={false}
                                        value={DataSourcePaylod.SchedulePeriod === 0 ? "" : DataSourcePaylod.SchedulePeriod}
                                        onChange={(e: any) => setFieldValue("SchedulePeriod", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Location_Path")+':'}
                                        multiline={false}
                                        value={DataSourcePaylod.LocationPath}
                                        onChange={(e: any) => setFieldValue("LocationPath", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={false}
                                        label={t("Port")+':'}
                                        multiline={false}
                                        value={DataSourcePaylod.Port}
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