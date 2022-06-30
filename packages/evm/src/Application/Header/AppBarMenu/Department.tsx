import React from 'react'
import { CRXItem, CRXMenu } from "@cb/shared";
import { useTranslation } from 'react-i18next';




const CRXDepartment = () => {
    const { t } = useTranslation<string>();
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
    return (
        <div className="department">
            <CRXMenu
                id="Departments"
                name={t("Departments")}
                className="DarkTheme"
                btnClass="customButton"
                MenuList = {listOFMenu}
            />
        
        </div>
    )
}

export default CRXDepartment;