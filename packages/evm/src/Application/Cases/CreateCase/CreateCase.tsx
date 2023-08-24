import { forwardRef, ForwardRefRenderFunction, useRef, useImperativeHandle, useEffect, useState, useMemo } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import { AutoCompleteOptionType, TCaseFormType, TCaseEditUserDetail, TCaseAsset,CASE_STATE } from "../CaseTypes";
import { CRXColumn, CRXRows, CRXMultiSelectBoxLight, CRXContainer, CRXRichTextBox } from "@cb/shared";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import './CreateCase.scss';
import { RootState } from "../../../Redux/rootReducer";
import { useSelector } from "react-redux";
import { getFormattedDateTime } from "../utils/globalFunctions";
import { CasesAgent } from "../../../utils/Api/ApiAgent";

type CreateCaseProps = {
    formInitialState?: TCaseFormType,
    statusAutoCompleteOptions: AutoCompleteOptionType[],
    caseLeadAutoCompleteOptions: AutoCompleteOptionType[],
    cadCsvAutoCompleteOptions: AutoCompleteOptionType[],
    formValues: TCaseFormType | undefined,
    isEdit: boolean,
    editDetails?: TCaseEditUserDetail,
    isViewOnly?: boolean,
    selectedAssets?: TCaseAsset[],
    updateFormValues: (values: any) => void,
    onSubmit: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void,
    validationCallback: (isInvalid: boolean) => void,
    highlightAssetByReference?: (value: string) => void
}

const caseInitialState: TCaseFormType = {
    RecId:0,
    CaseId: "",
    CMT_CAD_RecId: 0,
    CADCsv: [],
    RMSId: "",
    State: { id: 0, label: "" },
    CaseLead: { id: 0, label: "" },
    Status:  { id: 0, label: "" },
    CreationType: { id: 0, label: "" },
    DescriptionPlainText: "",
    DescriptionJson: "",
    ClosedType: { id: 0, label: "" }
};


