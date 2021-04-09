import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
const CRXDepartment = () => {
    return (
        <div className="department">
             <CRXMenu
            id="userProfile"
            name="Departments"
            className="DarkTheme"
            btnClass="customButton"
        >
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
            <CRXItem>Department name</CRXItem>
        </CRXMenu>
        </div>
    )
}

export default CRXDepartment;