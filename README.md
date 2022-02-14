
Project Proposal:

**Momentum trading bot**:
- Utilize the social media data
- Price data
- and volume data

The problem with data analytics for the stock market or large cap coins is that retail traders do not impact the price as much as low cap cryptocurrencies.
- If you can track analytics on lower cap coins.
- focus is on cryptocurrencies because it is an inefficient market.


## API's in use
For twitter data fetching:
- https://www.npmjs.com/package/twitter-api-v2
- https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule

For crypto pricing:
- https://www.coingecko.com/en/api

For trading bot:
- https://docs.kucoin.com/
- Kucoin was chosen because there are more coins, it is also my primary trading platform, and no KYC required.
- There is also a sandbox trading environment on Kucoin to test bots.


## PROJECT PAIN POINTS currently:

NEED a valid phone number for twitter API?
And their frontend API is a mess and not paginated for results, this might be tougher than I thought.

Twitter data streams:
1. Streams expire after 19 days I think, so cant keep them open forevery (easy solution I just need a way to check)
2. 500,000 tweets allowed to stream a month. The problem is I cannot check how many I have reached other than on the twitter dashboard. Or if API req fails
3. Limit on the number of streams I can open ( I think its only one  )


Solutions:
- for 1. I need error handling, I cant parse the error code and I cant find it in their api so I can only handle generic fails right now, I can also track how long the stream was running but If I probably want to restart on any fail, and just notify( email myself ) the result.

- for 2. and 3. I will need to create multiple api accounts, probably 10+ atleast to future proof this program if I want it to be fully autonomous when I am done. Each account will have to be created with proxy ip's so they wont get all banned at the same time. I also do not want my own twitter account to be banned.

- for 2. and 3. I will need to create a load balancer that also uses a proxy for each stream that tracks which accounts/streams have failed, and open streams automatically with new ones. With 10 accounts I can parse 5 million tweets a month, is this even a lot? I dont feel like it is. Especially for some popular topics.

- Creating a bot that to create more bots, this could be feasible but I should not over engineer a solution until I actually run into the problem of needing new bots right, why waste time on this right now.


