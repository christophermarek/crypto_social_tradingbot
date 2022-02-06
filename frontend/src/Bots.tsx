import { useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { APIAllBotInfo, APISchiffTweets } from "./Types/API"

interface BotsProps {
    bot_info: APIAllBotInfo[],
    schiff_tweets: APISchiffTweets[]
}

interface CoinGeckoHistoricalMarketChartApi {
    prices: [
        [number, number]
    ]
}

export const Bots: React.FC<BotsProps> = ({ bot_info, schiff_tweets }) => {

    const [historicalbtcPrices, setHistoricalbtcPrices] = useState<CoinGeckoHistoricalMarketChartApi | undefined>(undefined);
    const [schiffDataCleaned, setSchiffDataCleaned] = useState<boolean>(false);

    const btc_coin_gecko_past360_days = () => {
        return 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily';
    };

    const coingeckoFetch = async () => {
        fetch(btc_coin_gecko_past360_days()).then((response) =>
            response.json().then((jsonData) => {
                setHistoricalbtcPrices(jsonData)
            })
        );
    };

    if (historicalbtcPrices === undefined) {
        coingeckoFetch()
    }

    const activateBot = (bot_name: string) => {

    }

    const appendPricesToSchiffDates = () => {
        for (let i = 0; i < schiff_tweets.length; i++) {
            

            console.log(formattedDate)
            // if (historicalbtcPrices !== undefined) {
            //     for (let n = 0; n < historicalbtcPrices.prices.length; n++) {
            //         if (epoch === historicalbtcPrices.prices[n][0]) {
            //             schiff_tweets[i].btc_price = (historicalbtcPrices.prices[n][1]).toString();
            //         }
            //     }
            // }
        }
        // setSchiffDataCleaned(true)
    }

    // ok this is honestly way more messy than just fetching the price using the server when i get the tweet
    // just change it when u wakeup

    let flag = false;
    if(historicalbtcPrices !== undefined){
        if(!flag){
            console.log('hi')
            appendPricesToSchiffDates()
            flag = true;
        }
    }
    
    return (
        <>
            <p>Bots Page</p>

            {bot_info.map((bot: APIAllBotInfo) =>
                <div key={bot.name}>
                    <p>{bot.name}</p>
                    <p>Active: {bot.active ? 'true' : 'false'}</p>
                    <input type='button' value={bot.active ? 'Turn Off' : 'Turn On'} onClick={() => activateBot(bot.name)} />
                    {schiffDataCleaned &&
                        <div>
                            <p>Schiff Tweets</p>
                            <ul>
                                {schiff_tweets.map((tweet: APISchiffTweets) =>
                                    <li>Text: {tweet.text} Date: {tweet.created_at} BTC Price at Date: {tweet.btc_price}</li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
            )}
        </>
    )
}