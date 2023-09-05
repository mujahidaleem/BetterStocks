import React, { useEffect, useState } from 'react';

import StockList from '../StockList';

import { getUsername, getUserInfo, getStocks, buyStock, sellStock } from '../../actions/paperTrade';

import './styles.css';

function PaperTrade() {
    const [initBalance, setInitBalance] = useState(0);

    const [balance, setBalance] = useState(initBalance ? initBalance : 1);  // money available to trade with
    const [value, setValue] = useState(0);  // value of stock holdings
    const [perfPercent, setPerfPercent] = useState(((value + balance - initBalance) / initBalance) * 100);

    const [stockSymbol, setStockSymbol] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /* Stock holdings formatted as:
        {SYMBOL: {
            currPrice: PRICE,
            numHoldings: HOLDINGS
        }}
    */
    const [stockHoldings, setStockHoldings] = useState([]);
    
    // user related
    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {getUsername(setUsername)}, []);
    useEffect(() => {getUserInfo(username, setUserInfo)}, [username, balance]);
    useEffect(() => {
        try {
            setBalance(userInfo.paperTrade.capital);
            setInitBalance(userInfo.paperTrade.totalMoneyIn);
            const stocks = userInfo.paperTrade.holdings.map(h => (
                {stock: h.stock, units: h.units}
            ));
            getStocks(stocks, setStockHoldings);
        } catch (error) {
        }
    }, [userInfo]);
    useEffect(() => {
        try {
            const stocks = userInfo.paperTrade.holdings.map(h => (
                {stock: h.stock, units: h.units}
            ));
            getStocks(stocks, setStockHoldings);
        } catch (error) {
        }
    }, [value, balance, initBalance]);
    useEffect(() => {
        try {
            setValue(Object.entries(stockHoldings).reduce((v, keyValue) => {
                const [s, info] = keyValue;
                return v + (info.price * info.units);
            }, 0));
            setPerfPercent(((value + balance - initBalance) / initBalance) * 100);
        } catch (error) {
        }
    }, [stockHoldings]);

    /* Handle a buy/sell event */
    function stockBuySell(e) {
        e.preventDefault();
        switch ( e.nativeEvent.submitter.name ) {
            case 'buy':
                buyStock(stockSymbol, setBalance, setErrorMessage);
                break;

            case 'sell':
                sellStock(stockSymbol, setBalance, setErrorMessage);
                break;

            default:
                console.log('NO MATCH');  // should never hit this
        }
    }

    /* Convert from the stock holdings object format to the required list format */
    function convertHoldingsToListing() {
        function compareHoldings(h1, h2) {
            return h1[1].stock - h2[1].stock;
        }

        const holdingsArr = Object.entries(stockHoldings).sort(compareHoldings);
        return holdingsArr.reduce((holdings, keyValue) => {
            const [s, info] = keyValue;
            let dateFilterStart = new Date();
            if (dateFilterStart.getDay() === 6) {  // Saturday
                dateFilterStart.setDate(dateFilterStart.getDate() - 2);
            } else if (dateFilterStart.getDay() === 0) {  // Sunday
                dateFilterStart.setDate(dateFilterStart.getDate() - 3);
            } else {
                dateFilterStart.setDate(dateFilterStart.getDate() - 1);
            }
            const trend = info.history
                            .filter(entry => Date.parse(entry.timestamp) >= dateFilterStart)
                            .map(entry => entry.price);
            if (info.units > 0) {
                holdings.push({
                    symbol: info.stock,
                    trend: trend,
                    val1: Number(info.price).toFixed(2),
                    val2: info.units
                });
            }
            return holdings;
        }, [])
    }

    return (
        <div className='paperTrade'>
            <div className='content'>
                <h3>Paper Trade</h3>

                { [0, 6].includes((new Date()).getDay()) ? <p>Markets are currently <strong>closed!</strong>&nbsp;&nbsp;Price data is shown for the last open trading day.</p> : null }

                <div className='topInfo'>
                    {/* Portfolio Statistics */}
                    <div className='statistics'>
                        <div className='statistic'>
                            <strong title='Amount available to invest'>Capital</strong>
                            <p>{ `$${balance.toFixed(2)}` }</p>
                        </div>
                        <div className='statistic'>
                            <strong title='Value of owned stocks + capital'>Portfolio Value</strong>
                            <p>{ `$${(balance + value).toFixed(2)}` }</p>
                        </div>
                        <div className='statistic'>
                            <strong title='Percent increase of portfolio value from stock trades alone'>All Time Performance</strong>
                            <p>{ `${perfPercent.toFixed(2)}%` }</p>
                        </div>
                    </div>

                    {/* Buy/Sell buttons */}
                    <form className='buySell' onSubmit={ stockBuySell } >
                        <p>Enter a stock by symbol and then buy or sell to your heart's content!</p>
                        <label>
                            Stock:
                            <input type='text' className='stockb' value={ stockSymbol } onChange={(e) => setStockSymbol(e.target.value.toUpperCase())} placeholder='Symbol' />
                        </label>
                        <input type='submit' className='buysellb' name='buy' value='Buy' />
                        <input type='submit' className='buysellb' name='sell' value='Sell' />
                        <p id='stockBuySellErrorMsg'>{ errorMessage.length > 0 ? errorMessage + '!' : null }</p>
                    </form>
                </div>

                <div className='holdings'>
                    {/* List of Holdings */ }
                    <h4>Holdings</h4>
                    <StockList stocks={ convertHoldingsToListing() } trend_name="24-Hr Price History" col1_name='Last Known Price' col2_name='Units' />
                </div>
            </div>
        </div>
    );
}

export default PaperTrade;
