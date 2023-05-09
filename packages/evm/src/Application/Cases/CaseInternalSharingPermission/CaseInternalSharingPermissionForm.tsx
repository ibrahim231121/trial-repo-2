import React, {useEffect, useState, useRef} from 'react';

import { useTranslation } from "react-i18next";
import './CaseInternalSharingPermission.scss';
import {Formik,ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import {
    CRXModalDialog,
    CRXButton,
    CRXCheckBox,
    CRXToaster,
    CRXInputDatePicker,
    CRXMultiSelectBoxLight,
    CRXRadio,
    CRXContainer,
    CRXColumn
  } from "@cb/shared";
import {TCaseSharing,AutoCompleteOptionType, ESharingStatus, ESharingType,TCaseInternalSharingPermission} from './CaseInternalSharingPermissionTypes';
import {CasesAgent } from '../../../utils/Api/ApiAgent';
import { RootState } from '../../../Redux/rootReducer';

type FormCaseInternalSharingPermissionProps = {
    id: number;
    title: string;
    openModel: React.Dispatch<React.SetStateAction<any>>;
    formValues? : any
}

const caseInternalSharingPermissionInitialState: TCaseInternalSharingPermission = {
    id: '',
    caseSharingId : 0,
    userId: [{id : 0, label : ''}],
    groupId: [{id : 0, label : ''}],
}

const caseSharingIntialState: any = {
    id:"0",
    caseId: 0,
    requestTrackId: 0,
    userId: 0,
    startTime : '',
    endTime: '',
    allowAssetsViewing: true,
    allowAssetsPlaying : false,
    allowAssetsDownloading: false,
    contribute: false,
    isHighlight: false,
    endTimeInfinite: false,
    caseInternalSharingPermission : caseInternalSharingPermissionInitialState,
}

const CaseInternalSharingPermissionForm: React.FC<FormCaseInternalSharingPermissionProps> = (
    props: FormCaseInternalSharingPermissionProps
) => {
    const [openModal, setOpenModal] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [id, setId] = useState<number>(props?.id);
    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
    const toasterRef = useRef<typeof CRXToaster>(null);
    const dispatch = useDispatch();

    const userList: any = useSelector((state : RootState) => state.userReducer.usersInfo);
    const groupList: any = useSelector((state : RootState) => state.groupReducer.groups);

    const caseSharingList: any = useSelector((state : RootState) => state.caseSharingSlice.getAllCaseSharing);

    const [usersAutoCompleteOptions, setUsersAutoCompleteOptions] = useState<AutoCompleteOptionType[]>([]);
    const [groupAutoCompleteOptions, setGroupAutoCompleteOptions] = useState<AutoCompleteOptionType[]>([]);

    const userAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
    const groupAutoCompleteOptionsRef = useRef<AutoCompleteOptionType[]>([]);
    const isFirstRenderRef = useRef<boolean>(true);
    const internalSharingOriginalRef = useRef<any>(null);

    const { t } = useTranslation<string>();

    const [CaseSharingPayload, setCaseSharingPayload] = useState<TCaseSharing>(caseSharingIntialState)

    let indefiniteValue = "9999-03-16T18:23";

    useEffect(() => {
        if(!isFirstRenderRef.current && userList && Array.isArray(userList.data)){
            const formatedUserList = userList.data.filter((x: any) => parseInt(x.recId) !== props?.formValues?.userId).map((item:any) => ({
                id: parseInt(item.recId),
                label: item.fName + ' ' + item.lName
            }));
            setUsersAutoCompleteOptions(Array.isArray(formatedUserList) ? formatedUserList : []);
        }
    },[userList])

    useEffect(() => {
        if(!isFirstRenderRef.current && groupList && Array.isArray(groupList.data)) {
            const formatedGroupList = groupList.data.map((item:any) => ({
                id: item.id,
                label: item.name
            }));
            setGroupAutoCompleteOptions(Array.isArray(formatedGroupList) ? formatedGroupList : []);
        }
    },[groupList])

    useEffect(() => {
        if(id > 0) {
            getTheCaseSharingForUpdate(id);
        }
    },[id]);

    useEffect (() => {
        userAutoCompleteOptionsRef.current = usersAutoCompleteOptions;
        groupAutoCompleteOptionsRef.current = groupAutoCompleteOptions;
        if(!isFirstRenderRef.current) {
            fillCaseSharingAutoComplete(CaseSharingPayload);
        }
    },[usersAutoCompleteOptions,groupAutoCompleteOptions])

    useEffect(() => {
        isFirstRenderRef.current = false;
        setOpenModal(true);
        console.log(caseSharingList,"caseSharingList")
    },[])

    const closeDialog = (dirty: any) => {
        if (dirty) {
          setIsOpen(true);
        } else {
          handleClose();
        }
    };
    const handleClose = () => {
        setOpenModal(false);
        props.openModel(false);
    };

    const GetCaseInternalSharingPermission = (value:any) => {
        const caseInternalSharingPermission: any[] = [];
        for(let user of value.userId)
        {
            const caseInternalSharingPermissionObj = {
                id : '0',
                caseSharingId : 0,
                userId : user.id,
                groupId : null
            }
            caseInternalSharingPermission.push(caseInternalSharingPermissionObj)
        }
        for(let group of value.groupId)
        {
            const caseInternalSharingPermissionObj = {
                id : '0',
                caseSharingId : 0,
                userId : null,
                groupId : group.id
            }
            caseInternalSharingPermission.push(caseInternalSharingPermissionObj)
        }
        return caseInternalSharingPermission;
    }
    const setAddPayload: any = (value:any) => {
        const {id,userId} = props.formValues
        const payload: any = {
            id : "0",
            caseId: id,
            requestTrackId: null,
            userId: Number(userId),
            startTime: value.startTime,
            endTime: value.endTimeInfinite == true ? null : value.endTime,
            status: ESharingStatus.Available,
            type: ESharingType.Internal,
            allowAssetsViewing: value.allowAssetsViewing,
            allowAssetsPlaying: value.allowAssetsPlaying,
            allowAssetsDownloading: value.allowAssetsDownloading,
            contribute: value.contribute,
            caseInternalSharingPermission : GetCaseInternalSharingPermission(value.caseInternalSharingPermission)
        }
        return payload;
    }

    const FormInternalSharingFormMessages : any = (obj: any) => {
        toasterRef?.current?.showToaster({
          message: obj.message,
          variant: obj.variant,
          duration: obj.duration,
          clearButtton: true,
        });
    };

    const onMessageShow = (isSuccess: boolean, message: string) => {
        FormInternalSharingFormMessages({
          message: message,
          variant: isSuccess ? "success" : "error",
          duration: 7000,
        });
    };

    const isValidDate = (date : string) => {
        if(typeof date === "string") {
            let formattedDate = new Date(date).toISOString().split('Z')[0];
            return formattedDate;
        }
        return ""
    }

    const GetUserResponse = (userId : any) => {
        const caseInternalSharingPermissionUser: any[] = [];

        if (userId != null && userId != undefined)
        {
            let caseInternalSharingPermissionUserObj = {} as AutoCompleteOptionType
            caseInternalSharingPermissionUserObj.id = userId;
            caseInternalSharingPermissionUserObj.label = '';
            caseInternalSharingPermissionUser.push(caseInternalSharingPermissionUserObj)
        }
        return caseInternalSharingPermissionUser;
    }

    const GetGroupResponse = (groupId : any) => {
        const caseInternalSharingPermissionGroup: any[] = [];

        if (groupId != null && groupId != undefined)
        {
            let caseInternalSharingPermissionGroupObj = {} as AutoCompleteOptionType
            caseInternalSharingPermissionGroupObj.id = groupId;
            caseInternalSharingPermissionGroupObj.label = '';
            caseInternalSharingPermissionGroup.push(caseInternalSharingPermissionGroup)
        }
        return caseInternalSharingPermissionGroup;
    }

    const GetResponseCaseInternalSharingPermission : any = (res :any) => {
        const caseInternalSharingPermission: any[] = [];
        if(res !=undefined && res.length > 0)
        {
            res.forEach((item:any) => {
                let caseInternalSharingPermissionObj = {} as TCaseInternalSharingPermission
                caseInternalSharingPermissionObj.id = item.id;
                caseInternalSharingPermissionObj.caseSharingId = item.caseSharingId;
                caseInternalSharingPermissionObj.userId = GetUserResponse(item.userId);
                caseInternalSharingPermissionObj.groupId = GetGroupResponse(item.groupId);
                
                caseInternalSharingPermission.push(caseInternalSharingPermissionObj);
            })
        }
        return caseInternalSharingPermission;
    }

    const getTheCaseSharingForUpdate = (id:number) => {
        CasesAgent.getCaseSharing(`Case/${props.formValues.id}/CaseSharing/id`)
        .then((response : any) => {
                const caseSharingPayloadCopy = {...caseSharingIntialState};
                caseSharingPayloadCopy.id = response.id;
                caseSharingPayloadCopy.userId = response?.userId
                caseSharingPayloadCopy.startTime = isValidDate(response?.startTime);
                caseSharingPayloadCopy.endTime = isValidDate(response?.endTime);
                caseSharingPayloadCopy.allowAssetsViewing = response.allowAssetsViewing;
                caseSharingPayloadCopy.allowAssetsPlaying = response.allowAssetsPlaying;
                caseSharingPayloadCopy.allowAssetsDownloading = response.allowAssetsDownloading;
                caseSharingPayloadCopy.contribute = response.contribute;
                caseSharingPayloadCopy.isHighlight = response.isHighlight;
                caseSharingPayloadCopy.endTimeInfinite = response.endTime === null ? true : false
                caseSharingPayloadCopy.caseInternalSharingPermission = GetResponseCaseInternalSharingPermission(response.caseInternalSharingPermission);
                internalSharingOriginalRef.current = response;
                fillCaseSharingAutoComplete(caseSharingPayloadCopy);
        });
    }

    const fillCaseSharingAutoComplete = (caseSharingValues: TCaseSharing) => {
        const caseSharingPayloadCopy = {...caseSharingValues};

        // if(Array.isArray(userAutoCompleteOptionsRef.current) && userAutoCompleteOptionsRef.current.length > 0 && caseSharingPayloadCopy.caseInternalSharingPermission !== null) {
        //     for (let userCopy of caseSharingPayloadCopy.caseInternalSharingPermission) {
        //             const userFound = userAutoCompleteOptionsRef.current.find((x:any) => x.id === userCopy.userId?.id)
        //             if(userFound !=null) {
        //                 // userCopy.userId = userFound
        //         }
        //     }
        // }

        // if(Array.isArray(groupAutoCompleteOptionsRef.current) && groupAutoCompleteOptionsRef.current.length > 0 && caseSharingPayloadCopy?.caseInternalSharingPermission !=null) {
        //     for (let groupCopy of caseSharingPayloadCopy.caseInternalSharingPermission) {
        //             const groupFound = groupAutoCompleteOptionsRef.current.find((x: any) => x.id === groupCopy.groupId?.id);
        //             if(groupFound !=null) {
        //                 groupCopy.groupId = groupFound;
        //             }
        //     }
        // }
        setCaseSharingPayload(caseSharingPayloadCopy);
    }
    const onSaveData = async (value:any) => {
        const payload: any = setAddPayload(value);
        let AddUrl = `Case/${props.formValues.id}/CaseSharing`
        if(id) {
            payload.id = Number(props.formValues.caseId);
            let EditUrl = `Case/${props.formValues.id}/CaseSharing/${id}`
            CasesAgent.editCaseSharing(EditUrl, payload).then((res:any) => {
                onMessageShow(true, t("Case_Sharing_Update_Successfully"));
                setTimeout(() => {
                    handleClose();
                  }, 500);
            })
            .catch((e:any) => {
                console.error(e);
            })
        } else {
            CasesAgent.addCaseSharing(AddUrl,payload).then((res: number) => {
                onMessageShow(true, t("Case_Sharing_Saved_Successfully"));
                setTimeout(() => {
                    handleClose();
                  }, 700);
            })
            .catch((e:any) => {
                console.error(e);
            })
        }
    }

    const CaseSharingValidationSchema = Yup.object().shape({
            startTime: Yup.date().nullable().typeError('Start Time is Required').required('Start Time is Required'),
            endTime: Yup.date().nullable().typeError('End Time is Required').required('End Time is Required'),
    });

    const ContributeBtnValues = [
        {
          id: 1,
          value: "View Only",
          isDisabled: false,
          label: "View Only",
          Comp: () => {},
        },
        {
          id: 2,
          value: "Contribute",
          isDisabled: false,
          label: "Contribute",
          Comp: () => {},
        },
    ];

    const RadioHandler = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        e.preventDefault();
        if(e.target.value === 'View Only') 
        {
            setFieldValue("allowAssetsDownloading", false, true);
            setFieldValue("contribute", false, true);
            setFieldValue("allowAssetsPlaying", false, true);
        } 
        else 
        {
            setFieldValue("allowAssetsDownloading", true, true);
            setFieldValue("contribute", true, true);
            setFieldValue("allowAssetsPlaying", true, true);
            setFieldValue("allowAssetsViewing", false, true);
        }
    }
    
    return (
        <>
            <CRXToaster ref={toasterRef} className="formFieldToaster" />
            <Formik
                enableReinitialize={true}
                initialValues={CaseSharingPayload}
                validationSchema = {CaseSharingValidationSchema}
                validateOnChange={true}
                onSubmit={(values) => {
                    console.log("SUBMIT : " + values)
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
                }) => (
                    <>
                        <div className="FormInternalSharing">
                                <CRXModalDialog
                                    maxWidth="gl"
                                    title={props.title}
                                    className={`create_Internal_Sharing_Form`}
                                    modelOpen={openModal}
                                    onClose={()=> closeDialog(dirty)}
                                    defaultButton={false}
                                    showSticky={true}
                                    subTitleText ="Indicates required field"
                                    loseWithConfirm={closeWithConfirm}
                                >
                                    <CRXContainer className="create_internal_sharing_form_field_content">
                                        <div className="crx_form_internal_sharing_row">
                                            <CRXColumn
                                                className="createInternalSharingCol columnRight"
                                                container ="container"
                                                item="item"
                                                lg={6}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXMultiSelectBoxLight
                                                    id="caseInternalSharingPermission.userId"
                                                    name='caseInternalSharingPermission.userId'
                                                    className="internalGuestAutoComplete"
                                                    label ={t('Internal_Guest(s)')}
                                                    multiple={true}
                                                    CheckBox={true}
                                                    options = {Array.isArray(usersAutoCompleteOptions) ? usersAutoCompleteOptions : []}
                                                    // value = {values.caseInternalSharingPermission.userId)}
                                                    onChange={(e:any,value:AutoCompleteOptionType[]) =>
                                                    {
                                                        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                                                        setFieldValue("caseInternalSharingPermission.userId", filteredValues);
                                                    }}
                                                />
                                            </CRXColumn>
                                            <CRXColumn
                                                className="createInternalSharingCol columnLeft"
                                                container ="container"
                                                item="item"
                                                lg={6}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXMultiSelectBoxLight
                                                    id="caseInternalSharingPermission.groupId"
                                                    name="caseInternalSharingPermission.groupId"
                                                    className="internalGroupAutoComplete"
                                                    label ={t('Internal_Group(s)')}
                                                    multiple={true}
                                                    options = {Array.isArray(groupAutoCompleteOptions) ? groupAutoCompleteOptions : []}
                                                    // values= {values.caseInternalSharingPermission.groupId}
                                                    onChange={(e:any,value:AutoCompleteOptionType[]) =>
                                                    {
                                                        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                                                        setFieldValue("caseInternalSharingPermission.groupId", filteredValues);
                                                    }}
                                                />
                                            </CRXColumn>
                                        </div>
                                        <div className="crx_form_internal_sharing_row">
                                            <CRXColumn item={true} xs={2}>
                                                <label className="cc_form_label">
                                                    {t("Share_Options")}
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn item={true} xs={2}>
                                                <label className="cc_form_label">
                                                    {t("Start_Date")} <span>*</span>
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn
                                                className="createInternalSharingCol columnLeft DateTimeUi"
                                                container ="container"
                                                item="item"
                                                lg={4}
                                                xs={12}
                                                spacing={0}
                                                >
                                                <CRXInputDatePicker
                                                    value = {values.startTime}
                                                    error ={errors.startTime != '' && touched.startTime == true}
                                                    errorMsg={errors.startTime}
                                                    type='datetime-local'
                                                    className='users-input'
                                                    onChange={(e: any) =>
                                                    {
                                                        setFieldValue("startTime", e.target.value, true)
                                                        setFieldTouched("startTime", true)
                                                    }
                                                }
                                                    minDate={ new Date().toString()}
                                                />
                                                {/* <ErrorMessage name='startTime' >
                                                        {errorMsg => <div className='error'>{errorMsg}</div>}
                                                </ErrorMessage> */}
                                            </CRXColumn>
                                        </div>
                                        <div className="crx_form_internal_sharing_row">
                                            <CRXColumn item={true} xs={2} >
                                                <label className="cc_form_label">
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn item={true} xs={2} className = "labelUi">
                                                <label className="cc_form_label" >
                                                    {t("End_Date")} <span>*</span>
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn
                                                className={
                                                    `createInternalSharingCol columnLeft DateTimeUi` +
                                                    ` ${errors.endTime && touched.endTime == true
                                                      ? "errorBrdr"
                                                      : ""
                                                    }`
                                                  }
                                                container ="container"
                                                item="item"
                                                lg={4}
                                                xs={12}
                                                spacing={0}
                                                >
                                                <CRXInputDatePicker
                                                    value = {values.endTimeInfinite === true ? indefiniteValue : values.endTime}
                                                    error ={errors.endTime != undefined && touched.endTime}
                                                    errorMsg={errors.endTime}
                                                    type='datetime-local'
                                                    className='users-input'
                                                    onChange={(e: any) =>
                                                        {
                                                            setFieldValue("endTime", e.target.value, true)
                                                            setFieldTouched("endTime", true)
                                                        }
                                                    }
                                                    minDate={values.startTime}
                                                    disabled={values.endTimeInfinite == true ? true: false}
                                                    maxDate=''
                                                />
                                                {/* <ErrorMessage name='endTime' >
                                                        {errorMsg => <div className='error'>{errorMsg}</div>}
                                                </ErrorMessage> */}
                                            </CRXColumn>
                                            <CRXColumn
                                                className="createInternalSharingCol columnLeft"
                                                container ="container"
                                                item="item"
                                                lg={1}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXCheckBox
                                                    checked = {values.endTimeInfinite}
                                                    lightMode={true}
                                                    className='crxCheckBoxCreate'
                                                    onChange={(e: any) =>
                                                        setFieldValue("endTimeInfinite", e.target.checked, true)}
                                                    />
                                            </CRXColumn>
                                            <CRXColumn item={true} xs ={1} className="inputIndefiniteLabel">
                                                <label className="cc_form_label">
                                                    {t("Indefinite")}
                                                </label>
                                            </CRXColumn>

                                        </div>
                                        <div className="crx_form_internal_sharing_row">
                                            <CRXColumn
                                                className="createInternalSharingCol columnLeft1"
                                                container ="container"
                                                item="item"
                                                lg={1}
                                                xs={12}
                                                spacing={0}
                                                >
                                                <CRXRadio
                                                    value = {values.allowAssetsPlaying === true && values.allowAssetsDownloading === true && values.contribute === true ?  'Contribute': 'View Only'}
                                                    className='crxEditRadioBtn internalSharingRadioBtn'
                                                    disableRipple={true}
                                                    content={ContributeBtnValues}
                                                    onChange={(e: any) => RadioHandler(e, setFieldValue)}
                                                />
                                            </CRXColumn>
                                        </div>
                                        <div className='modalFooter CRXFooter'>
                                        <div className='nextBtn'>
                                            <CRXButton
                                                color="primary"
                                                variant="contained"
                                                className="save_button_cc"
                                                onClick={() => onSaveData(values)}
                                                // disabled={!isValid || !dirty}
                                            >
                                                {t("Share")}
                                            </CRXButton>
                                        </div>
                                        <div className='cancelBtn'>
                                            <CRXButton
                                                clssName="secondary"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={handleClose}
                                            >
                                                {t("Cancel")}
                                            </CRXButton>
                                        </div>
                                    </div>
                                    </CRXContainer>
                                </CRXModalDialog>
                        </div>
                    </>
                )}
            </Formik>
        </>
    )
}

export default CaseInternalSharingPermissionForm;