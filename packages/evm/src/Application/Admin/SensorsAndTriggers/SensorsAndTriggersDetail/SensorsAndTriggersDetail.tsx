import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { useHistory, useParams } from "react-router";
import { CRXButton, CRXConfirmDialog,CRXAlert, CRXRows, CRXColumn, CRXSelectBox, CRXCheckBox, TextField, CRXHeading,CRXTooltip } from "@cb/shared";
import {useTranslation } from "react-i18next";
import { defaultDevice, defaultParameter, defaultCriteria, defaultAction, defaultBookmark, defaultCamera,defaultCategory, defaultIcon } from '../TypeConstant/constants';
import { DeviceParameterModel, SelectBoxType, SwitchParametersModel, DeviceParameterDropdownModel, SwitchParametersDropdownModel, SensorAndTriggerDetailErrorModel, SensorAndTriggerDetailValidationModel, CameraSelectBoxType, SelectBoxTypeExpand, CameraSelectBoxTypeExpand } from '../TypeConstant/types';
import Grid from "@material-ui/core/Grid";
import './sensorsAndTriggersDetail.scss';
import {SensorsAndTriggers} from '../../../../utils/Api/models/SensorsAndTriggers';
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import { useDispatch,useSelector } from "react-redux";
import { getAllSensorsEvents, getAllData } from "../../../../Redux/SensorEvents";
import { RootState } from "../../../../Redux/rootReducer";
import { CRXTabs, CrxTabPanel } from "@cb/shared";
import { getByPlaceholderText } from "@testing-library/react";
import { CRXMultiSelectBoxLight, NumberField } from "@cb/shared";
import { Camera } from "@material-ui/icons";
import { CRXToaster } from "@cb/shared";

type SensorsAndTriggersDetailProps = {
    id: string
}

const defaultValidationModel: SensorAndTriggerDetailValidationModel = {
    name: '',
    bookmark: '',
    action: '',
    icon: '',
    overlay: '',
    category: '',
    description: '',
    camera: '',
    emailAlert: '',
    allowCancellation: '',
}

const CAMERAS = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
]

