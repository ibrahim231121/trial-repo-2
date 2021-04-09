import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
const CRXStation = () => {
    return (
        <div className="department">
             <CRXMenu
                id="CRXStation"
                name="All Stations"
                className="DarkTheme"
                btnClass="customButton"
            >
            <CRXItem>Karachi</CRXItem>
            <CRXItem>Islamabad</CRXItem>
            <CRXItem>Getac Station</CRXItem>
            <CRXItem>USA Station</CRXItem>
            {/* We can add menu item by loop */}
        </CRXMenu>
        </div>
    )
}

export default CRXStation;