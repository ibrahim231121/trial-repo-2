import { TextField } from "@cb/shared";
import { Grid } from "@material-ui/core";
import "./DataSourceMapping.scss"
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { HotListDataSourceMappingTemplate } from "../../../../utils/Api/models/HotlistDataSourceMapping";

const dataSouceInitialPayload={
    LicensePlate: '',
    DateOfInterest: '',
    LicenseType: '',
    Agency: '',
    State: '',
    FirstName: '',
    LastName: '',
    Alias: '',
    LicenseYear: '',
    VehicleMake: '',
    VehicleModel: '',
    VehicleColor: '',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: '',
    ImportSerial: '',
    ViolationInfo: '',
    VehicleYear:''
}
const DataSourceMapping = (props: any) => {
    
    const { t } = useTranslation<string>();
    const [mappingPayload, setmappingPayload]= React.useState<HotListDataSourceMappingTemplate>(dataSouceInitialPayload);

    useEffect(() => {
        if (props?.mappingTabValues?.dataSourceMappingData) {
            setmappingPayload(props.mappingTabValues.dataSourceMappingData)
        }
    }, [props?.mappingTabValues?.dataSourceMappingData])

    
    const updateStateInParentComponent = (field: string, updateData: any) => {
       
        switch (field) {
            case "LicensePlate":
                
                    props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, LicensePlate: updateData });
                break;

            case "DateOfInterest":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, DateOfInterest: updateData });
                break;

            case "LicenseType":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, LicenseType: updateData });
                break;
            case "LicenseYear":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, LicenseYear: updateData });
                break;

            case "AgencyId":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, Agency: updateData });
                break;

            case "State":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, State: updateData });
                break;

            case "FirstName":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, FirstName: updateData });
                break;

            case "LastName":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, LastName: updateData });
                break;

            case "Alias":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, Alias: updateData });
                break;

            case "VehicleYear":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, VehicleYear: updateData });
                break;

            case "VehicleMake":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, VehicleMake: updateData });
                break;

            case "VehicleModel":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, VehicleModel: updateData });
                break;

            case "VehicleColor":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, VehicleColor: updateData });
                break;

            case "VehicleStyle":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, VehicleStyle: updateData });
                break;
            case "Notes":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, Notes: updateData });
                break;

            case "NcicNumber":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, NCICNumber: updateData });
                break;

            case "serialId":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, ImportSerial: updateData });
                break;
            case "ViolationInfo":
                props.setFieldValue('dataSourceMappingData',{ ...mappingPayload, ViolationInfo: updateData });
                break;

            default:
                break;
        }
    }

  

    return (
        <div className="Alpr_DataSourceMapping_CrxCreate Alpr_DataSourceMapping_Ui">
            <div className="Alpr_DataSourceMapping_ModalEditCrx">
                <div className="Alpr_DataSourceMapping_CrxEditForm">
                
                    <Grid container className="containerFlex">

                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <TextField
                                id='MappingLicensePlate'
                                required={true}
                                label={t("License_Plate") + ':'}
                                value={mappingPayload?.LicensePlate}
                                onChange={(e: any) => {
                                   
                                    props.setFieldTouched('LicensePlate',true)
                                    updateStateInParentComponent("LicensePlate",e.target.value);
                            }}
                                error={props.touched.LicensePlate &&  (props.formValidationError?.dataSourceMappingData?.LicensePlate ?? "").length > 0}
                                errorMsg={props.formValidationError?.dataSourceMappingData?.LicensePlate}
                            />
                            <TextField
                                id='MappingDateOfIntereset'
                                required={true}
                                label={t("Date_of_Interest") + ':'}
                                value={mappingPayload?.DateOfInterest}
                                onChange={(e: any) =>{ 
                                    props.setFieldTouched('DateOfInterest',true)
                                updateStateInParentComponent("DateOfInterest",e.target.value)
                            }}
                            error={props.touched?.DateOfInterest && (props.formValidationError?.dataSourceMappingData?.DateOfInterest ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.DateOfInterest}
                            />
                            <TextField
                                id='MappingLicenseType'
                                required={false}
                                label={t("License_Type") + ':'}
                                value={mappingPayload?.LicenseType}
                                onChange={(e: any) => {
                                props.setFieldTouched('LicenseType',true)
                                updateStateInParentComponent("LicenseType",e.target.value)
                            }}
                            error={props.touched.LicenseType &&  (props.formValidationError?.dataSourceMappingData?.LicenseType ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.LicenseType}
                            />
                            <TextField
                                id='MappingLicenseYear'
                                required={false}
                                label={t("License_Year") + ':'}
                                value={mappingPayload?.LicenseYear}
                                onChange={(e: any) => {
                                props.setFieldTouched('LicenseYear',true)
                                updateStateInParentComponent("LicenseYear",e.target.value)
                            }}
                            error={props.touched.LicenseYear &&  (props.formValidationError?.dataSourceMappingData?.LicenseYear ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.LicenseYear}
                            />
                            <TextField
                                id='MappingAgency'
                                required={false}
                                label={t("Agency_Id") + ":"}
                                value={mappingPayload?.Agency}
                                onChange={(e: any) => {
                                props.setFieldTouched('Agency',true)
                                updateStateInParentComponent("AgencyId",e.target.value)
                            }}
                            error={props.touched.Agency &&  (props.formValidationError?.dataSourceMappingData?.Agency ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.Agency}
                            />
                            <TextField
                                id='MappingStates'
                                required={false}
                                label={t("State_Id") + ":"}
                                value={mappingPayload?.State}
                                onChange={(e: any) => {
                                    props.setFieldTouched('State',true)
                                updateStateInParentComponent("State",e.target.value)
                            }}
                            error={props.touched.State &&  (props.formValidationError?.dataSourceMappingData?.State ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.State}
                            />
                            <TextField
                                id='MappingFirstName'
                                required={false}
                                label={t("First_Name") + ":"}
                                value={mappingPayload?.FirstName}
                                onChange={(e: any) => {
                                    props.setFieldTouched('FirstName',true)
                                updateStateInParentComponent("FirstName",e.target.value)
                            }}
                            error={props.touched.FirstName &&  (props.formValidationError?.dataSourceMappingData?.FirstName ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.FirstName}
                            />
                            <TextField
                                id='MappingLastName'
                                required={false}
                                label={t("Last_Name") + ":"}
                                value={mappingPayload?.LastName}
                                onChange={(e: any) => {
                                props.setFieldTouched('LastName',true)
                                updateStateInParentComponent("LastName",e.target.value)
                            }}
                            error={props.touched.LastName &&  (props.formValidationError?.dataSourceMappingData?.LastName ?? "").length > 0}
                            errorMsg={props.formValidationError?.dataSourceMappingData?.LastName}
                            />
                        </Grid>


                        <Grid item xs={11} sm={12} md={12} lg={5} >
                           
                                <div>
                                    <TextField
                                        id='MappingAlias'
                                        required={false}
                                        label={t("Alias") + ":"}
                                        value={mappingPayload?.Alias}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('Alias',true)
                                        updateStateInParentComponent("Alias",e.target.value)
                                    }}
                                    error={props.touched.Alias &&  (props.formValidationError?.dataSourceMappingData?.Alias ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.Alias}
                                    />

                                    <TextField
                                        id='MappingVehicleYear'
                                        required={false}
                                        label={t("Vehicle_Year") + ":"}
                                        value={mappingPayload?.VehicleYear}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('VehicleYear',true)
                                        updateStateInParentComponent("VehicleYear",e.target.value)
                                    }}
                                    error={props.touched.VehicleYear &&  (props.formValidationError?.dataSourceMappingData?.VehicleYear ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.VehicleYear}
                                    />
                                    <TextField
                                        id='MappingVehicleMake'
                                        required={false}
                                        label={t("Vehicle_Make") + ":"}
                                        value={mappingPayload?.VehicleMake}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('VehicleMake',true)
                                        updateStateInParentComponent("VehicleMake",e.target.value)
                                        }}
                                        error={props.touched.VehicleMake &&  (props.formValidationError?.dataSourceMappingData?.VehicleMake ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceMappingData?.VehicleMake}
                                    />
                                    <TextField
                                        id='MappingVehicleModel'
                                        required={false}
                                        label={t("Vehicle_Model") + ":"}
                                        value={mappingPayload?.VehicleModel}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('VehicleModel',true)
                                        updateStateInParentComponent("VehicleModel",e.target.value)}
                                    }
                                    error={props.touched.VehicleModel &&  (props.formValidationError?.dataSourceMappingData?.VehicleModel ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.VehicleModel}
                                    />
                                    <TextField
                                        id='MappingVehicleColor'
                                        required={false}
                                        label={t("Vehicle_Color") + ":"}
                                        value={mappingPayload?.VehicleColor}
                                        onChange={(e: any) =>{ 
                                            props.setFieldTouched('VehicleColor',true)
                                        updateStateInParentComponent("VehicleColor",e.target.value)
                                    }}
                                    error={props.touched.VehicleColor &&  (props.formValidationError?.dataSourceMappingData?.VehicleColor ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.VehicleColor}
                                    />
                                    <TextField
                                        id='MappingVehicleStyle'
                                        required={false}
                                        label={t("Vehicle_Style") + ":"}
                                        value={mappingPayload?.VehicleStyle}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('VehicleStyle',true)
                                        updateStateInParentComponent("VehicleStyle",e.target.value)
                                    }}
                                    error={props.touched.VehicleStyle &&  (props.formValidationError?.dataSourceMappingData?.VehicleStyle ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.VehicleStyle}
                                    />
                                </div>
                            
                        </Grid>
                        <Grid item xs={11} sm={12} md={12} lg={5} >
                                <div>
                                    <TextField
                                        id='MappingNotes'
                                        required={false}
                                        label={t("Notes") + ":"}
                                        value={mappingPayload?.Notes}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('Notes',true)
                                            updateStateInParentComponent("Notes",e.target.value)
                                        }}
                                        error={props.touched.Notes &&  (props.formValidationError?.dataSourceMappingData?.Notes ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceMappingData?.Notes}
                                    />

                                    <TextField
                                        id='MappingNCICNumber'
                                        required={false}
                                        label={t("NCIC_Number") + ":"}
                                        value={mappingPayload?.NCICNumber}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('NCICNumber',true)
                                            updateStateInParentComponent("NcicNumber",e.target.value)
                                        }}
                                        error={props.touched.NCICNumber &&  (props.formValidationError?.dataSourceMappingData?.NCICNumber ?? "").length > 0}
                                        errorMsg={props.formValidationError?.dataSourceMappingData?.NCICNumber}
                                    />
                                    <TextField
                                        id='MappingImportSerialId'
                                        required={false}
                                        label={t("Import_Serial_Id") + ":"}
                                        value={mappingPayload?.ImportSerial}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('ImportSerial',true)
                                        updateStateInParentComponent("serialId",e.target.value)
                                    }}
                                    error={props.touched.ImportSerial &&  (props.formValidationError?.dataSourceMappingData?.ImportSerial ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.ImportSerial}
                                    />
                                    <TextField
                                        id='MappingViolationInfo'
                                        required={false}
                                        label={t("Violation_Info") + ":"}
                                        value={mappingPayload?.ViolationInfo}
                                        onChange={(e: any) => {
                                            props.setFieldTouched('ViolationInfo',true)
                                        updateStateInParentComponent("ViolationInfo",e.target.value)
                                    }}
                                    error={props.touched.ViolationInfo &&  (props.formValidationError?.dataSourceMappingData?.ViolationInfo ?? "").length > 0}
                                    errorMsg={props.formValidationError?.dataSourceMappingData?.ViolationInfo}
                                    />
                                </div>
                        </Grid>
                    </Grid>
                    
                </div>
            </div>
        </div >
    )
}

export default DataSourceMapping;