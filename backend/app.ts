import express from 'express';
const { MongoClient } = require('mongodb');

import { schiff_stream } from './SchiffStream';


const app = express();
const port = 8000;

require('dotenv').config();
// console.log(process.env.TWITTER_BEARER_TOKEN)

// need to setup a load balancer with probably 10+ clients
// and a proxy for each client so I dont get banned on all of them at the same time


// Need to add routes to enable / disable bot from frontend, and see if it is
// enabled / disabled

interface twitter_stream{
    name: string,
    active: boolean,
} 

const twitter_streams: twitter_stream[] = [
    {name: 'SchiffStream', active: false}
]

for(let i = 0; i < twitter_streams.length; i++){
    if(twitter_streams[i].active){

        switch(twitter_streams[i].name){
            case 'SchiffStream':
                schiff_stream(process.env.TWITTER_BEARER_TOKEN)
                break;
        }

    }
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/twitter_streams', (req, res) => {
    res.json(twitter_streams)
})


const uri = `mongodb+srv://chris:${process.env.MONGO_PASSWORD}@cluster0.vgjbs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});