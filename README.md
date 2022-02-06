
Project Proposal:

The problem with data analytics for the stock market or large cap coins is that retail traders do not impact the price as much as low cap cryptocurrencies.
- If you can track analytics on lower cap coins


Plan:
-> would I have to track realtime?
-> I already have my server running for that so I can just add it
https://www.npmjs.com/package/twitter-api-v2


OK so I forgot how annoying scraping these social media sites are with their rate limiting.

Probably work on the bot first and have a visualizer on the client.
-> with a way the client can modify the bot
-> then I can move onto data sources


##  TRADING BOT PLAN

Backend


Frontend
- The goal of the frontend is to be able to update bot paramaters & view bot trades. 
- Create new bots on the front end.
- Specify bot trading styles.


MVP FOR FIRST PART (SCHIFF TRADING BOT)


Then second part
-> setup a Twitter stream using a twitter npm package
https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule


## PROJECT PAIN POINTS currently:

Twitter data streams:
1. Streams expire after 19 days I think, so cant keep them open forevery (easy solution I just need a way to check)
2. 500,000 tweets allowed to stream a month. The problem is I cannot check how many I have reached other than on the twitter dashboard. Or if API req fails
3. Limit on the number of streams I can open ( I think its only one or two to be honest )


Solutions:
- for 1. I need error handling, I cant parse the error code and I cant find it in their api so I can only handle generic fails right now, I can also track how long the stream was running but If I probably want to restart on any fail, and just notify( email myself ) the result.

- for 2. and 3. I will need to create multiple api accounts, probably 10+ atleast to future proof this program if I want it to be fully autonomous when I am done. Each account will have to be created with proxy ip's so they wont get all banned at the same time. I also do not want my own twitter account to be banned.

- for 2. and 3. I will need to create a load balancer that also uses a proxy for each stream  which  that tracks which accounts have failed, and open streams with new ones. With 10 accounts I can parse 5 million tweets a month, is this even a lot? I dont feel like it is. Especially for some popular topics.

- Creating a bot that to create more bots, this could be feasible but I should not over engineer a solution until I actually run into the problem of needing new bots right, why waste time on this right now.


