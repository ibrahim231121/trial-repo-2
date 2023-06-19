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
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {SourceTypeDropDown,ConnectionTypeDropDown} from '../../GlobalDropdown'


const DataSourceInitialData: HotListDataSourceTemplate = {
    syserial: 0,
    sourceTypeId: 0,
    name: '',
    sourceName: "",
    sourceTypeName: '',
    userId: "",
    password: "",
    confirmPassword: "",
    connectionType: '',
    schedulePeriod: '',
    locationPath: "",
    port: "",
    lastRun: '',
    status: "",
    statusDesc: "",
    sourceType: { sysSerial: 10002, sourceTypeName: 'CSV' }
    // mappingFields: mappingInitialData
}
const DataSourceDetail = (props: any) => {
    const { id } = useParams<{ id: string }>();//get data from url 
    const classes: any = useStyles();
    const { t } = useTranslation<string>();

    //Initial state Payload 
    const [dataSourcePaylod, setDataSourcePaylod] = React.useState<HotListDataSourceTemplate>(DataSourceInitialData);

    //Use effect to check validation in initial payload state everytime whenever any changes occurs in text boxes
    useEffect(() => {
        if (id === ':id' && dataSourcePaylod?.name !== "" && dataSourcePaylod.password && dataSourcePaylod?.confirmPassword && dataSourcePaylod.password !== '' && dataSourcePaylod?.confirmPassword !== ''
            && dataSourcePaylod?.confirmPassword.toUpperCase() === dataSourcePaylod?.password.toUpperCase()) {
            props.saveButtonDisable(false);
            props.dataSource(dataSourcePaylod);
        }
        else if (id !== ':id' && dataSourcePaylod?.name !== "" && dataSourcePaylod?.confirmPassword.toUpperCase() === dataSourcePaylod?.password.toUpperCase()) {
            props.saveButtonDisable(false);
            props.dataSource(dataSourcePaylod);
        }
        else {
            props.saveButtonDisable(true)
        }
    }, [dataSourcePaylod]);

    useEffect(() => {
        if (Object.keys(props?.dataSourceData).length > 0) {
            setDataSourcePaylod(props?.dataSourceData);
        }
    }, [props?.dataSourceData])
    // on text box change function
    const setFieldValue = (field: string, e: any) => {
        if (field === "Name") {
            const lengthRegex=/^.{0,50}$/;
            if(lengthRegex.test(e)===true)
            setDataSourcePaylod({ ...dataSourcePaylod, name: e });
        }
        else if (field === "SourceType") {
            let sourceTypeData = {
                sysSerial: +e,
                sourceTypeName: SourceTypeDropDown.filter((x: any) => x.id == e).length >0 ? SourceTypeDropDown.find((x: any) => x.id == e)?.label : ''
            };
            setDataSourcePaylod({ ...dataSourcePaylod, sourceType: sourceTypeData });
        }
        else if (field === "SourceName") {
            const lengthRegex=/^.{0,50}$/;
            if(lengthRegex.test(e))
            setDataSourcePaylod({ ...dataSourcePaylod, sourceName: e });
        }
        else if (field === "UserId") {
            const lengthRegex=/^.{0,50}$/;
            if(lengthRegex.test(e))
            setDataSourcePaylod({ ...dataSourcePaylod, userId: e });
        }
        else if (field === "Password") {
            const lengthRegex=/^.{0,50}$/;
            if(lengthRegex.test(e))
            setDataSourcePaylod({ ...dataSourcePaylod, password: e });
        }
        else if (field === "ConfirmPassword") {
            const lengthRegex=/^.{0,50}$/;
            if(lengthRegex.test(e))
            setDataSourcePaylod({ ...dataSourcePaylod, confirmPassword: e });
        }
        else if (field === "ConnectionType") {
            setDataSourcePaylod({ ...dataSourcePaylod, connectionType: e });
        }
        else if (field === "SchedulePeriod") {
            const lengthRegex=/^\d{0,10}$/;
            if(lengthRegex.test(e) || e==='')
            setDataSourcePaylod({ ...dataSourcePaylod, schedulePeriod: e });
        }
        else if (field === "LocationPath") {
            const lengthRegex=/^.{0,100}$/;
            if(lengthRegex.test(e))
            setDataSourcePaylod({ ...dataSourcePaylod, locationPath: e });
        }
        else if (field === "Port") {
            const lengthRegex=/^\d{0,10}$/;
            if(lengthRegex.test(e) || e==='')
            setDataSourcePaylod({ ...dataSourcePaylod, port: e });
        }

    }

    return (
        <div className="CrxCreateDataSource CreateDataSourceUi">
            <div >

                <div className="modalEditCrx">
                    <div className="CrxEditForm">
                        <Grid container>
                            <Grid item xs={11} sm={12} md={12} lg={5} >
                                <div >
                                    <TextField
                                        id='DataSourceName'
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

                                        className="DataSourceAutocomplete CrxDataSourceDropDownEditForm"
                                        label={t("Source_Type") + ':'}
                                        // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                        multiple={false}
                                        CheckBox={true}
                                        options={SourceTypeDropDown}
                                        defaultValue={{ id: 10002, label: "CSV" }}
                                        required={false}
                                        isSearchable={true}
                                        value={dataSourcePaylod?.sourceType?.sysSerial === 0 ? { id: 10002, label: 'CSV' } : 
                                        { id: dataSourcePaylod?.sourceType?.sysSerial, label: dataSourcePaylod?.sourceType?.sourceTypeName }}
                                        id='DataSourceType'
                                        onChange={(
                                            e: React.SyntheticEvent,
                                            value: any
                                        ) => {
                                            setFieldValue("SourceType", value === null ? 10002 : Number.parseInt(value?.id))
                                        }}
                                        onOpen={(e: any) => {

                                        }}
                                    />
                                </div>
                                <div className={classes.DataSourceDropDown}></div>
                                <div >
                                    <TextField
                                        id='DataSourceTypeName'
                                        required={false}
                                        label={t("Source_Name") + ':'}
                                        value={dataSourcePaylod.sourceName}
                                        onChange={(e: any) => setFieldValue("SourceName", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        id='DataSourceUserId'
                                        required={false}
                                        label={t("User_Id") + ':'}
                                        value={dataSourcePaylod.userId}
                                        onChange={(e: any) => setFieldValue("UserId", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        id='DataSourcePassword'
                                        required={true}
                                        label={t("Password") + ':'}
                                        value={dataSourcePaylod.password}
                                        onChange={(e: any) => setFieldValue("Password", e.target.value)}
                                        error={id === ':id' && dataSourcePaylod.password === ''}
                                        errorMsg={t("Password_is_required")}
                                    />
                                </div>
                                <div >
                                    <TextField
                                        required={true}
                                        label={t("Confirm_Password") + ':'}
                                        id='DataSourceConfirmPassword'
                                        value={dataSourcePaylod.confirmPassword}
                                        onChange={(e: any) => setFieldValue("ConfirmPassword", e.target.value)}
                                        error={dataSourcePaylod.password.length > 0 && dataSourcePaylod.password !== dataSourcePaylod.confirmPassword}
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
                                            id='DataSourceConnectionType'
                                            className="DataSourceAutocomplete CrxDataSourceDropDownEditForm"
                                            label={t("Connection_Type") + ':'}
                                            // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
                                            multiple={false}
                                            defaultValue={{ id: "FTP", label: "FTP" }}
                                            CheckBox={true}
                                            options={ConnectionTypeDropDown}
                                            required={false}
                                            isSearchable={true}
                                            value={dataSourcePaylod?.connectionType == "-1" || dataSourcePaylod?.connectionType === '' ? { id: 'FTP', label: 'FTP' } :
                                                { id: dataSourcePaylod.connectionType, label: ConnectionTypeDropDown.find((x: any) => x.id === dataSourcePaylod.connectionType)?.label }}

                                            onChange={(
                                                e: React.SyntheticEvent,
                                                value: any
                                            ) => {
                                                setFieldValue("ConnectionType", value === null ? 'FTP' : value?.id)
                                            }}
                                            onOpen={(e: any) => {

                                            }}
                                        />
                                    </div>
                                    <div className={classes.DataSourceDropDown}></div>
                                </div>
                                <div >
                                    <TextField
                                        id='DataSourceSchedulePeriod'
                                        required={false}
                                        label={t("Schedule_Period") + ':'}
                                        multiline={false}
                                        value={dataSourcePaylod?.schedulePeriod}
                                        onChange={(e: any) => setFieldValue("SchedulePeriod", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        id='DataSourceLocationPath'
                                        required={false}
                                        label={t("Location_Path") + ':'}
                                        multiline={false}
                                        value={dataSourcePaylod.locationPath}
                                        onChange={(e: any) => setFieldValue("LocationPath", e.target.value)}

                                    />
                                </div>
                                <div >
                                    <TextField
                                        id='DataSourcePort'
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