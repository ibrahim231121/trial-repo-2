import CryptoJS from "crypto-js";

export const authorizationUrl = `http://127.0.0.1:8081/Authentication/Login`;
const clientId = "cb8aa975-12ad-461a-8e95-06a0c1f45477";
const code_challenge_Method = "SHA256";

export function codeChallengeRemove() {
  return sessionStorage.removeItem("code_challenge_string");
}

export function checkVerifier() {
  return sessionStorage.getItem("code_challenge_string");
}

export function getVerificationURL(y:string) {
  var x = sessionStorage.getItem("code_challenge_string");
  return `/Authentication/CodeVerifier?client_id=${clientId}&authorizationcode=${y}&code_verifier=${x}`;
}

export function utils() {
  const code_challenge_string = Math.random().toString(36).substring(7);
  const code_challenge = CryptoJS.SHA256(code_challenge_string).toString();
  sessionStorage.setItem("code_challenge_string", code_challenge_string);
  return `?client_id=${clientId}&code_challenge=${code_challenge}&code_challenge_Method=${code_challenge_Method}`;
}






