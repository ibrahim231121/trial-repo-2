import { CRXSelectBox } from "@cb/shared";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { getStationsInfoAllAsync } from "../../../Redux/StationReducer";
import { getDeviceTypeInfoAsync } from "../../../Redux/TemplateConfiguration";
import { DeviceType } from "../../../utils/Api/models/UnitModels";
import FilterUpdateVersionDataGrid from "./FilterUpdateVersionDataGrid";
import "./FilterUpdateVersion.scss";
import CreateUpdateVersion, { UpdateDeviceVersion, constantdays } from "./CreateUpdateVersion";
import { FilterUpdateVersion as FUpdateVersion } from "../../../utils/Api/models/UnitModels";
import { useParams } from "react-router-dom";
import { UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { CRXRows, CRXToaster, CRXConfirmDialog } from "@cb/shared";

const FilterUpdateVersion: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [jobId, setJobId] = React.useState<number>(parseInt(id ?? "0"));

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const toasterMsgRef = React.useRef<typeof CRXToaster>(null);

  const [tempChangeDropDown, setTempChangeDropDown] = useState<any>("");
  const [tempChangeDropDownValue, setTempChangeDropDownValue] = useState<any>("");
  const [stationListKeyValue, setStationListKeyValue] = useState<any>([]);
  const [deviceTypeListKeyValue, setDeviceTypeListKeyValue] = useState<any>([]);
  const [selectedItems, setSelectedItems] = React.useState<FUpdateVersion[]>([]);
  const [IsOpenConfirmDailog, setIsOpenConfirmDailog] = React.useState(false);
  const [primaryDeviceFilter, setPrimaryDeviceFilter] = React.useState<any>({
    stationId: 0,
    deviceTypeId: 0
  });
  const stationList = useSelector((state: RootState) => state.stationReducer.stationInfo);
  const deviceTypeList: DeviceType[] = useSelector((state: RootState) => state.templateSlice.deviceType);
  const [formData, setFormData] = React.useState<UpdateDeviceVersion>();
  
  useEffect(() => {
    if (jobId > 0) {
      UnitsAndDevicesAgent.getSingleUpdateVersion(jobId)
        .then(response => {
          var timeStart = dateTimeConversion(true, response.scheduleVersion.timeStart);
          var timeEnd = dateTimeConversion(false, response.scheduleVersion.timeEnd);
          var resDays = response.scheduleVersion.days.split(',');
          let updateDeviceVersion: UpdateDeviceVersion = {
            id: response.id,
            name: response.name,
            daysWeek: response.scheduleVersion.days.split(',').length == 7 ? 0 : 1,
            timeRange: (response.scheduleVersion.timeStart && response.scheduleVersion.timeEnd) ? 1 : 0,
            weeks: resDays,
            timeStart: timeStart,
            timeEnd: timeEnd,
            versionId: response.versionId,
            silent: response.isSilent,
            updateVersionDevices: response.updateVersionDevices.map(x => {return {deviceId: x.deviceId, logs: x.logs }})
          }
          setPrimaryDeviceFilter({...primaryDeviceFilter, deviceTypeId: response.deviceTypeId, stationId: response.stationId})
          setFormData(updateDeviceVersion);
        })
    }
  }, [])

  useEffect(() => {
    dispatch(getStationsInfoAllAsync());
    dispatch(getDeviceTypeInfoAsync());
  }, []);

  useEffect(() => {
    if (stationList && deviceTypeList && stationList.length > 0 && deviceTypeList.length > 0) {

      let stationlst: any = [{ displayText: "None", value: "0" }];
      stationList.forEach((x: any) => {
        stationlst.push({ displayText: x.name, value: x.id });
      });
      setStationListKeyValue(stationlst)
      let deviceTypelst: any = [{ displayText: "None", value: "0" }];
      var tempList = deviceTypeList.filter(x => x.fotaRelated == true)
      tempList.forEach((x: any) => {
        deviceTypelst.push({ displayText: x.name, value: x.id });
      });
      setDeviceTypeListKeyValue(deviceTypelst)
    }
  }, [stationList, deviceTypeList]);

  const onChangeStation = (e: any) => {
    if (selectedItems.length > 0) {
      setTempChangeDropDown("stationId");
      setTempChangeDropDownValue(e.target.value);
      setIsOpenConfirmDailog(true);
    }
    else {
      setPrimaryDeviceFilter({ stationId: e.target.value, deviceTypeId: primaryDeviceFilter.deviceTypeId })
    }
  };

  const onChangeDeviceType = (e: any) => {
    if (selectedItems.length > 0) {
      setTempChangeDropDown("deviceTypeId");
      setTempChangeDropDownValue(e.target.value);
      setIsOpenConfirmDailog(true);
    }
    else {
      setPrimaryDeviceFilter({ stationId: primaryDeviceFilter.stationId, deviceTypeId: e.target.value })
    }
  };

  const onConfirmDialog = () => {
    if (tempChangeDropDown == "stationId") {
      setPrimaryDeviceFilter({ stationId: tempChangeDropDownValue, deviceTypeId: primaryDeviceFilter.deviceTypeId })
    }
    else if (tempChangeDropDown == "deviceTypeId") {
      setPrimaryDeviceFilter({ stationId: primaryDeviceFilter.stationId, deviceTypeId: tempChangeDropDownValue })
    }
    setIsOpenConfirmDailog(false);
  };

  const dateTimeConversion = (start : boolean, time? : Date) => {
    if (time)
    {
      let tempTime = new Date(time);
      var preffix = String(tempTime.getHours()).padStart(2, '0');
      var suffix = String(tempTime.getMinutes()).padStart(2, '0');
      return preffix + ":" + suffix;
    }
    return start ? '00:01' : '12:00';
  };

  return (
    <>
      <CRXToaster ref={toasterMsgRef} />
      <CRXConfirmDialog
        setIsOpen={() => setIsOpenConfirmDailog(false)}
        onConfirm={onConfirmDialog}
        title="Please Confirm"
        isOpen={IsOpenConfirmDailog}
        primary="Yes"
        secondary="No"
      >
        {
          <div>
            Are you sure you want to continue? Any previous device selections will not be saved.
          </div>
        }
      </CRXConfirmDialog>

      <div className="">

      <CRXRows container  direction="column" alignItems="center">
        
            <div className="filterUploadSelectGridMain">
            <div className="filterUploadSelectGridDiv">
              <div className="filterUploadSelectSelect">
                <div className="select_label">{t("Station")}</div>
                <div>
                  <CRXSelectBox
                    label={t("Station")}
                    name="Station"
                    value={primaryDeviceFilter.stationId}
                    icon={true}
                    options={stationListKeyValue}
                    onChange={onChangeStation}
                  />
                </div>
              </div>
              <div className="filterUploadSelectSelect">
                <div className="select_label">{"Device Type"}</div>
                <div>
                  <CRXSelectBox
                    label={"Device Type"}
                    name="DeviceType"
                    value={primaryDeviceFilter.deviceTypeId}
                    icon={true}
                    options={deviceTypeListKeyValue}
                    onChange={onChangeDeviceType}
                  />
                </div>
              </div>
            </div>


        <div className="createUpdateVersion">
          <CreateUpdateVersion
            primaryDeviceFilter={primaryDeviceFilter}
            selectedItems={selectedItems}
            toasterMsgRef={toasterMsgRef}
            setPrimaryDeviceFilter={setPrimaryDeviceFilter}
            formData={formData}
          />
        </div>
      </div>

      </CRXRows>

      </div>

      <FilterUpdateVersionDataGrid
        primaryDeviceFilter={primaryDeviceFilter}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        formData={formData}
      />

    </>
  );
};

export default FilterUpdateVersion;
