import React from 'react'
import { Container, makeStyles } from '@material-ui/core';

type containerProps = {
    children : any ,
    fixed? : boolean,
    className? : string,
    maxWidth : 'lg'
                | 'md'
                | 'sm'
                | 'xl'
                | 'xs'
                | false,
    disableGutters : boolean, //Left and Right padding control true = add , false = remove
}

const containerStyle = makeStyles({
    root : {
        padding: "15px 0px",
        fontFamily : "-apple-system, BlinkMacSystemFont, Arial, Helvetica, sans-serif, Segoe UI"
    },
})


const CRXContainer = ({children, fixed, maxWidth, className, disableGutters = true} : containerProps) => {
    const classes = containerStyle();
    return (
        <Container
            className = {classes.root + " " + className}
            fixed={fixed}
            maxWidth={maxWidth}
            disableGutters={disableGutters}
        >
           { children }
        </Container>
    )
}

export default CRXContainer;