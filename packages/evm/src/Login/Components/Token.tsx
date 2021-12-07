import { useEffect } from "react";
import { authenticate } from "../API/auth";
import { getVerificationURL, checkVerifier } from "../../utils/settings";
import { useHistory } from "react-router";

export default function Token(props:any) {
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
            history.push("/assets");
          })
        );
    }
  },[]);
  return null;
}
