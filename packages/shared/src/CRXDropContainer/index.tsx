import React, { RefObject } from 'react'
import { IconButton, Paper  } from '@material-ui/core'
//import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './CRXDropContent.scss'

interface propsType {
    icon? : any,
    color?: 'default' | 'primary' | 'secondary',
    className?: string,
    content : React.ReactNode,
    paperClass? : string, 
    paperState: boolean,
    onClick : (e : any) => void,
}

const CRXDropContainer = ({icon, onClick, paperState, color, className, paperClass, content} : propsType) => {
    
    return (
        <div className="iconContent">
            <IconButton
                color={color}
                className={"buttonStyle " + className}
                component="div"
                onClick={onClick}
                disableRipple={true}
            >
              <div className="iconStyle">{icon}</div>
            </IconButton>
            {paperState ? 
            <Paper className={"paperStyle " + paperClass} variant="outlined" square>
                {content} 
            </Paper> : " "
             }
        </div>
    )
}

export default CRXDropContainer;