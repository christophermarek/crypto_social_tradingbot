import { model, Schema } from "mongoose"
import { Response, Request } from "express"

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

const TwitterStreamSchema: Schema = new Schema(
    {
        datasource: { type: String },
        tweet_id: { type: String },
        author_id: { type: String },
        post_date: { type: Date },
        sentiment: { type: Number },
        engagement: {
            retweet_count: { type: Number },
            reply_count: { type: Number },
            like_count: { type: Number },
            quote_count: { type: Number }
        },
        keyword_map: { type: Map }
    },
)

export const TwitterStream = model<TwiitterStreamType>("TwitterStreams", TwitterStreamSchema)

export const getAllTwitterStream = async (req: Request, res: Response): Promise<void> => {
    try {
        const tweet_stream_data: TwiitterStreamType[] = await TwitterStream.find({}).exec();
        res.status(200).json({ tweet_stream_data });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

export const getTwitterCoinDataByTimeFrame = async (req: Request, res: Response): Promise<void> => {
    try {
        const coin_name = req.params.coin_name;
        const timeframe = req.params.timeframe;
        
        // ok now run query

        res.status(200).json( req.params );
    } catch (error) {
        res.status(400).json({ error: error });
    }
}
