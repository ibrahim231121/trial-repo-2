import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import './CRXAppBar.scss'

type Position =  'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'
type Colors = 'default' | 'inherit' | 'primary' | 'secondary' | 'transparent'

interface CRXAppBarProps {
    children : React.ReactNode,
    id? : string,
    className? : string,
    position? : Position,
    color : Colors
}

const headerStyle = createTheme({
   
    palette: {
        primary: {
            main: "#333333",
            light: '#0066ff',
            
        },
        secondary: {
            main: "#f4f4f4",
        },
    },
    typography: {
        subtitle1: {
          fontSize: 14,
        },
        body1: {
          fontWeight: "normal",
        },
        button: {
            fontFamily: '-apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif, "Segoe UI"',
        },
      },

      zIndex : {
        appBar : 1200
      }
});

const CRXAppBar = ({children, id, className, position = "relative", color} : CRXAppBarProps) => {
    return (
        <>
        <ThemeProvider theme={headerStyle}>
        <AppBar id={id} className={"CRXAppBar " + className} position={position} color={color}>
            { children }
        </AppBar>
        </ThemeProvider>
        </>
    )
}

export default CRXAppBar;