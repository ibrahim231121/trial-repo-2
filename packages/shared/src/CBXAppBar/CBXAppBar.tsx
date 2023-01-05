import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import './CRXAppBar.scss'

type Position =  'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'
type Colors = 'default' | 'inherit' | 'primary' | 'secondary' | 'transparent'

interface CBXAppBarProps {
    children : React.ReactNode,
    id? : string,
    className? : string,
    position? : Position,
    color? : Colors
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#333333",
            light: '#0066ff',
        },
        secondary: {
            main: "#f4f4f4",
        },
    },
    zIndex : {
        appBar: 1200,
    }
});

const CRXAppBar = ({children, id, className, position = 'relative', color = 'primary'} : CBXAppBarProps) => {
    return (
        <ThemeProvider theme={theme}>
        <AppBar id={id} className={"CBXAppBar " + className} style={{ zIndex: 1200 }} position={position} color={color}>
            { children }
        </AppBar>
        </ThemeProvider>
    )
}

export default CRXAppBar;
