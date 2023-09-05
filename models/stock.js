'use strict';

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        minlength: 1
    },
    timestamp: {
        type: Date,
        required: true
    },
    review: {
        type: String,
        minlength: 1,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const Stock = mongoose.model('Stock', {
    symbol: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true,
        uppercase: true,
    },
    timestamp: {
        type: Date,
        required: true
    },
    history: [
        {
            timestamp: {
                type: Date,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    price: {
        type: Number,
        required: true
    },
    reviews: [ReviewSchema]
})

module.exports = { Stock };
