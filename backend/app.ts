import express from 'express';
const { MongoClient } = require('mongodb');
import mongoose from 'mongoose'
import cors from 'cors'
import { schiff_stream } from './SchiffStream';
import routes from './routes';

const app = express();
const port = 8000;

require('dotenv').config();

// need to setup a load balancer with probably 10+ clients
// and a proxy for each client so I dont get banned on all of them at the same time


// Need to add routes to enable / disable bot from frontend

interface twitter_stream {
    name: string,
    active: boolean,
}

// Bot scheduler, temp placement right now
export const twitter_streams: twitter_stream[] = [
    { name: 'SchiffStream', active: false }
]

for (let i = 0; i < twitter_streams.length; i++) {
    if (twitter_streams[i].active) {

        switch (twitter_streams[i].name) {
            case 'SchiffStream':
                console.log('Starting up Schiff Stream')
                schiff_stream(process.env.TWITTER_BEARER_TOKEN)
                break;
        }
    }
}


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
mongoose
    .connect(uri, options)
    .then(() => {
        console.log('Mongoose connection done')
        app.listen(port, () => {
            console.log(`Server is running on port ${port}.`);
        });
    })
    .catch((e) => {
        console.log('Mongoose connection error' + e)
    })

