import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ feed_to_display }) => {

    // REAL TIME TWEET FEED FROM STREAM ASWELL?
    // I do need to think about what coins I am going to setup streams for because I cant do hundreds.

    return (
        <>
            <p>Hello from Twitter Feed</p>

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
        </>
    )
}