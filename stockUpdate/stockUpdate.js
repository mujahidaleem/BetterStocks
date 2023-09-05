'use strict';

const fetch = require('node-fetch');

const { Stock } = require('../models/stock');

const YAHOO_KEY = process.env.YAHOO_API_KEY;

// split into groups for API limits
const STOCKS_TO_WATCH = [
    ['AAPL', 'AMD', 'TSLA', 'INTC', 'NVDA',
    'GOOG', 'FB', 'AMZN', 'MSFT', 'AC'],
    ['BTC-USD']
];

async function updateStocks() {
    if (!YAHOO_KEY) {
        console.log('Yahoo Finance API key (ENV) NOT FOUND. No stock price updates completed.');
        return;
    }

    // const currDate = new Date();
    // if (currDate.getHours() < 9 || currDate.getHours() > 18) {
    //     console.log('Outside of stock trading hours. No updates completed!');  // save API calls
    //     return;
    // }

    for (const stocks of STOCKS_TO_WATCH) {
        const url = `https://yfapi.net/v8/finance/spark?interval=15m&range=1d&symbols=${stocks.reduce((acc, s) => acc + s + ',', '').slice(0, -1)}`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': YAHOO_KEY
            }
        });
        if (resp.status !== 200) {
            console.log(resp);
            return;
        }
        const json = await resp.json()
        for (const [symbol, data] of Object.entries(json)) {
            try {
                const timestamps = data['timestamp'];
                const prices = data['close'];
                let stock = await Stock.findOne({symbol: symbol});
                if (!stock) {
                    stock = new Stock({
                        symbol: symbol
                    });
                }
    
                for (const [i, timestamp] of timestamps.entries()) {
                    const price = prices[i];
                    const d = timestamp * 1000;
                    const entry = stock.history.filter(h => d === h.timestamp.getTime());
                    if (entry.length === 0) {
                        stock.history.push({timestamp: d, price: price});
                    }
                }
        
                if (stock.history.length > 0) {
                    stock.price = stock.history[stock.history.length - 1].price;
                    stock.timestamp = stock.history[stock.history.length - 1].timestamp;
                }
        
                const result = await stock.save();
            } catch (error) {
                console.log(error);
            }
        }
    }
}



module.exports = updateStocks;
