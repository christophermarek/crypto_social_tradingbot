// https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express#creating-a-websocket-server

import WebSocket from "ws";
import queryString from "query-string";

export default async (expressServer) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/websockets",
    });

    expressServer.on("upgrade", (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket, head, (websocket) => {
            // passes this to the websocketServer.on() 
            // console.log(request);
            websocketServer.emit("connection", websocket, request);
        });
    });

    websocketServer.on(
        "connection",
        function connection(websocketConnection, connectionRequest) {
            const [_path, params] = connectionRequest?.url?.split("?");
            const connectionParams = queryString.parse(params);

            // NOTE: connectParams are not used here but good to understand how to get
            // to them if you need to pass data with the connection to identify it (e.g., a userId).
            console.log(connectionParams);

            websocketConnection.on("message", (message) => {
                // console.log(message)
                const parsedMessage = JSON.parse(message);
                console.log(parsedMessage);
                websocketConnection.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
            });
        }
    );

    return websocketServer;
};