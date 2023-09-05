import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { uid } from 'react-uid';

import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { BiSearch } from 'react-icons/bi';

import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import './styles.css';

import FiveStar from '../FiveStar';

import { getStocksPrefix } from '../../actions/stockListing';

function render_trend(trend) {
    const labels = [];
    let dateFilterStart = new Date();
    if (dateFilterStart.getDay() === 6) {  // Saturday
        dateFilterStart.setDate(dateFilterStart.getDate() - 2);
    } else if (dateFilterStart.getDay() === 0) {  // Sunday
        dateFilterStart.setDate(dateFilterStart.getDate() - 3);
    } else {
        dateFilterStart.setDate(dateFilterStart.getDate() - 1);
    }
    for (const [index, element] of trend.entries()) {
        if (Date.parse(element.timestamp) >= dateFilterStart) {
            labels.push(index);
        }
    }

    if (labels.length <= 1) {
        return <p>No Data</p>;
    }

    let trend_color = 'rgba(80, 80, 80, 0.7)';
    if (trend.length >= 2) {
        const begin_end_diff = trend[trend.length - 1].price - trend[0].price;
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
        labels: [...Array(labels.length).keys()],
        datasets: [
            {data: labels.map((i) => trend[i].price)}
        ]
    };
    return <div className='trendChart'><Line options={ options } data={ data }/></div>;
}

function render_stars(star_num) {
    if (star_num !== -1) {
        return <FiveStar stars={ star_num } />
    } else {
        return <p>No Reviews</p>
    }
}


function StockListing(props) {

    const [colFilter, setColFilter] = useState(['symbol', true]);
    const [searchString, setSearchString] = useState('');
    const [stocks, setStocks] = useState([]);

    const listingColumns = [{name: 'symbol', label: 'Symbol', type: 'symbol', sortable: true}].concat(props.columns);

    useEffect(() => {
        getStocksPrefix(searchString ? searchString : '.', setStocks);
    }, [searchString]);

    function handleFilter(col) {
        const c = col.toLowerCase();
        const [colFilterName, colFilterDir] = colFilter;
        if (colFilterName !== c) {
            if (c === 'symbol') {
                setColFilter([c, true]);
            } else {
                setColFilter([c, false]);
            }
        } else {
            setColFilter([c, !colFilterDir]);
        }
    }

    function drawFilterArrow(col) {
        if (col.toLowerCase() === colFilter[0]) {
            return colFilter[1] ? <GoTriangleUp /> : <GoTriangleDown />
        } else {
            return null;
        }
    }

    function makeTableBody(stockList) {
        function makeCell(col, stock) {
            const numFormat = new Intl.NumberFormat('en-US', {minimumFractionDigits:2});
            switch (col.type.toLowerCase()) {
                case 'symbol':
                    return <td key={ uid(col) }><NavLink className='stockSymbol' to={ `/stocks?symbol=${ stock.symbol }` }>{ stock.symbol }</NavLink></td>
                case 'trace':
                    return <td key={ uid(col) }>{ render_trend(stock[col.name]) }</td>;
                case 'price':
                    return <td key={ uid(col) }>{ numFormat.format(Math.round(parseFloat(stock[col.name]) * 100.0) / 100.0) }</td>;
                case 'stars':
                    return <td key={ uid(col) }>{ render_stars(stock.week_stars) }</td>;
                default:
                    class ColumnTypeError extends Error {
                        constructor(message) {
                            super(message);
                            this.name = 'ColumnTypeError';
                        }
                    }
                    throw new ColumnTypeError(`Invalid column type of "${col.type}"`);
            }
        }

        let dateFilterStart = new Date();
        dateFilterStart.setDate(dateFilterStart.getDate() - 7);
        for (const stock of stockList) {
            stock.history = stock.history.concat([{timestamp: stock.timestamp, price: stock.price}]);
            stock.week_stars = stock.reviews
                                    .filter(rev => Date.parse(rev.timestamp) >= dateFilterStart)
                                    .reduce((acc, rev) => {
                                        return [acc[0] + 1, acc[1] + rev.stars];
                                    }, [0, 0]);
            if (stock.week_stars[0] > 0) {
                stock.week_stars = stock.week_stars[1] * 1.0 / stock.week_stars[0];
            } else {
                stock.week_stars = -1;
            }
        }

        const sortFn = colFilter[0] === 'symbol' ? (a, b) => a['symbol'].localeCompare(b['symbol']) : (a, b) => a[colFilter[0]] - b[colFilter[0]];
        let sortedStocks = stockList.sort(sortFn);
        if (!colFilter[1]) {
            sortedStocks = sortedStocks.reverse();
        }

        return <React.Fragment>
            {
                sortedStocks.map(stock => <tr key={ uid(stock) }>
                    {
                        listingColumns.map(col => makeCell(col, stock))
                    }
                </tr>)
            }
        </React.Fragment>
    }

    return <div className='stockListing'>
        <h3>Stock Search</h3>

        <p>Search for a stock by symbol!&nbsp;&nbsp;Results will appear in the list below.</p>
        { [0, 6].includes((new Date()).getDay()) ? <p>Markets are currently <strong>closed!</strong>&nbsp;&nbsp;Price data is shown for the last open trading day.</p> : null }
        <form className='stockSearch'>
            <label>
                <div className='search'>  
                <BiSearch />
            
                </div>
                <input type='text' className='stockbox' value={ searchString } onChange={(e) => setSearchString(e.target.value.toUpperCase())} placeholder='Symbol' />

            </label>
        </form>
        <table className='stockList'>
            <thead>
                <tr>
                    {
                        listingColumns.map(col =>
                            <th key={ uid(col) } className={ col.sortable ? 'clickable' : null} onClick={ () => col.sortable ? handleFilter(col.name) : null }>
                                { col.label }
                                { col.sortable ? drawFilterArrow(col.name) : null}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                { makeTableBody(stocks) }
            </tbody>
        </table>
    </div>
}

export default StockListing;
