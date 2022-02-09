export interface TwitterStreamData {
    data: {
        author_id: string,
        created_at: string,
        id: string,
        public_metrics: {
            retweet_count: any,
            reply_count: any,
            like_count: any,
            quote_count: any
        }
        text: string,
        matching_rules?: [
            { id: string, tag: string }
        ]
    }

}