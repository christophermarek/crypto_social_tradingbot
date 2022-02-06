import axios, { AxiosResponse } from "axios"
import { APIAllBotInfo, APISchiffTweets } from "./Types/API"

let baseUrl: string = "http://localhost:8000"
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