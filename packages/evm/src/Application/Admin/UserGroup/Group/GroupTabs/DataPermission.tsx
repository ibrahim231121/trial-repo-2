
import React, { useEffect, useState } from "react";
import { CRXMultiSelectBoxAutocomplete, CRXRows, CRXColumn, CRXSelectBox, CRXButton } from "@cb/shared";
import {
    defaultPermissionType,
    defaultPermissionValue,
    defaultPermissionLevel,
    permissionTypes,
    permissionLevels
} from './TypeConstant/constants'
import { PermissionData, PermissionValue, Category, Station, StationResponse } from './TypeConstant/types'
import "./dataPermission.scss"
import { DataPermissionModel } from "..";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


type infoProps = {
    dataPermissionsInfo: DataPermissionModel[],
    onChangeDataPermission: any,
    onDeletePermission: any
}


const DataPermission: React.FC<infoProps> = ({ dataPermissionsInfo, onChangeDataPermission, onDeletePermission }) => {
    let [dataPermissions, setDataPermissions] = useState<PermissionData[]>([])
    const { t } = useTranslation<string>();
    let [categories, setCategories] = useState<PermissionValue[]>([]);
    let [stations, setStations] = useState<PermissionValue[]>([]);
    let [isdisable, setisDisable] = useState<Boolean>(true);
    let [crxDatapermissionClass, setCrxDatapermissionClass] = useState<string>("");

    const categoryFromReducer =  useSelector((state: any) => state.assetCategory.category);
    const stationsFromReducer = useSelector((state: any) => state.stationReducer.stationInfo);

    const defaultPermission = {
        id: 0,
        type: { value: 0, label: "" },
        permissionValue: { value: 0, label: "" },
        permissionLevel: { value: 0, label: "" }
    }

    const disableAddPermission = () => {
        dataPermissions.map((obj) => {
            
            if((obj.permissionValue.value > 0 || obj.permissionValue.value < 0)  && obj.permissionLevel.value > 0){
            setisDisable(false);
            }
            else{
                setisDisable(true)
            }
        })
    }

   useEffect(() => {
       disableAddPermission();
   }, [dataPermissions])

   useEffect(() => {
    
}, [isdisable]);
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
        dataPermissionsInfo.map((x: any | undefined) => {
            var station = stations.find((y: any) => parseInt(y.value) == x.mappingId);
            if (x.fieldType == 1 ) {
                if (station != undefined) {
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

    useEffect(() => {
        
        loadCateogories();
        loadStations();
        if (dataPermissionsInfo !== undefined && dataPermissionsInfo.length > 0) {
            // LoadPermissionsByDb();
        }
        else {
            addDefaultPermission();
        }
    }, []);

    const loadCateogories = () => {
        if (categoryFromReducer && categoryFromReducer.length > 0) {
            let categoryList = [...categoryFromReducer];
            let categories = categoryList
            .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
            .map((x: Category) => {
                return { value: x.id, label: x.name }
            });
            categories.push({ value: -2, label: t('All') })
            categories.push({ value: -1, label: t('Uncategorized') })
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
            stationResp.push({ value: -2, label: t('All') })
            stationResp.push({ value: -1, label: t('No_Station') })
            setStations(stationResp);
            LoadStationPermissionsByDb(stationResp);
        }
    }

    const addDefaultPermission = () => {

        let dPermission = Object.assign({}, defaultPermission);
        setDataPermissions(permissions => {
            return [...permissions,
                dPermission
            ]
        })
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
        permissions[i].type.value = parseInt(e.target.value);
        
        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
        setCrxDatapermissionClass("crxDatapermissionClass");
    }

    const onPermissionLevelChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let permissions = [...dataPermissions]
        permissions[i].permissionLevel.value = parseInt(e.target.value);
        
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

        let permissions = dataPermissions;

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
    }

    const filterPermissionValuesBasedonType = (permissionType: number) => {
        if (permissionType > 0) {
            if (permissionType === 2) {
                let selectedCategories = dataPermissions.filter(x => x.type.value === permissionType).map(x => x.permissionValue.value);
                return categories?.filter(x => selectedCategories.indexOf(x.value) === -1)

            } else if (permissionType === 1) {
                let selectedStations = dataPermissions.filter(x => x.type.value === permissionType).map(x => x.permissionValue.value);
                return stations?.filter(x => selectedStations.indexOf(x.value) === -1)
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
                                                options={permissionTypes}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOptionText={t(defaultPermissionType)}
                                                defaultValue={t(defaultPermissionType)} />
                                        </CRXColumn>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={6} spacing={0}>
                                            <CRXMultiSelectBoxAutocomplete
                                                className="adVSelectBox "
                                                disabled={permission.type.value > 0 ? false : true}
                                                options={filterPermissionValuesBasedonType(permission.type.value)}
                                                multiple={false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>, v: any) => {
                                                    
                                                    
                                                    
                                                    onPermissionValueChange(e, v, i)
                                                }}
                                                value={permission.permissionValue}
                                                placeHolder={defaultPermissionValue}
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
                                                ></button>
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
                disabled ={isdisable}
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
