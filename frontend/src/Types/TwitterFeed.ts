
export interface Twitter_Table_Row{
    coinname: string,
    mentions24hrs: string,
    hashtags24hrs: string,
    sentiment: string
}

export interface TwitterFeedProps {
    
    feed_to_display: Twitter_Table_Row[]

}