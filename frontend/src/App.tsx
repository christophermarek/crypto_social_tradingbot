import React, { useEffect, useState } from 'react';
import './App.css';
import { Bots } from './Bots';
import { TwitterFeed } from './TwitterFeed';
import { TwitterFeedProps, Twitter_Table_Row } from './Types/TwitterFeed';
import { getAllBotInfo, getSchiffTweets, getTwitterCoinDataByTimeFrame } from './API'
import { APIAllBotInfo, APISchiffTweets, TwiitterStreamType } from './Types/API';

function App() {

    interface Coingecko_Coins_List {
        id: string,
        symbol: string,
        name: string,
        platforms: {
            platform_name: string
        }
    }

    useEffect(() => {

        async function loadDataFromServer(){
            // CHANGE THIS To 24 hours once real time stream is up
            let data24hr = (await getTwitterCoinDataByTimeFrame(30)).data;
            let data1week = (await getTwitterCoinDataByTimeFrame(168)).data;
    
            setTwitterData24Hours(data24hr)
            setTwitterDataOneWeek(data1week);
        }

        loadDataFromServer()
        
    }, []);

    const [pageSelected, setPageSelected] = useState<string>('bots')
    const [coinsList, setCoinsList] = useState<Coingecko_Coins_List | undefined>(undefined);
    const [schiffTweets, setSchiffTweets] = useState<APISchiffTweets[] | undefined>(undefined);
    const [allBotInfo, setAllBotInfo] = useState<APIAllBotInfo[] | undefined>(undefined);
    const [twitterData24Hours, setTwitterData24Hours] = useState<TwiitterStreamType[] | undefined>(undefined)
    const [twitterDataOneWeek, setTwitterDataOneWeek] = useState<TwiitterStreamType[] | undefined>(undefined)

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

    return (
        <div className="App">

            <div className='navBar'>
                <input type='button' className='navBtn' value='BOTS' onClick={() => setPageSelected('bots')} />
                <input type='button' className='navBtn' value='DATA' onClick={() => setPageSelected('feed')} />
            </div>

            {pageSelected === 'feed' && twitterData24Hours !== undefined && twitterDataOneWeek &&
                <TwitterFeed twitter_24_hours={twitterData24Hours} twitter_one_week={twitterDataOneWeek}/>
            }

            {pageSelected === 'bots' &&
                <>
                    {allBotInfo !== undefined && schiffTweets !== undefined ?
                        (
                            <Bots bot_info={allBotInfo} schiff_tweets={schiffTweets} />
                        )
                        :
                        (
                            <p>Loading info from backend</p>
                        )

                    }
                </>
            }


        </div>
    );
}

export default App;


