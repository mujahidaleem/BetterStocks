'use strict';

const express = require('express');
const router = express.Router();
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate, adminAuthenticate } = require("./helpers/authentication");

const { GameWord } = require('../models/gameWord');

/*************** GAME WORD CRUD ************/

/**
 * POST /api/game/words
 * 
 * Add a new game word.
 * 
 * Parameters: None
 * 
 * Body: {word: <word to add>, difficulty: <one of 'easy', 'medium', 'hard'>}
 * 
 * Returns: 200 on success, and the represetation of the game word.
 */
router.post('/api/game/words', mongoChecker, adminAuthenticate, async (req, res) => {
    const word = new GameWord({
        word: req.body.word,
        difficulty: req.body.difficulty
    });

    try {
        const result = await word.save();
        res.send(word);
    } catch (error) {
        if (isMongoError(error)) {
            res.status(500).send('Internal server error');
        } else {
            res.status(400).send('Bad request');
        }
    }
});

/**
 * GET /api/game/words
 * 
 * Get all game words.
 * 
 * Parameters: None
 * 
 * Body: None
 * 
 * Returns: 200 on success and a list of words.
 */
router.get('/api/game/words', mongoChecker, authenticate, async (req, res) => {
    try {
        const stocks = await GameWord.find();
        res.send(stocks);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
