import { useEffect, useState } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { getTwitterCoinDataByTimeFrameAndName } from "./API";
import { socket } from "./socket";
import { TwiitterStreamType } from "./Types/API";
import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ twitter_24_hours, twitter_one_week }) => {

    useEffect(() => {
        socket.on("twitter", (data) => {
            setTwitterSocketData((twitteSocketData: TwitterSocketData[]) => [...twitteSocketData, data])
        });
    }, []);

    interface TwitterSocketData {

        created_at: string,
        text: string,
        id: string,
        url: string
    }
    const [twitteSocketData, setTwitterSocketData] = useState<any>([])

    const createTable = (tableData: TwiitterStreamType[]) => {

        // coinname is key
        let feed_to_display: any = {}

        let len_tableData = tableData.length;
        for (let i = 0; i < len_tableData; i++) {
            // iterate over all the keys in keywords map
            for (const [key, value] of Object.entries(tableData[i].keyword_map)) {

                if (feed_to_display[key] === undefined) {
                    feed_to_display[key] = { mentions: 0, avgSentiment: 0, sentiment_count_for_avg: 0 }
                }
                feed_to_display[key].mentions = feed_to_display[key].mentions + value
                // // update average sentiment
                feed_to_display[key].avgSentiment = feed_to_display[key].avgSentiment + ((tableData[i].sentiment - feed_to_display[key].avgSentiment) / (feed_to_display[key].sentiment_count_for_avg + 1))
                feed_to_display[key].sentiment_count_for_avg += 1
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

    // PROBLEMS HERE, COINGECKO API uses coinname as the coins name, but my server api uses coinname as the ticker. This is a problem!
    // How to solve?

    // https://recharts.org/en-US/examples/SimpleScatterChart
    // coinname (not ticker)) eg bitcoin, ethereum
    // timeframe in hours
    const RenderPriceVsMentionsChartForCoin = (coin_name: string, coin_full_name: string, time_frame: number, tableData: TwiitterStreamType[]) => {

        interface coinsMarketDataHistorical {
            market_caps: []
            prices: []
            total_volumes: []
        }

        // FROM API
        // Minutely data will be used for duration within 1 day,
        //  Hourly data will be used for duration between 1 day and 90 days, 
        //  Daily data will be used for duration above 90 days.
        // fetch prices with dates/times
        const coingeckoUrl = () => {
            // convert hours param to days
            const num_days = time_frame / 24
            return `https://api.coingecko.com/api/v3/coins/${coin_full_name}/market_chart?vs_currency=usd&days=${num_days}`;
        };


        useEffect(() => {

            const coingeckoFetch = async () => {
                fetch(coingeckoUrl()).then((response) =>
                    response.json().then((jsonData) => {
                        setCoingeckoChartData(jsonData)
                        return jsonData
                    })
                );
            };

            const fetchFromServerApi = async() => {
                let data = (await getTwitterCoinDataByTimeFrameAndName(coin_name, 168)).data
                setServerDataForCoinByTimeFrame(data);
            }

            fetchFromServerApi()
            coingeckoFetch()

        }, []);


        const [coingeckoChartData, setCoingeckoChartData] = useState<coinsMarketDataHistorical | undefined>(undefined)
        const [serverDataForCoinByTimeFrame, setServerDataForCoinByTimeFrame] = useState<TwiitterStreamType[] | undefined>(undefined)


        const data = [
            { x: 100, y: 200 },
            { x: 120, y: 100 },
            { x: 170, y: 300 },
            { x: 140, y: 250 },
            { x: 150, y: 400 },
            { x: 110, y: 280 },
        ];

        // now coingecko data fetched

        // now need my own data call my own api to getTwitterCoinDataByTimeFrameAndName

        

        //aggregate data for this
        // we want prices per date
        // guess we do the same when fetching, from now until now - timespan (need this as an arg to pass)
        // and mentions per date, we find this when iterating over table data
        // then combine the two to create the x/y
        if(coingeckoChartData !== undefined && serverDataForCoinByTimeFrame !== undefined){
            
            // update state when complete
        }


        return (

            coingeckoChartData === undefined ?

                (
                    <p>Data not loaded yet from coingecko</p>
                )
                :
                (
                    <>
                        <ScatterChart
                            width={400}
                            height={400}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid />
                            <XAxis type="number" dataKey="x" name="mentions" unit="cm" />
                            <YAxis type="number" dataKey="y" name="price" unit="kg" />
                            <Tooltip cursor={{ strokeDasharray: '1 1' }} animationDuration={0} />
                            <Scatter name="Price vs Mentions" data={data} fill="#8884d8" />
                        </ScatterChart >
                        )
                    </>

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
                    {RenderPriceVsMentionsChartForCoin('eth', 'ethereum', 168, twitter_one_week)}
                </div>
            </div>
        </>
    )
}