import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { AuthenticationAgent, setAPIAgentConfig } from "../utils/Api/ApiAgent";
import jwt_decode from 'jwt-decode';



interface IDecoded{
    exp:string;
}
interface CounterState {
    path: string,
    expires:Date
}


export const getAccessAndRefreshTokenAsync: any = createAsyncThunk('accessAndRefreshToken', async () => {
    const cookies = new Cookies();
    let currentData:any=new Date();
    currentData = Math.floor(currentData.getTime()/1000);
    let accessToken = cookies.get('access_token');
    if(accessToken)
    {
        let decodedAccessToken : any = jwt_decode(accessToken);
        let tokenexpiry = decodedAccessToken.exp;
        const isCommandOpen = parseInt(cookies.get('command_tab_count')) > 0;
        //const url = '/Authentication/GetAccessToken'+`?refreshToken=${localStorage.getItem('refreshToken')}`;
        if ( (tokenexpiry-300) < currentData && tokenexpiry > 0 && !isCommandOpen)
        {
            return await AuthenticationAgent.getAccessAndRefreshToken('/Authentication/GetAccessToken'+`?refreshToken=${cookies.get('refreshToken')}`)
                .then((response:any) => {updatetokens(response.refreshToken, response.accessToken); return true})
                .catch((error: any) => {
                    console.error(error.response.data);
                    return false;
                });
        }
        else if ( tokenexpiry < currentData && tokenexpiry > 0)
        {
            return false;
        }
        return true;
    }
    
});



export const accessAndRefreshTokenSlice = createSlice({
    name: 'accessAndRefreshToken',
    initialState: { success: true },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAccessAndRefreshTokenAsync.fulfilled, (state: any, { payload }) => {
            state.success = payload;
        })
    }
});

export default accessAndRefreshTokenSlice;

const updatetokens = (refreshToken : string, accessToken: string)=>
{
    let decoded:IDecoded;
    const cookies = new Cookies();
    decoded = jwt_decode(accessToken)
    localStorage.setItem("expirytime_token",decoded.exp)
    const condition = localStorage.getItem('remember me')   
    if (condition == "True")
    {
        const date:any = localStorage.getItem('expiryDate')
        const dateToTimeStamp = new Date(date).getTime()
        const currentDate = new Date().getTime()
        const difference = dateToTimeStamp - currentDate
        var newdateInTimeStamp = difference + currentDate
        var newdateReadable = new Date(newdateInTimeStamp)
        const options:CounterState = { path:'/',expires:newdateReadable };
        cookies.set('access_token', accessToken, options)
        cookies.set('refreshToken', refreshToken, options)
        setAPIAgentConfig();
    }
    else
    {
        const options = {path:'/'}
        cookies.set('access_token',accessToken,options);
        cookies.set('refreshToken', refreshToken, options)
        setAPIAgentConfig();
    }
}
