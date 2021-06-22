import React, {useEffect} from 'react'

import './footer.scss'

const Footer = () => {
    const [versionNumber, setVersionNumber] = React.useState("");
    const url = "/Evidence/Version";
    useEffect(()=>{
        fetch(url, {
            method: "GET", 
        })
        .then((response:Response) => response.text())
        .then((res) => setVersionNumber(res.replace(/^"|"$/g, '')))
    });

    return (
        <div className="footerDiv">
            Copyright © Getac Video Solutions, Inc. and its subsidiaries. All rights reserved. |  Enterprise Version: {versionNumber}
        </div>
    )
            
    }

export default Footer;