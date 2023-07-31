import { CRXMultiSelectBoxLight, TextField ,NumberField} from "@cb/shared";
import { Grid } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {  HotListDataSourceTemplate } from "../../../../utils/Api/models/HotListDataSourceModels";
import './DataSourceDetail.scss';
import { useParams } from "react-router-dom";
import {SourceTypeDropDown,ConnectionTypeDropDown} from '../../GlobalDropdown'

const DataSourceInitialData: HotListDataSourceTemplate = {
    recId: 0,
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
    port: 21,
    lastRun: '',
    status: "",
    statusDesc: "",
    ftpPath:"",
    sourceType: { recId: 10002, sourceTypeName: 'CSV' },
}
const DataSourceDetail = (props: any) => {
    const { id } = useParams<{ id: string }>();//get data from url 
    const { t } = useTranslation<string>();

    //Initial state Payload 
    const [dataSourcePaylod, setDataSourcePaylod] = React.useState<HotListDataSourceTemplate>(DataSourceInitialData);

    useEffect(() => {
        if (Object.keys(props?.dataSourceTabValues).length > 0) {
            setDataSourcePaylod({...props?.dataSourceTabValues.dataSourceData});
        }
    }, [props?.dataSourceTabValues])

    const updateSourceDataInParent=(fieldName:string,updatedValues:any)=>
    {
        switch (fieldName) {
            case 'name':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, name: updatedValues });
                break;
            case 'sourceType':
                let sourceTypeData = {
                    recId: +updatedValues,
                    sourceTypeName: SourceTypeDropDown.filter((x: any) => x.id == updatedValues).length >0 ? SourceTypeDropDown.find((x: any) => x.id == updatedValues)?.label : ''
                };
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, sourceType: sourceTypeData });
                break;
            case 'sourceName':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, sourceName: updatedValues });
                break;
            case 'UserId':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, userId: updatedValues });
                break;
            case 'Password':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, password: updatedValues });
                break;
            case 'ConfirmPassword':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, confirmPassword: updatedValues });
                break;
            case 'ConnectionType':
                if(updatedValues!=='FTP')
                {

                    props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, 
                                                        connectionType: updatedValues,
                                                        ftpPath:'',
                                                        userId:'',
                                                        password:'',
                                                        confirmPassword:'',
                                                        port:21,
                                                        });    
                }else{
                    props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, 
                                                        connectionType: updatedValues ,
                                                        locationPath:''
                                                        });
                }
                break;
            case 'SchedulePeriod':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, schedulePeriod: updatedValues });
                break;
            case 'LocationPath':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, locationPath: updatedValues });
                break;
            case 'ftpPath':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, ftpPath: updatedValues });
                break;
            case 'Port':
                props.setFieldValue('dataSourceData',{ ...dataSourcePaylod, port: updatedValues });
                break;
        
            default:
                break;
        }
    }
    return (
        <div className="Alpr_DataSource_CrxCreate Alpr_CreateDataSource_Ui">
            <div>
                <div>
                    <div className="Alpr_DataSource_CrxEditForm">
                        <Grid container>
                            <Grid item xs={11} sm={12} md={12} lg={5} >
                                <div >
                                    <TextField
                                        id='DataSourceName'
                                        required={true}
                                        label={t("Name") + ':'}
                                        value={props.dataSourceTabValues?.dataSourceData?.name}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('name',true)
                                            updateSourceDataInParent('name',e.target.value)}}
                                            
                                    error={props.touched.name && (props.formValidationError?.dataSourceData?.name ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceData?.name}
                                    />
                                </div>
                                <div className="Alpr_DataSource_CrxEditFilter Alpr_DataSource_EditFilterUi">
                                    <CRXMultiSelectBoxLight

                                        className="Alpr_DataSource_Autocomplete Alpr_CrxDataSource_DropDownEditForm"
                                        label={t("Source_Type") + ':'}
                                        multiple={false}
                                        CheckBox={true}
                                        options={SourceTypeDropDown}
                                        defaultValue={{ id: 10002, label: "CSV" }}
                                        required={false}
                                        isSearchable={true}
                                        value={props.dataSourceTabValues?.dataSourceData?.sourceType?.recId === 0 ? { id: 10002, label: 'CSV' } : 
                                        { id: props.dataSourceTabValues?.dataSourceData?.sourceType?.recId, label: props.dataSourceTabValues?.dataSourceData?.sourceType?.sourceTypeName }}
                                        id='DataSourceType'
                                        onChange={(
                                            e: React.SyntheticEvent,
                                            value: any
                                        ) => {
                                             updateSourceDataInParent('sourceType',value === null ? 10002 : value?.id)
                                        }}
                                        onOpen={(e: any) => {

                                        }}
                                    />
                                </div>
                                <div className='Alpr_DataSource_DropDownSpacing'></div>
                                <div >
                                    <TextField
                                        id='DataSourceTypeName'
                                        required={false}
                                        label={t("Source_Name") + ':'}
                                        value={props.dataSourceTabValues?.dataSourceData?.sourceName}
                                        onChange={(e: any) =>{
                                        updateSourceDataInParent('sourceName',e.target.value)}}

                                        error={(props.formValidationError?.dataSourceData?.sourceName ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.sourceName}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        id='DataSourceSchedulePeriod'
                                        required={false}
                                        label={t("Schedule_Period") + ':'}
                                        multiline={false}
                                        value={props.dataSourceTabValues?.dataSourceData?.schedulePeriod}
                                        onChange={(e: any) =>{
                                        props.setFieldTouched('schedulePeriod',true)
                                        updateSourceDataInParent('SchedulePeriod',e.target.value)}}

                                    error={props.touched.schedulePeriod && (props.formValidationError?.dataSourceData?.schedulePeriod ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceData?.schedulePeriod}
                                    />
                                </div>
                                <div>
                                    <div className="Alpr_DataSource_CrxEditFilter Alpr_DataSource_EditFilterUi">
                                        <CRXMultiSelectBoxLight
                                            id='DataSourceConnectionType'
                                            className="Alpr_DataSource_Autocomplete Alpr_CrxDataSource_DropDownEditForm"
                                            label={t("Connection_Type") + ':'}
                                            multiple={false}
                                            defaultValue={{ id: "FTP", label: "FTP" }}
                                            CheckBox={true}
                                            options={ConnectionTypeDropDown}
                                            required={false}
                                            isSearchable={true}
                                            value={props.dataSourceTabValues?.dataSourceData?.connectionType == "-1" || props.dataSourceTabValues?.dataSourceData?.connectionType === '' ? { id: 'FTP', label: 'FTP' } :
                                                { id: props.dataSourceTabValues?.dataSourceData.connectionType, label: ConnectionTypeDropDown.find((x: any) => x.id === props.dataSourceTabValues?.dataSourceData.connectionType)?.label }}

                                            onChange={(
                                                e: React.SyntheticEvent,
                                                value: any
                                            ) => {
                                                updateSourceDataInParent('ConnectionType',value===null?'FTP':value?.id)}}
                                            onOpen={(e: any) => {

                                            }}
                                        />
                                    </div>
                                    <div className='Alpr_DataSource_DropDownSpacing'></div>
                                </div>
                                {props.dataSourceTabValues?.dataSourceData.connectionType!=='FTP'?
                                <div >
                                    <TextField
                                        id='DataSourceLocationPath'
                                        required={true}
                                        label={t("Location_Path") + ':'}
                                        multiline={false}
                                        value={props.dataSourceTabValues?.dataSourceData.locationPath}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('locationPath',true)
                                        updateSourceDataInParent('LocationPath',e.target.value)}}

                                    error={props.touched.locationPath && (props.formValidationError?.dataSourceData?.locationPath ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceData?.locationPath}
                                    />
                                </div>:
                                <div >
                                <TextField
                                    id='DataSourceLocationPath'
                                    required={false}
                                    label={t("Location_Path") + ':'}
                                    multiline={false}
                                    disabled={true}
                                    value={props.dataSourceTabValues?.dataSourceData.locationPath}
                                    onChange={(e: any) => {
                                        props.setFieldTouched('locationPath',true)
                                    updateSourceDataInParent('LocationPath',e.target.value)}}

                                error={props.touched.locationPath && (props.formValidationError?.dataSourceData?.locationPath ?? "").length > 0}
                                errorMsg={props.formValidationError?.dataSourceData?.locationPath}

                                />
                            </div>
                                }
                                
                            </Grid>
                            <div className='Alpr_DataSource_Grid_Spacer'>
                            </div>
                            <Grid item xs={12} sm={12} md={12} lg={5} >

                               
                                {props.dataSourceTabValues?.dataSourceData.connectionType!=='FTP'?
                                <div>
                                    
                                    <div >
                                        <TextField
                                            id='DataSourceLocationPath'
                                            required={false}
                                            label={t("FTP_Path") + ':'}
                                            multiline={false}
                                            disabled={true}
                                            value={props.dataSourceTabValues?.dataSourceData.ftpPath}
                                            onChange={(e: any) => {
                                                props.setFieldTouched('ftpPath',true)
                                            updateSourceDataInParent('ftpPath',e.target.value)}}

                                        error={props.touched.ftpPath && (props.formValidationError?.dataSourceData?.ftpPath ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.ftpPath}
                                        />
                                    </div>
                                    <div >
                                        <TextField
                                            id='DataSourceUserId'
                                            required={false}
                                            disabled={true}
                                            label={t("User_Id") + ':'}
                                            value={props.dataSourceTabValues?.dataSourceData.userId}
                                            onChange={(e: any) => {
                                                props.setFieldTouched('userId',true)
                                            updateSourceDataInParent('UserId',e.target.value)}}

                                        error={props.touched.userId && (props.formValidationError?.dataSourceData?.userId ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.userId}
                                        />
                                    </div>
                                    
                                    <div >
                                        <TextField
                                            id='DataSourcePassword'
                                            required={false}
                                            disabled={true}
                                            label={t("Password") + ':'}
                                            value={props.dataSourceTabValues?.dataSourceData.password}
                                            type='password'
                                            onChange={(e: any) => {
                                                props.setFieldTouched('password',true)
                                                updateSourceDataInParent('Password',e.target.value)}}

                                            error={props.touched.password && (props.formValidationError?.dataSourceData?.password ??"").length>0}
                                            errorMsg={props.formValidationError?.dataSourceData?.password}
                                        />
                                    </div>
                                    <div >
                                        <TextField
                                            required={false}
                                            disabled={true}
                                            label={t("Confirm_Password") + ':'}
                                            id='DataSourceConfirmPassword'
                                            value={props.dataSourceTabValues?.dataSourceData?.confirmPassword}
                                            type='password'
                                            onChange={(e: any) => {
                                                props.setFieldTouched('confirmPassword',true)
                                                updateSourceDataInParent('ConfirmPassword',e.target.value)}}

                                            error={props.touched.confirmPassword && (props.formValidationError?.dataSourceData?.confirmPassword??"").length>0}
                                            errorMsg={props.formValidationError?.dataSourceData?.confirmPassword}
                                        />
                                    </div>
                                    <div >
                                        <TextField
                                            id='DataSourcePort'
                                            disabled={true}
                                            required={false}
                                            label={t("Port") + ':'}
                                            multiline={false}
                                            value={props.dataSourceTabValues?.dataSourceData.port}
                                            onChange={(e: any) =>{ 
                                                props.setFieldTouched('port',true)
                                            updateSourceDataInParent('Port',e.target.value)}}

                                        error={props.touched.port && (props.formValidationError?.dataSourceData?.port ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.port}
                                        />
                                    </div>
                                </div>
                                :
                                <div>
                                    <div >
                                    <TextField
                                        id='DataSourceLocationPath'
                                        required={true}
                                        label={t("FTP_Path") + ':'}
                                        multiline={false}
                                        value={props.dataSourceTabValues?.dataSourceData.ftpPath}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('ftpPath',true)
                                        updateSourceDataInParent('ftpPath',e.target.value)}}

                                    error={props.touched.ftpPath && (props.formValidationError?.dataSourceData?.ftpPath ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceData?.ftpPath}
                                    />
                                    </div>
                                    <div >
                                        <TextField
                                            id='DataSourceUserId'
                                            required={true}
                                            label={t("User_Id") + ':'}
                                            value={props.dataSourceTabValues?.dataSourceData.userId}
                                            onChange={(e: any) => {
                                                props.setFieldTouched('userId',true)
                                            updateSourceDataInParent('UserId',e.target.value)}}

                                        error={props.touched.userId && (props.formValidationError?.dataSourceData?.userId ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.userId}
                                        />
                                    </div>
                                    
                                    <div >
                                        <TextField
                                            id='DataSourcePassword'
                                            required={true}
                                            label={t("Password") + ':'}
                                            value={props.dataSourceTabValues?.dataSourceData.password}
                                            type='password'
                                            onChange={(e: any) => {
                                                props.setFieldTouched('password',true)
                                                updateSourceDataInParent('Password',e.target.value)}}

                                            error={props.touched.password && (props.formValidationError?.dataSourceData?.password ??"").length>0}
                                            errorMsg={props.formValidationError?.dataSourceData?.password}
                                        />
                                    </div>
                                    <div >
                                        <TextField
                                            required={true}
                                            label={t("Confirm_Password") + ':'}
                                            id='DataSourceConfirmPassword'
                                            value={props.dataSourceTabValues?.dataSourceData?.confirmPassword}
                                            type='password'
                                            onChange={(e: any) => {
                                                props.setFieldTouched('confirmPassword',true)
                                                updateSourceDataInParent('ConfirmPassword',e.target.value)}}

                                            error={props.touched.confirmPassword && (props.formValidationError?.dataSourceData?.confirmPassword??"").length>0}
                                            errorMsg={props.formValidationError?.dataSourceData?.confirmPassword}
                                        />
                                    </div>
                                    <div >
                                        <TextField
                                            id='DataSourcePort'
                                            required={true}
                                            label={t("Port") + ':'}
                                            multiline={false}
                                            value={props.dataSourceTabValues?.dataSourceData.port}
                                            onChange={(e: any) =>{ 
                                                props.setFieldTouched('port',true)
                                            updateSourceDataInParent('Port',e.target.value)}}

                                        error={props.touched.port && (props.formValidationError?.dataSourceData?.port ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceData?.port}
                                        />
                                    </div>
                                </div>}
                            </Grid>
                        </Grid>               
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DataSourceDetail;