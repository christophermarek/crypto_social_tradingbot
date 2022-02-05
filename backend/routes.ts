import { Router } from "express"
import { getAllSchiffTweets } from "./Twitter_Streams/SchiffStreamBackend"

const router: Router = Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/twitter_streams/schiff', getAllSchiffTweets)


export default router;