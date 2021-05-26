const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;

const verifyCallback = (username, password, done) => {

    User.findOne({ $or: [{ username: username }, { email: username }] })
        .then((user) => {

            if (!user) { return done(null, false) }
            const isValid = validPassword(password, user.password);

            if (isValid) {
                console.log("I FOUND A MATCHING USERNAME")
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

