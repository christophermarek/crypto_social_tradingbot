import { model, Schema } from "mongoose"
import { Response, Request } from "express"

interface SchiffStreamType {
    _id: string,
    text: string,
    author_id: string,
    created_at: string
}

const SchiffStreamSchema: Schema = new Schema(
    {
        _id: { type: String },

        text: { type: String },

        author_id: { type: String },

        created_at: { type: String }

    },
)

export const SchiffStream = model<SchiffStreamType>("SchiffStream", SchiffStreamSchema)

export const getAllTweets = async (req: Request, res: Response): Promise<void> => {
    try {
        const tweets: SchiffStreamType[] = await SchiffStream.find({}).exec();
        res.status(200).json({ tweets });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

