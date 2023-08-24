import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { AuthenticationAgent, setAPIAgentConfig } from "../utils/Api/ApiAgent";
import jwt_decode from 'jwt-decode';
import { getDomainName } from "../utils/settings";



interface IDecoded{
    exp:string;
}
interface CounterState {
    path: string,
    expires:Date,
    domain: string | undefined,
}


export const getAccessAndRefreshTokenAsync: any = createAsyncThunk('accessAndRefreshToken', async () => {
    const cookies = new Cookies();
    let currentData:any=new Date();
    currentData = Math.floor(currentData.getTime()/1000);
    let accessToken = cookies.get('access_token');
    let refreshToken = cookies.get('refreshToken');
    if(accessToken)
    {
        let decodedAccessToken : any = jwt_decode(accessToken);
        let tokenexpiry = decodedAccessToken.exp;
        const isCommandOpen = parseInt(cookies.get('command_tab_count')) > 0;
        //const url = '/Authentication/GetAccessToken'+`?refreshToken=${localStorage.getItem('refreshToken')}`;
        var userId = parseInt(localStorage.getItem('User Id') ?? "0");
        if ( (tokenexpiry-300) < currentData && tokenexpiry > 0 && !isCommandOpen)
        {
            return await AuthenticationAgent.getAccessAndRefreshToken('/Authentication/GetAccessToken'+`?refreshToken=${cookies.get('refreshToken')}&userId=${userId}`)
                .then((response:any) => {
                    updatetokens(response.refreshToken, response.accessToken); 
                    return {success: true, accessToken: response.accessToken, refreshToken: response.refreshToken};
                })
                .catch((error: any) => {
                    console.error(error.response.data);
                    return {success: false, accessToken: undefined, refreshToken: undefined};
                });
        }
        else if ( tokenexpiry < currentData && tokenexpiry > 0)
        {
            return {success: false, accessToken: undefined, refreshToken: undefined};
        }
        return {success: true, accessToken: accessToken, refreshToken: refreshToken};
    }
    
});



export const accessAndRefreshTokenSlice = createSlice({
    name: 'accessAndRefreshToken',
    initialState: { success: true, accessToken: undefined, refreshToken: undefined },
    reducers: {
        setAccessAndRefreshToken: (state: any, action: PayloadAction<any>) => {
            const {payload} = action;
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
          }
    },
    extraReducers: (builder) => {
        builder.addCase(getAccessAndRefreshTokenAsync.fulfilled, (state: any, { payload }) => {
            state.success = payload.success;
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
        })
    }
});

export default accessAndRefreshTokenSlice;
export const { setAccessAndRefreshToken: setAccessAndRefreshToken} = accessAndRefreshTokenSlice.actions;

const updatetokens = (refreshToken : string, accessToken: string)=>
{
    let decoded:IDecoded;
    const cookies = new Cookies();
    decoded = jwt_decode(accessToken)
    localStorage.setItem("expirytime_token",decoded.exp)
    const condition = localStorage.getItem('remember me')   
    const domainName = getDomainName();
    if (condition == "True")
    {
        const date:any = localStorage.getItem('expiryDate')
        const dateToTimeStamp = new Date(date).getTime()
        const currentDate = new Date().getTime()
        const difference = dateToTimeStamp - currentDate
        var newdateInTimeStamp = difference + currentDate
        var newdateReadable = new Date(newdateInTimeStamp)
        const options:CounterState = { path:'/',expires:newdateReadable, domain: domainName };
        cookies.set('access_token', accessToken, options)
        cookies.set('refreshToken', refreshToken, options)
        setAPIAgentConfig();
    }
    else
    {
        const options = {path:'/', domain: domainName}
        cookies.set('access_token',accessToken,options);
        cookies.set('refreshToken', refreshToken, options)
        setAPIAgentConfig();
    }
}
