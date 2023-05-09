import { CRXSelectBox } from "@cb/shared";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { TextField } from "@cb/shared";
import { UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { CRXCheckBox } from "@cb/shared";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { CRXButton } from "@cb/shared";
import { FilterUpdateVersion, UpdateVersion, UpdateVersionDevice, ScheduleVersion } from "../../../utils/Api/models/UnitModels";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { useDispatch } from "react-redux";
import { CRXConfirmDialog } from "@cb/shared";
type Props = {
    primaryDeviceFilter: any
    selectedItems: FilterUpdateVersion[],
    toasterMsgRef: any,
    setPrimaryDeviceFilter: any,
    formData: UpdateDeviceVersion | undefined
};

export interface UpdateDeviceVersion {
    id?: number,
    name: string,
    daysWeek: number,
    timeRange: number,
    weeks: string[],
    timeStart: string,
    timeEnd: string,
    versionId: number,
    silent: boolean,
    devicesId?: number[]
}
export const constantdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const CreateUpdateVersion: React.FC<Props> = ({ primaryDeviceFilter, selectedItems, toasterMsgRef, setPrimaryDeviceFilter, formData }) => {
    let currentDataTime = moment().format("DDMMYYYYhhmmss")
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation<string>();
    const [daysWeekKeyValue, setDaysWeekKeyValue] = React.useState<any>([{ displayText: "All", value: "0" }, { displayText: "Custom", value: "1" }]);
    const [timeRangeKeyValue, setTimeRangeKeyValue] = React.useState<any>([{ displayText: "Any Time", value: "0" }, { displayText: "Custom", value: "1" }]);
    const [versionKeyValue, setVersionKeyValue] = React.useState<any>([{ displayText: "None", value: "0" }]);
    const [displayDaysWeek, setDisplayDaysWeek] = React.useState<boolean>(false);
    const [displayTime, setDisplayTime] = React.useState<boolean>(false);
    const [isDeviceTypeId, setIsDeviceTypeId] = React.useState<boolean>(false);
    const [isDisplayTime, setIsDisplayTime] = React.useState<boolean>(false);
    const [isSave, setIsSave] = React.useState<boolean>(false);
    const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
    const [formModified, setFormModified] = React.useState(false);
    const [updateDeviceVersion, setUpdateDeviceVersion] = React.useState<UpdateDeviceVersion>({
        name: 'UpdateVersionJob_' + currentDataTime,
        daysWeek: 0,
        timeRange: 0,
        weeks: constantdays,
        timeStart: '00:01',
        timeEnd: '00:00',
        versionId: 0,
        silent: true
    });

    useEffect(() => {
        if (formData) {
            setUpdateDeviceVersion(formData);
        }
    }, [formData])

    useEffect(() => {
        if (updateDeviceVersion.daysWeek > 0) {
            setDisplayDaysWeek(true);
        }
        if (updateDeviceVersion.timeRange > 0) {
            setIsDisplayTime(true);
        }
        if (updateDeviceVersion.daysWeek == 0) {
            setDisplayDaysWeek(false);
        }
        if (updateDeviceVersion.timeRange == 0) {
            setIsDisplayTime(false);
        }
        if ((updateDeviceVersion.name.length > 0 && updateDeviceVersion.versionId > 0 && selectedItems.length > 0) && (updateDeviceVersion.daysWeek > 0 ? updateDeviceVersion.weeks.length > 0 : true)) {
            setIsSave(true);
        }
        else {
            setIsSave(false);
        }
    }, [updateDeviceVersion, selectedItems]);

    useEffect(() => {
        if (primaryDeviceFilter.deviceTypeId > 0) {
            UnitsAndDevicesAgent
                .getDeviceSoftwareVersion('/DeviceSoftwareVersion/' + `${primaryDeviceFilter.deviceTypeId}`)
                .then((response) => {
                    setVersionData(response)
                })
        }
        else {
            setUpdateDeviceVersion({ ...updateDeviceVersion, versionId: 0 })
            setIsDeviceTypeId(false);
        }
        setUpdateDeviceVersion({
            name: 'UpdateVersionJob_' + currentDataTime,
            daysWeek: 0,
            timeRange: 0,
            weeks: constantdays,
            timeStart: '00:01',
            timeEnd: '00:00',
            versionId: 0,
            silent: true
        })
    }, [primaryDeviceFilter.deviceTypeId]);

    const setVersionData = (data: any) => {
        setIsDeviceTypeId(true);
        let versionlst: any = [{ displayText: "None", value: "0" }];
        data.map((x: any) => {
            versionlst.push({ displayText: x.version, value: x.id });
        });
        setVersionKeyValue(versionlst)
    };

    const onChangeDaysDropDown = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, daysWeek: e.target.value })
        setFormModified(true)
    };

    const onChangeTimeDropDown = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, timeRange: e.target.value })
        setFormModified(true)
    };

    const onChangeVersionDropDown = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, versionId: e.target.value })
        setFormModified(true)
    };

    const onChangeName = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, name: e.target.value })
        setFormModified(true)
    };

    const handleDays = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, weeks: newFormats })
        setFormModified(true)
    };

    const onTime1Change = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, timeStart: e.target.value })
        setFormModified(true)
    };

    const onTime2Change = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, timeEnd: e.target.value })
        setFormModified(true)
    };

    const handleSilentUpdate = (e: any) => {
        setUpdateDeviceVersion({ ...updateDeviceVersion, silent: e.target.checked })
        setFormModified(true)
    };

    const onClickSync = () => {
        dispatch(setLoaderValue({ isLoading: true, message: "" }))
        UnitsAndDevicesAgent
            .syncSoftwareVersion('/DeviceSoftwareVersion/SyncSoftwareVersion')
            .then((response) => {
                setIntialState();
                dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                toasterMsgRef.current.showToaster({
                    message: "Version Synced", variant: "success", duration: 5000, clearButtton: true
                });
            })
            .catch((error: any) => {
                dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
            })
    };

    const setIntialState = () => {
        setUpdateDeviceVersion({
            name: 'UpdateVersionJob_' + currentDataTime,
            daysWeek: 0,
            timeRange: 0,
            weeks: constantdays,
            timeStart: '00:01',
            timeEnd: '00:00',
            versionId: 0,
            silent: true
        })
        setPrimaryDeviceFilter({
            station: 0,
            deviceTypeId: 0
        })
    };
    const handleCancel = () => {
        if (formModified) {
            setIsOpenConfirmDailog(true);
        }
        else {
            history.goBack();
        }

    }
    const onSubmit = () => {
        let days: string;
        let timeStart: Date;
        let timeEnd: Date;
        let versionId: any;
        if (updateDeviceVersion.daysWeek > 0) {
            days = updateDeviceVersion.weeks.join(',')
        }
        else {
            days = constantdays.join(',')
        }
        if (updateDeviceVersion.timeRange > 0) {
            const timeStartArray = updateDeviceVersion.timeStart.split(":");
            const timeEndArray = updateDeviceVersion.timeEnd.split(":");
            let Time1 = new Date();
            let Time2 = new Date();
            Time1.setHours(Number(timeStartArray[0]));
            Time1.setMinutes(Number(timeStartArray[1]));
            Time1.setSeconds(0);
            timeStart = Time1;
            Time2.setHours(Number(timeEndArray[0]));
            Time2.setMinutes(Number(timeEndArray[1]));
            Time2.setSeconds(0);
            timeEnd = Time2;
        }
        else {
            let Time1 = new Date();
            let Time2 = new Date();
            Time1.setHours(0);
            Time1.setMinutes(0);
            Time1.setSeconds(0);
            timeStart = Time1;
            Time2.setHours(24);
            Time2.setMinutes(0);
            Time2.setSeconds(0);
            timeEnd = Time2;
        }
        versionId = versionKeyValue.find((x: any) => x.value == updateDeviceVersion.versionId)?.value;

        let scheduleVersion: ScheduleVersion =
        {
            days: days,
            timeStart: timeStart,
            timeEnd: timeEnd
        }

        let updateVersionDevice: UpdateVersionDevice[] = selectedItems.map((x: FilterUpdateVersion) => {
            return {
                deviceId: x.id ?? 0,
                deviceStatus: "Pending"
            };
        })

        let updateVersionObject: UpdateVersion =
        {
            name: updateDeviceVersion.name,
            versionId: versionId,
            scheduleVersion: scheduleVersion,
            isSilent: updateDeviceVersion.silent,
            deviceTypeId: primaryDeviceFilter.deviceTypeId,
            stationId: primaryDeviceFilter.stationId,
            updateVersionDevices: updateVersionDevice
        }
        dispatch(setLoaderValue({ isLoading: true, message: "" }))
        if ((formData?.id ?? 0) == 0) {
            UnitsAndDevicesAgent.addUpdateVersions(`/UpdateVersion`, updateVersionObject)
                .then((response: any) => {
                    dispatch(setLoaderValue({ isLoading: false, message: "" }))
                    toasterMsgRef.current.showToaster({
                        message: "Saved", variant: "success", duration: 5000, clearButtton: true
                    });
                })
                .catch((error: any) => {
                    dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                    toasterMsgRef.current.showToaster({
                        message: "Failed Saved", variant: "error", duration: 5000, clearButtton: true
                    });
                    console.error(error.response.data);
                });
        }
        else {
            UnitsAndDevicesAgent.putUpdateVersions(`/UpdateVersion/`+ formData?.id, updateVersionObject)
                .then((response: any) => {
                    dispatch(setLoaderValue({ isLoading: false, message: "" }))
                    toasterMsgRef.current.showToaster({
                        message: "Saved", variant: "success", duration: 5000, clearButtton: true
                    });
                })
                .catch((error: any) => {
                    dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                    toasterMsgRef.current.showToaster({
                        message: "Failed Saved", variant: "error", duration: 5000, clearButtton: true
                    });
                    console.error(error.response.data);
                });
        }
    };

    return (
        <>
            <CRXConfirmDialog
                setIsOpen={() => setIsOpenConfirmDailog(false)}
                onConfirm={() => { history.goBack() }}
                title="Please Confirm"
                isOpen={IsOpenConfirmDailog}
                primary="Yes"
                secondary="No"
            >
                {
                    <div>
                        Are you sure you want to continue? Any unsaved changes will be lost.
                    </div>
                }
            </CRXConfirmDialog>
            <TextField
                value={updateDeviceVersion.name}
                label='Name'
                className='description-input'
                required={true}
                onChange={(e: any) => onChangeName(e)}
            />
            <div className="configurationTemplateLabel groupInfoInputs unitConfiguration_select">
                <div className="select_label">{t("Days of the Week")}</div>
                <div className="daysWeekFields">
                    <CRXSelectBox
                        label={t("Days of the Week")}
                        name="DaysoftheWeek"
                        value={updateDeviceVersion.daysWeek}
                        icon={true}
                        options={daysWeekKeyValue}
                        onChange={onChangeDaysDropDown}
                    />
                    <div>
                        {displayDaysWeek && <ToggleButtonGroup value={updateDeviceVersion.weeks} onChange={handleDays} aria-label="text formatting">
                            <ToggleButton value="Sun" aria-label="Sun">
                                Sun
                            </ToggleButton>
                            <ToggleButton value="Mon" aria-label="Mon">
                                Mon
                            </ToggleButton>
                            <ToggleButton value="Tue" aria-label="Tue">
                                Tue
                            </ToggleButton>
                            <ToggleButton value="Wed" aria-label="Wed">
                                Wed
                            </ToggleButton>
                            <ToggleButton value="Thur" aria-label="Thur">
                                Thur
                            </ToggleButton>
                            <ToggleButton value="Fri" aria-label="Fri">
                                Fri
                            </ToggleButton>
                            <ToggleButton value="Sat" aria-label="Sat">
                                Sat
                            </ToggleButton>
                        </ToggleButtonGroup>}
                    </div>
                </div>
            </div>

            <div className="configurationTemplateLabel groupInfoInputs unitConfiguration_select">
                <div className="select_label">{t("Time Range")}</div>
                <div>
                    <CRXSelectBox
                        label={t("Time Range")}
                        name="TimeRange"
                        value={updateDeviceVersion.timeRange}
                        icon={true}
                        options={timeRangeKeyValue}
                        onChange={onChangeTimeDropDown}
                    />
                </div>
            </div>
            {isDisplayTime && <div>
                <TextField
                    id="timeStart"
                    label="From"
                    type="time"
                    onChange={(e: any) => onTime1Change(e)}
                    value={updateDeviceVersion.timeStart}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
                <TextField
                    id="timeEnd"
                    label="To"
                    type="time"
                    onChange={(e: any) => onTime2Change(e)}
                    value={updateDeviceVersion.timeEnd}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                />
            </div>}
            <div className="configurationTemplateLabel groupInfoInputs unitConfiguration_select">
                <div className="select_label">{t("Upgrade Version")}</div>
                <div>
                    <CRXSelectBox
                        label={t("Upgrade Version")}
                        name="UpgradeVersion"
                        value={updateDeviceVersion.versionId}
                        icon={true}
                        options={versionKeyValue}
                        onChange={onChangeVersionDropDown}
                        disabled={!isDeviceTypeId}
                    />
                </div>
            </div>
            <div className='crx-requird-check'>
                <CRXCheckBox
                    checked={updateDeviceVersion.silent}
                    lightMode={true}
                    className='crxCheckBoxCreate'
                    onChange={(e: any) => handleSilentUpdate(e)}
                />
                <label>Silent Update</label>
            </div>
            <div>
                <CRXButton className='primary' onClick={onClickSync}>
                    Sync Version
                </CRXButton>
            </div>
            <div>
                <CRXButton className='primary' onClick={onSubmit} disabled={!isSave}>
                    Save
                </CRXButton>
            </div>
            <div>
                <CRXButton className='primary' onClick={handleCancel} >
                    Cancel
                </CRXButton>
            </div>
            <div>
                <label>Devices selected for update: {selectedItems.length}</label>
            </div>
        </>
    );
};
export default CreateUpdateVersion;
