const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    hash: {
        type: String,
        default: '',
    },
    salt: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },

});


const User = connection.model('User', userSchema);

// Expose the connection
module.exports = connection;
