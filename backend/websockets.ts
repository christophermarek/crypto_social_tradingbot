// https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express#creating-a-websocket-server

import WebSocket from "ws";
import queryString from "query-string";

export default async (expressServer: { on: (arg0: string, arg1: (request: any, socket: any, head: any) => void) => void; }) => {

    console.log('Websocket route loaded'); 

    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/websockets"
    });

    expressServer.on("upgrade", (request: any, socket: any, head: any) => {
        websocketServer.handleUpgrade(request, socket, head, (websocket: any) => {
            console.log('websocket connection recieved');
            // passes this to the websocketServer.on() 
            websocketServer.emit("connection", websocket, request);
        });
    });

    websocketServer.on(
        "connection",
        function connection(websocketConnection: { on: (arg0: string, arg1: (message: any) => void) => void; send: (arg0: string) => void; }, connectionRequest: { url: { split: (arg0: string) => [any, any]; }; }) {
            const [_path, params] = connectionRequest?.url?.split("?");
            const connectionParams = queryString.parse(params);
            console.log('sending message to connection');
            // NOTE: connectParams are not used here but good to understand how to get
            // to them if you need to pass data with the connection to identify it (e.g., a userId).

            // this will only run when we recieve a message
            websocketConnection.on("message", (message: string) => {
                console.log('in message');
                // console.log(message)
                const parsedMessage = JSON.parse(message);
                console.log(parsedMessage);
                websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
            });
        }
    );


    return websocketServer;
};

