import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ feed_to_display }) => {

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