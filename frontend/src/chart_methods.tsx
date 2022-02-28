import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { getRedditCoinDataByTimeFrameAndName, getTwitterCoinDataByTimeFrameAndName } from "./API";
import { TwiitterStreamType } from "./Types/API";

// PROBLEMS HERE, COINGECKO API uses coinname as the coins name, but my server api uses coinname as the ticker. This is a problem!
// How to solve?

// https://recharts.org/en-US/examples/SimpleScatterChart
// coinname (not ticker)) eg bitcoin, ethereum
// timeframe in hours
// need an interface for this that the different streems need to convert to


export const RenderPriceVsMentionsChartForCoin = (coin_name: string, coin_full_name: string, time_frame: number, datasource: string) => {

    interface coinsMarketDataHistorical {
        market_caps: any
        prices: any
        total_volumes: any
    }

    // FROM API
    // Minutely data will be used for duration within 1 day,
    //  Hourly data will be used for duration between 1 day and 90 days, 
    //  Daily data will be used for duration above 90 days.
    // fetch prices with dates/times
    const coingeckoUrl = () => {
        // convert hours param to days
        const num_days = time_frame / 24
        return `https://api.coingecko.com/api/v3/coins/${coin_full_name}/market_chart?vs_currency=usd&days=${num_days}`;
    };


    useEffect(() => {

        const coingeckoFetch = async () => {
            fetch(coingeckoUrl()).then((response) =>
                response.json().then((jsonData) => {
                    setCoingeckoChartData(jsonData)
                    return jsonData
                })
            );
        };

        const fetchFromServerApi = async () => {
            if (datasource === 'twitter') {
                let data = (await getTwitterCoinDataByTimeFrameAndName(coin_name, time_frame)).data
                setServerDataForCoinByTimeFrame(data);
            } else {
                let data = (await getRedditCoinDataByTimeFrameAndName(coin_name, time_frame)).data
                setServerDataForCoinByTimeFrame(data);
            }

        }

        fetchFromServerApi()
        coingeckoFetch()

    }, []);


    const [coingeckoChartData, setCoingeckoChartData] = useState<coinsMarketDataHistorical | undefined>(undefined)
    // the map is converted to an object when fetched by the api, this is a problem because i want to keep the type definition!
    const [serverDataForCoinByTimeFrame, setServerDataForCoinByTimeFrame] = useState<any[] | undefined>(undefined)


    const data = [
        { x: 100, y: 200 },
        { x: 120, y: 100 },
        { x: 170, y: 300 },
        { x: 140, y: 250 },
        { x: 150, y: 400 },
        { x: 110, y: 280 },
    ];

    // now coingecko data fetched

    // now need my own data call my own api to getTwitterCoinDataByTimeFrameAndName

    interface plot_data_row {
        x: string, y: number, z: number, ref_date: Date
    }

    let plot_data: Array<plot_data_row> = []

    //aggregate data for this
    // we want prices per date
    // guess we do the same when fetching, from now until now - timespan (need this as an arg to pass)
    // and mentions per date, we find this when iterating over table data
    // then combine the two to create the x/y
    if (coingeckoChartData !== undefined && serverDataForCoinByTimeFrame !== undefined) {

        // hourly data from coingecko price feed.
        for (let i = 0; i < coingeckoChartData.prices.length; i++) {
            let date = new Date(coingeckoChartData.prices[i][0]);
            let coin_time_at_price = date.toUTCString();
            let coin_price_at_time = coingeckoChartData.prices[i][1];

            plot_data[i] = { x: coin_time_at_price, y: coin_price_at_time, z: 0, ref_date: date }

        }

        // And mentions might only be seconds apart. So 
        for (let n = 0; n < serverDataForCoinByTimeFrame.length; n++) {
            let date = new Date(serverDataForCoinByTimeFrame[n].created_utc * 1000);
            // find entry for this hour in price list
            for (let m = 0; m < plot_data.length; m++) {
                if (plot_data[m].ref_date.getUTCMonth() === date.getUTCMonth() && plot_data[m].ref_date.getUTCDay() === date.getUTCDay() && plot_data[m].ref_date.getUTCHours() === date.getUTCHours()) {
                    let mentions = serverDataForCoinByTimeFrame[n].keyword_map[`${coin_name}`]
                    // match found, now append mentions
                    if (mentions !== undefined) {
                        plot_data[m].z = plot_data[m].z + mentions
                    }
                }
            }
        }


    }


    return (

        coingeckoChartData === undefined || plot_data.length === 0 ?

            (
                <p>Data not loaded yet from coingecko </p>
            )
            :
            (
                <LineChart
                    width={1000}
                    height={500}
                    data={plot_data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid />
                    < XAxis dataKey="x" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />

                    <Tooltip cursor={{ strokeDasharray: '1 1' }} animationDuration={0} />
                    <Line yAxisId="left" type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
                    < Line yAxisId="right" type="monotone" dataKey="z" stroke="#82ca9d" />
                </LineChart>
            )
    )
}