'use strict';

const express = require('express');
const router = express.Router();
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

const { User } = require('../models/user');
const { Stock } = require('../models/stock');

/************** PAPER TRADING ***********/

/**
 * POST /api/papertrade
 * 
 * Purchase a stock for the currently logged in user.
 * 
 * Parameters: None
 * 
 * Body: {stock: <stock symbol>}
 * 
 * Returns: 200 on success and the new paper trade information
 *     {capital: <user's capital>, holdings: <list of stock holdings and the number of holdings>}
 * 
 *     400 on a bad request, such as not having enough capital, or a bad stock symbol. Response body will contain
 *     information about the failed request: {reason: <reason>}, where reason could be one of
 *     *    "Not enough capital"
 *     *    "Invalid stock symbol"
 *     *    "Other error"
 */
router.post('/api/papertrade', mongoChecker, authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const ptrade = user.paperTrade;

        if (!req.body.stock) {
            res.status(400).send({reason: 'Invalid stock symbol'});
            return;
        }
        const stock = await Stock.findOne({symbol: req.body.stock});
        if (!stock) {
            res.status(400).send({reason: 'Invalid stock symbol'})
            return;
        }

        if (stock.price > ptrade.capital) {
            res.status(400).send({reason: 'Not enough capital'});
            return;
        }
        ptrade.capital -= stock.price;

        const holdings = ptrade.holdings;
        let held_stock = holdings.filter(holding => holding.stock === stock.symbol);
        if (held_stock.length === 1) {
            held_stock[0].units++;
        } else if (held_stock.length === 0) {
            held_stock = holdings.push({stock: stock.symbol, units: 1});
        }
        const result = await user.save();
        res.send({capital: ptrade.capital, holdings: holdings});

    } catch (error) {
        console.log(error);
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send({reason: 'Other error'});
        }
    }
});

/**
 * DELETE /api/papertrade
 * 
 * Sell a stock for the currently logged in user.
 * 
 * Parameters: None
 * 
 * Body: {stock: <stock symbol>}
 * 
 * Returns: 200 on success and the new paper trade information
 *     {capital: <user's capital>, holdings: <list of stock holdings and the number of holdings>}
 * 
 *     400 on a bad request, such as not holding the stock, or a bad stock symbol. Response body will contain
 *     information about the failed request: {reason: <reason>}, where reason could be one of
 *     *    "No stock units"
 *     *    "Invalid stock symbol"
 *     *    "Other error"
 */
 router.delete('/api/papertrade', mongoChecker, authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.session.user);
        const ptrade = user.paperTrade;

        if (!req.body.stock) {
            res.status(400).send({reason: 'Invalid stock symbol'});
            return;
        }

        const stock = await Stock.findOne({symbol: req.body.stock});
        if (!stock) {
            res.status(400).send({reason: 'Invalid stock symbol'})
            return;
        }

        const holdings = ptrade.holdings;
        let held_stock = holdings.filter(holding => holding.stock === stock.symbol);
        if (held_stock.length === 1 && held_stock[0].units > 0) {
            held_stock[0].units--;
        } else if (held_stock.length === 0 || held_stock[0].units <= 0) {
            res.status(400).send({reason: 'No stock units'});
            return;
        }
        ptrade.capital += stock.price;

        const result = await user.save();
        res.send({capital: ptrade.capital, holdings: holdings});

    } catch (error) {
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send({reason: 'Other error'});
        }
    }
});

module.exports = router;
