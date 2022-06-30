import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { useTranslation } from 'react-i18next';




const CRXStation = () => {
    const { t } = useTranslation<string>();
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
    return (
        <div className="department">
             <CRXMenu
                id="CRXStation"
                name={t("All_Stations")}
                className="DarkTheme stationPaper"
                
                btnClass="customButton"
                MenuList = {listOFMenu}
            />
        </div>
    )
}

export default CRXStation;