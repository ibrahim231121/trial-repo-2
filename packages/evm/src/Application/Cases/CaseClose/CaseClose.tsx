import React,{useState,useEffect,useRef, useContext} from 'react';
import './caseClose.scss';
import {CRXButton,CRXToaster,CRXModalDialog,CRXContainer,CRXRows,CRXColumn,CRXRadio,CRXMultiSelectBoxLight,CRXInputDatePicker,CRXSelectBox} from '@cb/shared'
import { useTranslation } from "react-i18next";
import { Formik, ErrorMessage} from 'formik';
import { AutoCompleteOptionType, TCaseClose,CASE_CLOSE_STATUS,CASE_CLOSE_TYPE,CASE_CLOSE_ACTION  } from '../CaseTypes';
import { useDispatch, useSelector } from 'react-redux';
import { getCaseClosedReason} from "../../../Redux/CaseClosedReasonReducer";
import { RootState } from '../../../Redux/rootReducer';
import moment from "moment";
import * as Yup from 'yup';
import { CasesAgent } from '../../../utils/Api/ApiAgent';
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
type CaseCloseProps = {
    id : string,
    handleModal: (isRefresh:boolean) => void,
    caseId : string
}
const caseCloseInitialState :  TCaseClose = {
    id : 0,
    caseId : 0,
    caseClosedReasonId:  { id: 0, label: "" },
    closingType : CASE_CLOSE_TYPE.CloseAndReleaseAssets.toString(),
    closingAction : CASE_CLOSE_ACTION.Immediate.toString(),
    closingRequestDate : "",
    remarks : "",
    status : CASE_CLOSE_STATUS.Pending.toString()
}

