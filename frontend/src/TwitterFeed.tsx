import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ feed_to_display }) => {

    // REAL TIME TWEET FEED FROM STREAM ASWELL?
    // I do need to think about what coins I am going to setup streams for because I cant do hundreds.
    
    return (
        <>
            <p>Hello from Twitter Feed</p>

            <table>
                <thead>
                    <td>coinname</td>
                    <td>mentions24hrs</td>
                    <td>hashtags24hrs</td>
                    <td>sentiment</td>
                </thead>
                <tbody>
                    {feed_to_display.map((row: Twitter_Table_Row) =>
                        <tr>
                            <td>{row.coinname}</td>
                            <td>{row.mentions24hrs}</td>
                            <td>{row.hashtags24hrs}</td>
                            <td>{row.sentiment}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}