import React from 'react'
import './CRXTitle.scss'

interface propsTitle {
    className? : string,
    text : string,
}
const CRXTitle = ({className, text} : propsTitle) => {
    return (
        <div className={"CRXPageTitle " + className }>
            <h2>{text}</h2>
        </div>
    )
}

export default CRXTitle;