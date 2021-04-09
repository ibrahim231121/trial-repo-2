import React from 'react'
import Link from '@material-ui/core/Link';

type CBXLinkProps ={
    children : React.ReactNode,
    className? : string,
    id? : string,
    href: string
}
const CBXLink = ({children,  className, id, href} : CBXLinkProps) => {
    return (
        <>
        <Link href={href} id={id} className={className}>
            {children}
        </Link>
        </>
    )
}

export default CBXLink;