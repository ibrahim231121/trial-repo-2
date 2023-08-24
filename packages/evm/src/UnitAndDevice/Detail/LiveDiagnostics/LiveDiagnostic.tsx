import { Console, debug } from "console";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { GetLiveCommandDiagnostic, getLoginId, GetMqqtLiveStatus } from "../../../utils/Api/ApiAgent";
import {
    getSocketConnectionId,
    subscribeGroupToSocket,
    unSubscribeGroupFromSocket,
} from "../../../utils/hub_config";
import "./LiveDiagnostic.scss";
import { useTranslation } from "react-i18next";
import { CRXTabs } from "@cb/shared";
import { CrxTabPanel } from "@cb/shared";
import { CRXButton, CRXModalDialog, CRXConfirmDialog  } from "@cb/shared";
import {
    CommandTypeRequest,
    CommandTypeResponse,
    LiveDiagnosticCommandModel,
    CommandParams,
    MQTTStatusModal,
    MQTTUnitStatus,
} from "../../../utils/Api/models/LiveDiagnosticCommandModel";
import { CRXRows, CRXTruncation } from "@cb/shared";
import { CRXColumn } from "@cb/shared";
import { NumberField } from "@cb/shared";
import { CRXSelectBox } from "@cb/shared";
import LiveDiagnosticOutput from "./LiveDiagnosticOutput";
import { TableContainer } from "@material-ui/core";
import { Table } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { CRXProgressBar } from "@cb/shared";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CRXMultiSelectBoxLight } from "@cb/shared";


declare const window: any;


const deviceType_DVR = "DVR";
const CommandIDAndType = {
    ExceptionLogs: { CommandId: 13000, CommandType: "ExceptionLogs" },
    DebugLogs: { CommandId: 13001, CommandType: "DebugLogs" },
    DiagnosticLogs: { CommandId: 13002, CommandType: "DiagnosticLogs" },
    SystemInfo: { CommandId: 13003, CommandType: "SystemInfo" },
    DesktopSnapshot: { CommandId: 13004, CommandType: "DesktopSnapshot" },
    GPSNMEALogs: { CommandId: 13005, CommandType: "GPSNMEALogs" },
    StopDiagnostics: { CommandId: 13006, CommandType: "StopDiagnostics" },
    Logs: { CommandId: 13007, CommandType: "Logs" },
    AuditLogs: { CommandId: 13008, CommandType: "AuditLogs" },
}


type DropDownValue<T> = {
    value: T,
    displayText: string
}

type DropDownKV<T> = {
    key: T,
    value: any
}
type MultiDropdownModel = {
    id: number,
    label: string,
}

interface PropsLiveDiagnostic {
    unitName: string,
    stationId: string,
    unitId: string,
    deviceType: string
}

export interface ResponseOutput {
    body: CommandTypeResponse,
    data: string,
    title?: string
}

