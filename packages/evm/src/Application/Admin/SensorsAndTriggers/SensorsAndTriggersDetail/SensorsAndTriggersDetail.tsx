import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { useHistory, useParams } from "react-router";
import { CRXButton, CRXConfirmDialog,CRXAlert, CRXRows, CRXColumn, CRXSelectBox, CRXCheckBox, TextField, CRXHeading,CRXTooltip } from "@cb/shared";
import {useTranslation } from "react-i18next";
import { defaultDevice, defaultParameter, defaultCriteria, defaultAction, defaultBookmark, defaultCamera,defaultCategory, defaultIcon } from '../TypeConstant/constants';
import { DeviceParameterModel, SelectBoxType, SwitchParametersModel, DeviceParameterDropdownModel, SwitchParametersDropdownModel, SensorAndTriggerDetailErrorModel, SensorAndTriggerDetailValidationModel } from '../TypeConstant/types';
import Grid from "@material-ui/core/Grid";
import './sensorsAndTriggersDetail.scss';
import {SensorsAndTriggers} from '../../../../utils/Api/models/SensorsAndTriggers';
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import { useDispatch,useSelector } from "react-redux";
import { getAllSensorsEvents, getAllData } from "../../../../Redux/SensorEvents";
import { RootState } from "../../../../Redux/rootReducer";

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
}

const CAMERAS = [
    { value: 1, displayText: '1' },
    { value: 2, displayText: '2' },
    { value: 3, displayText: '3' },
    { value: 4, displayText: '4' },
    { value: 5, displayText: '5' },
    { value: 6, displayText: '6' },
]

