import { TwiitterStreamType } from "./API";

export interface Twitter_Table_Row{
    coinname: string,
    mentions24hrs: string,
    hashtags24hrs: string,
    sentiment: string
}

export interface TwitterFeedProps {
    
    twitter_24_hours: TwiitterStreamType[]
    twitter_one_week: TwiitterStreamType[]

}