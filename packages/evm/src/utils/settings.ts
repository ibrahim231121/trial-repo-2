import CryptoJS from "crypto-js";
import { AUTHENTICATION_CODEVERIFIER_URL } from '../../../evm/src/utils/Api/url'
import { REACT_APP_CLIENT_ID } from '../utils/Api/url'
import randomNumberGenerator from "../Application/Assets/utils/numberGenerator";

const code_challenge_Method = "SHA256";



export function codeChallengeRemove() {
  return sessionStorage.removeItem("code_challenge_string");
}

export function checkVerifier() {
  return sessionStorage.getItem("code_challenge_string");
}

export function getVerificationURL(y: string) {
  var x = sessionStorage.getItem("code_challenge_string");
  return AUTHENTICATION_CODEVERIFIER_URL + `?client_id=${REACT_APP_CLIENT_ID}&authorizationcode=${y}&code_verifier=${x}`;
}

export function utils(culture:string) {
  const randomNumGenerated = randomNumberGenerator();
  const code_challenge_string = randomNumGenerated.toString(36).substring(7);
  const code_challenge = CryptoJS.SHA256(code_challenge_string).toString();
  sessionStorage.setItem("code_challenge_string", code_challenge_string);
  return `?culture=${culture}&client_id=${REACT_APP_CLIENT_ID}&code_challenge=${code_challenge}&code_challenge_Method=${code_challenge_Method}`;
}

export const getDomainName = () => {
  try {
    const hostname = window.location.hostname;
    if(hostname.match(/[a-z]/) != null) {
      return hostname.split('.').slice(-2).join('.');
    }
    return undefined;
  }
  catch(ex) {
    return undefined;
  }
}




