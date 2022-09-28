import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import { codeChallengeRemove } from '../../utils/settings';
import { setAPIAgentConfig } from '../../utils/Api/ApiAgent';

export interface IDecoded{
    RememberMe:string;
    UserName:string;
    UserId: string;
    exp:string;
}
const cookies = new Cookies();
let decoded:IDecoded;

export const authenticate = (accessToken:string,idToken:string,refreshToken:string,next:() => void ) =>{
 
    if (accessToken == null && idToken==null && refreshToken == null)
    {
        window.location.replace("/");
    }
   
        decoded = jwt_decode(idToken)
          localStorage.setItem("refreshToken",refreshToken)
          localStorage.setItem("username",decoded.UserName)
          localStorage.setItem("remember me",decoded.RememberMe)
          localStorage.setItem("User Id",decoded.UserId)
          localStorage.setItem("expirytime_token",decoded.exp)
        const condition = localStorage.getItem('remember me')

        if (condition === 'True')
        {
            
            let date = new Date().getTime();
            const expire = date + (60*60*24*1000*30) //Note: 60 minutes * 60 seconds * 24 hours * 1000 (for milliseconds) * 30 days
            const expireDate = new Date(expire)
            const expireDateLocalStorage:any = new Date(expireDate); 
            localStorage.setItem('expiryDate',expireDateLocalStorage);
            const options = { path:'/',expires:expireDate };
            cookies.set('access_token',accessToken,options);
            setAPIAgentConfig();
        }
        else 
        {
            
            const options = {path:'/'}
            cookies.set('access_token',accessToken,options);
            setAPIAgentConfig();
        }
        codeChallengeRemove();
    
        next();

        
        
   
} 

export const isAuthenticated = () => {

    if (cookies.get('access_token')) {
        return cookies.get('access_token')
    }

    else {
        return false
    }
}


export const logOutUser = () => {
    sessionStorage.removeItem('code_challenge_string');
    

        var opt;
        const options = { path:'/' };
        opt = cookies.remove('access_token',options)
        opt = localStorage.removeItem('username')
        opt = localStorage.removeItem('remember me')     
        localStorage.removeItem('User Id')     
        window.location.href = "/";
      
    
} 
export const getToken = () => {
    return cookies.get('access_token') 
}