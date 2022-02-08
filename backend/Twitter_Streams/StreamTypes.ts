export interface TwitterStreamData {
    data: {
        author_id: string,
        created_at: string,
        id: string,
        public_metrics: {
            retweet_count: string,
            reply_count: string,
            like_count: string,
            quote_count: string
        }
        text: string,
        matching_rules?: [
            { id: string, tag: string }
        ]
    }

}