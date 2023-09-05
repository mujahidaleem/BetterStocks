import React, { useEffect, useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import ReviewPage from '../ReviewComponents/ReviewPage';

import { getStockInfo, addToWatchlist } from '../../actions/stockPage';

import './styles.css';

function getDateFilterStart(dateFilter) {
    let dateFilterStart = new Date();
    switch (dateFilter.charAt(dateFilter.length - 1)) {
        case 'D':
            if (dateFilterStart.getDay() === 6) {  // Saturday
                dateFilterStart.setDate(dateFilterStart.getDate() - 2);
            } else if (dateFilterStart.getDay() === 0) {  // Sunday
                dateFilterStart.setDate(dateFilterStart.getDate() - 3);
            } else {
                dateFilterStart.setDate(dateFilterStart.getDate() - 1);
            }
            break;
        case 'W':
            dateFilterStart.setDate(dateFilterStart.getDate() - 7);
            break;
        case 'M':
            dateFilterStart.setMonth(dateFilterStart.getMonth() - Number(dateFilter.slice(0, -1)));
            break;
        case 'Y':
            dateFilterStart.setFullYear(dateFilterStart.getFullYear() - 1);
        default:
            // should never reach
            break;
    }

    return dateFilterStart;
}

function Stock() {
    const [params, setParams] = useSearchParams();
    const [stockInfo, setStockInfo] = useState(null);
    const [timeFilter, setTimeFilter] = useState('1D');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getStockInfo(params.get('symbol'), setStockInfo);
    }, [params])

    function renderLineChart() {
        const dateFilterStart = getDateFilterStart(timeFilter);
        const filteredHistory = stockInfo.history.filter(h => Date.parse(h.timestamp) >= dateFilterStart);

        let trend_color = 'rgba(80, 80, 80, 0.7)';
        if (filteredHistory.length >= 2) {
            const begin_end_diff = filteredHistory[filteredHistory.length - 1].price - filteredHistory[0].price;
            if (begin_end_diff > 0) {
                trend_color = 'rgba(30, 150, 0, 0.7)';
            } else if (begin_end_diff < 0) {
                trend_color = 'rgba(250, 33, 58, 0.7)';
            }
        }

        const options = {
            elements: {
                line: {
                    tension: 0.4,
                    borderColor: trend_color
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date and Time'
                    },
                    type: 'timeseries',
                    time: {
                        minUnit: 'hour'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price ($)'
                    },
                    ticks: {
                        format: {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            maintainAspectRatio: false
        };
        const data = {
            labels: filteredHistory.map(s => {
                return new Date(s.timestamp);
            }),
            datasets: [
                {
                    label: params.get('symbol').toUpperCase(),
                    data: filteredHistory.map(s => s.price)
                }
            ]
        }
        return <Line options={ options } data={ data }/>
    }

    function renderNotFound() {
        return <React.Fragment>
                <h3>Stock not found!</h3>
            </React.Fragment>;
    }

    function renderStockInfo() {
        return <React.Fragment>
                <h2>{ params.get('symbol') }</h2>
                <br />

                { [0, 6].includes((new Date()).getDay()) ? <p>Markets are currently <strong>closed!</strong>&nbsp;&nbsp;Price data is shown for the last open trading day.</p> : null }

                <div className='stockContent'>
                    <div className='stock'>
                        { renderLineChart() }
                    </div>
                    <div id='link'>
                        <button value='1D' onClick={ e => setTimeFilter(e.target.value) }>1D</button>
                        <button value='1W' onClick={ e => setTimeFilter(e.target.value) }>1W</button>
                        <button value='1M' onClick={ e => setTimeFilter(e.target.value) }>1M</button>
                        <button value='3M' onClick={ e => setTimeFilter(e.target.value) }>3M</button>
                        <button value='6M' onClick={ e => setTimeFilter(e.target.value) }>6M</button>
                        <button value='1Y' onClick={ e => setTimeFilter(e.target.value) }>1Y</button>
                    </div>
                </div>

                <button value='addWatchlist' onClick={() => addToWatchlist(params.get('symbol'), setErrorMessage)}>Add to Watchlist</button>
                { errorMessage.length > 0 ? <p>{ errorMessage }</p> : null}

                <div className='reviews'>
                    <ReviewPage />
                </div>

                </React.Fragment>
    }

    return (
        <div className='stockPage'>
            { stockInfo ? null : renderNotFound() }

            { stockInfo ? renderStockInfo() : null}
        </div>
    );
}

export default Stock;
