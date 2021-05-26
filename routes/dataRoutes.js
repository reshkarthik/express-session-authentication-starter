const router = require('express').Router();
const fs = require('fs');
const connection = require('../config/database');
const genPassword = require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;

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
        if (isAdmin === "true") {
            isAdmin = true;
        }
        else {
            isAdmin = false;
        }
        const id = parseInt(fs.readFileSync("id.txt", 'utf8'));
        const newUser = new User({
            id: id,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            isAdmin: isAdmin
        });
        fs.writeFileSync("id.txt", id + 1);
        newUser.save().then(res.redirect('/mydb'));
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot view users' });
    }

});


router.delete('/mydb/:id', function (req, res) {
    try {
        console.log(req.params);
        connection.collection('users').findOneAndDelete({ id: parseInt(req.params.id) });
        const id = parseInt(fs.readFileSync("id.txt", 'utf8'));
        fs.writeFileSync("id.txt", id - 1);
        res.send({ "msg": "has been deleted" })
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot view users' });
    }

});


router.put('/mydb/:id', function (req, res) {
    try {
        var pwd = req.body.password;
        if (validPassword("", pwd, true)) {
            pwd = genPassword(req.body.password);
        }
        var isAdmin = req.body.isAdmin;
        if (isAdmin === "true") {
            isAdmin = true;
        }
        else {
            isAdmin = false;
        }
        connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: pwd,
                isAdmin: isAdmin,
            }

        });
        res.send({ "msg": "done" });
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot update users' });
    }

});

router.patch('/mydb/:id', function (req, res) {
    try {
        if (req.body.username !== undefined) {
            connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
                $set: {
                    username: req.body.username
                }
            });
        }
        else if (req.body.email !== undefined) {
            connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
                $set: {
                    email: req.body.email
                }
            });
        }
        else if (req.body.password !== undefined) {
            connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
                $set: {
                    password: genPassword(req.body.password)
                }
            });
        }
        else if (req.body.isAdmin === "true") {
            connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
                $set: {
                    isAdmin: true,
                }
            });
        }
        else if (req.body.isAdmin !== undefined) {
            connection.collection('users').findOneAndUpdate({ id: parseInt(req.params.id) }, {
                $set: {
                    isAdmin: false,
                }
            });
        }
        res.send({ "msg": "done" });
    }
    catch (e) {
        console.log(e);
        res.send({ message: 'Error cannot update users' });
    }

});

module.exports = router;