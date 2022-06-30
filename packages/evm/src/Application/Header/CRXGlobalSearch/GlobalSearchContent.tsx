import React, { useState } from 'react'
import { TextField } from '@cb/shared'
import { useTranslation } from "react-i18next";

const GlobalSearch = () => {
    const { t } = useTranslation<string>();
    const [searchValue, setValue] = useState<any>();

    const changeHandler = (event : React.ChangeEvent<HTMLInputElement>) => {

        setValue(event.target.value);
    }
    return (
        <>
            <TextField
                name="globalSearch"
                type="text"
                value={searchValue}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => changeHandler(e)}
                placeholder={t("Search_assets_by_ID_case_CAD_categories_etc")}
            />
        </>
    )
}

export default GlobalSearch;