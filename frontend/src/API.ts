import axios, { AxiosResponse } from "axios"
import { APIAllBotInfo, APISchiffTweets, reddit_comment_for_db_type, TwiitterStreamType } from "./Types/API"

let baseUrl: string = "http://localhost:8001"
// const isProduction = process.env.REACT_APP_PRODUCTION;
// if(isProduction === "TRUE"){
//     baseUrl = "https://stock-news-analyze.herokuapp.com"
// }

export const getSchiffTweets = async (): Promise<AxiosResponse<APISchiffTweets[]>> => {
    try{
        const schiff_tweets: AxiosResponse<APISchiffTweets[]> = await axios.get(
            baseUrl + "/twitter_streams/schiff"
        )
        return schiff_tweets
    }catch (error: any){
        throw new Error(error)
    }
}

export const getAllBotInfo = async (): Promise<AxiosResponse<APIAllBotInfo[]>> => {
    try{
        const all_bot_info: AxiosResponse<APIAllBotInfo[]> = await axios.get(
            baseUrl + "/bots/all/info"
        )
        return all_bot_info
    }catch (error: any){
        throw new Error(error)
    }
}

// server casts timeframe to int
// timeframe is in hours, it fetches tweets from current time to current time - timeframe
export const getTwitterCoinDataByTimeFrame = async (timeframe: number): Promise<AxiosResponse<TwiitterStreamType[]>> => {
    try{
        const twitter_stream_data: AxiosResponse<TwiitterStreamType[]> = await axios.get(
            baseUrl + `/twitter_streams/generalcryptostream/${timeframe}`
        )
        return twitter_stream_data
    }catch (error: any){
        throw new Error(error)
    }
}

// coinname is by ticker
// server casts timeframe to int
// timeframe is in hours, it fetches tweets from current time to current time - timeframe
export const getTwitterCoinDataByTimeFrameAndName = async (coin_name: string, timeframe: number): Promise<AxiosResponse<TwiitterStreamType[]>> => {
    try{
        const twitter_stream_data: AxiosResponse<TwiitterStreamType[]> = await axios.get(
            baseUrl + `/twitter_streams/generalcryptostream/${coin_name}/${timeframe}`
        )
        return twitter_stream_data
    }catch (error: any){
        throw new Error(error)
    }
}

// server casts timeframe to int
// timeframe is in hours, it fetches tweets from current time to current time - timeframe
export const getRedditCoinDataByTimeFrame = async (timeframe: number): Promise<AxiosResponse<reddit_comment_for_db_type[]>> => {
    try{
        const reddit_stream_data: AxiosResponse<reddit_comment_for_db_type[]> = await axios.get(
            baseUrl + `/reddit_streams/cryptocurrency/${timeframe}`
        )
        return reddit_stream_data
    }catch (error: any){
        throw new Error(error)
    }
}

// coinname is by ticker
// server casts timeframe to int
// timeframe is in hours, it fetches tweets from current time to current time - timeframe
export const getRedditCoinDataByTimeFrameAndName = async (coin_name: string, timeframe: number): Promise<AxiosResponse<TwiitterStreamType[]>> => {
    try{
        const reddit_stream_data: AxiosResponse<TwiitterStreamType[]> = await axios.get(
            baseUrl + `/reddit_streams/cryptocurrency/${coin_name}/${timeframe}`
        )
        return reddit_stream_data
    }catch (error: any){
        throw new Error(error)
    }
}