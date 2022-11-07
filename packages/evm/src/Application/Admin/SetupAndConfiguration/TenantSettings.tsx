import React from "react";
import { SETUP_CONFIGURATION_SERVICE_URL } from "../../../utils/Api/url";
import "./tenantSettings.scss";
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
import Cookies from 'universal-cookie';
import { TextField } from "@cb/shared";
declare const window: any;

const cookies = new Cookies();
const regex =
  /smtp\.[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const TenantSettings: React.FC = () => {
  const [success, setSuccess] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorResponseMessage, setErrorResponseMessage] =
    React.useState<string>(
      "We 're sorry. The tenant was unable to be saved. Please retry or contact your Systems Administrator"
    );
  const [actionVerb, setActionVerb] = React.useState<string>("PUT");
  const [setReasons, setReasonsValue] = React.useState<string[]>([]);
  const [setTimezone, setTimezoneValue] = React.useState<string[]>([]);

  const [mapAllFields, setmapAllFieldsValue] = React.useState<any>({
    TenantName: "",
    PasswordRules: "",
    TimeFormat: "",
    Timezone: "",
    Culture: "",
    DateTimeFormat : "",
    WaterMarkLogo: "",
    LogoName: "",
    MailServer: "",
    EmailLinkExpiration: "",
    CasePrefix: "",
    Longitude: "",
    Latitude: "",
    LiveStreamURL: "",
    LiveStreamPassword: "",
    LiveStreamUser: "",
    LiveStreamType:"",
    LiveStreamUrlForWeb:"",
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
    MesaurementUnit: "",
    AlertEmails: "",
    fileDetails: [],
  });

  const cultures = [
    { label: 'en-US', value: 'en-US'},
    { label: 'en-GB', value: 'en-GB'},
    { label: 'de-DE', value: 'de-DE'},
    { label: 'ar-EG', value: 'ar-EG'},
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
    const SETUP_CONFIGURATION_TENANTSETTINGS_GET_URL = `${SETUP_CONFIGURATION_SERVICE_URL}/TenantSettings`;
    tenantSettingService(SETUP_CONFIGURATION_TENANTSETTINGS_GET_URL, "GET")
      .then((res) => {
        //console.log("result : ", res);
        if (res.ok) return res.json();
        else setActionVerb("POST");
      })
      .then((tenantsett) => {
        // console.log("Tenant ", tenantsett);
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
              } else if (x.key == "Timezone" || x.key == "Culture") {
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
      })
      .catch((err: any) => {});
  }, []);
  React.useEffect(() => {
    const SETUP_CONFIGURATION_GET_REASONS = `${SETUP_CONFIGURATION_SERVICE_URL}/TenantSettings/getassetviewreasons`;
    tenantSettingService(SETUP_CONFIGURATION_GET_REASONS, "GET")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((reasons: any) => {
        setReasonsValue(reasons);
      })
      .catch(() => {});
  }, []);
  React.useEffect(() => {
    const SETUP_CONFIGURATION_GET_TIMEZONE = `${SETUP_CONFIGURATION_SERVICE_URL}/TenantSettings/gettimezone`;
    tenantSettingService(SETUP_CONFIGURATION_GET_TIMEZONE, "GET")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((timezone: any) => {
        const temp = timezone.map((x: any) => {
          return { label: x.DisplayName, value: x.DisplayName };
        });
        setTimezoneValue(temp);
      })
      .catch(() => {});
  }, []);
  const tenantSettingService = async (
    url: string,
    type: string,
    body?: any
  ) => {
    let requestOptions: any;
    if (type === "GET") {
      requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", TenantId: "1" },
      };
    } else if (type === "PUT") {
      requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json", TenantId: "1" },
        body: JSON.stringify(body),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: 
                { 
                  "Content-Type": "application/json", 
                  TenantId: "1",
                  'Authorization': 'Bearer ' + cookies.get("access_token"),
                 },
        body: JSON.stringify(body),
      };
    }
    console.log(requestOptions);
    return await fetch(url, requestOptions);
  };
  const validatingFields = (values: any) => {
    if (values.MailServer != "Custom") {
      values.MailServer = "Default";
      values.CustomURL = "";
      values.CustomFromEmail = "";
      values.CustomPort = "";
      values.CustomName = "";
      values.CustomPassword = "";
    }
    if (
      values.TimeFormat != "AM/PM" &&
      values.TimeFormat != "24hour" &&
      values.TimeFormat != "Military"
    ) {
      values.TimeFormat = "AM/PM";
    }
    if (
      values.MesaurementUnit != "Statute" &&
      values.MesaurementUnit != "Metric"
    ) {
      values.MesaurementUnit = "Statute";
    }
    if (values.EmailLinkExpiration == "") {
      values.EmailLinkExpiration = 1;
    }
    if (values.Culture == null) {
      values.Culture = navigator.languages[0];
    }
    if (values.AssetViewReasonRequired == "false") {
      values.Reasons = [];
    }
    if (
      values.AuthServer != "External OpenId" &&
      values.AuthServer != "Getac OpenId With AD"
    ) {
      values.AuthServer = "Getac OpenId Without AD";
    }

    if (values.AuthServer == "External OpenId") {
      values.RedirectingURL = "";
    } else if (values.AuthServer == "Getac OpenId Without AD") {
      values.ApplicationClientId = "";
      values.DirectoryTenantId = "";
      values.ApplicationRedirectUrl = "";
      values.ApplicationName = "";
      values.ClientSecretId = "";
      values.RedirectingURL = "";
    }
  };
  const submitTenantSettings = async (values: any) => {
    validatingFields(values);
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
          TenantTypeId: 1,
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
          TenantTypeId: 5,
          key: "ApplicationClientId",
          value: values.ApplicationClientId,
        },
        {
          TenantTypeId: 5,
          key: "DirectoryTenantId",
          value: values.DirectoryTenantId,
        },
        {
          TenantTypeId: 5,
          key: "ApplicationRedirectUrl",
          value: values.ApplicationRedirectUrl,
        },
        {
          TenantTypeId: 5,
          key: "ApplicationName",
          value: values.ApplicationName,
        },
        {
          TenantTypeId: 5,
          key: "ClientSecretId",
          value: values.ClientSecretId,
        },
        {
          TenantTypeId: 5,
          key: "RedirectingURL",
          value: values.RedirectingURL,
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
        {
          TenantTypeId: 4,
          key: "DateTimeFormat",
          value: new Date().toLocaleDateString(values.Culture.value),
        },
        {
          TenantTypeId: 4,
          key: "MesaurementUnit",
          value: values.MesaurementUnit,
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
        }
      ],
    };
    if(values.Culture.value != null){
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "Culture",
        value: values.Culture.value,
      })
    }
    else{
      body.tenantSettingEntries.push({
        TenantTypeId: 4,
        key: "Culture",
        value: values.Culture
      })
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
    }
    //console.log("BODY :" + body);
    const SETUP_CONFIGURATION_TENANTSETTINGS_POST_URL = `${SETUP_CONFIGURATION_SERVICE_URL}/TenantSettings`;
    tenantSettingService(
      SETUP_CONFIGURATION_TENANTSETTINGS_POST_URL,
      actionVerb,
      body
    )
      .then((res: any) => {
        if (res.ok) {
          setActionVerb("PUT");
          setSuccess(true);
          setTimeout(() => window.location.reload(), 1000);
        } else return res.text();
      })
      .then((message) => {})
      .catch((err: any) => {
        setError(true);
        console.error(err);
      });
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
    // fileDetails: Yup.mixed()
    //   .required("A file is required")
    //   .test(
    //     "fileDetails",
    //     "File too large",
    //     (value) => value[0] && value[0].size <= FILE_SIZE
    //   )
    //   .test(
    //     "fileDetails",
    //     "Unsupported Format",
    //     (value) => value[0] && SUPPORTED_FORMATS.includes(value[0].type)
    //   ),
    CustomFromEmail: Yup.string().when("MailServer", {
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
    CustomURL: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string()
        .trim()
        .matches(regex, "Allowed Format : smtp.serveraddress.com")
        .required("URL is required"),
      otherwise: Yup.string(),
    }),
    CustomName: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string().required("User name is required"),
      otherwise: Yup.string(),
    }),
    CustomPassword: Yup.string().when("MailServer", {
      is: "Custom",
      then: Yup.string().required("Password is required"),
      otherwise: Yup.string(),
    }),
    CustomPort: Yup.number().when("MailServer", {
      is: "Custom",
      then: Yup.number()
        .max(99999, "Cannnot be more than 5 characters")
        .required("Port is required"),
      otherwise: Yup.number(),
    }),
    ApplicationClientId: Yup.string().when("AuthServer", {
      is: "External OpenId",
      then: Yup.string().required("ApplicationClientId is required"),
      otherwise: Yup.string(),
    }),
    DirectoryTenantId: Yup.string().when("AuthServer", {
      is: "External OpenId",
      then: Yup.string().required("DirectoryTenantId is required"),
      otherwise: Yup.string(),
    }),
    ApplicationRedirectUrl: Yup.string().when("AuthServer", {
      is: "External OpenId",
      then: Yup.string().required("ApplicationRedirectUrl is required"),
      otherwise: Yup.string(),
    }),
    ApplicationName: Yup.string().when("AuthServer", {
      is: "External OpenId",
      then: Yup.string().required("ApplicationName is required"),
      otherwise: Yup.string(),
    }),
    ClientSecretId: Yup.string().when("AuthServer", {
      is: "External OpenId",
      then: Yup.string().required("ClientSecretId is required"),
      otherwise: Yup.string(),
    }),
    RedirectingURL: Yup.string().when("AuthServer", {
      is: "Getac OpenId With AD",
      then: Yup.string().required("RedirectingURL is required"),
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
            {/* {console.log("errors", errors)}
            {console.log("touch", touched)}
            {console.log("VALUES", values)} */}
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
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="UPLOAD LOGO"
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
                              <Field id="CustomURL" name="CustomURL" />
                              {errors.CustomURL !== undefined &&
                              touched.CustomURL === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.CustomURL}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="CustomFromEmail">
                                From Email
                              </label>
                              <Field
                                id="CustomFromEmail"
                                type="Email"
                                name="CustomFromEmail"
                              />
                              {errors.CustomFromEmail !== undefined &&
                              touched.CustomFromEmail === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.CustomFromEmail}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="CustomPort">Port</label>
                              <Field id="CustomPort" name="CustomPort" />
                              {errors.CustomPort !== undefined &&
                              touched.CustomPort === true ? (
                                <div className="errorTenantStyle">
                                  <i className="fas fa-exclamation-circle"></i>
                                  {errors.CustomPort}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="CustomName">Username</label>
                              <Field id="CustomName" name="CustomName" />
                            </div>
                          </CRXRows>
                          <CRXRows>
                            <div className="CBX-input">
                              <label htmlFor="CustomPassword">Password</label>
                              <TextField id="password"
                            type={passwordVisible ? "text" : "password"}
                            value={values.CustomPassword}
                            name="CustomPassword"
                            onChange={(e: any) => setFieldValue("CustomPassword", e.target.value)}>
                            
                          </TextField>
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
                        <label htmlFor="location">Location</label>
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
                          label="Cultures"
                          multiple={false}
                          CheckBox={true}
                          required={false}
                          options={cultures}
                          value={values.Culture}
                          isSearchable={true}
                          onChange={(
                            e: React.SyntheticEvent,
                            value: string
                          ) => {
                            setFieldValue("Culture", value, true);
                          }}
                        />
                      </CRXRows>
                      <CRXRows>
                        <label htmlFor="TimeFormat">Time Format</label>
                        <div role="group" aria-labelledby="my-radio-group">
                          <label>
                            <Field
                              type="radio"
                              name="TimeFormat"
                              value="AM/PM"
                            />
                            AM/PM
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="TimeFormat"
                              value="24hour"
                            />
                            24hour
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="TimeFormat"
                              value="Military"
                            />
                            Military
                          </label>
                        </div>
                      </CRXRows>
                      <CRXRows>
                        <label htmlFor="MesaurementUnit">
                          Mesaurement Unit
                        </label>
                        <div role="group" aria-labelledby="my-radio-group">
                          <label>
                            <Field
                              type="radio"
                              name="MesaurementUnit"
                              value="Statute"
                            />
                            Statute
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="MesaurementUnit"
                              value="Metric"
                            />
                            Metric
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
                      >
                        <div className="CBX-input">
                          <label htmlFor="password">Password</label>
                          <TextField id="password"
                            type="password"
                            onBlur=""
                            name="LiveStreamPassword"
                            value={values.LiveStreamPassword}
                            onChange={(e: any) => setFieldValue("LiveStreamPassword", e.target.value)}>
                            
                          </TextField>
                          {/* <Field
                            id="password"
                            type="password"
                            onBlur=""
                            name="LiveStreamPassword"
                          /> */}
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
                            /> HLS
                          </label>
                          <label>
                            <Field
                              type="radio"
                              name="LiveStreamType"
                              value="WebRTC"
                            /> WebRTC
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
                          <Field
                            type="radio"
                            name="AuthServer"
                            value="External OpenId"
                          />
                          External OpenId
                        </label>
                        <label>
                          <Field
                            type="radio"
                            name="AuthServer"
                            value="Getac OpenId with AD"
                          />
                          Getac OpenId with AD
                        </label>
                        <label>
                          <Field
                            type="radio"
                            name="AuthServer"
                            value="Getac OpenId Without AD"
                          />
                          Getac OpenId Without AD
                        </label>
                      </div>
                    </CRXColumn>
                    {values.AuthServer == "External OpenId" && (
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
                        <div className="CBX-input">
                          <label htmlFor="ApplicationRedirectUrl">
                            Application Redirect Url <span>*</span>
                          </label>
                          <Field
                            id="ApplicationRedirectUrl"
                            name="ApplicationRedirectUrl"
                          />
                          {errors.ApplicationRedirectUrl !== undefined &&
                          touched.ApplicationRedirectUrl ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.ApplicationRedirectUrl}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="CBX-input">
                          <label htmlFor="ApplicationName">
                            Application Name <span>*</span>
                          </label>
                          <Field id="ApplicationName" name="ApplicationName" />
                          {errors.ApplicationName !== undefined &&
                          touched.ApplicationName ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.ApplicationName}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="CBX-input">
                          <label htmlFor="ClientSecretId">
                            Client Secret Id <span>*</span>
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
                        </div>
                      </CRXColumn>
                    )}
                    {values.AuthServer == "Getac OpenId with AD" && (
                      <CRXColumn
                        className="stationDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                        <div className="CBX-input">
                          <label htmlFor="RedirectingURL">
                            Auth Service URL <span>*</span>
                          </label>
                          <Field id="RedirectingURL" name="RedirectingURL" />
                          {errors.RedirectingURL !== undefined &&
                          touched.RedirectingURL ? (
                            <div className="errorTenantStyle">
                              <i className="fas fa-exclamation-circle"></i>
                              {errors.RedirectingURL}
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
