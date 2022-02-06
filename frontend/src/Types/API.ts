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