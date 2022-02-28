import axios from "axios";
import { generate_keyword_map_and_sentiment_score } from "../DataProcessing/data_processor";
import { api_comment_data, reddit_comment_for_db_type, RootObject } from "./types";


const main = async () => {

    // scrape as far back as possible
    // do i want to save all data?
    // most fields are garbage

    // ok so get comments.json
    // then get last comment fetched and build query like
    // then we need a clean for duplicates, can probably parse after into a dict

    // for first run though I want to just check dates,

    // and need to save to file so I dont get shit on for too many calls, probably limit after 25 pages first to see how far back I go

    // first page scrape
    const first_page = await axios.get(
        `https://old.reddit.com/r/cryptocurrency/comments.json`
    );

    const resp: RootObject = first_page.data;


    const first_after = resp.data.after

    // fetch the after field and loop queries

    let after = first_after;

    let commentsList: api_comment_data[] = [];

    // append first response
    const comments = resp.data.children;
    let size = comments.length;
    for (let i = 0; i < size; i++) {
        const comment_data: api_comment_data = comments[i].data;
        commentsList.push(comment_data)
    }

    // now go back 25 pages
    for (let i = 0; i < 10000; i++) {

        try{
            const page_fetched = await axios.get(
                `https://old.reddit.com/r/cryptocurrency/comments.json?after=${after}`
            );
    
            const resp: RootObject = page_fetched.data;
    
            after = resp.data.after
    
            const comments = resp.data.children;
            let size = comments.length;
            for (let i = 0; i < size; i++) {
                const comment_data: api_comment_data = comments[i].data;
                commentsList.push(comment_data)
            }
        }catch{
            // stop iterating and sending requests since we are rate limited, will have to run again with new past date
            break;
        }
        
    }
 


    // save to file as raw data
    var fs = require('fs');
    fs.writeFile("raw_data.txt", JSON.stringify(commentsList), function (err) {
        if (err) {
            console.log(err);
        }
    });

    // NOW PROCESS RAW DATA TO ANOTHER FILE

    // first get coingecko ticker list
    const ticker_list = (await axios.get(`https://api.coingecko.com/api/v3/coins/list`)).data;

    // need to clean this list bc api returns an array of objects, but i just want an array of strings to quickly parse in my processor
    let ticker_list_cleaned = [];
    let ticker_list_len = ticker_list.length;

    for (let i = 0; i < ticker_list_len; i++) {
        ticker_list_cleaned.push(ticker_list[i].symbol);
        ticker_list_cleaned.push(ticker_list[i].name);
    }

    let processed_comments_list: reddit_comment_for_db_type[] = [];
    // now a separate file for processed data, I want to keep a copy of both just incase 
    for(let i = 0; i < commentsList.length; i++){
        const comment_data: api_comment_data = commentsList[i];
        const comment_id = comment_data.id;
        let comment_text = comment_data.body;
        const created_utc = comment_data.created_utc;
        const permalink = comment_data.permalink;
        const processed_comment_text = generate_keyword_map_and_sentiment_score(ticker_list_cleaned, comment_text);
        if(processed_comment_text !== null){
            const comment_for_db: reddit_comment_for_db_type = {
                _id: comment_id,
                created_utc: created_utc,
                permalink: permalink,
                sentiment: processed_comment_text.sentiment,
                keyword_map: processed_comment_text.keyword_map
            }
    
            processed_comments_list.push(comment_for_db);
        }
        

    }

    // now that this works I need to do better data processing so I can see how far back I can go
    // important to track the dates
    // and keep it in cleaned obj, 
    // steps
    // define interface for backtest data
    // and save into a csv? or maybe a large json file
    // then I can make a separate query file later
    fs.writeFile("processed_comments.txt", JSON.stringify(processed_comments_list), function (err) {
        if (err) {
            console.log(err);
        }
    });

}

main()