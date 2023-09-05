'use strict';

import ENV from './../config.js';
const API_HOST = ENV.api_host;

export function getUsername(setUsername) {
    const checkSession = `${API_HOST}/users/check-session`;
    fetch(checkSession)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return null;
            }
        })
        .then(json => {
            setUsername(json.username);
            return json.username;
        })
        .catch(error => {});
}

export function getUserInfo(username, setUserInfo) {
    if (username) {
        const url = `${API_HOST}/api/users/${username}`;
        fetch(url)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then(json => {
                setUserInfo(json);
            })
            .catch(error => {});
    }
}

export function getStocks(holdings, setStockHoldings) {
    if (holdings.length > 0) {
        const url = holdings.reduce((str, h) => {
            return str + `&stock=${h.stock}`;
        }, `${API_HOST}/api/stocks?`);
        fetch(url)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then(json => {
                const stocks = json.reduce((holds, hold) => {
                    holds[hold.symbol] = hold;
                    return holds;
                }, {});
                const holdingsWithUnits = [];
                for (const holding of holdings) {
                    holdingsWithUnits.push({
                        stock: holding.stock,
                        price: stocks[holding.stock].price,
                        units: holding.units,
                        history: stocks[holding.stock].history
                    });
                }
                setStockHoldings(holdingsWithUnits);
            })
            .catch(error => {});
    }
}

export function buyStock(stock, setBalance, setErrorMessage) {
    if (stock) {
        const req = new Request(
            `${API_HOST}/api/papertrade`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    stock: stock
                })
            }
        );
        fetch(req)
            .then(res => {
                return [res.status, res.json()];
            })
            .then(data => {
                if (data[0] === 400) {
                    data[1].then(json => {
                        setErrorMessage(json.reason);
                    }).then(error => {});
                    return Promise.reject();
                } else {
                    return data[1];
                }
            })
            .then(json => {
                setBalance(json.capital);
                setErrorMessage('');
            })
            .catch(error => {});
    }
}

export function sellStock(stock, setBalance, setErrorMessage) {
    if (stock) {
        const req = new Request(
            `${API_HOST}/api/papertrade`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    stock: stock
                })
            }
        );
        fetch(req)
            .then(res => {
                return [res.status, res.json()];
            })
            .then(data => {
                if (data[0] === 400) {
                    data[1].then(json => {
                        setErrorMessage(json.reason);
                    }).then(error => {});
                    return Promise.reject();
                } else {
                    return data[1];
                }
            })
            .then(json => {
                setBalance(json.capital);
                setErrorMessage('');
            })
            .catch(error => {});
    }
}
