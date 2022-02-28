import axios from "axios";
import { api_comment_data, RootObject } from "./types";


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

    let responses = []
    for(let i = 0; i < 25; i++){
       
        const first_page = await axios.get(
            `https://old.reddit.com/r/cryptocurrency/comments.json?after=t1_hyt1ymm`
        );
    }


}

main()