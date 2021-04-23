import * as React from 'react'
import  Button  from '@material-ui/core/Button'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './CRXButton.scss'

interface buttonProps {
    id: string,
    children?: React.ReactNode,
    onClick?: (e : any, value? : any) => void;
    color?: 'default' | 'primary' | 'secondary',
    variant: "contained" | 'outlined' | 'text',
    className: string,
    disabled? : boolean
}
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#333333",
            light: '#0066ff',
            
        },
        secondary: {
            main: "#ffffff",
        },
        
    },
    props : {
        MuiButtonBase : { 
            disableRipple: true,
        }
    }
  });

const CRXButton = ({id, children, color, variant, className, disabled, onClick, ...props} : buttonProps) => {
    return (
        <ThemeProvider theme={theme}>
            <Button
            id={id}
            color={color}
            variant={variant}
            className={"CRXButton " + className}
            onClick={onClick}
            disabled={disabled}
            {...props}
            >
                {children}
            </Button>
        </ThemeProvider>
    )
}

export default CRXButton;
