
import React, { useCallback, useEffect, useState } from "react";
import { CRXMultiSelectBoxAutocomplete, CRXRows, CRXColumn, CRXSelectBox, CRXButton, CRXTooltip } from "@cb/shared";
import {
    defaultPermissionType,
    defaultPermissionValue,
    defaultPermissionLevel,
    permissionTypes,
    permissionLevels
} from './TypeConstant/constants'
import { PermissionData, PermissionValue, Category, StationResponse } from './TypeConstant/types'
import "./dataPermission.scss"
import { DataPermissionModel } from "..";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getCategoryAsync } from "../../../../../Redux/categoryReducer";
import { getStationsInfoAllAsync } from "../../../../../Redux/StationReducer";

type infoProps = {
    dataPermissionsInfo: DataPermissionModel[],
    onChangeDataPermission: any,
    onDeletePermission: any,
    AssignToSelfPermission: any,
    setassignToSelfPermission: any,
}

const DataPermission: React.FC<infoProps> = ({ dataPermissionsInfo, onChangeDataPermission, onDeletePermission, AssignToSelfPermission, setassignToSelfPermission }) => {
    let [dataPermissions, setDataPermissions] = useState<PermissionData[]>([])
    const { t } = useTranslation<string>();
    let [categories, setCategories] = useState<PermissionValue[]>([]);
    let [stations, setStations] = useState<PermissionValue[]>([]);
    let [isdisable, setisDisable] = useState<Boolean>(true);
    let [crxDatapermissionClass, setCrxDatapermissionClass] = useState<string>("");

    const categoryFromReducer = useSelector((state: any) => state.assetCategory.category);
    const stationsFromReducer = useSelector((state: any) => state.stationReducer.stationInfo);

    const defaultPermission = {
        id: 0,
        type: { value: 0, label: "" },
        permissionValue: { value: 0, label: "" },
        permissionLevel: { value: 0, label: "" }
    }

    const dispatch = useDispatch();

    const disableAddPermission = () => {
        dataPermissions.map((obj) => {

            if ((obj.permissionValue.value > 0 || obj.permissionValue.value < 0) && obj.permissionLevel.value > 0) {
                setisDisable(false);
            }
            else {
                setisDisable(true)
            }
        })
    }


    useEffect(() => {
        disableAddPermission();
        if (dataPermissionsInfo.length > 0) {
            if (dataPermissions.filter((x: any) => x.type?.value === 3).length == 0) {
                let assignToSelfPermission = dataPermissionsInfo.find((x: any) => x?.fieldType === 3);
                if (assignToSelfPermission != undefined) {
                    setDataPermissions([...dataPermissions,{
                        id: assignToSelfPermission?.containerMappingId,
                        type: { value: assignToSelfPermission?.fieldType, label: "" },
                        permissionValue: { value: assignToSelfPermission?.fieldType, label: "" },
                        permissionLevel: { value: assignToSelfPermission?.permission, label: "" }
                    }]);
                }
            }
        }

    }, [dataPermissions])

    useEffect(()=>{
        if(dataPermissionsInfo.length <=0 ){
            addDefaultPermission();
        }
        loadStations();
        loadCateogories();
        setDataPermissions(prev => {
            return [...loadfilterDataPermission()
            ]
        })
    },[dataPermissionsInfo])

    

    const LoadCategoryPermissionsByDb = (categories: any) => {
        let dbDataPermission: PermissionData[] = [];
        dataPermissionsInfo.map((x: any | undefined) => {
            var cat = categories.find((y: any) => parseInt(y.value) == x.mappingId);

            if (x.fieldType == 2) {
                if (cat != undefined) {
                    dbDataPermission.push({
                        id: x.containerMappingId,
                        type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: cat.label },
                        permissionLevel: { value: x.permission, label: "" }
                    });
                }
                else {
                    dbDataPermission.push({
                        id: x.containerMappingId,
                        type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: "" },
                        permissionLevel: { value: x.permission, label: "" }
                    });
                }
            }
        });
        
        setDataPermissions(prev => {
            return [...prev,
            ...dbDataPermission
            ]
        })

    }
    const LoadStationPermissionsByDb = (stations: any) => {
        let dbDataPermission: PermissionData[] = [];
        dataPermissionsInfo.forEach((x: any | undefined) => {
            var station = stations.find((y: any) => parseInt(y.value) == x.mappingId);
            if (x.fieldType == 1) {
                if (station) {
                    dbDataPermission.push({
                        id: x.containerMappingId,
                        type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: station.label },
                        permissionLevel: { value: x.permission, label: "" }
                    });
                }
                else {
                    dbDataPermission.push({
                        id: x.containerMappingId,
                        type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: "" },
                        permissionLevel: { value: x.permission, label: "" }
                    });
                }
            }

        });

        setDataPermissions(prev => {
            return [...prev,
            ...dbDataPermission
            ]
        })
    }

    const LoadEmptyPermissionsByDb = () =>{
        let dbDataPermission: PermissionData[] = [];
        dataPermissionsInfo.filter(x => x.fieldType <= 0).forEach((x: DataPermissionModel | undefined) => {
            if(x){
                dbDataPermission.push({
                    id: x.containerMappingId,
                    type: { value: x.fieldType, label: "" },
                    permissionValue: { value: x.mappingId, label: "" },
                    permissionLevel: { value: x.permission, label: "" }
                });
            }             
        });        
        setDataPermissions(prev => {
            return [...prev,
            ...dbDataPermission
            ]
        })
    }

    const getData = useCallback(async () => {
        await dispatch(getStationsInfoAllAsync());
        await dispatch(getCategoryAsync());
    }, [dispatch]);

    useEffect(()=>{
        setDataPermissions([]);
        loadStations();
        loadCateogories();
        LoadEmptyPermissionsByDb();
        // if (dataPermissions !== undefined && dataPermissions.length > 0) {
        //     // LoadPermissionsByDb();
        // }
        // else {
        //     addDefaultPermission();
        // }
    },[stationsFromReducer,categoryFromReducer]);

    // useEffect(()=>{
    //     loadCateogories();
    //     if (dataPermissionsInfo !== undefined && dataPermissionsInfo.length > 0) {
    //         // LoadPermissionsByDb();
    //     }
    //     else {
    //         addDefaultPermission();
    //     }
    // },[categoryFromReducer]);

    useEffect(() => {

     if(stationsFromReducer && Object.keys(stationsFromReducer).length == 0 && 
        categoryFromReducer && Object.keys(categoryFromReducer).length == 0 )
        getData();
    }, [getData]);


    const loadCateogories = () => {
        if (categoryFromReducer && categoryFromReducer.length > 0) {
            let categoryList = [...categoryFromReducer];
            let categories = categoryList
                .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
                .map((x: Category) => {
                    return { value: x.id, label: x.name }
                });
            // categories.push({ value: -2, label: t('All') })
            // categories.push({ value: -1, label: t('Uncategorized') })
            setCategories(categories);
            LoadCategoryPermissionsByDb(categories);
        }
    }

    const loadStations = () => {
        if (stationsFromReducer && stationsFromReducer.length > 0) {
            let stationList = [...stationsFromReducer];
            const stationResp = stationList
                .sort((a: StationResponse, b: StationResponse) => a.name.localeCompare(b.name))
                .map((x: StationResponse) => {
                    return { value: (x.id), label: x.name };
                });
            // stationResp.push({ value: -2, label: t('All') })
            // stationResp.push({ value: -1, label: t('No_Station') })
            setStations(stationResp);
            LoadStationPermissionsByDb(stationResp);
        }
    }

    const loadfilterDataPermission = () => {
        let dataPermissionInfoString: any = [];
        dataPermissionsInfo.forEach((x: any) => {
            if(x.fieldType == 2){
                let dataPermissionCategory = categories.find((y: any) => parseInt(y.value) == x.mappingId);
                dataPermissionInfoString.push({
                    id: x.containerMappingId,
                    type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: dataPermissionCategory?.label },
                        permissionLevel: { value: x.permission, label: "" }
                });
            }
            else if(x.fieldType == 3)
            {
                dataPermissionInfoString.push({
                    id: x.containerMappingId,
                    type: { value: x.fieldType, label: "" },
                        permissionValue: { value: 3, label: "" },
                        permissionLevel: { value: x.permission, label: "" }
                });
            }
            else{
                let dataPermissionStation = stations.find((y: any) => parseInt(y.value) == x.mappingId);
                dataPermissionInfoString.push({
                    id: x.containerMappingId,
                    type: { value: x.fieldType, label: "" },
                        permissionValue: { value: x.mappingId, label: dataPermissionStation?.label },
                        permissionLevel: { value: x.permission, label: "" }
                });
            }
        });
        return dataPermissionInfoString;
    }

    const addDefaultPermission = () => {
        let dPermission = Object.assign({}, defaultPermission);

        setDataPermissions([...loadfilterDataPermission(),dPermission])
    }
    const setDataPermissionInfo = (permissions: PermissionData[]) => {
        let dataPermissionModel: any = [];
        permissions.map((x: PermissionData) => {
            dataPermissionModel.push({
                containerMappingId: x.id,
                fieldType: x.type.value,
                mappingId: x.permissionValue.value,
                permission: x.permissionLevel.value
            });
        });
        onChangeDataPermission(dataPermissionModel);
    }
    const onPermissionTypeChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let permissions = [...dataPermissions]

        if(permissions[i].type.value ==3 && parseInt(e.target.value) != 3)
        {
            permissions[i].permissionValue = { value: 0, label: "" };
        }
        permissions[i].type.value = parseInt(e.target.value);

        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
        setCrxDatapermissionClass("crxDatapermissionClass");
    }

    const onPermissionLevelChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let permissions = [...dataPermissions]
        permissions[i].permissionLevel.value = parseInt(e.target.value);

        if (permissions[i].type.value == 3) {
            permissions[i].permissionValue = { label: "", value: 3 }
        }

        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
        setCrxDatapermissionClass("crxDatapermissionClass");
    }

    const onPermissionValueChange = (e: React.ChangeEvent<HTMLInputElement>, v: any, i: number) => {

        let permissions = [...dataPermissions]
        if (v !== null) {
            if (v && v.value) {
                v.value = parseInt(v.value);
            }
            permissions[i].permissionValue = v;
        }
        else
            permissions[i].permissionValue = { value: 0, label: "" };

        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
    }

    const onAddPermission = () => {
        addDefaultPermission();
    }

    const onRemovePermission = (i: number) => {
        let permissions = loadfilterDataPermission();

        let permission = permissions[i];

        if (permission && permission.id && permission.id > 0) {
            onDeletePermission(permission.id);
        }
        permissions.splice(i, 1)

        if (permissions.length <= 0) {
            permissions.push(defaultPermission)
        }

        setDataPermissions([...permissions]);
        setDataPermissionInfo(permissions);

        if(permission?.type?.value == 3)
        {
            setassignToSelfPermission(
                {
                    id: -1,
                    permissionLevel: { value: 0, label: "" },
                    permissionValue: { value: 0, label: "" },
                    type: { value: 0, label: "" }
                }
            );
        }
    }

    const filterPermissionValuesBasedonType = (permissionType: number) => {
        if (permissionType > 0) {
            let selectedOptions = dataPermissions.filter(x => x.type.value === permissionType).map(x => x.permissionValue.value.toString());
            if (permissionType === 2) {
                return categories?.filter(x => !selectedOptions.includes(x.value.toString()))

            } else if (permissionType === 1) {
                return stations?.filter(x => !selectedOptions.includes(x.value.toString()))
            } else
                return []
        } else
            return []
    }
    return (

        <div className="crx-datapermission-tab">
            <div className="dataPermissionContent">
                <CRXRows container="container" spacing={0}>
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Permission_Type")}</CRXColumn>
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={6} spacing={0}>{t("Permission_Value")}</CRXColumn>
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>{t("Permission_Level")}</CRXColumn>
                </CRXRows>
            </div>
            <div className="crxPermissionPageScroll">
                <div>
                    <div className="crx-datapermission-col">                       
                        {
                            dataPermissions.map((permission, i) => {
                                return <div className="crx-datapermission-item" key={i}>
                                    <CRXRows container="container" spacing={0}>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={3} spacing={0}>
                                            <CRXSelectBox
                                                className={`adVSelectBox createUserSelectBox ${permission.type.value ? crxDatapermissionClass : ""}`}
                                                id={i}
                                                value={permission.type.value > 0 ? permission.type.value : t(defaultPermissionType)}
                                                onChange={(e: any) => onPermissionTypeChange(e, i)}
                                                options={(dataPermissions.filter((x: any) => x.type?.value === 3).length > 0 && permission.type.value != 3) ? permissionTypes.filter((x: any) => x.value != 3) : permissionTypes}
                                                icon={true}
                                                disablePortal={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOptionText={t(defaultPermissionType)}
                                                defaultValue={t(defaultPermissionType)} />
                                        </CRXColumn>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={6} spacing={0}>
                                            <CRXMultiSelectBoxAutocomplete
                                                className="adVSelectBox "
                                                disabled={(permission.type.value > 0 ? false : true)}
                                                options={permission.type.value == 3 ? [] : filterPermissionValuesBasedonType(permission.type.value)}
                                                multiple={false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>, v: any) => {



                                                    onPermissionValueChange(e, v, i)
                                                }}
                                                value={permission.permissionValue}
                                                placeHolder={permission.type.value == 3 ? "N/A" :defaultPermissionValue}
                                            />
                                        </CRXColumn>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={3} spacing={0}>
                                            <CRXSelectBox
                                                className={`adVSelectBox createUserSelectBox createUserSelectBoxLast ${permission.permissionLevel.value > 1 ? crxDatapermissionClass : ""}`}
                                                id={i}
                                                disabled={permission.type.value > 0 ? false : true}
                                                value={permission.permissionLevel.value > 0 ? permission.permissionLevel.value : defaultPermissionLevel}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPermissionLevelChange(e, i)}
                                                options={permissionLevels}
                                                icon={true}
                                                disablePortal={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOptionText={defaultPermissionLevel}
                                                defaultValue={defaultPermissionLevel}
                                            />
                                        </CRXColumn>
                                        <CRXColumn className="crx-permission-btn" container="container" item="item" xs={3} spacing={0} >
                                            {
                                                permission.type.value > 0 &&
                                                <button
                                                    className="removeBtn"
                                                    onClick={() => onRemovePermission(i)}
                                                ><CRXTooltip iconName="fas fa-circle-minus" arrow={false} title="remove" placement="bottom" className="crxTooltipNotificationIcon" /></button>
                                            }
                                        </CRXColumn>
                                    </CRXRows>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="crxPermissionBtnUSers">
                <CRXButton
                    disabled={isdisable}
                    className='PreSearchButton'
                    onClick={onAddPermission}
                    color='primary'
                    variant='contained'
                > {t("Add_data_permissions")}
                </CRXButton>
            </div>
        </div>

    )
}

export default DataPermission
