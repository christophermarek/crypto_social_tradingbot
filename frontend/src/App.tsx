import React, { useEffect, useState } from 'react';
import './App.css';
import { Bots } from './Bots';
import { TwitterFeed } from './TwitterFeed';
import { TwitterFeedProps, Twitter_Table_Row } from './Types/TwitterFeed';
// import { WebSocket } from './websocket_viewer'
import { getAllBotInfo, getSchiffTweets } from './API'
import { APIAllBotInfo, APISchiffTweets } from './Types/API';


// https://cheatcode.co/tutorials/how-to-set-up-a-websocket-client-with-javascript

function App() {

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/websockets');

        ws.onmessage = (evt: MessageEvent) => {
            console.log(evt);
            // const data: any = JSON.parse(evt.data);
            // this.setState((prevState: State) => {
            //     // return {data: prevState.data.concat(data).slice(-hertz * slidingTimeWindowSec * 1000)}
            // })
        };
    });

    interface Coingecko_Coins_List {
        id: string,
        symbol: string,
        name: string,
        platforms: {
            platform_name: string
        }
    }

    const [pageSelected, setPageSelected] = useState<string>('bots')
    const [coinsList, setCoinsList] = useState<Coingecko_Coins_List | undefined>(undefined);
    const [schiffTweets, setSchiffTweets] = useState<APISchiffTweets[] | undefined>(undefined);
    const [allBotInfo, setAllBotInfo] = useState<APIAllBotInfo[] | undefined>(undefined);

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

    if (coinsList === undefined) {
        // coingeckoFetch('1-1-2018')
    }


    const loadAPIData = async () => {
        if (schiffTweets === undefined) {
            console.log('fetching schiff tweets');
            let schiff_tweets: any = (await getSchiffTweets()).data;
            setSchiffTweets(schiff_tweets.tweets);
        }
        if (allBotInfo === undefined) {
            console.log('fetching all bot info');
            let all_bot_info = (await getAllBotInfo()).data;
            setAllBotInfo(all_bot_info);
        }
    }

    loadAPIData()

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

            <input type='button' value='view bots' onClick={() => setPageSelected('bots')} />
            <input type='button' value='view feed' onClick={() => setPageSelected('feed')} />
            <input type='button' value='view ws' onClick={() => setPageSelected('ws')} />

            {pageSelected === 'feed' &&
                <TwitterFeed feed_to_display={twitter_feed.feed_to_display} />
            }

            {pageSelected === 'bots' &&
                <>
                    {allBotInfo !== undefined && schiffTweets !== undefined ?
                        (
                            <Bots bot_info={allBotInfo} schiff_tweets={schiffTweets} />
                        )
                        :
                        (
                            <p>Still info from backend</p>
                        )

                    }
                </>
            }

            {pageSelected === 'ws' &&
                <div />
            }

        </div>
    );
}

export default App;
function componentDidMount() {
    throw new Error('Function not implemented.');
}

