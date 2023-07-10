import React, { useEffect, useState, useRef } from "react";
import {
  CRXTabs,
  CrxTabPanel,
  CRXAlert,
  CRXToaster,
} from "@cb/shared";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DataSourceDetail from "../HotListDataSource/DataSourceTabs/DataSourceDetail"
import DataSourceMapping from "./DataSourceTabs/DataSourceMapping";
import { CRXButton } from "@cb/shared";
import { urlList, urlNames } from "../../../utils/urlList";
import { Link, useHistory } from "react-router-dom";
import "./DataSourcePanel.scss"
import { HotListDataSourceTemplate } from "../../../utils/Api/models/HotListDataSourceModels";
import { HotListDataSourceMappingTemplate } from "../../../utils/Api/models/HotlistDataSourceMapping";
import { RootState } from "../../../Redux/rootReducer";
import { GetAlprDataSourceById } from "../../../Redux/AlprDataSourceReducer";
import { CRXConfirmDialog } from "@cb/shared";
import { AlprDataSource } from "../../../utils/Api/ApiAgent";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { alprToasterMessages } from "../AlprGlobalConfiguration";
import { setLoaderValue } from "../../../Redux/loaderSlice";

const dataSourceInitialPayload = {
  recId: 0,
  sourceTypeId: 0,
  name: '',
  sourceName: '',
  sourceTypeName: '',
  userId: '',
  password: '',
  confirmPassword: '',
  connectionType: '',
  schedulePeriod: '',
  locationPath: '',
  port: '',
  lastRun: '',
  status: '',
  statusDesc: '',
  sourceType: { recId: 10002, sourceTypeName: 'CSV' }
}
const dataSourceMappingInitialPayload = {
  LicensePlate: '',
  DateOfInterest: '',
  LicenseType: '',
  AgencyId: '',
  State: '',
  FirstName: '',
  LastName: '',
  Alias: '',
  Year: '',
  Make: '',
  Model: '',
  Color: '',
  Style: '',
  Notes: '',
  NCICNumber: '',
  ImportSerial: '',
  ViolationInfo: ''
}

