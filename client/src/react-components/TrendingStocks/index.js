import React from 'react';

import './styles.css';

import NavBar from '../navbar/Navbar';

import StockList from '../StockList';

class TrendingStocks extends React.Component {

    state = {
        stock_ratings: [
        {symbol: 'AAPL', trend: [2.71, 1.79, 3.90, 4.96], val1: 4.5, val2: 24, val1_mode: 'stars'},
        {symbol: 'AMD', trend: [0.82, 1.18, 0.57, 3.81], val1: 2.2, val2: 18, val1_mode: 'stars'},
        {symbol: 'INTC', trend: [3.24, 0.82, 0.37, 0.96], val1: 1.6, val2: 50, val1_mode: 'stars'},
        {symbol: 'NVDA', trend: [4.70, 2.76, 2.16, 4.80], val1: 3.8, val2: 97, val1_mode: 'stars'},
        {symbol: 'TSLA', trend: [3.94, 0.21, 2.69, 2.74], val1: 2.9, val2: 9, val1_mode: 'stars'},
        ]
    }

    render() {
        return (
            <React.Fragment>
                <div className='trendingStocks'>
                    <h3>Trending Stocks Today</h3>
                    <StockList stocks={ this.state.stock_ratings } trend_name='Rating Trend' col1_name='Average Rating' col2_name='Reviews'/>
                </div>
            </React.Fragment>
        );
    }
}

export default TrendingStocks;
