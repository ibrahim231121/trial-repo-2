
import React, { useEffect, useState } from "react";
import { CRXMultiSelectBoxAutocomplete, CRXRows, CRXColumn, CRXSelectBox, CRXButton } from "@cb/shared";
import { STATION_INFO_GET_URL, CATEGORY_INFO_GET_URL } from '../../../../utils/Api/url'
import {defaultPermissionType, 
        defaultPermissionValue,
        defaultPermissionLevel,
        permissionTypes,
        permissionLevels       
} from './DataPermission/constants'
import {PermissionData,PermissionValue,Category,Station} from './DataPermission/types'
import "./dataPermission.scss"



const DataPermission: React.FC = () => {


    let [dataPermissions, setDataPermissions] = useState<PermissionData[]>([])

    let [categories, setCategories] = useState<PermissionValue[]>([]);
    let [stations, setStations] = useState<PermissionValue[]>([]);   
    
   const defaultPermission = { 
        type:{ value:0, label:""},
        permissionValue:{ value:0, label:""},
        permissionLevel:{ value:0, label:""}
    }
    
    useEffect(() => {
        addDefaultPermission();   
            loadCateogories();
            loadStations();
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
            if(response && response.length > 0){
                var categories =   response
                                    .sort((a:Category,b:Category)=> a.name.localeCompare(b.name))
                                    .map((x:Category)=> {
                                        return { value: x.id, label:x.name}
                                    })
                                    categories.push({value:-1, label:'All'})
                                    categories.push({value:-2, label:'Uncategorized'})
                console.log("Categories");
                console.log(categories);
                setCategories(categories);
            }
        }
    }

    const loadStations = async () =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'TenantId': '1' },
        };
        let x = 1;
        let y = 2; 
        if( x=== y){
            const stationResponse = await fetch(STATION_INFO_GET_URL, requestOptions);
            if (stationResponse.ok) {
                const response = await stationResponse.json();
                if(response && response.length > 0){
                var stations =   response
                                    .sort((a:Station,b:Station)=> a.name.localeCompare(b.name))
                                    .map((x:Station)=> {
                                        return { value: x.id, label:x.name}
                                    })
                                    stations.push({value:-1, label:'All'})
                                    stations.push({value:-2, label:'No Station'})                           
                    setStations(stations);
                }
            }
        }
    }

    const addDefaultPermission = () => {
        let dPermission = Object.assign({},defaultPermission);
        setDataPermissions(permissions=>{
            return [...permissions,
                dPermission
            ]
        })
    }

    const onPermissionTypeChange = (e:React.ChangeEvent<HTMLInputElement>, i:number)=>{
        let permissions = [...dataPermissions]
        permissions[i].type.value = parseInt(e.target.value);
        setDataPermissions(permissions); 
    }

    const onPermissionLevelChange = (e:React.ChangeEvent<HTMLInputElement>, i:number)=>{
        let permissions = [...dataPermissions]
        permissions[i].permissionLevel.value = parseInt(e.target.value);
        setDataPermissions(permissions);     
    }

    const onPermissionValueChange = (e:React.ChangeEvent<HTMLInputElement>, v:any, i:number)=>{
        let permissions = [...dataPermissions]
        if(v !== null)
            permissions[i].permissionValue = v;
        else
            permissions[i].permissionValue = { value:0, label:""};

        setDataPermissions(permissions);     
    }

    const onAddPermission = () =>{
        addDefaultPermission();
    }

    const onRemovePermission = (i:number) =>{

        let permissions = dataPermissions;
        permissions.splice(i,1)

        if(permissions.length <= 0){
            permissions.push(defaultPermission)
        }
        setDataPermissions([...permissions]);
    }

    const filterPermissionValuesBasedonType = (permissionType:number) =>{
       if(permissionType > 0){
            if(permissionType === 1){
                let selectedCategories = dataPermissions.filter(x=> x.type.value === permissionType).map(x=> x.permissionValue.value);
                return categories?.filter(x=> selectedCategories.indexOf(x.value) === -1)

            }else if (permissionType === 2){
                let selectedStations = dataPermissions.filter(x=> x.type.value === permissionType).map(x=> x.permissionValue.value);
                return stations?.filter(x=> selectedStations.indexOf(x.value) === -1)
            }else
                return []   
       }else
           return []
    }

    return (
        <div>
         <div className="dataPermissionContent">
            <CRXRows container="container" spacing={0}>
             <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>Permission Type</CRXColumn>
             <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>Permission Value</CRXColumn>
             <CRXColumn className="dataPermissionColumn" container="container" item="item" xs={3} spacing={0}>Permission Level</CRXColumn>
             </CRXRows>
         </div>
         <div >
                    {
                     dataPermissions.map((permission,i) =>{   
                          return  <div key={i}>
                                <CRXRows container="container" spacing={0}>
                                    <CRXColumn className="permissionCol"  container="container" item="item" xs={3} spacing={0}>
                                        <CRXSelectBox
                                            className="adVSelectBox"
                                            id={i}
                                            value={permission.type.value> 0 ? permission.type.value : defaultPermissionType}
                                            onChange={(e: any) => onPermissionTypeChange(e,i)}
                                            options={permissionTypes}
                                            defaultOptionText={defaultPermissionType}
                                            defaultValue={defaultPermissionType} /> 
                                    </CRXColumn>
                                    <CRXColumn className="permissionCol" container="container" item="item" xs={3} spacing={0}>
                                        <CRXMultiSelectBoxAutocomplete
                                            className="adVSelectBox"
                                            disabled={permission.type.value > 0 ? false:true}
                                            options={filterPermissionValuesBasedonType(permission.type.value) }
                                            multiple={false}
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>,v:any)=>{
                                                console.log("on change ");
                                                console.log(e.target.value)
                                                console.log(v);
                                                onPermissionValueChange(e,v,i)
                                            }}
                                            value={permission.permissionValue}
                                            placeHolder={defaultPermissionValue}
                                        />
                                    </CRXColumn>
                                    <CRXColumn className="permissionCol" container="container" item="item" xs={3} spacing={0}>
                                        <CRXSelectBox
                                            className="adVSelectBox"
                                            id={i}
                                            disabled={permission.type.value > 0 ? false:true}
                                            value={permission.permissionLevel.value > 0 ? permission.permissionLevel.value : defaultPermissionLevel}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPermissionLevelChange(e,i)}
                                            options={permissionLevels}
                                            defaultOptionText={defaultPermissionLevel}
                                            defaultValue={defaultPermissionLevel} 
                                        />  
                                    </CRXColumn>
                                    <CRXColumn container="container" item="item" xs={3} spacing={0} >
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
         <CRXButton
            className='PreSearchButton'
            onClick={onAddPermission}
            color='primary'
            variant='contained'
          > + Add Data Permissions
          </CRXButton>
        </div>
    )
}

export default DataPermission
