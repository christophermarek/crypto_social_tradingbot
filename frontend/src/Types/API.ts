export interface APISchiffTweets {
    _id:        string;
    text:       string;
    author_id:  string;
    created_at: string;
    btc_price_at_post: string;
    __v?:       number;
}

export interface APIAllBotInfo {
    name:   string;
    active: boolean;
}

export interface TwiitterStreamType {
    datasource: string,
    tweet_id: string,
    author_id: string,
    post_date: string,
    sentiment: number,
    engagement: {
        retweet_count: number,
        reply_count: number,
        like_count: number,
        quote_count: number
    },
    keyword_map: Map<string, number>
}
