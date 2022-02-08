import { useEffect, useState } from "react";
import { socket } from "./socket";
import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ feed_to_display }) => {


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


    return (
        <>
            <p>Hello from Twitter Feed</p>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>coinname</th>
                            <th>mentions24hrs</th>
                            <th>hashtags24hrs</th>
                            <th>sentiment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feed_to_display.map((row: Twitter_Table_Row) =>
                            <tr key={row.coinname}>
                                <td>{row.coinname}</td>
                                <td>{row.mentions24hrs}</td>
                                <td>{row.hashtags24hrs}</td>
                                <td>{row.sentiment}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div>
                <p>Realtime Stream from server</p>
                {twitteSocketData.map((twitter_stream_data: TwitterSocketData) =>
                    <div>
                        <p>{twitter_stream_data.text}</p>
                        <p>{twitter_stream_data.created_at}</p>
                        <a href={twitter_stream_data.url} target="_blank" rel="noreferrer">View Tweet</a>
                    </div>
                )}
            </div>

        </>
    )
}