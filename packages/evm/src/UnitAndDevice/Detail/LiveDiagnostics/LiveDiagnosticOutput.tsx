import React, { useEffect, useState } from 'react'
import "./LiveDiagnosticOutput.scss";
import { ResponseOutput } from './LiveDiagnostic';
import { Label } from '@material-ui/icons';
import { CRXTitle } from '@cb/shared';

interface LiveDiagnosticOutputProps {
    response: ResponseOutput
}

const LiveDiagnosticOutput: React.FC<LiveDiagnosticOutputProps> = ({ response }) => {
    const imageUrl = `data:image/jpeg;base64,${response.data}`;
    function ShowImage() {
        if (response.body.CommandType === "DesktopSnapshot") {
            if (response.data.includes("Requesting") || response.data.trim() == "") {
                return <div className='response_body'>{response.data}</div>

            } else {
                return <div className='snapshot'><img className="snapshotImage" src={imageUrl} alt="Your Image" /></div>;
            }
        } else {
            return <div className='response_body'>{response.data}</div>
        }

    }


    return (
        <>
            {/* <CRXTitle key={response.body.CommandID} text={response.title} className="titlePage" /> */}
            <div className='mainConsole'>
                {
                    ShowImage()
                }
            </div>
        </>
    );
}

export default LiveDiagnosticOutput;