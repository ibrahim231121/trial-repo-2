import React from 'react'
import { useTranslation } from 'react-i18next';

const UnitConfiguration= () => {
    const { t } = useTranslation<string>();
    return (
        <div className="manageUnitHeading">
            {t("Manage_Unit_Configuration")}
        </div>
    )
}

export default UnitConfiguration
