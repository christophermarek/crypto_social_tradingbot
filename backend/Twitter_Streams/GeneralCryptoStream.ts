
import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
import { processes_stream_data } from '../DataProcessing/data_processor';
import { send_over_socket } from '../Sockets/socket';
import { sample } from './sample_general_twitterstream';

export const general_crypto_stream = async (bearer_token) => {

    console.log('General Crypto Stream initialized');

    const { sample } = require('./sample_general_twitterstream');

    // these will come in a stream so I need to simulate them being streamed for testing
    // add delay 1ms to simulate stream

    function longForLoop(limit) {
        let i = 0;
        let total_iters = 0;
        var ref = setInterval(() => {

            send_over_socket('twitter', sample[i]);

            processes_stream_data('twitter', sample[i]);

            i = i + 1;
            total_iters = total_iters + 1;

            if(i === sample.length + 1){
                i = 0;
            }

            if (total_iters == limit) clearInterval(ref);
        }, 1000);
    }

    longForLoop(10000);

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
