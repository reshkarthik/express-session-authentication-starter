const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));


/**
* -------------- GET ROUTES ----------------
*/

router.get('/login', (req, res, next) => {
    res.sendFile('login.html', { root: '/Users/reshmakarthik/Desktop/express-session-authentication-starter/' });

});

router.get('/', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/check', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route');
});

router.get('/users', (req, res, next) => {
    res.sendFile('users.html', { root: '/Users/reshmakarthik/Desktop/express-session-authentication-starter/' });
});
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;