const SensorsAndTriggersDetail: FC<SensorsAndTriggersDetailProps> = () => {

    const defaultSwitchParameters: SwitchParametersModel = {
        bookmark: { id: 0, data: { value: 0, label: "" } },
        action: { id: 0, data: { value: 0, label: "" } },
        icon: { id: 0, data: { value: 0, label: "" } },
        overlay: { id: 0, data: "" },
        category: { id: 0, data: { value: 0, label: "" } },
        description: { id: 0, data: "" },
        camera: { id: 0, data: [{ value: 0, label: "" }] },
        emailAlert: { id: 0, data: false },
        allowCancellation: { id: 0, data: false },
    }

    const defaultDeviceParameter = {
        id: 0,
        device: { value: 0, label: "" },
        parameter: { value: 0, label: "" },
        criteria: { value: 0, label: "" },
        value: 0
    }

    const [settingsDropdownData, setSettingsDropdownData] = useState<SwitchParametersDropdownModel>({ 
        bookmarkList: [],
        actionList: [],
        iconList: [],
        categoryList: [],
        cameraList: []
     });

    const [deviceParametersDropdownData, setDeviceParameterDropdownData] = useState<DeviceParameterDropdownModel>({
        deviceList: [],
        deviceParamsList: [],
        criteriaList: []
    });

    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState<string>("");
    const [success, setSuccess] = React.useState<boolean>(false);
    const [switchParameters, setSwitchParameters] = useState<SwitchParametersModel>(defaultSwitchParameters);
    const [deviceSettingsValidation, setDeviceSettingsValidation] = useState<SensorAndTriggerDetailValidationModel>(defaultValidationModel);
    const [deviceParameters, setDeviceParameter] = useState<DeviceParameterModel[]>([defaultDeviceParameter]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isAddDeviceParameterDisable, setIsAddDeviceParameterDisable] = useState<boolean>(true);
    const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
    const isFirstRenderRef = useRef<boolean>(true);
    const deletedParamValuesIdRef = useRef<number[]>([]);
    const dataToEdit = useRef<any>(null);
    const [error, setError] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const history = useHistory();
    const dispatch = useDispatch();
    const getAll: any = useSelector((state: RootState) => state.sensorEventsSlice.getAll);
    const sensorFormRef = useRef<typeof CRXToaster>(null)

    const [cameraMultiValue,setCameraMultiValue] = useState<any>();
    const [cameraValue,setcameraValue] = useState<SelectBoxType[]>([{value:0,label:'0'}]);
    
    const { t } = useTranslation<string>(); 
    useEffect(() => {
        if(!isFirstRenderRef.current) {
            if(!disableAddDeviceParameter() && name.length > 0 && switchParameters.action.data.value > 0) {
                setIsSaveDisable(false);
            }
            else{
                setIsSaveDisable(true); 
            }
        }
    }, [name,deviceParameters,switchParameters.action.data.value])

    useEffect(() => {
        if(getAll != null) {
            let newSettingsDropdownData: SwitchParametersDropdownModel = {
                bookmarkList: [],
                actionList: [],
                iconList: [],
                categoryList: [],
                cameraList: []
            };
            let newDeviceParametersDropdownData: DeviceParameterDropdownModel = {
                deviceList: [],
                deviceParamsList: [],
                criteriaList: []
            }

            actionData(newSettingsDropdownData);
            bookmarksData(newSettingsDropdownData);
            categoriesData(newSettingsDropdownData);
            newSettingsDropdownData.cameraList = Array.isArray(CAMERAS) === true ? CAMERAS : [];
            iconsData(newSettingsDropdownData);
            devicesData(newDeviceParametersDropdownData);
            devicesParamsData(newDeviceParametersDropdownData);
            matchTypesData(newDeviceParametersDropdownData);
            setSettingsDropdownData(newSettingsDropdownData);
            setDeviceParameterDropdownData(newDeviceParametersDropdownData);
        }
    }, [getAll]);

    useEffect (() => {
        dispatch(enterPathActionCreator({ val: "" }));
        return () => {
            dispatch(enterPathActionCreator({ val: "" }));
          }
    },[])

    useEffect(() => {
        dispatch(getAllData());
        isFirstRenderRef.current = false;
        if (id != undefined && id != null && id.length > 0) {
            SetupConfigurationAgent.getSensorsAndTriggersEvents(id).then((response: any) => {
                let switchParametersObj = {...switchParameters};
                setName(response.description);
                response.switchParameters.forEach((item: {id: string, key: string, value: string}) => {
                let property = switchParametersObj[item.key as keyof SwitchParametersModel];
                switchParametersItem(property,item);
                });
                let deviceParametersArray : any[] = [];
                DeviceparametersItem(response, deviceParametersArray);
                setSwitchParameters(switchParametersObj);
                setDeviceParameter(deviceParametersArray);    
                // dispatch(enterPathActionCreator({ val: `Edit :  ${response?.description}` }));
                dispatch(enterPathActionCreator({ val: response?.description }));

       
                const temp = {
                    deviceSettings: {...switchParametersObj},
                    deviceParameters: [...deviceParametersArray]
                };
                EditCloseHandler(dataToEdit, temp);     
            })
            .catch((err: any) => {
                console.error(err);
            });
        }
        
    }, []);
    useEffect(() => {
        setcameraValue(switchParameters.camera.data);
    },[switchParameters.camera.data])
    const devicesParamsData = (newDeviceParametersDropdownData: DeviceParameterDropdownModel) => {
        if (Array.isArray(getAll.devicesParams)) {
            newDeviceParametersDropdownData.deviceParamsList = getAll.devicesParams;
        }
    }
    
    const matchTypesData = (newDeviceParametersDropdownData: DeviceParameterDropdownModel) => {
        if (Array.isArray(getAll.matchTypes)) {
            const newCriterias = getAll.matchTypes.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newDeviceParametersDropdownData.criteriaList = Array.isArray(newCriterias) ? newCriterias : [];
        }
    }
    
    const devicesData = (newDeviceParametersDropdownData: DeviceParameterDropdownModel) => {
        if (Array.isArray(getAll.devices)) {
            const newDevices = getAll.devices.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newDeviceParametersDropdownData.deviceList = Array.isArray(newDevices) ? newDevices : [];
        }
    }
    
    const iconsData = (newSettingsDropdownData: SwitchParametersDropdownModel) => {
        if (Array.isArray(getAll.icons)) {
            const newIcons = getAll.icons.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newSettingsDropdownData.iconList = Array.isArray(newIcons) === true ? newIcons : [];
        }
    }
    
    const categoriesData = (newSettingsDropdownData: SwitchParametersDropdownModel) => {
        if (Array.isArray(getAll.categories)) {
            const newCategories = getAll.categories.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newSettingsDropdownData.categoryList = Array.isArray(newCategories) === true ? newCategories : [];
        }
    }
    
    const bookmarksData = (newSettingsDropdownData: SwitchParametersDropdownModel) => {
        if (Array.isArray(getAll.bookmarks)) {
            const newBookmarks = getAll.bookmarks.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newSettingsDropdownData.bookmarkList = Array.isArray(newBookmarks) === true ? newBookmarks : [];
        }
    }
    
    const actionData = (newSettingsDropdownData: SwitchParametersDropdownModel) => {
        if (Array.isArray(getAll.actions)) {
            const newActions = getAll.actions.map((item: any) => {
                return ({ value: item.id, displayText: item.name });
            });
            newSettingsDropdownData.actionList = Array.isArray(newActions) === true ? newActions : [];
        }
    }
const setCamera = (obj:string) => {
    let objList = obj.split(',');
    let data:any[] = [];
    objList.forEach((x) => {
        data.push({
            value:parseInt(x),
            label:CAMERAS.filter(y => y.value == parseInt(x))[0].label,
        })
    });
        return data;
}
  const switchParametersItem = (property:any,item:any) => {
    if(property != null) {
        property.id = parseInt(item.id);
        if (typeof property.data === 'object') {
            if(item.key == 'camera' )
            {
                if(item.value != 0) {
                    property.data = setCamera(item.value);
                }
            }
            else {
                property.data = {
                    value: parseInt(item.value),
                    displayText: item.key
                }
            }
        } else if (typeof property.data === 'string') {
            property.data = item.value;
        } else if (typeof property.data === 'boolean') {
            property.data = item.value === 'true' ? true : false;
        }
    }
  }

  const EditCloseHandler =(dataToEdit: any, temp : any) => {
    if (dataToEdit.current == null) {
        dataToEdit.current = { ...temp };
    }
   }

   const DeviceparametersItem = (response: any, deviceParametersArray: any[]) => {
    response.paramValues.forEach((item: any) => {
        let deviceParameterObj = {} as DeviceParameterModel;
        deviceParameterObj.id = item.id;
        deviceParameterObj.criteria = {
            value: item.matchType.id,
            label: item.matchType.name
        };
        deviceParameterObj.parameter = {
            value: item.deviceParams.id,
            label: item.deviceParams.paramName
        };
        deviceParameterObj.device = {
            label: item.deviceParams.deviceId,
            value: item.deviceParams.deviceId
        };
        deviceParameterObj.value = item.value;
        deviceParametersArray.push(deviceParameterObj);
        });
    }
    const onDeviceSettingChange = (e: any, field: keyof SwitchParametersModel) => {
        
        let switchParametersObj: SwitchParametersModel = {...switchParameters};
        let switchParameterField = switchParametersObj[field];
        if(isSelectBoxType(switchParameterField)) {
            const value = e.target.value;
            (switchParameterField.data as SelectBoxType).value = parseInt(value);
            checkDeviceSettingsValidation(value, field);
        }
         else if(typeof switchParameterField.data === "boolean") {
            switchParameterField.data = e.target.checked;
        } else if(typeof switchParameterField.data === "string")  {
            const value: string = e.target.value;
            if(field === 'overlay') {
                if(value.length <= 3) {
                    switchParameterField.data = value.toString().toUpperCase();
                }
            }  
            else {
                switchParameterField.data = value;
                checkDeviceSettingsValidation(value, field);
            }
        }
        (switchParametersObj[field] as any) = switchParameterField;
        setSwitchParameters(switchParametersObj);
    }

    const isFieldValid = (field: any, value?: any) => {
        if(value !== undefined) {
            if(isSelectBoxType(field)) {
                if(value != undefined && value > 0) {
                    return true;
                }
                else {
                   return false;
                }
            } else if(typeof field === "string") {
                if(!!value && value.toString().trim().length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }

    const checkNameValidation = (value: string) => {
        let errorState = {...deviceSettingsValidation};
        if(!!value && value.toString().trim().length > 0) {
            errorState.name = ''
        } else {
            errorState.name = `Name_is_required`;
        }
        setDeviceSettingsValidation(errorState);
    }

    const checkDeviceSettingsValidation = (value: string | number, field: keyof SwitchParametersModel) => {
        let errorState = {...deviceSettingsValidation};
        if(isFieldValid(field, value)) {
            errorState[field] = '';
        } else {
            errorState[field] = `${field}_is_required`;
        }        
        setDeviceSettingsValidation(errorState);
    }
   
    const disableAddDeviceParameter = () => {
        let isDisable = false;
        deviceParameters.map((obj) => {
            if(obj.device.value > 0 && obj.parameter.value > 0 && obj.criteria.value > 0 && !isNaN(obj.value)) {
                setIsAddDeviceParameterDisable(false);
            } else{
                setIsAddDeviceParameterDisable(true);
                isDisable = true
            }
        });
        return isDisable;
    }
    const addDefaultDeviceParameter = () => {
        let defaultParameterData = Object.assign({}, defaultDeviceParameter);
        setDeviceParameter(parameter => { return [...parameter, defaultParameterData]})
    }

    const onAddDeviceParameter = () => {
        addDefaultDeviceParameter();
    }

    const onRemoveDeviceParameter = (i: number) => {
        let parameters = [...deviceParameters];
        let parameter = parameters[i];
        
        if (parameter && parameter.id && parameter.id > 0) {
            if(id) {
                deletedParamValuesIdRef.current.push(parameter.id);
            }
        }
        parameters.splice(i, 1)

        if (parameters.length <= 0) {
            parameters.push(defaultDeviceParameter);
        }
        
        setDeviceParameter([...parameters]);
    }

    const onDeviceParameterChange = (e: ChangeEvent<HTMLInputElement>, idx: number, field: keyof DeviceParameterModel) => {
        let parameters = [...deviceParameters];
        let value = ((parseInt(e.target.value) >= 0) ? parseInt(e.target.value) : parseInt(e.target.value)*(-1));
        if(value.toString().length > 15)
            value = parseInt(value.toString().substring(0, value.toString().length - 1));
        if(field === 'value') {
            if(!isNaN(value)) {
                parameters[idx][field] = value;
            }
            else {
                parameters[idx][field] = 0;
            }
        }
        else {
            if(field === 'device') {
                parameters[idx].parameter.value = 0;
            }
            (parameters[idx][field] as SelectBoxType).value = value;
        }

        if (parameters[idx] != null) {
            if (parameters[idx].device.value > 0 && parameters[idx].parameter.value > 0 
                && parameters[idx].criteria.value > 0 && !isNaN(parameters[idx].value)) {
                isFirstRenderRef.current = false;
            }
        }
        setDeviceParameter(parameters);
    }

    const getDeviceParamsListByDevice = (value: number) => {
        return deviceParametersDropdownData.deviceParamsList.filter(a => a.deviceId === value).map(item => {
            return { value: item.id, displayText: item.paramName }
        });
    }

    const isSelectBoxType = (param: any) => {
        if (typeof param === "object") {
            return (param.data as SelectBoxType).value != undefined;
        }
        return false;
    }

    const DeviceParametersPayload = (deviceParameters: DeviceParameterModel[], deviceParametersDropdownData: DeviceParameterDropdownModel, listParamValues: any[]) => {
        deviceParameters.forEach((item) => {
            let ParamName: any = deviceParametersDropdownData.deviceParamsList.find((val: any) => (val.id == item.parameter.value) ? val.paramName : '');
            let matchTypeName: any = deviceParametersDropdownData.criteriaList.find((val: any) => (val.value == item.criteria.value) ? val.displayText : '');
            const paramValue = {
                id: item.id,
                deviceParams: {
                    id: item.parameter.value.toString(),
                    deviceIndex: 4,
                    deviceId: item.device.value,
                    paramName: String(ParamName['paramName']),
                    interfaceButton: 4,
                },
                matchType: {
                    id: item.criteria.value.toString(),
                    name: String(matchTypeName['displayText']),
                },
                eventId: 1,
                value: item.value
            };
            listParamValues.push(paramValue);
        });
    }
    
    const setAddPayload:any = () => {
       
        const listSwitchParameters = [];
        const listParamValues: any[] = [];
        let action;
        let camera;
        for (var key in switchParameters) {
            if (switchParameters.hasOwnProperty(key)) {
                const obj = switchParameters[key as keyof SwitchParametersModel];
                if(key ==='action'){
                    let actionId = isSelectBoxType(obj) ? (obj.data as SelectBoxType).value.toString() : '0';
                    let actionName : any = settingsDropdownData.actionList?.find((val: any) => (val.value === actionId) ? val.displayText : '')
                    action = {
                        id: actionId,
                        name : (actionName) ? String(actionName['displayText']) : ''
                    }
                }
                if(key ==='camera'){
                 let valueList = obj.data as SelectBoxType[];
                 let tmpList:string[] = [];
                 valueList.forEach((x:any) => {
                    tmpList.push(x.value);
                 })
                    camera = tmpList.toString();
                    
                }
                const switchParam = {
                    id: obj.id,
                    key: key,
                    
                    value: (key === 'camera') ? camera?.toString():isSelectBoxType(obj) ? (obj.data as SelectBoxType).value.toString() : obj.data.toString()
                }
                listSwitchParameters.push(switchParam);
            }
        }
        DeviceParametersPayload(deviceParameters, deviceParametersDropdownData, listParamValues);
        const event = {
            id : id ? id :'0',
            action : action,
            unitId: 1,
            description : name,
            switchParameters : listSwitchParameters,
            paramValues  : listParamValues
        }
        const payload: SensorsAndTriggers = {
            event : event,
            deletedParamValuesIds : deletedParamValuesIdRef.current
          };
          return payload;
      }

    const onSave = async () => {
        const payload = setAddPayload();

        if (parseInt(id) > 0) {
            const urlEditSensorsAndTriggers  = "SensorEvents/" + id;
            SetupConfigurationAgent.putSensorsAndTriggersTemplate(urlEditSensorsAndTriggers, payload)
            .then(()=>{        
                setSwitchParameters(defaultSwitchParameters);
                setDeviceParameter([defaultDeviceParameter]);
                //setSuccess(true);
                SaveSensorTriggerMsg()
                setError(false);
                dispatch(getAllSensorsEvents());
                setTimeout(() => history.goBack(), 5000);
            })
            .catch((e:any) => {
                if (e.request.status == 409) {
                    setError(true);
                    setResponseError(
                        "Duplicate Name is not allowed."
                    );
                }
                else{
                    console.error(e.message);
                    setError(false);
                    return e;
                }
            })
        } else {
            const urlAddSensorsAndTriggers = "SensorEvents";
            SetupConfigurationAgent.postSensorsAndTriggersTemplate(urlAddSensorsAndTriggers, payload)
            .then(()=>{        
                setSwitchParameters(defaultSwitchParameters);
                setDeviceParameter([defaultDeviceParameter]);
                //setSuccess(true);
                SaveSensorTriggerMsg()
                setError(false);
                dispatch(getAllSensorsEvents());
                setTimeout(() => history.goBack(), 500);
            })
            .catch((e:any) => {
            if (e.request.status == 409) {
                setError(true);
                setResponseError(
                    "Duplicate Name is not allowed."
                );
            }
            else{
                console.error(e.message);
                setError(false);
                return e;
            }
        })
      }
    }

    const DeviceParametersDataChanged = (switchParameters: SwitchParametersModel, isDataChanged: boolean, dataToEdit: any) => {
        for (let item in switchParameters) {
            isDataChanged = dataToEdit.current.deviceSettings[item] != switchParameters[item as keyof SwitchParametersModel];
            if (isDataChanged === true) {
                break;
            }
        }
        return isDataChanged;
    }   

    const SwitchParamterDataChanged = (isDataChanged: boolean, deviceParameters: DeviceParameterModel[], dataToEdit: any) => {
        if (isDataChanged === false) {
            if (deviceParameters.length === dataToEdit.current.deviceParameters.length) {
                for (let idx = 0; idx < deviceParameters.length; idx++) {
                    for (let items in deviceParameters[idx]) {
                        isDataChanged = dataToEdit.current.deviceParameters[items] != deviceParameters[idx][items as keyof DeviceParameterModel];
                        if (isDataChanged === true) {
                            break;
                        }
                    }
                    if (isDataChanged === true) {
                        break;
                    }
                }
            }
    
            else
                isDataChanged = true;
        }
        return isDataChanged;
    }

    const redirectPage = () => {
        if(dataToEdit.current != null) {
                let isDataChanged = false;
                isDataChanged = DeviceParametersDataChanged(switchParameters, isDataChanged, dataToEdit);
                isDataChanged = SwitchParamterDataChanged(isDataChanged, deviceParameters, dataToEdit);              
                if(isDataChanged === true) {
                    setIsOpen(true)
                }   
            }
            else {
            history.goBack();
            }
        }
        
    const closeDialog = () => {
        setIsOpen(false);
        history.goBack();
    };

    const closeBtnHandler = () => {
        history.goBack();
    }

    const getFormatedLabel = (label: string) => {
        return <span className="requiredLable">
                    {label}{" "}
                    {label === 'Action' ? <span className="actionLabel">*</span> : <span></span>}
                </span>
    }

    const [value, setValue] = React.useState(0);

    function handleChange(event: any, newValue: number) {
        setValue(newValue);
      }
    const tabs = [
        { label: t("Settings"), index: 0 },
        { label: t("Device_Parameters"), index: 1 },
      ];

      const categoryDropdownOnChangeHandler = (
        e: React.SyntheticEvent,
        data: any[],
        field: keyof SwitchParametersModel
      ) => {
        let tmpData: SelectBoxType[] = data;
        setSwitchParameters({...switchParameters, camera:{data: tmpData, id:switchParameters.camera.id}});
        e.isDefaultPrevented();

      };
    
      const SaveSensorTriggerMsg = () => {
        sensorFormRef?.current?.showToaster({
          message: `${t("Success you have saved the Sensors And Triggers")}`,
          variant: "success",
          duration: 7000,
          clearButtton: false,
        });
      }
    return (

        <div className="sensors-and-triggers crxTabsPermission">
            <CRXToaster ref={sensorFormRef} />
            {/* {success && (
                  <CRXAlert
                    className="sensorTriggerMsg"
                    message={t("Success_You_have_saved_the_Sensors_And_Triggers")}
                    alertType="toast"
                    open={true}
                  />
                )} */}
                {error && (
                  <CRXAlert
                    className="sensorinlineError"
                    message={responseError}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )} 
            
            <CRXTabs  value={value} onChange={handleChange} tabitems={tabs} stickyTab={129}/>
                <CrxTabPanel value={value} index={0}>

                <div className="itemIndicator">
                      <label className="indicates-label"><b>*</b> Indicates required field</label>
                    </div>

                    <div className="sesorsSetting">
                
            

                    </div>

                    <div className="settingsContent">
                    {/* <div className="CRXPageTitle titlePage">
                         <h2>Settings</h2>
                    </div> */}
                <Grid container spacing={2} className="settingsForm" >
                
                    <Grid item xs={12} sm={12} md={12} lg={5}>
                        <div className="sensorsLeftCol">
                        
                            <TextField
                                required={true}
                                value={name}
                                label={t("Sensors_and_triggers_name")}
                                className="sensors-and-triggers-input"
                                onChange={(e: any) => setName(e.target.value)}
                                disabled = {false}
                                type="text"
                                name="sensorAndTriggerName"
                                regex=""
                                onBlur={() => checkNameValidation(name)}
                                />
                    

                            <span className="gridFilterTextBox">
                            <CRXHeading variant="subtitle1" className="label">
                                {getFormatedLabel(t("Action"))}
                            </CRXHeading>
                            <CRXSelectBox
                                className="select-box"
                                id="settingAction"
                                value={switchParameters.action.data.value > 0 ? switchParameters.action.data.value : defaultAction}
                                onChange={(e: any) => onDeviceSettingChange(e, 'action')}
                                options={settingsDropdownData.actionList}
                                isRequried={true}
                                disabled={false}
                                />
                                
                            </span>

                            <span className="gridFilterTextBox">
                            <CRXHeading variant="subtitle1" className="label">
                                {getFormatedLabel(t("Icon"))}
                            </CRXHeading>
                            <CRXSelectBox
                                className="select-box"
                                id="settingIcon"
                                value={switchParameters.icon.data.value > 0 ? switchParameters.icon.data.value : defaultIcon}
                                onChange={(e: any) => onDeviceSettingChange(e, 'icon')}
                                options={settingsDropdownData.iconList}
                                disabled={false}
                                isRequried={true}
                                // defaultOption={true}
                                
                                error={!!deviceSettingsValidation.icon}
                                errorMsg={deviceSettingsValidation.icon} />
                            </span>

                            <span className="gridFilterTextBox">
                                <CRXHeading variant="subtitle1" className="label">
                                    {getFormatedLabel(t("Category"))}
                                </CRXHeading>
                                <CRXSelectBox
                                    className="select-box"
                                    id="settingCategory"
                                    value={switchParameters.category.data.value > 0 ? switchParameters.category.data.value : defaultCategory}
                                    onChange={(e: any) => onDeviceSettingChange(e, 'category')}
                                    options={settingsDropdownData.categoryList}
                                    isRequried={true}
                                    disabled={false}
                                    // defaultOption={true}
                                     
                                    />
                            </span>

                            <span className="gridFilterTextBox">
                                <CRXHeading variant="subtitle1" className="label">
                                    {getFormatedLabel(t("Camera"))}
                                </CRXHeading>
                                    <CRXMultiSelectBoxLight
                className="categortAutocomplete CRXmetaData-category"
                placeHolder=""
                multiple={true}
                CheckBox={true}
                value={[...switchParameters.camera.data].filter(x => x.label != "")}
                options={settingsDropdownData.cameraList}
                autoComplete={false}
                isSearchable={true}
                disabled={false}
                onChange={(e: React.SyntheticEvent, value: string[]) =>
                    categoryDropdownOnChangeHandler(e, value, 'camera')
                  }/>
                            </span>
                        </div>
                    </Grid>
                    <div className='grid_spacer'></div>

                    <Grid item xs={12} sm={12} md={12} lg={5} className="sensorsRightCol">
                            <span className="gridFilterTextBox">
                                <CRXHeading variant="subtitle1" className="label">
                                    {getFormatedLabel(t("Bookmark"))}
                                </CRXHeading>
                                <CRXSelectBox
                                    className="select-box"
                                    id="settingBookmark"
                                    value={switchParameters.bookmark.data.value > 0 ? switchParameters.bookmark.data.value : defaultBookmark}
                                    onChange={(e: any) => onDeviceSettingChange(e, 'bookmark')}
                                    options={settingsDropdownData.bookmarkList}
                                    disabled={false}
                                    isRequried={true}
                                    error={!!deviceSettingsValidation.bookmark}
                                    errorMsg={deviceSettingsValidation.bookmark}
                                    // defaultOption={true}
                                    
                                    />
                            </span>

                            <div className="setttingsTextBox">
                                <TextField
                                    value={switchParameters.overlay.data}
                                    label={t("Overlay")}
                                    className="sensors-and-triggers-input"
                                    onChange={(e: any) => onDeviceSettingChange(e, 'overlay')}
                                    onBlur={() => checkDeviceSettingsValidation(switchParameters.overlay.data, 'overlay')}
                                    disabled = {false}
                                    type="text"
                                    name="sensorAndTriggerSettingsOverlay"
                                    regex="" />
                            </div>
                        
                           <div>
                            <TextField
                                value={switchParameters.description.data}
                                label={t("Description")}
                                className="sensors-and-triggers-input"
                                onChange={(e: any) => onDeviceSettingChange(e, 'description')}
                                onBlur={() => checkDeviceSettingsValidation(switchParameters.description.data, 'description')}
                                disabled = {false}
                                type="text"
                                name="sensorAndTriggerSettingsDescription"
                                maxLength={3}
                                regex="" />
                            </div>
                        
                        <div className="email_checkBox_ui">
                        <label>{t("Email_alert")}</label>   
                            <CRXCheckBox
                                checked={switchParameters.emailAlert.data}
                                lightMode={true}
                                className='crxCheckBoxCreate '
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDeviceSettingChange(e, 'emailAlert')} />
                        </div>
                        <div className="email_checkBox_ui">
                        <label>{t("Allow_Cancellation")}</label>   
                            <CRXCheckBox
                                checked={switchParameters.allowCancellation.data}
                                lightMode={true}
                                className='crxCheckBoxCreate '
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDeviceSettingChange(e, 'allowCancellation')} />
                        </div>
                    </Grid>
                </Grid>
            </div>
                
                
                </CrxTabPanel>

                <CrxTabPanel value={value} index={1}>
                <div className="deviceParameterContent">

                <div className="deviceParameterHeader">
                    <CRXRows container spacing={0}>
                        <CRXColumn className="deviceParameterColumn" container item xs={3} spacing={0}>{t("Device")}</CRXColumn>
                        <CRXColumn className="deviceParameterColumn" container="container" item xs={3} spacing={0}>{t("Parameter")}</CRXColumn>
                        <CRXColumn className="deviceParameterColumn" container="container" item xs={3} spacing={0}>{t("Criteria")}</CRXColumn>
                        <CRXColumn className="deviceParameterColumn" container="container" item xs={3} spacing={0}>{t("Value")}</CRXColumn>
                    </CRXRows>
                </div>
                <div className="deviceParameterPageScroll">
                    <div className="deviceParameterColumnContent">
                        {
                            deviceParameters.map((deviceParameter, idx) => {
                                return <div className="deviceParameterColumnItem" key={idx}>
                                    <CRXRows container="container" spacing={0}>
                                        <CRXColumn className="deviceParameterCol" item xs={3}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`device-parameter-device-${idx}`}
                                                value={deviceParameter.device.value > 0 ? deviceParameter.device.value : defaultDevice}
                                                onChange={(e: any) => onDeviceParameterChange(e, idx, 'device')}
                                                options={deviceParametersDropdownData.deviceList}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                disabled={false}
                                                defaultOption={true}
                                                defaultOptionText={defaultDevice}
                                                defaultValue={defaultDevice} />
                                        </CRXColumn>
                                        <CRXColumn className="deviceParameterCol" item xs={3}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`device-parameter-parameter-${idx}`}
                                                disabled={deviceParameter.device.value > 0 ? false : true}
                                                value={deviceParameter.parameter.value > 0 ? deviceParameter.parameter.value : defaultParameter}
                                                onChange={(e: any) => onDeviceParameterChange(e, idx, 'parameter')}
                                                options={getDeviceParamsListByDevice(deviceParameter.device.value)}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOption={true}
                                                defaultOptionText={defaultParameter}
                                                defaultValue={defaultParameter}
                                            />
                                        </CRXColumn>
                                        <CRXColumn className="deviceParameterCol" item xs={3}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`device-parameter-criteria-${idx}`}
                                                disabled={deviceParameter.device.value > 0 ? false : true}
                                                value={deviceParameter.criteria.value > 0 ? deviceParameter.criteria.value : defaultCriteria}
                                                onChange={(e: any) => onDeviceParameterChange(e, idx, 'criteria')}
                                                options={deviceParametersDropdownData.criteriaList}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOption={true}
                                                defaultOptionText={defaultCriteria}
                                                defaultValue={defaultCriteria} />
                                        </CRXColumn>
                                        <CRXColumn className="deviceParameterCol" item xs={3}>
                                            {/* <TextField
                                                errorMsg={t("Name_is_required")}
                                                value={deviceParameter.value}
                                                className="input-field"
                                                onChange={(e: any) => onDeviceParameterChange(e, idx, 'value')}
                                                disabled = {deviceParameter.device.value > 0 ? false : true}
                                                type="number"
                                                name="sensorAndTriggerName"
                                                regex="" /> */}
                                            <div className="input-number-snt">
                                                <NumberField
                                                    errorMsg={t("Name_is_required")}
                                                    value={deviceParameter.value}
                                                    className="input-field"
                                                    onChange={(e: any) => onDeviceParameterChange(e, idx, 'value')}
                                                    disabled = {deviceParameter.device.value > 0 ? false : true}
                                                    type="number"
                                                    name="sensorAndTriggerName"
                                                    regex=""
                                                />
                                            </div>
                                        </CRXColumn>
                                        <CRXColumn className="deviceParameterBtnRemove" container item xs={3} spacing={0}>
                                                <button
                                                    className="removeBtn"
                                                    onClick={() => onRemoveDeviceParameter(idx)}
                                                ><CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="remove" placement="left" className="crxTooltipNotificationIcon"/></button>
                                        </CRXColumn>
                                    </CRXRows>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="deviceParameterBtnAdd">
                    <CRXButton
                        disabled ={isAddDeviceParameterDisable}
                        className='PreSearchButton'
                        onClick={onAddDeviceParameter}
                        color='primary'
                        variant='contained'
                    > {t("Add_device_parameters")}
                    </CRXButton>
                </div>

                </div>

                </CrxTabPanel>

                <div className="tab-bottom-buttons stickyFooter_Tab">
                <div className="save-cancel-button-box">
                <CRXButton
                    variant="contained"
                    className="groupInfoTabButtons primary"
                    onClick={onSave}
                    disabled={isSaveDisable}
                >
                    {t("Save")}
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={closeBtnHandler}
                >
                    {t("Cancel")}
                </CRXButton>
                </div>
                <div>
                <CRXButton
                    onClick={() => redirectPage()}
                    className="groupInfoTabButtons-Close secondary"
                    color="secondary"
                    variant="outlined"
                    >
                {t("Close")}
                </CRXButton>
                </div>
            </div>

            <CRXConfirmDialog
                setIsOpen={() => setIsOpen(false)}
                onConfirm={closeDialog}
                isOpen={isOpen}
                className="userGroupNameConfirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="user group form"
            >
                <div className="confirmMessage">
                {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                <strong>{t("Sensors_And_Triggers_Form")}</strong>. {t("If_you_close_the_form")}, 
                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                <div className="confirmMessageBottom">
                {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                </div>
                </div>
            </CRXConfirmDialog>
        </div>

    )
}

export default SensorsAndTriggersDetail
