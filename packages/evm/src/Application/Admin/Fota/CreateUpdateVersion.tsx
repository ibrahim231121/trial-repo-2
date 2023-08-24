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
import { FilterUpdateVersion, UpdateVersion, UpdateVersionDevice, ScheduleVersion } from "../../../utils/Api/models/UnitModels";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { useDispatch } from "react-redux";
import { CRXRows, CRXColumn, CRXButton, CRXConfirmDialog } from "@cb/shared";


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
    updateVersionDevices?: any[]
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
    const startTime = React.useRef<string>("00:00");
    const endTime = React.useRef<string>("00:00");
    const [nameErr, setNameErr] = React.useState("");
    const [updateDeviceVersion, setUpdateDeviceVersion] = React.useState<UpdateDeviceVersion>({
        name: 'UpdateVersionJob_' + currentDataTime,
        daysWeek: 0,
        timeRange: 0,
        weeks: constantdays,
        timeStart: '00:01',
        timeEnd: '12:00',
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
        if ((validateTime() && checkNameValidation() && updateDeviceVersion.versionId > 0 && selectedItems.length > 0) && (updateDeviceVersion.daysWeek > 0 ? updateDeviceVersion.weeks.length > 0 : true)) {
            setIsSave(true);
        }
        else {
            setIsSave(false);
        }
    }, [updateDeviceVersion, selectedItems]);

    const deviceTypeIdChangeEvent = () => {
        if (primaryDeviceFilter.deviceTypeId > 0) {
            UnitsAndDevicesAgent
                .getDeviceSoftwareVersion('/DeviceSoftwareVersion/' + `${primaryDeviceFilter.deviceTypeId}`)
                .then((response) => {
                    setVersionData(response)
                })
        }
        else {
            setIsDeviceTypeId(false);
        }
        setUpdateDeviceVersion({ ...updateDeviceVersion, versionId: 0 })
    }

    useEffect(() => {
        deviceTypeIdChangeEvent();
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

    const updateTime = () => {
        startTime.current = updateDeviceVersion.timeStart;
        endTime.current = updateDeviceVersion.timeEnd;
    };

    const validateTime = () => {
        if (updateDeviceVersion.timeRange > 0) {
            updateTime();
            let sTime = startTime.current;
            let eTime = endTime.current;
            let timeStartArray = sTime.split(":");
            let timeStartInMinutes = Number(timeStartArray[0]) * 60 + Number(timeStartArray[1]);

            const timeEndArray = eTime.split(":");
            let timeEndInMinutes = Number(timeEndArray[0]) * 60 + Number(timeEndArray[1]);
            if (((timeEndInMinutes - timeStartInMinutes) > 60) && ((timeEndInMinutes - timeStartInMinutes) >= 0)) {
                return true;
            }
            return false;
        }
        return true;
    };

    const onClickSync = () => {
        dispatch(setLoaderValue({ isLoading: true, message: "" }))
        UnitsAndDevicesAgent
            .syncSoftwareVersion('/DeviceSoftwareVersion/SyncSoftwareVersion')
            .then((response) => {
                deviceTypeIdChangeEvent();
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
        let versionId: any;
        if (updateDeviceVersion.daysWeek > 0) {
            days = updateDeviceVersion.weeks.join(',')
        }
        else {
            days = constantdays.join(',')
        }
        if (updateDeviceVersion.timeRange > 0) {
            updateTime();
        }
        else {
            startTime.current = '';
            endTime.current = '';
        }
        versionId = versionKeyValue.find((x: any) => x.value == updateDeviceVersion.versionId)?.value;
        let tempTimeStart;
        let tempTimeEnd;
        if(startTime.current && startTime.current.length>0){
            tempTimeStart = new Date();
            let tempTime = startTime.current.split(':');
            tempTimeStart.setHours(Number(tempTime[0]));
            tempTimeStart.setMinutes(Number(tempTime[1]));
        }
        if(endTime.current && endTime.current.length>0){
            tempTimeEnd = new Date();
            let tempTime = endTime.current.split(':');
            tempTimeEnd.setHours(Number(tempTime[0]));
            tempTimeEnd.setMinutes(Number(tempTime[1]));
        }
        let scheduleVersion: ScheduleVersion =
        {
            days: days,
            timeStart: tempTimeStart,
            timeEnd: tempTimeEnd
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
                    setFormModified(false);
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
            UnitsAndDevicesAgent.putUpdateVersions(`/UpdateVersion/` + formData?.id, updateVersionObject)
                .then((response: any) => {
                    dispatch(setLoaderValue({ isLoading: false, message: "" }))
                    toasterMsgRef.current.showToaster({
                        message: "Saved", variant: "success", duration: 5000, clearButtton: true
                    });
                    setFormModified(false);
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
    const checkNameValidation = () => {
        let isValid = false;
        var pattern = new RegExp("^([a-zA-Z0-9._-]){1}[A-Za-z0-9._-]*$");
        if (!updateDeviceVersion.name) {
            setNameErr(t("Name_is_required"))
        }
        else if (!pattern.test(updateDeviceVersion.name)) {
            setNameErr(t("Special characters are not allowed"))
        }
        else if (updateDeviceVersion.name.length < 3 || updateDeviceVersion.name.length > 128) {
            setNameErr(t("Character length between 3 to 128"))
        }
        else {
            setNameErr("")
            isValid = true;
        }
        return isValid;
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
                className='description-input gridFilterTextBox'
                required={true}
                onChange={(e: any) => onChangeName(e)}
                onBlur={() => checkNameValidation()}
                error={!!nameErr}
                errorMsg={nameErr}
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


        
            <CRXRows container spacing={3} className="crtVersionBtns">
                <CRXColumn item xs={3} alignItems="center">
                <div><CRXButton className='primary' onClick={onClickSync}>
                        Sync Version
                    </CRXButton></div>
                </CRXColumn>
                <CRXColumn item xs={2} alignItems="center">
                <div> <CRXButton className='primary' onClick={onSubmit} disabled={!isSave}>
                        Save
                    </CRXButton></div>
                </CRXColumn>
                <CRXColumn item xs={2} alignItems="center">
                <div><CRXButton className='primary' onClick={handleCancel} >
                        Cancel
                    </CRXButton></div>
                </CRXColumn>
            </CRXRows>

            
            
            <div>
                <label>Devices selected for update: {selectedItems.length}</label>
            </div>

        </>
    );
};
export default CreateUpdateVersion;
