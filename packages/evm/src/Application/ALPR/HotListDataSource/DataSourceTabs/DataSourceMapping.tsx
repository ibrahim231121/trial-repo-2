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
import { SourceMapping } from "../../../../Redux/AlprDataSourceReducer"


const DataSourceMapping = (props: any) => {
    const [sourceMappingData, setsourceMappingData] = React.useState<any>([]);
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
    }
    useEffect(() => {
        setsourceMappingData(props.sourceMappingData)
    }, [])

    useEffect(() => {
        if (sourceMappingData.length > 0)
            setmappingPayload(sourceMappingData[0])
    }, [sourceMappingData])

    useEffect(() => {
        if (mappingPayload.length > 0 && mappingPayload.LicensePlate.trim() !== '' && mappingPayload.DateOfInterest.trim() !== '') {
            props.dataSourceMappingTab(mappingPayload);
            props.saveBtnDisblFromMapping(false);
        }else
        {
            props.saveBtnDisblFromMapping(true);
        }

    }, [mappingPayload])
    return (
        <div className="CrxCreateDataSourceMapping CreateDataSourceMappingUi">
            <div className="modalEditCrx">
                <div className="CrxEditForm">
                    <Grid container className="containerFlex">

                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <TextField
                                required={true}
                                label={t("License_Plate") + ':'}
                                value={mappingPayload.LicensePlate}
                                onChange={(e: any) => setFieldValue("LicensePlate", e.target.value)}
                                error={mappingPayload.LicensePlate === ''}
                                errorMsg={t("License_Plate_field_required")}
                            />
                            <TextField
                                required={true}
                                label={t("Date_of_Interest") + ':'}
                                value={mappingPayload.DateOfInterest}
                                onChange={(e: any) => setFieldValue("DateOfInterest", e.target.value)}
                                error={mappingPayload.DateOfInterest === ''}
                                errorMsg={t("Date_of_Interest_field_required")}
                            />
                            {/* <div className='dataPickerCustom crxCreateEditDate DeactivationDateUi'>
                                <label>{t("Date_of_Interest")}</label>
                                <CRXInputDatePicker
                                    value={mappingPayload.DateOfInterest}
                                    type='datetime-local'
                                    className='dateTimeInput'
                                    onChange={(e: any) => setFieldValue('DateOfInterest', e.target.value)}
                                    minDate={minStartDate()}
                                    maxDate=''
                                />
                            </div> */}
                            <TextField
                                required={false}
                                label={t("License_Type") + ':'}
                                value={mappingPayload.LicenseType}
                                onChange={(e: any) => setFieldValue("LicenseType", e.target.value)}

                            />
                            <TextField
                                required={false}
                                label={t("Agency_Id") + ":"}
                                value={mappingPayload.AgencyId}
                                onChange={(e: any) => setFieldValue("AgencyId", e.target.value)}
                            />
                            <TextField
                                required={false}
                                label={t("State_Id") + ":"}
                                value={mappingPayload.StateId}
                                onChange={(e: any) => setFieldValue("StateId", e.target.value)}
                            />
                            <TextField
                                required={false}
                                label={t("First_Name") + ":"}
                                value={mappingPayload.FirstName}
                                onChange={(e: any) => setFieldValue("FirstName", e.target.value)}
                            />
                            <TextField
                                required={false}
                                label={t("Last_Name") + ":"}
                                value={mappingPayload.LastName}
                                onChange={(e: any) => setFieldValue("LastName", e.target.value)}
                            />
                        </Grid>


                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        required={false}
                                        label={t("Alias") + ":"}
                                        value={mappingPayload.Alias}
                                        onChange={(e: any) => setFieldValue("Alias", e.target.value)}
                                    />

                                    <TextField
                                        required={false}
                                        label={t("Vehicle_Year") + ":"}
                                        value={mappingPayload.VehicleYear}
                                        onChange={(e: any) => setFieldValue("VehicleYear", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Vehicle_Make") + ":"}
                                        value={mappingPayload.VehicleMake}
                                        onChange={(e: any) => setFieldValue("VehicleMake", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Vehicle_Model") + ":"}
                                        value={mappingPayload.VehicleModel}
                                        onChange={(e: any) => setFieldValue("VehicleModel", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Vehicle_Color") + ":"}
                                        value={mappingPayload.VehicleColor}
                                        onChange={(e: any) => setFieldValue("VehicleColor", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Vehicle_Style") + ":"}
                                        value={mappingPayload.VehicleStyle}
                                        onChange={(e: any) => setFieldValue("VehicleStyle", e.target.value)}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        required={false}
                                        label={t("Notes") + ":"}
                                        value={mappingPayload.Notes}
                                        onChange={(e: any) => setFieldValue("Notes", e.target.value)}
                                    />

                                    <TextField
                                        required={false}
                                        label={t("NCIC_Number") + ":"}
                                        value={mappingPayload.NcicNumber}
                                        onChange={(e: any) => setFieldValue("NcicNumber", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Import_Serial_Id") + ":"}
                                        value={mappingPayload.serialId}
                                        onChange={(e: any) => setFieldValue("serialId", e.target.value)}
                                    />
                                    <TextField
                                        required={false}
                                        label={t("Violation_Info") + ":"}
                                        value={mappingPayload.ViolationInfo}
                                        onChange={(e: any) => setFieldValue("ViolationInfo", e.target.value)}
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