export interface APISchiffTweets {
    _id:        string;
    text:       string;
    author_id:  string;
    created_at: string;
    btc_price?: string;
    __v?:       number;
}

export interface APIAllBotInfo {
    name:   string;
    active: boolean;
}