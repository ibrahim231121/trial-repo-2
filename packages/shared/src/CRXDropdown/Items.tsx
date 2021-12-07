import React from 'react' 
import  { MenuItem } from '@material-ui/core'

interface itemsProp {
    className? : string,
    children : React.ReactNode,
}

const Items = ({className, children} : itemsProp) => {
    return (
        <>
        <MenuItem className={className}>
        {
           children
        }
        </MenuItem>
        </>
    )
}

export default Items;