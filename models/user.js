/* User model */
'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const HoldingSchema = new mongoose.Schema({
    stock: {
        type: String,
        uppercase: true,
        required: true
    },
    units: {
        type: Number,
        required: true,
        min: 0,
    }
});

const PaperTradeSchema = new mongoose.Schema({
    capital: {
        type: Number,
        required: true,
        min: 0
    },
    totalMoneyIn: {
        type: Number,
        required: true,
        min: 0
    },
    holdings: [HoldingSchema]
});

// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    email: {
        type: String,
        minlength: 1,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    blacklist: {
        type: Boolean,
        required: true,
        default: false
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    watchList: [mongoose.Schema.Types.ObjectId],
    paperTrade: PaperTradeSchema
})

// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre('save', function(next) {
    const user = this; // binds this to User document instance

    // checks to ensure we don't hash password more than once
    if (user.isModified('password')) {
        // generate salt and hash the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByUsernamePassword = function(username, password) {
    const User = this; // binds this to the User model

    // First find the user by their email
    return User.findOne({ username: username }).then((user) => {
        if (!user) {
            return Promise.reject();  // a rejected promise
        }
        // if the user exists, make sure their password is correct
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            })
        })
    })
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema);
module.exports = { User };
