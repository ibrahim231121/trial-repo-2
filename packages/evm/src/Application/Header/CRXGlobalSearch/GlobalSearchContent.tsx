import React, { useState } from 'react'
import { TextField } from '@cb/shared'

const GlobalSearch = () => {
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
                placeholder="Search assets by ID#, case#, CAD#, categories, etc"
            />
        </>
    )
}

export default GlobalSearch;