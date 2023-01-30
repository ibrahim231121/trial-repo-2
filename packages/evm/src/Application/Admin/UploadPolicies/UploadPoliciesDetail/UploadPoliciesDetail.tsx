import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { useHistory, useParams } from "react-router";
import { CRXMultiSelectBoxLight, CRXButton, CRXConfirmDialog, CRXRows, CRXColumn, CRXSelectBox, TextField,CRXTooltip,CRXToaster } from "@cb/shared";
import {useTranslation } from "react-i18next";
import { defaultType, defaultUpload, defaultMetadataUploadConnection, defaultAssetUploadPriority,  defaultAssetUploadConnection } from '../TypeConstant/constants';
import { UploadPolicyDetailModel, SelectBoxType, UploadPolicyDropdownModel, SelectConnectionLevel } from '../TypeConstant/types';
import Grid from "@material-ui/core/Grid";
import './uploadPoliciesDetail.scss';
import {SetupConfigurationAgent} from '../../../../utils/Api/ApiAgent';
import {enterPathActionCreator} from '../../../../Redux/breadCrumbReducer';
import { useDispatch,useSelector } from "react-redux";
import { getAllUploadPoliciesInfoAsync, getAllData } from "../../../../Redux/UploadPolicies"; 
import { RootState } from "../../../../Redux/rootReducer";
import { urlList, urlNames } from "../../../../utils/urlList";
import { PageiGrid } from "../../../../GlobalFunctions/globalDataTableFunctions";

type UploadPoliciesDetailProps = {
    id: string
}

