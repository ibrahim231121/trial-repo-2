import { TextField } from "@cb/shared";
import { useStyles } from "../DataSourceStyling/DataSourceMapping";
import { Grid } from "@material-ui/core";
import "./DataSourceMapping.scss"
import { CRXInputDatePicker } from "@cb/shared";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { HotListDataSourceMappingTemplate } from "../../../../utils/Api/models/HotlistDataSourceMapping";
import { RootState } from "../../../../Redux/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import {SourceMapping } from "../../../../Redux/AlprDataSourceReducer"


const DataSourceMapping = (props: any) => {
    const [sourceMappingData,setsourceMappingData]=React.useState<any>([]);
    const [mappingPayload, setmappingPayload]: any = React.useState<HotListDataSourceMappingTemplate>(
        {
            id: 0,
            LicensePlate: '',
            DateOfInterest: '',
            LicenseType: '',
            AgencyId: '',
            StateId: '',
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

    const { t } = useTranslation<string>();
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
        switch (field) {
            case "LicensePlate":
                setmappingPayload({ ...mappingPayload, LicensePlate: e });
                break;

            case "DateOfInterest":
                setmappingPayload({ ...mappingPayload, DateOfInterest: e });
                break;

            case "LicenseType":
                setmappingPayload({ ...mappingPayload, LicenseType: e });
                break;

            case "AgencyId":
                setmappingPayload({ ...mappingPayload, AgencyId: e });
                break;

            case "StateId":
                setmappingPayload({ ...mappingPayload, StateId: e });
                break;

            case "FirstName":
                setmappingPayload({ ...mappingPayload, FirstName: e });
                break;

            case "LastName":
                setmappingPayload({ ...mappingPayload, LastName: e });
                break;

            case "Alias":
                setmappingPayload({ ...mappingPayload, Alias: e });
                break;

            case "VehicleYear":
                setmappingPayload({ ...mappingPayload, VehicleYear: e });
                break;

            case "VehicleMake":
                setmappingPayload({ ...mappingPayload, VehicleMake: e });
                break;

            case "VehicleModel":
                setmappingPayload({ ...mappingPayload, VehicleModel: e });
                break;

            case "VehicleColor":
                setmappingPayload({ ...mappingPayload, VehicleColor: e });
                break;

            case "VehicleStyle":
                setmappingPayload({ ...mappingPayload, VehicleStyle: e });
                break;
            case "Notes":
                setmappingPayload({ ...mappingPayload, Notes: e });
                break;

            case "NcicNumber":
                setmappingPayload({ ...mappingPayload, NCICNumber: e });
                break;

            case "serialId":
                setmappingPayload({ ...mappingPayload, ImportSerialId: e });
                break;
            case "ViolationInfo":
                setmappingPayload({ ...mappingPayload, ViolationInfo: e });
                break;

            default:
                break;
        }
        props.dataSourceMappingTab(mappingPayload);
    }
    useEffect(()=>
    {
        setsourceMappingData(props.sourceMappingData)
    },[])

    useEffect(()=>
    {
        if(sourceMappingData.length>0)
        setmappingPayload(sourceMappingData[0])
    },[sourceMappingData])
    return (
        <div className="CrxCreateDataSourceMapping CreateDataSourceMappingUi">
            <div className="modalEditCrx">
                <div className="CrxEditForm">
                    <Grid container className="containerFlex">

                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <TextField
                                required={false}
                                label="License Plate:"
                                value={mappingPayload.LicensePlate}
                                onChange={(e: any) => setFieldValue("LicensePlate", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"License Plate field required"}
                            />
                            <div className='dataPickerCustom crxCreateEditDate DeactivationDateUi'>
                                <label>{t("Date_of_Interest")}</label>
                                <CRXInputDatePicker
                                    value={mappingPayload.DateOfInterest}
                                    type='datetime-local'
                                    className='dateTimeInput'
                                    onChange={(e: any) => setFieldValue('DateOfInterest', e.target.value)}
                                    minDate={minStartDate()}
                                    maxDate=''
                                />
                            </div>
                            <TextField
                                required={false}
                                label="License Type:"
                                value={mappingPayload.LicenseType}
                                onChange={(e: any) => setFieldValue("LicenseType", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"Name field required"}
                            />
                            <TextField
                                required={false}
                                label="Agency ID:"
                                value={mappingPayload.AgencyId}
                                onChange={(e: any) => setFieldValue("AgencyId", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"Name field required"}
                            />
                            <TextField
                                required={false}
                                label="State ID:"
                                value={mappingPayload.StateId}
                                onChange={(e: any) => setFieldValue("StateId", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"Name field required"}
                            />
                            <TextField
                                required={false}
                                label="First Name:"
                                value={mappingPayload.FirstName}
                                onChange={(e: any) => setFieldValue("FirstName", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"Name field required"}
                            />
                            <TextField
                                required={false}
                                label="Last Name:"
                                value={mappingPayload.LastName}
                                onChange={(e: any) => setFieldValue("LastName", e.target.value)}
                                // error={DataSourcePaylod.Name === ''}
                                errorMsg={"Name field required"}
                            />
                        </Grid>


                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        required={false}
                                        label="Alias:"
                                        value={mappingPayload.Alias}
                                        onChange={(e: any) => setFieldValue("Alias", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />

                                    <TextField
                                        required={false}
                                        label="Vehicle Year:"
                                        value={mappingPayload.VehicleYear}
                                        onChange={(e: any) => setFieldValue("VehicleYear", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Vehicle Make:"
                                        value={mappingPayload.VehicleMake}
                                        onChange={(e: any) => setFieldValue("VehicleMake", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Vehicle Model:"
                                        value={mappingPayload.VehicleModel}
                                        onChange={(e: any) => setFieldValue("VehicleModel", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Vehicle Color:"
                                        value={mappingPayload.VehicleColor}
                                        onChange={(e: any) => setFieldValue("VehicleColor", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Vehicle Style:"
                                        value={mappingPayload.VehicleStyle}
                                        onChange={(e: any) => setFieldValue("VehicleStyle", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        required={false}
                                        label="Notes:"
                                        value={mappingPayload.Notes}
                                        onChange={(e: any) => setFieldValue("Notes", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />

                                    <TextField
                                        required={false}
                                        label="NCIC Number:"
                                        value={mappingPayload.NcicNumber}
                                        onChange={(e: any) => setFieldValue("NcicNumber", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Import Serial Id:"
                                        value={mappingPayload.serialId}
                                        onChange={(e: any) => setFieldValue("serialId", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                    <TextField
                                        required={false}
                                        label="Violation Info:"
                                        value={mappingPayload.ViolationInfo}
                                        onChange={(e: any) => setFieldValue("ViolationInfo", e.target.value)}
                                        // error={DataSourcePaylod.Name === ''}
                                        errorMsg={"Name field required"}
                                    />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div >
    )
}

export default DataSourceMapping;