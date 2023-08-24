import React, { useEffect, useState } from 'react'
import { CRXRows, CRXColumn, CRXHeading } from "@cb/shared";
import CRXLeftSideBar from './LeftSideBar'
import CRXDepartment from './AppBarMenu/Department'
import CRXStation from "./AppBarMenu/CRXStation";
import CRXUserProfile from './AppBarMenu/UserProfile'
import CRXAppDropdown from './AppBarMenu/AppBarLinks'
import CRXHelp from './AppBarMenu/Help'
import  CRXActiveBreadcrumb from './BreadCrumb'
import CRXAssetsBucketPanel from './AssetsBucket'
import CRXNotficationPanel from './CRXNotifications';
import CRXGlobalSearchPanel from './CRXGlobalSearch';
import AppLogo from '../../Assets/Images/getacLogo.png'
import SharedEvidenceAppLogo from '../../Assets/Images/SharedEvidenceAppLogo.png'

import './index.scss'
import { urlList, urlNames } from '../../utils/urlList';



interface propsTypes {
    onClick : (e : any) => void,
    onClose : (e : any) => void,
    open : boolean,
    
}

const AppHeader = ({onClick, onClose, open} : propsTypes) => {
    const [bucketIsOpen, setBucketIsOpen] = useState<any>(null);
    const [isguestUser, setIsguestUser] = useState<boolean>(false);

    useEffect(() => {
        setBucketIsOpen(null)
    },[bucketIsOpen])
    useEffect(() => {
        let url = window.location.href;
        let validString = url.split('/');
        if(validString[4]) {
            let validEndPoint = validString[4].split('?');
            if(validEndPoint[0] == "SharedMedia")
            {
                setIsguestUser(true);
            }
        }
       
    },[])

    

    
  useEffect(() => {
    
    let viewUrl = window.location.pathname;
    let pathBody = document.querySelector("body");
    let htmlTag = document.querySelector('html')
    
    if(viewUrl != urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
      
      pathBody?.classList.remove("pathAssetDetail");
      htmlTag && (htmlTag.style.overflow = "auto")
    }


    let path = window.location.pathname;
    let htmlElement: any = document.querySelector("html");
    
    if (path == urlList.filter((item: any) => item.name === urlNames.testVideoPlayer)[0].url) {
      pathBody?.classList.add("pathVideoPlayer");
      htmlElement.style.overflow = "hidden";
    } else if (path == urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
      pathBody?.classList.add("pathAssetDetail");
      htmlElement.style.overflow = "hidden";
    } else {
      pathBody?.classList.remove("pathVideoPlayer");
      pathBody?.classList.remove("pathAssetDetail");
      htmlElement.style.overflow = "auto";

    }
   
  })
    return (
        <div className="CRXAppHeader">
            <CRXRows
                container={true}
                spacing={0}
            >
                <CRXColumn item xs={4}>
                    <div className="CRXLogoMenu">
                        {!isguestUser? (
                        <CRXLeftSideBar 
                            onClick = {onClick}
                            onClose = {onClose}
                            open    = {open}
                        />):(null)
                        }
                        {!isguestUser? (
                        <CRXAppDropdown />
                        ):(null)
                        }
                        {!isguestUser? (
                        
                        <img src={AppLogo} className="appLogo"/>
                       
                        ):(
                        <img src={SharedEvidenceAppLogo} className="appLogo-shared"/>
                        )
                        }
                        {/* <CRXHeading align="left" className="AppName"  variant="h4">
                            ENTERPRISE
                        </CRXHeading> */}
                    </div>
                </CRXColumn>
                <CRXColumn item xs={8}>
                {!isguestUser? (
                    <div className="MasterHeadRight">
                        <ul id="rightMenu">
                            {/* <li><CRXStation/></li> */}
                            <li><CRXUserProfile /></li>
                            <li><CRXHelp /></li>
                        </ul>
                        <div className="panelContent">
                            <CRXAssetsBucketPanel isOpenBucket={bucketIsOpen} isGuestUser={isguestUser} />
                            <CRXNotficationPanel otherPanel={(e : any) => setBucketIsOpen(e)}/>
                            {/* <CRXGlobalSearchPanel /> */}
                        </div>
                    </div>
                    ):(null)
                }
                </CRXColumn>
            </CRXRows>
            <CRXActiveBreadcrumb shiftContent={open}/>
        </div>
    )
}

export default AppHeader;