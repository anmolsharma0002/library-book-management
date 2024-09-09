var express = require('express');
var router = express.Router();

var auth = require('./routes/auth');
var user = require('./routes/user');
var book = require('./routes/book');

/** -- Client Routes --- */
router.use('/auth', auth);
router.use('/user', user);
router.use('/book', book);

module.exports = router;