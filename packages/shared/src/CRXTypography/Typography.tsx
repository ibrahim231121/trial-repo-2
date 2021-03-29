import React from 'react'
import Typography from '@material-ui/core/Typography';

type varients =  'h1'
                    | 'h2'
                    | 'h3'
                    | 'h4'
                    | 'h5'
                    | 'h6'
                    | 'subtitle1'
                    | 'subtitle2'
                    | 'body1'
                    | 'body2'
                    | 'caption'
                    | 'button'
                    | 'overline'
                    | 'srOnly'
                    | 'inherit';

type typoProps = {
    children : React.ReactNode,
    variant : varients // h1, h2, h3, h4, h5, h6, p, 
    id? : string,
    className? : string,
    align? : any,
    noWrap? : boolean,
}
const CRXTypography = ({children, variant, align, id, className, noWrap = false} : typoProps) => {
    return (
        <Typography id={id} align={align} className={className} noWrap={noWrap}  variant={variant}>
            { children }
        </Typography>
    )
}

export default CRXTypography;