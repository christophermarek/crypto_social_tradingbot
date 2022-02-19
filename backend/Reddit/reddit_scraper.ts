import axios from "axios";
import { generate_keyword_map_and_sentiment_score } from "../DataProcessing/data_processor";
import { send_reddit_over_socket } from "../Sockets/socket";
import { RedditStream } from "./reddit_backend";
import { api_comment_data, reddit_comment_for_db_type } from './types'


// add a connect to db function incase this is running standalone from the server

export const reddit_scraper = async () => {

    // first get coingecko ticker list
    const ticker_list = (await axios.get(`https://api.coingecko.com/api/v3/coins/list`)).data;

    // need to clean this list bc api returns an array of objects, but i just want an array of strings to quickly parse in my processor
    let ticker_list_cleaned = [];
    let ticker_list_len = ticker_list.length;

    for (let i = 0; i < ticker_list_len; i++) {
        ticker_list_cleaned.push(ticker_list[i].symbol);
        ticker_list_cleaned.push(ticker_list[i].name);
    }

    const subreddit_name = 'cryptocurrency';

    try {
        const { data } = await axios.get(
            `https://old.reddit.com/r/${subreddit_name}/comments.json`
        );
        const comments = data.data.children;
        // let comments_for_db: reddit_comment_for_db_type[] = [];
        let size = comments.length;
        for (let i = 0; i < size; i++) {
            const comment_data: api_comment_data = comments[i].data;
            // console.log(comment_data);
            // console.log(comments[i].data)
            const comment_id = comment_data.id;
            let comment_text = comment_data.body;
            const created_utc = comment_data.created_utc;
            const permalink = comment_data.permalink;

            // ok now create keyword map for this object and analyze sentiment;
            const processed_comment_text = generate_keyword_map_and_sentiment_score(ticker_list_cleaned, comment_text);
            // if null its a garbage comment so just ignore, no keyword map generated
            if (processed_comment_text !== null) {
                // push to datastruct
                // console.log(comment_id);
                const comment_for_db: reddit_comment_for_db_type = {
                    _id: comment_id,
                    created_utc: created_utc,
                    permalink: permalink,
                    sentiment: processed_comment_text.sentiment,
                    keyword_map: processed_comment_text.keyword_map
                }
                // comments_for_db.push(comment_for_db);

                // push to db, and send over socket code.
                RedditStream.create(comment_for_db, function (err, entry) {
                    if (err) {
                        // console.log(err)
                    } else {
                        // probably want to update this to be more specific
                        // console.log(`pushed comment: ${comment_for_db._id} to db`);

                        // will send only unique comments over stream
                        send_reddit_over_socket('reddit', {
                            comment_id: comment_id,
                            comment_text: comment_text,
                            created_utc: created_utc,
                            permalink: permalink
                        })
                    }
                });

                
            }

        }

    } catch (error) {
        return;
    }

}

export function start_reddit_scraper_executor() {

    // every 15 seconds fire up a new reddit scraper
    var ref = setInterval(() => {

        reddit_scraper();

    }, 15000);
}
