// authentication helpers

const { User } = require('../../models/user');


const env = process.env.NODE_ENV;
const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON // option to turn on the test user.
const TEST_USER_ID = '624bb3452c379f9828a27347'; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_USERNAME = 'user';

module.exports = {
    // Middleware for authentication of resources
    authenticate: (req, res, next) => {
        if (env !== 'production' && USE_TEST_USER) {
            req.session.user = TEST_USER_ID;
            req.session.username = TEST_USER_USERNAME;
        }

        if (req.session.user) {
            User.findById(req.session.user).then((user) => {
                if (!user) {
                    return Promise.reject();
                } else {
                    req.user = user;
                    req.session.user = user._id;
                    req.session.username = user.username;
                    next();
                }
            }).catch((error) => {
                res.status(401).send("Unauthorized");
            })
        } else {
            console.log('here');
            res.status(401).send("Unauthorized");
        }
    },

    adminAuthenticate: async (req, res, next) => {
        if (env !== 'production' && USE_TEST_USER) {
            req.session.user = TEST_USER_ID;
            req.session.user = TEST_USER_USERNAME;
        }

        if (req.session.user) {
            const u = await User.findById(req.session.user);
            if (!u || !u.admin) {
                res.status(401).send('Unauthorized');
            } else {
                next();
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    },
    
    // Our own express middleware to check for 
    // an active user on the session cookie (indicating a logged in user.)
    sessionChecker: (req, res, next) => {
        if (req.session.user) {
            res.redirect('/dashboard'); // redirect to dashboard if logged in.
        } else {
            next(); // next() moves on to the route.
        }
    }
}
