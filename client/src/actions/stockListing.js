'use strict';

import ENV from './../config.js';
const API_HOST = ENV.api_host;

export function getStocksPrefix(searchString, setStocks) {
    if (searchString.length > 0) {
        const url = `${API_HOST}/api/stocks/search?prefix=${searchString}&n=10`;
        fetch(url)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject();
                }
            })
            .then(json => {
                setStocks(json);
            })
            .catch(error => {});
    }
}
