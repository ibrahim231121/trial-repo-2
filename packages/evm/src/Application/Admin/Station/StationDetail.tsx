import React from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { useHistory, useParams } from "react-router";
import { urlList, urlNames } from "../../../utils/urlList";
import { getCountryStateAsync, getRetentionStateAsync, getUploadStateAsync } from "../../../Redux/StationReducer";
import {
  CRXTabs,
  CrxTabPanel,
  CRXMultiSelectBoxLight,
  CRXAlert,
  GoogleMap,
  CRXButton,
  CRXRows,
  CRXColumn,
  CRXConfirmDialog,
  CRXSelectBox
} from "@cb/shared";
import "./station.scss";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import Cookies from 'universal-cookie';
import { TypeOfDevice } from "./DefaultUnitTemplate/DefaultUnitTemplateModel";
import { useTranslation } from 'react-i18next';
import InputShowHide from "../../../utils/InputShowHide/InputShowHide";
import { UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { ConfigurationTemplate, DeviceType } from "../../../utils/Api/models/UnitModels";
import { Station } from "../../../utils/Api/models/StationModels";

type StationFormType = {
  Name: string;
  StreetAddress?: string;
  Phone?:string;
  Passcode?: string;
  Location?: any;
  PolicyId?: number;
  RetentionPolicy?: AutoCompleteOptionType;
  UploadPolicy?: AutoCompleteOptionType;
  BlackboxRetentionPolicy?: AutoCompleteOptionType;
  SSId?: string;
  Password?: string;
  ConfigurationTemplate: ConfigurationTemplate[] | any[];
};

interface AutoCompleteOptionType {
  label?: string;
  id?: string;
}

const cookies = new Cookies();
const StationDetail: React.FC = () => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getCountryStateAsync());
    dispatch(getRetentionStateAsync());
    dispatch(getUploadStateAsync());
  }, []);
  const [value, setValue] = React.useState(0);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const isAddCase = !!isNaN(+id);
  const retentionResponse: any = useSelector(
    (state: RootState) => state.stationReducer.retentionState
  );
  const uploadResponse: any = useSelector(
    (state: RootState) => state.stationReducer.uploadState
  );
  const [retentionAutoCompleteOptions, setRetentionAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [uploadAutoCompleteOptions, setUploadAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [blackBoxAutoCompleteOptions, setBlackBoxAutoCompleteOptions] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [errorResponseMessage, setErrorResponseMessage] =
    React.useState<string>(
      t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
    );
  const [deviceTypeCollection, setDeviceTypeCollection] = React.useState<DeviceType[]>([]);
  const [defaultUnitTemplateSelectBoxValues, setDefaultUnitTemplateSelectBoxValues] = React.useState<any[]>([]);
  const configurationTemplatesFromStore = useSelector((state: any) => state.configurationTemplatesSlice.configurationTemplates);
  const stationInitialState: StationFormType = {
    Name: "",
    StreetAddress: "",
    Phone: "",
    Passcode: "",
    Location: {
      longitude: null,
      latitude: null,
    },
    RetentionPolicy: {
      id: "",
      label: ""
    },
    UploadPolicy: {
      id: "",
      label: ""
    },
    BlackboxRetentionPolicy: {
      id: "",
      label: ""
    },
    SSId: "",
    Password: "",
    ConfigurationTemplate: []
  };
  interface IlatLong {
    lat: number;
    long: number;
  }
  const [stationPayload, setStationPayload] =
    React.useState<StationFormType>(stationInitialState);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const [retentionAutoCompleteValue, setRetentionAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [uploadAutoCompleteValue, setUploadAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [blackBoxAutoCompleteValue, setBlackBoxAutoCompleteValue] =
    React.useState<AutoCompleteOptionType[]>([]);
  const [reset, setReset] = React.useState<boolean>(false);

  const [displayStationErrors, setDisplayStationError] =
    React.useState<string>("");

  const [latLong, setLatLong] = React.useState<IlatLong>();
  const [disableSaveButton, setDisableSaveButton] =
    React.useState<boolean>(true);
  const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9\b]*$/;
  const regex_PhoneNumber = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    getDeviceTypeRecord();
    return () => {
      dispatch(enterPathActionCreator({ val: "" }));
    }
  }, []);

  React.useEffect(() => {
    if (retentionResponse) {
      setRetentionAutoCompleteOptions(retentionResponse)
      setBlackBoxAutoCompleteOptions(retentionResponse)
    }
  }, [retentionResponse]);

  React.useEffect(() => {
    if (uploadResponse)
      setUploadAutoCompleteOptions(uploadResponse)
  }, [uploadResponse]);

  React.useEffect(() => {
    if (!isAddCase) {
      const url1 = `/Stations/${id}`;
      UnitsAndDevicesAgent.getStation(url1)
      .then((response:Station) => {
        return response
      })
      .then((station) => {
        const _station: StationFormType = {
          Name: station.name,
          StreetAddress: station.address.street,
          Phone: station.address.phone,
          Passcode: station.passcode,
          Location: {
            latitude: station.geoLocation.latitude,
            longitude: station.geoLocation.longitude,
          },
          PolicyId: station.policies[0].id,
          RetentionPolicy: {
            id: String(station.policies[0].retentionPolicyId),
          },
          UploadPolicy: {
            id: String(station.policies[0].uploadPolicyId),
          },
          BlackboxRetentionPolicy: {
            id: String(station.policies[0].blackboxRetentionPolicyId),
          },
          SSId: station.sSID,
          Password: station.password,
          ConfigurationTemplate: station.policies[0].configurationTemplates
          };
        setRetentionAutoCompleteValue([{ id: _station.RetentionPolicy?.id }]);
        setUploadAutoCompleteValue([{ id: _station.UploadPolicy?.id }]);
        setBlackBoxAutoCompleteValue([{ id: _station.BlackboxRetentionPolicy?.id }]);
        setStationPayload(_station);
        dispatch(enterPathActionCreator({ val: t("Station")+": "+ _station.Name }));
      });
    }
  }, [isAddCase]);

  React.useEffect(() => {
    /**
    * * Set Unit Template Select Box Values.
    */
    fillDefaultUnitTemplateSelectBoxValues();
  }, [stationPayload]);

  const filterData = (arr: Array<any>): Array<any> => {
    let retentionArray: any = [];
    if (arr.length > 0) {
      for (const elem of arr) {
        retentionArray.push({
          id: elem.id,
          label: elem.name,
        });
      }
      retentionArray = retentionArray.sort((a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
    }
    return retentionArray;
  };

  const retentionAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("RetentionPolicy", val, false);
    setReset(!reset);
    setRetentionAutoCompleteValue(val);
  };

  const blackBoxAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("BlackboxRetentionPolicy", val, false);
    setReset(!reset);
    setBlackBoxAutoCompleteValue(val);
  };

  const uploadAutoCompleteonChange = (
    _: React.SyntheticEvent,
    val: AutoCompleteOptionType[],
    setFieldValue: any,
    reason: any
  ) => {
    setFieldValue("UploadPolicy", val, false);
    setReset(!reset);
    setUploadAutoCompleteValue(val);
  };

  const stationService = async (url: string, type: string, body?: any) => {
    let requestOptions: any;
    if (type === "GET") {
      requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
      };
    } else if (type === "PUT") {
      requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", TenantId: "1", 'Authorization': `Bearer ${cookies.get('access_token')}` },
        body: JSON.stringify(body),
      };
    }
    return fetch(url, requestOptions);
  };

  const errorHandler = (param: any) => {
    if (param !== undefined) {
      let error = param;
      console.error("Error ", error)
      if (error.errors !== undefined) {
        if (
          error.errors.Passcode !== undefined &&
          error.errors.Passcode.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Passcode[0]);
        }
        if (
          error.errors.Address.Phone !== undefined &&
          error.errors.Address.Phone.length > 0
        ) {
          setError(true);
          setErrorResponseMessage(error.errors.Address.Phone[0]);
        }
        if (error.errors.Name !== undefined && error.errors.Name.length > 0) {
          setError(true);
          setErrorResponseMessage(error.errors.Name[0]);
        }
        if (
          error.errors['Address.State'] !== undefined
        ) {
          setErrorResponseMessage(error.errors['Address.State'][0]);
          setError(true);
        }
        if (
          error.errors.SSId !== undefined
        ) {
          setErrorResponseMessage(error.errors.SSId[0]);
          setError(true);
        }
        if (
          error.errors.Password !== undefined
        ) {
          setErrorResponseMessage(error.errors.Password[0]);
          setError(true);
        }
      } else if (!isNaN(+error)) {
      } else if (error) {
        setError(true);
        setErrorResponseMessage(error);
      }
    }
  };

  const navigateToStations = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url
    );
  };

  const onSubmit = (
    values: StationFormType,
    actions: FormikHelpers<StationFormType>
  ) => {
    let configurationTemplates = values.ConfigurationTemplate.map((configIndex: ConfigurationTemplate) => {
      return  {
        fields: configIndex.fields,
        history: configIndex.history,
        name: configIndex.name,
        operationType: Number(configIndex.operationType),
        stationId: Number(configIndex.stationId),
        id: Number(configIndex.id),
        typeOfDevice: configIndex.typeOfDevice
      }
    })
    let body : Station = {
      id: 0,
      name: values.Name,
      address: {
        street: values.StreetAddress,
        phone: values.Phone,
      },
      geoLocation: {
        latitude: values.Location.latitude,
        longitude: values.Location.longitude,
      },
      units: [],
      policies: [
        {
          id: values.PolicyId,
          retentionPolicyId: Number(values.RetentionPolicy?.id),
          blackboxRetentionPolicyId: Number(values.BlackboxRetentionPolicy?.id),
          uploadPolicyId: Number(values.UploadPolicy?.id),
          configurationTemplates: configurationTemplates?? []
        }
      ],
      passcode: values.Passcode?? "",
      sSID: values.SSId?? ""
    };
    /**
     * * Due To Validation On DeviceType.
     */
    body.policies[0].configurationTemplates = body.policies[0].configurationTemplates.map((obj: any) => {
      return {
        ...obj, typeOfDevice: { id: obj.typeOfDevice.id }
      }
    });
    if (isAddCase) {
      UnitsAndDevicesAgent.addStation(body).then((response: number)=>{
        setSuccess(true);
        setTimeout(() => navigateToStations(), 3000);
      })
      .catch((e:any) => {
        errorHandler(e.response.data);
        setError(true);
        console.error(e);
      });
    } else {
      body.id = Number(id);
      UnitsAndDevicesAgent.updateStation(`/Stations/${id}`,body).then(()=>{
        setSuccess(true);
        setTimeout(() => navigateToStations(), 3000);
      })
      .catch((e:any) => {
        errorHandler(e.response.data);
        setError(true);
        console.error(e);
      });
    }
    actions.setSubmitting(false);
  };

  //google map
  const getMarkerLatLong = (location: number[]) => {
    setLatLong({ lat: location[0], long: location[1] });
    setDisableSaveButton(false);
  };
  const onConfirm = (setFieldValue: any) => {
    setFieldValue("Location.latitude", latLong?.lat, false);
    setFieldValue("Location.longitude", latLong?.long, false);
    setModal(false);
    setDisableSaveButton(true);
  };

  const stationValidationSchema = Yup.object().shape({

    Name: Yup.string().required(t("Station_Name_is_required")),
    Passcode: Yup.string()
      .test(
        'len',
        t("Minimum_5_characters_are_allowed."),
        (val) => val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
      )
      .trim().matches(regex, t("Only_alphabets_and_digits_are_allowed.")).required(t("Pass_Code_is_required")),
    Phone: Yup.string()
      .trim().matches(regex_PhoneNumber, t("Phone_Number_is_not_valid!")).notRequired(),
    SSId: Yup.string().test(
      'len',
      t("Minimum_5_characters_are_allowed."),
      (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
    )
      .trim().matches(regex, t("Only_alphabets_and_digits_are_allowed.")).notRequired(),
    Password: Yup.string().test(
      'len',
      t("Minimum_5_characters_are_allowed."),
      (val) => val === undefined || val != undefined && (val.length == 0 || (val.length >= 5 && val.length <= 64))
    )
      .trim().matches(regex, t("Only_alphabets_and_digits_are_allowed.")).notRequired(),
    //RetentionPolicy: Yup.string().required("Retention policy is required"),
  });

  const getDeviceTypeRecord = () => {
    UnitsAndDevicesAgent.getAllDeviceTypes()
      .then((response:DeviceType[]) => {
        return response
      })
      .then((data) => {
        setDeviceTypeCollection(data);
      })
      .catch((err: any) => {
        setError(true);
        console.error(err);
      });
  }

  const fillDefaultUnitTemplateSelectBoxValues = () => {
    let stateObjectArray = [];
    if ((stationPayload.ConfigurationTemplate) && (Object.keys(stationPayload.ConfigurationTemplate).length > 0)) {
      for (const x of stationPayload.ConfigurationTemplate) {
        stateObjectArray.push({ deviceId: x.typeOfDevice.id, templateId: x.id });
      }
      setDefaultUnitTemplateSelectBoxValues(stateObjectArray);
    }
  }

  const UnitTemplatesRender = ({ setFieldValue, values }: any): JSX.Element => {
    let Quotient = deviceTypeCollection.length / 2;
    let Remainder = deviceTypeCollection.length % 2;
    let NoOFColumnInFirstRow;
    let NoOFColumnInSecondRow;
    if (Remainder === 0) {
      NoOFColumnInFirstRow = Quotient;
      NoOFColumnInSecondRow = NoOFColumnInFirstRow;
    } else {
      NoOFColumnInFirstRow = Quotient + Remainder;
      NoOFColumnInSecondRow = Quotient;
    }
    const formatConfigurationTemplatesToMapCRXSelectBox = (collection: any[]) => {
      return collection.map((obj: any) => {
        return {
          displayText: obj.name,
          value: parseInt(obj.id)
        }
      });
    }

    const defaultUnitTemplateChangeHandler = (e: any, deviceId: string) => {
      /*
       * * To State Value.
       */
      setDefaultUnitTemplateSelectBoxValues((newObject) => {
        let values = newObject.filter((o: any) => {
          return o.deviceId !== deviceId;
        });
        return [...values, { deviceId: deviceId, templateId: e.target.value }]
      });

      /*
        * * To Update Formik Value For Post Or Update.
      */
      const templateId = e.target.value.toString();
      const searchedTemplate = configurationTemplatesFromStore.find((x: any) => x.id === templateId);
      const isAlreadyExist = defaultUnitTemplateSelectBoxValues.find(x => x.templateId === templateId);
      let operationType = 0;
      /**
       * * operationType = 1, Update,  operationType = 2, Add
       */
      isAlreadyExist ? operationType = 1 : operationType = 2;
      /**
       * * 'searchedTemplate' was freezed so in order to change its property, needed to create copy of it.
       */
      const objectCopy = { ...searchedTemplate };
      objectCopy.operationType = operationType;
      const configTemplateFormikValue = [...values.ConfigurationTemplate, objectCopy];
      setFieldValue("ConfigurationTemplate", configTemplateFormikValue, false);
    }

    const filterOptionValuesOnTheBaseOfDeviceId = (deviceId: number) => {
      if (Object.keys(configurationTemplatesFromStore).length > 0) {
        let filteredCollection: any;
        if (!isAddCase) {
          filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
            if ((parseInt(obj.typeOfDevice.id) === deviceId)) {
              // && (obj.stationId == id)
              return obj;
            }
          });
        } else {
          filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
            if (parseInt(obj.typeOfDevice.id) === deviceId) {
              return obj;
            }
          });
        }
        return formatConfigurationTemplatesToMapCRXSelectBox(filteredCollection);
      }
      return [];
    }

    const setValueOfDefaultUnitTemplateSelectBox = (deviceTypeObj: TypeOfDevice) => {
      if (defaultUnitTemplateSelectBoxValues.length > 0) {
        if (defaultUnitTemplateSelectBoxValues.some(x => x.deviceId === deviceTypeObj.id)) {
          const filteredArray = configurationTemplatesFromStore.filter((x: any) => x.id.toString() == deviceTypeObj.id);
          const singleObject = filteredArray.map((x: any) => {
            return {
              displayText: x.name,
              value: parseInt(x.id)
            }
          })[0];
          return singleObject;
        }
      }
    }

    const setValueOfSelectBoxInUpdateCase = (deviceTypeObj: TypeOfDevice) => {
      const requiredDeviceObject = defaultUnitTemplateSelectBoxValues.find((x: any) => x.deviceId === deviceTypeObj.id)
      if (requiredDeviceObject) {
        return requiredDeviceObject.templateId.toString();
      }
    }

    return (
      <>
        <div className="stationDetailOne gepStationSetting">
          <div className="stationColumnSet">
            <CRXRows
              className="crxStationDetail"
              container="container"
              spacing={0}
            >
              {deviceTypeCollection.slice(0, NoOFColumnInFirstRow).map((deviceTypeObj: any) => (
                <CRXColumn
                  className="stationDetailCol"
                  container="container"
                  item="item"
                  lg={12}
                  xs={12}
                  spacing={0}
                  key={deviceTypeObj.id}
                >
                  <div className="colstation">
                    <label htmlFor="name">{deviceTypeObj.name}</label>
                    {
                      <CRXSelectBox
                        id={'simple-select-' + deviceTypeObj.id}
                        name={deviceTypeObj.id}
                        className='Autocomplete'
                        options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                        onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                        value={
                          (!isAddCase)
                            ?
                            (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                            :
                            setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                        }
                      />
                    }
                  </div>
                </CRXColumn>
              ))}
            </CRXRows>
          </div>
          <div className="stationColumnSet">
            <CRXRows
              className="crxStationDetail"
              container="container"
              spacing={0}
            >
              {deviceTypeCollection.slice(NoOFColumnInFirstRow, NoOFColumnInFirstRow + NoOFColumnInSecondRow).map((deviceTypeObj: any) => (
                <CRXColumn
                  className="stationDetailCol"
                  container="container"
                  item="item"
                  lg={12}
                  xs={12}
                  spacing={0}
                  key={deviceTypeObj.id}
                >
                  <div className="colstation">
                    <label htmlFor="name">{deviceTypeObj.name}</label>
                    {
                      <CRXSelectBox
                        id={'simple-select-' + deviceTypeObj.id}
                        name={deviceTypeObj.id}
                        className='Autocomplete'
                        options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                        onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                        value={
                          (!isAddCase)
                            ?
                            (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                            :
                            setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                        }
                      />
                    }
                  </div>
                </CRXColumn>
              ))}
            </CRXRows>
          </div>
        </div>
      </>
    );
  }
  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  const tabs = [
    { label: t("General"), index: 0 },
    { label: t("Station_Settings"), index: 1 },
    { label: t("Unit_Templates"), index: 2 },

  ];

  const redirectPage = (values: StationFormType) => {
      if (
        JSON.stringify(stationPayload) !==
        JSON.stringify(values)
      ) {
        setIsOpen(true)
        setValue(tabs[0].index);
      } else
      history.push(
        urlList.filter((item: any) => item.name === urlNames.adminStation)[0]
          .url
      );
  };

  const closeDialog = () => {
    setIsOpen(false);
    history.push(
      urlList.filter((item: any) => item.name === urlNames.adminStation)[0].url
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={stationPayload}
        validationSchema={stationValidationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
          
          <>
            <Form>
              <div className="ManageStation  switchLeftComponents ManageStationUi">
                {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Station")}
                    alertType="toast"
                    open={true}
                  />
                )}
                {error && (
                  <CRXAlert
                    className=""
                    message={errorResponseMessage}
                    type="error"
                    alertType="inline"
                    open={true}
                  />
                )}

                <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
                    <CrxTabPanel value={value} index={0} >
                      <div className="centerGeneralTab">
                          <div className="itemIndicator">
                                  <label className="indicates-label"><b>*</b> Indicates required field</label>
                          </div>
                          <div className="generalContainer crxStationDetail">
                            <div className="itemLeft">
                     
                          
                                  <CRXColumn
                                    className="crxStationDetailBtn stationDetailCol crxLocationBtn"
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <CRXButton
                                      className="groupInfoTabButtons secondary  "
                                      onClick={() => setModal(true)}
                                      color="secondary"
                                    >
                                      {t("Map_location")}
                                    </CRXButton>
                                  </CRXColumn>
                                    
                                  <CRXColumn
                                    className="stationDetailCol latitudeGeneral"
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <div className="CBX-input">
                                      <label htmlFor="latitude">{t("Latitude")}</label>
                                      <Field id="latitude" name="Location.latitude" />
                                    </div>
                                  </CRXColumn>

                                  <CRXColumn
                                    className="stationDetailCol"
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <div className="CBX-input">
                                      <label htmlFor="longitude">{t("Longitude")}</label>
                                      <Field id="longitude" name="Location.longitude" />
                                    </div>
                                  </CRXColumn>
                              
                        
                            </div>
                            <div className="itemRight">
                       

                                  <CRXColumn
                                      className={
                                        "stationDetailCol " +
                                        ` ${errors.Name && touched.Name == true
                                          ? displayStationErrors
                                          : ""
                                        }`
                                      }
                                      container="container"
                                      item="item"
                                      lg={12}
                                      xs={12}
                                      spacing={0}
                                    >
                                      <div className="CBX-input">
                                        <label htmlFor="name">
                                          {t("Station_Name")} <span>*</span>
                                        </label>
                                        <div className="CrxStationError">
                                          <Field id="name" name="Name" />
                                          {errors.Name !== undefined &&
                                            touched.Name === true ? (
                                            <div className="errorStationStyle ">
                                              <i className="fas fa-exclamation-circle"></i>
                                              {errors.Name}
                                              {setDisplayStationError("errorBrdr")}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div >
                                  </CRXColumn>

                                  <CRXColumn
                                    className="stationDetailCol"
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <div className="CBX-input">
                                      <label htmlFor="street">{t("Street_Address")}<span>*</span>
                                      </label>
                                      {/* <Field id="street" name="StreetAddress" /> */}
                                      <div className="CrxStationError">
                                          <Field id="street" name="StreetAddress" />
                                          {errors.StreetAddress !== undefined &&
                                            touched.StreetAddress === true ? (
                                            <div className="errorStationStyle">
                                              <i className="fas fa-exclamation-circle"></i>
                                              {errors.StreetAddress}
                                              {setDisplayStationError("errorBrdr")}
                                            </div>
                                          ) : null}
                                        </div>
                                    </div>
                                  </CRXColumn>

                                  <CRXColumn
                                    className={
                                      "stationDetailCol " +
                                      ` ${errors.Phone && touched.Phone == true
                                        ? displayStationErrors
                                        : ""
                                      }`
                                    }
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <div className="CBX-input">
                                      <label htmlFor="phone">{t("Phone_Number")}</label>
                                      <div className="CrxStationError">
                                        <Field id="phone" name="Phone" />
                                      
                                        {errors.Phone !== undefined &&
                                          touched.Phone === true ? (
                                          <div className="errorStationStyle">
                                            <i className="fas fa-exclamation-circle"></i>
                                            {errors.Phone}
                                            {setDisplayStationError("errorBrdr")}
                                          </div>
                                        ) : null}
                                      </div> 
                                    </div>
                                  </CRXColumn>
                                  
                                  {/* <CRXColumn
                                    className={
                                      "stationDetailCol " +
                                      ` ${errors.Passcode && touched.Passcode == true
                                        ? displayStationErrors
                                        : ""
                                      }`
                                    }
                                    container="container"
                                    item="item"
                                    lg={12}
                                    xs={12}
                                    spacing={0}
                                  >
                                    <div className="CBX-input">
                                      <label htmlFor="passcode">
                                        {t("Pass_Code")} <span>*</span>
                                      </label>
                                      <div className="CrxStationError">
                                        <Field id="passcode" name="Passcode" component={InputShowHide} /> */}
                                        {/* TODO: Remove Below Commented Code, Leaving It For Visual Design */}
                                        {/* <Field id="passcode" name="Passcode"  />
                                        {errors.Passcode !== undefined &&
                                          touched.Passcode === true ? (
                                          <div className="errorStationStyle">
                                            <i className="fas fa-exclamation-circle"></i>
                                            {errors.Passcode}
                                            {setDisplayStationError("errorBrdr")}
                                          </div>
                                        ) : null} */}
                                      {/* </div>
                                    </div>
                                  </CRXColumn> */}


                            </div>
                          </div>
                      </div>

                    </CrxTabPanel>
         

                    <CrxTabPanel value={value} index={1}>
                      <div className="centerSettingTab">
                        <div className="itemIndicator">
                            <label className="indicates-label"><b>*</b> Indicates required field</label>
                        </div>
                      <CRXRows
                            className="crxStationDetail"
                            container="container"
                            spacing={0}
                        >
                            <CRXColumn
                              className={
                                "stationDetailCol " +
                                ` ${errors.SSId && touched.SSId == true
                                  ? displayStationErrors
                                  : ""
                                }`
                              }
                              container="container"
                              item="item"
                              lg={12}
                              xs={12}
                              spacing={0}
                            >
                              <div className="CBX-input">
                                <label htmlFor="SSId">
                                  {t("SSID")} 
                                </label>
                                <div className="CrxStationError">
                                  <Field id="SSId" name="SSId" />
                                  {errors.SSId !== undefined &&
                                    touched.SSId === true ? (
                                    <div className="errorStationStyle">
                                      <i className="fas fa-exclamation-circle"></i>
                                      {errors.SSId}
                                      {setDisplayStationError("errorBrdr")}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </CRXColumn>
                                 <CRXColumn
                              className={
                                "stationDetailCol " +
                                ` ${errors.Password && touched.Password == true
                                  ? displayStationErrors
                                  : ""
                                }`
                              }
                              container="container"
                              item="item"
                              lg={12}
                              xs={12}
                              spacing={0}
                            >
                              <div className="CBX-input passwordStationField">
                                <label htmlFor="password">
                                  {t("Password")}
                                </label>
                                <div className="CrxStationError">
                                  <Field id="password" name="Password" component={InputShowHide} />
                                  {/* TODO: Remove Below Commented Code, Leaving It For Visual Design */}
                                  {/* <Field id="password" name="Password" />
                                  {errors.Password !== undefined &&
                                    touched.Password === true ? (
                                    <div className="errorStationStyle">
                                      <i className="fas fa-exclamation-circle"></i>
                                      {errors.Password}
                                      {setDisplayStationError("errorBrdr")}
                                    </div>
                                  ) : null} */}
                                </div>
                              </div>
                            </CRXColumn>
                            <CRXColumn
                              className="stationDetailCol"
                              container="container"
                              item="item"
                              lg={12}
                              xs={12}
                              spacing={0}
                            >
                              <div className="colstation">
                                <label htmlFor="name">{t("BlackBox_Retention_Policy")}<span>*</span></label>
                                <div className="CrxStationError">
                                  <CRXMultiSelectBoxLight
                                    id="blackBoxPolicyMultiSelect"
                                    multiple={false}
                                    value={blackBoxAutoCompleteValue}
                                    options={filterData(
                                      blackBoxAutoCompleteOptions
                                    )}
                                    onChange={(
                                      e: React.SyntheticEvent,
                                      option: AutoCompleteOptionType[],
                                      reason: any
                                    ) =>
                                      blackBoxAutoCompleteonChange(
                                        e,
                                        option,
                                        setFieldValue,
                                        reason
                                      )
                                    }
                                    CheckBox={true}
                                    checkSign={false}
                                    required={true}
                                  />
                                </div>
                              </div>
                            </CRXColumn>
                        
                            <CRXColumn
                              className="stationDetailCol Uncategorized_Retention_Policy"
                              container="container "
                              item="item"
                              lg={12}
                              xs={12}
                              spacing={0}
                            >
                              <div className="colstation">
                                <label htmlFor="name">{t("Data_Retention_Policy")}<span>*</span></label>
                                <div className="CrxStationError">
                                  <CRXMultiSelectBoxLight
                                    id="retentionPolicyMultiSelect"
                                    className="getStationField"
                                    multiple={false}
                                    value={retentionAutoCompleteValue}
                                    options={filterData(
                                      retentionAutoCompleteOptions
                                    )}
                                    onChange={(
                                      e: React.SyntheticEvent,
                                      option: AutoCompleteOptionType[],
                                      reason: any
                                    ) =>
                                      retentionAutoCompleteonChange(
                                        e,
                                        option,
                                        setFieldValue,
                                        reason
                                      )
                                    }
                                    CheckBox={true}
                                    checkSign={false}
                                    required={true}
                                  />

                                  {errors.RetentionPolicy !== undefined ? (
                                    <div className="errorStationStyle">
                                      <i className="fas fa-exclamation-circle"></i>
                                      {"Retention_Policy_is_required"}
                                      {setDisplayStationError("errorBrdr")}
                                    </div>
                                  ) : null}
                                </div>
                              </div>

                            </CRXColumn>
                            <CRXColumn
                              className="stationDetailCol"
                              container="container"
                              item="item"
                              lg={12}
                              xs={12}
                              spacing={0}
                            >
                              <div className="colstation">
                                <label htmlFor="name">{t("Data_Upload_Policy")} <span>*</span></label>
                                <div className="CrxStationError">
                                  <CRXMultiSelectBoxLight
                                    id="uploadPolicyMultiSelect"
                                    className="getStationField"
                                    multiple={false}
                                    value={uploadAutoCompleteValue}
                                    options={filterData(
                                      uploadAutoCompleteOptions
                                    )}
                                    onChange={(
                                      e: React.SyntheticEvent,
                                      option: AutoCompleteOptionType[],
                                      reason: any
                                    ) =>
                                      uploadAutoCompleteonChange(
                                        e,
                                        option,
                                        setFieldValue,
                                        reason
                                      )
                                    }
                                    CheckBox={true}
                                    checkSign={false}
                                    required={true}
                                  />
                                  {errors.UploadPolicy !== undefined ? (
                                    <div className="errorStationStyle">
                                      <i className="fas fa-exclamation-circle"></i>
                                      {t("Upload_Policy_is_required")}
                                      {setDisplayStationError("errorBrdr")}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </CRXColumn>
                            
                            
                  
                     
                          </CRXRows>
                      </div>
                    
                    </CrxTabPanel>


                    <CrxTabPanel value={value} index={2}>
                      <div>
                        {deviceTypeCollection.length > 0 &&
                          UnitTemplatesRender({ setFieldValue, values })
                        }
                      </div>
                    </CrxTabPanel>


                  <div className="crxStationDetailBtn stationDetailButton">
                    <div>
                      <CRXButton
                          type="submit"
                          disabled={!(isValid && dirty)}
                          variant="contained"
                          className="groupInfoTabButtons"
                        >
                          {t("Save")}
                      </CRXButton>
                      <CRXButton
                          className="groupInfoTabButtons secondary"
                          color="secondary"
                          variant="outlined"
                          onClick={navigateToStations}
                        >
                          {t("Cancel")}
                      </CRXButton>
                    </div>
                    <div>
                      <CRXButton
                      onClick={() => redirectPage(values)}
                      className="groupInfoTabButtons-Close secondary"
                      color="secondary"
                      variant="outlined"
                    >
                      {t("Close")}
                    </CRXButton>
                    </div>
                  </div>
                  
                </div>

            </Form>

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
                <strong>{t("'station'")}</strong>. {t("If_you_close_the_form")}, 
                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                <div className="confirmMessageBottom">
                {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                </div>
              </div>
            </CRXConfirmDialog>

            <CRXConfirmDialog
              className="crx-unblock-modal CRXStationModal"
              title={t("Select_location_on_the_map")}
              setIsOpen={setModal}
              onConfirm={() => onConfirm(setFieldValue)}
              isOpen={modal}
              primary={t("Save_Location")}
              secondary={t("Cancel")}
              primaryDisabled={disableSaveButton}
            >
              {
                <>
                  <GoogleMap
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    zoomLevel={15}
                    mapTypeControl={true}
                    // initialMarker={{ lat: 24.86, long: 67.0 }}
                    initialMarker={
                      !isAddCase
                        ? {
                          lat: values.Location.latitude,
                          long: values.Location.longitude,
                        }
                        : values.Location.latitude == 0 &&
                          values.Location.longitude == 0
                          ? undefined
                          : {
                            lat: values.Location.latitude,
                            long: values.Location.longitude,
                          }
                    }
                    //{lat: initialValues..Location.latitude, long: stationPayload.Location.longitude } : undefined}
                    getMarkerLatLong={(location: number[]) =>
                      getMarkerLatLong(location)
                    }
                  />
                </>
              }
            </CRXConfirmDialog>
          </>
        )}
      </Formik>
    </>
  );
};
export default StationDetail;
