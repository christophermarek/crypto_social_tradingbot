import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocket.Server({
    noServer: true,
    path: "/websockets"
});

export const send_over_socket = async (datasource_type: string, data: any) => {
    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data, isBinary) {
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send('w');
                }
            });
        });
    });
}