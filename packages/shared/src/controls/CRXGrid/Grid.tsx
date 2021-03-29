import React from 'react'
import Grid from '@material-ui/core/Grid';

interface gridProps {
    spacing : any,
    children : React.ReactNode,
    others? : any,
    container : boolean,
    className? : string
}

const CRXRows = ({ container, spacing, children, className, ...others} : gridProps) => {
    
    return (
        <>
        <Grid className={className} container={container} spacing={spacing} {...others}>
            {children}
        </Grid>
           
        </>
    )
}

export default CRXRows;