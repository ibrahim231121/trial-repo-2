import CryptoJS from "crypto-js";
import { AUTHENTICATION_CODEVERIFIER_URL, AUTHENTICATION_LOGIN_URL } from '../../../evm/src/utils/Api/url'

const clientId = process.env.REACT_APP_CLIENT_ID
const code_challenge_Method = "SHA256";

export function codeChallengeRemove() {
  return sessionStorage.removeItem("code_challenge_string");
}

export function checkVerifier() {
  return sessionStorage.getItem("code_challenge_string");
}

export function getVerificationURL(y:string) {
  var x = sessionStorage.getItem("code_challenge_string");
  return AUTHENTICATION_CODEVERIFIER_URL+`?client_id=${clientId}&authorizationcode=${y}&code_verifier=${x}`;
}

export function utils() {
  const code_challenge_string = Math.random().toString(36).substring(7);
  const code_challenge = CryptoJS.SHA256(code_challenge_string).toString();
  sessionStorage.setItem("code_challenge_string", code_challenge_string);
  return `?client_id=${clientId}&code_challenge=${code_challenge}&code_challenge_Method=${code_challenge_Method}`;
}






