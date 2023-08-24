import React from 'react'
import { Link } from "react-router-dom";
import './caseExpired.scss'


const CaseExpired = () => {
    return (
        <div className="caseExpiredPageMain">
           <span className='caseExpiredPageHeading'>Case Expired</span>
           <span className='caseExpiredPageFirst'>Sorry, the case has been expired.<br/></span>
           <span className='caseExpiredPageSuggestion'>Here are some suggestions:</span>
           <span >
            <ul>
                <li>Go back to the <Link to="/cases">Case Lister page</Link></li>
            </ul>
            </span> 
        </div>
    )
}

export default CaseExpired
