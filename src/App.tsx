import React, { useEffect, useState } from 'react';
import './App.css';
import { TwitterFeed } from './TwitterFeed';
import { TwitterFeedProps, Twitter_Table_Row } from './Types/TwitterFeed';

function App() {

    interface Coingecko_Coins_List {
        id: string,
        symbol: string,
        name: string,
        platforms: {
            platform_name: string
        }
    }

    // convert to type later
    const [coinsList, setCoinsList] = useState(undefined);

    const coingeckoUrl = (date: string) => {
        return `https://api.coingecko.com/api/v3/coins/list?include_platform=true`;
    };


    const coingeckoFetch = async (date: string) => {
        fetch(coingeckoUrl(date)).then((response) =>
            response.json().then((jsonData) => {
                console.log(jsonData);
                setCoinsList(jsonData);
            })
        );
    };

    if(coinsList === undefined){
        coingeckoFetch('1-1-2018')
    }

    const twitter_feed: TwitterFeedProps = {
        feed_to_display: [
            { coinname: 'BTC', mentions24hrs: '1000', hashtags24hrs: '1000', sentiment: '100' },
            { coinname: 'ETH', mentions24hrs: '3121', hashtags24hrs: '3928', sentiment: '1200' },
            { coinname: 'ADA', mentions24hrs: '11', hashtags24hrs: '3928', sentiment: '-3000' },
            { coinname: 'FTX', mentions24hrs: '221321', hashtags24hrs: '324214', sentiment: '300' },
            { coinname: 'SOL', mentions24hrs: '22341', hashtags24hrs: '213213', sentiment: '450' },

        ]
    }


    return (
        <div className="App">

            <TwitterFeed feed_to_display={twitter_feed.feed_to_display} />

        </div>
    );
}

export default App;
