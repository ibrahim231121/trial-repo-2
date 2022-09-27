import Cookies from 'universal-cookie';
import{ BroadcastChannel} from 'broadcast-channel';
import { timerActionCreator } from './../../Redux/timerslice';
import { useDispatch, useSelector } from "react-redux";

const cookies = new Cookies();


interface Message{
    logoutMessage:string
}

const logoutChannel: BroadcastChannel<Message> = new BroadcastChannel("logout");


export const logOutUser = (next:()=>void) =>{

    sessionStorage.removeItem('code_challenge_string');

        var opt;
        const options = { path:'/' };
        opt = cookies.remove('access_token',options)
        opt = localStorage.removeItem('username')
        opt = localStorage.removeItem('remember me')
        opt = localStorage.removeItem('refreshToken')
        opt = localStorage.removeItem('User Id')
        opt = localStorage.removeItem('expirytime_token')
        opt = localStorage.removeItem('expiryDate')
        next() 
    
} 



export const logOutUserSessionExpired = (next:()=>void) =>{

    logoutChannel.postMessage({logoutMessage:"im logout"})
    sessionStorage.removeItem('code_challenge_string');
    var opt;
    const options = { path:'/' };
    opt = cookies.remove('access_token',options)
    opt = localStorage.removeItem('username')
    opt = localStorage.removeItem('remember me')
    opt = localStorage.removeItem('refreshToken')
    opt = localStorage.removeItem('User Id')
    opt = localStorage.removeItem('expirytime_token')
    opt = localStorage.removeItem('expiryDate')
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