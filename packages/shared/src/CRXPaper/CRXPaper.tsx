import React from 'react'
import { Paper } from '@material-ui/core';

import './CRXPaper.scss'
type paperProps = {
    children : React.ReactNode,
    variant : any,
    elevation : number,
    square? : boolean,
    component? : any,
    className? : string 
}

const CRXPaper = ({children, variant, elevation, square, component, className} : paperProps) => {
    return (
        
        <Paper
            variant={variant}
            elevation={elevation}
            square={square}
            component={component}
            className={"CRXPaper " + className}
            >
            { children }
        </Paper>
       
    )
}

export default CRXPaper;