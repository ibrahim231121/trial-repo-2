import React, { useEffect, useContext, useRef, useState } from "react";
import {
    useStyles,
} from "./cadSetupStyles";
import {
    CRXTabs,
    CrxTabPanel,
    CRXButton,
    CRXNewDataGrid,
    CRXToaster,
    CRXMultiSelectBoxLight
} from "@cb/shared";
import { useTranslation } from "react-i18next";
import { FieldDictionary } from "./mappingDictionary";

interface MappingsTableProps {
    extractedNode: string;
}

const MappingsTable = (props: MappingsTableProps) => {

    const { t } = useTranslation<string>();
    const classes = useStyles();
    const [mappingTabValue, setMappingTabValue] = React.useState<number>(0);
    const [mappingDictionary, setMappingDictionary] = useState<object>([])
    const [CadEvent, setCADEvent]: any = useState([])
    const [EventDetail, setEventDetail]: any = useState([])
    const [EventLocation, setEventLocation]: any = useState([])
    const [Responders, setResponders]: any = useState([])
    const [Agency, setAgency]: any = useState([])
    const ROWS_PER_PAGE = 10
    const ROWS_COUNT_OPTIONS = [5, 10, 15]
    const [cadDataValid, setCadDataValid] = useState(true)
    const toasterRef = useRef<typeof CRXToaster>(null);

    interface FieldMapping {
        id: number,
        mandatory: boolean,
        fieldMapping: object,
        dataType: string,
        value: string
    }

    useEffect(() => {
        setCADEvent([
            { id: 1, mandatory: true, fieldName: 'CADID', fieldMapping: { label: '/Call/Incidents/Incident/Number', value: '/Call/Incidents/Incident/Number' }, dataType: 'string', value: '' },
            { id: 2, mandatory: true, fieldName: 'CallType', fieldMapping: { label: '/Call/Incidents/Incident/AgencyType', value: '/Call/Incidents/Incident/AgencyType' }, dataType: 'string', value: '' },
            { id: 3, mandatory: false, fieldName: 'Description', fieldMapping: { label: '/Call/Incidents/Incident', value: '/Call/Incidents/Incident' }, dataType: 'string', value: '' },
            { id: 4, mandatory: true, fieldName: 'IncidentType', fieldMapping: { label: '/Call/Incidents/Incident/Type', value: '/Call/Incidents/Incident/Type' }, dataType: 'string', value: '' },
            { id: 5, mandatory: false, fieldName: 'StatusType', fieldMapping: { label: '/Call/AgencyContexts/AgencyContext/Status', value: '/Call/AgencyContexts/AgencyContext/Status' }, dataType: 'string', value: '' },
        ])

        setEventDetail([
            { id: 1, mandatory: false, fieldName: 'Dispatcher Remarks', fieldMapping: { label: '/Call/Narratives/*', value: '/Call/Narratives/*' }, dataType: 'string', value: '' },
            { id: 2, mandatory: true, fieldName: 'Officer Assigned', fieldMapping: { label: '/Call/AssignedUnits/Unit/Personnel/UnitPersonnel/IDNumber', value: '/Call/AssignedUnits/Unit/Personnel/UnitPersonnel/IDNumber' }, dataType: 'string', value: '' },
        ])

        setEventLocation([
            { id: 1, mandatory: true, fieldName: 'Latitude', fieldMapping: { label: '/Call/Location/LongitudeX', value: '/Call/Location/LongitudeX' }, dataType: 'string', value: '' },
            { id: 2, mandatory: false, fieldName: 'Location as Received', fieldMapping: { label: '/Call/Location/FullAddress', value: '/Call/Location/FullAddress' }, dataType: 'string', value: '' },
            { id: 3, mandatory: true, fieldName: 'Longitude', fieldMapping: { label: '/Call/Location/LongitudeX', value: '/Call/Location/LongitudeX' }, dataType: 'string', value: '' },
        ])
    }, [])

    useEffect(() => {
        let filteredDictionary = FieldDictionary.filter((item: any) => {
            return item.value.toString().startsWith('/' + props.extractedNode)
        })

        setMappingDictionary(filteredDictionary)
    }, [props.extractedNode])

    const mappingTabs = [
        { label: t("Cad_Event"), index: 0 },
        { label: t("Event_Detail"), index: 1 },
        { label: t("Event_Location"), index: 2 },
        { label: t("Responders"), index: 3 },
        { label: t("Agency"), index: 4 },
    ];

    function handleMappingTabChange(event: any, newValue: number) {
        setMappingTabValue(newValue);
        const overlay: any = document.getElementsByClassName("overlayPanel");
        overlay.length > 0 && (overlay[0].style.width = "28px")
    }

    const cadDataValidation = () => {
        let invalidData = false

        if (CadEvent.length) {
            CadEvent.map((item: FieldMapping) => {
                if (item.mandatory && item.fieldMapping == null) {
                    invalidData = true
                }
            })
        }

        if (EventDetail.length) {
            EventDetail.map((item: FieldMapping) => {
                if (item.mandatory && item.fieldMapping == null) {
                    invalidData = true
                }
            })
        }

        if (EventLocation.length) {
            EventLocation.map((item: FieldMapping) => {
                if (item.mandatory && item.fieldMapping == null) {
                    invalidData = true
                }
            })
        }

        if (Responders.length) {
            Responders.map((item: FieldMapping) => {
                if (item.mandatory && item.fieldMapping == null) {
                    invalidData = true
                }
            })
        }

        if (Agency.length) {
            Agency.map((item: FieldMapping) => {
                if (item.mandatory && item.fieldMapping == null) {
                    invalidData = true
                }
            })
        }

        if (invalidData) {
            setCadDataValid(false)
        } else {
            setCadDataValid(true)
        }
    }

    const showMessage = (obj: any) => {
        toasterRef?.current?.showToaster({
            message: obj.message,
            variant: obj.variant,
            duration: obj.duration,
            clearButtton: true,
        });
    };

    const onSaveMappings = (isSuccess: boolean, message: string) => {
        showMessage({
            message: message,
            variant: isSuccess ? "success" : "error",
            duration: 5000,
        });
    };

    const onIngestData = (isSuccess: boolean, message: string) => {
        showMessage({
            message: message,
            variant: isSuccess ? "success" : "error",
            duration: 5000,
        });
    };

    const changeMapping = (value: any, data: any) => {
        let currentTab = mappingTabs.filter((item: any) => {
            return item.index == mappingTabValue
        })

        let trimmedTab = currentTab[0].label.replace(/ /g, '')

        switch (trimmedTab) {
            case 'CADEvent': {
                let newCadEvents = CadEvent

                newCadEvents.map((item: any) => {
                    if (item.id == data.id) {
                        item.fieldMapping = value
                    }
                })

                setCADEvent(newCadEvents)
                break;
            }

            case 'EventDetail': {
                let newEventDetail = EventDetail

                newEventDetail.map((item: any) => {
                    if (item.id == data.id) {
                        item.fieldMapping = value
                    }
                })

                setEventDetail(newEventDetail)
                break;
            }

            case 'EventLocation': {
                let newEventLocation = EventLocation

                newEventLocation.map((item: any) => {
                    if (item.id == data.id) {
                        item.fieldMapping = value
                    }
                })

                setEventLocation(newEventLocation)
                break;
            }

            case 'Responders': {
                let newResponders = Responders

                newResponders.map((item: any) => {
                    if (item.id == data.id) {
                        item.fieldMapping = value
                    }
                })

                setResponders(newResponders)
                break;
            }

            case 'Agency': {
                let newAgency = Agency

                newAgency.map((item: any) => {
                    if (item.id == data.id) {
                        item.fieldMapping = value
                    }
                })

                setAgency(newAgency)
                break;
            }
        }

        cadDataValidation()
    }

    const menuOpened = (e: any) => {
        console.log(e.target.value)
    }

    const getFieldMapping = (rowData: any) => {
        return < CRXMultiSelectBoxLight
            className="DateTimeFormatAutocomplete"
            multiple={false}
            CheckBox={true}
            required={false}
            options={mappingDictionary}
            onOpen={(e: any) => {
                menuOpened(e)
            }}
            value={rowData.row.fieldMapping}
            isSearchable={true}
            customWidth={'900px'}
            onChange={(
                e: React.SyntheticEvent,
                value: string[]
            ) => { changeMapping(value, rowData) }}
        />
    }

    const getMandatory = (rowData: any) => {
        if (rowData.row.mandatory == true) {
            return <div style={{ position: 'relative' }}><span style={{ position: 'absolute', top: '-10px', left: '25px', fontWeight: 'bold', fontSize: '18px' }}>*</span></div>
        } else {
            return ''
        }
    }

    const columns = [
        //{ field: 'id', headerName: 'ID', width: 70 },
        { field: 'mandatory', headerName: '', width: 50, renderCell: getMandatory },
        { field: 'fieldName', headerName: <b>Name</b>, width: 200 },
        { field: 'fieldMapping', headerName: <b>Mapping</b>, width: 1000, renderCell: getFieldMapping },
        { field: 'dataType', headerName: <b>Data Type</b>, width: 130 },
        { field: 'value', headerName: <b>Value</b>, width: 130 },
    ];

    return (
        <div>
            <CRXToaster ref={toasterRef} />
            <div className={classes.tabsHolder}>
                <CRXTabs
                    value={mappingTabValue}
                    onChange={handleMappingTabChange}
                    tabitems={mappingTabs}
                    stickyTab={283}
                />
            </div>

            <div className={classes.tableHolder}>
                <CrxTabPanel value={mappingTabValue} index={0} customStyle={{ minHeight: 'auto', width: '99%' }}>
                    <CRXNewDataGrid
                        rows={CadEvent}
                        columns={columns}
                        height={500}
                        rowsPerPage={ROWS_PER_PAGE}
                    />
                </CrxTabPanel>

                <CrxTabPanel value={mappingTabValue} index={1} customStyle={{ minHeight: 'auto', width: '99%' }}>
                    <CRXNewDataGrid
                        rows={EventDetail}
                        columns={columns}
                        height={500}
                        rowsPerPage={ROWS_PER_PAGE}
                        viewRowsCountOptions={ROWS_COUNT_OPTIONS}
                    />
                </CrxTabPanel>

                <CrxTabPanel value={mappingTabValue} index={2} customStyle={{ minHeight: 'auto', width: '99%' }}>
                    <CRXNewDataGrid
                        rows={EventLocation}
                        columns={columns}
                        height={500}
                        rowsPerPage={ROWS_PER_PAGE}
                        viewRowsCountOptions={ROWS_COUNT_OPTIONS}
                    />
                </CrxTabPanel>

                <CrxTabPanel value={mappingTabValue} index={3} customStyle={{ minHeight: 'auto', width: '99%' }}>
                    <CRXNewDataGrid
                        rows={Responders}
                        columns={columns}
                        height={500}
                        rowsPerPage={ROWS_PER_PAGE}
                    />
                </CrxTabPanel>

                <CrxTabPanel value={mappingTabValue} index={4} customStyle={{ minHeight: 'auto', width: '99%' }}>
                    <CRXNewDataGrid
                        rows={Agency}
                        columns={columns}
                        height={500}
                        rowsPerPage={ROWS_PER_PAGE}
                    />
                </CrxTabPanel>
            </div>

            <div className={classes.btnContainer}>
                <CRXButton
                    type="submit"
                    variant="contained"
                    disabled={cadDataValid == false ? true : false}
                    onClick={() => onSaveMappings(true, 'Mappings has been saved successfully.')}
                    className={classes.saveBtn}
                >
                    Save Mapping
                </CRXButton>

                <CRXButton
                    type="submit"
                    variant="contained"
                    onClick={() => onIngestData(true, 'Records have been saved to database successfully.')}
                    className={classes.saveToDBBtn}
                >
                    Ingest Data
                </CRXButton>
            </div>
        </div>
    );
}

export default MappingsTable