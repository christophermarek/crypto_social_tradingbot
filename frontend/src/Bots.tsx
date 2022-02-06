import { useState } from "react";
import { APIAllBotInfo, APISchiffTweets } from "./Types/API"

interface BotsProps {
    bot_info: APIAllBotInfo[],
    schiff_tweets: APISchiffTweets[]
}



export const Bots: React.FC<BotsProps> = ({ bot_info, schiff_tweets }) => {


    const activateBot = (bot_name: string) => {

    }


    return (
        <>
            <p>Bots Page</p>

            {bot_info.map((bot: APIAllBotInfo) =>
                <div key={bot.name}>
                    <p>{bot.name}</p>
                    <p>Active: {bot.active ? 'true' : 'false'}</p>
                    <input type='button' value={bot.active ? 'Turn Off' : 'Turn On'} onClick={() => activateBot(bot.name)} />
                    <div>
                        <p>Schiff Tweets</p>
                        <ul>
                            {schiff_tweets.map((tweet: APISchiffTweets) =>
                                <li>Text: {tweet.text} Date: {tweet.created_at} BTC Price at Date: {tweet.btc_price_at_post}</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}