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

    let after = first_after;

    let commentsList = [];

    // append first response
    const comments = resp.data.children;
    let size = comments.length;
    for (let i = 0; i < size; i++) {
        const comment_data: api_comment_data = comments[i].data;
        commentsList.push(comment_data)
    }

    // now go back 25 pages
    for (let i = 0; i < 25; i++) {

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

        // clean this response now into a proper obj

    }

    // now that this works I need to do better data processing so I can see how far back I can go
    // important to track the dates
    // 

    // save to file 
    var fs = require('fs');
    fs.writeFile("test.txt", JSON.stringify(commentsList), function (err) {
        if (err) {
            console.log(err);
        }
    });

}

main()