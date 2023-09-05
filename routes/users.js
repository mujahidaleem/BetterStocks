"use strict";

const express = require("express");
const router = express.Router();
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

const { User } = require("../models/user");
const { Stock } = require("../models/stock");
const { ObjectId } = require('mongodb');

const env = process.env.NODE_ENV;
const USE_TEST_USER = env !== "production" && process.env.TEST_USER_ON; // option to turn on the test user.
const TEST_USER_ID = "624bb3452c379f9828a27347"; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_USERNAME = "user";

/***************** AUTHENTICATION **************************/

/**
 * POST /users/login
 *
 * Log in and generate session information.
 *
 * Parameters: None
 *
 * Body: {username: <username>, password: <password>}
 *
 * Returns: The logged in user's information as represented in the database.
 */
router.post("/users/login", mongoChecker, (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Use the static method on the User model to find a user
	// by their email and password
	User.findByUsernamePassword(username, password)
		.then((user) => {
			// Add the user's id to the session.
			// We can check later if this exists to ensure we are logged in.
			if (!user) {
				res.redirect("/"); // redirect to login
			}
			req.session.user = user._id;
			req.session.username = user.username;
			req.session.userObject = user;
			user.password = undefined;
			// console.log(req);
			req.session.save(() => {
				res.send(user);
			});
		})
		.catch((error) => {
			if (isMongoError(error)) {
				res.status(500).send("Internal server error");
			}
			res.status(400).send("Bad request");
		});
});

/**
 * GET /users/logout
 *
 * Log out and destroy session information.
 *
 * Parameters: None
 *
 * Body: None
 *
 * Returns: 200 on success, no other content.
 */
router.get("/users/logout", (req, res) => {
	// Remove the session
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error);
		} else {
			res.send();
		}
	});
});

/**
 * GET /users/check-session
 *
 * Check whether the current user's session is valid.
 *
 * Parameters: None
 *
 * Body: None
 *
 * Returns:
 *     * 200 if a valid session is found and {currentUser: <user ID>, username: <username>}.
 *     * 401 if no valid session is found
 */
router.get("/users/check-session", (req, res) => {
	if (env !== 'production' && USE_TEST_USER) { // test user on development environment.
	    req.session.user = TEST_USER_ID;
	    res.send({ userID: TEST_USER_ID, username: TEST_USER_USERNAME });
	    return;
	}
	if (req.session.username) {
		res.send({
			userID: req.session.user,
			username: req.session.username,
		});
	} else {
		res.status(401).send();
	}
});

/***************** USER CRUD ************* */

/**
 * POST /api/users
 *
 * Create a new user.
 *
 * Parameters: None
 *
 * Body: User information. {username: <username>, displayName: <display name>, password: <password>}
 *
 * Returns: 200 on success, and the database representation of the user.
 */
router.post("/api/users", mongoChecker, async (req, res) => {
	const user = new User({
		username: req.body.username,
		displayName: req.body.displayName,
		password: req.body.password,
		blacklist: false,
		admin: false,
		watchList: [],
		paperTrade: {
			capital: 1000, // default capital amount
			totalMoneyIn: 1000, // amount of money put into this account
			// (for portfolio performance computation)
			holdings: [],
		},
	});

	try {
		// Save the user
		const newUser = await user.save();
		newUser.password = undefined;
		res.send(newUser);
	} catch (error) {
		if (isMongoError(error)) {
			// check for if mongo server suddenly disconnected before this request.
			res.status(500).send("Internal server error");
		} else {
			res.status(400).send("Bad request");
		}
	}
});

/**
 * GET /api/users/:username
 *
 * Retrieve a user's information by username.
 *
 * Parameters: username (of the user to retrieve information for)
 *
 * Body: None
 *
 * Returns: 200 on success and the database representation of the user.
 */
router.get(
	"/api/users/:username",
	mongoChecker,
	authenticate,
	async (req, res) => {
		try {
			const user = await User.findOne({ username: req.params.username });
			if (user) {
				user.password = undefined;
				res.send(user);
			} else {
				res.status(404).send("Resource not found");
			}
		} catch (error) {
			if (isMongoError(error)) {
				// check for if mongo server suddenly disconnected before this request.
				res.status(500).send("Internal server error");
			} else {
				res.status(404).send("Resource not found");
			}
		}
	}
);

/**
 * GET /api/users/
 * 
 * Retrieve all users.
 * 
 * Parameters: None
 * 
 * Body: None
 * 
 * Returns: 200 on success and the database representations of all users.
 */
 router.get('/api/users/', mongoChecker, authenticate, async (req, res) => {
    try {
        const users = await User.find();
        const passwordRemoval = users.map(u => {
            u.password = undefined;
            return u
        });
        res.send(passwordRemoval);
    } catch (error) {
        res.status(500).send('Internal server error');
    }

});

/**
 * PATCH /api/users/
 *
 * Change information for the current session's user.
 *
 * Parameters: None
 *
 * Body: Array of operations to complete: {"op", "replace", "path", "/<attribute to replace>", "value": <new value>}
 *
 *     The only attributes that can be modified are: "displayName", "email", "phone", "bio"
 *
 * Returns: 200 on success and the updated user's database representation.
 */
router.patch("/api/users/", mongoChecker, authenticate, async (req, res) => {
	const fieldsToUpdate = {};
	req.body.map((change) => {
		const propToChange = change.path.substr(1);
		if (["displayName", "email", "phone", "bio"].includes(propToChange)) {
			fieldsToUpdate[propToChange] = change.value;
		}
	});
	if (req.body.length !== Object.entries(fieldsToUpdate).length) {
		res.status(400).send("Bad request");
		return;
	}

	try {
		const user = await User.findOneAndUpdate(
			{ _id: req.session.user },
			{ $set: fieldsToUpdate },
			{ returnDocument: "after" }
		);
		if (!user) {
			res.status(404).send("Resource not found");
		} else {
			user.password = undefined;
			res.send(user);
		}
	} catch (error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal server error");
		} else {
			res.status(400).send("Bad request");
		}
	}
});

/*********** WATCH LIST CRUD *************/

/**
 * POST /api/users/watchlist
 *
 * Add a stock to the logged in user's watch list.
 *
 * Parameters: None
 *
 * Body: {stock: <stock symbol>}
 *
 * Returns: 200 on success and the updated user.
 */
router.post(
	"/api/users/watchlist",
	mongoChecker,
	authenticate,
	async (req, res) => {
		try {
			const user = await User.findById(req.session.user);
			const stock = await Stock.findOne({ symbol: req.body.stock });
			if (!stock) {
				res.status(400).send("Bad request");
				return;
			}


			const watched = user.watchList.filter(elem => elem._id.equals(stock._id))
			console.log(watched);

			if (watched.length === 0) {
				user.watchList.push(stock._id);
				const result = await user.save();
			}
			user.password = undefined;
			res.send(user);
		} catch (error) {
			if (isMongoError(error)) {
				res.status(500).send("Internal server error");
			} else {
				res.status(400).send("Bad request");
			}
		}
	}
);

module.exports = router;
