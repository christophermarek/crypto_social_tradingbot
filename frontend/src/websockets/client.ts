import queryString from "query-string";

export const websocketClient = (options:any = {}, onConnect = null) => {
    let url = 'ws://localhost:8001/websockets'
    if (options.queryParams) {
        url = `${url}?${queryString.stringify(options.queryParams)}`;
    }

    let client = new WebSocket(url);

    client.addEventListener("open", () => {
        console.log(`[websockets] Connected to ${url}`);
    });

    client.addEventListener("close", () => {
        console.log(`[websockets] Disconnected from ${url}`);
        // client = null;
        client.close()
    });

    client.addEventListener("message", (event) => {
        if (event?.data && options.onMessage) {
            console.log(options.onMessage(JSON.parse(event.data)));
        }
    });

    const connection = {
        client,
        send: (message = {}) => {
            if (options.queryParams) {
                message = { ...message, ...options.queryParams };
            }

            return client.send(JSON.stringify(message));
        },
    };

    return connection;
};
