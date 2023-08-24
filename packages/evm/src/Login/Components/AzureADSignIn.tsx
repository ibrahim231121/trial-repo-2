import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../Login/Components/AuthConfig";
import { useEffect, useContext } from "react";

export const AzureADSignIn = () => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    
    useEffect(() => { 
       if(isAuthenticated == false){ 
       instance.loginRedirect(loginRequest);}

      },[]);
      return null;

};