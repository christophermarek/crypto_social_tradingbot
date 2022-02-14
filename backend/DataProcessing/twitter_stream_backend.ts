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

// FINDS entries in db with keyword maps for the coin_name, and with date between now and now - hours passed in params
export const getTwitterCoinDataByTimeFrameAndName = async (req: Request, res: Response): Promise<void> => {
    try {
        const coin_name = req.params.coin_name;
        const timeframe = parseInt(req.params.timeframe);
        let curr_date = new Date();
        let prev_date = new Date();
        prev_date.setHours(prev_date.getHours() - timeframe);

        // ok now run query
        const query_result: TwiitterStreamType[] = await TwitterStream.find(
            {
                post_date:
                {
                    $gte: prev_date,
                    $lte: curr_date
                }
                ,

                [`keyword_map.${coin_name}`]: {
                    "$exists": true
                }
            }

        ).exec()

        res.status(200).json(query_result);
    } catch (error) {
        // WHAT IS THE ERROR WHY IS THIS NOT WORKING? IT WORKED BEFORE
        // is it because the query with coinname is not escaped properly?
        console.log(error)
        res.status(400).json(error);
    }
}

// FINDS entries in db with date between now and now - hours passed in params
export const getTwitterCoinDataByTimeFrame = async (req: Request, res: Response): Promise<void> => {
    try {
        const timeframe = parseInt(req.params.timeframe);
        let curr_date = new Date();
        let prev_date = new Date();
        prev_date.setHours(prev_date.getHours() - timeframe);

        // ok now run query
        const query_result: TwiitterStreamType[] = await TwitterStream.find(
            {
                post_date:
                {
                    $gte: prev_date,
                    $lte: curr_date
                }
            }
        ).exec()

        res.status(200).json(query_result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
}
