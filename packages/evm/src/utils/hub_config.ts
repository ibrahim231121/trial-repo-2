import { HubConnectionState, HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { getToken } from '../Login/API/auth';

const isDev = process.env.NODE_ENV === 'development';

declare const window: any;

var socketConnectionId: any = null;
var hubConnection: HubConnection;
var groupsToSubscribe: string[] = [];

enum WEB_SOCKET_METHODS {
    onMessage = "OnMessage",
    subscribeGroups = "subscribeGroups",
    unSubscribeGroups = "unSubscribeGroups",
    onDisconnectedAsync = "onDisconnectedAsync",
    send = "Send",
    getConnectionId = "getConnectionId",
}
enum WEB_SOCKET_SENDER_TYPE {
    toWebSocket = 1,
    toGRPC = 0
}

export const getSocketConnectionId = () => {
    return socketConnectionId;
  }
  
export const setSocketConnectionId = (connectionId: any) => {
    socketConnectionId = connectionId;
}

const startSignalRConnection = async (connection: HubConnection) => {
    try {
      await connection.start().then(() => { // to start the server
                console.log('server connected!!!');
                initialSetting(connection, true);
            }).catch(err => console.log(err));
      console.assert(connection.state === HubConnectionState.Connected);
    } catch (err) {
      console.assert(connection.state === HubConnectionState.Disconnected);
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => startSignalRConnection(connection), 5000);
    }
};

const initialSetting = async (connection: HubConnection, isConnected: boolean) => {
    if(isConnected === true) {
        await connection.invoke(WEB_SOCKET_METHODS.getConnectionId)
        .then((connectionId) => {
            setSocketConnectionId(connectionId);
            console.log("Connection Id: ", getSocketConnectionId())
            if(Array.isArray(groupsToSubscribe)) {
            sendDataToWebSocket(WEB_SOCKET_METHODS.subscribeGroups, groupsToSubscribe);
            }
        }).catch((e) => 
            console.log("Connection failed: ", e)
        );
    }
    else {
        setSocketConnectionId(null);
        sendDataToWebSocket(WEB_SOCKET_METHODS.unSubscribeGroups, groupsToSubscribe);
    }
}

export const sendDataToWebSocket = (method: string, data: any) => {
    if(hubConnection) {
        if(method === WEB_SOCKET_METHODS.send && hubConnection.state === HubConnectionState.Connected && data != null) {
        hubConnection.send(method, data.requestTemplate, (data.typeId ?? WEB_SOCKET_SENDER_TYPE.toGRPC));
        }
        else {
        hubConnection.send(method, data);
        }
    }
}

export const addToSubscribedGroups = (group: any) => {
    groupsToSubscribe.push(group);
}

// Set up a SignalR connection to the specified hub URL, and actionEventMap.
// actionEventMap should be an object mapping event names, to eventHandlers that will
// be dispatched with the message body.
export const setupSignalRConnection = (connectionHub: any) =>{
    const credentials = {
        token: getToken(),
        userId: localStorage.getItem('User Id'),
        tenantId: "1"
    }
    // create the connection instance
    // withAutomaticReconnect will automatically try to reconnect
    // and generate a new socket connection if needed
    hubConnection = new HubConnectionBuilder()       
        .withUrl(connectionHub+ `?credentials=${JSON.stringify(credentials)}` 
        ) 
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    // Note: to keep the connection open the serverTimeout should be
    // larger than the KeepAlive value that is set on the server
    // keepAliveIntervalInMilliseconds default is 15000 and we are using default
    // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
    hubConnection.serverTimeoutInMilliseconds = 60000;

    // re-establish the connection if connection dropped
    hubConnection.onclose(error => {
        console.assert(hubConnection.state === HubConnectionState.Disconnected);
        console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
        initialSetting(hubConnection, false);
        groupsToSubscribe = [];
        sendDataToWebSocket(WEB_SOCKET_METHODS.onDisconnectedAsync, socketConnectionId);
    });

    hubConnection.onreconnecting(error => {
        setSocketConnectionId(null);
        console.log('Connection lost due to error. Reconnecting.', error);
        window.showLoaderOnVP("Connecting web socket");
    });

    hubConnection.onreconnected(connectionId => {
        console.log('Connection reestablished. Connected with connectionId', connectionId);
        initialSetting(hubConnection, true);
        window.hideLoaderOnVP();
    });

    startSignalRConnection(hubConnection);

    hubConnection.on(WEB_SOCKET_METHODS.onMessage, res => {
        console.log(res);
        window.onWSMsgRec.data = res;
        window.dispatchEvent(window.onWSMsgRec);
    });
};
