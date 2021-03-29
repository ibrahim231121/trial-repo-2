import React from 'react' 
import Icon from '@material-ui/core/Icon';

interface iconProps {
    children : React.ReactNode,
    className? : string
}
const CRXIcon = ({children, className} : iconProps) => {
    return (
        <>
            <Icon className={"material-icons " + className}>{children}</Icon>
        </>
    )
}

export default CRXIcon;