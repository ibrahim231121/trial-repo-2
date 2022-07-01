import { useEffect, useContext } from "react";
import { authenticate } from "../API/auth";
import { getVerificationURL, checkVerifier } from "../../utils/settings";
import { useHistory } from "react-router";
import jwt_decode  from 'jwt-decode'
import ApplicationPermissionContext from '../../ApplicationPermission/ApplicationPermissionContext'
import {TokenType} from '../../types'
import { AuthenticationAgent } from "../../utils/Api/ApiAgent";
import { Token } from "../../utils/Api/models/AuthenticationModels";


const TokenPage=(props:any)=> {
  const url = props.match.params.token
  const {
    moduleIds,
    setModuleIds
  } = useContext(ApplicationPermissionContext);


  const history = useHistory();

  useEffect(() => {
    if (checkVerifier() == null) {
      history.push("/assets");
    } else {
     
    
        AuthenticationAgent.getAccessToken(url).then((response:Token) => response)
        .then((response) => 
        authenticate(response.accessToken,response.idToken,response.refreshToken
          , () => {
            var accessTokenDecode :TokenType =  jwt_decode(response.accessToken);
       
            if(accessTokenDecode !== null &&  accessTokenDecode.AssignedModules && accessTokenDecode.AssignedModules !== ""){
                var moduleIdsAssigned = accessTokenDecode.AssignedModules
                                                .split(',')
                                                .map(x=> parseInt(x));
                
                
                setModuleIds(moduleIdsAssigned);
            }
            history.push("/assets");
          })
        );
        
    }
  },[]);
  return null;
}

export default TokenPage
