
// https://docs.kucoin.com/#upcoming-changes
// starting here

import API from 'kucoin-node-sdk';

const { api, uuid } = require('./bot_config')

API.init(api);

// add type definitions
// https://github.com/Kucoin/kucoin-node-sdk/blob/master/src/rest/User/Account.js
// console.log(await getAccountsList())
export const getAccountsList = async () => {
    const accounts = await API.rest.User.Account.getAccountsList();
    return accounts;
}
// console.log(await getBasicUserFee());
export const getBasicUserFee = async () => {
    const fees = await API.rest.User.TradeFee.getBasicUserFee();
    return fees.data;
}
// https://github.com/Kucoin/kucoin-node-sdk/blob/master/src/rest/Trade/Orders.js
// RETURNS orderID
// clientOid is a unique order id
// const order = {
//     baseParams: {
//         clientOid: Date.now(),
//         side: 'buy',
//         symbol: 'BTC-USDT',
//         type: 'limit',
//         tradeType: 'TRADE'
//     },
//     orderParams: {
//         price: '1000',
//         size: '2'
//     }
// }
// console.log(await postOrder(order.baseParams, order.orderParams));
export const postOrder = async (baseParams, orderParams) => {
    const orderResult = await API.rest.Trade.Orders.postOrder(baseParams, orderParams);
    return orderResult.data;
}
// console.log(await getOrdersList('TRADE'));
export const getOrdersList = async (tradeType) => {
    const ordersList = await API.rest.Trade.Orders.getOrdersList(tradeType);
    return ordersList.data;
}
// const cancelled = await cancelOrder(orderId.orderId);
export const cancelOrder = async (orderId) => {
    const cancelResult = await API.rest.Trade.Orders.cancelOrder(orderId);
    return cancelResult.data;
}

export const testApi = async () => {
    try {
        const getTimestampRl = await API.rest.Others.getTimestamp();
        console.log(`test api response: curr timestamp from kucoin: ${getTimestampRl.data}`);
    } catch (error) {
        console.log('bot failed to connect to api')
        console.log(error);
    }
};
