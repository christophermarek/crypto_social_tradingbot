import TwitterApi, { ETwitterStreamEvent, TweetLikingUsersV2Paginator } from 'twitter-api-v2';
import { SchiffStream, SchiffStreamType } from './Twitter_Streams/SchiffStreamBackend';
// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/examples.md#Streamtweetsinrealtime
const axios = require('axios')

console.log()

export const schiff_stream = async (bearer_token) => {

    // Client initialized
    const client = new TwitterApi(bearer_token);
    // console.log(client)

    // Get and delete old rules if needed
    const rules = await client.v2.streamRules();
    if (rules.data?.length) {
        await client.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        });
    }

    // Add our rules
    await client.v2.updateStreamRules({
        add: [{ value: 'from:chris_marek1' },],
    });

    const stream = await client.v2.searchStream({
        'tweet.fields': ['created_at', 'text']
    });

    // Enable auto reconnect
    stream.autoReconnect = true;


    try {
        stream.on(ETwitterStreamEvent.Data, async tweet => {

            // tweet.data.text;
            // tweet.data.author_id;
            // tweet.data.created_at;

            // search for btc mention
            let lowercase = tweet.data.text.toLowerCase();
            if (lowercase.includes('btc') || lowercase.includes('bitcoin')) {
                let date = new Date(tweet.data.created_at)
                var formattedDate = date.getUTCDate() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCFullYear()

                // get btc price at time of tweet
                let res = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}&localization=false`);

                // ITS MORE THAN JUST A SCHIFF TWEET I NEED TO ANALYZE IF HE SAYS BTC OR BITCOIN IN IT ASWELL
                // HE TWEETS ABOUT OTHER STUFF TO YOU KNOW!

                // ok i need to test this without opening a stream obviosuly because i am doing something wrong gonna get banend
                SchiffStream.create({ text: tweet.data.text, created_at: tweet.data.created_at, btc_price_at_post: res.data.market_data.current_price.usd }, function (err, entry) {
                    if (err) {
                        console.log(err)
                        stream.close();
                    } else {
                        console.log("Schiff Tweet successfully pushed to db");
                    }
                });

                //     // put tweet url, text, and date into db
                //     // can do buy calc on frontend

                //     // what about bot purchases? maybe later? I kinda wanna focus on the streams to be honest.
                // when would i close the connection other than error? idk actually shoudlnt it be 24/7
                // connections do reset though there is a rate limit feature that does this, need to figure it out

            } else {
                // dont care about this tweet
                console.log('non meaningful tweet from schiff')
            }



        });
    } catch (e) {
        console.log('Error');
        console.log(e)

        stream.close();
        // Need to log this somewhere on the server aswell.
    }

}

