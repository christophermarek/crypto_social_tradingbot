import { type } from "os";
import { sample } from "../OfflineData/sample_general_twitterstream";
import { TwitterStreamData } from "../Twitter_Streams/StreamTypes";
import { TwitterStream } from "../Twitter_Streams/twitter_stream_backend";


const key_words = [
    'btc',
    'eth',
    'ethereum',
    'bitcoin'
]

// takes a string of text 
// returns the keyword map and sentiment score
// or returns null if no keywords were found in comment
export const generate_keyword_map_and_sentiment_score = (ticker_list: any, text: string) => {

    if (ticker_list.length < 1) {
        console.log('Invalid ticker list passed, must be an array of tickers/names');
        return null;
    }
    if (typeof (text) !== 'string') {
        console.log('invalid text passed to function, must be string');
        return null

    }

    // data processing
    // REMOVE ALL EMOJIS
    text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    // REMOVE ALL SYMBOLS
    text = text.replace(/[^a-zA-Z ]/g, '');

    // TO LOWERCASE
    text = text.toLowerCase();

    // TOKENIZE
    let tokenized = text.split(' ');

    // DO I NEED TO DO THESE STEPS? I AM JUST CHECKING FOR KEYWORDS so 
    // I think its unnescessary, im not parsing the whole text, just looking for counts of keywords
    // LEMMINIZATION
    // STOPWORDS

    // check for keywords
    // create map of matches
    // where number is the count of occurances
    // and key is the keyword ie btc, eth
    let keywords = new Map<string, number>();

    // I think its more efficient to do this here, especially if length is long
    // because i know in other languages this will be recalled every iter of the for loop
    const tokenized_len = tokenized.length;
    const keyword_list_len = ticker_list.length;
    for (let i = 0; i < tokenized_len; i++) {
        for (let n = 0; n < keyword_list_len; n++) {
            // need to do equals instead of includes because the ticker list is so big that every comment will match if I check includes
            if (tokenized[i] === ticker_list[n]) {
                if (keywords.get(ticker_list[n]) === undefined) {
                    keywords.set(ticker_list[n], 1);
                } else {
                    keywords.set(ticker_list[n], keywords.get(ticker_list[n]) + 1);
                }
            }
        }
    }

    // return back to caller, if no keywords then toss the comment
    // and dont waste resources generating sentiment on garbage data
    if (!(keywords.size === 0)) {
        // https://naturalnode.github.io/natural/sentiment_analysis.html
        var Analyzer = require('natural').SentimentAnalyzer;
        // Vocabulary: sets the type of vocabulary, "afinn", "senticon" or "pattern" are valid values.
        // probably should test all of these? im not sure what is the best for the task to be honest
        var analyzer = new Analyzer("English", null, "afinn");
        const sentiment = analyzer.getSentiment(tokenized);

        return { 'keyword_map': keywords, 'sentiment': sentiment }
    } else {
        return null;
    }
}


// replace with above function in twitter stream during refractor, this should be generalized because right now it only handles twitter
export const processes_stream_data = (datasource_type: string, data: TwitterStreamData) => {

    const data_obj = data.data;
    const metrics = data_obj.public_metrics

    let text = data_obj.text;
    // data processing
    // REMOVE ALL EMOJIS
    text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    // REMOVE ALL SYMBOLS
    text = text.replace(/[^a-zA-Z ]/g, '');

    // TO LOWERCASE
    text = text.toLowerCase();

    // TOKENIZE
    let tokenized = text.split(' ');

    // DO I NEED TO DO THESE STEPS? I AM JUST CHECKING FOR KEYWORDS so 
    // I think its unnescessary, im not parsing the whole text, just looking for counts of keywords
    // LEMMINIZATION
    // STOPWORDS

    // check for keywords
    // create map of matches
    // where number is the count of occurances
    // and key is the keyword ie btc, eth
    let keywords = new Map<string, number>();

    // I think its more efficient to do this here, especially if length is long
    // because i know in other languages this will be recalled every iter of the for loop
    const tokenized_len = tokenized.length;
    const keyword_list_len = key_words.length;

    for (let i = 0; i < tokenized_len; i++) {
        for (let n = 0; n < keyword_list_len; n++) {
            if (tokenized[i].includes(key_words[n])) {
                if (keywords.get(key_words[n]) === undefined) {
                    keywords.set(key_words[n], 1);
                } else {
                    keywords.set(key_words[n], keywords.get(key_words[n]) + 1);
                }
            }
        }
    }


    // NO KEYWORDS FOUND SO THROW AWAY ENTRY
    // dont need an else we just skip
    if (!(keywords.size === 0)) {

        // https://naturalnode.github.io/natural/sentiment_analysis.html
        var Analyzer = require('natural').SentimentAnalyzer;
        // Vocabulary: sets the type of vocabulary, "afinn", "senticon" or "pattern" are valid values.
        // probably should test all of these? im not sure what is the best for the task to be honest
        var analyzer = new Analyzer("English", null, "afinn");
        const sentiment = analyzer.getSentiment(tokenized);
        const date = new Date(data_obj.created_at)

        const processed_data = {
            datasource: datasource_type,
            tweet_id: data_obj.id,
            author_id: data_obj.author_id,
            post_date: date,
            sentiment: sentiment,
            engagement: metrics,
            keyword_map: keywords
        }
        // console.log(processed_data)
        // POST TO DB
        TwitterStream.create(processed_data, function (err, entry) {
            if (err) {
                console.log(err)
            } else {
                // probably want to update this to be more specific
                console.log(`Tweet from general ${datasource_type} crytpo stream successfully pushed to db`);
            }
        });

        // DONE PROCESSING

    }
}


// for(let i = 0; i < sample.length; i++){
//     processes_stream_data('twitter', sample[i])
// }