const formikInitialData=
{
  dataSourceData:dataSourceInitialPayload,
  dataSourceMappingData:dataSourceMappingInitialPayload,
}
const DataSourceFormsAndFields = () => {
  const { id } = useParams<{ id: string }>();//get data from url 
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const [selectedTabvalue, setSelectedTabvalue] = React.useState(0);
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
  const [dataSourceInitialData, setdataSourceInitialData] = React.useState<any>(formikInitialData);

  const dataSourceMsgFormRef = useRef<typeof CRXToaster>(null);
  
  const dataSourceDataById: any = useSelector((state: RootState) => state.alprDataSourceReducer.dataSourceDataById);
  
	const datasourceServiceUrl = "HotListDataSource";
  const saveErrorMessage=t('We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator.');
  const getErrorMessage=t('We_re_sorry._The_form_was_unable_to_load._Please_retry_or_contact_your_Systems_Administrator.');
  const successMessage=t('Data_Source_Saved_Successfully');
  const toasterDuration=7000;
  const validationMaxLength=50

  useEffect(() => {
    if (id) {
      dispatch(GetAlprDataSourceById(id))
    }
  }, [])

  useEffect(() => {
    if (id && dataSourceDataById && Object.keys(dataSourceDataById).length > 0) {
      let dataSouceMapping: HotListDataSourceMappingTemplate=dataSourceMappingInitialPayload
      try
      {
        dataSouceMapping= JSON.parse(dataSourceDataById?.schemaDefinition) as HotListDataSourceMappingTemplate
      }
      catch(error)
      {
        dataSouceMapping=dataSourceMappingInitialPayload;
      }
      
      let formData={dataSourceData:{...dataSourceDataById, confirmPassword: ''},dataSourceMappingData:dataSouceMapping}
      setdataSourceInitialData(formData)
    } 
    else if(id && dataSourceDataById===undefined)
    {
      alprToasterMessages({
        message: getErrorMessage,
        variant: 'error',
        duration: toasterDuration
      },dataSourceMsgFormRef);

    }
  }, [dataSourceDataById])

  const tabs = [
    { label: t("Data_Source"), index: 0 },
    { label: t("Data_Source_Mappings"), index: 1 }
  ];

  const onSave = (tabsFinalizeData:any) => {
    if (+id > 0) {
      let requestBody = {
        syserial: +id,
        name: tabsFinalizeData?.dataSourceData?.name,
        sourceName: tabsFinalizeData?.dataSourceData?.sourceName,
        sourceTypeName: tabsFinalizeData?.dataSourceData?.sourceType?.sourceTypeName,
        sourceTypeId: tabsFinalizeData?.dataSourceData?.sourceType?.recId,
        userId: tabsFinalizeData?.dataSourceData?.userId,
        password: tabsFinalizeData?.dataSourceData?.password,
        confirmPassword: tabsFinalizeData?.dataSourceData?.password,
        connectionType: tabsFinalizeData?.dataSourceData?.connectionType===''?'FTP':tabsFinalizeData?.dataSourceData?.connectionType,
        schedulePeriod: tabsFinalizeData?.dataSourceData?.schedulePeriod,
        locationPath: tabsFinalizeData?.dataSourceData?.locationPath,
        port: tabsFinalizeData?.dataSourceData?.port,
        lastRun: tabsFinalizeData?.dataSourceData?.lastRun,
        status: tabsFinalizeData?.dataSourceData?.status,
        statusDesc: tabsFinalizeData?.dataSourceData?.statusDesc,
        schemaDefinition: JSON.stringify(tabsFinalizeData?.dataSourceMappingData),
        sourceType: tabsFinalizeData?.dataSourceData?.sourceType,
      }
      const editUrl = datasourceServiceUrl + `/${id}`;
      dispatch(setLoaderValue({isLoading: true}));
      AlprDataSource.updateDataSource(editUrl, requestBody).then(() => {
        dispatch(setLoaderValue({isLoading: false}));
        alprToasterMessages({
          message: successMessage,
          variant: 'success',
          duration: toasterDuration
        },dataSourceMsgFormRef);
        history.push(
          urlList.filter((item: any) => item.name === urlNames.dataSourceList)[0].url
        );
      }).catch((e: any) => {
        dispatch(setLoaderValue({isLoading: false}));
        alprToasterMessages({
          message: saveErrorMessage,
          variant: 'error',
          duration: toasterDuration
        },dataSourceMsgFormRef);

      });
    } 
    else {
      let requestBody = {

        name: tabsFinalizeData?.dataSourceData?.name,
        sourceName: tabsFinalizeData?.dataSourceData?.sourceName,
        sourceTypeId: tabsFinalizeData?.dataSourceData?.sourceType?.recId,
        sourceTypeName: tabsFinalizeData?.dataSourceData?.sourceType?.sourceTypeName,
        userId: tabsFinalizeData?.dataSourceData?.userId,
        password: tabsFinalizeData?.dataSourceData?.password,
        confirmPassword: tabsFinalizeData?.dataSourceData?.password,
        connectionType: tabsFinalizeData?.dataSourceData?.connectionType===''?'FTP':tabsFinalizeData?.dataSourceData?.connectionType,
        schedulePeriod: tabsFinalizeData?.dataSourceData?.schedulePeriod,
        locationPath: tabsFinalizeData?.dataSourceData?.locationPath,
        port: +tabsFinalizeData?.dataSourceData?.port,
        statusDesc: tabsFinalizeData?.dataSourceData?.statusDesc,
      }
      const addUrl = datasourceServiceUrl;
      dispatch(setLoaderValue({isLoading: true}));
      AlprDataSource.addDataSource(addUrl, requestBody).then(() => {
        dispatch(setLoaderValue({isLoading: false}));
        history.push(
          urlList.filter((item: any) => item.name === urlNames.dataSourceList)[0].url
        );
      }).catch((e: any) => {
        dispatch(setLoaderValue({isLoading: false}));
        alprToasterMessages({
          message: saveErrorMessage,
          variant: 'error',
          duration: toasterDuration
        },dataSourceMsgFormRef);

      });
    }
    
  }

  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.dataSourceList)[0].url
    );
    setIsAlertOpen(false)
  };

  const handleChange=(event: any, newValue: number)=> {
    if (id === ':id' && newValue === 1)
    setSelectedTabvalue(0);
    else { setSelectedTabvalue(newValue); }
  }

  const closeDialog = () => {
    setIsAlertOpen(true);
  };

  const formikValidationSchema=Yup.object().shape({
    
    dataSourceData: Yup.object().shape({
      name: Yup.string().required(t("Name_field_required")).max(validationMaxLength, t("Name_char_limit")),
      
      sourceName: Yup.string().max(validationMaxLength, t("Source_Name_char_limit")),
      userId: Yup.string().max(validationMaxLength, t("User_Id_char_limit")),
      schedulePeriod: Yup.string().matches(/^[0-9]+$/,'number field required').max(10, t("Schedeul_Period_char_limit")),
      locationPath: Yup.string().max(100, t("Location_Path_char_limit")),
      port: Yup.string().matches(/^[0-9]+$/,'number_field_required'),
      password:Yup.string().max(validationMaxLength, t("Password_char_limit")).when([],
        {
          is:()=>id===undefined,
          then :Yup.string().required(t("Password_is_required")),
          otherwise:Yup.string()
      }),
      confirmPassword: Yup.string().when([],
            {
              is:()=>id===undefined,
              then :Yup.string().required(t("Confirm_Password_is_required")),
              otherwise:Yup.string().notRequired()
            })
      .test('passwords-match', t('Passwords_must_match'), function(value){
      return this.parent.password === value
    })
    }),

    dataSourceMappingData: Yup.object().shape({
        LicensePlate: Yup.string().when([],
        {
          is:()=>id!==undefined,
          then :Yup.string().required(t("License_Plate_required")),
          otherwise:Yup.string().notRequired(),
        }).max(validationMaxLength, t("License_Plate_char_limit")),

        DateOfInterest: Yup.string().when([],
        {
          is:()=>id!==undefined,
          then :Yup.string().required(t("Date_of_Interest_field_required"))
        }).max(validationMaxLength, t("Date_of_Interest_char_limit")),
      
        LicenseType: Yup.string().max(validationMaxLength, t("License_Type_char_limit")),
        AgencyId: Yup.string().max(validationMaxLength, t("Agency_char_limit")),
        State: Yup.string().max(validationMaxLength, t("State_char_limit")),
        FirstName: Yup.string().max(validationMaxLength, t("First_Name_char_limit")),
        LastName: Yup.string().max(validationMaxLength, t("Last_Name_char_limit")),
        Alias: Yup.string().max(validationMaxLength, t("Alias_char_limit")),
        Year: Yup.string().max(validationMaxLength, t("Vehicle_Year_char_limit")),
        Make: Yup.string().max(validationMaxLength, t("Vehicle_Make_char_limit")),
        Model: Yup.string().max(validationMaxLength, t("Vehicle_Model_char_limit")),
        Color: Yup.string().max(validationMaxLength, t("Vehicle_Color_char_limit")),
        Style: Yup.string().max(validationMaxLength, t("Vehicle_Style_char_limit")),
        Notes: Yup.string().max(validationMaxLength, t("Notes_char_limit")),
        NCICNumber: Yup.string().max(validationMaxLength, t("NCIC_Number_char_limit")),
        ImportSerial: Yup.string().max(validationMaxLength, t("Import_Serical_char_limit")),
        ViolationInfo: Yup.string().max(validationMaxLength, t("Violation_Info_char_limit")),
    }
    )

  })
  return (
    <div className="Alpr_DataSourceDetail_switchLeftComponents">

      <CRXToaster ref={dataSourceMsgFormRef} />
      <Formik
              enableReinitialize={true}
              initialValues={dataSourceInitialData}
              validationSchema={formikValidationSchema}
              onSubmit={(values) => {
                console.log("SUBMIT : " + values);
              }}
            >
              {({ setFieldValue, values, errors, touched,setFieldTouched,isValid,dirty}) => (
                (
                <>
                <Form>
                    <CRXTabs value={selectedTabvalue} onChange={handleChange} tabitems={tabs} stickyTab={130} />
                    <CrxTabPanel value={selectedTabvalue} index={0}>
                      <div>
                          <DataSourceDetail 
                          dataSourceTabValues={values}
                          touched={touched}
                          setFieldTouched={setFieldTouched}
                          setFieldValue={setFieldValue}
                          formValidationError={errors}
                          /> 
                      </div>
                    </CrxTabPanel>

                    <CrxTabPanel value={selectedTabvalue} index={1} >
                      <div >
                          <DataSourceMapping 
                          mappingTabValues={values} 
                          touched={touched}
                          setFieldTouched={setFieldTouched}
                          setFieldValue={setFieldValue}
                          formValidationError={errors}
                          /> 
                      </div>
                    </CrxTabPanel>
                    <div className="tab-bottom-buttons stickyFooter_Tab">
                      <div className="save-cancel-button-box">
                        <CRXButton
                          variant="contained"
                          className="Alpr_DataSource_TabButtons"
                          onClick={()=>onSave(values)}
                          disabled={!(isValid && dirty)}
                        >
                          {t("Save")}
                        </CRXButton>
                        <CRXButton
                          className="Alpr_DataSource_TabButtons secondary"
                          color="secondary"
                          variant="outlined"
                          onClick={() =>
                            history.push(
                              urlList.filter(
                                (item: any) => item.name === urlNames.dataSourceList
                              )[0].url
                            )
                          }
                        >
                          {t("Cancel")}
                        </CRXButton>
                      </div>
                      <CRXButton
                        onClick={() => closeDialog()}
                        className="Alpr_DataSource_TabButtons-Close secondary"
                        color="secondary"
                        variant="outlined"
                      >
                        {t("Close")}
                      </CRXButton>
                      
                    </div>
                    <CRXConfirmDialog
                        setIsOpen={() => setIsAlertOpen(false)}
                        onConfirm={handleClose}
                        isOpen={isAlertOpen}
                        className="AlprDataSource_Confirm"
                        primary={t("Yes_close")}
                        secondary={t("No,_do_not_close")}
                        text="hotlist datasource form"
                      >
                        <div className="confirmMessage">
                          {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" Form"}
                          <strong>{ }</strong>. {t("If_you_close_the_form")},
                          {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                          <div className="confirmMessageBottom">
                            {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                          </div>
                        </div>
                      </CRXConfirmDialog>
                </Form>
                </>
                )
              )}
            </Formik>
    </div>
  );
};

export default DataSourceFormsAndFields;
