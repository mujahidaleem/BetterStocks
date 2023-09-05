'use strict';

const mongoose = require('mongoose');

const GameWord = mongoose.model('GameWord', {
    word: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    }
})

module.exports = { GameWord };