const SensorsAndTriggersDetail: FC<SensorsAndTriggersDetailProps> = () => {

    const defaultSwitchParameters: SwitchParametersModel = {
        bookmark: { id: 0, data: { value: 0, displayText: "" } },
        action: { id: 0, data: { value: 0, displayText: "" } },
        icon: { id: 0, data: { value: 0, displayText: "" } },
        overlay: { id: 0, data: "" },
        category: { id: 0, data: { value: 0, displayText: "" } },
        description: { id: 0, data: "" },
        camera: { id: 0, data: { value: 0, displayText: "" } },
        emailAlert: { id: 0, data: false },
    }

    const defaultDeviceParameter = {
        id: 0,
        device: { value: 0, displayText: "" },
        parameter: { value: 0, displayText: "" },
        criteria: { value: 0, displayText: "" },
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

  const switchParametersItem = (property:any,item:any) => {
    if(property != null) {
        property.id = parseInt(item.id);
        if (typeof property.data === 'object') {
            property.data = {
                value: parseInt(item.value),
                displayText: item.key
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
            displayText: item.matchType.name
        };
        deviceParameterObj.parameter = {
            value: item.deviceParams.id,
            displayText: item.deviceParams.paramName
        };
        deviceParameterObj.device = {
            displayText: item.deviceParams.deviceId,
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
        } else if(typeof switchParameterField.data === "boolean") {
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
        if(field === 'value') {
            const value = parseInt(e.target.value);
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
            (parameters[idx][field] as SelectBoxType).value = parseInt(e.target.value);
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
                const switchParam = {
                    id: obj.id,
                    key: key,
                    value: isSelectBoxType(obj) ? (obj.data as SelectBoxType).value.toString() : obj.data.toString()
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
        const urlEditSensorsAndTriggers = 'SensorEvents/UpsertEvent';
        SetupConfigurationAgent.putSensorsAndTriggersTemplate(urlEditSensorsAndTriggers,payload).then(()=>{        
            setSwitchParameters(defaultSwitchParameters);
            setDeviceParameter([defaultDeviceParameter]);
            setSuccess(true);
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
                    {label === 'Action' ? <span style={{color: "#000",paddingLeft: "8px", fontWeight: "bold"}}>*</span> : <span></span>}
                </span>
    }

    return (
        
        <div className="sensors-and-triggers">
                {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Sensors_And_Triggers")}
                    alertType="toast"
                    open={true}
                  />
                )}
                {error && (
                  <CRXAlert
                    className=""
                    message={responseError}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}        
                    <div className="nameFieldSensors">
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={5} >
                            <TextField
                                required={true}
                                value={name}
                                label={t("Name")}
                                className="sensors-and-triggers-input"
                                onChange={(e: any) => setName(e.target.value)}
                                disabled = {false}
                                type="text"
                                name="sensorAndTriggerName"
                                regex=""
                                onBlur={() => checkNameValidation(name)}
                                />
                        </Grid>
                    </Grid>
                        {/* <Grid  item xs={12} sm={12} md={12} lg={5}>
                            
                        </Grid> */}
                    </div>
            <div className="settingsContent">
                    <div className="CRXPageTitle titlePage">
                         <h2>Settings</h2>
                    </div>
                <Grid container spacing={2} className="settingsForm" >
                
                    <Grid item xs={12} sm={12} md={8} lg={4} >
                        <div>
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
                                defaultOption={true}
                                defaultOptionText={defaultAction}
                                defaultValue={defaultAction} />
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
                                defaultOption={true}
                                defaultOptionText={defaultIcon}
                                defaultValue={defaultIcon}
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
                                    defaultOption={true}
                                    defaultOptionText={defaultCategory}
                                    defaultValue={defaultCategory} />
                            </span>

                            <span className="gridFilterTextBox">
                                <CRXHeading variant="subtitle1" className="label">
                                    {getFormatedLabel(t("Camera"))}
                                </CRXHeading>
                                <CRXSelectBox
                                    className="select-box"
                                    id="settingCamera"
                                    value={switchParameters.camera.data.value > 0 ? switchParameters.camera.data.value : defaultCamera}
                                    onChange={(e: any) => onDeviceSettingChange(e, 'camera')}
                                    options={settingsDropdownData.cameraList}
                                    isRequried={true}
                                    disabled={false}
                                    defaultOption={true}
                                    defaultOptionText={defaultCamera}
                                    defaultValue={defaultCamera} />
                            </span>
                        </div>
                    </Grid>
                    <div className='grid_spacer'></div>

                    <Grid item xs={12} sm={12} md={8} lg={4}>
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
                                    defaultOption={true}
                                    defaultOptionText={defaultBookmark}
                                    defaultValue={defaultBookmark} />
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
                        <label>{t("Email alert")}</label>   
                            <CRXCheckBox
                                checked={switchParameters.emailAlert.data}
                                lightMode={true}
                                className='crxCheckBoxCreate '
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDeviceSettingChange(e, 'emailAlert')} />
                        </div>
                    </Grid>
                </Grid>
            </div>


            <div className="deviceParameterContent">
            

                <div className="CRXPageTitle titlePage">
                    <h2>Device Parameters</h2>
                </div>
                
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
                                            <TextField
                                                errorMsg={t("Name_is_required")}
                                                value={deviceParameter.value}
                                                className="input-field"
                                                onChange={(e: any) => onDeviceParameterChange(e, idx, 'value')}
                                                disabled = {deviceParameter.device.value > 0 ? false : true}
                                                type="text"
                                                name="sensorAndTriggerName"
                                                regex="" />
                                        </CRXColumn>
                                        <CRXColumn className="deviceParameterBtnRemove" container item xs={3} spacing={0}>
                                            {
                                                deviceParameter.device.value > 0 &&
                                                <button
                                                    className="removeBtn"
                                                    onClick={() => onRemoveDeviceParameter(idx)}
                                                ><CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="remove" placement="bottom" className="crxTooltipNotificationIcon"/></button>
                                            }
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
                    > {t("Add_data_permissions")}
                    </CRXButton>
                </div>
            </div>

            
            
            <div className="tab-bottom-buttons">
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
