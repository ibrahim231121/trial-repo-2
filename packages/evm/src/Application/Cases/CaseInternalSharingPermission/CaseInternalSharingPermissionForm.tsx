import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import './CaseInternalSharingPermission.scss';
import { Formik, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
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
import { TCaseSharing, AutoCompleteOptionType, ESharingStatus, ESharingType, TCaseInternalSharingPermission } from './CaseInternalSharingPermissionTypes';
import { CasesAgent } from '../../../utils/Api/ApiAgent';
import { RootState } from '../../../Redux/rootReducer';
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { getGroupAsync } from '../../../Redux/GroupReducer';

type FormCaseInternalSharingPermissionProps = {
    id: number;
    title: string;
    openModel: React.Dispatch<React.SetStateAction<any>>;
    formValues?: any
}

const minDate = () => {
    var now = new Date();
    let date = moment(now).format("YYYY-MM-DD").toString();
    let time = moment(now).format("HH:mm").toString();
    var dateTime = date+'T'+time
    return dateTime;
}

const caseInternalSharingPermissionInitialState: TCaseInternalSharingPermission = {
    id: '',
    caseSharingId: 0,
    userId: [],
    groupId: [],
}
const caseSharingIntialState: TCaseSharing = {
    id: "0",
    caseId: 0,
    caseTitle : "",
    requestTrackId: 0,
    userId: 0,
    startTime: minDate(),
    endTime: '',
    status : 1,
    type: 1,
    allowAssetsViewing: true,
    allowAssetsPlaying: false,
    allowAssetsDownloading: false,
    contribute: false,
    isHighlight: false,
    endTimeInfinite: false,
    caseInternalSharingPermission: caseInternalSharingPermissionInitialState,
}

const CaseInternalSharingPermissionForm: React.FC<FormCaseInternalSharingPermissionProps> = (
    props: FormCaseInternalSharingPermissionProps
) => {
    const [id, setId] = useState<number>(props?.id);
    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
    const toasterRef = useRef<typeof CRXToaster>(null);
    const dispatch = useDispatch();

    const userList: any = useSelector((state: RootState) => state.userReducer.usersInfo);
    const groupList: any = useSelector((state: RootState) => state.groupReducer.groups);

    const [usersAutoCompleteOptions, setUsersAutoCompleteOptions] = useState<AutoCompleteOptionType[]>([]);
    const [groupAutoCompleteOptions, setGroupAutoCompleteOptions] = useState<AutoCompleteOptionType[]>([]);

    const isFirstRenderRef = useRef<boolean>(true);
    const internalSharingOriginalRef = useRef<any>(null);
   

    const { t } = useTranslation<string>();

    const [CaseSharingPayload, setCaseSharingPayload] = useState<TCaseSharing>(caseSharingIntialState);

    const userPagerData = {
        gridFilter: {
        logic: "and", 
        filters: []
        },
        page: 0,
        size: 1000,
        gridSort: {
        field: "LoginId",
        dir: "asc"
        }
    }

    const groupPagerData = {
        gridFilter: {
            logic: "and",
            filters: []
          },
          page: 0,
          size: 1000,
          gridSort: {
            field: "Name",
            dir: "asc"
          }
    }

    useEffect(() => {
        if (!isFirstRenderRef.current && userList && Array.isArray(userList.data) && props.formValues.userId) {
            const formatedUserList = userList.data.filter((x: any) => parseInt(x.recId) !== props.formValues.userId).map((item: any) => ({
                id: parseInt(item.recId),
                label: item.fName + ' ' + item.lName
            }));
            setUsersAutoCompleteOptions(Array.isArray(formatedUserList) ? formatedUserList : []);
        }
    }, [userList])

    useEffect(() => {
        if (!isFirstRenderRef.current && groupList && Array.isArray(groupList.data)) {
            const formatedGroupList = groupList.data.map((item: any) => ({
                id: item.id,
                label: item.name
            }));
            setGroupAutoCompleteOptions(Array.isArray(formatedGroupList) ? formatedGroupList : []);
        }
    }, [groupList])

    useEffect (() => {
        

        setCaseSharingPayload(CaseSharingPayload => ({
            ...CaseSharingPayload,
            startTime: minDate()
        }));
        
        isFirstRenderRef.current = false;
        dispatch(getUsersInfoAsync(userPagerData));
        dispatch(getGroupAsync(groupPagerData))
    },[])
   
    const handleClose = () => {
        props.openModel(false);
    };

    const GetCaseInternalSharingPermission = (value: any) => {
        const caseInternalSharingPermission: any[] = [];
        if (Array.isArray(value.userId) && value.userId.length > 0) {
            for (let user of value.userId) {
                const caseInternalSharingPermissionObj : TCaseInternalSharingPermission = {
                    id: '0',
                    caseSharingId: 0,
                    userId: user.id,
                    groupId: null
                }
                caseInternalSharingPermission.push(caseInternalSharingPermissionObj)
            }
        }
        if (Array.isArray(value.groupId) == true && value.groupId.length > 0) {
            for (let group of value.groupId) {
                const caseInternalSharingPermissionObj : TCaseInternalSharingPermission = {
                    id: '0',
                    caseSharingId: 0,
                    userId: null,
                    groupId: group.id
                }
                caseInternalSharingPermission.push(caseInternalSharingPermissionObj)
            }
        }
        return caseInternalSharingPermission;
    }
    const setAddPayload: any = (value: any) => {
        const { id, userId,caseTitle } = props.formValues
        const payload: any = {
            id: "0",
            caseId: id,
            caseTitle:caseTitle,
            requestTrackId: null,
            userId: Number(userId),
            startTime: value.endTimeInfinite == true ? null : new Date(value.startTime).toUTCString(),
            endTime:value.endTimeInfinite == true ? null : new Date(value.endTime).toUTCString(),
            status: ESharingStatus.Available,
            type: ESharingType.Internal,
            allowAssetsPlaying: value.allowAssetsPlaying,
            allowAssetsDownloading: value.allowAssetsDownloading,
            contribute: value.contribute,
            caseInternalSharingPermission: GetCaseInternalSharingPermission(value.caseInternalSharingPermission)
        }
        return payload;
    }

    const FormInternalSharingFormMessages: any = (obj: any) => {
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

    const isValidDate = (date: string) => {
        if (typeof date === "string") {
            let formattedDate = new Date(date).toISOString().split('Z')[0];
            return formattedDate;
        }
        return ""
    }

    const GetUserResponse = (userId: any) => {
        const caseInternalSharingPermissionUser: any[] = [];

        if (userId != null && userId != undefined) {
            let caseInternalSharingPermissionUserObj = {} as AutoCompleteOptionType
            caseInternalSharingPermissionUserObj.id = userId;
            caseInternalSharingPermissionUserObj.label = '';
            caseInternalSharingPermissionUser.push(caseInternalSharingPermissionUserObj)
        }
        return caseInternalSharingPermissionUser;
    }

    const GetGroupResponse = (groupId: any) => {
        const caseInternalSharingPermissionGroup: any[] = [];

        if (groupId != null && groupId != undefined) {
            let caseInternalSharingPermissionGroupObj = {} as AutoCompleteOptionType
            caseInternalSharingPermissionGroupObj.id = groupId;
            caseInternalSharingPermissionGroupObj.label = '';
            caseInternalSharingPermissionGroup.push(caseInternalSharingPermissionGroup)
        }
        return caseInternalSharingPermissionGroup;
    }

    const GetResponseCaseInternalSharingPermission: any = (res: any) => {
        const caseInternalSharingPermission: any[] = [];
        if (res != undefined && res.length > 0) {
            res.forEach((item: any) => {
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

    const getTheCaseSharingForUpdate = (id: number) => {
        CasesAgent.getCaseSharing(`Case/${props.formValues.id}/CaseSharing/id`)
            .then((response: any) => {
                const caseSharingPayloadCopy = { ...caseSharingIntialState };
                caseSharingPayloadCopy.id = response.id;
                caseSharingPayloadCopy.userId = response?.userId
                caseSharingPayloadCopy.startTime = isValidDate(response?.startTime);
                caseSharingPayloadCopy.endTime = isValidDate(response?.endTime);
                caseSharingPayloadCopy.allowAssetsViewing = response.allowAssetsViewing;
                caseSharingPayloadCopy.allowAssetsPlaying = response.allowAssetsPlaying;
                caseSharingPayloadCopy.allowAssetsDownloading = response.allowAssetsDownloading;
                caseSharingPayloadCopy.contribute = response.contribute;
                caseSharingPayloadCopy.isHighlight = response.isHighlight;
                caseSharingPayloadCopy.caseInternalSharingPermission = GetResponseCaseInternalSharingPermission(response.caseInternalSharingPermission);
                internalSharingOriginalRef.current = response;
                fillCaseSharingAutoComplete(caseSharingPayloadCopy);
            });
    }

    const fillCaseSharingAutoComplete = (caseSharingValues: TCaseSharing) => {
        const caseSharingPayloadCopy = { ...caseSharingValues };
        setCaseSharingPayload(caseSharingPayloadCopy);
    }
    const onSaveData = async (value: any,setSubmitting:any) => {
        const payload: any = setAddPayload(value);
        let AddUrl = `Case/${props.formValues.id}/CaseSharing`
        if (id) {
            payload.id = Number(props.formValues.caseId);
            let EditUrl = `Case/${props.formValues.id}/CaseSharing/${id}`
            CasesAgent.editCaseSharing(EditUrl, payload).then((res: any) => {
                onMessageShow(true, t("Case_Sharing_Update_Successfully"));
                handleClose();
            })
                .catch((e: any) => {
                    console.error(e);
                })
        } else {
            setSubmitting(true)
            CasesAgent.addCaseSharing(AddUrl, payload).then((res: number) => {
                onMessageShow(true, t("Case_Sharing_Saved_Successfully"));
                handleClose();
            })
                .catch((e: any) => {
                    setSubmitting(false)
                    console.error(e);
                })
        }
    }

    const CaseSharingValidationSchema = Yup.object().shape({
            endTimeInfinite :  Yup.boolean(),
            eventStartTime: Yup.date().default(() => new Date()),
            startTime: 
            Yup.date().when('endTimeInfinite',{
                is: (endTimeInfinite:boolean) => endTimeInfinite === true,
                then: Yup.date,
                otherwise :  Yup.date().required('Start Date is required').typeError('Start Date should be select from Current Date & Time')
                .when(
                'eventStartTime',
                (eventStartTime, Yup) => eventStartTime && Yup.min(minDate(), 'Start Date should be select from Current Date & Time')
                ),
            }),
            endTime: 
            Yup.date()
            .when('endTimeInfinite', {
                is: (endTimeInfinite:boolean) => endTimeInfinite === true,
                then: Yup.date,
                otherwise : Yup.lazy(() => Yup.date().required('End Date is required')
                .min(Yup.ref('startTime'), 'End Date can not be less than Start Date')),
            }),
            caseInternalSharingPermission : Yup.object().shape({                                                                                 
                'userId': Yup.array()                                                                        
                    .when('groupId', {                                                   
                    is: (groupId:any) => !groupId || groupId.length === 0,   
                    then: Yup.array().min(1,"Internal Guest(s) is required"), 
                    otherwise: Yup.array()                                                  
                    }),   
                'groupId': Yup.array()                                                                        
                    .when('userId', {     
                        is: (userId:any) => !userId || userId.length === 0,                                                  
                    then: Yup.array().min(1,"Internal Group(s) is required"), 
                    otherwise: Yup.array()                                                 
                    }),                                                                  
            }, [['userId', 'groupId']]),
        })
    const ContributeBtnValues = [
        {
            id: 1,
            value: "View Only",
            isDisabled: false,
            label: "View Only",
            Comp: () => { },
        },
        {
            id: 2,
            value: "Contribute",
            isDisabled: false,
            label: "Contribute",
            Comp: () => { },
        },
    ];

    const RadioHandler = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        e.preventDefault();
        if (e.target.value === 'View Only') {
            setFieldValue("allowAssetsDownloading", false, true);
            setFieldValue("contribute", false, true);
            setFieldValue("allowAssetsPlaying", false, true);
        }
        else {
            setFieldValue("allowAssetsDownloading", true, true);
            setFieldValue("contribute", true, true);
            setFieldValue("allowAssetsPlaying", true, true);
            setFieldValue("allowAssetsViewing", false, true);
        }
    }

    const IndefiniteHandler = (e: React.ChangeEvent<HTMLInputElement>, setValues: any,setTouched:any,values:any) => {
        if(e.target.checked == true) {
            const valuesCopy = Object.assign({}, values);
            valuesCopy.endTimeInfinite = true;
            valuesCopy.startTime = minDate();
            valuesCopy.endTime = '';
            setTouched({startTime: true,endTimeInfinite: true}, true);
            setValues(valuesCopy, true);
        } else
        {
            const valuesCopy = Object.assign({}, values);
            valuesCopy.endTimeInfinite = false;
            valuesCopy.startTime = '';
            valuesCopy.endTime = '';
            setValues(valuesCopy, true);
        }
    }

    return (
        <>
            <CRXToaster ref={toasterRef} className="formFieldToaster" />
            <Formik
                enableReinitialize={true}
                initialValues={CaseSharingPayload}
                validationSchema={CaseSharingValidationSchema}
                validateOnChange={true}
                onSubmit={(values) => {
                    console.log("SUBMIT : " + values)
                }}
                validateOnMount={true}
                isInitialValid={false}
                validateOnBlur={true}
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
                    handleBlur,
                    setTouched,
                    setValues
                }) => (
                    <>
                        <div className="FormInternalSharing">
                            <CRXModalDialog
                                maxWidth="gl"
                                title={props.title}
                                className={`create_Internal_Sharing_Form`}
                                modelOpen={props.openModel}
                                onClose={() => handleClose()}
                                defaultButton={false}
                                showSticky={true}
                                loseWithConfirm={closeWithConfirm}
                            >
                                <CRXContainer className="create_internal_sharing_form_field_content">
                                    <div className='crx_form_Field'>
                                        <div className="crx_form_internal_sharing_row_userGroup">
                                            <CRXColumn
                                                className="createInternalSharingColUserGroup"
                                                container="container"
                                                item="item"
                                                lg={6}
                                                xs={12}
                                                md={6}
                                                spacing={0}
                                            >
                                                <CRXMultiSelectBoxLight
                                                    className="caseInternalAutoComplete"
                                                    label={t('Internal_Guest(s)')}
                                                    multiple={true}
                                                    CheckBox={true}
                                                    options={Array.isArray(usersAutoCompleteOptions) ? usersAutoCompleteOptions : []}
                                                    value = {values.caseInternalSharingPermission.userId}
                                                    onChange={(e: any, value: AutoCompleteOptionType[]) => {
                                                        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                                                        setFieldTouched("caseInternalSharingPermission.groupId", false)
                                                        setFieldTouched("caseInternalSharingPermission.userId", true)
                                                        setFieldValue("caseInternalSharingPermission.userId", filteredValues);
                                                    }}
                                                    onOpen ={(e:any) => 
                                                        {
                                                            handleBlur(e);
                                                            setFieldTouched("caseInternalSharingPermission.groupId", false);
                                                            setFieldTouched("caseInternalSharingPermission.userId", true) 
                                                        }
                                                    }    
                                                    error={ touched?.caseInternalSharingPermission?.userId && (errors.caseInternalSharingPermission?.userId ?? "").length > 0}
                                                    errorMsg={errors?.caseInternalSharingPermission?.userId}
                                                />
                                            </CRXColumn>
                                            <CRXColumn
                                                className="createInternalSharingColUserGroup"
                                                container="container"
                                                item="item"
                                                lg={6}
                                                xs={12}
                                                md={6}
                                                spacing={0}
                                            >
                                                <CRXMultiSelectBoxLight
                                                    className="caseInternalAutoComplete"
                                                    label={t('Internal_Group(s)')}
                                                    multiple={true}
                                                options={Array.isArray(groupAutoCompleteOptions) ? groupAutoCompleteOptions : []}
                                                    values= {values.caseInternalSharingPermission.groupId}
                                                    onChange={(e: any, value: AutoCompleteOptionType[]) => {
                                                        let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                                                        setFieldTouched("caseInternalSharingPermission.userId", false);
                                                        setFieldTouched("caseInternalSharingPermission.groupId", true)
                                                        setFieldValue("caseInternalSharingPermission.groupId", filteredValues);
                                                    }}
                                                    error={ touched?.caseInternalSharingPermission?.groupId && (errors.caseInternalSharingPermission?.groupId ?? "").length > 0}
                                                    errorMsg={errors?.caseInternalSharingPermission?.groupId}
                                                    checkSign={false}
                                                    onOpen ={(e:any) => 
                                                        {
                                                            handleBlur(e);
                                                            setFieldTouched("caseInternalSharingPermission.userId", false);
                                                            setFieldTouched("caseInternalSharingPermission.groupId", true);
                                                        }
                                                    }
                                                />
                                            </CRXColumn>
                                        </div>
                                        <div className="crx_form_internal_sharing_row_startDate">
                                            <CRXColumn item={true} xs={2} className="dateTimeHeading">
                                                <label className="dateTimeHeading">
                                                    {t("Share_Options")} <span>*:</span>
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn item={true} xs={1} className="startDatelabelUi">
                                            <label className="startDateUI">
                                                    {t("Start_Date")} 
                                                </label>      
                                            </CRXColumn>
                                            <CRXColumn
                                                container="container"
                                                className={
                                                    `DateTimeUi_picker` +
                                                    ` ${errors.startTime && touched.startTime == true
                                                        ? "errorBrdr"
                                                        : ""
                                                    }`
                                                }
                                                item="item"
                                                lg={4}
                                                xs={12}
                                                spacing={0}
                                            >
                                                
                                                <CRXInputDatePicker
                                                    value={values.startTime}
                                                    type='datetime-local'
                                                    className={`users-input  ${errors.startTime !== undefined ? "datepicker_error": ""}`}
                                                    onChange={(e: any) => {
                                                        setFieldTouched("startTime", true)
                                                        setFieldValue("startTime", e.target.value, true)
                                                    }
                                                    }
                                                    minDate={minDate()}
                                                    disabled={values.endTimeInfinite ?? false}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.startTime !== undefined ? (
                                                    <div className="errorStyle">
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    {errors.startTime}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </CRXColumn>
                                        </div>
                                        <div className="crx_form_internal_sharing_row_endDate">
                                            <CRXColumn item={true} xs={2} className="labelUi">
                                                <label>
                                                    {t("End_Date")} 
                                                </label>
                                            </CRXColumn>
                                            <CRXColumn
                                                className={
                                                    `DateTimeUi_picker` +
                                                    ` ${errors.endTime && touched.endTime == true
                                                        ? "errorBrdr"
                                                        : ""
                                                    }`
                                                }
                                                container="container"
                                                item="item"
                                                lg={4}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXInputDatePicker
                                                    value={values.endTime}
                                                    type='datetime-local'
                                                    className='users-input'
                                                    onChange={(e: any) => {
                                                        setFieldTouched("endTime", true)
                                                        setFieldValue("endTime", e.target.value, true)
                                                    }
                                                    }
                                                    disabled={values.endTimeInfinite}
                                                    minDate={values.startTime}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage name='endTime' render={(msg) => <div className='errorStyle'><i className="fas fa-exclamation-circle"></i>{msg}</div>} />
                                            </CRXColumn>
                                            <CRXColumn
                                                className="IndefiniteUi"
                                                container="container"
                                                item="item"
                                                lg={2}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXCheckBox
                                                    checked={values.endTimeInfinite}
                                                    lightMode={true}
                                                    className='crxCheckBoxCreate'
                                                    onChange={(e: any) => IndefiniteHandler(e, setValues, setTouched,values)}
                                                />
                                                <label className="inputIndefiniteLabel">{t("Indefinite")}</label>
                                            </CRXColumn>
                                        </div>
                                        <div className="crx_form_internal_sharing_row_radioBtn">
                                            <CRXColumn
                                                className="radioUI"
                                                container="container"
                                                item="item"
                                                lg={6}
                                                xs={12}
                                                spacing={0}
                                            >
                                                <CRXRadio
                                                    value={values.allowAssetsPlaying === true && values.allowAssetsDownloading === true && values.contribute === true ? 'Contribute' : 'View Only'}
                                                    className='internalSharingRadioBtn'
                                                    disableRipple={true}
                                                    content={ContributeBtnValues}
                                                    onChange={(e: any) => RadioHandler(e, setFieldValue)}
                                                />
                                            </CRXColumn>
                                        </div>
                                    </div>
                                    <div className='modalFooter CRXFooter'>
                                        <div className='nextBtn'>
                                            <CRXButton
                                                color="primary"
                                                variant="contained"
                                                className="save_button_cc"
                                                onClick={() => onSaveData(values, setSubmitting)}
                                                disabled = {(!isValid || !dirty || isSubmitting) }
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