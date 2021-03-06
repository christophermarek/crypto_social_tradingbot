import { stringify } from "querystring";
import { io } from "../app";
import { reddit_comment_for_db_type, reddit_stream_type } from "../Reddit/types";
import { TwitterStreamData } from "../Twitter_Streams/StreamTypes";


// datasource_type is the socket event name
export const send_over_socket = async (datasource_type: string, stream_data: TwitterStreamData) => {

    try{
        const data = stream_data.data; 
        // https://twitter.com/anyuser/status/932586791953158144 
        const url = `https://twitter.com/anyuser/status/${data.id}`
        io.emit(datasource_type, {created_at: data.created_at, text: data.text, id: data.id, url: url});
    } catch(error){
        console.log(stream_data);
    }
    

}

export const send_reddit_over_socket = async(eventName: string, reddit_comment: reddit_stream_type) => {
    try{
        io.emit(eventName, reddit_comment);
    } catch(error){
        console.log(`error sending over socket: ${eventName}`);
    }
}