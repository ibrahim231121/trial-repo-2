import React from 'react'
import Grid from '@material-ui/core/Grid';

interface columnProps {
    xs : any,
    children : React.ReactNode,
    others? : any,
    item : boolean,
    className? : string
}

const CRXColumn = ({ item, xs, children, className, ...others} : columnProps) => {
    
    return (
        <>
            <Grid className={className} xs={xs} item={item} {...others}>
                {children}
            </Grid>
        </>
    )
}

export default CRXColumn;