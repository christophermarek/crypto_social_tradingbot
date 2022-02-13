import { useEffect, useState } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
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

    // https://recharts.org/en-US/examples/SimpleScatterChart
    const renderPriceVsMentionsChartForCoin = (coin_name: string, tableData: TwiitterStreamType[]) => {

        const data = [
            { x: 100, y: 200, z: 200 },
            { x: 120, y: 100, z: 260 },
            { x: 170, y: 300, z: 400 },
            { x: 140, y: 250, z: 280 },
            { x: 150, y: 400, z: 500 },
            { x: 110, y: 280, z: 200 },
        ];

        return (
            <ResponsiveContainer width="100%" height="100%">
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
                    <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                    <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="A school" data={data} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
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
                    <p>Mentions vs Price vs Eth past 7 days</p>
                    {renderPriceVsMentionsChartForCoin('eth', twitter_one_week)}
                </div>
            </div>
        </>
    )
}