import { useEffect, useState } from "react";


interface SocketProps {

}

export const WebSocket: React.FC<SocketProps> = ({ }) => {

    // const apiCall = {
    //     event: 'bts:subscribe',
    //     data: { channel: 'order_book_btcusd' },
    // };
    // const [bids, setBids] = useState([0]);

    // useEffect(() => {
    //     const ws = new WebSocket('wss://ws.bitstamp.net');
    //     ws.onopen = (event: any) => {
    //         ws.send(JSON.stringify(apiCall));
    //     };
    //     ws.onmessage = function (event: { data: string; }) {
    //         const json = JSON.parse(event.data);
    //         try {
    //             if ((json.event === 'data')) {
    //                 setBids(json.data.bids.slice(0, 5));
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     //clean up function
    //     return () => ws.close();
    // }, []);
    // const firstBids = bids.map((item, index) => (
    //     <div key={index}>
    //         <p> {item}</p>
    //     </div>
    // ));

    return(
         <p>#</p>
    );
}
