
## Routes

get '/'
- Test if server is only

get '/bots/all/info'
- returns a list of bots the server has in its executor, in the format { name: 'botname', active: false }

get '/twitter_streams/schiff'
- returns the Schiff tweets captured by the twitter stream. JSON object of format {_id, text: 'tweet_text', created_at: 'date tweet posted', btc_price_at_post: 'Price of bitcoin when tweet was parsed (this is easier to calculate on the backend in real time than doing it in the frontend)'}


## Server

Server is two parts, 
1. first it acts as a backend to communicate with the frontend to retrieve data on the bots and twitter streams running to display on the client.
2. The second part is the Twitter Stream executor, which right now only runs twitter streams on server start if active: true.