const CaseClose: React.FC<CaseCloseProps> = (props:CaseCloseProps) => {
    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
    const [caseClosePayload,setCaseClosePayload]= useState<TCaseClose>(caseCloseInitialState);
    const caseClosedReasonList: any = useSelector((state: RootState) => state.caseClosedReasonSlice.caseClosedReasonSlice);
    const [caseClosedReasonOptions, setcaseClosedReasonAOptions] = useState<AutoCompleteOptionType[]>([]);
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const toasterRef = useRef<typeof CRXToaster>(null);
    const [id,setId] = useState<any>(!isNaN(parseInt(props?.id)) ? parseInt(props?.id) : 0);
    const isFirstRenderRef = useRef<boolean>(true);
    const caseCloseReasonsOptionsRef = useRef<AutoCompleteOptionType[]>([]);
    const { getModuleIds } = useContext(ApplicationPermissionContext);
    const isApprovalMode = useRef<boolean>(false); 

    const closeOptionByRadioOption = [
        {
          value: "1", label: `${t("Close_and_Release_Assets(Follows_original_Retention)")}`, Comp: () => { }
        },
        {
          value: "2", label: `${t("Close_and_Expire_Assets(Keep_Assets_metadata)")}`, Comp: () => { }
        }
    ];

    const closeDateByRadioOption = [
        {
          value: "1", label: `${t("Immediate")}`, Comp: () => { }
        },
        {
          value: "2", label: `${t("Future")}`, Comp: () => { }
        }
    ];
    const handleClose = (isRefresh: boolean) => {
        props.handleModal(isRefresh);
    }

    const caseClosMessages: any = (obj: any) => {
        toasterRef?.current?.showToaster({
            message: obj.message,
            variant: obj.variant,
            duration: obj.duration,
            clearButtton: true,
        });
    };

    const onMessageShow = (isSuccess: boolean, message: string) => {
        caseClosMessages({
            message: message,
            variant: isSuccess ? "success" : "error",
            duration: 7000,
        });
    };
    useEffect(() => {
        if(id > 0) {
            
            caseCloseUpdate(id)            
        }
    },[])

    useEffect (() => {
        caseCloseReasonsOptionsRef.current = caseClosedReasonOptions;
        if (!isFirstRenderRef.current) {
            fillCaseCloseReasonAutoComplete(caseClosePayload);
        }
    },[caseClosedReasonOptions])

    const caseCloseUpdate = (id:number) => {
        CasesAgent.getCaseClose(`/Case/${props.caseId}/CaseClosed/${id}`)
        .then((res :any) => {
            const caseCloseResponse = {...caseCloseInitialState}
            caseCloseResponse.id = res.id;
            caseCloseResponse.caseId = res.caseId;
            caseCloseResponse.closingAction = res.closingAction.toString();
            caseCloseResponse.closingType = res.closingType.toString();
            caseCloseResponse.closingRequestDate = isValidDate(res.closingRequestDate);
            caseCloseResponse.caseClosedReasonId = {...caseCloseResponse.caseClosedReasonId, id : res.caseClosedReasonId}
            caseCloseResponse.remarks = res.remarks;
            caseCloseResponse.status = res.status;
            isApprovalMode.current = false;
            if(caseCloseResponse.closingType == CASE_CLOSE_TYPE.CloseAndExpireAssets.toString()  && getModuleIds().includes(84) === true && caseCloseResponse.status == CASE_CLOSE_STATUS.Pending.toString() )
            {
                isApprovalMode.current = true;
            }
            fillCaseCloseReasonAutoComplete(caseCloseResponse);
           
        }).catch((e:any) => {
            console.error(e)
        })
    }

    const fillCaseCloseReasonAutoComplete = (caseClosePayload: TCaseClose) => {
        const caseClosePayloadCopy = {...caseClosePayload}
        if(Array.isArray(caseCloseReasonsOptionsRef.current) && caseCloseReasonsOptionsRef.current.length > 0 && caseClosePayloadCopy.caseClosedReasonId != null) {
            let closeReason = caseCloseReasonsOptionsRef.current.find((x:any) => x.id == caseClosePayload.caseClosedReasonId.id);
            if(closeReason != null) {
                caseClosePayloadCopy.caseClosedReasonId = closeReason;
            }
        }
        setCaseClosePayload(caseClosePayloadCopy);
    }
    useEffect(() => {
        if(caseClosedReasonList && Array.isArray(caseClosedReasonList) ) {
          const formatedcaseClosedReasonList = caseClosedReasonList.map((x: any) => ({
              id: parseInt(x.id),
              label: x.name
          }));
          setcaseClosedReasonAOptions(Array.isArray(formatedcaseClosedReasonList) ? formatedcaseClosedReasonList : []);
        }
      }, [caseClosedReasonList])

    useEffect (() => {
        isFirstRenderRef.current = false;
        dispatch(getCaseClosedReason());
    },[])

    const isValidDate = (val: string) => {
        if (typeof val === "string") {
            let formattedDate = new Date(val);
            let date = moment(formattedDate).format("YYYY-MM-DD").toString();
            let time = moment(formattedDate).format("HH:mm").toString();
            var dateTime = date+'T'+time
            return dateTime;
        }
        return ""
    }

    const minDate = () => {
        var now = new Date();
        let date = moment(now).format("YYYY-MM-DD").toString();
        let time = moment(now).format("HH:mm").toString();
        var dateTime = date+'T'+time
        return dateTime;
    }

    const CaseCloseValidationSchema = Yup.object().shape({
        nowDate: Yup.date().default(() => new Date()),
        closingRequestDate: Yup.date()                                                                        
            .when('closingAction', {                                                   
            is: (closingAction:any) => closingAction === CASE_CLOSE_ACTION.Future,   
            then : Yup.date().typeError('Date should be slect from CurrentDate & Time').required('Date is required')
                .when('nowDate',
                (nowDate,Yup) => nowDate && Yup.min(minDate(), 'Date should be select from current Date & Time')),
            otherwise: Yup.date()                                                  
            }), 
        caseClosedReasonId: Yup.object().shape({
            id: Yup.number().min(1,'Reason is Required').required('Reason is Required'),
            label: Yup.string()
        }),
        closingType:Yup.number().required('Closing Option is required').min(1,'Closing Option is required'),
        closingAction:Yup.number().required('Closing Date is required').min(1,'Closing Date is required'),
    },
    [["closingAction", "closingRequestDate"]])

    const onSubmitData = (closeStatus : string,values : TCaseClose, setSubmitting: any) => {
        const body = {
            id : 0,
            caseId : Number(props.caseId),
            caseClosedReasonId : Number(values.caseClosedReasonId.id),
            closingType : values.closingType,
            closingAction : values.closingAction,
            closingRequestDate : values.closingAction == CASE_CLOSE_ACTION.Immediate.toString()  ? "" : new Date(values.closingRequestDate).toUTCString(),
            remarks : "",
            status : closeStatus.length > 0 ? closeStatus : values.status

        };
        let addUrl = `Case/${props.caseId}/CaseClosed`
        if(id > 0) {
            setSubmitting(true)
            let editUrl = `Case/${props.caseId}/CaseClosed/${id}`
            CasesAgent.editCaseClose(editUrl,body).then((res:any) => {
                onMessageShow(true, t("Case_Close_Update_Successfully"));
                
                handleClose(true);
                
            }).catch((e:any) => {
                setSubmitting(false)
                onMessageShow(false, e.response.data = '' ? e.response.data.toString()  :  t("Something_went_wrong"));
                console.error(e);
            })
        } else {
            setSubmitting(true)
            CasesAgent.addCaseClose(addUrl,body).then((res:any) => {
                onMessageShow(true, t("Case_Close_Saved_Successfully"));
                
                handleClose(true);
                
            })
            .catch((e:any) => {
                setSubmitting(false)
                onMessageShow(false, e.response.data = '' ? e.response.data.toString()  :  t("Something_went_wrong"));
                console.error(e);
            })
        }
    }

    const closeDateHandler = (value:string, values:any,setValues:any) => {
        if (value === "1"){
            const valuesCopy = Object.assign({}, values);
            valuesCopy.closingAction = value;
            setValues(valuesCopy, true)
        } else {
            const valuesCopy = Object.assign({}, values);
            if(values.closingRequestDate === "") {
                valuesCopy.closingRequestDate = "";
            }
            valuesCopy.closingAction = value;
            setValues(valuesCopy,true);
        }
    }

    return (
        <>
            <CRXToaster ref={toasterRef} className="caseCloseToaster" />
            <Formik
                initialValues={caseClosePayload}
                enableReinitialize={true}
                validateOnChange={true}
                validationSchema={CaseCloseValidationSchema}
                onSubmit={(values) => {
                    console.log("Submit : " + values)
                }}
            >
                {({
                    setFieldValue,
                    values,
                    errors,
                    touched,
                    dirty,
                    isValid,
                    setFieldTouched,
                    isSubmitting,
                    setSubmitting,
                    setValues,
                }) => (
                    <div className='modalCaseClose'>
                        <CRXModalDialog
                            maxWidth="gl"
                            title={t("Close_Case")}
                            modelOpen={true}
                            className='main-caseClose'
                            showSticky={true}
                            loseWithConfirm={closeWithConfirm}
                            defaultButton={false}
                            subTitleText="required"
                            onClose = {() => handleClose(false)}
                    >
                            <CRXContainer className='createCaseClose'>
                                <CRXRows container="container" spacing={0} className="createCaseCloseRow">
                                    <CRXColumn
                                        className="caseCloseHeadingCol"
                                        container="container"
                                        lg={2}
                                        xs={4}
                                        spacing={0}
                                    >
                                        <label className="labelUi">
                                            {t("Close_Option")} <span style={{color: '#aa1d1d'}}>*</span>
                                        </label>
                                    </CRXColumn>
                                    <CRXColumn
                                        className="caseCloseHeadingCol"
                                        container="container"
                                        lg={1}
                                        xs={1}
                                        spacing={0}
                                    />
                                    <CRXColumn
                                        container="container"
                                        item="item"
                                        lg={8}
                                        xs={6}
                                        spacing={0}>
                                        <CRXRadio
                                            className='closeOptionRadioBtn'
                                            disableRipple={true}
                                            content={closeOptionByRadioOption}
                                            value = {values.closingType}
                                            setValue = {(value: string) => setFieldValue('closingType',value) }
                                        />
                                    </CRXColumn>
                                </CRXRows>
                                <CRXRows container="container" spacing={0} className="createCaseCloseRow">
                                    <CRXColumn
                                        className="caseCloseHeadingCol"
                                        container="container"
                                        item="item"
                                        lg={2}
                                        xs={4}
                                        spacing={0}
                                    >
                                        <label className="labelUi">
                                            {t("Reason")} <span>*</span>
                                        </label>
                                    </CRXColumn>
                                    <CRXColumn
                                        className="caseCloseHeadingCol"
                                        container="container"
                                        lg={1}
                                        xs={1}
                                        spacing={0}
                                    />
                                    <CRXColumn
                                        container="container"
                                        item="item"
                                        lg={4}
                                        xs={4}
                                        spacing={0}
                                    >
                                        <CRXMultiSelectBoxLight
                                            id="caseClosedReasonId"
                                            className="caseCloseAutoComplete"
                                            value = {values.caseClosedReasonId != undefined ? values.caseClosedReasonId : null}
                                            multiple={false}
                                            options={Array.isArray(caseClosedReasonOptions) ? caseClosedReasonOptions : []}
                                            CheckBox={true}
                                            checkSign={false}
                                            required={true}
                                            onChange={( e: any, value: AutoCompleteOptionType) =>
                                                {
                                                    e.preventDefault();
                                                    let newValue = null;
                                                    if(value != null)
                                                    newValue = Object.assign({}, value);
                                                    if(newValue == null)
                                                    {
                                                        newValue = {id: 0, label: ""}
                                                    }
                                                    setFieldTouched("caseClosedReasonId", true);
                                                    setFieldValue("caseClosedReasonId", newValue, true);
                                                }
                                              }
                                              
                                            disableCloseOnSelect = {true}
                                            onOpen = {(e:any) => {
                                                setFieldTouched('caseClosedReasonId',true)
                                            }}
                                            error={errors.caseClosedReasonId?.id != undefined  && touched.caseClosedReasonId}
                                            errorMsg={"Reason is required"}
                                        />
                                    </CRXColumn>
                                </CRXRows>
                                <CRXRows container="container" spacing={0} className="createCaseCloseRow">
                                    <CRXColumn 
                                        className="caseCloseDateHeadingCol"
                                        container="container"
                                        item="item"
                                        lg={2}
                                        xs={4}
                                        spacing={0}
                                    >
                                        <label className="labelUi">
                                            {t("Close_Date")} <span>*</span>
                                        </label>
                                    </CRXColumn>
                                    <CRXColumn
                                        className="caseCloseHeadingCol"
                                        container="container"
                                        lg={1}
                                        xs={1}
                                        spacing={0}
                                    />
                                    <CRXColumn
                                        className=""
                                        container="container"
                                        item="item"
                                        lg={2}
                                        xs={3}
                                        spacing={0}
                                    >
                                        <CRXRadio
                                            className='caseCloseRadioBtn'
                                            value = {values.closingAction}
                                            disableRipple={true}
                                            content={closeDateByRadioOption}
                                            setValue={(value:any) => closeDateHandler(value,values,setValues)}
                                        />
                                    </CRXColumn>
                                    {values.closingAction == CASE_CLOSE_ACTION.Future.toString() &&
                                        <CRXColumn
                                            className='caseCloseDateTimeHeadingCol'
                                            container="container"
                                            item="item"
                                            lg={5}
                                            xs={5}
                                            spacing={0}
                                    >
                                            <CRXInputDatePicker
                                                className={
                                                `DateTimeUi` +
                                                ` ${errors.closingRequestDate && touched.closingRequestDate == true
                                                    ? "errorBrdr"
                                                    : ""
                                                }`
                                                }
                                                value ={values.closingRequestDate}
                                                type='datetime-local'
                                                onChange={(e: any) => {
                                                    setFieldTouched("closingRequestDate", true)
                                                    setFieldValue("closingRequestDate", String(e.target.value), true)
                                                }}
                                                minDate={minDate()}
                                                disabled = {!(values.closingAction == CASE_CLOSE_ACTION.Future.toString())}
                                            />
                                            <ErrorMessage name='closingRequestDate' render={(msg) => <div className='errorStyle'><i className="fas fa-exclamation-circle"></i>{msg}</div>} />
                                        </CRXColumn>
                                    }
                                </CRXRows>
                                
                                <CRXRows container="container" spacing={0} className="createCaseCloseBtnRow">
                                    <CRXColumn 
                                        className={isApprovalMode.current === true? "caseCloseBtnCol rejectBtn" : "caseCloseBtnCol"}
                                        container="container"
                                        item="item"
                                        lg={6}
                                        xs={12}
                                        spacing={0}>  
                                          
                                        <CRXButton 
                                            className="primary"
                                            color="contained"
                                            variant="outlined"                                        
                                            onClick={() => onSubmitData(isApprovalMode.current === true? CASE_CLOSE_STATUS.Approved.toString():CASE_CLOSE_STATUS.Pending.toString(), values,setSubmitting)}
                                            disabled = {(!isValid || (isApprovalMode.current === true || values.status ==  CASE_CLOSE_STATUS.Reject.toString() ? false : !dirty) || isSubmitting) }
                                        >
                                            {isApprovalMode.current === true ?  t('Approve') : values.closingType == CASE_CLOSE_TYPE.CloseAndExpireAssets.toString() && getModuleIds().includes(84) === false ? t('Request_To_Close_Case') : t('Close_Case')} 
                                        </CRXButton>
                                        {isApprovalMode.current === true  && 
                                            <CRXButton 
                                                className="secondary"
                                                color="contained"
                                                variant="outlined"
                                                onClick={() => onSubmitData(isApprovalMode.current === true? CASE_CLOSE_STATUS.Reject.toString():values.status,values,setSubmitting)}
                                                disabled = {(!isValid || (isApprovalMode.current === true ? false : !dirty) || isSubmitting) }
                                            >
                                                 {t('Reject')}
                                            </CRXButton>
                                        }
                                        <CRXButton
                                            className="secondary"
                                            color="secondary"
                                            variant="outlined"
                                            onClick={handleClose}
                                        >
                                            {t('Cancel')}
                                        </CRXButton>
                                    </CRXColumn>
                                </CRXRows>
                            </CRXContainer>
                        </CRXModalDialog>
                    </div> 
                )}
            </Formik>
        </>
    )
}

export default CaseClose;