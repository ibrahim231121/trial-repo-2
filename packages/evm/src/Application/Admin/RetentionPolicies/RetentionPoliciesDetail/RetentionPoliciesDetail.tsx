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
    // const { id } = useParams<{ id: string }>();
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
        //setRetentionHours(remainingHours);  
        onRetentionHoursChange(remainingHours,days);
      }
      const setSoftDeleteTimeValue = (hours: number) => {
        let days =  parseInt(String(hours/24));
        let remainingHours = hours - (days * 24); 

        setSoftDeleteTimeDays(days);
        //setGracePeriodHours(remainingHours);  
        
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

       const onRetentionDaysChange = (hours: number,days: number) =>
       {
            setRetentionTimeDays(days);
            setRetentionTotalHourValue(hours,days);
       }
       
       const onRetentionHoursChange = (hours: number,days:number) =>
       {
            setRetentionHours(hours);
            setRetentionTotalHourValue(hours,days);
       }
       
       const onGraceDaysChange = (hours: number,days: number) =>
       {
            setSoftDeleteTimeDays(days);
            setGraceTotalPeriodHoursValue(hours,days);
       }
       
       const onGraceHoursChange = (hours: number,days: number) =>
       {
            setGracePeriodHours(hours);
            setGraceTotalPeriodHoursValue(hours,days);
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
        // for (let item in retentionPolicies) {
        //     isDataChanged = dataToEdit.current.retentionPolicies[item] != retentionPolicies;
        //     if (isDataChanged === true) {
        //         break;
        //     }
        // }
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


            // const onRetentionPolicyChange = (e: any, field: keyof RetentionPoliciesModel) => {
            //     let retentionPoliciesObj: RetentionPoliciesModel = {...retentionPolicy};
                
            //     let retentionPoliciesField = retentionPoliciesObj[field];
            //     if(typeof retentionPoliciesField === "number")  {
            //         retentionPoliciesField = e.target.value; 
            //     }
            //     else if(typeof retentionPoliciesField === "string")  {
            //         const value: string = e.target.value;                    
            //         retentionPoliciesField = value;
                    
            //     }
            //     // else if(typeof retentionPoliciesField.isDeleted === "DetailExpand.number")  {
            //     //     retentionPoliciesField = e.target.value; 
            //     // }
            //     (retentionPoliciesObj[field] as any) = retentionPoliciesField;
            //     setRetentionPolicies(retentionPoliciesObj);
            // }
        


    
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
                


                // response.retentionPolicy.forEach((item: {id: string, key: string, value: string}) => {
                // let property = retentionPoliciesObj[item.key as keyof RetentionPoliciesModel];
                // retentionPoliciesItem(property,item);
                // });

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

    // const checkStringValidation = (value: string,fieldName: string) => {
    //     let errorState = {...deviceSettingsValidation};
    //     if(!!value && value.toString().trim().length > 0) {
    //         errorState.name = ''
    //     } else {
    //         errorState.name = `${fieldName}_is_required`;
    //     }
    //     setDeviceSettingsValidation(errorState);
    // }
    // const checkNumberValidation = (value: number,fieldName: string) => {
    //     let errorState = {...deviceSettingsValidation};
    //     if(!!value && value > 0) {
    //         errorState.name = ''
    //     } else {
    //         errorState.name = `${fieldName}_is_required`;
    //     }
    //     setDeviceSettingsValidation(errorState);
    // }

    

   
  
    

    
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

    // const redirectPage = () => {    
    //         history.goBack();            
    // }
        
    const closeDialog = () => {
        // setIsOpen(false);
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
                {success && (
                  <CRXAlert
                    message={t("Success_You_have_saved_the_Retention_Policies")}
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
                <CRXModalDialog
                maxWidth="gl"
                title={props.title}
                className={'CRXModal ___CRXCreateRetentionPolicy__ ___CRXEditRetentionPolicy__ '}
                modelOpen={openModal}
                onClose={closeDialog}
                defaultButton={false}
                showSticky={false}
                closeWithConfirm={closeWithConfirm}
                >
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
                            // onBlur={() => checkStringValidation(name,"Name")}
                            
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
                                    // disableRipple={false}
                                    content={RadioTimePeriodBtnValues} 
                                    value={retentionType}
                                    setValue={(e: any) =>onRetentionTypeChange(RadioTimePeriodBtnValues[0].Name)}  
                                    checked={true}            
                                    name="radio-buttons"   
                                />

                                <CRXRadio
                                    className='crxEditRadioBtn'
                                    // disableRipple={true}
                                    content={RadioDiskSpaceBtnValues} 
                                    value={retentionType}
                                    setValue={(e: any)  => onRetentionTypeChange(RadioDiskSpaceBtnValues[0].Name)}    
                                    // checked={true}   
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
                                value={retentionTimeDays}
                                label={t("Retention_Time")}
                                className="retention-policies-input"
                                onChange={(e: any) => onRetentionDaysChange(retentionHours,e.target.value)}
                                disabled = {disableRetentionTimeDays}
                                type="number"
                                name="retentionTimeDays"
                                regex=""
                               
                                
                                // onBlur={() => checkNumberValidation(retentionTimeDays,"Retention Days")}
                                
                                />
                                <label>{t("Days")}<span></span></label>  

                                

                                < TextField                
                                value={retentionHours}
                                className="retention-policies-input"
                                onChange={(e: any) => onRetentionHoursChange(e.target.value,retentionTimeDays)}
                                disabled = {disableHours}
                                type="number"
                                name="retentionHours"
                                regex=""
                                min={0}
                                max={23}                                
                                // onBlur={() => checkNumberValidation(retentionHours,"Retention Hours")}                            
                                />
                                <label>{t("Hours")}<span></span></label>  


                                 {/* <div className="indefinite_checkBox_ui">
                                    <label>{t("Indefinite")}<span></span></label>   
                                    <CRXCheckBox                                    
                                     checked={unlimitedRetention}
                                    lightMode={true}
                                    className='crxCheckBoxCreate '
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onIndefiniteChange(e, 'indefinite')} />
                                
                                </div> */}
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
                                    value={softDeleteTimeDays}
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
                                    value={gracePeriodHours}                           
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


                            
            {/* <div className="settingsContent"> */}
                {/* <Grid container spacing={8} justify="flex-start">
                    <Grid item xs={12} sm={12} md={12} lg={5}>
                        <Grid container xs={12} sm={12} md={12} lg={12}>                           
                            <span className="gridFilterTextBox">
                            <CRXHeading variant="subtitle1" className="label">
                                {getFormatedLabel(t("Retention_Type"))}
                            </CRXHeading>
                                <CRXRadio
                                    className='crxEditRadioBtn'
                                    disableRipple={true}
                                    content={RadioTimePeriodBtnValues} 
                                    value={radioTimePeriod}
                                    setValue={(e: any) =>onRetentionTypeChange(RadioTimePeriodBtnValues[0].id)}                                    
                                />
                           
                        </span>
                        </Grid> */}

                        {/* { 
                        radioTimePeriod &&
                        (
                        <Grid>                           
                            <span className="gridFilterTextBox">
                           
                            < TextField
                            required={true}
                            value={retentionTimeDays}
                            label={t("Retention_Time")}
                            className="retention-policies-input"
                            onChange={(e: any) => setRetentionTimeDays(e.target.value)}
                            disabled = {disableRetentionTimeDays}
                            type="number"
                            name="retentionTimeDays"
                            regex=""
                            onBlur={() => checkNumberValidation(retentionTimeDays,"Retention Days")}
                            
                             />
                             <label>{t("Days")}<span></span></label>  

                           < TextField
                            required={false}
                            value={softDeleteTimeDays}
                            label={t("Soft_Delete_Time")}                            
                            className="retention-policies-input"
                            onChange={(e: any) => setSoftDeleteTimeDays(e.target.value)}
                            disabled = {disableSoftDeleteTimeDays}
                            type="number"
                            name="softDeleteTimeDays"
                            regex=""                            
                             />
                             <label>{t("Days")}<span></span></label>  

                            <div className="indefinite_checkBox_ui">
                                <label>{t("Indefinite")}<span></span></label>   
                               <CRXCheckBox                                    
                                     checked={unlimitedRetention}
                                    lightMode={true}
                                    className='crxCheckBoxCreate '
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onIndefiniteChange(e, 'indefinite')} />
                                
                            </div>
                        </span>
                        </Grid>
                        )
                        } */}
                         {/* { 
                        radioDiskSpace &&
                        (
                        <Grid container xs={12} sm={12} md={12} lg={12}>                           
                            <span className="gridFilterTextBox">
                           
                            < TextField
                            required={true}
                            value={retentionSize}
                            label={t("Retention_Size")}
                            className="retention-policies-input"
                            onChange={(e: any) => setRetentionSize(e.target.value)}
                            disabled = {false}
                            type="number"
                            name="retentionSize"
                            regex=""
                            onBlur={() => checkNumberValidation(retentionSize,"Retention Size")}
                            
                             />
                             <label>{t("GB")}<span></span></label>  

                       
                        </span>
                        </Grid>
                        )
                        } */}

                        <div className="retention-type">

                        { 
                        radioDiskSpace &&
                        (
                                                
                            <div className="days-hours">

                                {/* <Grid container xs={12} sm={12} md={12} lg={12}>                           
                                    <span className="gridFilterTextBox"> */}
                                
                                    < TextField
                                    required={true}
                                    value={retentionSize}
                                    label={t("Retention_Size")}
                                    className="retention-policies-input"
                                    onChange={(e: any) => setRetentionSize(e.target.value)}
                                    disabled = {false}
                                    type="number"
                                    name="retentionSize"
                                    regex=""
                                    // onBlur={() => checkNumberValidation(retentionSize,"Retention Size")}
                                    
                                    />
                                    <label>{t("GB")}<span></span></label>  

                            
                                {/* </span>
                                </Grid>            */}
                            </div>
                                                                    
                        )
                        }
                            
                        </div> 

                       
                    {/* </Grid>    
                    <div className='grid_spacer' />

                    <Grid item xs={12} sm={12} md={8} lg={4}>
                        <Grid container xs={12} sm={12} md={12} lg={12}>                           
                           
                        </Grid>
                        { 
                        radioTimePeriod &&
                        (
                        <Grid container xs={12} sm={12} md={12} lg={12}>                           
                            <span className="gridFilterTextBox">
                           
                            < TextField
                            required={false}
                            value={softDeleteTimeDays}
                            label={t("Soft_Delete_Time")}                            
                            className="retention-policies-input"
                            onChange={(e: any) => setSoftDeleteTimeDays(e.target.value)}
                            disabled = {disableSoftDeleteTimeDays}
                            type="number"
                            name="softDeleteTimeDays"
                            regex=""                            
                             />
                             <label>{t("Days")}<span></span></label>   

                           < TextField
                            required={false}
                            value={gracePeriodHours}                           
                            className="retention-policies-input"
                            onChange={(e: any) => setGracePeriodHours(e.target.value)}
                            disabled = {disableGracePeriodHours}
                            type="number"
                            name="gracePeriodHours"
                            regex=""                            
                             />
                             <label>{t("Hours")}<span></span></label>  
                            
                        </span>
                        </Grid>
                        )
                        }
                    </Grid>   

                </Grid> */}
            {/* </div> */}
            
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
