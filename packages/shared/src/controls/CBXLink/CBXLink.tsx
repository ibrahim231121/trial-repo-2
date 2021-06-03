import React from 'react'
import Link from '@material-ui/core/Link';

type CBXLinkProps ={
    children : React.ReactNode,
    className? : string,
    id? : string,
    href: string,
    onClick?:(event:any)=>void
}
const CBXLink = ({children,  className, id, href,onClick} : CBXLinkProps) => {
    return (
        <>
        <Link href={href} id={id} className={className} onClick={onClick}>
            {children}
        </Link>
        </>
    )
}

export default CBXLink;