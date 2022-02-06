import { Router } from "express"
import { twitter_streams } from "./app"
import { getAllSchiffTweets } from "./Twitter_Streams/SchiffStreamBackend"

const router: Router = Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/bots/all/info', (req, res) => {
    res.json(twitter_streams)
})
router.get('/twitter_streams/schiff', getAllSchiffTweets)


export default router;