const LiveDiagnostic: React.FC<PropsLiveDiagnostic> = ({ unitName, unitId, stationId, deviceType }) => {

    //*******  DropDown Display List  *******//

    const optLogDuration: DropDownValue<number>[] =
        [
            { displayText: "15 Minutes", value: 0 },
            { displayText: "4 Hours", value: 1 },
            { displayText: "24 Hours", value: 2 }
        ]

    const _optBodyWornModeList: MultiDropdownModel[] =
        [
            { label: "DSS", id: 0 },
            { label: "Platform daemon", id: 1 }
        ]

    const _optDVRModeList: MultiDropdownModel[] =
        [
            { label: "DVR", id: 0 },
            { label: "DSS", id: 1 }
        ]

    const _optDVRCommandTypeList: MultiDropdownModel[] =
        [
            { id: 0, label: "Exception Logs" },
            { id: 1, label: "Debug Logs" },
            { id: 2, label: "Diagnostic Logs" },
            { id: 3, label: "Audit Logs" },
        ]
    const _optBodyWornCommandTypeList: MultiDropdownModel[] =
        [
            { id: 0, label: "Exception Logs" },
            { id: 1, label: "Debug Logs" },
            { id: 2, label: "Audit Logs" },
        ]


    //*******  DropDown Value List  *******//

    const logDurationList: DropDownKV<number>[] = //optLogDuration
        [
            { key: 0, value: 15 }, // 15 minutes
            { key: 1, value: 4 * 60 }, // 4 Hours  or 240  minutes
            { key: 2, value: 24 * 60 } // 24 Hours or 1440 minutes
        ]
    const bodyWornModeList: DropDownKV<number>[] = //  _optBodyWornModeList
        [
            { key: 0, value: "IOT" },
            { key: 1, value: "BC04" }
        ]
    const dvrModeList: DropDownKV<number>[] = // _optDVRModeList
        [
            { key: 0, value: "DVR" },
            { key: 1, value: "IOT" }
        ]

    const dvrCommandTypeList: DropDownKV<number>[] = // _optDVRCommandTypeList
        [
            { key: 0, value: { CommandID: CommandIDAndType.ExceptionLogs.CommandId, CommandType: CommandIDAndType.ExceptionLogs.CommandType, } },
            { key: 1, value: { CommandID: CommandIDAndType.DebugLogs.CommandId, CommandType: CommandIDAndType.DebugLogs.CommandType, } },
            { key: 2, value: { CommandID: CommandIDAndType.DiagnosticLogs.CommandId, CommandType: CommandIDAndType.DiagnosticLogs.CommandType, } },
            { key: 3, value: { CommandID: CommandIDAndType.AuditLogs.CommandId, CommandType: CommandIDAndType.AuditLogs.CommandType, } },
        ]
    const bodyWornCommandTypeList: DropDownKV<number>[] = // _optBodyWornCommandTypeList
        [
            { key: 0, value: { CommandID: CommandIDAndType.ExceptionLogs.CommandId, CommandType: CommandIDAndType.ExceptionLogs.CommandType, } },
            { key: 1, value: { CommandID: CommandIDAndType.DebugLogs.CommandId, CommandType: CommandIDAndType.DebugLogs.CommandType, } },
            { key: 2, value: { CommandID: CommandIDAndType.AuditLogs.CommandId, CommandType: CommandIDAndType.AuditLogs.CommandType, } },
        ]

    //*******  UseStates $ UseRefs  *******//
    const [value, setValue] = React.useState(0);
    const [commandTypeSelected, setCommandTypeSelected] = React.useState(false);
    const [modeTypeSelected, setModeTypeSelected] = React.useState(false);
    const [logDurationValue, setLogDurationValue] = React.useState<number>(optLogDuration[0].value);
    const [executeCommandStatus, setExecuteCommandStatus] = React.useState(false);
    const [disableLogType, setDisableLogType] = React.useState(false);
    const [modeOptionDropdown, setModeOptionDropdown] = React.useState<MultiDropdownModel[]>([deviceType == deviceType_DVR ? _optDVRModeList[0] : _optBodyWornModeList[0]]);
    const [commandTypeDropdown, setCommandTypeDropdown] = React.useState<MultiDropdownModel[]>([deviceType == deviceType_DVR ? _optDVRCommandTypeList[0] : _optBodyWornCommandTypeList[0]]);
    const [responseValue, setResponseValue] = React.useState<ResponseOutput>();
    const [mqttStatusResponse, setMqttStatusResponse] = React.useState<MQTTStatusModal[]>();

    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);



    const commandTypeRef = useRef<CommandTypeRequest>(deviceType == deviceType_DVR ? dvrCommandTypeList[0].value : bodyWornCommandTypeList[0].value);
    const commandTypeExecutedRef = useRef<CommandTypeRequest>(commandTypeRef.current);
    const responseData = useRef<string>("");
    const { t } = useTranslation<string>();


    const liveCommand: LiveDiagnosticCommandModel = {
        ClientGuidId: "",
        ConversationID: "0",
        MessageType: "Command",
        MessageOrigin: "",
        From: getLoginId(),
        CommandInvokerGuid: "qP9IKdyNm-eI6GZGh6wrLAc1HrSgw02",
        To: unitName,
        TimestampOrigin: 1,
        TimestampHub: 1,
        StationId: stationId,
        UnitId: unitId,
        ConversationCompletedAt: "",
        MessageCreatedAt: "",
        Timeout: 0,
        Body: "",
        Data: "",
    };



    // OnChange Tab Event
    function handleChange(event: any, newValue: number) {
        setLogDurationValue(optLogDuration[0].value);
        setDisableLogType(false);
        setModeOptionDropdown([deviceType == deviceType_DVR ? _optDVRModeList[0] : _optBodyWornModeList[0]]);
        setCommandTypeDropdown([deviceType == deviceType_DVR ? _optDVRCommandTypeList[0] : _optBodyWornCommandTypeList[0]]);
        setModeTypeSelected(false);
        setCommandTypeSelected(false);
        commandTypeRef.current = deviceType == deviceType_DVR ? dvrCommandTypeList[0].value : bodyWornCommandTypeList[0].value
        if (newValue === 1) {
            SystemInfo();
            consumeCommand();
        }
        if (newValue === 2) {
            if (deviceType == deviceType_DVR) {
                DesktopSnapshot();
                consumeCommand();
            } else {
                GPSNMEALogs();
                consumeCommand();
            }
        }
        setValue(newValue);
    }

    useEffect(() => {
        console.log("Subscribing.");
        window.addEventListener("onWSMsgRecEvent", onMessage);
        subscribeGroupToSocket("UnitLiveDiagnostics");
        onMqttStatusRefreshBtn();
        return function cleanup() {
            StopDiagnostics();
            consumeCommand();
            unSubscribeGroupFromSocket("UnitLiveDiagnostics");
        }
    }, []);

    const doAppendLog = (CommandID: number): boolean => {
        switch (CommandID) {
            case 13000:
                return true;
            case 13001:
                return true;
            case 13002:
                return true;
            case 13007:
                return true;
            case 13008:
                return true;
        }
        return false;
    }

    function onMessage(e: any) {
        if (e != null && e.data != null && e.data != null) {
            if (e.data.baseResponseTemplate.groups[0] == "UnitLiveDiagnostics") {

                setExecuteCommandStatus(false);
                let _response: LiveDiagnosticCommandModel = JSON.parse(e.data.body.data);
                let _responseBody: CommandTypeResponse = JSON.parse(_response.Body);
                if (_responseBody.CommandID == commandTypeExecutedRef.current.CommandID) {
                    if (!(_response.Data === "Ack Response")) {
                        if (doAppendLog(_responseBody.CommandID)) {
                            responseData.current = responseData.current.concat(_response.Data + "\n" ?? "");
                        } else {
                            responseData.current = _response.Data ?? "";
                        }
                        setResponseValue({ body: _responseBody, data: responseData.current ?? "", });
                    } else {
                        setResponseValue({ body: _responseBody, data: responseData.current ?? "", });

                    }
                }
            }
        }
    }


    // Execute Command
    const consumeCommand = () => {
        liveCommand.Body = JSON.stringify(commandTypeRef.current);
        console.log(liveCommand);
        commandTypeExecutedRef.current = commandTypeRef.current;
        responseData.current = `Requesting ${commandTypeExecutedRef.current.CommandType} ... \n`;
        setResponseValue({ body: { CommandID: 1, CommandType: commandTypeExecutedRef.current.CommandType, Description: "", success: true }, data: responseData.current });
        GetLiveCommandDiagnostic.getLiveCommandDiagnostic(
            "LiveCommands/ProcessMessage",
            liveCommand
        ).then((response: any) => {

            if (commandTypeExecutedRef.current.CommandType == "StopDiagnostics") {
                setExecuteCommandStatus(false);
            }

        });
    };

    const OnExecuteCommand = () => {
        if (!commandTypeSelected || !modeTypeSelected) {
            let _mode: string[] = [];
            for (let i = 0; i < modeOptionDropdown.length; i++) {
                if (deviceType === deviceType_DVR) {
                    let found = dvrModeList.find((x) => x.key === modeOptionDropdown[i].id);
                    if (found != undefined) {
                        _mode.push(found.value);
                    }
                } else {
                    let found = bodyWornModeList.find((x) => x.key === modeOptionDropdown[i].id);
                    if (found != undefined) {
                        _mode.push(found.value);
                    }
                }
            }

            let _data: CommandTypeRequest;
            const _multiRequestArray: CommandTypeRequest[] = [];
            for (let i = 0; i < commandTypeDropdown.length; i++) {
                if (deviceType === deviceType_DVR) {
                    let found = dvrCommandTypeList.find((x) => x.key === commandTypeDropdown[i].id);
                    if (found != undefined) {
                        _multiRequestArray.push(found.value)
                    }
                }
                else {
                    let found = bodyWornCommandTypeList.find((x) => x.key === commandTypeDropdown[i].id);
                    if (found != undefined) {
                        _multiRequestArray.push(found.value)
                    }
                }
            }

            if (_multiRequestArray.length > 1) {
                _data = { CommandType: CommandIDAndType.Logs.CommandType, CommandID: CommandIDAndType.Logs.CommandId };

            } else {
                _data = _multiRequestArray[0];
            }

            let logDuationFound = logDurationList.find((x) => x.key === logDurationValue)?.value;
            Exception_Debug_Diagnostic_Logs({
                CommandType: _data.CommandType, CommandID: _data.CommandID, Params: {
                    Duration: logDuationFound,
                    Mode: _mode.join(","),
                    guid: "",
                    LogTypes: _multiRequestArray.map((e) => e.CommandType).join(",")
                }
            });
            setExecuteCommandStatus(true);
            consumeCommand();
        }
    }


    // Duration Event
    const onLogDurationChange = (e: any) => {
        e.preventDefault();
        setLogDurationValue(e.target.value);
    }

    // CommandType Dropdown Event 
    const _onCommandTypeChange = (_e: React.SyntheticEvent, value: MultiDropdownModel[]) => {
        _e.preventDefault();
        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
        if (filteredValues.length === 0) {
            setCommandTypeSelected(true);
        } else {
            setCommandTypeSelected(false);
        }
        setDisableLogType(false);
        if (deviceType == deviceType_DVR) {
            if (filteredValues.length === 1 && (filteredValues[0].id === _optDVRCommandTypeList[2].id || filteredValues[0].id === _optDVRCommandTypeList[3].id)) {
                setModeOptionDropdown([_optDVRModeList[0]]);
                setDisableLogType(true);
                setModeTypeSelected(false);
            }
            if (filteredValues.length === 2 && filteredValues.filter((x) => x.id === _optDVRCommandTypeList[2].id || x.id === _optDVRCommandTypeList[3].id).length === 2) {
                setModeOptionDropdown([_optDVRModeList[0]]);
                setDisableLogType(true);
                setModeTypeSelected(false);
            }
        } else {
            if (filteredValues.length === 1 && (filteredValues[0].id === _optBodyWornCommandTypeList[2].id)) {
                setModeOptionDropdown([_optBodyWornModeList[1]]);
                setDisableLogType(true);
                setModeTypeSelected(false);
            }
        }
        setCommandTypeDropdown(filteredValues);
        setExecuteCommandStatus(false);
    }
    // Mode Dropdown Event DVR | IOT

    const _onModeOptionChange = (_e: React.SyntheticEvent, value: MultiDropdownModel[]) => {
        _e.preventDefault();
        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
        if (filteredValues.length === 0) {
            setModeTypeSelected(true);
        } else {
            setModeTypeSelected(false);
        }
        setModeOptionDropdown(filteredValues);
        setExecuteCommandStatus(false);
    }

    const OutputResponse = (_response: ResponseOutput, _type: string): boolean => {
        if (_response == null) {
            return false;
        }
        let _t = _type?.split(";");
        for (let index = 0; index < _t.length; index++) {
            if (_t[index] == _response.body.CommandType) {
                return true;
            }

        }
        return false;
    }

    const onMqttStatusRefreshBtn = () => {
        setMqttStatusResponse(undefined);
        GetMqqtLiveStatus.getMqqtLiveStatus(stationId, unitId).then((response: any) => {
            let _responseBody: MQTTStatusModal[] = response;
            setMqttStatusResponse(_responseBody);
        });
    }

    const getMqttStatusFromEnum = (status: string): { key: string, value: number } => {
        let value = Number(Object.keys(MQTTUnitStatus)[Object.values(MQTTUnitStatus).indexOf(status)]);
        let key = MQTTUnitStatus[value];
        return { key: key == null ? "" : key, value: isNaN(value) ? 0 : value };
    }


    const Exception_Debug_Diagnostic_Logs = (request: CommandTypeRequest) => {
        commandTypeRef.current = request;
    }

    const SystemInfo = () => {
        commandTypeRef.current = { CommandType: CommandIDAndType.SystemInfo.CommandType, CommandID: CommandIDAndType.SystemInfo.CommandId, Params: {} };
    }
    const DesktopSnapshot = () => {
        commandTypeRef.current = { CommandType: CommandIDAndType.DesktopSnapshot.CommandType, CommandID: CommandIDAndType.DesktopSnapshot.CommandId, Params: {} };
    }
    const GPSNMEALogs = () => {
        commandTypeRef.current = { CommandType: CommandIDAndType.GPSNMEALogs.CommandType, CommandID: CommandIDAndType.GPSNMEALogs.CommandId, Params: {} };
    }
    const StopDiagnostics = () => {
        commandTypeRef.current = { CommandType: CommandIDAndType.StopDiagnostics.CommandType, CommandID: CommandIDAndType.StopDiagnostics.CommandId, Params: {} };
    }

    const [openModal, setOpen] = React.useState(false);
    const closeDialog = () => {
        handleClose();
      };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const mqttStatusColor = (status: string): string => {

        switch (status) {
            case "FAILED":
                return "failedMqttStatus";
            case "SYNCING":
                return "syncingMqttStatus";
            case "SYNCED":
                return "syncedMqttStatus";
        }
        return "defaultMqttStatus";
    }


    return (
        <>
            <div className="diagnosticTabs">

                    <CRXRows container="container" spacing={0}>
                        
                        <CRXColumn
                         container="container"
                         item="item"
                         xs={1}
                         spacing={0}>

                            <Tabs
                            orientation="vertical"
                            // variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                            >
                            <Tab className="tabLabel" label={t("Diagnostics_Logs")} />
                            <Tab className="tabLabel" label={t("System_Info")} />
                            {deviceType == deviceType_DVR ? <Tab className="tabLabel" label="Desktop Snapshot" /> : <Tab className="tabLabel" label="GPSNMEA Logs" />}
                            <Tab className="tabLabel" label={t("Sync_Status")} />

                            </Tabs>

                        </CRXColumn>

                         <CRXColumn
                         container="container"
                         item="item"
                         xs={11}
                         spacing={0}>

                            <CrxTabPanel value={value} index={0} className="tabPanel">


                            <div className="main_column">

                                <CRXRows container="container" spacing={0} className="">
                                    <div className="dignosticLogs">
                                        <div className="dignosticField">
                                            <span className="label">Log Type</span>
                                            <CRXMultiSelectBoxLight
                                                id="commandTypeDropdown"
                                                className="command_type_multiSelect"
                                                multiple={true}
                                                error={commandTypeSelected}
                                                errorMsg={t("Command_Type_is_required")}
                                                onOpen={(e: any) => { }}
                                                value={commandTypeDropdown}
                                                options={deviceType == deviceType_DVR ? _optDVRCommandTypeList : _optBodyWornCommandTypeList}
                                                onChange={(_e: React.SyntheticEvent, value: MultiDropdownModel[]) => _onCommandTypeChange(_e, value)}
                                            />
                                        </div>
                                        <div className="dignosticField">
                                            <span className="label">Mode Type</span>
                                            <CRXMultiSelectBoxLight
                                                id="TypeDropdown"
                                                className="mode_type_multiSelect"
                                                disabled={disableLogType}
                                                multiple={true}
                                                autoComplete={false}
                                                isSearchable={false}
                                                isSuggestion={false}
                                                error={modeTypeSelected}
                                                errorMsg={t("Mode_Type_is_required")}
                                                onOpen={(e: any) => { }}
                                                value={modeOptionDropdown}
                                                options={deviceType == deviceType_DVR ? _optDVRModeList : _optBodyWornModeList}
                                                onChange={(_e: React.SyntheticEvent, value: MultiDropdownModel[]) => _onModeOptionChange(_e, value)}
                                            />
                                        </div>

                                        <div className="dignosticField">
                                            <span className="label">Logging Duration</span>

                                            <CRXSelectBox
                                                label={""}
                                                name=""
                                                value={logDurationValue}
                                                onChange={(e: any) => onLogDurationChange(e)}
                                                options={optLogDuration}
                                            />
                                        </div>

                                    </div>
                                </CRXRows>
                                <CRXRows container="container" spacing={0}>
                                    <CRXColumn className="logs_btn_group" container="container" item="item" xs={0} spacing={0}>
                                        <CRXButton
                                            className="logs_btn"
                                            disabled={executeCommandStatus}
                                            onClick={() => {
                                                OnExecuteCommand();
                                            }}
                                            color="primary" variant="text">
                                            {" "}
                                            {"Start"}
                                        </CRXButton>
                                        <CRXButton
                                            className="logs_btn"
                                            disabled={false}
                                            onClick={() => {
                                                StopDiagnostics();
                                                consumeCommand();
                                            }}
                                            color="primary" variant="text">
                                            {" "}
                                            {"Stop"}
                                        </CRXButton>
                                        <CRXButton className="modalBtn" onClick={handleOpen}>Full Screen</CRXButton>
                                    </CRXColumn>
                                </CRXRows>

                                {/* OutPut */}
                                <CRXColumn className="" container="container" item="item" xs={12} spacing={0}>


                                    <div>

                                        <CRXModalDialog
                                        title="Logs"
                                        className="diagnostic-logs"
                                        maxWidth="lg"
                                        modelOpen={openModal}
                                        onClose={closeDialog}
                                        closeWithConfirm={closeWithConfirm}
                                            
                                        >
                                            <Box className="consoleModal">
                                                <div>
                                                    {
                                                        OutputResponse(responseValue!, "ExceptionLogs;DebugLogs;DiagnosticLogs;Logs;AuditLogs")
                                                            ?
                                                            <LiveDiagnosticOutput response={responseValue!} />
                                                            :
                                                            null
                                                    }

                                                </div>
                                                
                                            </Box>

                                            <div className="modalFooter CRXFooter">
                                            
                                                <div className="cancelBtn">
                                                <CRXButton
                                                    className="secondary"
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleClose}
                                                >
                                                    {t("Close")}
                                                </CRXButton>
                                                </div>
                                            </div>

                                        </CRXModalDialog>
                                    </div>
                                    <div className="dss-logs">

                                        {
                                            OutputResponse(responseValue!, "ExceptionLogs;DebugLogs;DiagnosticLogs;Logs;AuditLogs")
                                                ?
                                                <LiveDiagnosticOutput response={responseValue!} />
                                                :
                                                null
                                        }
                                    </div>

                                </CRXColumn>
                            </div>

                            </CrxTabPanel>

                            <CrxTabPanel value={value} index={1} className="tabPanel">

                            <CRXButton className="modalBtn" onClick={handleOpen}>Full Screen</CRXButton>
                            {/* OutPut */}

                            <CRXModalDialog
                                        title="Syestem Info"
                                        className="diagnostic-logs"
                                        maxWidth="lg"
                                        modelOpen={openModal}
                                        onClose={closeDialog}
                                        closeWithConfirm={closeWithConfirm}
                                        >
                                <Box className="consoleModal">
                                    
                                    
                                    <div>

                                        {
                                            OutputResponse(responseValue!, "SystemInfo")
                                                ?
                                                <LiveDiagnosticOutput response={responseValue!} />
                                                :
                                                null
                                        }
                                    </div>
                                
                                </Box>

                                <div className="modalFooter CRXFooter">
                                            
                                                <div className="cancelBtn">
                                                <CRXButton
                                                    className="secondary"
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleClose}
                                                >
                                                    {t("Close")}
                                                </CRXButton>
                                                </div>
                                            </div>

                            </CRXModalDialog>

                            <div className="systemInfo-main">

                            {
                                OutputResponse(responseValue!, "SystemInfo")
                                    ?
                                    <LiveDiagnosticOutput response={responseValue!} />
                                    :
                                    null
                            }

                            </div>
                            </CrxTabPanel>

                            {
                            deviceType == deviceType_DVR
                                ?
                                <CrxTabPanel value={value} index={2} className="tabPanel desktop-main">


                                    <CRXModalDialog
                                        title="Desktop Snapshot"
                                        className="desktopSnapshot"
                                        maxWidth="lg"
                                        modelOpen={openModal}
                                        onClose={closeDialog}
                                        closeWithConfirm={closeWithConfirm}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                        <Box className="consoleModal">
                                            <CRXColumn className="" container="container" item="item" xs={12} spacing={0}>
                                                {
                                                    OutputResponse(responseValue!, "DesktopSnapshot")
                                                        ?
                                                        <LiveDiagnosticOutput response={responseValue!} />
                                                        :
                                                        null
                                                }
                                            </CRXColumn>
                                        </Box>

                                        <div className="modalFooter CRXFooter">
                                            
                                                <div className="cancelBtn">
                                                <CRXButton
                                                    className="secondary"
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleClose}
                                                >
                                                    {t("Close")}
                                                </CRXButton>
                                                </div>
                                            </div>

                                    </CRXModalDialog>


                                            <div className="desktopThumDetail">
                                                <div className="overlay">
                                                <a className="modalBtn" onClick={handleOpen}>
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                                {
                                                    OutputResponse(responseValue!, "DesktopSnapshot")
                                                        ?
                                                        <LiveDiagnosticOutput response={responseValue!} />
                                                        :
                                                        null
                                                }
                                                </a>
                                                </div>

                                                {/* <div className="overlay">
                                                    <a className="modalBtn" onClick={handleOpen}>
                                                        <i className="fa-solid fa-magnifying-glass"></i>
                                                    </a>
                                                </div> */}
                                            </div>
                                   


                                </CrxTabPanel>
                                :
                                <CrxTabPanel value={value} index={2} className="tabPanel">

                                    <CRXButton className="modalBtn" onClick={handleOpen}>Full Screen</CRXButton>
                                    {/* OutPut */}

                                    <CRXModalDialog
                                        maxWidth="lg"
                                        modelOpen={openModal}
                                        onClose={closeDialog}
                                        closeWithConfirm={closeWithConfirm}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                        <Box className="consoleModal">

                                            <CRXColumn className="" container="container" item="item" xs={12} spacing={0}>
                                                {
                                                    OutputResponse(responseValue!, "GPSNMEALogs")
                                                        ?
                                                        <LiveDiagnosticOutput response={responseValue!} />
                                                        :
                                                        null
                                                }
                                            </CRXColumn>
                                            

                                        </Box>

                                        <div className="modalFooter CRXFooter">
                                            
                                                <div className="cancelBtn">
                                                <CRXButton
                                                    className="secondary"
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleClose}
                                                >
                                                    {t("Close")}
                                                </CRXButton>
                                                </div>
                                            </div>

                                    </CRXModalDialog>

                                </CrxTabPanel>
                            }


                            <CrxTabPanel value={value} index={3} className="tabPanel">
                            <CRXButton
                                onClick={() => {
                                    onMqttStatusRefreshBtn();
                                }}
                                color="primary" variant="text">
                                {" "}{t("Refresh")}
                            </CRXButton>
                            {/* OutPut */}

                            <div className="statusTable">
                                {mqttStatusResponse == null || mqttStatusResponse.length == 0 ? null :
                                    <TableContainer
                                        className=" AssetsDataGrid tableScrollValue "
                                        component={Paper}
                                    >

                                        <div className="">

                                            <Table className="CRXDataTableCustom  tableHeaderVisibility MuiTable-stickyHeader">
                                                <thead>
                                                    <tr>
                                                        <th className="CRXDataTableLabelCell">{"Topic Type"}</th>
                                                        <th className="CRXDataTableLabelCell">{"Topic"}</th>
                                                        <th className="CRXDataTableLabelCell">{"DateTime"}</th>
                                                        <th className="CRXDataTableLabelCell message">{"Message"}</th>
                                                        <th className="CRXDataTableLabelCell">{"Status"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {mqttStatusResponse?.map((value, index) => (
                                                        <tr key={index} >
                                                            <td ><div><span>
                                                                {value.topicType}
                                                            </span></div></td>
                                                            <td className="mqttMessage">
                                                                <CRXTruncation placement="top" content={value.topic} className='content-truncation' />
                                                            </td>
                                                            <td ><div><span>
                                                                {value.dateTime}
                                                            </span></div></td>
                                                            <td className="mqttMessage">
                                                                <CRXTruncation placement="top" content={value.message} className='content-truncation' />
                                                            </td>
                                                            <td >
                                                                <div className="mqttStatus">

                                                                    {/* <LinearProgress variant="determinate" value={getMqttStatusFromEnum(value.status).value} /> */}
                                                                    <span className={mqttStatusColor(value.status)}>
                                                                        <CRXProgressBar
                                                                            // loadingText={item.uploadInfo.uploadText}
                                                                            loadingText={getMqttStatusFromEnum(value.status).key}
                                                                            value={getMqttStatusFromEnum(value.status).value}
                                                                            width={300}
                                                                            maxDataSize={false}

                                                                        />
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>

                                    </TableContainer>}



                            </div>
                            </CrxTabPanel>


                        </CRXColumn>


                    </CRXRows>
                    
            </div>

        </>
    );
};

export default LiveDiagnostic;




