import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";

const listOFMenu = [
    {
        label : 'Karachi',
        router : "Karachi"
    },
    {
        label : 'Islamabad',
        router : "Islamabad"
    },
    {
        label : 'Getac Station',
        router : "GetacStation"
    },
    {
        label : 'USA Station',
        router : "USAStation"
    }
];

const CRXStation = () => {
    return (
        <div className="department">
             <CRXMenu
                id="CRXStation"
                name="All Stations"
                className="DarkTheme stationPaper"
                
                btnClass="customButton"
                MenuList = {listOFMenu}
            />
        </div>
    )
}

export default CRXStation;