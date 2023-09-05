/* server.js for react-express-authentication */
"use strict";

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV; // read the environment variable (will be 'production' in production mode)

const log = console.log;
const path = require("path");

const express = require("express");
// starting the express server
const app = express();
// enable CORS if in development, for React local development server to connect to the web server.
const cors = require("cors");
var corsOptions = {
	origin: "*",
	credentials: true,
};
if (env !== "production") {
	app.use(cors(corsOptions));
}

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
// mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");
const { Stock } = require("./models/stock");
const { Game } = require("./models/game");
const { GameWord } = require("./models/gameWord");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to store session information on the database in production

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
	session({
		secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
		resave: true,
		saveUninitialized: false,
		cookie: {
			expires: 3600000,
			httpOnly: true,
		},
		// store the sessions on the database in production
		store:
			env === "production"
				? MongoStore.create({
						mongoUrl:
							process.env.MONGODB_URI ||
							"mongodb://localhost:27017/BetterStocksAPI",
				  })
				: null,
	})
);

// API ROUTES
app.use(require("./routes/users"));
app.use(require("./routes/stocks"));
app.use(require("./routes/game"));
app.use(require("./routes/gameWords"));
app.use(require("./routes/paperTrade"));
app.use(require("./routes/admin"));

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
	// check for page routes that we expect in the frontend to provide correct status code.
	const goodPageRoutes = [
		"/",
		"/signup",
		"/stocklisting",
		"/paper-trade",
		"/game",
		"/profile",
		"/admin",
		"/profile-edit",
	];
	if (!goodPageRoutes.includes(req.url)) {
		// if url not in expected page routes, set status to 404.
		res.status(404);
	}

	// send index.html
	res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/***** Prepare stock data retrieval timer *******/

const updateStocks = require("./stockUpdate/stockUpdate");

console.log("UPDATING STOCKS!");
updateStocks();

const minutes = 30;
setInterval(() => {
	console.log("UPDATING STOCKS!");
	updateStocks();
}, minutes * 60 * 1000);

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});
