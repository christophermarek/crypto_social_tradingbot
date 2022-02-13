import { Router } from "express"
import { twitter_streams } from "./app"
import { getAllTwitterStream, getTwitterCoinDataByTimeFrame, getTwitterCoinDataByTimeFrameAndName } from "./DataProcessing/twitter_stream_backend"
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

router.get('/twitter_streams/generalcryptostream/:coin_name/:timeframe', getTwitterCoinDataByTimeFrameAndName)
router.get('/twitter_streams/generalcryptostream/:timeframe', getTwitterCoinDataByTimeFrame)


export default router;