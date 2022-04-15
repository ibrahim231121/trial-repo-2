import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';
import { getToken } from '../Login/API/auth';


const isDev = process.env.NODE_ENV === 'development';
const RECEIVER_SOCKET_METHOD_NAME = "OnMessage";

declare const window : any;

var socketConnectionId:any = null;


export const getSocketConnectionId = () => {
  return socketConnectionId;
}

export const setSocketConnectionId = (connectionId: any) => {
  socketConnectionId = connectionId;
}

const startSignalRConnection = async (connection: any) => {
  try {
    
    await connection.start().then(() => { // to start the server

              console.log('server connected!!!');

              connection.invoke('getConnectionId')
              .then(function (connectionId: any) {  
                setSocketConnectionId(connectionId);
                console.log("Connection Id: ", getSocketConnectionId())
              }).catch((e: any) => 
                console.log("Connection failed: ", e)
              );

              if (connection) 
              { 
               
                  // const token = localStorage.getItem('refreshToken')
                  const lstgroups = ["GROUP_1","GROUP_2"];
                  connection.send("subcribeGroups",lstgroups)
                  // connection.send("subscribe","GROUP_1");
              }

          }).catch((err: any) => console.log(err));

    console.assert(connection.state === HubConnectionState.Connected);
    console.log('SignalR connection established');
  } catch (err) {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.error('SignalR Connection Error: ', err);
    setTimeout(() => startSignalRConnection(connection), 5000);
  }
};

// Set up a SignalR connection to the specified hub URL, and actionEventMap.
// actionEventMap should be an object mapping event names, to eventHandlers that will
// be dispatched with the message body.
export const setupSignalRConnection = (connectionHub: any) =>{

  // create the connection instance
  // withAutomaticReconnect will automatically try to reconnect
  // and generate a new socket connection if needed
  console.log("token",getToken());
  const connection = new  HubConnectionBuilder()       
    .withUrl(connectionHub+ `?token=${getToken()}`) 
     .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
    

  // Note: to keep the connection open the serverTimeout should be
  // larger than the KeepAlive value that is set on the server
  // keepAliveIntervalInMilliseconds default is 15000 and we are using default
  // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
  connection.serverTimeoutInMilliseconds = 60000;

  // re-establish the connection if connection dropped
  connection.onclose(error => {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
  });

  connection.onreconnecting(error => {
    console.assert(connection.state === HubConnectionState.Reconnecting);
    console.log('Connection lost due to error. Reconnecting.', error);
    if (connection) 
    { 
     
        // const token = localStorage.getItem('refreshToken')
        const lstgroups = ["GROUP_1","GROUP_2"];
        connection.send("subcribeGroups",lstgroups)
        // connection.send("subscribe","GROUP_1");
    }
  });

  connection.onreconnected(connectionId => {
    console.assert(connection.state === HubConnectionState.Connected);
    console.log('Connection reestablished. Connected with connectionId', connectionId);

    if (connection) 
    { 
     
        // const token = localStorage.getItem('refreshToken')
        const lstgroups = ["GROUP_1","GROUP_2"];
        connection.send("subcribeGroups",lstgroups)
        // connection.send("subscribe","GROUP_1");
    }
  });

 
  startSignalRConnection(connection);

  connection.on(RECEIVER_SOCKET_METHOD_NAME, res => { //'receiveMessageNew'   //OnMessage //OnConnectedAsync  
    // new Notification('Messenger SignalR Response Message ' + res.data );     
      window.onWSMsgRec.data = res;
      window.dispatchEvent(window.onWSMsgRec);
  });

  // return connection;
};