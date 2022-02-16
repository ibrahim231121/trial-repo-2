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
        next() 
    
} 



export const logOutUserSessionExpired = () =>{

    logoutChannel.postMessage({logoutMessage:"im logout"})
     sessionStorage.removeItem('code_challenge_string');
     var opt;
     const options = { path:'/' };
     opt = cookies.remove('access_token',options)
     opt = localStorage.removeItem('username')
     opt = localStorage.removeItem('remember me')
    
  
} 


export const logoutAlltabs = ()=>{
    logoutChannel.onmessage = event=>{
        logOutUserSessionExpired();
        logoutChannel.close();
        console.log('asdasdsadsadsd',event.logoutMessage)
    }
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