import { TwitterFeedProps, Twitter_Table_Row } from "./Types/TwitterFeed"
import { websocketClient } from './websockets/client'

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ feed_to_display }) => {

    //move up and control state with app so I dont keep creating connections every render 
    // const ws_client = websocketClient();
    
    let recieved_messages = [];
    let ws_connected = false;
    websocketClient(
        {
          onMessage: (message: any) => {
            console.log(message);
          },
          onDisconnect: () => {
            // ws_connected = false;
            // convert to state or it wont work
          },
        },
        
      );

    return (
        <>
            <p>Hello from Twitter Feed</p>
            <p>CLick to view TWEET: USE the url format that that twitter url creator site makes with the tweet id.</p>


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