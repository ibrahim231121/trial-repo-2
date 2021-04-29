import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";

const listOFMenu = [
    {
        label : 'Department name',
        router : "Department name"
    },
    {
        label : 'Department name',
        router : "Department name"
    },
    {
        label : 'Department name',
        router : "Department name"
    },
    {
        label : 'Department name',
        router : "Department name"
    }
];

const CRXDepartment = () => {
    return (
        <div className="department">
            <CRXMenu
                id="Departments"
                name="Departments"
                className="DarkTheme"
                btnClass="customButton"
                MenuList = {listOFMenu}
            />
        
        </div>
    )
}

export default CRXDepartment;