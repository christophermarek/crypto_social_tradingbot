import express from 'express';
const { MongoClient } = require('mongodb');
import mongoose from 'mongoose'
import cors from 'cors'
import { schiff_stream } from './Twitter_Streams/SchiffStream';
import routes from './routes';
import { general_crypto_stream } from './Twitter_Streams/GeneralCryptoStream';
// import websockets from './websockets';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './socketio_types'
import { Server } from 'socket.io';


const app = express();
// websocket server takes up port 8000? need to figure this out.
const port = 8001;

// type defs i have no idea
const http = require('http');
const server = http.createServer(app);
export const io = new Server(server);


io.on('connection', (socket) => {
    console.log('a user connected');

    // number of users connected
    console.log(io.engine.clientsCount);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on ${port}`);

    // Bot scheduler, temp placement right now

    for (let i = 0; i < twitter_streams.length; i++) {
        if (twitter_streams[i].active) {
            switch (twitter_streams[i].name) {
                case 'SchiffStream':
                    console.log('Starting up Schiff Stream');
                    schiff_stream(process.env.TWITTER_BEARER_TOKEN);
                    break;
                case 'GeneralCryptoStream':
                    console.log('Starting up General Crypto Stream');
                    general_crypto_stream(process.env.TWITTER_BEARER_TOKEN);
                    break;
            }
        }
    }
});

require('dotenv').config();

// need to setup a load balancer with probably 10+ clients
// and a proxy for each client so I dont get banned on all of them at the same time


// Need to add routes to enable / disable bot from frontend

interface twitter_stream {
    name: string,
    active: boolean,
}

export const twitter_streams: twitter_stream[] = [
    { name: 'SchiffStream', active: false },
    { name: 'GeneralCryptoStream', active: true }
]

app.use(cors())
app.use(routes)



const uri = `mongodb+srv://chris:${process.env.MONGO_PASSWORD}@cluster0.vgjbs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
}
mongoose.connect(uri, options).then(() => {
    console.log('Mongoose connection done')
}).catch((e) => {
    console.log('Mongoose connection error' + e)
})


