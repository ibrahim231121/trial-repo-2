import React, { useEffect, useContext } from "react";
import { authenticate } from "../API/auth";
import { useHistory } from "react-router";
import jwt_decode  from 'jwt-decode'
import ApplicationPermissionContext from '../../ApplicationPermission/ApplicationPermissionContext'
import {TokenType} from '../../types'
import { AuthenticationAgent } from "../../utils/Api/ApiAgent";
import { Token } from "../../utils/Api/models/AuthenticationModels";
import { urlList, urlNames } from "../../utils/urlList";
import { useDispatch } from "react-redux";
import { setAccessAndRefreshToken } from "../../Redux/AccessAndRefreshTokenReducer";
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "../../Login/Components/AuthConfig";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter as Router} from "react-router-dom";
import RedirectAzureAuthenticate from "../Components/RedirectAzureAuthenticate";
import ReactDOM from 'react-dom';
export const msalInstance = new PublicClientApplication(msalConfig);

const AuthenticatePage= ()=> {
  const {
    moduleIds,
    setModuleIds
  } = useContext(ApplicationPermissionContext);
     const history = useHistory();
     const dispatch = useDispatch();

   const callbackId=  msalInstance.addEventCallback((event: EventMessage) => {

      var activeAccount = msalInstance.getActiveAccount();
    
      if ((event.eventType === EventType.LOGIN_SUCCESS ) || activeAccount != null) {
        var account: AccountInfo | null;
         if(activeAccount == null){
          const payload = event?.payload as AuthenticationResult;
          account = payload?.account;
          msalInstance.setActiveAccount(account);
        }
        else
        {
          account = activeAccount;
        }
      
        if(callbackId)
        {
            msalInstance.removeEventCallback(callbackId);
        }
       AuthenticationAgent.getAzureADUserTokens('/Authentication/GetAzureUserTokens'+`?loginId=${account?.username}`).then((response:Token) => response)
      
         .then((response) => 
          authenticate(response.accessToken,response.idToken,response.refreshToken
          , () => {
            dispatch(setAccessAndRefreshToken({ refreshToken: response.refreshToken, accessToken: response.accessToken }))
            var accessTokenDecode :TokenType =  jwt_decode(response.accessToken);
       
            if(accessTokenDecode !== null &&  accessTokenDecode.AssignedModules && accessTokenDecode.AssignedModules !== ""){
                var moduleIdsAssigned = accessTokenDecode.AssignedModules
                                                .split(',')
                                                .map(x=> parseInt(x));
                
                
                setModuleIds(moduleIdsAssigned);
            }
            history.push(urlList.filter((item: any) => item.name === urlNames.assets)[0].url);
            window.location.reload();
          })
        );

      }
  });
 
  ReactDOM.render(
      <Router> 
          <MsalProvider instance={msalInstance}>                      
           <RedirectAzureAuthenticate />           
          </MsalProvider>
  
      </Router>,
       document.getElementById('root')
  );


return null;
}

export default AuthenticatePage
