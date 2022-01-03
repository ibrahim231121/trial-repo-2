
import React, { useEffect, useState } from "react";
import { CRXMultiSelectBoxAutocomplete, CRXRows, CRXColumn, CRXSelectBox, CRXButton } from "@cb/shared";
import { STATION_INFO_GET_URL, CATEGORY_INFO_GET_URL } from '../../../../utils/Api/url'
import {
    defaultPermissionType,
    defaultPermissionValue,
    defaultPermissionLevel,
    permissionTypes,
    permissionLevels
} from './DataPermission/constants'
import { PermissionData, PermissionValue, Category, Station, StationResponse } from './DataPermission/types'
import "./dataPermission.scss"
import { DataPermissionModel } from "../Group";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";


type infoProps = {
    dataPermissionsInfo: DataPermissionModel[],
    onChangeDataPermission: any,
    onDeletePermission: any
}


const DataPermission: React.FC<infoProps> = ({ dataPermissionsInfo, onChangeDataPermission, onDeletePermission }) => {
    let [dataPermissions, setDataPermissions] = useState<PermissionData[]>([])

    let [categories, setCategories] = useState<PermissionValue[]>([]);
    let [stations, setStations] = useState<PermissionValue[]>([]);
    let [isdisable, setisDisable] = useState<Boolean>(true);

    var flag = true;

    const defaultPermission = {
        id: 0,
        type: { value: 0, label: "" },
        permissionValue: { value: 0, label: "" },
        permissionLevel: { value: 0, label: "" }
    }

   const disableAddPermission = () => {
       dataPermissions.map((obj) => {
           console.log(obj.permissionValue.value)
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

    const loadCateogories = async () => {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };

        const categoryResponse = await fetch(CATEGORY_INFO_GET_URL, requestOptions);
        console.log("category reponse = ", categoryResponse);
        if (categoryResponse.ok) {
            const response = await categoryResponse.json();
            if (response && response.length > 0) {
                var categories = response
                    .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
                    .map((x: Category) => {
                        return { value: x.id, label: x.name }
                    })
                categories.push({ value: -2, label: 'All' })
                categories.push({ value: -1, label: 'Uncategorized' })
                console.log("Categories");
                console.log(categories);
                setCategories(categories);
                LoadCategoryPermissionsByDb(categories);
            }
        }
    }

    const loadStations = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        const stationResponse = await fetch(STATION_INFO_GET_URL, requestOptions);

        if (stationResponse.ok) {
            const response: StationResponse[] = await stationResponse.json();
            if (response && response.length > 0) {
                console.log("response");
                console.log(response);
                var stations = response
                    .sort((a: StationResponse, b: StationResponse) => a.name.localeCompare(b.name))
                    .map((x: StationResponse) => {
                        let StationR: Station = { value: parseInt(x.id), label: x.name }
                        return StationR;
                    })
                stations.push({ value: -2, label: 'All' })
                stations.push({ value: -1, label: 'No Station' })
                console.log("Station ");
                console.log(stations);
                setStations(stations);
                LoadStationPermissionsByDb(stations);
            }
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
        console.log("type", permissions);
        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
    }

    const onPermissionLevelChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let permissions = [...dataPermissions]
        permissions[i].permissionLevel.value = parseInt(e.target.value);
        console.log("level", permissions);
        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
    }

    const onPermissionValueChange = (e: React.ChangeEvent<HTMLInputElement>, v: any, i: number) => {

        console.log("Changing Value ", v);
        let permissions = [...dataPermissions]
        if (v !== null) {
            if (v && v.value) {
                v.value = parseInt(v.value);
            }
            permissions[i].permissionValue = v;
        }
        else
            permissions[i].permissionValue = { value: 0, label: "" };
        console.log("value", permissions);
        setDataPermissions(permissions);
        setDataPermissionInfo(permissions);
    }

    const onAddPermission = () => {
        addDefaultPermission();
    }

    const onRemovePermission = (i: number) => {

        let permissions = dataPermissions;

        let permission = permissions[i];

        console.log("Data Permissions");
        console.log(permissions)
        if (permission && permission.id && permission.id > 0) {
            onDeletePermission(permission.id);
        }
        permissions.splice(i, 1)

        if (permissions.length <= 0) {
            permissions.push(defaultPermission)
        }
        console.log('onremove', permissions);
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
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>Permission Type</CRXColumn>
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={6} spacing={0}>Permission Value</CRXColumn>
                    <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>Permission Level</CRXColumn>
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
                                                className="adVSelectBox createUserSelectBox"
                                                id={i}
                                                value={permission.type.value > 0 ? permission.type.value : defaultPermissionType}
                                                onChange={(e: any) => onPermissionTypeChange(e, i)}
                                                options={permissionTypes}
                                                icon={true}
                                                popover={"crxSelectPermissionGroup"}
                                                defaultOptionText={defaultPermissionType}
                                                defaultValue={defaultPermissionType} />
                                        </CRXColumn>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={6} spacing={0}>
                                            <CRXMultiSelectBoxAutocomplete
                                                className="adVSelectBox "
                                                disabled={permission.type.value > 0 ? false : true}
                                                options={filterPermissionValuesBasedonType(permission.type.value)}
                                                multiple={false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>, v: any) => {
                                                    console.log("on change ");
                                                    console.log(e.target.value)
                                                    console.log(v);
                                                    onPermissionValueChange(e, v, i)
                                                }}
                                                value={permission.permissionValue}
                                                placeHolder={defaultPermissionValue}
                                            />
                                        </CRXColumn>
                                        <CRXColumn className="permissionCol" container="container" item="item" xs={3} spacing={0}>
                                            <CRXSelectBox
                                                className="adVSelectBox createUserSelectBox"
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
                > + Add data permissions
                </CRXButton>
            </div>
        </div>

    )
}

export default DataPermission
