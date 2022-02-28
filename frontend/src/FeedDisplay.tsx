import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { getTwitterCoinDataByTimeFrameAndName } from "./API";
import { RenderPriceVsMentionsChartForCoin } from "./chart_methods";
import { socket } from "./socket";
import { TwiitterStreamType } from "./Types/API";
import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"
import WordFilterControls from "./WordFilterControls";

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ twitter_24_hours, twitter_one_week, reddit_one_week }) => {

    useEffect(() => {
        socket.on("twitter", (data) => {
            setTwitterSocketData((twitteSocketData: TwitterSocketData[]) => [...twitteSocketData, data])
        });
        socket.on("reddit", (data) => {
            setRedditSocketData((redditSocketData: reddit_stream_type[]) => [...redditSocketData, data])
        });
        if (symbolsToFilter === undefined || symbolsToFilter.length < 1) {
            let tickers_to_filter: any = localStorage.getItem('tickers_to_filter');
            tickers_to_filter = JSON.parse(tickers_to_filter);
            if (tickers_to_filter === null) {
                console.log("resetting symbols to filter");
                setSymbolsToFilter(['']);
            } else {
                console.log("setting symbols to filter from localStorage");
                setSymbolsToFilter(tickers_to_filter);
            }
        }
    }, []);

    interface TwitterSocketData {

        created_at: string,
        text: string,
        id: string,
        url: string
    }
    interface reddit_stream_type {
        comment_id: string;
        comment_text: string,
        created_utc: number,
        permalink: string
    }
    const [twitteSocketData, setTwitterSocketData] = useState<any>([]);
    const [redditSocketData, setRedditSocketData] = useState<any>([]);
    const [symbolsToFilter, setSymbolsToFilter] = useState<string[]>([]);

    interface table_type {
        keyword_map: Map<string, number>,
        sentiment: number
    }

    const createTable = (tableData: table_type[]) => {

        // coinname is key
        let feed_to_display: any = {}

        let len_tableData = tableData.length;
        for (let i = 0; i < len_tableData; i++) {
            // iterate over all the keys in keywords map
            for (const [key, value] of Object.entries(tableData[i].keyword_map)) {
                if(symbolsToFilter.includes(key)){

                }else{
                    if (feed_to_display[key] === undefined) {
                        feed_to_display[key] = { mentions: 0, avgSentiment: 0, sentiment_count_for_avg: 0 }
                    }
                    feed_to_display[key].mentions = feed_to_display[key].mentions + value
                    // // update average sentiment
                    feed_to_display[key].avgSentiment = feed_to_display[key].avgSentiment + ((tableData[i].sentiment - feed_to_display[key].avgSentiment) / (feed_to_display[key].sentiment_count_for_avg + 1))
                    feed_to_display[key].sentiment_count_for_avg += 1
                }
                
            }
        }

        return (

            Object.keys(feed_to_display).map((table_row_key: any) =>
                <tr key={table_row_key}>
                    <td>{table_row_key}</td>
                    <td>{feed_to_display[table_row_key].mentions}</td>
                    <td>{feed_to_display[table_row_key].avgSentiment}</td>
                </tr>
            )

        )
    }

    return (
        <>
            <p>Real Time Twitter Stream</p>
            <div id='twitterPage'>
                <div id={'mainPage'}>
                    <div id={'left'}>
                        <table>
                            <thead>
                                <tr>
                                    <th>coinname</th>
                                    <th>mentions 1 week</th>
                                    <th>average sentiment 1 week</th>
                                </tr>
                            </thead>
                            <tbody>
                                {createTable(twitter_one_week)}
                            </tbody>
                        </table>
                    </div>
                    <div id='right'>
                        <p>Realtime Stream from server</p>
                        {twitteSocketData.map((twitter_stream_data: TwitterSocketData) =>
                            <div>
                                <p>{twitter_stream_data.text}</p>
                                <p>{twitter_stream_data.created_at}</p>
                                <a href={twitter_stream_data.url} target="_blank" rel="noreferrer">View Tweet</a>
                            </div>
                        )}
                    </div>
                </div>
                <div id={'chartsPage'}>
                    <p>Charts Page</p>
                    <p>Mentions vs Price for Eth past 7 days</p>
                    {RenderPriceVsMentionsChartForCoin('eth', 'ethereum', 300, 'twitter')}
                </div>
            </div>
            {/* reddit page */}
            <p>Real Time Stream</p>
            <div id='twitterPage'>
                <div id={'mainPage'}>
                    <div id={'left'}>
                        <table>
                            <thead>
                                <tr>
                                    <th>coinname</th>
                                    <th>mentions 1 week</th>
                                    <th>average sentiment 1 week</th>
                                </tr>
                            </thead>
                            <tbody>
                                {createTable(reddit_one_week)}
                            </tbody>
                        </table>
                        <WordFilterControls symbolsToFilter={symbolsToFilter} setSymbolsToFilter={setSymbolsToFilter}/>
                    </div>
                    <div id='right'>
                        <p>Realtime Stream from server</p>
                        {redditSocketData.map((reddit_stream_data: reddit_stream_type) =>
                            <div>
                                <p>{reddit_stream_data.comment_text}</p>
                                <p>{`${(new Date(reddit_stream_data.created_utc * 1000)).toDateString()} at ${(new Date(reddit_stream_data.created_utc * 1000)).toTimeString()}`}</p>
                                <a href={'old.reddit.com' + reddit_stream_data.permalink} target="_blank" rel="noreferrer">View Comment</a>
                            </div>
                        )}
                    </div>
                </div>
                <div id={'chartsPage'}>
                    <p>Charts Page</p>
                    <p>Mentions vs Price for Eth past 7 days</p>
                    {RenderPriceVsMentionsChartForCoin('eth', 'ethereum', 300, 'reddit')}
                </div>
            </div>
        </>
    )
}