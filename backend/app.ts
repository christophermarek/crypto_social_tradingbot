import express from 'express';

import { schiff_stream } from './SchiffStream';


const app = express();
const port = 8000;

require('dotenv').config();
// console.log(process.env.TWITTER_BEARER_TOKEN)

schiff_stream(process.env.TWITTER_BEARER_TOKEN)

// Need to add routes to enable / disable bot from frontend, and see if it is
// enabled / disabled

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});