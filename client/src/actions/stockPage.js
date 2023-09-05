'use strict';

import ENV from './../config.js';
const API_HOST = ENV.api_host;


export async function getStockInfo(stock, setStockInfo) {
    const url = `${API_HOST}/api/stocks?stock=${stock}`;
    const res = await fetch(url);
    const resJSON = await res.json();
    if (resJSON.length !== 1) {
        setStockInfo(null);
    } else {
        setStockInfo(resJSON[0]);
    }
}

export async function addToWatchlist(stock, setErrorMessage) {
    try {
        const url = `${API_HOST}/api/users/watchlist`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                stock: stock
            })
        });
        if (res.status !== 200) {
            setErrorMessage('Invalid stock!');
        } else {
            setErrorMessage('');
        }
    } catch (error) {
        setErrorMessage('An unknown error occurred.');
    }
}
