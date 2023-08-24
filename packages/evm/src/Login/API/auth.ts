import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { codeChallengeRemove, getDomainName } from '../../utils/settings';
import { setAPIAgentConfig } from '../../utils/Api/ApiAgent';

export interface IDecoded {
    RememberMe: string;
    LoginId: string;
    UserId: string;
    exp: string;
    AssignedGroups: string;
    AssignedModules : string;
}
const cookies = new Cookies();
let decoded: IDecoded;
export const authenticate = (accessToken: string, idToken: string, refreshToken: string, next: () => void) => {
    
    if (accessToken == null && idToken == null && refreshToken == null) {
        window.location.replace('/accessDenied');
    }

    decoded = jwt_decode(idToken);
    localStorage.setItem('loginId', decoded.LoginId);
    localStorage.setItem('remember me', decoded.RememberMe);
    localStorage.setItem('User Id', decoded.UserId);
    localStorage.setItem('expirytime_token', decoded.exp);
    const condition = localStorage.getItem('remember me');
    const domainName = getDomainName();

    if (condition === 'True') {
        let date = new Date().getTime();
        const expire = date + 60 * 60 * 24 * 1000 * 30; //Note: 60 minutes * 60 seconds * 24 hours * 1000 (for milliseconds) * 30 days
        const expireDate = new Date(expire);
        const expireDateLocalStorage: any = new Date(expireDate);
        localStorage.setItem('expiryDate', expireDateLocalStorage);
        const options = { path: '/', expires: expireDate, domain: domainName };
        cookies.set('access_token', accessToken, options);
        cookies.set('refreshToken', refreshToken, options);
        setAPIAgentConfig();
    } else {
        const options = { path: '/', domain: domainName };
        cookies.set('access_token', accessToken, options);
        cookies.set('refreshToken', refreshToken, options);
        setAPIAgentConfig();
    }
    codeChallengeRemove();

    next();
};

export const isAuthenticated = () => {
    if (cookies.get('access_token')) {
        const cookies = new Cookies();
        let currentDate: any = new Date();
        currentDate = Math.floor(currentDate.getTime() / 1000);
        let accessToken = cookies.get('access_token');
        let decodedAccessToken: any = jwt_decode(accessToken);
        let tokenexpiry = decodedAccessToken.exp;
        if (tokenexpiry < currentDate && tokenexpiry > 0) {
            return false;
        }

        return cookies.get('access_token');
    } else {
        return false;
    }
};

export const logOutUser = () => {
    sessionStorage.removeItem('code_challenge_string');

    var opt;
    const domainName = getDomainName();
    const options = { path: '/', domain: domainName };
    opt = cookies.remove('access_token', options);
    opt = localStorage.removeItem('loginId');
    opt = localStorage.removeItem('remember me');
    localStorage.removeItem('User Id');
    localStorage.removeItem("caseOpenedForEvidence");
    window.location.href = '/';
};
export const getToken = () => {
    return cookies.get('access_token');
};
