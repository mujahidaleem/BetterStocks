import React from 'react';

import './styles.css';

import NavBar from '../navbar/Navbar';

import StockList from '../StockList';

class TopStocks extends React.Component {

  state = {
    stock_prices: [
      {symbol: 'AAPL', trend: [73, 23, 38, 45], val1: -100, val2: 5},
      {symbol: 'AMD', trend: [85, 92, 66, 12], val1: 165, val2: 25},
      {symbol: 'INTC', trend: [54, 57, 29, 36], val1: 148, val2: 20},
      {symbol: 'NVDA', trend: [11, 33, 47, 37], val1: 207, val2: 20},
      {symbol: 'TSLA', trend: [73, 78, 82, 22], val1: 207, val2: 30},
    ]
  }

    render() {
        return (
            <React.Fragment>
                <div className='topStocks'>
                    <h3>Top Stocks Today</h3>
                    <StockList stocks={ this.state.stock_prices } trend_name='Price Trend' col1_name='Today' col2_name='This Month'/>
                </div>
            </React.Fragment>
        );
    }
}

export default TopStocks;
