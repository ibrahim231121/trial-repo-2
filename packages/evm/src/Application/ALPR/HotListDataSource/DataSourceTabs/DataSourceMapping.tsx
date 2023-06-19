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
    AgencyId: '',
    State: '',
    FirstName: '',
    LastName: '',
    Alias: '',
    Year: '',
    Make: '',
    Model: '',
    Color: '',
    Style: '',
    Notes: '',
    NCICNumber: '',
    ImportSerial: '',
    ViolationInfo: '',
}
const DataSourceMapping = (props: any) => {
    const [mappingPayload, setmappingPayload]: any = React.useState<HotListDataSourceMappingTemplate>(dataSouceInitialPayload);

    const { t } = useTranslation<string>();
    const setFieldValue = (field: string, e: any) => {
        let lengthRegex = /^.{0,20}$/;
        switch (field) {
            case "LicensePlate":
                if (lengthRegex.test(e))
                    setmappingPayload({ ...mappingPayload, LicensePlate: e });
                break;

            case "DateOfInterest":
                if (lengthRegex.test(e))
                    setmappingPayload({ ...mappingPayload, DateOfInterest: e });
                break;

            case "LicenseType":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, LicenseType: e });
                break;

            case "AgencyId":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, AgencyId: e });
                break;

            case "StateId":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, State: e });
                break;

            case "FirstName":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, FirstName: e });
                break;

            case "LastName":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, LastName: e });
                break;

            case "Alias":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Alias: e });
                break;

            case "VehicleYear":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Year: e });
                break;

            case "VehicleMake":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Make: e });
                break;

            case "VehicleModel":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Model: e });
                break;

            case "VehicleColor":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Color: e });
                break;

            case "VehicleStyle":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Style: e });
                break;
            case "Notes":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, Notes: e });
                break;

            case "NcicNumber":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, NCICNumber: e });
                break;

            case "serialId":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, ImportSerial: e });
                break;
            case "ViolationInfo":
                if (lengthRegex.test(e))
                setmappingPayload({ ...mappingPayload, ViolationInfo: e });
                break;

            default:
                break;
        }
    }
    useEffect(() => {
        console.log(props?.sourceMappingData)
        if (props?.sourceMappingData) {
            setmappingPayload(props.sourceMappingData)
        }
    }, [])


    useEffect(() => {
        if (mappingPayload && mappingPayload.LicensePlate.trim() !== '' && mappingPayload.DateOfInterest.trim() !== '') {
            props.dataSourceMappingTab(mappingPayload);
            props.saveBtnDisblFromMapping(false);
        } else {
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
                                id='MappingLicensePlate'
                                required={true}
                                label={t("License_Plate") + ':'}
                                value={mappingPayload?.LicensePlate}
                                onChange={(e: any) => setFieldValue("LicensePlate", e.target.value)}
                                error={mappingPayload?.LicensePlate === ''}
                                errorMsg={t("License_Plate_field_required")}
                            />
                            <TextField
                                id='MappingDateOfIntereset'
                                required={true}
                                label={t("Date_of_Interest") + ':'}
                                value={mappingPayload?.DateOfInterest}
                                onChange={(e: any) => setFieldValue("DateOfInterest", e.target.value)}
                                error={mappingPayload?.DateOfInterest === ''}
                                errorMsg={t("Date_of_Interest_field_required")}
                            />
                            <TextField
                                id='MappingLicenseType'
                                required={false}
                                label={t("License_Type") + ':'}
                                value={mappingPayload?.LicenseType}
                                onChange={(e: any) => setFieldValue("LicenseType", e.target.value)}

                            />
                            <TextField
                                id='MappingAgency'
                                required={false}
                                label={t("Agency_Id") + ":"}
                                value={mappingPayload?.AgencyId}
                                onChange={(e: any) => setFieldValue("AgencyId", e.target.value)}
                            />
                            <TextField
                                id='MappingStates'
                                required={false}
                                label={t("State_Id") + ":"}
                                value={mappingPayload?.State}
                                onChange={(e: any) => setFieldValue("StateId", e.target.value)}
                            />
                            <TextField
                                id='MappingFirstName'
                                required={false}
                                label={t("First_Name") + ":"}
                                value={mappingPayload?.FirstName}
                                onChange={(e: any) => setFieldValue("FirstName", e.target.value)}
                            />
                            <TextField
                                id='MappingLastName'
                                required={false}
                                label={t("Last_Name") + ":"}
                                value={mappingPayload?.LastName}
                                onChange={(e: any) => setFieldValue("LastName", e.target.value)}
                            />
                        </Grid>


                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        id='MappingAlias'
                                        required={false}
                                        label={t("Alias") + ":"}
                                        value={mappingPayload?.Alias}
                                        onChange={(e: any) => setFieldValue("Alias", e.target.value)}
                                    />

                                    <TextField
                                        id='MappingVehicleYear'
                                        required={false}
                                        label={t("Vehicle_Year") + ":"}
                                        value={mappingPayload?.Year}
                                        onChange={(e: any) => setFieldValue("VehicleYear", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingVehicleMake'
                                        required={false}
                                        label={t("Vehicle_Make") + ":"}
                                        value={mappingPayload?.Make}
                                        onChange={(e: any) => setFieldValue("VehicleMake", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingVehicleModel'
                                        required={false}
                                        label={t("Vehicle_Model") + ":"}
                                        value={mappingPayload?.Model}
                                        onChange={(e: any) => setFieldValue("VehicleModel", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingVehicleColor'
                                        required={false}
                                        label={t("Vehicle_Color") + ":"}
                                        value={mappingPayload?.Color}
                                        onChange={(e: any) => setFieldValue("VehicleColor", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingVehicleStyle'
                                        required={false}
                                        label={t("Vehicle_Style") + ":"}
                                        value={mappingPayload?.Style}
                                        onChange={(e: any) => setFieldValue("VehicleStyle", e.target.value)}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={11} sm={12} md={12} lg={5} >
                            <div className="">
                                <div className="">
                                    <TextField
                                        id='MappingNotes'
                                        required={false}
                                        label={t("Notes") + ":"}
                                        value={mappingPayload?.Notes}
                                        onChange={(e: any) => setFieldValue("Notes", e.target.value)}
                                    />

                                    <TextField
                                        id='MappingNCICNumber'
                                        required={false}
                                        label={t("NCIC_Number") + ":"}
                                        value={mappingPayload?.NCICNumber}
                                        onChange={(e: any) => setFieldValue("NcicNumber", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingImportSerialId'
                                        required={false}
                                        label={t("Import_Serial_Id") + ":"}
                                        value={mappingPayload?.ImportSerial}
                                        onChange={(e: any) => setFieldValue("serialId", e.target.value)}
                                    />
                                    <TextField
                                        id='MappingViolationInfo'
                                        required={false}
                                        label={t("Violation_Info") + ":"}
                                        value={mappingPayload?.ViolationInfo}
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