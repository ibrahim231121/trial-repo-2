import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import './caseDetail.scss';
import * as Yup from "yup";
import moment from "moment";
import { Formik, Form, Field } from "formik";
import { AutoCompleteOptionType, CaseFormType, Case } from "../CaseTypes";
import { NotificationMessage } from  '../../Header/CRXNotifications/notificationsTypes';
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { CasesAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
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
  CRXToaster,
  TextField
} from "@cb/shared";
import { validate } from "uuid";



const CasesDetail: React.FC = () => {
  const { t } = useTranslation<string>();
  const history = useHistory();
  const dispatch = useDispatch();

  const caseInitialState: CaseFormType = {
    RecId:0,
    Title: "",
    CMT_CAD_RecId: 0,
    CADCsv: "CADCsv",
    RMSId: "RMSId",
    State: {
      id: 0,
      label: ""
    },
    Status:  {
      id: 0,
      label: ""
    },
    CreationType: {
      id: 0,
      label: ""
    },
    DescriptionPlainText: "",
    DescriptionJson: "",
    ClosedType: {
      id: 0,
      label: ""
    }
   };
  
   const [casePayload, setCasePayload] =  useState<CaseFormType>(caseInitialState);
   const { id }  = useParams<{ id: string }>();
   const caseId = parseInt(id);

   const [stateTouched, setStateTouched] =  useState<number>(0);
   const [statesAutoCompleteOptions, setStatesAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
   const [statesAutoCompleteValue, setStatesAutoCompleteValue] =  useState<AutoCompleteOptionType | null>(null);

   const [statusTouched, setStatusTouched] =  useState<number>(0);
   const [statusAutoCompleteOptions, setStatusAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
   const [statusAutoCompleteValue, setStatusAutoCompleteValue] =  useState<AutoCompleteOptionType | null>(null);

   const [creationTypeTouched, setCreationTypeTouched] =  useState<number>(0);
   const [creationTypesAutoCompleteOptions, setCreationTypesAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
   const [creationTypesAutoCompleteValue, setCreationTypesAutoCompleteValue] =  useState<AutoCompleteOptionType | null>(null);

   const [closedTypesCompleteOptions, setClosedTypesAutoCompleteOptions] =  useState<AutoCompleteOptionType[]>([]);
   const [closedTypesCompleteValue, setClosedTypesAutoCompleteValue] =  useState<AutoCompleteOptionType | null>(null);

   const [isUpdate, setIsUpdate] = useState<boolean>(false);
   const [error, setError] =  useState<boolean>(false);
   const [errorResponseMessage, setErrorResponseMessage] =  useState<string>(
    t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
  );
   const toasterRef = useRef<typeof CRXToaster>(null);


   //useEffects
   useEffect(()=>{
    if(caseId > 0 ){
      getTheCaseForUpdate(caseId);
    }
  },[id]);

   useEffect (()=>{
    fillCaseAutoCompletes();
   },[casePayload,statesAutoCompleteOptions,statusAutoCompleteOptions,creationTypesAutoCompleteOptions,closedTypesCompleteOptions]);

    useEffect(()  =>{
      console.log("Status",statusAutoCompleteValue);

      async function fetchAllDropDownsData() {
        await CasesAgent.getCaseStates('/Case/GetAllDropDownValues')
        .then((response: any) => {
          console.log("GetAllDropDownValues",response)
          setStatesAutoCompleteOptions(remapArrayToAutoCompleteOptionType(response.caseStates));
          setStatusAutoCompleteOptions(remapArrayToAutoCompleteOptionType(response.caseStatus));
          setCreationTypesAutoCompleteOptions(remapArrayToAutoCompleteOptionType(response.caseCreationType));
          setClosedTypesAutoCompleteOptions(remapArrayToAutoCompleteOptionType(response.caseClosedType));
        })
        .catch(() => {});
      }
      fetchAllDropDownsData();
    }, []);
   
   //methods
   const getTheCaseForUpdate=(caseId:number)=>{
    CasesAgent.getCase(`/Case/${caseId}`)
    .then((Case: any) => {
      console.log("success response",Case);
      caseInitialState.Title = Case.title;
      caseInitialState.RecId= Case.id;
      caseInitialState.CMT_CAD_RecId = Case.CMT_CAD_RecId;
      caseInitialState.CADCsv = Case.cadCsv;
      caseInitialState.RMSId = Case.rmsId;
      caseInitialState.State = {
        id : (Case.stateId),
      };
      caseInitialState.Status =  {
        id :(Case.status),
      };
      caseInitialState.CreationType = {
        id : (Case.creationType),
      };
      caseInitialState.DescriptionPlainText = Case.description.plainText;
      caseInitialState.DescriptionJson = "";
      caseInitialState.ClosedType = {
        id: (Case.closedType),
      };
      setCasePayload(caseInitialState);
    })
  }
  const fillCaseAutoCompletes = () => {
    if (casePayload.Title !== "") {
      if (statesAutoCompleteOptions.length > 0) {
        let stateAutoComplete = statesAutoCompleteOptions.filter((x: any) => x.id == casePayload.State?.id)[0];
        setStatesAutoCompleteValue(stateAutoComplete);
      }
      if (statusAutoCompleteOptions.length > 0) {
        let statusAutoComplete = statusAutoCompleteOptions.filter((x: any) => x.id == casePayload.Status?.id)[0];
        setStatusAutoCompleteValue(statusAutoComplete);
      }
      if (creationTypesAutoCompleteOptions.length > 0) {
        let creationTypesAutoComplete = creationTypesAutoCompleteOptions.filter(x => x.id == casePayload.CreationType?.id)[0];
        setCreationTypesAutoCompleteValue(creationTypesAutoComplete);
      }
      if (closedTypesCompleteOptions.length > 0) {
        let closedTypesAutoComplete = closedTypesCompleteOptions.filter(x => x.id == casePayload.ClosedType?.id)[0];
        setClosedTypesAutoCompleteValue(closedTypesAutoComplete);
      }
    }
  }
    
   const caseValidationSchema = Yup.object().shape({
    Title: Yup.string().required("Title is required"),
    State: Yup.object().shape({
      id: Yup.number().min(1).required('State is required'),
      label: Yup.string()
    }),
    Status: Yup.object().shape({
      id: Yup.number().min(1).required('Status is required'),
      label: Yup.string()
    }),
    CreationType:  Yup.object().shape({
      id: Yup.number().min(1).required('Creation Type is required'),
      label: Yup.string()
    })
  });
  const remapArrayToAutoCompleteOptionType = (arr: Array<any>): Array<AutoCompleteOptionType> => {
    let autoCompleteArray: any = [];
    if (arr.length > 0) {
      for (const elem of arr) {
        autoCompleteArray.push({
          id: elem.id,
          label: elem.label,
        });
      }
      autoCompleteArray = autoCompleteArray.sort((a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
    }
    return autoCompleteArray;
  };
  const navigateToCases = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.cases)[0].url
    );
  };
 
  const CreateCase=(caseBody:any)=>{
    CasesAgent.addCase('/Case',caseBody).then((response: number) => {

      console.log("success response",response)
      showToastMsg(t("You_have_saved_the_Case_successfully"),"success");
      setTimeout(() => navigateToCases(), 3000);
    })
      .catch((e: any) => {
         setError(true);
         setErrorResponseMessage(e.response.data);
         showToastMsg( e.response.data,"error");

        console.log("error", e.response.data)
        console.error(e);
      });
  }
  const updateCase=(caseBody:any)=>{
    CasesAgent.editCase(`/Case/${caseId}`,caseBody).then((response: number) => {

      console.log("success response from update",response)
      showToastMsg(t("You_have_updated_the_Case_successfully"),"success");
      setTimeout(() => navigateToCases(), 3000);
    })
      .catch((e: any) => {
         setError(true);
         setErrorResponseMessage(e.response.data);
         showToastMsg( e.response.data,"error");

        console.log("error", e.response.data)
        console.error(e);
      });
  }
  const onSubmit= (values: any) => {
    console.log("submitFrom function", values)
    let caseBody: Case = { 
      RecId:0,
      Title:values.Title,
      CMT_CAD_RecId:0,
      CADCsv: "CADCsv",
      RMSId:"RMSId",
      StateId: values.State.id,
      Status: values.Status.id,
      CreationType: values.CreationType.id,
      ClosedType: values.ClosedType.id,
      Description:{
        Formatted:  values.DescriptionPlainText, //ask kareem bhai 
        PlainText: values.DescriptionPlainText
      },
      CreatedBy: parseInt(localStorage.getItem('User Id') ?? "0"),
    }
    console.log("caseBody", caseBody);
    
    if(caseId > 0 ){
     updateCase(caseBody);
    }
    else{
      CreateCase(caseBody)
    }
  }
  const showToastMsg = (message: string, variant: string) => {
    toasterRef.current.showToaster({
      message: (message),
      variant: variant,
      duration: 4000,
      clearButtton: true,
    });

    let notificationMessage: NotificationMessage = {
      title: t("Case_Detail"),
      message: t("You_have_saved_the_Case_successfully"),
      type: "success",
      date: moment(moment().toDate())
        .local()
        .format("YYYY / MM / DD HH:mm:ss"),
    };
    dispatch(addNotificationMessages(notificationMessage));
  };

   return (
      <>
       <CRXToaster ref={toasterRef} className="assetsBucketToster" />
        <Formik
        enableReinitialize={true}
        initialValues={casePayload}
        validationSchema={caseValidationSchema}
        onSubmit={(values) => {
          console.log("SUBMIT : " + values);
          onSubmit(values)
        }}
        validateOnChange={true}
        >
      {props => (
        (
          <>
            <Form>
            <div className="CaseSettingsUpdate  switchLeftComponents">
              <div className="centerGeneralTab">
                <div className="itemIndicator">
                  <label className="indicates-label"><b>*</b> Indicates required field</label>
                </div>
                <CRXRows 
                  className="crxCaseDetail"
                  container="container"
                  spacing={0}
                  >
                  <CRXColumn
                    className="CaseDetailCol"
                    container="container"
                    item="item"
                    lg={6}
                    xs={6}
                    spacing={0}
                  >
                  <label></label>
                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="title">
                                Title<span>*</span>
                        </label>
                        <Field
                            id="title"
                            key="title"
                            name="Title"
                          />
                    </div>
                    {props.errors.Title !== undefined &&
                        props.touched.Title ? (
                          <div className="errorTenantStyle">
                            <i className="fas fa-exclamation-circle"></i>
                            {props.errors.Title}
                          </div>
                        ) : (
                          <></>
                        )}
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={-2}
                      >
                    <div className="CBX-input">
                        <label htmlFor="cMT_CAD_RecId">
                        CMT_CAD 
                        </label>
                        <Field
                            id="cMT_CAD_RecId"
                            key="cMT_CAD_RecId"
                            name="CMT_CAD_RecId"
                            readOnly={true}
                          />
                    </div>
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="cADCsv">
                        CAD Csv 
                        </label>
                        <Field
                            id="cADCsv"
                            key="cADCsv"
                            name="CADCsv"
                            readOnly={true}
                          />
                    </div>
                  </CRXColumn>
                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="rMSId">
                        RMS Id
                        </label>
                        <Field
                            id="rMSId"
                            key="rMSId"
                            name="RMSId"
                            readOnly={true}
                          />
                    </div>
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                   <CRXMultiSelectBoxLight
                              id="State"
                              className="getStationField"
                              label= "State"
                              multiple={false}
                              error={stateTouched == 1}
                              errorMsg={"State is required"}
                              value={statesAutoCompleteValue || ''}
                              options={statesAutoCompleteOptions}//.length > 0 && statesAutoCompleteOptions}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) =>
                              {
                                props.setFieldValue("State", value, true);
                                setStateTouched(value === null ? 1 : 0)
                                setStatesAutoCompleteValue(value === null ? null : value);
                              }
                              }
                              onBlur ={() =>
                                {
                                  setStateTouched(statesAutoCompleteValue == (null || undefined) ? 1 : 0)
                                }}
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                            />
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                    <CRXMultiSelectBoxLight
                            id="Status"
                            className=""
                            label= "Status"
                            multiple={false}
                            error={statusTouched==1}
                            errorMsg={"Status is required"}
                            value={statusAutoCompleteValue || ''}
                            options={statusAutoCompleteOptions}//.length > 0 && statusAutoCompleteOptions}
                            onChange={(
                              e: any,
                              value: AutoCompleteOptionType,
                              reason: string
                            ) =>
                            {
                              props.setFieldValue("Status", value, true);
                              setStatusTouched(value === null ? 1 : 0)
                              setStatusAutoCompleteValue(value === null ? null : value);
                            }
                            }
                            onBlur ={() =>
                            {
                              setStatusTouched(statusAutoCompleteValue == (null || undefined) ? 1 : 0)
                            }}
                            CheckBox={true}
                            checkSign={false}
                            required={true}
                          />
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                     <CRXMultiSelectBoxLight
                              id="CreationType"
                              className=""
                              label= "Creation Type"
                              multiple={false}
                              error={creationTypeTouched ==1}
                             // error={touched.CreationType===false}
                              errorMsg={"Creation Type is required"}
                              value={creationTypesAutoCompleteValue || ''}
                              options={creationTypesAutoCompleteOptions}//.length > 0 && creationTypesAutoCompleteOptions}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) =>
                              {
                                props.setFieldValue("CreationType", value, true);
                                setCreationTypeTouched(value === null ? 1 : 0)
                                setCreationTypesAutoCompleteValue(value === null ? null : value);
                              }
                              }
                              onBlur ={() =>
                              {
                                setCreationTypeTouched(creationTypesAutoCompleteValue == (null || undefined) ? 1 : 0)
                              }}
                              CheckBox={true}
                              checkSign={false}
                              required={true}
                            />  
                  </CRXColumn>

                  <CRXColumn
                      className="CaseDetailCol"
                      container="container"
                      item="item"
                      lg={12}
                      xs={12}
                      spacing={0}
                    >
                      <CRXMultiSelectBoxLight
                              id="ClosedType"
                              className=""
                              label= "Closed Type"
                              multiple={false}
                              errorMsg={"Closed Type is required"}
                              value={closedTypesCompleteValue || ''}
                              options={closedTypesCompleteOptions}//.length > 0 && closedTypesCompleteOptions}
                              onChange={(
                                e: any,
                                value: AutoCompleteOptionType,
                                reason: string
                              ) =>
                              {
                                props.setFieldValue("ClosedType", value, true);
                                setClosedTypesAutoCompleteValue(value === null ? null : value);
                              }
                              }                             
                              CheckBox={true}
                              checkSign={false}
                              required={false}
                            />
                  </CRXColumn>

                  <CRXColumn
                        className="CaseDetailCol"
                        container="container"
                        item="item"
                        lg={12}
                        xs={12}
                        spacing={0}
                      >
                    <div className="CBX-input">
                        <label htmlFor="descriptionPlainText">
                        Description 
                        </label>
                        <TextField
                            id="descriptionPlainText"
                            key="descriptionPlainText"
                            name="DescriptionPlainText"

                            required={false}
                            value={props.values.DescriptionPlainText || ''}
                            className="retention-policies-input"
                            onChange={(e: any) =>  props.setFieldValue("DescriptionPlainText", e.target.value, true)}
                            disabled = {false}
                            type="text"
                            regex=""
                            
                          />
                    </div>
                  </CRXColumn>

                
                  </CRXColumn>

                  
                </CRXRows>

                <CRXButton 
                    type="submit"
                    disabled={!props.isValid || !props.dirty}
                    variant="contained"
                    className="groupInfoTabButtons"
                  >
                  {t("Save")}
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={navigateToCases}
                  >
                  {t("Cancel")}
                </CRXButton>
              </div>
            </div>
            </Form>
        </>
      ))}
      </Formik>
    </>
  );
}

export default CasesDetail;