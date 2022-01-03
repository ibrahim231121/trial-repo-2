import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import { codeChallengeRemove } from '../../utils/settings';
import { useHistory } from "react-router";

interface IDecoded {
    RememberMe: string;
    UserName: string;
}
const cookies = new Cookies();
let decoded: IDecoded;
const expiresAt = 60 * 17;

export const authenticate = (accessToken: string, idToken: string, refreshToken: string, next: () => void) => {


    // if (typeof window !== 'undefined'){
    decoded = jwt_decode(idToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("username", decoded.UserName)
    localStorage.setItem("remember me", decoded.RememberMe)
    const condition = localStorage.getItem('remember me')

    if (condition === 'True') {

        let date = new Date();
        date.setTime(date.getTime() + (expiresAt * 60 * 1000));
        const options = { path: '/', expires: date };
        cookies.set('access_token', accessToken, options);
    }
    else {

        const options = { path: '/' }
        cookies.set('access_token', accessToken, options);
    }
    codeChallengeRemove();

    next();



    // }
}

export const isAuthenticated = () => {

    if (cookies.get('access_token')) {
        return cookies.get('access_token')
    }

    else {
        return false
    }
}


export const LogOutUser = (historyCB:any) => {

    var history;
    if(historyCB){
        history = historyCB();
    }
    sessionStorage.removeItem('code_challenge_string');
    var opt;
    const options = { path: '/' };
    opt = cookies.remove('access_token', options)
    opt = localStorage.removeItem('username')
    opt = localStorage.removeItem('remember me')
    opt = localStorage.removeItem('assetBucket')
    // window.location.reload(false);
    // next()
    history.push("/");



}



