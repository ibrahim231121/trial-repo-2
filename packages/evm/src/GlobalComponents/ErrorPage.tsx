import React from 'react'
import { Link } from "react-router-dom";
import './ErrorPage.scss'


const ErrorPage = () => {
    return (
        <div className="errorPageMain">
           <span className='errorPageHeading'>404 Not Found</span>
           <span className='errorPageFirst'>Sorry, Something went wrong and we were unable to find <br/>the page you were looking for.</span>
           <span className='errorPageSecond'>The webpage might be temporarily down or it may have moved permanently <br/>to a new web address.</span>
           <span className='errorPageSuggestion'>Here are some suggestions:</span>
           <span >
            <ul>
                <li><Link to="/">Reload</Link> this web page later</li>
                <li>Go back to the <Link to="/">Home page</Link></li>
            </ul>
            </span> 
        </div>
    )
}

export default ErrorPage
