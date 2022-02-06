
// https://docs.kucoin.com/#upcoming-changes
// starting here

/** Require SDK */
import API from 'kucoin-node-sdk';


/** Init Configure */
API.init(require('./bot_config'));

/** API use */
const main = async () => {
    console.log('bot started')
    const getTimestampRl = await API.rest.Others.getTimestamp();
    console.log(getTimestampRl.data);
};

/** Run Demo */
main();