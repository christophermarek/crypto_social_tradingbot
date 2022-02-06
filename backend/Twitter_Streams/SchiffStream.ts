import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
import { postOrder } from '../KucoinBot/tradingbot_kucoin';
import { SchiffStream } from './SchiffStreamBackend';
const axios = require('axios')


export const schiff_stream = async (bearer_token) => {

    // Client initialized
    const client = new TwitterApi(bearer_token);

    // Get and delete old rules if needed
    // nescessary right now since I have multiple streams on the same api key
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


                SchiffStream.create({ text: tweet.data.text, created_at: tweet.data.created_at, btc_price_at_post: res.data.market_data.current_price.usd }, function (err, entry) {
                    if (err) {
                        console.log(err)
                        stream.close();
                    } else {
                        console.log("Schiff Tweet successfully pushed to db");
                    }
                });

                // place order
                const order = {
                    baseParams: {
                        clientOid: Date.now(),
                        side: 'buy',
                        symbol: 'BTC-USDT',
                        type: 'limit',
                        tradeType: 'TRADE'
                    },
                    orderParams: {
                        price: '1000',
                        size: '1'
                    }
                }
                const orderId = await postOrder(order.baseParams, order.orderParams);
                console.log(`Order placed, with orderID: ${orderId}`);


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