const CreateCase: ForwardRefRenderFunction<any, CreateCaseProps> = ((props, ref) => {

    const [formInitialState, setFormInitialState] = useState<TCaseFormType>(caseInitialState);
    const [duplicateCaseId,setDuplicateCaseId]= useState<boolean>(false);

    const formikElementRef = useRef<FormikProps<TCaseFormType> | null>(null);
    const richTextBoxRef = useRef<any>(null);
    const isFirstRenderRef = useRef<boolean>(true);
    const previousCaseTitle = useRef<string>("");

    const tenantSettingsKeyValues: any = useSelector((state: RootState) => state.tenantSettingsReducer.keyValues);

    const { t } = useTranslation<string>();

    const memoizedFormValues = useMemo(() => {
      return props.formValues
    }, [props.formValues])

    useImperativeHandle(ref, () => ({
        formikElementRef: formikElementRef.current,
    }));

    useEffect(() => {
        if(props.isEdit === true && props.formInitialState) {
            setFormInitialState(props.formInitialState);
        }

    }, [props.formInitialState])

    useEffect(() => {
      if(memoizedFormValues != null && !props.isEdit) {
        if(memoizedFormValues != null && formikElementRef.current != null && typeof formikElementRef.current.setValues === "function") {
          formikElementRef.current.setTouched({CaseId: true, CaseLead: {id: true, label: true}, Status: {id: true, label: true}}, true);  
          formikElementRef.current.setValues(memoizedFormValues, true);
        }
      }
    }, [memoizedFormValues])

    useEffect(() => {
      if(!isFirstRenderRef.current && formikElementRef.current != null)
        formikElementRef.current.validateField("CaseId");
      
      },[duplicateCaseId])

    useEffect(() => {
      isFirstRenderRef.current = false;
    }, [])

   

    const caseValidationSchema = Yup.object().shape({
        CaseId: Yup.string().min(6).required("Case Id is required").when([], {
          is: () => true,
          then: Yup.string().test("caseIdValidation", t("The_title_must_begin_with_the_first_three_characters_as_alphanumeric_and_may_include_'-'_or_'_'_after_that"),
            function(value) {
                if(value?.match(/^([a-zA-Z0-9]{3})([a-zA-Z0-9-_])+$/g)) {
                    return true;
                }
              return false;
            }).test("duplicateCaseIdValidation", t("Duplicate ID. Please create a unique Case ID."),
              function() {
                return !duplicateCaseId;
              }),
        }),
        CaseLead: Yup.object().shape({
          id: Yup.number().required('Case Lead is required').min(1).positive(),
          label: Yup.string()
        }),
        Status: Yup.object().shape({
          id: Yup.number().required('Status is required').min(1).positive(),
          label: Yup.string()
        }),
      });


    const onDescriptionChange = (currentValue: string, newValue: string, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
      if(richTextBoxRef.current != null) {
        if(currentValue === props.formInitialState?.DescriptionPlainText && newValue != currentValue) {
          setFieldValue("DescriptionPlainText", newValue, true);
        }
        else if(newValue === props.formInitialState?.DescriptionPlainText) {
          setFieldValue("DescriptionPlainText", newValue, true);
        }
      }
    }

    const onFormSubmit = (values: TCaseFormType, setSubmitting: (isSubmitting: boolean) => void) => {
      if(richTextBoxRef.current != null) {
        const descriptionPlainText = richTextBoxRef.current.getContentAsPlainText();
        values.DescriptionPlainText = descriptionPlainText;
        const descriptionRawText = JSON.stringify(richTextBoxRef.current.getContentAsRaw());
        values.DescriptionJson = descriptionRawText;
      }
      props.onSubmit(values, setSubmitting);
    }

    const updateParentComponent = (values: TCaseFormType, isValid: boolean, dirty: boolean, isSubmitting: boolean ) => {
      if(!isFirstRenderRef.current) {
        props.updateFormValues(values);
        props.validationCallback(!isValid || !dirty || isSubmitting);
      }
      return null;
    }

    const checkValidCaseTitle =  (caseTitle:string, setSubmitting: (isSubmitting: boolean) => void)=> {
      if(previousCaseTitle.current  != caseTitle)
      {
        
          previousCaseTitle.current = caseTitle;
          setSubmitting(true);
          CasesAgent.getCase(`/Case/CheckValidCaseTitle?caseTitle=${caseTitle}`)
          .then(() => {      
            setSubmitting(false);
          })
          .catch((ex: any) => { 
            setSubmitting(false);
            if(ex.response != null && ex.response?.status === 409)
            {         
              setDuplicateCaseId(true); 
            }
          });
      }
    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={formInitialState}
            validationSchema={caseValidationSchema}
            onSubmit={(values, { setSubmitting }) => onFormSubmit(values, setSubmitting) }
            validateOnChange={true}
            innerRef={formikElementRef}
          >
        {({ isValid, dirty, isSubmitting, touched, errors, values, setFieldTouched, setFieldValue,setSubmitting }) => (
          (
            <>
            { updateParentComponent(values, isValid, dirty, isSubmitting) }
              <Form id="create-case-form" className={props.isEdit === true ? 'editCaseForm' : ''}>
                <div className="createCaseForm">
                  <div className="centerGeneralTab">
                    {
                      !props.isEdit ?
                        <label className="createCaseFormHeading">Case Information</label>
                      : null
                    } 
                    <CRXContainer className="createCaseContainer">
                      <CRXRows
                        className="createCaseRow"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                            className={ "createCaseCol columnLeft " +
                              `${errors.CaseId && touched.CaseId == true
                              ? "errorValidation"
                              : ""
                              }`
                            }
                            container="container"
                            item="item"
                            lg={props.isEdit === true ? 4 : 6}
                            xs={12}
                            spacing={0}
                        >
                          <div className="CBX-input">
                            <label htmlFor="caseId">
                              Case ID <span>*</span>
                            </label>
                            <div className="caseIdValidation">
                                <Field
                                  id="CaseId"
                                  key="CaseId"
                                  name="CaseId"
                                  onChange={(e: any) => {
                                    e.preventDefault();
                                    setFieldTouched("CaseId", true);
                                    setFieldValue("CaseId", e.target.value, true);
                                    setDuplicateCaseId(false); 
                                  }}
                                  disabled={props.isViewOnly === true}
                                  onBlur={(e: any) => checkValidCaseTitle(e.target.value,setSubmitting)}
                                />
                                { errors.CaseId != undefined && touched.CaseId ? (
                                <div className="caseIdError">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {errors.CaseId}
                                </div>
                                ) : null }
                            </div>
                          </div>
                        </CRXColumn>
                        
                        <CRXColumn
                          className="createCaseCol columnRight"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="CaseLead"
                            className="caseAutoComplete"
                            label= "Case Lead"
                            multiple={false}
                            error={errors.CaseLead != undefined && touched.CaseLead }
                            errorMsg={"Case Lead is required"}
                            value={ values.CaseLead != null ? values.CaseLead : null }
                            options={Array.isArray(props.caseLeadAutoCompleteOptions) ? props.caseLeadAutoCompleteOptions : []}
                            onChange={(e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("CaseLead", true);
                                setFieldValue("CaseLead", newValue, true);
                              }
                            }
                            onOpen={(e: any) => {
                              e.preventDefault();
                              setFieldTouched("CaseLead", true)
                            }}
                            CheckBox={true}
                            checkSign={false}
                            required={true}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                        {
                          props.isEdit === true ?
                          (
                            <CRXColumn
                              className="createCaseEditCol"
                              container="container"
                              item="item"
                              lg={4}
                              xs={8}
                              spacing={0}
                              aria-rowspan={2}
                            >
                              <div className={`editContentDetailContainer ${formInitialState.State.id == CASE_STATE.Closed ? 'caseClosedBy' : ''}`}>
                                {props.editDetails != null ?
                                  (
                                    <>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Created On:</div>
                                        <div className="editContentDetailItem-content">
                                          {getFormattedDateTime(props.editDetails.createdOn, tenantSettingsKeyValues ?? null)}
                                        </div>
                                      </div>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Updated On:</div>
                                        <div className="editContentDetailItem-content">
                                          {getFormattedDateTime(props.editDetails.updatedOn, tenantSettingsKeyValues ?? null)}
                                        </div>
                                      </div>
                                      <div className="editContentDetailItem">
                                        <div className="editContentDetailItem-heading">Created By:</div>
                                        <div className="editContentDetailItem-content">{props.editDetails.createdByName}</div>  
                                      </div>
                                    </>
                                  )
                                  : null
                                }
                              </div>
                              {formInitialState.State.id == CASE_STATE.Closed ?
                              <div className="closeCaseContentDetailContainer">
                                {props.editDetails != null ?
                                  (
                                    <div className="editContentDetailItem">
                                      <div className="editContentDetailItem-heading">Closed By:</div>
                                      <div className="editContentDetailItem-content">{props.editDetails.closedByName}</div>  
                                    </div>
                                  )
                                  : null
                                }
                              </div>
                              : null}
                            </CRXColumn> )
                          : null
                        }
                      </CRXRows>

                      <CRXRows
                        className={`createCaseRow ${props.isEdit === true ? '-margin20' : ''}`}
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="createCaseCol columnLeft"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="CADCsv"
                            className="caseAutoComplete"
                            label= "CAD ID"
                            multiple={true}
                            value={values.CADCsv != undefined ? values.CADCsv : null}
                            options={Array.isArray(props.cadCsvAutoCompleteOptions) ? props.cadCsvAutoCompleteOptions : []}
                            onChange={( e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("CADCsv", true);
                                setFieldValue("CADCsv", newValue, true);
                              }
                            }
                            onOpen ={() => setFieldTouched("CADCsv", true) }
                            CheckBox={true}
                            checkSign={false}
                            required={false}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                        <CRXColumn
                          className="createCaseCol columnRight"
                          container="container"
                          item="item"
                          lg={props.isEdit === true ? 4 : 6}
                          xs={12}
                          spacing={0}
                        >
                          <CRXMultiSelectBoxLight
                            id="Status"
                            className="caseAutoComplete"
                            label= "Status"
                            multiple={false}
                            error={errors.Status != undefined && touched.Status}
                            errorMsg={"Status is required"}
                            value={values.Status != undefined ? values.Status : null}
                            options={Array.isArray(props.statusAutoCompleteOptions) ? props.statusAutoCompleteOptions : []}
                            onChange={( e: any, value: AutoCompleteOptionType) =>
                              {
                                e.preventDefault();
                                let newValue = null;
                                if(value != null)
                                  newValue = Object.assign({}, value);
                                setFieldTouched("Status", true);
                                setFieldValue("Status", newValue, true);
                              }
                            }
                            onOpen ={() => setFieldTouched("Status", true) }
                            CheckBox={true}
                            checkSign={false}
                            required={true}
                            disabled={props.isViewOnly === true}
                          />
                        </CRXColumn>

                      </CRXRows>

                      <CRXRows
                        className="createCaseRow -margin0"
                        container="container"
                        spacing={0}
                      >
                        <CRXColumn
                          className="createCaseCol"
                          container="container"
                          item="item"
                          lg={12}
                          xs={12}
                          spacing={0}
                        >
                          <h6 className="MuiTypography-root label MuiTypography-subtitle1">
                            <span>Description</span>
                          </h6>
                          <div className="createCase-DraftEditor-Container">
                            <CRXRichTextBox value={values.DescriptionJson || ""} ref={richTextBoxRef} assets={props.isEdit === true ? props.selectedAssets ?? [] : []}
                              onChange={(value: string) => onDescriptionChange(values.DescriptionPlainText, value, setFieldValue) } disabled={props.isViewOnly}
                              onHashLinkChange={(value: string) => typeof props.highlightAssetByReference === "function" ?
                                props.highlightAssetByReference(value) : () => {}}/>
                          </div>
                        </CRXColumn>

                      </CRXRows>

                    </CRXContainer>
                  </div>
                </div>
            </Form>
          </>
        ))}
        </Formik>
    )
})

export default forwardRef(CreateCase);
