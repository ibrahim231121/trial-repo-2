import React, { useEffect } from 'react'
import "./circularindicatore.scss"

interface loadingProps {
    loadingText : string
    show : boolean
}
const CircularProgressIndicator = ({loadingText, show} : loadingProps) => {

   useEffect(() => {
        window.setInterval( function() {
            var wait = document.getElementById("wait");
            if (wait &&  wait.innerHTML.length > 2 ) 
                wait.innerHTML = "";
            else 
                wait && (wait.innerHTML += ".");
            },300);

   },[])

    return (
        <>
        {show && 
        <div className='crx-cricle-loader'>
            <div className='loaderLoadingText'>
                <span id="loadingText">{loadingText}</span><span id="wait"></span>
            </div>
            <span className="icon icon-spinner4 loadingSpiner"></span>
        </div>
        }
        </>
    )
}

export default CircularProgressIndicator;