import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { useHistory, useParams } from "react-router";
import {  CRXModalDialog,CRXRadio,CRXButton, CRXConfirmDialog,CRXAlert, CRXRows, CRXColumn, CRXSelectBox, CRXCheckBox, TextField, CRXHeading,CRXTooltip } from "@cb/shared";
import {useTranslation } from "react-i18next";
import { DetailExpand,RetentionPoliciesModel } from '../TypeConstant/types';
import { retentionTypeTimePeriod,retentionTypeDiskSpace } from '../TypeConstant/constants';
import './retentionPoliciesDetail.scss';
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import { useDispatch,useSelector } from "react-redux";
 import { getAllRetentionPoliciesFilter } from "../../../../Redux/RetentionPolicies";

 import {
    PageiGrid
  } from "../../../../GlobalFunctions/globalDataTableFunctions";

type RetentionPoliciesDetailProps = {    
    id:number,
    title:string,
    pageiGrid: PageiGrid, 
    openModel: React.Dispatch<React.SetStateAction<any>>;
}

const DataRetention ="DataRetention";

const RetentionPoliciesDetail: FC<RetentionPoliciesDetailProps> = (props: RetentionPoliciesDetailProps)  => {

    const defaultRetentionPolicies: RetentionPoliciesModel = {      
        id:0,
        type:DataRetention,
        name: "",
        description: "",
        detail:{ 
                type:"Age",
                limit:{isInfinite:false,
                        hours:0,
                        gracePeriodInHours: 0 },
                isDeleted:false,
                space:0 
            }, 
        history:{
            version:""
        }    
           
    }
    const [id, setId] = useState<number>(props.id); 
    const [name, setName] = useState<string>("");    
    const [retentionType, setRetentionType] = useState<string>(retentionTypeTimePeriod);    
    const [radioTimePeriod, setRadioTimePeriod] = React.useState(true);
    const [radioDiskSpace, setRadioDiskSpace] = React.useState(false);
    const [retentionTimeDays, setRetentionTimeDays] = useState<number>(0);
    const [retentionHours, setRetentionHours] = useState<number>(0);
    const [retentionTotalHours, setRetentionTotalHours] = useState<number>(0);
    const [softDeleteTimeDays, setSoftDeleteTimeDays] = useState<number>(0);
    const [gracePeriodHours, setGracePeriodHours] = useState<number>(0); 
    
    
    const [graceTotalPeriodHours, setGraceTotalPeriodHours] = useState<number>(0);
    const [retentionSize, setRetentionSize] = useState<number>(0);
    const [historyVersion, setHistoryVersion] = useState<string>("");
    const [unlimitedRetention, setUnlimitedRetention] = useState<boolean>(false);    
    const [description, setDescription] = useState<string>("");

    const [disableRetentionTimeDays, setDisableRetentionTimeDays] = useState(false);
    const [disableHours, setDisableHours] = useState(false);
    const [disableSoftDeleteTimeDays, setDisableSoftDeleteTimeDays] = useState(false);
    const [disableGracePeriodHours, setDisableGracePeriodHours] = useState(false);

  
    const [openModal, setOpenModal] = React.useState(false);
    const [isDeleted, setIsDeleted] = React.useState<boolean>(false);
    const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

    const [success, setSuccess] = React.useState<boolean>(false);
    const [retentionPolicy, setRetentionPolicies] = useState<RetentionPoliciesModel>(defaultRetentionPolicies);
    
   
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
    const isFirstRenderRef = useRef<boolean>(true);
    const deletedParamValuesIdRef = useRef<number[]>([]);
    const dataToEdit = useRef<RetentionPoliciesModel>(null);
    const [error, setError] = React.useState<boolean>(false);
    const [responseError, setResponseError] = React.useState<string>('');
    const history = useHistory();
    const dispatch = useDispatch();
    const regexForNumberOnly = new RegExp('^[0-9]+$');

    const { t } = useTranslation<string>(); 
    const onRetentionTypeChange = (type:string) => {
        let isDiskSpace =(type == "Space");
          
     
        onSetDiskSpace(isDiskSpace);
        onSetTimePeriod(!isDiskSpace);
        
               
    }
    const onChangeRetentionType = (isDiskSpace:boolean) =>
    {
        if(isDiskSpace)
        {
            
            setRetentionType(retentionTypeDiskSpace);
            setRetentionTimeDays(0);
            setRetentionHours(0); 
            setSoftDeleteTimeDays(0);
            setGracePeriodHours(0);                 
            setUnlimitedRetention(false); 
            setDisableRetentionTimeDays(false);
            setDisableHours(false);
            setDisableSoftDeleteTimeDays(false);
            setDisableGracePeriodHours(false);           
        }
        else
        {
            
            setRetentionType(retentionTypeTimePeriod);
            setRetentionSize(0);
        }
    }

    const onSetTimePeriod = (isSelect:boolean) => {
        setRadioTimePeriod(isSelect); 
        onChangeRetentionType(!isSelect);
    }
    const onSetDiskSpace = (isSelect:boolean) => {
        setRadioDiskSpace(isSelect);         
        onChangeRetentionType(isSelect);
    }

    const setRetentionTimeSpaceValue = (hours: number) => {
        let days = parseInt(String(hours/24));
        let remainingHours = hours - (days * 24); 

        setRetentionTimeDays(days);
        onRetentionHoursChange(remainingHours,days);
      }
      const setSoftDeleteTimeValue = (hours: number) => {
        let days =  parseInt(String(hours/24));
        let remainingHours = hours - (days * 24); 

        setSoftDeleteTimeDays(days);  
        
        onGraceHoursChange(remainingHours,days);
      }

      const setRetentionTotalHourValue = (hours: number,days:number) => {
        let totalHours = Number(hours) + Number(days * 24);
        
        setRetentionTotalHours(totalHours);  
      }
      const setGraceTotalPeriodHoursValue = (hours:number,days:number) => {
        let totalHours = Number(hours) + Number(days * 24);
        
        setGraceTotalPeriodHours(totalHours);  
      }
      const EditCloseHandler =(dataToEdit: any, temp : any) => {
        if (dataToEdit.current == null) {
            dataToEdit.current = { ...temp };
        }
       }

       const onRetentionDaysChange = (hours: any,days: any) =>
       {
            if(days < 0 || !regexForNumberOnly.test(days.toString()))
            {
                days= 0 ;
            }
            
            setRetentionTimeDays(days);
            setRetentionTotalHourValue(hours,days);
            
       }
       
       const onRetentionHoursChange = (hours: any,days:any) =>
       {
            if(hours < 0 || hours > 23 || !regexForNumberOnly.test(hours.toString()))
            {
                hours = 0 ;
            }
            setRetentionHours(hours);
            setRetentionTotalHourValue(hours,days);
       }
       
       const onGraceDaysChange = (hours: any,days: any) =>
       {
            if(days < 0 || !regexForNumberOnly.test(days.toString()))
            {
                days= 0 ;
            }
            setSoftDeleteTimeDays(days);
            setGraceTotalPeriodHoursValue(hours,days);
       }
       
       const onGraceHoursChange = (hours: any,days: any) =>
       {
            if(hours < 0 || hours > 23 || !regexForNumberOnly.test(hours.toString()) )
            {
                hours = 0 ;
            }
            setGracePeriodHours(hours);
            setGraceTotalPeriodHoursValue(hours,days);
       }

        
       const onDiskSpaceChange = (space: any) =>
       {
            if(space < 0)
            {
                space = 0;
            }
            setRetentionSize(space);
       }

       const RetentionPolicyDataChanged = (retentionPolicies: RetentionPoliciesModel, isDataChanged: boolean, dataToEdit: RetentionPoliciesModel) => {
        let retentionTypeName =(retentionPolicy.detail?.type  == "Space"? "DiskSpace": "TimePeriod");
        if(name != retentionPolicy.name || description != retentionPolicy.description || retentionType != retentionTypeName            
            ||  retentionTotalHours !=  retentionPolicy.detail?.limit?.hours ||  graceTotalPeriodHours !=  retentionPolicy.detail?.limit?.gracePeriodInHours ||  unlimitedRetention !=  retentionPolicy.detail?.limit?.isInfinite 
            ||  retentionSize !=  retentionPolicy.detail?.space
            )
        {
            isDataChanged = true;            
        }
      
        return isDataChanged;
        }
        const redirectPage = () => {
            if(dataToEdit.current != null) {
                    let isDataChanged = false;
                    isDataChanged = RetentionPolicyDataChanged(retentionPolicy, isDataChanged, dataToEdit.current);
                                  
                        if(isDataChanged === true) {
                            setIsOpen(true)
                        } 
                        else                        
                        {
                            handleClose();
                        }
                    }
                    else {
                        handleClose();
                    }
            }   

    useEffect(() => {
        if(!isFirstRenderRef.current) {
            if( name.length > 0 && ((radioTimePeriod && (retentionTimeDays > 0 || retentionHours > 0)) || (radioDiskSpace && retentionSize > 0 ))  ) {
                setIsSaveDisable(false);
            }
            else{
                setIsSaveDisable(true); 
            }
        }


    }, [name,retentionTimeDays,retentionHours,retentionSize])


    useEffect (() => {
        dispatch(enterPathActionCreator({ val: "" }));
        return () => {
            dispatch(enterPathActionCreator({ val: "" }));
          }
          
    },[])

    useEffect(() => {
        isFirstRenderRef.current = false;      
        if (id != undefined && id != null && id > 0) {
            SetupConfigurationAgent.getRetentionPolicies(id).then((response: any) => {
                let retentionPoliciesObj = {...retentionPolicy};
                setName(response.name);
                setDescription(response.description);
                onRetentionTypeChange(response.detail.type);
                
                setRetentionTimeSpaceValue(response.detail.limit.hours);
                setSoftDeleteTimeValue(response.detail.limit.gracePeriodInHours);                
                setUnlimitedRetention(response.detail.limit.isInfinite);
                setRetentionSize(response.detail.space);
                
                setRetentionPolicies(response); 
                dispatch(enterPathActionCreator({ val: response?.description }));

                const temp = {
                    retentionPolicies: {...retentionPoliciesObj}
                };
                EditCloseHandler(dataToEdit, temp); 
          
            })
            .catch((err: any) => {
                console.error(err);
            });
        }
    }, []);

   
   const onIndefiniteChange =(e: any, fieldName : string) => {
    let isIndefinite = e.currentTarget.checked;
    if (isIndefinite == true) {
        
        setRetentionTimeDays(365000);
        setRetentionHours(0);
        setSoftDeleteTimeDays(0);
        setGracePeriodHours(0);                     
    }
    else
    {
        setRetentionTimeDays(0);
        setRetentionHours(0);     
    }
    
    setUnlimitedRetention(isIndefinite);
    setDisableRetentionTimeDays(isIndefinite);
    setDisableHours(isIndefinite);
    setDisableSoftDeleteTimeDays(isIndefinite);
    setDisableGracePeriodHours(isIndefinite);
   }

  
    const setAddPayload:any = () => {
        const limit ={
            isInfinite : unlimitedRetention,
            hours:Number(retentionHours) + Number(retentionTimeDays * 24),            
            gracePeriodInHours: Number(gracePeriodHours) + Number(softDeleteTimeDays * 24),
        }
        
        const detail={
            type:radioDiskSpace? "Space" :"Age",  
            limit:limit,
            isDeleted:isDeleted,
            space:retentionSize
        }
        const history={
            version:historyVersion
        }
        const retention = {
            id : id ? id :'0',
            type:DataRetention,
            name : name,                    
            detail: detail,
            description : description,
            history:history
        }

          return retention;
      }

    const onSave = async () => {
        const payload = setAddPayload();
        
        if (id > 0)
        {
            const urlEditRetentionPolicies = 'Policies/' + id  ;
            SetupConfigurationAgent.putRetentionPoliciesTemplate(urlEditRetentionPolicies,payload).then(()=>{        
                setRetentionPolicies(defaultRetentionPolicies);           
                setSuccess(true);
                setError(false);
                dispatch(getAllRetentionPoliciesFilter(props.pageiGrid));
                setTimeout(() => {handleClose()}, 500);
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
        else
        {
            const urlAddRetentionPolicies = 'Policies' ;
            SetupConfigurationAgent.postRetentionPoliciesTemplate(urlAddRetentionPolicies,payload).then(()=>{        
                setRetentionPolicies(defaultRetentionPolicies);           
                setSuccess(true);
                setError(false);
                dispatch(getAllRetentionPoliciesFilter(props.pageiGrid));
                setTimeout(() => {handleClose()}, 500);
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
        
    }
        
    const closeDialog = () => {        
        redirectPage();
    };

   
    const handleClose = () => {
        setOpenModal(false);  
        props.openModel(false);   
    };
    React.useEffect(() => {
        setOpenModal(true)
    }, []);

    const getFormatedLabel = (label: string) => {
        return <span className="requiredLable">
                    {label}{" "}
                    {label === 'Action' ? <span style={{color: "#000",paddingLeft: "8px", fontWeight: "bold"}}>*</span> : <span></span>}
                </span>
    }
    const RadioTimePeriodBtnValues = [
        {
          id: 1,
          value: "TimePeriod",
          isDisabled: false,
          label: "Time Period",
          Comp: () => {},
          Name:"Age"
          
        }
      ];

      const RadioDiskSpaceBtnValues = [
        {
          id: 2,
          value: "DiskSpace",
          isDisabled: false,
          label: "Disk Space",
          Comp: () => {},
          Name:"Space"
        }
      ];
      

    return (
        
        <div className="retention-policies">
              <CRXModalDialog
                maxWidth="gl"
                title={props.title}
                className={'CRXModal ___CRXCreateRetentionPolicy__ ___CRXEditRetentionPolicy__'}
                modelOpen={openModal}
                onClose={closeDialog}
                defaultButton={false}
                showSticky={false}
                closeWithConfirm={closeWithConfirm} 
                               
                >
                {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Retention_Policy")}
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

              
                    <div className="settingsContent">
                     <span className="gridFilterTextBox"> 

                     <div className="text-field">
                     <TextField
                            required={true}
                            value={name}
                            label={t("Policy_Name")}
                            className="retention-policies-input"
                            onChange={(e: any) => setName(e.target.value)}
                            disabled = {false}
                            type="text"
                            name="retentionPoliciesName"
                            regex=""
                             />

                     </div>
                     
                     <div className="text-field">
                        
                     < TextField
                            required={false}
                            value={description}
                            label={t("Description")}
                            className="retention-policies-input"
                            onChange={(e: any) => setDescription(e.target.value)}
                            disabled = {false}
                            type="text"
                            name="retentionPoliciesDescription"
                            regex=""
                            
                            multiline={true}
                            
                             />
                     </div>
                    
                    </span>   
                    </div> 

                    <div className="retention-type">

                    <CRXHeading variant="subtitle1" className="label">
                                {getFormatedLabel(t("Retention_Type"))}
                            </CRXHeading>

                            <CRXRadio
                                    className='crxEditRadioBtn'                                 
                                    content={RadioTimePeriodBtnValues} 
                                    value={retentionType}
                                    setValue={(e: any) =>onRetentionTypeChange(RadioTimePeriodBtnValues[0].Name)}  
                                    checked={true}            
                                    name="radio-buttons"   
                                />

                                <CRXRadio
                                    className='crxEditRadioBtn'                                   
                                    content={RadioDiskSpaceBtnValues} 
                                    value={retentionType}
                                    setValue={(e: any)  => onRetentionTypeChange(RadioDiskSpaceBtnValues[0].Name)}                                       
                                    name="radio-buttons"      
                                />

                    </div>

                    <div className="retention-type">
                    { 
                        radioTimePeriod &&
                        (                                                   
                            <div className="days-hours">
                           
                          
                                < TextField
                                required={true}
                                value={retentionTimeDays ==0?"": retentionTimeDays}
                                label={t("Retention_Time")}
                                className="retention-policies-input"
                                onChange={(e: any) => onRetentionDaysChange(retentionHours,e.target.value)}
                                disabled = {disableRetentionTimeDays}
                                type="number"
                                name="retentionTimeDays"
                                regex=""
                            
                                />
                                <label>{t("Days")}<span></span></label>  

                                

                                < TextField                
                                value={retentionHours==0?"": retentionHours}
                                className="retention-policies-input"
                                onChange={(e: any) => onRetentionHoursChange(e.target.value,retentionTimeDays)}
                                disabled = {disableHours}
                                type="number"
                                name="retentionHours"
                                regex=""
                                min={0}
                                max={23}                                                        
                                />
                                <label>{t("Hours")}<span></span></label>  

                            </div>
                        
                        )
                        }

                    </div>


                    <div className="retention-type">

                    { 
                        radioTimePeriod &&
                        (
                                                   
                            <div className="days-hours">
                           
                                < TextField
                                    required={false}
                                    value={softDeleteTimeDays==0?"": softDeleteTimeDays}
                                    label={t("Soft_Delete_Time")}                            
                                    className="retention-policies-input"
                                    onChange={(e: any) => onGraceDaysChange(gracePeriodHours,e.target.value)}
                                    disabled = {disableSoftDeleteTimeDays}
                                    type="number"
                                    name="softDeleteTimeDays"
                                    regex=""
                                    min={0}                                                            
                                    />
                                    <label>{t("Days")}<span></span></label> 

                                    < TextField
                                    required={false}
                                    value={gracePeriodHours==0?"": gracePeriodHours}                           
                                    className="retention-policies-input"
                                    onChange={(e: any) => onGraceHoursChange(e.target.value,softDeleteTimeDays)}
                                    disabled = {disableGracePeriodHours}
                                    type="number"
                                    name="gracePeriodHours"
                                    regex=""    
                                    min={0}
                                    max={23}                                                             
                                    />
                                    <label>{t("Hours")}<span></span></label>  
                            

                            </div>
                        
                        )
                        }

                    </div>

                    <div className="retention-type">

                        { 
                        radioTimePeriod &&
                        (
                                                
                            <div className="days-hours">
                                
                                 <div className="indefinite_checkBox_ui">
                                    <label>{t("Indefinite")}<span></span></label>   
                                    <CRXCheckBox                                    
                                     checked={unlimitedRetention}
                                    lightMode={true}
                                    className='crxCheckBoxCreate '
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onIndefiniteChange(e, 'indefinite')} />
                                
                                </div>
                            </div>
                                            
                        )
                        }

                    </div>

                        <div className="retention-type">
                        { 
                        radioDiskSpace &&
                        (                                                
                            <div className="days-hours">

                                    < TextField
                                    required={true}
                                    value={retentionSize==0?"": retentionSize}
                                    label={t("Retention_Size")}
                                    className="retention-policies-input"
                                    onChange={(e: any) => onDiskSpaceChange(e.target.value)}
                                    disabled = {false}
                                    type="number"
                                    name="retentionSize"
                                    regex=""
                                    
                                    />
                                    <label>{t("GB")}<span></span></label>  
                                                     
                            </div>
                                                                    
                        )
                        }
                            
                        </div> 

                
            <div className="tab-bottom-buttons retention-type-btns">
                <div className="save-cancel-button-box">
                <CRXButton
                    variant="contained"
                    className="groupInfoTabButtons"
                    onClick={onSave}
                    disabled={isSaveDisable}
                >
                    {t("Save")}
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={handleClose}
                >
                    {t("Cancel")}
                </CRXButton>
                </div>
                
            </div>
            </CRXModalDialog> 
            <CRXConfirmDialog
                setIsOpen={() => setIsOpen(false)}
                onConfirm={handleClose}
                isOpen={isOpen}
                className="retentionPoliciesConfirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="retention policy form"
            >
                <div className="confirmMessage">
                {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                <strong>{t("retention_policy_Form")}</strong>. {t("If_you_close_the_form")}, 
                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                <div className="confirmMessageBottom">
                {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                </div>
                </div>
            </CRXConfirmDialog>
                
        </div>
    )
}

export default RetentionPoliciesDetail;
