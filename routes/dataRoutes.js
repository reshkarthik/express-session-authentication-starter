const router = require('express').Router();
const connection = require('../config/database');
const genPassword = require('../lib/passwordUtils').genPassword;

const User = connection.models.User;

router.get('/mydb', function (req, res) {
    connection.collection('users').find({}).toArray(function (err, docs) {
        res.send(docs);
    });
});

router.post('/mydb', function (req, res) {
    try {
        const hash = genPassword(req.body.password);
        var isAdmin = req.body.isAdmin;
        if (isAdmin === undefined) {
            isAdmin = false;
        }
        else {
            if (isAdmin === "true") {
                isAdmin = true;
            }
            else {
                isAdmin = false;
            }
        }
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            isAdmin: isAdmin
        });
        console.log("ADMIN IS " + isAdmin + " username " + req.body.username + " password " + req.body.password);
        newUser.save().then(res.redirect('/mydb'));
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot view users' });
    }

});


router.delete('/mydb', function (req, res) {
    try {
        console.log(req.body);
        connection.collection('users').findOneAndDelete({ username: req.body.username, email: req.body.email });
        // res.redirect('/mydb');
        res.send({ "msg": "has been deleted" })
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot view users' });
    }

});


router.put('/mydb/:id', function (req, res) {
    try {
        console.log(req.params);
        // connection.collection('users').findOneAndDelete({ username: req.body.username, email: req.body.email });
        // res.redirect('/mydb');
        res.send({ "msg": "has been updated" })
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot view users' });
    }

});

module.exports = router;