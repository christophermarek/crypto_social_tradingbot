import { Router } from "express"
import { twitter_streams } from "./app"
import { getAllTwitterStream, getTwitterCoinDataByTimeFrame, getTwitterCoinDataByTimeFrameAndName } from "./Twitter_Streams/twitter_stream_backend"
import { getAllRedditStream, getRedditCoinDataByTimeFrame, getRedditCoinDataByTimeFrameAndName } from "./Reddit/reddit_backend"
import { getAllSchiffTweets } from "./Twitter_Streams/SchiffStreamBackend"

const router: Router = Router()

router.get('/', (req, res) => {
    res.send('Server is running!')
})

router.get('/bots/all/info', (req, res) => {
    res.json(twitter_streams)
})
router.get('/twitter_streams/schiff', getAllSchiffTweets)

router.get('/twitter_streams/generalcryptostream/all', getAllTwitterStream)
router.get('/twitter_streams/generalcryptostream/:timeframe', getTwitterCoinDataByTimeFrame)
router.get('/twitter_streams/generalcryptostream/:coin_name/:timeframe', getTwitterCoinDataByTimeFrameAndName)

router.get('/reddit_streams/cryptocurrency/all', getAllRedditStream)
router.get('/reddit_streams/cryptocurrency/:timeframe', getRedditCoinDataByTimeFrame)
router.get('/reddit_streams/cryptocurrency/:coin_name/:timeframe', getRedditCoinDataByTimeFrameAndName)

export default router;