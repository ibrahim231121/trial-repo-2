import Cookies from 'universal-cookie';
import{ BroadcastChannel} from 'broadcast-channel';
import { timerActionCreator } from './../../Redux/timerslice';
import { useDispatch, useSelector } from "react-redux";
import { getDomainName } from '../../utils/settings';

const cookies = new Cookies();


interface Message{
    logoutMessage:string
}

const logoutChannel: BroadcastChannel<Message> = new BroadcastChannel("logout");


export const logOutUser = (next:()=>void) =>{

    sessionStorage.removeItem('code_challenge_string');

        var opt;
        const domainName = getDomainName();
        const options = { path:'/', domain: domainName };
        opt = cookies.remove('access_token',options)
        opt = cookies.remove('refreshToken',options)
        opt = localStorage.removeItem('loginId')
        opt = localStorage.removeItem('remember me')
        opt = localStorage.removeItem('User Id')
        opt = localStorage.removeItem('expirytime_token')
        opt = localStorage.removeItem('expiryDate')
        opt = localStorage.removeItem('caseOpenedForEvidence');
        next() 
    
} 



export const logOutUserSessionExpired = (next:()=>void) =>{

    logoutChannel.postMessage({logoutMessage:"im logout"})
    sessionStorage.removeItem('code_challenge_string');
    var opt;
    const domainName = getDomainName();
    const options = { path:'/', domain: domainName };
    opt = cookies.remove('access_token',options)
    opt = cookies.remove('refreshToken',options)
    opt = localStorage.removeItem('loginId')
    opt = localStorage.removeItem('remember me')
    opt = localStorage.removeItem('User Id')
    opt = localStorage.removeItem('expirytime_token')
    opt = localStorage.removeItem('expiryDate')
    opt = localStorage.removeItem('caseOpenedForEvidence');
    next()
}

export const SessionRouteT = ()=>{
    if (localStorage.getItem('sessionRoute'))
    {
       return true
    }
  
    else{
        return false
    }
}