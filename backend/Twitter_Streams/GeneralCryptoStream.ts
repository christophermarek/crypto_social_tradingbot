
import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
import { sample } from './sample_general_twitterstream';

export const general_crypto_stream = async (bearer_token) => {

    console.log('General Crypto Stream initialized');

    interface TwitterStreamData {
        data: {
            author_id: string,
            created_at: string,
            id: string,
            public_metrics: {
                retweet_count: string,
                reply_count: string,
                like_count: string,
                quote_count: string
            }
            text: string,
            matching_rules: [
                { id: string, tag: string }
            ]
        }

    }

    const { sample: TwitterStreamData } = require('./sample_general_twitterstream');
    
    // these will come in a stream so I need to simulate them being streamed for testing
    for(let i = 0; i < sample.length; i++){
        console.log(sample[i]);

        // data processing steps here

        // DO SOCKET FIRST? then i can do the REST, atleast socket will look cool and I can just constantly refresh the same loop just add an artificial
        // 10ms delay or something like that
    }

    // console.log(sample);
    // // Client initialized
    // const client = new TwitterApi(bearer_token);

    // // Get and delete old rules if needed
    // // nescessary right now since I have multiple streams on the same api key
    // const rules = await client.v2.streamRules();
    // if (rules.data?.length) {
    //     await client.v2.updateStreamRules({
    //         delete: { ids: rules.data.map(rule => rule.id) },
    //     });
    // }

    // // Add our rules
    // await client.v2.updateStreamRules({
    //     add: [{ value: 'crypto -is:reply lang:en', tag: 'crypto' }, { value: 'cryptocurrency -is:reply lang:en', tag: 'cryptocurrency' }, { value: '#crypto -is:reply lang:en', tag: '#crypto' }, { value: '#cryptocurrency -is:reply lang:en', tag: '#cryptocurrency' }],
    // });

    // const stream = await client.v2.searchStream({
    //     'tweet.fields': ['created_at', 'text', 'author_id', 'public_metrics']
    // });

    // // Enable auto reconnect
    // stream.autoReconnect = true;


    // try {
    //     console.log('General Crypto Stream On');

    //     stream.on(ETwitterStreamEvent.Data, async tweet => {

    //         console.log(tweet);

    //     });
    // } catch (e) {
    //     console.log('Error');
    //     console.log(e)
    //     stream.close();
    //     // Need to log this somewhere on the server aswell.
    // }

}

general_crypto_stream('asadsa')