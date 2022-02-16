import { notStrictEqual } from "assert";
import axios from "axios";
import { AggregationCursor } from "mongoose";

// add a connect to db function incase this is running standalone from the server

export const reddit_scraper = async () => {

    // first get coingecko ticker list
    // const ticker_list = (await axios.get(`https://api.coingecko.com/api/v3/coins/list`)).data;

    const subreddit_name = 'cryptocurrency';

    try {
        const { data } = await axios.get(
            `https://old.reddit.com/r/${subreddit_name}/comments.json`
        );
        const comments: api_comment_data[] = data.data.children;
        console.log(comments);
        
        // let size = comments.length;
        // for (let i = 0; i < size; i++) {
        //     commentsObj[comments[i].data.id] = comments[i].data.body
        // }
        // return commentsObj;

    } catch (error) {
        return;
    }

}

reddit_scraper()