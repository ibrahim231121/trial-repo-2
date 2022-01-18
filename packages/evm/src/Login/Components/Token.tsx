import { useEffect, useContext } from "react";
import { authenticate } from "../API/auth";
import { getVerificationURL, checkVerifier } from "../../utils/settings";
import { useHistory } from "react-router";
import jwt_decode  from 'jwt-decode'
import ApplicationPermissionContext from '../../ApplicationPermission/ApplicationPermissionContext'
import {TokenType} from '../../types'

// type TokenType = {
//   AssignedGroups:string;
//   AssignedModules:string;
//   ClientIP:string;
//   Email:string;
//   Id:string;
//   TenantId:string;
//   UserId:string;
//   exp:number;
//   iat:number;
//   nbf:number;
// }

export default function Token(props:any) {

  const {
    moduleIds,
    setModuleIds
  } = useContext(ApplicationPermissionContext);


  const history = useHistory();

  useEffect(() => {
    if (checkVerifier() == null) {
      history.push("/assets");
    } else {
     
      
      fetch(getVerificationURL(props.match.params.token))
  
        .then((res) => res.json())
        
        .then((response) =>
        
        authenticate(response.accessToken,response.idToken,response.refreshToken
          , () => {
            var accessTokenDecode :TokenType =  jwt_decode(response.accessToken);
            // console.log("Decoded TOken");
            // console.log(accessTokenDecode);
            // console.log(moduleIds);
            // console.log(setModuleIds);
            if(accessTokenDecode !== null &&  accessTokenDecode.AssignedModules && accessTokenDecode.AssignedModules !== ""){
                var moduleIdsAssigned = accessTokenDecode.AssignedModules
                                                .split(',')
                                                .map(x=> parseInt(x));
                console.log("Setting modules Ids from Token.tsx");
                console.log(moduleIdsAssigned);
                setModuleIds(moduleIdsAssigned);
            }
            history.push("/assets");
          })
        );
    }
  },[]);
  return null;
}
