import React from 'react';
import { NavLink } from 'react-router-dom';

import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import FiveStar from '../FiveStar';

import './styles.css';

class StockListElem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            symbol: props.symbol,
            trend: props.trend,
            val1: props.val1,
            val2: props.val2,
            val1_mode: props.val1_mode
        };
    }

    render_trend(stock) {
        if (stock.trend.length <= 1) {
            return <p>No Data</p>;
        }

        const labels = []
        for (const [index, element] of stock.trend.entries()) {
            labels.push(index);
        }

        let trend_color = 'rgba(80, 80, 80, 0.7)';
        if (stock.trend.length >= 2) {
            const begin_end_diff = stock.trend[stock.trend.length - 1] - stock.trend[0];
            if (begin_end_diff > 0) {
                trend_color = 'rgba(30, 150, 0, 0.7)';
            } else if (begin_end_diff < 0) {
                trend_color = 'rgba(250, 33, 58, 0.7)';
            }
        }

        const options = {
            events: [],
            elements: {
                point: {
                    radius: 0
                },
                line: {
                    tension: 0.25,
                    borderColor: trend_color
                }
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: {display: false},
                yAxes: {display: false}
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 0
            }
        };

        const data = {
            labels: labels,
            datasets: [
                {data: labels.map((i) => stock.trend[i])}
            ]
        };
        return <div className='trendChart'><Line options= { options } data={ data }/></div>;
    }

    render() {
        const { stock } = this.props;

        const numFormat = new Intl.NumberFormat('en-US', {minimumFractionDigits:2});

        return (
            <tr className='stockListElem'>
                <td>
                    <div className='stockRedirect'>
                        <NavLink className='stockSymbol' to={ `/stocks?symbol=${ stock.symbol }` }>{ stock.symbol }</NavLink>
                    </div>
                </td>
                <td>{ this.render_trend(stock) }</td>
                <td>
                    { stock.val1_mode === 'stars' ? <FiveStar stars={ stock.val1 } /> : numFormat.format(stock.val1) }
                </td>
                <td>{ stock.val2 }</td>
            </tr>
        );
    }
}

export default StockListElem;
