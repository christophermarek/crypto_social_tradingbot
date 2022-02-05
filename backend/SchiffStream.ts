import TwitterApi, { ETwitterStreamEvent } from 'twitter-api-v2';
// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/examples.md#Streamtweetsinrealtime

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
        add: [{ value: 'from:PeterSchiff' }, ],
    });

    const stream = await client.v2.searchStream({
        'tweet.fields': ['author_id', 'created_at', 'text']
    });

    // Enable auto reconnect
    stream.autoReconnect = true;

    try{
        stream.on(ETwitterStreamEvent.Data, async tweet => {

            // tweet.data.text;
            // tweet.data.author_id;
            // tweet.data.created_at;

            
        
            //     // put tweet url, text, and date into db
            //     // can do buy calc on frontend
        
            //     // what about bot purchases? maybe later? I kinda wanna focus on the streams to be honest.
            // when would i close the connection other than error? idk actually shoudlnt it be 24/7
            // connections do reset though there is a rate limit feature that does this, need to figure it out
            });
    }catch (e){
        console.log('Error');
        console.log(e)

        stream.close();
        // Need to log this somewhere on the server aswell.
    }
    
}

