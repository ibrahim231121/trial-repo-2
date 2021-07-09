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
            © Copyright 2021 IRSA Video ®  |  Enterprise Version {versionNumber}
            <i className="fas fa-chevron-up"></i>
        </div>
    )
            
    }

export default Footer;