const UploadPoliciesDetail: FC<UploadPoliciesDetailProps> = () => {
    const defaultUploadPolicyDetail = {
        id: 0,
        assetType: { value: -1, displayText: "" },
        uploadType: { value: 0, displayText: "" },
        metadataUploadConnection: [],
        assetUploadPriority: { value: 0, displayText: "" },
        assetUploadConnection: []            
    }
    const [uploadPolicyDetailDropdownData, setUploadPolicyDetailDropdownData] = useState<UploadPolicyDropdownModel>({
        assetTypeList: [],
        uploadTypeList: [],
        metadataUploadConnectionList: [],
        assetUploadPriorityList: [],
        assetUploadConnectionList: []   
    });
    
    const uploadPolicyDetailDropdownDataRef = useRef<UploadPolicyDropdownModel>({
        assetTypeList: [],
        uploadTypeList: [],
        metadataUploadConnectionList: [],
        assetUploadPriorityList: [],
        assetUploadConnectionList: []   
    });

    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [uploadPolicyDetail, setUploadPolicyDetail] = useState<UploadPolicyDetailModel[]>([defaultUploadPolicyDetail]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isAddUploadPolicyDetailDisable, setIsAddUploadPolicyDetailDisable] = useState<boolean>(true);
    const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
    const isFirstRenderRef = useRef<boolean>(true);
    const [deleteUploadPolicyTypesIds, setDeleteUploadPolicyTypesIds] = useState<number[]>([])
    const initialState = useRef<any>({});
    const updatedState = useRef<any>({});
    const dataResponseToEdit = useRef<any>(null);
    const dataToEdit = useRef<any>(null);
    const uploadMsgFormRef = useRef<typeof CRXToaster>(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const getAll: any = useSelector((state: RootState) => state.uploadPoliciesSlice.getAll);
    const [UploadPolicyDetailErr, setUploadPolicyDetailErr] = React.useState({
        nameErr: "",
      });
    const isAddCase = isNaN(+id);
    const { t } = useTranslation<string>();
    const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
        gridFilter: {
          logic: "and",
          filters: []
        },
        page: 1,
        size: 25,
        gridSort: {
          field: "name",
          dir: "asc"
        }
      })
    
    useEffect(() => {
        return () => {
            dispatch(enterPathActionCreator({ val: "" }));
        }
    }, []);
    
    React.useEffect(() => {
        uploadPolicyDetailDropdownDataRef.current = uploadPolicyDetailDropdownData; 
      }, [uploadPolicyDetailDropdownData]);

    useEffect(() => {
        if(!isFirstRenderRef.current) {
            if(!checkNameValidation() && !disableAddUploadPolicyDetailBtn()) {
                setIsSaveDisable(false);
            }
            else{
                setIsSaveDisable(true); 
            }
            UploadpolicyDetailUpdated();
        }
    }, [name,uploadPolicyDetail,description])


    const UploadpolicyDetailUpdated = () => {
            updatedState.current = {
                name:name,
                description:description,
                dataUploadPolicyTypes:uploadPolicyDetail
            }
        initialUpdatedHandler();
    }


    useEffect(() => {
        disableAddUploadPolicyDetail();
    },[uploadPolicyDetail])

    useEffect(() => {
        if(getAll != null) {
            
            let newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel = {
                assetTypeList: [],
                uploadTypeList: [],
                metadataUploadConnectionList: [],
                assetUploadPriorityList: [],
                assetUploadConnectionList: []                
            }
                       
            assetTypesData(newUploadPolicyDetailDropdownData);
            uploadTypesData(newUploadPolicyDetailDropdownData);
            metaDataConnectionsData(newUploadPolicyDetailDropdownData);                 
            assetUploadPrioritiesData(newUploadPolicyDetailDropdownData);        
            assetUploadConnectionsData (newUploadPolicyDetailDropdownData);
            setUploadPolicyDetailDropdownData(newUploadPolicyDetailDropdownData);
        }
    }, [getAll]);

    useEffect(() => {
        dispatch(getAllData());
        dispatch(enterPathActionCreator({ val: "" }));
        isFirstRenderRef.current = false;
        if (!isAddCase) {
            addCaseHandler();
        }
        return () => {
            dispatch(enterPathActionCreator({ val: "" }));
            uploadMsgFormRef.current = null;
        }
    }, [isAddCase]);
    
    const initialUpdatedHandler = () => {
        if(initialState.current && updatedState.current && !checkNameValidation() && !disableAddUploadPolicyDetailBtn()){
            if(JSON.stringify(initialState.current)== JSON.stringify(updatedState.current)){
                setIsSaveDisable(true);
            }
            else{
                setIsSaveDisable(false);
            }
        }
    }
    
    const addCaseHandler =() => {
        SetupConfigurationAgent.getUploadPolicies(Number(id))
            .then((response : any) => {
                return response
            })
            .then((Uploadpolicy:any) => {
                
                setName(Uploadpolicy.name); 
                setDescription(Uploadpolicy.description);
                let uploadPolicyDetailArray : any[] = [];
                setDeleteUploadPolicyTypesIds([]);
                let uploadPolicyDetailArrayCopy : any[] = [];
                UploadPolicyDetailItem(Uploadpolicy, uploadPolicyDetailArray);
                initialState.current = {
                    name:Uploadpolicy.name,
                    description:Uploadpolicy.description,
                    dataUploadPolicyTypes:JSON.parse(JSON.stringify(uploadPolicyDetailArray)),
                }
                initialUpdatedHandler();
                setUploadPolicyDetail(uploadPolicyDetailArray);    
                dispatch(enterPathActionCreator({ val: Uploadpolicy.name }));
                uploadPolicyDetailArrayCopy = JSON.parse(JSON.stringify(uploadPolicyDetailArray));
                const temp = {                
                    uploadPolicyDetail: [...uploadPolicyDetailArrayCopy]
                };
                EditCloseHandler(temp); 
                dataResponseToEdit.current = Uploadpolicy;
            })
            .catch((err: any) => {
                console.error(err);
            });
    }

    const assetUploadConnectionsData = (newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel) => {
        if (Array.isArray(getAll.dataConnectionJsonTypes)) {
            const newAssetUploadConnections = getAll.dataConnectionJsonTypes.map((item: any) => {
                return ({ value: item.key, label: item.value });
            });
            newUploadPolicyDetailDropdownData.assetUploadConnectionList =  Array.isArray(newAssetUploadConnections) ? newAssetUploadConnections : [];;
        }
    }
    const assetUploadPrioritiesData = (newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel) => {
        if (Array.isArray(getAll.assetUploadPriorityTypes)) {
            const newAssetUploadPriorities = getAll.assetUploadPriorityTypes.map((item: any) => {
                return ({ value: item.key, displayText: item.value });
            });
            newUploadPolicyDetailDropdownData.assetUploadPriorityList =  Array.isArray(newAssetUploadPriorities) ? newAssetUploadPriorities : [];;
        }
    }
    const uploadTypesData = (newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel) => {
        if (Array.isArray(getAll.uploadTypes)) {
            const newUploadTypes = getAll.uploadTypes.map((item: any) => {
                return ({ value: item.key, displayText: item.value });
            });
            newUploadPolicyDetailDropdownData.uploadTypeList =  Array.isArray(newUploadTypes) ? newUploadTypes : [];;
        }
    }
    
    const metaDataConnectionsData = (newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel) => {
        if (Array.isArray(getAll.metaDataUploadConnectionTypes)) {
            const newMetaDataConnections = getAll.metaDataUploadConnectionTypes.map((item: any) => {
                return ({ value: item.key, label: item.value });
            });
            newUploadPolicyDetailDropdownData.metadataUploadConnectionList = Array.isArray(newMetaDataConnections) ? newMetaDataConnections : [];
        }
    }
    
    const assetTypesData = (newUploadPolicyDetailDropdownData: UploadPolicyDropdownModel) => {
        if (Array.isArray(getAll.assetTypes)) {
            const newAssetTypes = getAll.assetTypes.map((item: any) => {
                return ({ value: item.key, displayText: item.value });
            });
            newUploadPolicyDetailDropdownData.assetTypeList = Array.isArray(newAssetTypes) ? newAssetTypes : [];
        }
    }
  const EditCloseHandler =( temp : any) => {
    if (dataToEdit.current == null) {
        dataToEdit.current = { ...temp };
    }
   }

   const UploadPolicyDetailItem = (response: any, uploadPolicyDetailArray: any[]) => {
    response.dataUploadPolicyTypes.forEach((item: any) => {
        let uploadPolicyDetailObj = {} as UploadPolicyDetailModel;
        uploadPolicyDetailObj.id = item.id;
        let assetTypeId: any = uploadPolicyDetailDropdownDataRef.current.assetTypeList.find((val: any) => val.displayText == item.typeOfAsset)?.value ?? -1;
        let assetUploadPriorityId: any = uploadPolicyDetailDropdownDataRef.current.assetUploadPriorityList.find((val: any) => (val.displayText == item.priority) ? val.value : 0);            

        uploadPolicyDetailObj.assetType = {
            value: assetTypeId,
            displayText: item.typeOfAsset
        };
        uploadPolicyDetailObj.uploadType = {
            value: item.upload == true? 1: 2,
            displayText: item.upload == true? "Yes": "No"
        };

        if (isValidJSON(item.connection.metadata)) 
        {
            let metadata = JSON.parse(item.connection.metadata);

            uploadPolicyDetailObj.metadataUploadConnection = Object.keys(metadata).map((name: any) => {
                let id = metadata[name];
                return ({ value: id, label: name});
            });
        }
        
        uploadPolicyDetailObj.assetUploadPriority = {
            value: assetUploadPriorityId.value,
            displayText: item.priority
        };

        if (isValidJSON(item.connection.data)) 
        {
            let uploadConnection = JSON.parse(item.connection.data);

            uploadPolicyDetailObj.assetUploadConnection = Object.keys(uploadConnection).map((name: any) => {
                let id = uploadConnection[name];
                return ({ value: id, label: name });
            });
        }
        uploadPolicyDetailArray.push(uploadPolicyDetailObj);
        });
    }

    const validatePolicyName = ( name: string):{ error: boolean; errorMessage: string } => {
        const chracterRegx = /^^[a-zA-Z]+[a-zA-Z0-9-_ \b]*$/.test(String(name).toLowerCase());
        if (!chracterRegx) {
          return { error: true, errorMessage: t("Please_provide_a_valid_policy_name") };
        } else if (name.length < 3) {
          return {
            error: true,
            errorMessage: t("Policy_Name_must_contains_atleast_three_characters"),
          };
        } else if (name.length > 128) {
          return {
            error: true,
            errorMessage: t("Policy_Name_must_not_exceed_128_characters"),
          };
        }
        return { error: false, errorMessage: "" };
      };

    const checkNameValidation = () => {
        let isDisable = true;
        const isPolicyNameValid = validatePolicyName(name);
        if (!name) {
            setUploadPolicyDetailErr({
            ...UploadPolicyDetailErr,
            nameErr: t("Policy_Name_is_required"),
          });
        } else if (isPolicyNameValid.error) {
            setUploadPolicyDetailErr({
            ...UploadPolicyDetailErr,
            nameErr: isPolicyNameValid.errorMessage,
          });
        } else {
            setUploadPolicyDetailErr({ ...UploadPolicyDetailErr, nameErr: "" });
            isDisable = false;
        }
        return isDisable;
    };

    const disableAddUploadPolicyDetail = () => {
        uploadPolicyDetail.forEach((obj) => {
            if(obj.assetType.value > -1 && obj.uploadType.value > 0 && obj.metadataUploadConnection.length  > 0 && obj.assetUploadPriority.value > 0 
                && obj.assetUploadConnection.length > 0 ) {
                setIsAddUploadPolicyDetailDisable(false);
            } else{
                setIsAddUploadPolicyDetailDisable(true);
            }
         });
    }
    
    
    const disableAddUploadPolicyDetailBtn = () => {
        let isDisable = false;       

        uploadPolicyDetail.forEach((obj) => {
            if(obj.assetType.value > -1 && obj.uploadType.value > 0 && obj.metadataUploadConnection.length  > 0 && obj.assetUploadPriority.value > 0 
                && obj.assetUploadConnection.length > 0 ) {
            } else{
                isDisable = true
            }
         });
        return isDisable;
    }

    const addDefaultUploadPolicyDetail = () => {
        let defaultParameterData = Object.assign({}, defaultUploadPolicyDetail);
        setUploadPolicyDetail(parameter => { return [...parameter, defaultParameterData]})
    }

    const onAddUploadPolicyDetail = () => {
        addDefaultUploadPolicyDetail();
    }
    const isValidJSON = (stringData: string) => {
        try {
            JSON.parse(stringData);
            return true
        } catch (e){
            return false
        }
    };

    const onRemoveUploadPolicyDetail = (i: number) => {
        let parameters = [...uploadPolicyDetail];
        let parameter = parameters[i];
        
        if (parameter && parameter.id && parameter.id > 0) {
            if(id) {
                setDeleteUploadPolicyTypesIds([...deleteUploadPolicyTypesIds, parameter.id]);
            }
        }
        parameters.splice(i, 1)

        if (parameters.length <= 0) {
            parameters.push(defaultUploadPolicyDetail);
        }
        
        setUploadPolicyDetail([...parameters]);
    }

    const onUploadPolicyDetailChange = (e: ChangeEvent<HTMLInputElement>, idx: number, field: keyof UploadPolicyDetailModel) => {
        let parameters = [...uploadPolicyDetail];
   
        (parameters[idx][field] as SelectBoxType).value = parseInt(e.target.value);
    
        if (parameters[idx] != null) {
            if (parameters[idx].assetType.value > -1 && parameters[idx].uploadType.value > 0 
                && parameters[idx].metadataUploadConnection.length > 0 && parameters[idx].assetUploadPriority.value > 0 
                && parameters[idx].assetUploadConnection.length > 0 ) {
                isFirstRenderRef.current = false;
            }
        }
        
        setUploadPolicyDetail(parameters);
    }

    const onUploadPolicyDetailConnectionChange = (e: React.SyntheticEvent,values: SelectConnectionLevel[], idx: number, field: keyof UploadPolicyDetailModel) => {
        let parameters = [...uploadPolicyDetail];
        (parameters[idx][field] as SelectConnectionLevel[]) = values;
    
        if (parameters[idx] != null) {
            if (parameters[idx].assetType.value > -1 && parameters[idx].uploadType.value > 0 
                && parameters[idx].metadataUploadConnection.length > 0 && parameters[idx].assetUploadPriority.value > 0 
                && parameters[idx].assetUploadConnection.length > 0 ) {
                isFirstRenderRef.current = false;
            }
        }

        setUploadPolicyDetail(parameters);
    }

    const  convertArrayToConnectionJsonString = (arrayValues: SelectConnectionLevel[]) =>
    {
        let obj: any = {};
        arrayValues.forEach((item:SelectConnectionLevel) => {
             obj[item.label] = Number(item.value)
          });
     
        return JSON.stringify(obj);    
    }

    const UploadPolicyDetailsPayload = (uploadPolicyDetail: UploadPolicyDetailModel[], uploadPolicyDetailDropdownData: UploadPolicyDropdownModel, listUploadPolicyDetailValues: any[]) => {
        uploadPolicyDetail.forEach((item) => {
            let assetTypeName: any = uploadPolicyDetailDropdownData.assetTypeList.find((val: any) => (val.value == item.assetType.value) ? val.displayText : '');
            let uploadTypeName: any = uploadPolicyDetailDropdownData.uploadTypeList.find((val: any) => (val.value == item.uploadType.value) ? val.displayText : '');            
            var metadataUploadConnectionWithName = item.metadataUploadConnection.map((metadataItem:any)=> {   
                let metadataUploadConnectionName: any =uploadPolicyDetailDropdownData.metadataUploadConnectionList.find((val: any) => (val.value == metadataItem.value) ? val.label : '')
                let returnMetadata: SelectConnectionLevel = {
                    value:metadataItem.value.toString(),
                    label: metadataUploadConnectionName['label']                 
                };
                return returnMetadata;
            });
            
            let assetUploadPriorityName: any = uploadPolicyDetailDropdownData.assetUploadPriorityList.find((val: any) => (val.value == item.assetUploadPriority.value) ? val.displayText : '');            

            var assetUploadConnectionWithName = item.assetUploadConnection.map((assetUploadItem:any)=> {   
                let assetUploadConnectionName: any =uploadPolicyDetailDropdownData.assetUploadConnectionList.find((val: any) => (val.value == assetUploadItem.value) ? val.label : '')
                let returnAssetUpload: SelectConnectionLevel = {
                    value:assetUploadItem.value.toString(),
                    label: assetUploadConnectionName['label']                 
                };
                return returnAssetUpload;
            });
            
            const UploadPolicyTypesValue = {
                id: item.id,
                typeOfAsset:String(assetTypeName['displayText']),
                upload: item.uploadType.value == 1 ? true: false,
                connection:{
                    metadata : convertArrayToConnectionJsonString(metadataUploadConnectionWithName), 
                    data: convertArrayToConnectionJsonString(assetUploadConnectionWithName) 
                },
                priority: String(assetUploadPriorityName['displayText'])
                
            };


            listUploadPolicyDetailValues.push(UploadPolicyTypesValue);
        });
    }

    
    const setAddPayload:any = () => {
       
        const listUploadPolicyDetail: any[] = [];
        const UploadPolicy ="DataUpload";
       
        UploadPolicyDetailsPayload(uploadPolicyDetail, uploadPolicyDetailDropdownData, listUploadPolicyDetail);
        const uploadPolicy = {
            id : id ? id :'0',                       
            name :name,
            description : description,
            type : UploadPolicy,            
            detail: [],
            dataUploadPolicyTypes : listUploadPolicyDetail,
            deleteUploadPolicyTypesIds : deleteUploadPolicyTypesIds
        }        
          return uploadPolicy;
      }

    const onSave = async () => {
        const payload = setAddPayload();
    
          if(isAddCase)
          {
            SetupConfigurationAgent.postUploadPoliciesTemplate('Policies',payload).then((res:any)=>{ 
                  onMessageShow(true,t("Success_You_have_saved_the_Upload_Policy"));
                  dispatch(enterPathActionCreator({ val: payload.name }));
                  const path = `${urlList.filter((item: any) => item.name === urlNames.uploadPoliciesEdit)[0].url}`;
                  history.push(path.substring(0, path.lastIndexOf("/")) + "/" + res);
                  setIsSaveDisable(true);
                  
              })
              .catch(function(error) {      
                  if(error) {
                    onMessageShow(false,error?.response?.data?.toString());
                    return error;
                  }
                });
          }
          else
          {
                SetupConfigurationAgent.putUploadPoliciesTemplate(`Policies/${id}`,payload).then((res:any)=>{
                addCaseHandler();
                dispatch(enterPathActionCreator({ val: payload.name }));   
                onMessageShow(true,t("Success_You_have_updated_the_Upload_Policy"));
                dispatch(getAllUploadPoliciesInfoAsync(pageiGrid));
                
            })
            .catch(function(error) {      
                if(error?.response?.status === 405) {
                  onMessageShow(false,error?.response?.data?.toString());
                  return error;
                }
              });
          }
        }

    const UploadPolicyDetailDataChanged = (isDataChanged: boolean, uploadPolicyDetail: UploadPolicyDetailModel[]) => {
        if (isDataChanged === false) {
            if (dataResponseToEdit.current.name == name && dataResponseToEdit.current.description == description &&  
                uploadPolicyDetail.length === dataToEdit.current.uploadPolicyDetail.length ) {
                for (let idx = 0; idx < uploadPolicyDetail.length; idx++) {
                    for (let items in uploadPolicyDetail[idx]) {
                        let currentValue = uploadPolicyDetail[idx][items  as keyof UploadPolicyDetailModel];                    
                        if((currentValue as  SelectBoxType).value != undefined )
                        {
                            let previousItem = (dataToEdit.current.uploadPolicyDetail[idx][items] as SelectBoxType);
                            let currentItem = (currentValue as SelectBoxType);

                            isDataChanged = previousItem.value != currentItem.value || previousItem.displayText != currentItem.displayText;                            
                        }
                        else if (Array.isArray( (currentValue as  SelectConnectionLevel[]) ))
                        {
                            let previousItem = (dataToEdit.current.uploadPolicyDetail[idx][items] as SelectConnectionLevel[]);
                            let currentItem = (currentValue as SelectConnectionLevel[]);

                            
                            isDataChanged = JSON.stringify(previousItem) != JSON.stringify(currentItem);
                        }
                        else
                            isDataChanged = dataToEdit.current.uploadPolicyDetail[idx][items] != currentValue;


                        if (isDataChanged === true) {
                            break;
                        }
                    }
                    if (isDataChanged === true) {
                        break;
                    }
                }
            }
    
            else
                isDataChanged = true;
        }
        return isDataChanged;
    }

    const redirectPage = () => {
        if(dataToEdit.current != null) {
                let isDataChanged = false;
                isDataChanged = UploadPolicyDetailDataChanged(isDataChanged, uploadPolicyDetail);              
                if(isDataChanged === true) {
                    setIsOpen(true)
                }   
                else
                closeBtnHandler();
            }
            else {
                closeBtnHandler();
            }
        }
        
    const closeDialog = () => {
        setIsOpen(false);
        history.goBack();
    };

    const closeBtnHandler = () => {
        const path = `${urlList.filter((item: any) => item.name === urlNames.uploadPolicies)[0].url}`;
        history.push(path);
    }
    
    const UploadFormMessages = (obj: any) => {
        uploadMsgFormRef?.current?.showToaster({
          message: obj.message,
          variant: obj.variant,
          duration: obj.duration,
          clearButtton: true,
        });
      }
    
      const onMessageShow = (isSuccess:boolean,message: string) => {
        UploadFormMessages({
          message: message,
          variant: isSuccess? 'success' : 'error',
          duration: 7000
        });    
      }

    return (
        
        <div className="upload-policies">
            <CRXToaster ref={uploadMsgFormRef} />
                <div className="updated-policy-fields">
                    <div className="nameFieldUploadPolicy">
                        <Grid  item xs={12} sm={12} md={12} lg={5}>
                            <TextField
                            error ={!!UploadPolicyDetailErr.nameErr}
                            errorMsg={UploadPolicyDetailErr.nameErr}
                            required={true}
                            value={name}
                            label={t("Name")}
                            className="upload-policies-input"
                            onChange={(e: any) => setName(e.target.value)}
                            disabled = {false}
                            type="text"
                            name="uploadPoliciesName"
                            regex=""
                            onBlur={() => checkNameValidation()}
                            />
                        </Grid>
                    </div>
                    <div className="nameFieldUploadPolicy">
                    
                        <Grid  item xs={12} sm={12} md={12} lg={5}>                           
                            <TextField                            
                            required={false}
                            value={description}
                            label={t("Description")}
                            className="upload-policies-input"
                            onChange={(e: any) => setDescription(e.target.value)}
                            disabled = {false}
                            type="text"
                            name="uploadPoliciesDescription"
                            regex=""
                            multiline={true}
                            />
                        </Grid>
                    </div>
                </div>
         
            <div className="uploadPolicyDetailContent">             
                <div className="uploadPolicyDetailHeader">
                    <CRXRows container spacing={0}>
                        <CRXColumn className="uploadPolicyDetailColumn" container item xs={1} spacing={0}>{t("Type")}</CRXColumn>
                        <CRXColumn className="uploadPolicyDetailColumn" container="container" item xs={1} spacing={0}>{t("Upload")}</CRXColumn>
                        <CRXColumn className="uploadPolicyDetailColumn" container="container" item xs={3} spacing={0}>{t("Metadata_Upload_Connection")}</CRXColumn>
                        <CRXColumn className="uploadPolicyDetailColumn" container="container" item xs={3} spacing={0}>{t("Asset_Upload_Priority")}</CRXColumn>
                        <CRXColumn className="uploadPolicyDetailColumn" container="container" item xs={4} spacing={0}>{t("Asset_Upload_Connection")}</CRXColumn>
                    </CRXRows>
                </div>
                <div className="uploadPolicyDetailPageScroll">
                    <div className="uploadPolicyDetailColumnContent">
                        {
                            uploadPolicyDetail?.map((uploadPolicyDetail, idx) => {
                                return <div className="uploadPolicyDetailColumnItem" key={idx}>
                                    <CRXRows container="container" spacing={0}>
                                        <CRXColumn className="uploadPolicyDetailCol" item xs={1}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`upload-policy-detail-type-${idx}`}
                                                value={uploadPolicyDetail.assetType.value > -1 ? uploadPolicyDetail.assetType.value : defaultType}
                                                onChange={(e: any) => onUploadPolicyDetailChange(e, idx, 'assetType')}
                                                options={uploadPolicyDetailDropdownData.assetTypeList}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                disabled={false}
                                                defaultOption={true}
                                                defaultOptionText={defaultType}
                                                defaultValue={defaultType} />
                                        </CRXColumn>
                                        <CRXColumn className="uploadPolicyDetailCol" item xs={1}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`upload-policy-detail-upload-${idx}`}                                                
                                                value={uploadPolicyDetail.uploadType.value > 0 ? uploadPolicyDetail.uploadType.value : defaultUpload}
                                                onChange={(e: any) => onUploadPolicyDetailChange(e, idx, 'uploadType')}
                                                options={uploadPolicyDetailDropdownData.uploadTypeList}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOption={true}
                                                defaultOptionText={defaultUpload}
                                                defaultValue={defaultUpload}                                                                                        
                                            />
                                           
                                        </CRXColumn>
                                        <CRXColumn className="uploadPolicyDetailCol" item xs={3}>
                                           

                                            <CRXMultiSelectBoxLight
                                                className="metadataUploadAutocomplete"                                                
                                                multiple={true}
                                                CheckBox={true}
                                                required={true}
                                                options={uploadPolicyDetailDropdownData.metadataUploadConnectionList}
                                                value={uploadPolicyDetail.metadataUploadConnection}
                                                autoComplete={false}
                                                isSearchable={true}                                                
                                                onChange={(
                                                    _e: React.SyntheticEvent, value: SelectConnectionLevel[]
                                                ) => {
                                                    onUploadPolicyDetailConnectionChange(_e,value,idx,'metadataUploadConnection');                                           
                                                }}
                                                placeHolder={defaultMetadataUploadConnection}
                                                />

                                        </CRXColumn>
                                        <CRXColumn className="uploadPolicyDetailCol" item xs={3}>
                                            <CRXSelectBox
                                                className="select-box"
                                                id={`upload-policy-detail-asset-upload-priority-${idx}`}                                                
                                                value={uploadPolicyDetail.assetUploadPriority.value > 0 ? uploadPolicyDetail.assetUploadPriority.value : defaultAssetUploadPriority}
                                                onChange={(e: any) => onUploadPolicyDetailChange(e, idx, 'assetUploadPriority')}
                                                options={uploadPolicyDetailDropdownData.assetUploadPriorityList}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOption={true}
                                                defaultOptionText={defaultAssetUploadPriority}
                                                defaultValue={defaultAssetUploadPriority} />
                                        </CRXColumn>
                                        <CRXColumn className="uploadPolicyDetailCol" item xs={4}>
                                         
                                            <CRXMultiSelectBoxLight
                                                className="assetUploadAutocomplete"                                                
                                                multiple={true}
                                                CheckBox={true}
                                                required={true}
                                                options={uploadPolicyDetailDropdownData.assetUploadConnectionList}
                                                value={uploadPolicyDetail.assetUploadConnection}
                                                autoComplete={false}
                                                isSearchable={true}                                                
                                                onChange={(
                                                    _e: React.SyntheticEvent, value: SelectConnectionLevel[]
                                                ) => {
                                                    onUploadPolicyDetailConnectionChange(_e,value,idx,'assetUploadConnection');                                           
                                                }}
                                                placeHolder={defaultAssetUploadConnection}
                                                />


                                        </CRXColumn>
                                        <CRXColumn className="uploadPolicyDetailBtnRemove" container item xs={3} spacing={0}>
                                            {
                                                <button
                                                    className="removeBtn"
                                                    onClick={() => onRemoveUploadPolicyDetail(idx)}
                                                ><CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="remove" placement="bottom" className="crxTooltipNotificationIcon"/></button>
                                            }
                                        </CRXColumn>
                                    </CRXRows>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="uploadPolicyDetailBtnAdd">
                    <CRXButton
                        disabled ={isAddUploadPolicyDetailDisable}
                        className='PreSearchButton'
                        onClick={onAddUploadPolicyDetail}
                        color='primary'
                        variant='contained'
                    > {t("Add_policy_rules")}
                    </CRXButton>
                </div>
            </div>

            
            
            <div className="tab-bottom-buttons">
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
                    onClick={closeBtnHandler}
                >
                    {t("Cancel")}
                </CRXButton>
                </div>
                <div>
                <CRXButton
                    onClick={() => redirectPage()}
                    className="groupInfoTabButtons-Close secondary"
                    color="secondary"
                    variant="outlined"
                    >
                {t("Close")}
                </CRXButton>
                </div>
            </div>
            <CRXConfirmDialog
                setIsOpen={() => setIsOpen(false)}
                onConfirm={closeDialog}
                isOpen={isOpen}
                className="uploadPolicyConfirm"
                primary={t("Yes_close")}
                secondary={t("No,_do_not_close")}
                text="user group form"
            >
                <div className="confirmMessage">
                {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                <strong>{t("Upload Policies Form")}</strong>. {t("If_you_close_the_form")}, 
                {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                <div className="confirmMessageBottom">
                {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                </div>
                </div>
            </CRXConfirmDialog>
        </div>
    )
}

export default UploadPoliciesDetail
