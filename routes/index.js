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

router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: true
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
});


/**
* -------------- GET ROUTES ----------------
*/

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    res.sendFile('login.html', { root: '/Users/reshmakarthik/Desktop/express-session-authentication-starter/' });

});

router.get('/', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/users', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route.');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;