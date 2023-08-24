import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import "./tenantSettings.scss";
import timeZonesData from "./Timezones.json";
import { CRXColumn } from "@cb/shared";
import * as Yup from "yup";
import {
  CRXAlert,
  CRXButton,
  CRXMultiSelectBoxLight,
  CRXCheckBox,
} from "@cb/shared";
import { CRXRows } from "@cb/shared";
import { Field, Form, Formik } from "formik";
import { AddFilesToFileService } from "../../../GlobalFunctions/FileUpload";
import Cookies from "universal-cookie";
import { TextField } from "@cb/shared";
import { SetupConfigurationAgent } from "../../../utils/Api/ApiAgent";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import moment from "moment";
import { CRXRadio } from "@cb/shared";
import { FieldTypes } from "../../Assets/AssetLister/Category/Model/FieldTypes";
import saveAs from "file-saver";

declare const window: any;

const cookies = new Cookies();
const regex =
  /smtp\.[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const TenantSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [success, setSuccess] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorResponseMessage, setErrorResponseMessage] =
    React.useState<string>(
      "We 're sorry. The tenant was unable to be saved. Please retry or contact your Systems Administrator"
    );
  const [actionVerb, setActionVerb] = React.useState<string>("PUT");
  const [setReasons, setReasonsValue] = React.useState<string[]>([]);
  const [dateFormatLabel, setdateFormatLabel] = React.useState<string>("");
  const [setTimezone, setTimezoneValue] = React.useState<any[]>([]);
  const cookies = new Cookies();
  const [mapAllFields, setmapAllFieldsValue] = React.useState<any>({
    TenantName: "",
    PasswordRules: "",
    TimeFormat: "",
    Timezone: "",
    TimezoneUTCFormat: "",
    Language: "",
    DateFormat: "",
    WaterMarkLogo: "",
    LogoName: "",
    MailServer: "",
    EmailLinkExpiration: "",
    CasePrefix: "",
    Longitude: "",
    Latitude: "",
    LiveStreamURL: "",
    LiveStreamPassword: "",
    CertificatePath: "",
    CertificatePassword: "",
    LiveStreamUser: "",
    LiveStreamType: "",
    LiveStreamUrlForWeb: "",
    AssetViewReasonRequired: "false",
    NTPServer: "",
    AuthServer: "",
    watchers: [],
    Reasons: [],
    CustomURL: "",
    CustomFromEmail: "",
    CustomPort: "",
    CustomName: "",
    CustomPassword: "",
    URL: "",
    FromEmail: "",
    Port: "",
    Name: "",
    Password: "",
    MeasurementUnit: "",
    AlertEmails: "",
    fileDetails: [],
  });
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const generateCertificate = (password: string) => {
    SetupConfigurationAgent.getTenantSettingCertificate(
      "/TenantSettings/GenerateCertificate/" + password
    )
      .then((certificate: any) => {
        var blob = new Blob([certificate.data],{type: "application/octet-stream"});
        saveAs(blob,"Certificates.zip")
      })
      .catch((ex:any) => {
        console.log("Error : " + ex);
      });
  };
  const handleClickk = () => {
    if (hiddenFileInput?.current) hiddenFileInput.current.click();
  };

  const languages = [
    { label: "(en) English - US", value: "en-US" },
    { label: "(en) English - UK", value: "en-UK" },
    { label: "(fr)   French - CA", value: "fr-CA" },
    { label: "(pl)  Polish", value: "pl" },
    { label: "(he) Hebrew", value: "he" },
    { label: "(ar)  Arabic", value: "ar" },
  ];
  const dateFormat = [
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
    { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
  ];

  React.useEffect(() => {
    window.onRecvLogoData = new CustomEvent("onUploadLogoUpdate");
    window.addEventListener("onUploadLogoUpdate", UploadLogoUpdate);
  }, [mapAllFields]);
  const UploadLogoUpdate = (data: any) => {
    if (
      data.data.percent == 100 &&
      data.data.fileSize == data.data.loadedBytes
    ) {
      mapAllFields.WaterMarkLogo = data.data.url;
      mapAllFields.LogoName = data.data.fileName;
      submitTenantSettings(mapAllFields);
    } else if (data.data.error) {
    }
  };
  const handleOnUpload = async (e: any) => {
    setmapAllFieldsValue(e);
    AddFilesToFileService(e.fileDetails, window.onRecvLogoData);
  };
  React.useEffect(() => {
    dispatch(setLoaderValue({ isLoading: true, message: "" }));
    SetupConfigurationAgent.getTenantSetting()
      .then((tenantsett) => {
        tenantsett["settingEntries"].forEach(
          (categories: any, index: number) => {
            let settingEntries = Object.entries(categories[index + 1]).map(
              (e: any) => ({ key: e[0], value: e[1] })
            );
            for (const x of settingEntries) {
              if (x.key == "Reasons") {
                var temp = x.value?.split(",");
                mapAllFields[x.key] = temp.map((x: any) => {
                  return { label: x, inputValue: x };
                });
              } else if (
                x.key == "Timezone" ||
                x.key == "Language" ||
                x.key == "DateFormat"
              ) {
                mapAllFields[x.key] = { label: x.value, value: x.value };
              } else {
                mapAllFields[x.key] = x.value;
              }
            }
          }
        );
        mapAllFields["fileDetails"] = new File([], "asd", {
          type: "image/jpg",
        });
        dispatch(
          setLoaderValue({ isLoading: false, message: "", error: true })
        );
      })
      .catch((err: any) => {
        dispatch(
          setLoaderValue({ isLoading: false, message: "", error: true })
        );
        setActionVerb("POST");
      });
  }, []);
  React.useEffect(() => {
    SetupConfigurationAgent.getTenantSetting(
      "/TenantSettings/getassetviewreasons"
    )
      .then((reasons: any) => {
        setReasonsValue(reasons);
      })
      .catch(() => {});
  }, []);
  React.useEffect(() => {
    dispatch(enterPathActionCreator({ val: "" }));
    const temp = timeZonesData.map((x) => {
      return { label: x.text, value: x.value };
    });
    setTimezoneValue(temp);
  }, []);
  const checkDateFormat = async (value: any, timeFormat: any) => {
    if (value && value.value != "") {
      if (timeFormat == "AM/PM") {
        setdateFormatLabel(value.value + " hh:mm:ss a");
      } else {
        setdateFormatLabel(value.value + " HH:mm:ss");
      }
    } else {
      setdateFormatLabel("");
    }
  };
  const RadioTimePeriodBtnValues = [
    {
      id: 1,
      value: "AM/PM",
      isDisabled: false,
      label: "12 hour (AM/PM)",
      Comp: () => {},
      Name: "12 hour (AM/PM)",
    },
    {
      id: 2,
      value: "24hour",
      isDisabled: false,
      label: "24hour",
      Comp: () => {},
      Name: "24hour",
    },
  ];
  const validatingFields = async (values: any) => {
    if (values.MailServer != "Custom") {
      await SetupConfigurationAgent.getMailServerSettings("/MailServers/1")
        .then((defaultMailSettings: any) => {
          values.CustomURL = defaultMailSettings.server?.smtp;
          values.CustomFromEmail = defaultMailSettings.from;
          values.CustomPort = defaultMailSettings.server?.port;
          values.CustomName = defaultMailSettings.name;
          values.CustomPassword = defaultMailSettings.credential?.password;
          values.MailServer = "Default";
          values.URL = "";
          values.FromEmail = "";
          values.Port = "";
          values.Name = "";
          values.Password = "";
        })
        .catch((e: any) => {
          console.log("ERORRR : " + e.message);
        });
    } else {
      values.CustomURL = values.URL;
      values.CustomFromEmail = values.FromEmail;
      values.CustomPort = values.Port;
      values.CustomName = values.Name;
      values.CustomPassword = values.Password;
    }
    if (values.TimeFormat != "AM/PM" && values.TimeFormat != "24hour") {
      values.TimeFormat = "AM/PM";
    }
    if (
      values.MeasurementUnit != "Imperial" &&
      values.MeasurementUnit != "Metric"
    ) {
      values.MeasurementUnit = "Imperial";
    }
    if (values.EmailLinkExpiration == "") {
      values.EmailLinkExpiration = 1;
    }
    if (
      values.Language == null ||
      values.Language == "" ||
      values.Language?.label == ""
    ) {
      values.Language = navigator.languages[0];
    }
    if (values.AssetViewReasonRequired == "false") {
      values.Reasons = [];
    }
    if (values.AuthServer != "1" && values.AuthServer != "2") {
      values.AuthServer = "3";
    }

    if (values.AuthServer == "1") {
      values.ConfigurationName = "";
    } else if (values.AuthServer == "3") {
      values.ApplicationClientId = "";
      values.DirectoryTenantId = "";
      //values.CertificatePath = "";
      values.CertificatePassword = "";
      //values.ClientSecretId = "";
      values.ConfigurationName = "";
    } else {
      values.ApplicationClientId = "";
      values.DirectoryTenantId = "";
      //values.CertificatePath = "";
      values.CertificatePassword = "";
      //values.ClientSecretId = "";
    }
  };
  const submitTenantSettings = async (values: any) => {
    await validatingFields(values);

    const body = {
      settingEntries: null,
      tenantSettingEntries: [
        {
          TenantTypeId: 1,
          key: "TenantName",
          value: values.TenantName,
        },
        {
          TenantTypeId: 1,
          key: "WaterMarkLogo",
          value: values.WaterMarkLogo,
        },
        {
          TenantTypeId: 1,
          key: "LogoName",
          value: values.LogoName,
        },
        {
          TenantTypeId: 1,
          key: "PasswordRules",
          value: values.PasswordRules,
        },
        {
          TenantTypeId: 1,
          key: "AssetViewReasonRequired",
          value: values.AssetViewReasonRequired == "true" ? "true" : "false",
        },

        {
          TenantTypeId: 1,
          key: "NTPServer",
          value: values.NTPServer,
        },
        {
          TenantTypeId: 6,
          key: "AuthServer",
          value: values.AuthServer,
        },
        {
          TenantTypeId: 2,
          key: "MailServer",
          value: values.MailServer,
        },
        {
          TenantTypeId: 3,
          key: "EmailLinkExpiration",
          value: values.EmailLinkExpiration,
        },
        {
          TenantTypeId: 3,
          key: "AlertEmails",
          value: values.AlertEmails,
        },

        {
          TenantTypeId: 2,
          key: "CustomURL",
          value: values.CustomURL,
        },
        {
          TenantTypeId: 2,
          key: "CustomFromEmail",
          value: values.CustomFromEmail,
        },
        {
          TenantTypeId: 2,
          key: "CustomPort",
          value: values.CustomPort,
        },
        {
          TenantTypeId: 2,
          key: "CustomName",
          value: values.CustomName,
        },
        {
          TenantTypeId: 2,
          key: "CustomPassword",
          value: values.CustomPassword,
        },

        {
          TenantTypeId: 2,
          key: "URL",
          value: values.URL,
        },
        {
          TenantTypeId: 2,
          key: "FromEmail",
          value: values.FromEmail,
        },
        {
          TenantTypeId: 2,
          key: "Port",
          value: values.Port,
        },
        {
          TenantTypeId: 2,
          key: "Name",
          value: values.Name,
        },
        {
          TenantTypeId: 2,
          key: "Password",
          value: values.Password,
        },
        {
          TenantTypeId: 6,
          key: "ApplicationClientId",
          value: values.ApplicationClientId,
        },
        {
          TenantTypeId: 6,
          key: "DirectoryTenantId",
          value: values.DirectoryTenantId,
        },
        // {
        //   TenantTypeId: 6,
        //   key: "CertificatePath",
        //   value: values.CertificatePath,
        // },
        {
          TenantTypeId: 6,
          key: "CertificatePassword",
          value: values.CertificatePassword,
        },
        // {
        //   TenantTypeId: 6,
        //   key: "ClientSecretId",
        //   value: values.ClientSecretId,
        // },
        {
          TenantTypeId: 6,
          key: "ConfigurationName",
          value: values.ConfigurationName,
        },
        {
          TenantTypeId: 4,
          key: "Latitude",
          value: values.Latitude,
        },
        {
          TenantTypeId: 4,
          key: "Longitude",
          value: values.Longitude,
        },
        {
          TenantTypeId: 4,
          key: "TimeFormat",
          value: values.TimeFormat,
        },
        // {
        //   TenantTypeId: 4,
        //   key: "DateTimeFormat",
        //   value: new Date().toLocaleDateString(values.Culture.value),
        // },
        {
          TenantTypeId: 4,
          key: "MeasurementUnit",
          value: values.MeasurementUnit,
        },
        {
          TenantTypeId: 5,
          key: "LiveStreamURL",
          value: values.LiveStreamURL,
        },
        {
          TenantTypeId: 5,
          key: "LiveStreamUser",
          value: values.LiveStreamUser,
        },
        {
          TenantTypeId: 5,
          key: "LiveStreamPassword",
          value: values.LiveStreamPassword,
        },
        {
          TenantTypeId: 5,
          key: "LiveStreamType",
          value: values.LiveStreamType,
        },
        {
          TenantTypeId: 5,
          key: "LiveStreamUrlForWeb",
          value: values.LiveStreamUrlForWeb,
        },
      ],
    };
    if (values.Language.value != null) {
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "Language",
        //value: values.Language.value, FOR PILOT
        value: "en-US",
      });
    } else {
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "Language",
        //value: values.Language FOR PILOT
        value: "en-US",
      });
    }
    if (values.DateFormat != null && values.DateFormat != "") {
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "DateFormat",
        //value: values.Language.value, FOR PILOT
        value: values.DateFormat.value,
      });
    }
    if (values.Reasons?.length > 0) {
      body.tenantSettingEntries.push({
        TenantTypeId: 1,
        key: "Reasons",
        value:
          values.Reasons?.length < 1
            ? ""
            : values.Reasons?.length == 1
            ? values.Reasons[0].inputValue
            : values.Reasons?.reduce(
                (completeValue: any, currentValue: any) => {
                  return (
                    (completeValue.inputValue ?? completeValue) +
                    "," +
                    currentValue.inputValue
                  );
                }
              ),
      });
    }
    if (values.Timezone != null && values.Timezone != "") {
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "Timezone",
        value: values.Timezone.value,
      });
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "TimezoneUTCFormat",
        value: values.Timezone.label,
      });
    }
    if (actionVerb == "POST") {
      SetupConfigurationAgent.postTenantSetting(body)
        .then((res: any) => {
          setActionVerb("PUT");
          setSuccess(true);
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
        });
    } else {
      dispatch(setLoaderValue({ isLoading: true, message: "" }));
      SetupConfigurationAgent.putTenantSetting(body)
        .then((res: any) => {
          setActionVerb("PUT");
          setSuccess(true);
          dispatch(
            setLoaderValue({ isLoading: false, message: "", error: true })
          );
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch((err: any) => {
          setError(true);
          console.error(err);
        });
    }
  };
  const onSubmit = (values: any) => {
    if (values.fileDetails[0]?.size > 0) {
      handleOnUpload(values);
    } else {
      submitTenantSettings(values);
    }
  };
  const FILE_SIZE = 20 * 1024;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];
  const tenantValidationSchema = Yup.object().shape({
    TenantName: Yup.string().required("Tenant Name is required"),
    EmailLinkExpiration: Yup.number().min(1).max(2016),
    AlertEmails: Yup.string().email("Invalid Email"),
    FromEmail: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string()
        .email("Must be a valid email")
        .required("Email is required"),
      otherwise: Yup.string(),
    }),
    Reasons: Yup.array().when("AssetViewReasonRequired", {
      is: "true",
      then: Yup.array().min(1, "Reasons are required"),
      otherwise: Yup.array(),
    }),
    URL: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string()
        .trim()
        .matches(regex, "Allowed Format : smtp.serveraddress.com")
        .required("URL is required"),
      otherwise: Yup.string(),
    }),
    Name: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string().required("User name is required"),
      otherwise: Yup.string(),
    }),
    // Password: Yup.string().when("MailServer", {
    //   is: "Custom",
    //   then: Yup.string().required("Password is required"),
    //   otherwise: Yup.string(),
    // }),
    Port: Yup.number().when("MailServer", {
      is: "Custom",
      then: Yup.number()
        .max(99999, "Cannnot be more than 5 characters")
        .required("Port is required"),
      otherwise: Yup.number(),
    }),
    ApplicationClientId: Yup.string().when("AuthServer", {
      is: "1",
      then: Yup.string().required("ApplicationClientId is required"),
      otherwise: Yup.string(),
    }),
    DirectoryTenantId: Yup.string().when("AuthServer", {
      is: "1",
      then: Yup.string().required("DirectoryTenantId is required"),
      otherwise: Yup.string(),
    }),
    // CertificatePath: Yup.string().when("AuthServer", {
    //   is: "1",
    //   then: Yup.string().required("CertificatePath is required"),
    //   otherwise: Yup.string(),
    // }),
    // CertificatePassword: Yup.string().when("AuthServer", {
    //   is: "1",
    //   then: Yup.string().required("CertificatePassword is required"),
    //   otherwise: Yup.string(),
    // }),
    // ClientSecretId: Yup.string().when("AuthServer", {
    //   is: "1",
    //   then: Yup.string().required("ClientSecretId is required"),
    //   otherwise: Yup.string(),
    // }),
    ConfigurationName: Yup.string().when("AuthServer", {
      is: "2",
      then: Yup.string().required("ConfigurationName is required"),
      otherwise: Yup.string(),
    }),
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={mapAllFields}
        validationSchema={tenantValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
        }}
      >
        {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
          <>
            <Form>
              <div className="TenantSettingsUpdate  switchLeftComponents">
                {success && (
                  <CRXAlert
                    message="Success: You have saved the Tenant"
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
                <CRXRows
                  className="crxStationDetail"
                  container="container"
                  spacing={0}
                >
                  <CRXColumn
                    className="stationDetailCol"
                    container="container"
                    item="item"
                    lg={6}
                    xs={6}
                    spacing={0}
                  >
                    <label></label>
                    <CRXColumn
                      className="stationDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                      <div className="CBX-input">
                        <label htmlFor="tenantName">
                          Tenant Name <span>*</span>
                        </label>
                        <Field
                          id="tenantName"
                          key="tenantName"
                          name="TenantName"
                        />
                        {errors.TenantName !== undefined &&
                        touched.TenantName ? (
                          <div className="errorTenantStyle">
                            <i className="fas fa-exclamation-circle"></i>
                            {errors.TenantName}
                          </div>
                        ) : (
                          <></>
                        )}
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
                      <label htmlFor="Watermark Logo">
                        Watermark Logo on Playback
                      </label>
                      <CRXButton
                        onClick={handleClickk}
                        variant="contained"
                        className="groupInfoTabButtons"
                      >
                        Upload
                      </CRXButton>
                      <input
                        type="file"
                        accept="image/*"
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                        id="contained"
                        name="fileDetails"
                        onChange={(event) => {
                          setFieldValue(
                            "fileDetails",
                            event.currentTarget.files
                          );
                        }}
                      />
                      {errors.fileDetails !== undefined ? (
                        <div className="errorTenantStyle">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.fileDetails}
                        </div>
                      ) : (
                        <></>
                      )}
                      <CRXRows>
                        <label htmlFor="LogoName">
                          Uploaded Image: {values.LogoName}
                        </label>
                      </CRXRows>
                    </CRXColumn>

                    <CRXColumn
                      className="stationDetailCol stationDetailCol1"
                      container="container"
                      item="item"
                      lg={10}
                      xs={10}
                      spacing={0}
                    >
                      <CRXRows>
                        <label htmlFor="MailServer">Email</label>
                      </CRXRows>
                      <CRXRows>
                        <label htmlFor="MailServer">Mail Server</label>
                        <div role="group" aria-labelledby="my-radio-group">
                          <label>
                            <Field
                              type="radio"
                              name="MailServer"
                              value="Default"
                            />
                            Default
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="MailServer"
                              value="Custom"
                              onClick={() => {}}
                              // var temp =
                              //   tenantValidationSchema.CustomName = Yup.string().required("Customer Name is required");

                              //setTenantValidationSchema(temp)}}
                            />
                            Custom
                          </label>
                        </div>
                      </CRXRows>
                      {values.MailServer == "Custom" && (
                        <CRXColumn>
                          <CRXRows container="container" lg={12} xs={12}>
                            <div className="CBX-input">
                              <label htmlFor="CustomURL">
                                SMTP Mail Server
                              </label>
                              <Field id="URL" name="URL" />
                              {errors.URL !== undefined &&
                              touched.URL === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.URL}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="FromEmail">From Email</label>
                              <Field
                                id="FromEmail"
                                type="Email"
                                name="FromEmail"
                              />
                              {errors.FromEmail !== undefined &&
                              touched.FromEmail === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.FromEmail}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="ort">Port</label>
                              <Field id="Port" name="Port" />
                              {errors.Port !== undefined &&
                              touched.Port === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.Port}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="Name">Username</label>
                              <Field id="Name" name="Name" />
                              {errors.Name !== undefined &&
                              touched.Name === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.Name}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows style={{ display: "none" }}>
                            <div className="CBX-input">
                              <label htmlFor="Password">Password</label>
                              <TextField
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder={
                                  passwordVisible
                                    ? values.Password
                                    : values.Password.length > 0
                                    ? new Array(
                                        values.Password.length + 1
                                      ).join("*")
                                    : ""
                                }
                                name="Password"
                                onChange={(e: any) =>
                                  setFieldValue("Password", e.target.value)
                                }
                              ></TextField>
                              {/* <Field
                                id="CustomPassword"
                                type={passwordVisible ? "text" : "password"}
                                name="CustomPassword"
                              /> */}
                              <CRXButton
                                onClick={() =>
                                  passwordVisible
                                    ? setPasswordVisible(false)
                                    : setPasswordVisible(true)
                                }
                              >
                                {" "}
                                <i className="fa-solid fa-eye"></i>{" "}
                              </CRXButton>
                            </div>
                          </CRXRows>
                        </CRXColumn>
                      )}
                      <CRXRows>
                        <div className="CBX-input">
                          <label htmlFor="email">Email Link Expiration</label>{" "}
                          <Field
                            id="linkExpiration"
                            name="EmailLinkExpiration"
                          />
                          <>Hours</>
                        </div>
                      </CRXRows>
                      <CRXRows>
                        <div className="CBX-input">
                          <label htmlFor="AlertEmails">Alert Emails</label>
                          <Field id="alertEmails" name="AlertEmails" />
                          {errors.AlertEmails !== undefined &&
                          touched.AlertEmails ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.AlertEmails}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </CRXRows>
                      <CRXRows>
                        <label htmlFor="location">Location</label>
                      </CRXRows>

                      <CRXRows>
                        <CRXMultiSelectBoxLight
                          className="DateTimeFormatAutocomplete"
                          label="Language"
                          multiple={false}
                          CheckBox={true}
                          required={false}
                          options={languages}
                          value={values.Language}
                          isSearchable={true}
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string
                          ) => {
                            setFieldValue("Language", value, true);
                          }}
                        />
                      </CRXRows>
                      <CRXRows>
                        <CRXMultiSelectBoxLight
                          className="timezoneAutocomplete"
                          label="Timezone"
                          multiple={false}
                          CheckBox={true}
                          required={false}
                          options={setTimezone}
                          value={values.Timezone}
                          isSearchable={true}
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string
                          ) => {
                            setFieldValue("Timezone", value, true);
                          }}
                        />
                      </CRXRows>
                      <CRXRows>
                        <CRXMultiSelectBoxLight
                          className="DateTimeFormatAutocomplete"
                          label="Date Format"
                          multiple={false}
                          CheckBox={true}
                          required={false}
                          options={dateFormat}
                          value={values.DateFormat}
                          isSearchable={true}
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string
                          ) => {
                            setFieldValue("DateFormat", value, true);
                            checkDateFormat(value, values.TimeFormat);
                          }}
                        />
                      </CRXRows>
                      <CRXRows className="timeDateRadio">
                        <label htmlFor="TimeFormat">Time Format</label>
                        <CRXRadio
                          className=""
                          content={RadioTimePeriodBtnValues}
                          value={values.TimeFormat}
                          // setValue={(e: any) =>
                          //   onRetentionTypeChange(RadioTimePeriodBtnValues[0].Name)
                          // }
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string
                          ) => {
                            setFieldValue("TimeFormat", value, true);
                            checkDateFormat(values.DateFormat, value);
                          }}
                          checked={true}
                          name="TimeFormat"
                        />
                      </CRXRows>
                      <CRXRows>
                        <div className="DateTimeFormat">
                          <strong>
                            <label htmlFor="DateTimeFormat">
                              Date/Time Example:{" "}
                              {values.DateFormat
                                ? moment(moment().toDate())
                                    .local()
                                    .format(dateFormatLabel)
                                : ""}
                            </label>
                          </strong>
                        </div>
                      </CRXRows>
                    </CRXColumn>
                  </CRXColumn>
                  <CRXColumn
                    className="stationDetailCol "
                    container="container"
                    item="item"
                    lg={6}
                    xs={6}
                    spacing={0}
                  >
                    <CRXColumn
                      className="stationDetailCol stationDetailCol1"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                      <CRXRows>
                        <label htmlFor="MeasurementUnit">
                          Measurement Unit
                        </label>
                        <div role="group" aria-labelledby="my-radio-group">
                          <label>
                            <Field
                              type="radio"
                              name="MeasurementUnit"
                              value="Imperial"
                            />
                            Imperial (MPH)
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="MeasurementUnit"
                              value="Metric"
                            />
                            Metric (KPH)
                          </label>
                        </div>
                      </CRXRows>
                    </CRXColumn>
                    <CRXColumn
                      className="stationDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                      <label htmlFor="AssetViewReasonRequired">
                        Asset View Reason
                      </label>
                      <div className="crx-requird-check">
                        <CRXCheckBox
                          checked={
                            values.AssetViewReasonRequired != "false" ||
                            values.AssetViewReasonRequired == "true"
                          }
                          lightMode={true}
                          className="crxCheckBoxCreate "
                          onChange={() => {
                            setFieldValue(
                              "AssetViewReasonRequired",
                              values.AssetViewReasonRequired == "true"
                                ? "false"
                                : "true",
                              true
                            );
                          }}
                        />
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
                      {values.AssetViewReasonRequired == "true" && (
                        <CRXMultiSelectBoxLight
                          className="reasonsAutocomplete"
                          label="Reasons"
                          multiple={true}
                          CheckBox={true}
                          required={true}
                          options={setReasons}
                          value={values.Reasons}
                          autoComplete={false}
                          isSearchable={true}
                          disabled={!values.AssetViewReasonRequired}
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string[]
                          ) => {
                            setFieldValue("Reasons", value, true);
                          }}
                        />
                      )}
                      {errors.Reasons !== undefined ? (
                        <div className="errorTenantStyle">
                          <i className="fas fa-exclamation-circle"></i>
                          {errors.Reasons}
                        </div>
                      ) : (
                        <></>
                      )}
                    </CRXColumn>
                    <CRXColumn
                      className="stationDetailCol"
                      container="container"
                      item="item"
                      lg={8}
                      xs={8}
                      spacing={0}
                    >
                      <label>Live Stream</label>
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="LiveStreamURL">Server</label>
                          <Field id="url" name="LiveStreamURL" />
                        </div>
                      </CRXRows>
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                        style={{ display: "none" }}
                      >
                        <div className="CBX-input">
                          <label htmlFor="name">Name</label>
                          <Field id="name" name="LiveStreamUser" />
                        </div>
                      </CRXRows>
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                        style={{ display: "none" }}
                      >
                        <div className="CBX-input">
                          <label htmlFor="password">Password</label>
                          <TextField
                            id="password"
                            type="password"
                            onBlur=""
                            name="LiveStreamPassword"
                            placeholder={new Array(
                              values.LiveStreamPassword.length + 1
                            ).join("*")}
                            onChange={(e: any) =>
                              setFieldValue(
                                "LiveStreamPassword",
                                e.target.value
                              )
                            }
                          ></TextField>
                        </div>
                      </CRXRows>
                    </CRXColumn>
                    <CRXColumn>
                      <CRXRows
                        className="crxStationDetail"
                        container="container"
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="name">Live Stream URL For Web</label>
                          <Field id="urlforweb" name="LiveStreamUrlForWeb" />
                        </div>
                      </CRXRows>

                      <CRXRows>
                        <div role="group" aria-labelledby="my-radio-group">
                          <label>
                            <Field
                              type="radio"
                              name="LiveStreamType"
                              value="HLS"
                            />{" "}
                            HLS
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="LiveStreamType"
                              value="WebRTC"
                            />{" "}
                            WebRTC
                          </label>
                        </div>
                      </CRXRows>
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
                        <label htmlFor="NTPserver">NTP Server</label>
                        <Field id="NTPserver" name="NTPServer" />
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
                      <label htmlFor="AuthServer">Auth Server</label>
                      <div role="group" aria-labelledby="my-radio-group">
                        <label>
                          <Field type="radio" name="AuthServer" value="1" />
                          External OpenId
                        </label>
                        <label>
                          <Field type="radio" name="AuthServer" value="2" />
                          Getac OpenId with AD
                        </label>
                        <label>
                          <Field type="radio" name="AuthServer" value="3" />
                          Getac OpenId Without AD
                        </label>
                      </div>
                    </CRXColumn>
                    {values.AuthServer == "1" && (
                      <CRXColumn
                        className="stationDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="ApplicationClientId">
                            Application ClientId <span>*</span>
                          </label>
                          <Field
                            id="ApplicationClientId"
                            name="ApplicationClientId"
                          />
                          {errors.ApplicationClientId !== undefined &&
                          touched.ApplicationClientId ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.ApplicationClientId}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="CBX-input">
                          <label htmlFor="DirectoryTenantId">
                            Directory TenantId <span>*</span>
                          </label>
                          <Field
                            id="DirectoryTenantId"
                            name="DirectoryTenantId"
                          />
                          {errors.DirectoryTenantId !== undefined &&
                          touched.DirectoryTenantId ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.DirectoryTenantId}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        {/* <div className="CBX-input">
                          <label htmlFor="ClientSecretId">
                            Client Secret Id
                          </label>
                          <Field id="ClientSecretId" name="ClientSecretId" />
                          {errors.ClientSecretId !== undefined &&
                          touched.ClientSecretId ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.ClientSecretId}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div> */}
                        {/* <div className="CBX-input">
                          <label htmlFor="CertificatePath">
                            Certificate Path 
                          </label>
                          <Field
                            id="CertificatePath"
                            name="CertificatePath"
                          />
                          {errors.CertificatePath !== undefined &&
                          touched.CertificatePath ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.CertificatePath}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div> */}
                        <div className="CBX-input">
                          <div className="styleCertificatePassword">
                            <label htmlFor="CertificatePassword">
                              Certificate Password
                            </label>
                            <TextField
                              id="password"
                              type="password"
                              onBlur=""
                              name="CertificatePassword"
                              placeholder={new Array(
                                values.CertificatePassword.length + 1
                              ).join("*")}
                              onChange={(e: any) =>
                                setFieldValue(
                                  "CertificatePassword",
                                  e.target.value
                                )
                              }
                            ></TextField>
                            {/* <Field id="CertificatePassword" name="CertificatePassword" type="password"
                          placeholder={
                            new Array(values.LiveStreamPassword.length + 1).join("*") 
                            }
                          onChange={(e: any) => setFieldValue("CertificatePassword", e.target.value)}
                          onBlur=""/> */}
                            {errors.CertificatePassword !== undefined &&
                            touched.CertificatePassword ? (
                              <div className="errorTenantStyle">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.CertificatePassword}
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <label htmlFor="CERTIFICATE">CERTIFICATE</label>
                        <CRXButton
                         onClick={() => generateCertificate(values.CertificatePassword)}
                          variant="contained"
                          className="groupInfoTabButtons"
                          disabled={values.CertificatePassword == ""}
                        >
                          Generate
                        </CRXButton>
                      </CRXColumn>
                    )}
                    {values.AuthServer == "2" && (
                      <CRXColumn
                        className="stationDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="ConfigurationName">
                            Configuration Name <span>*</span>
                          </label>
                          <Field
                            id="ConfigurationName"
                            name="ConfigurationName"
                          />
                          {errors.ConfigurationName !== undefined &&
                          touched.ConfigurationName ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.ConfigurationName}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </CRXColumn>
                    )}
                  </CRXColumn>
                  <CRXButton
                    type="submit"
                    disabled={!isValid || !dirty}
                    onClick={() => onSubmit(values)}
                    variant="contained"
                    className="groupInfoTabButtons"
                  >
                    Save
                  </CRXButton>
                </CRXRows>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default TenantSettings;
