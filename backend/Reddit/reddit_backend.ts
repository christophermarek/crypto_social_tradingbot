import { model, Schema } from "mongoose"
import { Response, Request } from "express"
import { reddit_comment_for_db_type } from "./types"


const RedditStreamSchema: Schema = new Schema(
    {
        _id: { type: String },
        created_utc: { type: Number },
        permalink: { type: String },
        sentiment: { type: Number },
        keyword_map: { type: Map },

    },
)

export const RedditStream = model<reddit_comment_for_db_type>("RedditStreams", RedditStreamSchema)

export const getAllRedditStream = async (req: Request, res: Response): Promise<void> => {
    try {
        const reddit_stream_data: reddit_comment_for_db_type[] = await RedditStream.find({}).exec();
        res.status(200).json({ reddit_stream_data });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

// FINDS entries in db with keyword maps for the coin_name, and with date between now and now - hours passed in params
export const getRedditCoinDataByTimeFrameAndName = async (req: Request, res: Response): Promise<void> => {
    try {
        const coin_name = req.params.coin_name;
        const timeframe = parseInt(req.params.timeframe);
        let curr_date = new Date();
        let prev_date = new Date();
        prev_date.setHours(prev_date.getHours() - timeframe);

        let curr_utc = Date.UTC(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate(), curr_date.getHours(), curr_date.getMinutes(), curr_date.getSeconds())
        let prev_utc = Date.UTC(prev_date.getFullYear(), prev_date.getMonth(), prev_date.getDate(), prev_date.getHours(), prev_date.getMinutes(), prev_date.getSeconds())

        // ok now run query
        const query_result: reddit_comment_for_db_type[] = await RedditStream.find(
            {
                post_date:
                {

                    $gte: prev_utc,
                    $lte: curr_utc
                }
                ,

                [`keyword_map.${coin_name}`]: {
                    "$exists": true
                }
            }

        ).exec()

        res.status(200).json(query_result);
    } catch (error) {
        res.status(400).json(error);
    }
}

// // FINDS entries in db with date between now and now - hours passed in params
export const getRedditCoinDataByTimeFrame = async (req: Request, res: Response): Promise<void> => {
    try {
        const timeframe = parseInt(req.params.timeframe);
        let curr_date = new Date();
        let prev_date = new Date();
        prev_date.setHours(prev_date.getHours() - timeframe);

        let curr_utc = Date.UTC(curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate(), curr_date.getHours(), curr_date.getMinutes(), curr_date.getSeconds())
        let prev_utc = Date.UTC(prev_date.getFullYear(), prev_date.getMonth(), prev_date.getDate(), prev_date.getHours(), prev_date.getMinutes(), prev_date.getSeconds())

        // ok now run query
        const query_result: reddit_comment_for_db_type[] = await RedditStream.find(
            {
                post_date:
                {
                    $gte: prev_utc,
                    $lte: curr_utc
                }
            }
        ).exec()

        res.status(200).json(query_result);
    } catch (error) {
        res.status(400).json({ error: error });
    }
}
